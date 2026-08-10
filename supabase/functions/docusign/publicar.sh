#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════════
#  MAGIWAY — publicar a função do DocuSign
#  ───────────────────────────────────────────────────────────────────
#  Roda tudo o que dá para automatizar: instala a CLI se faltar, faz
#  login, pede os segredos um a um, publica a função e testa.
#
#  Uso:   bash supabase/functions/docusign/publicar.sh
#
#  O que ele NÃO faz (e nem poderia): criar o app no DocuSign e gerar a
#  chave RSA. Isso é na tela do DocuSign, e está no LEIA-ME.md ao lado.
# ═══════════════════════════════════════════════════════════════════
set -euo pipefail

azul(){ printf '\033[1;36m%s\033[0m\n' "$*"; }
ok(){   printf '\033[1;32m✓ %s\033[0m\n' "$*"; }
erro(){ printf '\033[1;31m✗ %s\033[0m\n' "$*" >&2; }
box(){  printf '\n\033[1;33m── %s ──\033[0m\n' "$*"; }

box "1/6 · Supabase CLI"
if ! command -v supabase >/dev/null 2>&1; then
  azul "Não achei a CLI. Instalando…"
  if command -v brew >/dev/null 2>&1; then
    brew install supabase/tap/supabase
  elif command -v npm >/dev/null 2>&1; then
    npm install -g supabase
  else
    erro "Instale a CLI do Supabase e rode de novo: https://supabase.com/docs/guides/cli"
    exit 1
  fi
fi
ok "CLI: $(supabase --version 2>/dev/null | head -1)"

box "2/6 · Login"
if ! supabase projects list >/dev/null 2>&1; then
  azul "Vai abrir o navegador para você entrar na sua conta Supabase."
  supabase login
fi
ok "logado"

box "3/6 · Projeto"
supabase projects list || true
read -r -p "Cole o Reference ID do projeto (a parte antes de .supabase.co): " REF
[ -n "$REF" ] || { erro "sem o reference id não dá para continuar"; exit 1; }

box "4/6 · Segredos"
echo "Cada um vem do LEIA-ME.md. Enter em branco mantém o que já estiver lá."
pedir(){          # pedir NOME "explicação" [padrao]
  local nome="$1" ajuda="$2" padrao="${3:-}"
  printf '\n\033[0;90m%s\033[0m\n' "$ajuda"
  if [ -n "$padrao" ]; then read -r -p "$nome [$padrao]: " v; v="${v:-$padrao}"
  else read -r -p "$nome: " v; fi
  [ -n "$v" ] && SEGREDOS+=("$nome=$v")
}
SEGREDOS=()
pedir DOCUSIGN_INTEGRATION_KEY "DocuSign → Settings → Apps and Keys → Integration Key"
pedir DOCUSIGN_USER_ID         "Na mesma tela: o User ID do usuário que assina pela API"
pedir DOCUSIGN_ACCOUNT_ID      "No topo da mesma tela: API Account ID"
pedir DOCUSIGN_TEMPLATE_ID     "Templates → CONTRATO DE LOCAÇÃO MAGIWAY → o GUID na barra de endereços"
pedir DOCUSIGN_ROLE            "Nome do papel do signatário no modelo" "Cliente"
pedir DOCUSIGN_BASE_URI        "Produção: https://na4.docusign.net" "https://na4.docusign.net"
pedir DOCUSIGN_OAUTH_HOST      "Produção: account.docusign.com" "account.docusign.com"
pedir RETORNO_URL              "Para onde o cliente volta depois de assinar" "https://teal-queijadas-4e99a8.netlify.app/"

echo
azul "ASSINATURA_SEGREDO — gerando uma frase aleatória para você (é só um segredo interno)."
SEG=$(head -c 48 /dev/urandom | base64 | tr -d '\n/+=' | head -c 48)
SEGREDOS+=("ASSINATURA_SEGREDO=$SEG")
ok "gerado"

echo
azul "Chave privada RSA (PKCS#8). Informe o CAMINHO do arquivo .pem."
azul "Se a sua começa com 'BEGIN RSA PRIVATE KEY', converta antes:"
azul "  openssl pkcs8 -topk8 -nocrypt -in chave.pem -out chave-pkcs8.pem"
read -r -p "Caminho do .pem: " PEM
[ -f "$PEM" ] || { erro "arquivo não encontrado: $PEM"; exit 1; }
grep -q "BEGIN PRIVATE KEY" "$PEM" || {
  erro "esse .pem não está em PKCS#8 (precisa começar com 'BEGIN PRIVATE KEY')"; exit 1; }
ok "chave lida"

azul "Gravando os segredos…"
supabase secrets set --project-ref "$REF" "${SEGREDOS[@]}"
supabase secrets set --project-ref "$REF" DOCUSIGN_PRIVATE_KEY="$(cat "$PEM")"
ok "segredos gravados"

box "5/6 · Publicar"
# --no-verify-jwt: o cliente abre o link de assinatura sem estar logado no app
supabase functions deploy docusign --project-ref "$REF" --no-verify-jwt
URL="https://$REF.supabase.co/functions/v1/docusign"
ok "publicada em $URL"

box "6/6 · Teste"
echo "→ ping"
curl -sS "$URL?ping" || true; echo
echo
echo "→ rótulos do modelo (é o que o app usa para consertar o mapeamento)"
curl -sS "$URL?rotulos=1" | head -c 1200 || true; echo
echo
if curl -sS "$URL?rotulos=1" | grep -q consent_required; then
  box "FALTA UM PASSO: autorização de primeira vez"
  echo "O DocuSign exige que o usuário autorize o app uma vez. Abra este endereço"
  echo "no navegador, LOGADO como o usuário do DOCUSIGN_USER_ID, e clique em aceitar:"
  echo
  IK=$(printf '%s\n' "${SEGREDOS[@]}" | grep '^DOCUSIGN_INTEGRATION_KEY=' | cut -d= -f2-)
  OH=$(printf '%s\n' "${SEGREDOS[@]}" | grep '^DOCUSIGN_OAUTH_HOST=' | cut -d= -f2-)
  echo "https://$OH/oauth/auth?response_type=code&scope=signature%20impersonation&client_id=$IK&redirect_uri=https://www.docusign.com"
  echo
  echo "Depois rode de novo:  curl \"$URL?rotulos=1\""
fi

box "Último passo, no app"
echo "1. Abra Configurações → DocuSign"
echo "2. Cole em 'API DocuSign — Edge Function do Supabase':"
echo
echo "   $URL"
echo
echo "3. Clique em SALVAR DOCUSIGN"
echo "4. Clique em 🔎 CONFERIR O QUE VAI PREENCHIDO → 🔄 LER OS RÓTULOS DO MODELO"
echo "5. Se aparecerem rótulos que não existem mais, clique em CORRIGIR O MAPEAMENTO"
echo
ok "pronto"
