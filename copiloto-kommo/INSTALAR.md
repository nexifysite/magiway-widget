# Como instalar no MAGIWAY-AGENTE-KOMMO

## Antes de tudo: o que esta pasta é e o que ela não é

**Ela não é o seu projeto.** Eu nunca recebi o código do
`MAGIWAY-AGENTE-KOMMO` — chegaram aqui 5 arquivos (README, .gitignore,
package.json, package-lock.json e o .bat de início automático), e nem
esses continuam no servidor, que é apagado entre sessões. O que está
aqui são **os 10 módulos novos e os testes deles**, para você copiar
para dentro do seu projeto.

Então: não substitua a sua pasta por esta. **Copie as duas pastas
`site/` e `testes/` para dentro de
`C:\Users\lucia\Downloads\MAGIWAY-AGENTE-KOMMO`**, deixando o que já
está lá. Nenhum arquivo aqui tem nome que colida com o que o README
descreve (`conhecimento.js`, `tabela-planilha.js`, `servidor.js`), então
a cópia não sobrescreve nada seu. Se o Windows perguntar sobre
substituir algum arquivo, **pare e me diga qual** — significa que eu
errei um nome.

Para eu entregar o projeto inteiro montado, com os módulos já ligados no
seu motor: compacte a pasta **sem `dados/`, sem `node_modules/` e sem
`transcritor/`** e me mande.

> `dados/` fica de fora porque tem conversa de cliente. Não precisa sair
> do seu computador para nada do que estou fazendo, e eu não quero isso
> aqui. As outras duas ficam de fora só pelo tamanho.

---

## Passo a passo

### 1. Copiar

Copie `site\` e `testes\` para dentro da pasta do projeto. No fim, você
deve ter `MAGIWAY-AGENTE-KOMMO\site\ciclo.js` e os outros nove ao lado
dos arquivos que já existiam.

### 2. Rodar a bateria

```
cd C:\Users\lucia\Downloads\MAGIWAY-AGENTE-KOMMO
node testes\testar-tudo.js
```

Esperado: **130 asserções passaram, 0 falharam**. Se não der isso, não
siga — me mande o que apareceu. Nenhum destes testes usa rede, banco ou
chave: se falharem, é código, não ambiente.

### 3. Carregar os módulos na página

No HTML do painel, **antes** do arquivo do motor, na ordem abaixo. A
ordem importa: `parecido` usa `normalizar`, e `classificar` usa os dois.

```html
<script src="site/ciclo.js"></script>
<script src="site/normalizar.js"></script>
<script src="site/parecido.js"></script>
<script src="site/classificar.js"></script>
<script src="site/buscar-historico.js"></script>
<script src="site/rotular.js"></script>
<script src="site/bibliografia.js"></script>
<script src="site/quando-retomar.js"></script>
<script src="site/chance-de-fechar.js"></script>
<script src="site/adaptador.js"></script>
```

> `bibliografia.js` tem 240 KB. Carrega em um piscar no computador, mas
> se o painel abrir no celular pela rede local, deixe ele por último —
> é o único arquivo grande do conjunto.

### 4. Conferir o adaptador — faça isto primeiro

É a única peça que eu não pude testar, porque ela lê o **seu** banco e
eu não tinha o formato à vista. No console do painel:

```js
MGW_ADAPTADOR.conferir(banco)
```

Ele devolve quantas conversas achou, quantas falas de cliente, quantos
pares pergunta→resposta, um exemplo de cada e um diagnóstico em
português. Se vier zero em algum lugar, o diagnóstico diz **qual das
três funções ajustar** — são três marcações `⚠ AJUSTAR` no
`adaptador.js`, e nada mais precisa mudar.

**Se o painel vier vazio, é o adaptador.** Os outros nove estão
testados; este foi escrito pelo que o README descreve.

### 5. Ligar no motor

**a) Trocar a classificação.** Onde hoje o motor decide o tipo:

```js
var r = MGW_CLASSIFICAR.classificar(fala, REGRAS);
// r = {tipo, porque, outros}   — `porque` é o trecho que casou
```

Aceita o mesmo formato de regras que você já tem. O ganho imediato é
"Bom dia! quanto fica?" deixar de ser saudação.

**b) Mostrar o fundamento.** Com o tipo em mão:

```js
var f = MGW_BIBLIOGRAFIA.fundamento(r.tipo);
// f.porque      → o princípio, em uma linha
// f.modulos     → [{n, titulo, principio, limite, referencias}]
// f.situacoes   → as situações do manual, com as falas
MGW_BIBLIOGRAFIA.falasPara(r.tipo);   // só as falas, prontas para copiar
```

Isto é o item que te deixa independente da chave: o agente passa a
responder **com fundamento citado** sem chamar ninguém.

**c) Cobrir o que não reconheceu.** Onde hoje o campo fica vazio:

```js
var indice = MGW_BUSCAR.indexar(MGW_ADAPTADOR.paresPerguntaResposta(banco));
MGW_BUSCAR.sugerir(indice, fala);
```

Monte o índice uma vez ao abrir e refaça a cada hora — indexar 5 mil
pares leva menos de um segundo.

**d) Fila do dia por chance de fechar.**

```js
var a = MGW_CHANCE.avaliar(encerradas);   // mede antes de usar
if(a.serve){
  var n = MGW_CHANCE.pontuar(a.modelo, sinaisDoLead);
  // n.nota, n.faixa.taxa, n.aFavor, n.contra, n.porque
} else {
  // mostre a.porque na tela. Não invente nota.
}
```

`MGW_CHANCE.SUGESTAO_DE_SINAIS` é a lista de campos que eu sugiro
colher do Kommo — todos conhecidos **antes** do fim da negociação.

**e) Intervalo de retomada.**

```js
var a = MGW_QUANDO.analisar(retomadasEnviadas);
// a.bastaDado === false → mostre a.porque e mantenha as 12 h
```

**f) Todo agrupamento por mês.**

```js
MGW_CICLO_K.cicloDe(data).label        // "julho de 2026"
MGW_CICLO_K.agruparPorCiclo(itens)     // em vez de getMonth()
MGW_CICLO_K.filtrar(itens, recorte)    // serve para dia, semana, ciclo e período
```

---

## Três coisas para não fazer

**Não mostre nota sem calibração.** `pontuar` devolve `nota` (log-odds).
Ela serve para **ordenar a fila**, não para dizer "72% de chance". A
porcentagem que vai na tela é `faixa.taxa` — a taxa que realmente
aconteceu naquela faixa, medida em dado que o modelo não viu. Se
`faixas` não existe, é porque `avaliar()` não rodou.

**Não passe para `chance-de-fechar` nada que só existe depois do fim.**
"Contrato enviado", "pagamento feito", "voucher emitido" fazem o acerto
ir a 99% e a nota não prever nada — ela está lendo o resultado.
`treinar()` procura sinais assim e devolve em `suspeitas`. A pergunta
para cada campo: **isto eu sei no momento em que quero a nota?**

**Não trate a senha `carioteca` como segurança.** É tranca de
conveniência: quem abre o arquivo lê. Compare com `trim()` e sem
diferenciar maiúscula — o teclado do celular capitaliza a primeira letra
sozinho, e no app de vendas isso já fez uma tela aceitar "Carioteca" e
outra recusar. Guarde a liberação em `sessionStorage`, não em
`localStorage`: fechou o navegador, pede de novo.

---

## O que ainda falta, e por que

Os itens do painel de gestão que dependem do **seu código** continuam
em aberto: monitoramento ao vivo por colaborador, avaliação diária às
23:30, Janes fixa no painel, KPIs por recorte, rastreio de venda ganha
com link do anúncio, pacote de devolução para o Meta, dash de reservas
da planilha de fechamento e banco de mídia. A especificação deles está
em `ORDEM-DO-PAINEL.md`, destrinchada em itens verificáveis, com a lista
de conferência no fim.

Eles não estão feitos porque dependem de ler os seus arquivos — o
servidor, o painel, o formato do banco. Os 10 módulos desta pasta são
justamente a parte que **não** dependia, e é por isso que eles vieram
primeiro.
