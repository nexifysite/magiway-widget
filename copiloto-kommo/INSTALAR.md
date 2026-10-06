# Como instalar no MAGIWAY-AGENTE-KOMMO

## Antes de tudo: o que esta pasta é e o que ela não é

**Ela não é o seu projeto.** Eu nunca recebi o código do
`MAGIWAY-AGENTE-KOMMO` — chegaram aqui 5 arquivos (README, .gitignore,
package.json, package-lock.json e o .bat de início automático), e nem
esses continuam no servidor, que é apagado entre sessões.

O que está aqui são **20 módulos novos e os testes deles**. Não
substitua a sua pasta por esta: **copie `site\` e `testes\` para dentro
de `C:\Users\lucia\Downloads\MAGIWAY-AGENTE-KOMMO`**, deixando o que já
está lá. Nenhum arquivo aqui tem nome que colida com o que o README
descreve (`conhecimento.js`, `tabela-planilha.js`, `servidor.js`). Se o
Windows perguntar sobre substituir algum arquivo, **pare e me diga
qual** — significa que eu errei um nome.

Para eu entregar o projeto montado, com tudo ligado no seu motor:
compacte a pasta **sem `dados/`, sem `node_modules/` e sem
`transcritor/`** e me mande.

> `dados/` fica de fora porque tem conversa de cliente. Não precisa sair
> do seu computador para nada do que estou fazendo. As outras duas ficam
> de fora só pelo tamanho.

---

## Passo a passo

### 1. Copiar e rodar a bateria

```
cd C:\Users\lucia\Downloads\MAGIWAY-AGENTE-KOMMO
node testes\testar-tudo.js
```

Esperado: **373 asserções passaram, 0 falharam**. Se não der isso, não
siga — me mande o que apareceu. Nenhum teste usa rede, banco ou chave:
se falhar, é código, não ambiente.

### 2. Carregar na página, nesta ordem

A ordem importa: `parecido` usa `normalizar`, `ao-vivo` e `kpis` usam
`equipe`, e `reservas` usa `ciclo`.

```html
<script src="site/ciclo.js"></script>
<script src="site/equipe.js"></script>
<script src="site/portao.js"></script>
<script src="site/normalizar.js"></script>
<script src="site/parecido.js"></script>
<script src="site/classificar.js"></script>
<script src="site/buscar-historico.js"></script>
<script src="site/rotular.js"></script>
<script src="site/ao-vivo.js"></script>
<script src="site/avaliar-dia.js"></script>
<script src="site/kpis.js"></script>
<script src="site/reservas.js"></script>
<script src="site/venda-ganha.js"></script>
<script src="site/pacote-meta.js"></script>
<script src="site/midia.js"></script>
<script src="site/quando-retomar.js"></script>
<script src="site/chance-de-fechar.js"></script>
<script src="site/adaptador.js"></script>
<script src="site/kommo-api.js"></script>
<script src="site/bibliografia.js"></script>
```

> `kommo-api.js` é **o único arquivo com rede**. Para conectar, leia
> `CONECTAR.md` — em resumo: copie `config.exemplo.json` para
> `config.json`, ponha o subdomínio e o token, e rode `api.conferir()`.
> **Não mande o token para ninguém, inclusive para mim.**

> `bibliografia.js` tem 240 KB e está por último de propósito — é o
> único arquivo grande. No computador carrega num piscar; se o painel
> abrir no celular pela rede local, é ele que pesa.

### 3. Conferir o adaptador — faça isto primeiro

É a única peça que eu não pude testar, porque ela lê o **seu** banco. No
console do painel:

```js
MGW_ADAPTADOR.conferir(banco)
```

Devolve quantas conversas achou, quantas falas de cliente, quantos pares
pergunta→resposta, um exemplo de cada e um diagnóstico em português. Se
vier zero em algum lugar, o diagnóstico diz **qual das três funções
ajustar** — são três marcações `⚠ AJUSTAR` no `adaptador.js`.

**Se o painel vier vazio, é o adaptador.** Os outros dezoito estão
testados.

---

## O portão, primeiro de tudo

```js
if(!MGW_PORTAO.liberado()){
  var r = MGW_PORTAO.tentar(oQueODigitou);
  if(!r.ok) mostrar(r.aviso);          // "Senha incorreta."
  else if(!r.persistiu) mostrar(r.aviso); // anônima: vai pedir de novo
}
```

Proteja também o **carregamento de dados**, não só a troca de tela —
tranca que só esconde a tela deixa a requisição acontecer atrás dela:

```js
var carregar = MGW_PORTAO.protegido(carregarDoKommo,
  function(){ return mostrarTelaDeSenha(); });
```

⚠ Lembre: a senha está escrita no arquivo. É tranca de conveniência,
não segurança.

---

## Ligar cada tela

### Monitoramento ao vivo

```js
// no handler do SSE que o projeto já tem em /ao-vivo
fonte.onmessage = function(ev){
  eventos.push(JSON.parse(ev.data));
  desenhar(MGW_AOVIVO.painel(eventos));
};
```

Cada linha vem com `estado`, `cor`, `texto`, `aguardando`,
`maiorEspera`. **Mostre o texto como ele vem** — ele é que diz "sem
dado" em vez de "parado" quando não há evento. Se você escrever o texto
na tela por conta própria, essa distinção se perde.

O evento precisa ter: `{quem, quando, tipo, conversa, cliente}`. `tipo`
é `'enviou'`, `'abriu'`, `'recebeu'` ou `'moveu'`. **`recebeu` é
mensagem do cliente** e de propósito não conta como atividade do
vendedor.

### Avaliação do dia

```js
var r = MGW_AVALIAR.atualizar(estadoGuardado, conversasPorPessoa);
guardar(r.estado);          // { '2026-10-06': { '<id>': {...} } }

// na abertura do app, recuperar dia que ficou aberto
MGW_AVALIAR.diasEmAberto(estadoGuardado).forEach(function(d){
  var conv = buscarConversasDoDia(d);
  MGW_AVALIAR.atualizar(estadoGuardado, conv, fimDoDia(d));
});
```

Chame `atualizar` de hora em hora — antes das 23:30 ela grava parcial,
depois grava fechada, e **nunca mexe em dia já fechado**.

Na tela, mostre sempre `criteriosValendo` ao lado da nota. Nota 8,0 em
três critérios não é a mesma coisa que 8,0 em dez, e é esse número que
diz qual é.

### KPIs

```js
var recorte = MGW_CICLO_K.cicloAtual();     // ou diaDe / semanaDe / periodo
var k = MGW_KPIS.porPessoa(conversas, recorte);
mostrarCarimbo(MGW_KPIS.idadeDoCalculo(k.calculadoEm));  // "há 12 min"

if(MGW_KPIS.precisaRecalcular(ultimo)) recalcular();     // de hora em hora
MGW_KPIS.porHora(conversas, recorte);                    // o dia por hora
```

O número grande na tela é `primeiraRespostaMin` (mediana).
`primeiraRespostaMedia` existe para comparação — não troque os dois.

### Reservas

```js
var linhas = lerAbaDados();                 // o leitor que o projeto já tem
var d = MGW_RESERVAS.doCiclo(linhas);
var c = MGW_RESERVAS.conferir(linhas, null, { n:42, faturamento:201354.38 });
if(!c.bate) mostrarAlerta(c.porque);        // e NÃO publique
```

Os números do app de vendas em 06/10/2026, para conferir: **42 reservas
/ R$ 201.354,38** no ciclo corrente; **141 / R$ 668.581,43** no total
com histórico. Marque as linhas da aba FECHAMENTOS com `_src:'fech'` e
as arquivadas com `_arquivada:true` — sem isso a contagem divergirá do
app de vendas, e `conferir()` vai dizer exatamente isso.

### Venda ganha e o pacote do Meta

```js
var vendas = MGW_VENDA.lerTodas(leadsGanhos);
MGW_VENDA.porCampanha(leadsGanhos);        // ranking pelo link do anúncio
MGW_VENDA.oQueFalta(leadsGanhos);          // ← o entregável que você pediu

var p = MGW_META.pacote(vendas);
mostrar(p.json);                            // para copiar
botaoEnviar.onclick = function(){ seuEnvio(p.corpo); };   // só no clique
```

**Rode `oQueFalta()` antes de pedir qualquer ajuste ao Kommo.** Se um
campo vier vazio em *todas* as vendas, quase sempre é o nome do campo
neste arquivo que está errado, não o campo que falta na sua conta — e o
diagnóstico diz isso com essas palavras.

### Banco de mídia

```js
var cat = MGW_MIDIA.catalogo(itens);
MGW_MIDIA.buscar(cat, 'cadeirinha');
var e = MGW_MIDIA.preparar(item, { telefone:'5511...' });
if(e.pronto) botao.onclick = function(){ salesbot(e.envio); };
MGW_MIDIA.registrarUso(cat, item.id);      // só se o envio deu certo
```

Mostre `cat.recusados` em algum canto. Item recusado não aparece na
busca — e isso é melhor do que aparecer e falhar no envio sem explicar.

### Fundamento, fila e retomada

```js
var r = MGW_CLASSIFICAR.classificar(fala, REGRAS);   // {tipo, porque, outros}
MGW_BIBLIOGRAFIA.fundamento(r.tipo);                 // módulo + situações
MGW_BIBLIOGRAFIA.falasPara(r.tipo);                  // falas prontas

var indice = MGW_BUSCAR.indexar(MGW_ADAPTADOR.paresPerguntaResposta(banco));
MGW_BUSCAR.sugerir(indice, fala);                    // quando não reconhece

var a = MGW_CHANCE.avaliar(encerradas);
if(a.serve) MGW_CHANCE.pontuar(a.modelo, sinaisDoLead);
else mostrar(a.porque);                              // não invente nota

var q = MGW_QUANDO.analisar(retomadasEnviadas);
if(!q.bastaDado) mostrar(q.porque);                  // mantenha as 12 h
```

Monte o índice ao abrir e refaça a cada hora: indexar 5 mil pares leva
menos de um segundo.

---

## Cinco coisas para não fazer

**Não monte a lista de pessoas a partir dos dados.** Era o que fazia a
Janes sumir. Use `MGW_EQUIPE.linhas()` sempre. Se alguém novo entrar no
Kommo, acrescente em `equipe.js` — a linha extra marcada como "não
cadastrado" é o aviso, não a solução.

**Não escreva o texto do estado por conta própria.** `ao-vivo` devolve
"sem dado" em vez de "parado" quando não há evento, e essa diferença é
a única coisa que impede o painel de acusar alguém que estava de folga.

**Não mostre nota sem calibração.** `MGW_CHANCE.pontuar` devolve `nota`
(log-odds), que serve para **ordenar a fila**, não para dizer "72% de
chance". A porcentagem da tela é `faixa.taxa` — a taxa que realmente
aconteceu, medida em dado que o modelo não viu.

**Não passe para `chance-de-fechar` nada que só existe depois do fim.**
"Contrato enviado", "pagamento feito" fazem o acerto ir a 99% e a nota
não prever nada. `treinar()` devolve esses em `suspeitas`. A pergunta
para cada campo: **isto eu sei no momento em que quero a nota?**

**Não publique o dash de reservas sem `conferir()` passar.** Dois
painéis com totais diferentes para o mesmo mês é pior do que um painel a
menos: ninguém sabe em qual acreditar e os dois perdem o uso.

---

## O que ainda falta, e por que

Está tudo em `ORDEM-DO-PAINEL.md`, com a lista de conferência no fim. Em
resumo, o que falta é **só a costura com o seu código** — não há lógica
pendente:

| Tela | Aqui | No seu projeto |
|---|---|---|
| Monitoramento ao vivo | a derivação do estado | o SSE de `/ao-vivo` |
| Avaliação do dia | a régua e o fechamento | onde guardar o estado |
| KPIs | as contas e os recortes | de onde vêm as conversas |
| Reservas | o ciclo e a conferência | o leitor da aba ⚙️ DADOS |
| Venda ganha | a leitura e o ranking | a chamada à API do Kommo |
| Meta | o pacote com hash | o envio, no clique |
| Mídia | catálogo e busca | o upload e o Salesbot |

| Kommo | o cliente com fila de 6 req/s | o token, no `config.json` |

Os 20 módulos são a parte que **não** dependia do seu código, e é por
isso que vieram primeiro. Me mande o zip (**sem `dados/`,
`node_modules/` e `transcritor/`**) e eu costuro. O token não precisa
vir — e não deve.
