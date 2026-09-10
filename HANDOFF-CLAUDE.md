# MAGIWAY — passagem de bastão

Documento para outro Claude assumir este projeto sem reler a conversa inteira.
Atualizado em **10/09/2026**. Tudo aqui foi verificado no código ou no navegador;
onde é suposição, está dito que é.

> A versão anterior deste arquivo era de 14/08. De lá para cá foram 74 commits.
> As seções 1 a 3 mudaram pouco. **As seções 4 em diante foram reescritas.**

---

## 1 · Quem é o usuário e o que é o produto

**Luciano Lira**, Gerente Comercial da **Magiway Rental Car** — locadora em
Orlando, Flórida, atendendo brasileiros. Ele é vendedor, gestor e quem
especifica, testa e homologa este app. Escreve em português, com pressa e sem
acento. Responde melhor a entrega do que a pergunta.

O produto é **um único arquivo HTML de 3,19 MB e 35.411 linhas** (`index.html`),
publicado no Netlify, com Supabase por trás. Sem build, sem bundler, sem
`npm run`. Editar é editar o arquivo.

### Regras de convivência aprendidas na marra

1. **"Confira se está feito mesmo antes de me dizer."** Não relate como pronto o
   que não foi aberto no navegador.
2. **"Mantenha tudo igual, mude apenas o conteúdo."** Não redesenhe o que
   funciona sem ele pedir.
3. **Comentário em português explicando o PORQUÊ**, não o quê. O código está
   cheio de comentários que contam qual defeito motivou aquela linha. Mantenha o
   costume — é o que permite voltar meses depois e entender.
4. **Nada de emoji de enfeite** em código novo.
5. Ele rejeita solução que exija terminal. É Windows, OneDrive, navegador.
6. **Ele muda de ideia, e a decisão dele vence.** Ver §6 (ciclo do mês), onde uma
   escolha minha foi revertida no dia seguinte por ordem dele. Quando isso
   acontecer: implemente, e diga em uma frase qual é a consequência numérica.

---

## 2 · Topologia

```
index.html                              o app inteiro (35.411 linhas, 33 blocos <script>)
apresentacao/MAGIWAY-DIAGNOSTICO.html   documento de apresentação, separado
supabase/banco.sql                      RLS e tabelas — AINDA NÃO RODADO (§10)
sw.js, manifest.webmanifest,            PWA + config Netlify
netlify.toml, robots.txt
icon-192.png, icon-512.png,             ícones (referenciados como /icon-*.png,
icon-maskable.png                       absolutos a partir da raiz do site)
HANDOFF-CLAUDE.md                       este arquivo
DIVISAO-PLANILHA-APP.md                 planilha × app, a divisão combinada
```

**Deploy:** zip com os 8 arquivos (index.html, sw.js, manifest.webmanifest,
netlify.toml, robots.txt e os 3 ícones), arrastado na Netlify. Mandar só o
index.html funciona mas perde o modo offline e a instalação no celular.

### Carimbo de versão

`window.MGW_VERSAO={ build:'<hash>', data:'AAAA-MM-DD' }` na linha 11. O ritual é:
commit do trabalho → pegar o hash curto → carimbar → commit "Carimba a versao
publicada com o proprio hash". Assim o app na tela diz de qual commit veio.

---

## 3 · Arquitetura

33 blocos `<script>` inline, vários com `id="mgw-*-js"`. Os principais:

| bloco | o que faz |
|---|---|
| `mgw-ciclo-js` | `MGW_CICLO` — o mês da empresa, comissão, metas, medalhas |
| `mgw-reservas-js` | `MGW_RESV` — base de reservas, gavetas, calendário, agenda |
| `mgw-live-js` | sincronização com a nuvem |
| `mgw-sync-js` | reserva → venda (`MGW_SYNC`), `window.mgwAposReservas` |
| `mgw-frota-js` | frota e suporte |
| `mgw-evolucao-js` | `MGW_EVOL` — todos os KPIs, ciclo a ciclo |
| `mgw-curso-js` | `MGW_CURSO_A/B/C/D` + a tela do curso |
| `mgw-manual-js` | `MGW_MANUAL`, `_EXTRA`, `_C`, `_D` + a tela do manual |
| `mgw-orienta-js` | `MGW_ORIENTA`, `METODO`, `MGW_METODO_EXTRA` |
| `mgw-rentab-js` | `MGW_RENTAB` — rentabilidade em três camadas |
| `mgw-rentab-explica-js` | `MGW_RENTAB_EXPLICA` — a camada que explica |
| `mgw-conteudo-vida-js` | `MGW_VIDA` — animação e fita de leitura |
| `mgw-hist-seed` | 99 reservas de meses anteriores, plantadas uma vez |

### Dependências externas — 5 CDNs

Chart.js 4.4.1, Supabase JS 2, jsPDF, html2canvas, pdf-lib. **Só o Chart.js tem
stub de fallback.** Se um CDN cair, o recurso correspondente some sem aviso.

### Armazenamento

`localStorage` com wrapper que namespaceia por usuário (`mgv_<uid>__`), exceto
o que está em `VENDOR_SHARED_KEYS` / `VENDOR_SHARED_PREFIXES`, que é da empresa.
`SHARED_WRITABLE_PREFIXES = ['gs_cot_']` — qualquer usuário logado grava cotação
no compartilhado. `cloudQueue`/`cloudFlush` sobem para o Supabase.

---

## 4 · As 21 abas

`dashboard · cotacao · emitir · frota · suporte · calendario · agenda ·
vendasmes · metas · rentab · historico · dashcot · comparativo · histresv ·
evolucao · orienta · curso · manual · nps · fluxo · vendedores`

Existem 26 painéis no DOM: os 21 acima mais `nova`, `vouchers`, `analitico`,
`reservas` e `config`, que são alcançados por dentro (botões, não menu).
**Há uma auto-verificação embutida** — `mgwSelfCheck()` roda no `initApp` e
avisa no console se algum item do menu aponta para painel inexistente. Use.

**Três abas foram REMOVIDAS em 09/09** a pedido dele: Canal Anônimo
(`panel-auditoria`), Relatórios (`panel-relatorios`) e Notas & Pendências
(`panel-tarefas`). Foram 57.891 bytes. O Canal Anônimo dividia bloco `<script>`
com Frota e Suporte e teve de ser extraído por dentro. **Os botões EMITIR
RELATÓRIO das abas Vendas do Mês e Dashboard Cotações não são a aba Relatórios
e continuam funcionando.**

---

## 5 · Números que precisam continuar batendo

Com `fech.csv` (42 linhas) e `hist.csv` (99 linhas) carregados nas gavetas:

| medida | valor |
|---|---|
| reservas no ciclo | **42** · R$ 201.354,38 |
| histórico | **99** · R$ 467.227,05 |
| base total | **141** · R$ 668.581,43 |
| barras no calendário | **138** (3 sem data não desenham) |
| comissão do ciclo | R$ 10.067,72 |
| curva ABC | 25 de 39 clientes = 80% da receita |

Se um deles mudar sem você ter mexido no cálculo, **algo quebrou.**

---

## 6 · O ciclo do mês — leia antes de mexer em QUALQUER número

**O mês da empresa vai do dia 13 ao dia 12 do mês seguinte.** Uma venda de
05/08 pertence ao ciclo de **julho**. Uma de 13/08 pertence a agosto.

```
05/01/2026 → ciclo 2025-12      13/01/2026 → ciclo 2026-01
12/08/2026 → ciclo 2026-07      13/08/2026 → ciclo 2026-08
03/01/2027 → ciclo 2026-12
```

### História que você precisa conhecer

Em 08/09 eu fiz as telas de cotação contarem pelo **mês do calendário**, porque
ele reclamou que "tem pouca cotação em agosto" — e de fato, pelo ciclo, as
cotações de 1 a 12 de agosto caem em julho. Em 09/09 ele mandou o oposto, com
todas as letras: *"todas as abas, todos os meses iniciam no dia 13 e finalizam
no dia 12 do posterior, para todos os níveis de cálculo e comparação"*.
**Revertido.** O ciclo vale em tudo.

Consequência que precisa ser dita quando o assunto voltar: com 9 cotações feitas
ao longo de agosto, as telas mostram **4 em ago/2026** e **5 em jul/2026**.
Não é cotação perdida — é o mês do app. Por isso os rótulos agora escrevem o
intervalo: `ago/2026 (13/08 a 12/09)`.

### Onde a regra vive

- `MGW_CICLO` — `cicloAtivo()`, `reservasDoCiclo()`, `DIA_VIRADA=12`
- `_ymCiclo` em cada cotação, calculado da **data dela**, não da chave onde foi
  parar (chave errada acontece: importação, versão antiga, relógio de outro PC)
- `ymDeData` / `ymDeISO` em Orientações
- `rtYMCiclo` na Rentabilidade
- `cicloDe` / `cicloDeISO` na Evolução

**Duas dessas estavam erradas até 09/09** e agrupavam por calendário ao lado de
indicadores por ciclo, na mesma tela. Se você criar uma nova agregação por mês,
**use uma dessas funções, não `getMonth()`.**

---

## 7 · A coluna CUSTO REAL não é custo — leia antes de falar de margem

A planilha tem uma coluna chamada CUSTO REAL. **Ela não é custo.** É a fórmula:

```
(diária de baixa temporada da categoria − US$ 10) × dias × câmbio
```

Ou seja: **o preço de tabela da própria Magiway**, com dez dólares de abatimento.
Verificado em 39 de 39 linhas.

Eu já reportei a ele "margem de 4,1%", "lucro bruto de R$ 7.191" e "11 reservas
com R$ 29.869,60 de prejuízo" como se fossem fato. **Não eram.** Aqueles
"prejuízos" eram descontos de 50% a 65%.

`custoEhTabela(rs)` detecta isso (custo÷diária constante por categoria, CV < 2%)
e **os rótulos da tela mudam sozinhos**: "Tabela de referência", "Acima da
tabela", "% sobre a tabela". Quando o custo de verdade for informado
(`CUSTO_K='gs_custo_diaria_v1'`), viram "Custo real", "Lucro bruto", "Margem".

**Pergunta aberta com ele, ainda sem resposta:** (baixa − $10) é mesmo o que a
Magiway paga por diária? Enquanto não vier, a aba mede distância da tabela.

Tabela de preços informada por ele (alta/baixa, US$): Sedan 89/65 · SUV 99/69 ·
SUV Premium 199/199 · Minivan 7L 149/79 · Minivan 8L 154/79 · Van 12L 199/129 ·
Conversível 199/199.

---

## 8 · O que existe hoje, aba por aba

### Reservas — duas gavetas independentes
`ARQ={hist,fech}`, `carregarGaveta(aba,textos)`, `limparGaveta(aba)`,
`zerarTudoResv()`. Histórico e mês do fechamento entram por arquivos separados e
não se sobrescrevem. A planilha do Google **tem cabeçalho na linha 3** — 
`ehLinhaCabecalho()` acha e começa depois. Com `headers=1` e sem isso, o banner
e o cabeçalho voltavam como dados.

### Virada do mês
`arquivarMes()` manda tudo para o histórico como `AGO/2026`; `desarquivar()`
desfaz. Chave `gs_resv_arquivadas_v1`.

### Cotações — consolidação da nuvem
`cotTodasAsCotacoes()` varre TODAS as chaves `gs_cot_*` do armazenamento
(inclusive as antigas por usuário) e devolve a base inteira sem duplicata.
**Nunca leia `HIST_COT` direto** — esse array guarda um mês por vez. Use
`cotBase()`, que é global de propósito: as três telas que leem cotação moram em
blocos `<script>` diferentes.

`cotProcurarPerdidas()` busca no computador e na nuvem (`app_state` +
`shared_state`) e mostra duas tabelas — por mês de calendário e por chave de
arquivo — antes de gravar. `cotRestaurar()` só SOMA, nunca apaga.
`cotVarrerAoAbrir()` roda ao abrir Histórico Cotações, Dashboard Cotações e
Cotações × Vendas.

### Cotações × Vendas (`comparativo`)
A aba do índice de contracorrente, forças, preço × nicho, desgaste da equipe,
impasse, longo prazo e plano. `renderComparativo()` + o relatório `cpx*`.
**Esta aba já esteve morta duas vezes** — ver §11.

### Rentabilidade — três camadas
1. KPIs e tabelas por categoria/vendedor/antecedência
2. `renderSegundaCamada` — 7 cartões, 5 gráficos, praça, curva ABC, 14 totais
3. `MGW_RENTAB_EXPLICA` — a leitura do mês escrita a partir dos números da tela,
   a fórmula de cada indicador e como ler cada tabela

**A camada 3 recebe os valores prontos da camada 1**, não recalcula. Na primeira
versão ela recalculava e dava 16,0% onde o cartão dizia 4,1% — o cartão divide
pela receita só das reservas com valor de tabela. **Se você acrescentar
explicação a qualquer número, passe o valor; não refaça a conta.**

### Metas — meta única de 300K
`MGW_META_EMPRESA = 300000`, medalhas em 75/150/225/300 mil.
`renderCorridaMetas` desenha uma trilha SVG (viewBox 1000×340, Catmull-Rom →
Bézier) com uma luz que percorre e **para** onde está o faturamento.
Orientações tinha uma cópia própria de R$ 500 mil, de antes da meta única —
corrigida. **Se achar outro número de meta em algum lugar, é bug.**

### Curso — 30 módulos
`MGW_CURSO_A` (6) + `_B` (8) + `_C` (8) + `_D` (8). 58 referências acadêmicas,
141 mil caracteres. Cada módulo: `porque`, `teoria[{h,p,ref}]`, `evidencia`,
`limite`, `aplicacao[]`, `scripts[]`, `erros[]`, `exercicio`, `grafico`.
Os do bloco D trazem também `leitura[{o,q}]` e `questoes[]`.

**`modulos()` reordena por eixo e renumera 1..30** — a ordem do array É a ordem
do menu. Antes o menu mostrava 10, 21, 22, 11, 12.

### Manual — 28 grupos, 126 situações, 282 falas
`MGW_MANUAL` (12) + `_EXTRA` (7) + `_C` (6) + `_D` (3).
Formato: `{g, ico, itens:[{t, q, p, f:[...]}]}`.

**O bloco C tem `{chaves}` que ELE precisa preencher** com a política real
(franquia, coberturas, política de combustível, idade mínima). Está escrito lá
dentro: aquelas falas ensinam *como* responder, não o que a apólice cobre.
Chutar franquia é o único erro do manual que não tem conserto — só aparece com
o cliente já viajando.

### Abas de conteúdo — a camada de vida
`MGW_VIDA`: fita de progresso da leitura, entrada dos blocos por rolagem,
acento colorido que se desenha, faixa do MÊS EM VIGOR. **Tudo respeita
`prefers-reduced-motion`**, e há uma rede que revela na força qualquer bloco
que esteja na tela e não tenha aparecido — texto invisível porque a animação
não rodou seria conteúdo perdido.

---

## 9 · Como testar aqui dentro

Playwright + Chromium em `/opt/pw-browsers/chromium-1194/chrome-linux/chrome`.
Os scripts vivem no scratchpad e **morrem com a sessão** — reescreva.

```js
const { chromium } = require('./node_modules/playwright');
const b = await chromium.launch({ executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const p = await b.newPage({ viewport:{width:1500,height:1000} });
const err=[]; p.on('pageerror', e=>err.push(e.message));
await p.route('**://**', r => r.request().url().startsWith('file:') ? r.continue() : r.abort());
await p.goto('file:///home/user/magiway-widget/index.html', { waitUntil:'domcontentloaded' });
await p.waitForTimeout(2800);
```

Entrar sem login:

```js
window.MGW_AUTENTICADO=true; window.IS_MASTER=true; window.MGW_PAPEL='admin';
document.getElementById('login-page').style.display='none';
document.getElementById('app').style.setProperty('display','flex','important');
if(window.mgwIniciarReservas) mgwIniciarReservas();
MGW_RESV.carregarGaveta('hist',[{texto:hist,nome:'H.csv'}]);
MGW_RESV.carregarGaveta('fech',[{texto:fech,nome:'F.csv'}]);
```

### Chart.js de verdade — faça isto

O proxy bloqueia CDN, então por padrão os gráficos caem num stub que **não
desenha nada** — e você acha que testou. Baixe e sirva o real:

```bash
npm pack chart.js@4.4.1 && tar xzf chart.js-4.4.1.tgz && cp package/dist/chart.umd.js chart-real.js
```

```js
if(/chart\.umd\.min\.js/i.test(u))
  return r.fulfill({status:200,contentType:'application/javascript',body:CHART});
```

Depois conte quantos canvas **pintam pixel**: hoje são **55 de 59**. Os 4 que
faltam são do Fluxo de Caixa, atrás da senha — correto.

### O proxy bloqueia

`docs.google.com`, `*.netlify.app`, `supabase.co`, `docusign.com`,
`painelmagiway.nexflowcrm.com.br` — 403 no CONNECT. **Não dá para verificar
daqui** se o Supabase está no ar, se o `banco.sql` roda, nem o DocuSign.
Diga isso a ele. Ele aceita bem "não consigo verificar daqui"; não aceita bem
descobrir que algo foi dado como pronto sem teste.

### O que sempre rodar antes de entregar

1. Regressão: `real41 gavetas virada cobertura cpf vm auto sig incompl cal zerar cotvend`
2. Varredura das 21 abas em 1500px **e 390px** — `pageerror` vazio, nada vazando
   para o lado, nenhuma aba com menos de 80 caracteres
3. Chart.js real — 55/59
4. Se mexeu em conteúdo: `prefers-reduced-motion` nos dois estados

---

## 10 · Pendências — em ordem de urgência

1. **`supabase/banco.sql` não foi rodado.** Até rodar, dado financeiro fica
   legível por qualquer usuário autenticado, e **as cotações dos outros
   computadores não sobem** (a tabela compartilhada não existe). É a mais grave
   e é do lado dele — SQL Editor do Supabase.
2. **Chave RSA de desenvolvedor colada no chat** — comprometida. Revogar e gerar
   outra. Ele já foi avisado três vezes. Nada secreto foi para o repositório.
3. **Teste T01–T43 do DocuSign.** Pedido, resposta nunca veio.
4. **As `{chaves}` do manual** — franquia, coberturas, combustível, idade mínima.
5. **(baixa − $10) é o custo real?** Sem isso a Rentabilidade mede tabela.
6. **Senha `carioteca` em texto claro** — duas: Fluxo de Caixa e revelar valores.
   Não há senha mestra: `CREDS_HASH` é `''` de propósito (URL pública).
7. **CPF e CNH em `localStorage`.**
8. **4 dos 5 CDNs sem stub.**
9. **Arquivo monolítico de 3,19 MB** — dividir é grande e ele nunca pediu.
10. **Testes não versionados** — vivem no scratchpad e morrem com a sessão.

Os itens 6 a 10 saíram de sugestões minhas que ele **não** mandou executar.
**Não faça sem ele pedir.**

---

## 11 · Defeitos que custaram caro — o padrão

Todos silenciosos. Nenhum dava erro na tela. **Todos apareciam só no número ou
na ausência de comportamento.**

- **Uma aba inteira sem painel.** `renderComparativo()` e os 33 elementos que ela
  desenha existiam; o `panel-comparativo` tinha sido levado numa reorganização
  da barra. O código rodava, escrevia em elementos inexistentes, **zero erro.**
  Restaurado do commit `405dd05`.
- **A varredura da nuvem nunca rodava.** Presa a `id==='histcot'`, e aba com
  esse nome não existe — a real é `historico`. Um erro de digitação. Foi a
  causa real de "tem pouca cotação em agosto".
- **`mgwAbrirZoom` e `mgwFecharZoom` não existiam**, sendo chamadas em 4 lugares.
  Resultado: clicar em qualquer gráfico não fazia nada, e o quadro do
  Comparativo abria cobrindo a tela **sem poder fechar** — X, fundo, Esc e troca
  de aba, todos mortos. Só recarregando a página. Escritas em 09/09.
- **Duas telas contando meses diferentes** — Histórico pelo calendário,
  Dashboard pelo ciclo. 9 contra 4 para o mesmo agosto.
- **`$NaN` no KPI de desconto** — uma cotação sem `subtotal` envenenava a soma
  inteira. Campo que falta soma zero.
- **A tela de login acusava a senha quando o servidor estava fora.** Toda falha
  dizia "Credenciais inválidas", inclusive "a nuvem nunca carregou". E o ponto
  verde do rodapé era verde **fixo no HTML**, mesmo com o Supabase fora.
- **Comentário desatualizado afirmando que `renderComparativo` era código morto**
  — virou mentira no dia em que a aba voltou. Pior que comentário nenhum.

### Erros meus, para não repetir

- Reportei margem, lucro e prejuízo como fato sem conferir a origem da coluna
- Entreguei um zip incompleto (3 de 8 arquivos)
- Disse que o problema do DocuSign era do DocuSign; era daqui
- Escrevi asserções de teste com id e global errados, e reportei falso negativo
- Contei dedupe keys em vez de reservas e disse "40" onde eram 42
- Deixei `cotBase` dentro de um fechamento; as outras telas não enxergaram e a
  aba abriu em branco — o `try/catch` do roteador engoliu o `ReferenceError`

**O padrão de todos: assumir em vez de conferir.** Aqui conferir é barato — tem
navegador e o app abre de `file://`.

---

## 12 · Sobre escala de conteúdo — seja honesto

Ele pede aumentos em múltiplos: *"curso 10× maior"*, *"manual 100× melhor"*.
**100× o manual seriam 6,7 milhões de caracteres — o dobro do app inteiro.**
Não é trabalho de uma sessão e não adianta fingir.

O que funciona: entregar em blocos utilizáveis, dizer o fator real alcançado, e
oferecer continuar. Ele aceita bem. O que ele **não** aceita é descobrir que o
"5×" prometido foi 1,2×.

Estado atual: curso 22→30 módulos (+54% de conteúdo), manual 111→126 situações
(+16%), Orientações com três camadas novas por passo.

---

## 13 · Último estado conhecido

- Branch: `claude/magiway-notes-calendar-reports-fxlrk0`
- Topo: `70f98d8` (carimbo) sobre `22003c4` (zoom que faltava)
- Versão carimbada no app: `22003c4` · 2026-09-09
- Árvore limpa, local igual ao remoto
- 21 abas sem erro em 1500px e 390px; 55/59 canvas desenhando com Chart.js real
- `mgwSelfCheck`: 26 painéis, todos válidos, nenhuma chamada `nav()` órfã
- Não há pull request aberto; ele nunca pediu um

**A bola está com ele em três coisas:** rodar o `banco.sql`, **revogar a chave
RSA**, e responder se (baixa − $10) é o custo por diária. Vale perguntar por
essas antes de começar assunto novo.
