/* ═══════════════════════════════════════════════════════════════════
   MAGIWAY — Edge Function do DocuSign
   ───────────────────────────────────────────────────────────────────
   Por que existe: o link do PowerForm carrega os 43 campos da reserva
   dentro da própria URL e chega a 1722 caracteres — 84% do limite
   clássico de query string (2048). Um cliente com nome longo ou quatro
   condutores adicionais pode estourar, e a falha não avisa: o link
   simplesmente não abre.

   Aqui os dados viajam no CORPO de um POST. O envelope é criado pela
   API do DocuSign, já preenchido, e o que vai para o WhatsApp é um
   link curto (~100 caracteres) que aponta de volta para esta função.

   Dois caminhos:
     POST /docusign  → cria o envelope e devolve { url }
     GET  /docusign?e=<envelopeId>&c=<clientUserId>&s=<assinatura>
                     → gera uma sessão nova de assinatura e redireciona
     GET  /docusign?rotulos=1
                     → devolve os Data Labels de verdade do modelo, para
                       o app consertar o mapeamento sozinho
     GET  /docusign?ping
                     → só responde que está de pé

   O GET existe porque a URL de assinatura do DocuSign expira em poucos
   minutos e só serve uma vez — não dá para mandar no WhatsApp. A cada
   clique esta função pede uma sessão nova. O parâmetro `s` é um HMAC:
   sem ele ninguém abre envelope alheio trocando o id na mão.

   ── SEGREDOS (Supabase → Edge Functions → Secrets) ──
     DOCUSIGN_INTEGRATION_KEY   Integration Key (Client ID) do app
     DOCUSIGN_USER_ID           GUID do usuário que assina pela API
     DOCUSIGN_ACCOUNT_ID        API Account ID
     DOCUSIGN_PRIVATE_KEY       chave RSA privada (PKCS#8, com as linhas
                                -----BEGIN PRIVATE KEY----- ...)
     DOCUSIGN_TEMPLATE_ID       ID do modelo CONTRATO DE LOCAÇÃO MAGIWAY
     DOCUSIGN_BASE_URI          https://na4.docusign.net  (produção)
                                https://demo.docusign.net (sandbox)
     DOCUSIGN_OAUTH_HOST        account.docusign.com   (produção)
                                account-d.docusign.com (sandbox)
     DOCUSIGN_ROLE              Cliente   (nome do papel no modelo)
     ASSINATURA_SEGREDO         qualquer frase longa e aleatória
     RETORNO_URL                para onde o cliente volta após assinar
                                (ex.: https://SEU-APP.netlify.app)

   IMPORTANTE — consentimento: na primeira vez, o DocuSign exige que o
   usuário impersonado autorize o app. Se a função responder
   "consent_required", abra uma vez no navegador, logado como esse
   usuário:
     https://<OAUTH_HOST>/oauth/auth?response_type=code
       &scope=signature%20impersonation
       &client_id=<INTEGRATION_KEY>
       &redirect_uri=<a Redirect URI cadastrada no app>
   ═══════════════════════════════════════════════════════════════════ */

const env = (k: string, obrigatorio = true): string => {
  const v = Deno.env.get(k) ?? "";
  if (!v && obrigatorio) throw new Error(`segredo ausente: ${k}`);
  return v;
};

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
};

const json = (corpo: unknown, status = 200) =>
  new Response(JSON.stringify(corpo), {
    status,
    headers: { ...CORS, "Content-Type": "application/json" },
  });

/* ── HMAC: assina e confere o id do envelope no link ── */
async function hmac(texto: string): Promise<string> {
  const chave = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(env("ASSINATURA_SEGREDO")),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const mac = await crypto.subtle.sign("HMAC", chave, new TextEncoder().encode(texto));
  return [...new Uint8Array(mac)].map((b) => b.toString(16).padStart(2, "0")).join("").slice(0, 24);
}

/* ── JWT Grant: troca uma asserção assinada por um access token ── */
function pemParaBytes(pem: string): ArrayBuffer {
  const limpo = pem
    .replace(/-----BEGIN [A-Z ]+-----/g, "")
    .replace(/-----END [A-Z ]+-----/g, "")
    .replace(/\s+/g, "");
  const bin = atob(limpo);
  /* ArrayBuffer alocado na mão: importKey() exige BufferSource sobre
     ArrayBuffer, e um Uint8Array solto pode estar sobre SharedArrayBuffer. */
  const ab = new ArrayBuffer(bin.length);
  const buf = new Uint8Array(ab);
  for (let i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i);
  return ab;
}

const b64url = (dados: Uint8Array | string): string => {
  const bytes = typeof dados === "string" ? new TextEncoder().encode(dados) : dados;
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};

let tokenCache: { token: string; expira: number } | null = null;

async function accessToken(): Promise<string> {
  /* O token vale 1h. Guardamos até 5 min antes do fim para não pedir um
     novo a cada clique — a instância da função sobrevive entre chamadas. */
  if (tokenCache && Date.now() < tokenCache.expira - 5 * 60_000) return tokenCache.token;

  const oauthHost = env("DOCUSIGN_OAUTH_HOST");
  const agora = Math.floor(Date.now() / 1000);
  const cabecalho = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const corpo = b64url(JSON.stringify({
    iss: env("DOCUSIGN_INTEGRATION_KEY"),
    sub: env("DOCUSIGN_USER_ID"),
    aud: oauthHost,
    iat: agora,
    exp: agora + 3600,
    scope: "signature impersonation",
  }));

  const chave = await crypto.subtle.importKey(
    "pkcs8",
    pemParaBytes(env("DOCUSIGN_PRIVATE_KEY")),
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const assinatura = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    chave,
    new TextEncoder().encode(`${cabecalho}.${corpo}`),
  );
  const jwt = `${cabecalho}.${corpo}.${b64url(new Uint8Array(assinatura))}`;

  const r = await fetch(`https://${oauthHost}/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });
  const j = await r.json();
  if (!r.ok || !j.access_token) {
    /* consent_required é o erro de primeira vez — ver o cabeçalho deste arquivo */
    throw new Error(`DocuSign OAuth: ${j.error || r.status}${j.error === "consent_required" ? " (autorize o app uma vez no navegador — veja o comentário no topo da função)" : ""}`);
  }
  tokenCache = { token: j.access_token, expira: Date.now() + (j.expires_in ?? 3600) * 1000 };
  return tokenCache.token;
}

const api = () => `${env("DOCUSIGN_BASE_URI")}/restapi/v2.1/accounts/${env("DOCUSIGN_ACCOUNT_ID")}`;

/* ── POST: cria o envelope a partir do modelo, já preenchido ── */
async function criarEnvelope(body: any) {
  const signer = body?.signer ?? {};
  const nome = String(signer.name ?? "").trim();
  const email = String(signer.email ?? "").trim();
  if (!nome) return json({ error: "nome do cliente ausente" }, 400);
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return json({ error: "e-mail do cliente inválido" }, 400);

  /* Os campos chegam com as MESMAS etiquetas já usadas no PowerForm
     (Nome_Cliente, CPF_Cliente, …) — o modelo do DocuSign não muda. */
  const campos = (body?.campos ?? {}) as Record<string, string>;
  const mapa = body?.mapa as Array<{ rotulo: string; campo: string }> | undefined;
  const tabs: Array<{ tabLabel: string; value: string }> = [];
  if (Array.isArray(mapa)) {
    for (const m of mapa) {
      const v = campos[m.campo];
      if (v) tabs.push({ tabLabel: m.rotulo, value: String(v) });
    }
  } else {
    /* sem mapa explícito, manda tudo que tiver valor usando a própria chave */
    for (const [k, v] of Object.entries(campos)) if (v) tabs.push({ tabLabel: k, value: String(v) });
  }

  /* clientUserId marca o signatário como EMBUTIDO: o DocuSign não manda
     e-mail e a assinatura acontece pelo link que devolvemos. */
  const clientUserId = crypto.randomUUID();

  const envelope = {
    templateId: env("DOCUSIGN_TEMPLATE_ID"),
    status: "sent",
    templateRoles: [{
      roleName: env("DOCUSIGN_ROLE"),
      name: nome,
      email,
      clientUserId,
      tabs: { textTabs: tabs },
    }],
  };

  const r = await fetch(`${api()}/envelopes`, {
    method: "POST",
    headers: { Authorization: `Bearer ${await accessToken()}`, "Content-Type": "application/json" },
    body: JSON.stringify(envelope),
  });
  const j = await r.json();
  if (!r.ok || !j.envelopeId) {
    return json({ error: `DocuSign: ${j.message || j.errorCode || r.status}` }, 502);
  }

  /* O link curto aponta para esta própria função. A URL de assinatura do
     DocuSign expira em minutos — aqui geramos uma nova a cada clique. */
  const dados = `${j.envelopeId}|${clientUserId}|${email}`;
  const url = new URL(body?.__self ?? Deno.env.get("SUPABASE_URL") + "/functions/v1/docusign");
  url.searchParams.set("e", j.envelopeId);
  url.searchParams.set("c", clientUserId);
  url.searchParams.set("s", await hmac(dados));

  return json({ url: url.toString(), envelopeId: j.envelopeId, campos: tabs.length });
}

/* ── GET ?rotulos=1: os Data Labels DE VERDADE do modelo ──
   Existe por um motivo concreto: quando o modelo é reeditado no DocuSign
   ou o PDF é trocado, os campos são renomeados sozinhos (Text 12, Text
   13…) e TODO rótulo antigo deixa de existir. O app continua mandando os
   nomes velhos, o DocuSign descarta em silêncio, e o contrato chega em
   branco sem nenhuma mensagem de erro.

   Em vez de alguém abrir o modelo e copiar rótulo por rótulo na mão, o
   app pergunta aqui quais são os nomes atuais e conserta o mapeamento
   sozinho.

   Devolve também `travado` e `somenteLeitura`: campo bloqueado não recebe
   valor nem pela API, então é melhor o app dizer isso na cara do que
   deixar o campo sair vazio de novo.

   Não exige assinatura: o que sai daqui são NOMES DE CAMPO do modelo —
   não há dado de cliente nenhum nesta resposta. */
async function lerRotulos() {
  const token = await accessToken();
  const tid = env("DOCUSIGN_TEMPLATE_ID");
  const r = await fetch(`${api()}/templates/${tid}/recipients?include_tabs=true`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const j = await r.json();
  if (!r.ok) return json({ error: `DocuSign: ${j.message || j.errorCode || r.status}` }, 502);

  const achados: Array<Record<string, unknown>> = [];
  const varrer = (lista: any[], papel: string) => {
    for (const grupo of Object.keys(lista ?? {})) {
      const tabs = (lista as any)[grupo];
      if (!Array.isArray(tabs)) continue;
      for (const t of tabs) {
        const label = t?.tabLabel ?? "";
        if (!label) continue;
        achados.push({
          rotulo: label,
          tipo: grupo.replace(/Tabs$/, ""),           /* text, formula, date, … */
          papel,
          travado: t?.locked === "true" || t?.locked === true,
          somenteLeitura: t?.disableAutoSize === undefined ? false : (t?.editable === "false"),
          obrigatorio: t?.required === "true" || t?.required === true,
        });
      }
    }
  };
  for (const s of (j.signers ?? [])) varrer(s.tabs ?? {}, s.roleName ?? s.name ?? "");
  for (const s of (j.inPersonSigners ?? [])) varrer(s.tabs ?? {}, s.roleName ?? "");

  return json({
    ok: true,
    templateId: tid,
    papelEsperado: env("DOCUSIGN_ROLE", false) || "",
    total: achados.length,
    tabs: achados,
  });
}

/* ── GET: sessão nova de assinatura + redirecionamento ── */
async function abrirAssinatura(u: URL) {
  const envelopeId = u.searchParams.get("e") ?? "";
  const clientUserId = u.searchParams.get("c") ?? "";
  const assinatura = u.searchParams.get("s") ?? "";
  if (!envelopeId || !clientUserId || !assinatura) return json({ error: "link incompleto" }, 400);

  const token = await accessToken();

  /* Descobre o destinatário embutido do envelope (nome e e-mail) — precisamos
     deles para pedir a sessão, e conferir o HMAC contra o e-mail de verdade
     impede que alguém troque o id na mão. */
  const rr = await fetch(`${api()}/envelopes/${envelopeId}/recipients`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const rj = await rr.json();
  if (!rr.ok) return json({ error: `DocuSign: ${rj.message || rr.status}` }, 502);

  const signer = (rj.signers ?? []).find((s: any) => s.clientUserId === clientUserId);
  if (!signer) return json({ error: "link inválido" }, 403);

  const esperado = await hmac(`${envelopeId}|${clientUserId}|${signer.email}`);
  if (esperado !== assinatura) return json({ error: "link inválido" }, 403);

  const vr = await fetch(`${api()}/envelopes/${envelopeId}/views/recipient`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      returnUrl: env("RETORNO_URL", false) || "https://www.docusign.com",
      authenticationMethod: "none",
      clientUserId,
      userName: signer.name,
      email: signer.email,
    }),
  });
  const vj = await vr.json();
  if (!vr.ok || !vj.url) {
    /* envelope já assinado ou cancelado cai aqui */
    return json({ error: `DocuSign: ${vj.message || vj.errorCode || vr.status}` }, 502);
  }
  return new Response(null, { status: 302, headers: { ...CORS, Location: vj.url } });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  try {
    const u = new URL(req.url);
    if (req.method === "GET") {
      if (u.searchParams.get("ping") !== null) return json({ ok: true, servico: "docusign" });
      if (u.searchParams.get("rotulos") !== null) return await lerRotulos();
      return await abrirAssinatura(u);
    }
    if (req.method === "POST") {
      const body = await req.json().catch(() => ({}));
      body.__self = `${u.origin}${u.pathname}`;   /* o link curto aponta para cá */
      return await criarEnvelope(body);
    }
    return json({ error: "método não suportado" }, 405);
  } catch (e) {
    console.error("[docusign]", e);
    return json({ error: String((e as Error)?.message ?? e) }, 500);
  }
});
