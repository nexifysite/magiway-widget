# Link curto do DocuSign — instalação

O que isto resolve: o link do PowerForm carrega os 43 campos da reserva dentro
da própria URL e chega a **1722 caracteres** — 84% do limite clássico de query
string (2048). Um cliente com nome longo ou quatro condutores adicionais pode
estourar, e a falha não avisa: o link simplesmente não abre.

Com esta função, os dados viajam no corpo de um POST e o que vai para o WhatsApp
é um link de **~100 caracteres**.

**O modelo no DocuSign não muda.** A função usa as mesmas etiquetas que o
PowerForm já usa (`Nome_Cliente`, `CPF_Cliente`, …) — inclusive o `Data_Enterga`.

---

## 1. No DocuSign — criar o app de integração

**Settings → Apps and Keys → Add App and Integration Key**

Anote:

| Onde aparece | Guarde como |
|---|---|
| Integration Key | `DOCUSIGN_INTEGRATION_KEY` |
| User ID (na mesma tela, do usuário que vai assinar pela API) | `DOCUSIGN_USER_ID` |
| API Account ID (Settings → Apps and Keys, no topo) | `DOCUSIGN_ACCOUNT_ID` |

Ainda nessa tela:

1. Em **Authentication**, marque **Authorization Code Grant** e **JWT Grant**
2. Clique em **Generate RSA** — copie a **chave privada inteira**, com as linhas
   `-----BEGIN RSA PRIVATE KEY-----`. Ela só aparece uma vez.
3. Em **Redirect URIs**, adicione: `https://www.docusign.com`

> Se a chave vier como `BEGIN RSA PRIVATE KEY` (formato PKCS#1), converta:
> `openssl pkcs8 -topk8 -nocrypt -in chave.pem -out chave-pkcs8.pem`
> A função espera PKCS#8 (`BEGIN PRIVATE KEY`).

Pegue também o **ID do modelo** do contrato:
**Templates → CONTRATO DE LOCAÇÃO MAGIWAY → o GUID na barra de endereços** →
`DOCUSIGN_TEMPLATE_ID`

## 2. Autorizar o app uma vez

O JWT só funciona depois que o usuário autoriza o app. Abra **uma vez** no
navegador, logado como esse usuário, trocando `SUA_INTEGRATION_KEY`:

```
https://account.docusign.com/oauth/auth?response_type=code&scope=signature%20impersonation&client_id=SUA_INTEGRATION_KEY&redirect_uri=https://www.docusign.com
```

Clique em **Allow**. Se estiver em sandbox, troque `account.docusign.com` por
`account-d.docusign.com`.

Pulou este passo? A função responde `consent_required`.

## 3. No Supabase — segredos

**Edge Functions → Secrets** (ou `supabase secrets set NOME=valor`):

```
DOCUSIGN_INTEGRATION_KEY   a Integration Key
DOCUSIGN_USER_ID           o User ID (GUID)
DOCUSIGN_ACCOUNT_ID        o API Account ID
DOCUSIGN_PRIVATE_KEY       a chave privada inteira, com as linhas BEGIN/END
DOCUSIGN_TEMPLATE_ID       o GUID do modelo do contrato
DOCUSIGN_BASE_URI          https://na4.docusign.net
DOCUSIGN_OAUTH_HOST        account.docusign.com
DOCUSIGN_ROLE              Cliente
ASSINATURA_SEGREDO         qualquer frase longa e aleatória, inventada por você
RETORNO_URL                https://SEU-APP.netlify.app
```

Em sandbox: `DOCUSIGN_BASE_URI=https://demo.docusign.net` e
`DOCUSIGN_OAUTH_HOST=account-d.docusign.com`.

`ASSINATURA_SEGREDO` é o que impede alguém de abrir envelope de outro cliente
trocando o id na mão. Invente uma frase longa e não conte para ninguém.

## 4. Publicar

```
supabase functions deploy docusign --no-verify-jwt
```

`--no-verify-jwt` é necessário: quem clica no link é o cliente, que não tem
login no Supabase.

Teste se subiu:

```
curl "https://SEU-PROJETO.supabase.co/functions/v1/docusign?ping"
```

Deve responder `{"ok":true,"servico":"docusign"}`.

## 5. No app

**Configurações → DocuSign → API DocuSign (Edge Function do Supabase)**

Cole: `https://SEU-PROJETO.supabase.co/functions/v1/docusign`

Salve. Pronto — o app passa a usar a função. **Deixando esse campo vazio, ele
volta ao PowerForm de sempre**, então dá para testar sem risco: se algo não
funcionar, apague o campo e tudo volta ao que era.

---

## Como fica no dia a dia

Nada muda para quem emite. O botão é o mesmo. A diferença é o link que sai:

| | Antes | Depois |
|---|---|---|
| Tamanho | até 1722 caracteres | ~100 |
| Dados | na URL, à vista | no corpo do POST |
| Preenchimento | o DocuSign lê da URL | o envelope já nasce preenchido |

O cliente clica, a função gera uma sessão nova de assinatura e redireciona.
Vale quantas vezes ele clicar, até assinar — a sessão do DocuSign expira em
minutos, por isso a função gera uma nova a cada clique em vez de mandar a
sessão no link.

## O jeito rápido: um script faz quase tudo

```bash
bash supabase/functions/docusign/publicar.sh
```

Ele instala a CLI se faltar, faz login, pede cada segredo explicando de onde
vem, gera o `ASSINATURA_SEGREDO` sozinho, publica a função, testa o `ping` e os
rótulos, e — se cair em `consent_required` — monta o endereço de autorização já
pronto para você abrir.

O que ele não faz, porque é na tela do DocuSign: criar o app de integração e
gerar a chave RSA. Isso é o passo 1 acima.

---

## Por que chegava em branco — resolvido em 10/08/2026

O script antigo da planilha (Apps Script) preenchia o contrato certo por meses.
Comparando o que ele mandava com o que o app mandava, a diferença apareceu na
primeira linha:

```
script (funcionava)   &Cliente_NomeCliente=…  &Cliente_CpfCliente=…  &Cliente_ValorTotal=…
app    (em branco)    &Nome_Cliente=…         &CPF_Cliente=…         &Valor_Moeda=…
```

Todo rótulo do script começa com o nome do **papel** do signatário. É a
convenção do PowerForm para preencher campo de documento:
`<Papel>_<DataLabel>`. Sem o prefixo o DocuSign trata como parâmetro
desconhecido e descarta — sem erro, sem aviso.

E é isso que explicava o sintoma exato: **nome e e-mail chegavam, o resto não.**
Os dois únicos que funcionavam já nascem prefixados por construção —
`Cliente_UserName` e `Cliente_Email`.

O app passou a usar o conjunto do script. As catorze linhas que o script
mandava estão lá letra por letra; os campos que ele não tinha (condutores
adicionais, CNH, horários, voo) seguem a mesma convenção, mas são plausíveis e
não comprovados — o botão de ler os rótulos confirma contra o modelo.

Se o modelo reeditado usar os rótulos **sem** prefixo, há um botão que troca de
volta num clique. E, quando cabe na URL (teto de 1700 caracteres), o app manda
**as duas formas de uma vez** — parâmetro que o DocuSign não conhece ele ignora,
então mandar os dois não custa nada além de tamanho. O script fazia isso com o
CPF, que ia como `Cliente_CpfCliente` e como `Cpf_Cliente`.

Valores passam pela mesma limpeza do script: `<`, `>` e `&` são removidos.

## Consertar o contrato que chega em branco

O sintoma clássico: o PDF gerado no app sai preenchido e o mesmo contrato
aberto pelo link do DocuSign chega vazio, **menos** o nome e o e-mail.

A causa quase sempre é a mesma: quando o modelo é reeditado ou o PDF trocado,
o DocuSign renomeia os campos sozinho (`Text 12`, `Text 13`…) e todo Data Label
antigo deixa de existir. O app continua mandando os nomes velhos, e o DocuSign
descarta valor de rótulo desconhecido **em silêncio** — sem erro nenhum. Nome e
e-mail sobrevivem porque não dependem de Data Label: são `Cliente_UserName` e
`Cliente_Email`, do próprio PowerForm.

Com a função publicada, o app resolve isso sozinho:

1. **Configurações → DocuSign → 🔎 CONFERIR O QUE VAI PREENCHIDO**
2. **🔄 LER OS RÓTULOS DO MODELO** — a função pergunta ao DocuSign quais são os
   nomes de verdade (`GET ?rotulos=1`)
3. A tela mostra quantos batem, quantos dá para ligar e **quantos o app manda e
   não existem mais**
4. **✅ CORRIGIR O MAPEAMENTO PELO MODELO** — reescreve tudo, casando por
   significado (`CPF do Cliente`, `CPF_Cliente` e `CPFCli` caem todos em `cpf`)

Campo **travado**, **só-leitura** ou de **fórmula** é descartado do mapeamento e
listado à parte: ele não recebe valor por caminho nenhum — nem PowerForm, nem
API. Se você precisa que venha preenchido, destrave no DocuSign.

Depois de corrigir, o mapeamento fica **travado** (`gs_ds_mapa_travado`) e
nenhuma migração do app reaplica o mapeamento de fábrica por cima.

## Se der errado

| Resposta | O que é |
|---|---|
| `consent_required` | falta o passo 2 |
| `DocuSign OAuth: invalid_grant` | chave privada errada, ou `USER_ID`/`INTEGRATION_KEY` trocados |
| `DocuSign: Template not found` | `DOCUSIGN_TEMPLATE_ID` errado, ou modelo em outra conta |
| `DocuSign: ... role ...` | `DOCUSIGN_ROLE` não bate com o papel do modelo (é `Cliente`) |
| `link inválido` | `ASSINATURA_SEGREDO` mudou depois que o link foi gerado |
| o app avisa que a função falhou | ele já caiu no PowerForm sozinho — ninguém fica sem assinar |
| `?rotulos=1` devolve tabs vazias | o modelo não tem campos com Data Label, ou estão em outro papel que não o `DOCUSIGN_ROLE` |

## O que foi testado aqui e o que não foi

**Testado:** tipos conferidos com `deno check`; a função sobe e responde;
validações de nome, e-mail, link incompleto e método errado; e a assinatura
JWT com uma chave RSA de verdade, conferida por fora com `openssl dgst -verify`
(`Verified OK`).

**Não testado:** as chamadas à API do DocuSign — criar envelope, ler os rótulos
do modelo e gerar a sessão de assinatura. Isso exige as credenciais reais e
acesso à rede do DocuSign, que não existem no ambiente onde a função foi
escrita. **Teste com uma reserva de mentira antes de usar com cliente de
verdade.**

O lado do app foi testado: o de-para, a leitura dos rótulos, o descarte de campo
travado e de fórmula, e a trava contra a migração foram exercitados com uma
função simulada devolvendo um modelo reeditado (metade dos rótulos virada em
`Text N`). 17 asserções, todas passando.
