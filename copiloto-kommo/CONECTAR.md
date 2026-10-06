# Conectar ao Kommo — o que está pronto e o que depende de você

## Por que eu não conectei daqui

Você pediu para eu já conectar direto. Tentei, e são dois impedimentos
reais — nenhum deles é falta de código:

**1. A rede deste contêiner bloqueia o Kommo.** Não é suposição, é
teste: o gateway respondeu **403 ao CONNECT para `www.kommo.com:443`**.
Nem a documentação eu consigo abrir daqui. Isso é a política de rede do
ambiente de execução, configurada quando o ambiente foi criado — se você
quiser mudar, é em Configurações do ambiente no Claude Code na web.

**2. Conectar exige o seu token, e eu não devo tê-lo.** Um token do
Kommo dá acesso a **toda a sua base de clientes**: ler, alterar e
apagar. Mandar ele numa conversa é o mesmo erro da chave privada que já
vazou aqui — e essa, lembre, ainda precisa ser revogada. Token de CRM
não se cola em chat, nem para mim.

Então fiz o que resolve de verdade: **escrevi a conexão completa**. Ela
funciona no momento em que você puser o subdomínio e o token no
`config.json`, no seu computador, onde a rede alcança o Kommo e o token
não passa por ninguém.

---

## A trava que mais importa: 6 requisições por segundo

O Kommo permite **7 req/s**. Ao exceder, devolve 429. E **se o excesso
se repetir, a conta é bloqueada e passa a devolver 403 em tudo** — não
só na API: a integração inteira para de funcionar.

É por isso que `kommo-api.js` tem uma fila em vez de chamar a rede
direto:

- toda chamada passa por uma fila a **6 req/s** (margem de propósito);
- 429 → espera 2 s, 4 s, 8 s e tenta de novo, no máximo 3 vezes;
- 429 repetido → **para tudo** e devolve erro gritando, em vez de
  continuar martelando;
- 403 → trata como possível bloqueio e manda parar, não insistir;
- paginação sempre **em série**, nunca em paralelo.

**Consequência de projeto, não detalhe:** um painel "em tempo real" que
faz polling de 1 segundo por pessoa estoura esse limite numa manhã e
derruba o seu CRM. O monitoramento ao vivo tem que vir do **SSE do seu
servidor** (que recebe webhook do Kommo), e as métricas de **hora em
hora** — que é exatamente o que você pediu desde o começo.

Está testado: `testar-kommo.js` mede os intervalos da fila, força três
429 seguidos e confere que o cliente para em vez de insistir.

---

## Passo a passo, no seu computador

### 1. Gerar o token

No Kommo: **Configurações → Integrações → criar integração → token de
longa duração**. Copie.

### 2. Preencher o config

Copie `config.exemplo.json` para `config.json` e preencha:

```json
{
  "subdominio": "magiway",
  "token": "o token que você acabou de gerar",
  "rps": 6,
  "maxPaginas": 10
}
```

`config.json` já está no `.gitignore` deste pacote. **Confira que o
`.gitignore` do seu projeto também o ignora** antes do primeiro commit —
token em repositório é a forma mais comum de vazamento.

Se o seu Kommo abre em `magiway.kommo.com`, o subdomínio é `magiway` e
mais nada.

### 3. Conferir a conexão — faça isto antes de qualquer tela

```js
var cfg = require('./config.json');
var api = MGW_KOMMO.criar(cfg);

api.conferir().then(function(r){ console.log(r.porque); });
```

Duas requisições, não mais. O que ele responde:

| Resultado | O que significa |
|---|---|
| `ok: true` | Conectou. Mostra o nome da conta e quantos usuários. |
| 401 | Token inválido ou expirado. Gere outro. |
| 402 | Assinatura do Kommo vencida. Nenhum código resolve. |
| 403 | Escopo insuficiente **ou a conta foi bloqueada**. Se tudo passou a dar 403 de repente, é bloqueio: pare por algumas horas. |
| 404 | Subdomínio errado. Ele mostra o endereço que montou. |

E ele faz uma coisa a mais, que você vai querer na primeira vez: **casa
os usuários do Kommo com o `equipe.js`** e diz os dois lados do
desencontro — quem está no Kommo e não está cadastrado (a atividade cai
numa linha "não cadastrado"), e quem está cadastrado sem conta no Kommo
(a linha aparece sempre como "sem dado").

### 4. Descobrir os tipos de nota — em vez de eu adivinhar

O tipo de nota que carrega a mensagem de WhatsApp **muda conforme a
integração instalada na conta**. Eu não cravei um nome, porque um nome
errado faria o painel ler zero mensagens sem erro nenhum aparecer.

```js
api.descobrirTiposDeNota().then(function(r){
  console.log(r.tipos);   // [{tipo, n, exemplo}, ...]
  console.log(r.porque);
});
```

Ele lê uma amostra da sua conta e diz quais tipos existem de fato, com
um exemplo de texto de cada. Os que tiverem conversa, você cola em
`tiposDeMensagem` no `config.json`. Aí sim o painel lê as mensagens
certas.

---

## O que puxar, e para onde vai

```js
// equipe: confere contra equipe.js
api.usuarios()

// monitoramento: eventos do dia → ao-vivo.js
api.eventos(inicioDoDia, agora).then(function(evs){
  var painel = MGW_AOVIVO.painel(MGW_KOMMO.paraEventos(evs));
});

// avaliação e KPIs: lead + notas → conversa
api.notasDoLead(id).then(function(notas){
  var conv = MGW_KOMMO.paraConversa(lead, notas, {
    tiposDeMensagem: cfg.tiposDeMensagem });
});

// venda ganha → rastreio, ranking e o que falta
api.ganhas(de, ate).then(function(leads){
  var vs = MGW_KOMMO.paraLeads(leads);
  MGW_VENDA.oQueFalta(vs);        // ← o entregável que você pediu
  MGW_VENDA.porCampanha(vs);      // ranking pelo link do anúncio
  var p = MGW_META.pacote(MGW_VENDA.lerTodas(vs));
  // p.corpo está montado. Nada é enviado: o envio é o seu clique.
});

// chance de fechar: precisa de ganhas E perdidas
api.encerradas(de, ate).then(function(leads){
  var a = MGW_CHANCE.avaliar(montarSinais(MGW_KOMMO.paraLeads(leads)));
  if(!a.serve) console.log(a.porque);   // e não mostre nota
});
```

`ganhas()` filtra pelo status **142** e `encerradas()` por **142 e
143** — ganho e perda, que são os status padrão de todo funil do Kommo.

> Treinar a chance de fechar só com as ganhas ensina o modelo que tudo
> fecha. É por isso que existe `encerradas()` separada de `ganhas()`.

---

## Onde o Kommo não chega, e o que fazer

**Monitoramento ao vivo não pode sair de polling.** Com 4 pessoas e
polling de 5 segundos são 48 req/min — dentro do limite hoje, mas o
limite é por conta, e qualquer outra integração sua soma no mesmo
balde. O caminho certo é o webhook do Kommo chegando no seu servidor, e
o servidor empurrando por SSE para o painel. Os módulos já trabalham
assim: `MGW_AOVIVO.painel()` recebe a lista de eventos, não importa se
ela veio de webhook ou de `api.eventos()`.

**Histórico longo não cabe em requisição de tela.** `maxPaginas: 10` dá
2.500 registros. Para treinar a chance de fechar você quer meses de
encerradas — isso é trabalho de rotina noturna gravando em arquivo, não
de clique. `paginar()` avisa quando truncou (`_truncou`) justamente para
a tela não mentir que mostrou tudo.

**O que o Kommo não entrega não dá para eu adivinhar.** É o que
`MGW_VENDA.oQueFalta()` responde com o seu dado real. Rode ele antes de
pedir qualquer ajuste ao suporte: se um campo vier vazio em **todas** as
vendas, quase sempre é o nome do campo no `venda-ganha.js` que está
errado, não o campo que falta na sua conta.

---

## Resumo honesto

| | Estado |
|---|---|
| Cliente HTTP com fila, recuo e parada | **pronto, 68 asserções** |
| Diagnóstico de 401/402/403/404 | **pronto** |
| Paginação em série com aviso de truncagem | **pronto** |
| Tradução Kommo → os 19 módulos | **pronto** |
| Descoberta dos tipos de nota | **pronto** |
| Conectar de fato | **depende do seu token, no seu computador** |
| Webhook + SSE para o ao vivo | **depende do seu `servidor.js`** |

Me mande o zip do projeto (**sem `dados/`, `node_modules/` e
`transcritor/`**) e eu costuro isto no seu `servidor.js` e no painel. O
token não precisa vir — e não deve.
