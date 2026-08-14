# MAGIWAY — passagem de bastão

Documento para outro Claude assumir este projeto sem precisar reler 79 commits.
Escrito em 14/08/2026. Tudo aqui foi verificado no código; onde é suposição,
está dito que é.

---

## 1 · Quem é o usuário e o que é o produto

**Luciano Lira**, Gerente Comercial da **Magiway Rental Car** — locadora de carros
em Orlando, Flórida, atendendo brasileiros. Ele é vendedor, gestor comercial,
e é quem especifica, testa e homologa este aplicativo. Escreve em português,
às vezes com pressa e sem acento. Responde melhor a entrega do que a pergunta.

O produto é **um único arquivo HTML de 2,6 MB e 27 mil linhas** (`index.html`),
publicado no Netlify, com Supabase por trás. Não há build, não há bundler, não há
`npm run`. Editar é editar o arquivo.

### Regras de convivência que já foram aprendidas na marra

1. **"Confira se está feito mesmo antes de me dizer."** Ele disse isso cedo e
   vale para tudo. Não relate como pronto o que não foi aberto no navegador.
2. **"Mantenha tudo igual, mude apenas o conteúdo."** Não redesenhe o que já
   funciona sem ele pedir.
3. **Comentário em português, explicando o PORQUÊ**, não o quê. O código está
   cheio de comentários que contam qual bug motivou aquela linha. Mantenha o
   costume — é o que permite voltar meses depois e entender.
4. **Nada de emoji de enfeite** em código novo; os que existem são de interface.
5. Ele rejeita solução que exija terminal. É Windows, OneDrive, navegador.
   Prefira caminho por painel/interface.

---

## 2 · Topologia

```
index.html                              o aplicativo inteiro (27.106 linhas, 29 blocos <script>)
apresentacao/MAGIWAY-DIAGNOSTICO.html   documento de apresentação, separado do app
supabase/banco.sql                      RLS e tabelas — AINDA NÃO RODADO (ver §9)
supabase/functions/docusign/index.ts    Edge Function (Deno) — AINDA NÃO PUBLICADA
supabase/functions/docusign/publicar.sh script de publicação (Linux/Mac; ele é Windows)
supabase/functions/docusign/LEIA-ME.md  o passo a passo do DocuSign
netlify.toml                            publish=".", supabase/ bloqueado, SPA fallback
manifest.webmanifest, sw.js, icon-*.png PWA
metricas do dia.html, ontem.html        arquivos antigos, não fazem parte do app
DIVISAO-PLANILHA-APP.md                 o que ficou na planilha e o que veio para o app
```

**Branch de trabalho:** `claude/magiway-notes-calendar-reports-fxlrk0`
**Deploy:** Netlify — `boisterous-fairy-c8676b.netlify.app`
(o `publicar.sh` ainda cita `teal-queijadas-4e99a8`, endereço antigo)

**Ao entregar arquivo para ele, entregue a pasta inteira.** Já houve um 404 em
produção porque o zip saiu com 3 dos 8 arquivos — faltava o `netlify.toml`, que
era justamente o que causava o 404.

### Carimbo de versão

Linha 11: `window.MGW_VERSAO={ build:'<hash>', data:'<data>' }`.
Convenção: commita a mudança, pega o hash, carimba, commita de novo com a
mensagem `Carimba a versao publicada com o proprio hash`. Metade dos 79 commits
são esses carimbos.

---

## 3 · Arquitetura do `index.html`

Sem framework. Roteador próprio: `nav('<aba>', evento)` mostra `#panel-<aba>`.

**Abas:** dashboard, cotacao, dashcot, emitir, calendario, reservas, frota,
suporte, agenda, vendasmes, metas, nps, tarefas, historico, fluxo, relatorios,
auditoria, vendedores, config.

**Módulos globais** (`window.*`): `MGW_CICLO`, `MGW_FROTA`, `MGW_RESV`, `MGW_RES`,
`MGW_SUPORTE`, `MGW_AUDITORIA`, `MGW_SYNC`, `MGW_LIVE`, `MGW_SIGILO`, `MGW_VM`,
`MGW_PAPEIS`, `MGW_VERSAO`, `MGW_CAT_OF`, `MGW_SEM_GRAFICOS`.

**Objetos de animação** (não são `window.*`): `MGS` (esfera da saúde),
`MGD` (esfera da dificuldade), `MGTR` (trilha da meta), `MGW_VERBETES`
(explicações por gráfico).

### Dependências externas — 5 CDNs

`@supabase/supabase-js@2`, `Chart.js 4.4.1`, `html2canvas 1.4.1`,
`jspdf 2.5.1`, `pdf-lib 1.17.1`.

O Chart.js tem **stub de no-op** se o CDN falhar, então o app não quebra sem
internet — mas os gráficos somem calados. As outras quatro não têm proteção.
**Isto continua sendo o maior risco operacional do app** e está na lista de
melhorias que ele ainda não mandou fazer.

### Armazenamento

`localStorage` com wrapper que faz namespacing por vendedor:
`mgv_<uid>__<chave>`. Duas listas controlam o que é compartilhado:

- `VENDOR_SHARED_PREFIXES` / `VENDOR_SHARED_KEYS` — sobe para a nuvem e a
  equipe lê
- `SHARED_WRITABLE_PREFIXES` — a equipe também grava

Sincronização: `cloudQueue` / `cloudFlush`, com merge de 3 vias.
Tabelas no Supabase: `app_state`, `shared_state`, `profiles`, `auditoria`.

### O ciclo do mês — leia isto antes de mexer em qualquer número

`MGW_CICLO`, com `DIA_VIRADA = 12`. O mês de trabalho vai do **dia 13 ao dia 12**
do mês seguinte. `MGW_CICLO.cicloAtivo()` devolve `{ym, ini, fim, label, dias}`.

Todo indicador tem de ser recortado por esse ciclo, não pelo mês do calendário.
Já houve bug por isso mais de uma vez.

---

## 4 · O que foi construído (em ordem cronológica grosseira)

### Reservas e calendário
- Reservas vêm de planilha + app, mescladas por `MGW_RESV`
- `dedupeKey(r) = tel + entrega + nomeChaveTol(cliente)`
- **`nomeChaveTol(nome)`**: primeiro token + último token. Foi escrito assim
  porque a versão anterior filtrava token de uma letra e fundia "Cliente A" com
  "Cliente C" — a suíte de testes caiu de 32 para 25 e denunciou
- **Reserva fragmentada**: `mesclarReservas` soma parcelas, mas ignora parcela
  de valor repetido e trava no `valorIntegral`. Sem isso o mesmo pagamento
  entrava duas vezes
- Botão de cortar/religar o vínculo com a planilha
- Quadro de disponibilidade abaixo do calendário (`MGW_RESV.dispQuadro()`)

### Frota — 22 carros, `MGW_FROTA`
Carros, categorias, oficina, chamados, CSV. `MGW_FROTA.abrirModal(html)` e
`MGW_FROTA.fechar()` são a única forma de abrir modal a partir de outro bloco
de script — `abrirModal` é local ao bloco da frota.

### Dashboard — a esfera da saúde
`mgsCalcularSaude()` devolve **10 indicadores**, todos recortados pelo ciclo,
com as reservas como fonte do que fechou. `MGS` desenha a esfera verde.

### Dash de Cotações — a esfera da dificuldade
`mgdCalcular(cots, reservas)` devolve `{fatores, indice, pctFora, n, nR}` a
partir de **8 fatores com peso**: preço acima do nicho (22%), carteira difícil
(18%), conversão (16%), cotações por venda (14%), fora de Orlando (8%),
locação curta (8%), retirada apertada (7%), volume (7%).
`MGD` desenha a esfera vermelha com impulsos azuis.

**Atenção à escala:** aqui número **alto é ruim** — o contrário da esfera verde
do Dashboard. Há um aviso na tela por causa disso.

### Física das esferas (compartilhada)
`_esfVizinhos(S)`, `_esfImpulso(S, taxa)`, `_esfMover(S, taxa)`.
Pontos distribuídos por espiral de Fibonacci, respiração radial, impulso que
propaga pelo MAX dos vizinhos × 0,11 com decaimento 0,90. Dois motores:
`requestAnimationFrame` mais `setInterval` de reserva (aba em segundo plano
congela o rAF).

### Trilha da meta — `MGTR`
Cometa desenhado em canvas. Substituiu um carrinho de emoji e, antes disso,
um anel que ele rejeitou ("está feio").
**Bug já corrigido:** o contador fechava em R$ 91.890 em vez de R$ 92.000 —
parava 0,05% antes do alvo. Tem uma flag `chegou` que crava o valor exato.

### Identidade visual v5
Bloco de CSS no fim da folha de estilo que deixa **todas** as abas quadradas,
com extremidades retas e transparências. Corrige `select` que saía vermelho
sobre fundo quase preto (pior contraste do app).
**Cuidado:** `background` como atalho reseta `background-repeat` e ladrilha a
seta do select. Use `background-color` mais posição/repetição explícitas.

### Cliente ideal — `cpClassificar(h)`
Quatro critérios, **todos obrigatórios**:
1. mais de 10 diárias
2. Orlando → Orlando (retira e devolve na mesma praça)
3. minivan (7L ou 8L)
4. retirada em até 3 meses da data da cotação

Base de cálculo é a **COTAÇÃO**, nunca a venda. Isto já gerou erro grave no
documento de apresentação (§7).

Acompanham: `cpEhMinivan`, `cpEhOrlando`, `cpCatCanon` (unifica "Minivan 7L" da
cotação com "Minivan"/"Chrysler Pacifica" da reserva — a ordem dos testes
importa: 8L antes de 7L, Premium antes de SUV), e `CP_PRECOS`.

**`renderComparativo()` continua no arquivo e não é mais chamada.** A aba
Comparativo saiu do app em 12/08 e virou o documento de apresentação. A função
ficou porque as quatro ajudas acima moram no mesmo bloco e as duas esferas
dependem delas. Todo `getElementById` dentro dela devolve `null` — é inofensiva.
Não arranque sem mover as ajudas antes.

### Outras abas
Fluxo de caixa (lançamento manual, 4 gráficos), NPS com análise de IA,
Suporte, Auditoria anônima (senha `carioteca`, em texto claro — ver §9),
Relatórios em A4, chave da API do Claude configurável, cotação preenchida por
texto colado, cursor de pontinho verde fluorescente.

---

## 5 · DocuSign — leia inteiro antes de tocar

É o subsistema que mais consumiu tempo e onde estão as armadilhas.

### Como funciona hoje

Dois caminhos, escolhidos por `_CFG.docusign.apiUrl`:

**A · PowerForm (ligado hoje).** `dsMontarLink(tipo)` monta a URL do PowerForm
com os campos na query string:
- `<Papel>_UserName` e `<Papel>_Email` para o signatário
- um par `<DataLabel>=<valor>` por campo mapeado
- limpa `< > &` do valor (o parser do PowerForm engasga com `&` mesmo escapado)
- manda também o conjunto alternativo de rótulos **enquanto couber** em 1700
  caracteres — o principal nunca é sacrificado pelo reserva

**Limite de 2048 caracteres.** O PowerForm é `.aspx` rodando em IIS. Passando
disso o servidor recusa **antes de renderizar**: o cliente clica e a página não
abre, sem mensagem. Medido: titular + 1 condutor = 1193; titular + 4 condutores
com nomes longos = 1955. O app avisa a partir de 1800.

**B · Edge Function (opcional, ainda não publicada).** `POST` com os campos no
corpo; a função cria o envelope pela API com `templateRoles[0].tabs.textTabs`.
Link de ~100 caracteres, sem limite de tamanho, sem depender de regra de
PowerForm. Também expõe `GET ?rotulos=1`, que lê os Data Labels **de verdade**
do modelo para o app consertar o mapeamento sozinho.

### Os 43 rótulos

`DS_CAMPOS_PADRAO` — string com uma linha `Rótulo = campo` por campo, em ordem
de documento, de `Nome_Cliente = nome` até `Data_ASS = dataass`. **Confirmados
por ele em 11/08/2026 olhando o modelo.**

`DS_CAMPOS_ANTIGOS` — o conjunto alternativo, com prefixo do papel
(`Cliente_NomeCliente`), que vem do script antigo do Google Apps Script.

`dsTrocarConjunto()` alterna entre os dois num clique.

### A causa raiz do contrato em branco (corrigida em 9513bd6)

Esta é a história mais importante do arquivo, porque o sintoma não apontava
para a causa.

`dsMapaCampos()` lia o mapeamento **só** de `_CFG.docusign.campos`. A config
salva no navegador dele tinha `campos:""` — o preenchimento dependia de uma
migração (`_MIGVER`) ter rodado naquele navegador para escrever as 43 linhas.
Quando a migração não rodava (versão antiga no ar, config vinda da nuvem por
cima, perfil novo, ou `gs_ds_mapa_travado` já marcado), a função devolvia lista
vazia.

**E lista vazia não dava erro em lugar nenhum.** `dsMontarLink` montava o link
com nome e e-mail apenas, o cliente abria, e o contrato chegava vazio sem
ninguém ser avisado. Só o botão de teste reclamava — e apontava para uma caixa
de configuração que também aparecia vazia, então não levava a lugar nenhum.

Correção: `dsMapaCampos()` cai em `DS_CAMPOS_PADRAO` quando o mapeamento
gravado está vazio, e a caixa em Configurações passa a mostrar o mapeamento
**que está valendo**, não o que está gravado.

**Lição geral, que vale para o app inteiro: padrão que depende de migração ter
rodado não é padrão.**

### Ferramentas de diagnóstico já construídas

| Função | O que faz |
|---|---|
| `dsDiagnostico()` | mostra rótulo por rótulo o que sai daqui |
| `dsCompararModelo()` | lê os Data Labels reais via Edge Function (precisa dela publicada) |
| `dsAplicarMapa()` | corrige o mapeamento com o que veio do modelo |
| `dsAdivinharCampo()` | casa rótulo com campo por pontuação: chave mais longa vence, mais 100 pontos se o prefixo casar |
| `dsTestarPreenchimento()` | abre o PowerForm com marcador T01…T43 em cada campo |
| `dsTrocarConjunto()` | alterna os dois conjuntos de rótulos |

**`dsTestarPreenchimento()` é a ferramenta central.** O usuário abre o link,
anota quais T-números vieram em branco, e isso diz exatamente qual rótulo o
modelo não reconhece.

### Armadilha do `dsAdivinharCampo`

A primeira versão mapeava "CPF do Cliente" → `nome`, porque a string contém
"cliente". Por isso a pontuação por chave mais longa mais bônus de prefixo.

### Estado atual, verificado

- PowerForm: **ligado e funcionando no código**; falta ele rodar o teste
  T01–T43 e dizer o que veio em branco
- Edge Function: **escrita e testada localmente, não publicada**
- Integration Key: **não existe ainda**. A tela de produção do DocuSign informa
  que chave de integração só se cria em conta de desenvolvedor e depois passa
  pelo processo de ativação (Go-Live). Isto torna o caminho B lento — dias
- Já disponíveis na conta de produção dele: User ID, API Account ID e
  `https://na4.docusign.net`

### Segurança

Ele colou uma **chave RSA privada no chat** em algum momento. Era de conta de
desenvolvedor, não de produção. Foi avisado duas vezes para apagar e gerar
outra. **Nada de segredo foi para o repositório — confirmado.** Se ele colar
de novo: não guarde, não repita, avise.

---

## 6 · O documento de apresentação

`apresentacao/MAGIWAY-DIAGNOSTICO.html` — 1406 linhas, arquivo único, **zero
requisições externas**. Todo gráfico é SVG escrito à mão (`barras`, `curva`,
`funil`, `radar`) mais um canvas de esfera. Abre com dois cliques, projeta em
qualquer tela, funciona sem sinal.

Nasceu como a aba Comparativo dentro do app e foi extraída a pedido dele.

### O que ele quis nesse documento

- **Responsabilizar a gestão** pelo que é dela, sem acusar pessoas
- **Linguagem acadêmica**, com base econômica citada (Marshall, Akerlof,
  Spence, Goldratt, Adams, Vroom, Herzberg, Ehrenberg-Bass, Smith, Polanyi)
- **Elevá-lo profissionalmente ao máximo**, de forma genuína, "quase
  sobre-humana", "peça que não se encontra em qualquer lugar"
- **Não falar sobre bonificação** (havia uma seção; foi removida)
- Deixar clara **a necessidade de organização e marketing**
- Deixar claro que ele **continua liderando dentro da operação** e ajudando nos
  outros setores, precisando apenas de **mais apoio e organização na parte
  comercial**, e que deve ficar **6 meses no operacional** para recuperação de
  caixa e formação de novos vendedores lado a lado

### Seções

capa · §1 provas · §2 índice de dificuldade decomposto · §3 seis erros ·
§4 comparativos · §5 organização e marketing · §6 o ouro na mão ·
§7 o lugar dele na estrutura · §8 responsabilidade · §9 o que assumir ·
§10 as perguntas

### Paleta Magiway

Ciano `#0CB7F2` / `#7CDAF9` / `#B6FFFF` como cor institucional, vermelho
`#ED1128` como alerta, petróleo `#1E8C93` e laranja `#F2913D` de apoio, fundo
naval `#14263A`. Ele mandou duas imagens de referência e pediu "menos escuro e
mais simétrico".

### A lupa

Clicar em qualquer texto, cartão, tabela ou gráfico leva o bloco ao centro da
tela em fonte grande. Fecha com Esc, com o botão ou clicando fora.

**Armadilha resolvida:** SMIL clonado depois que a linha do tempo já correu
volta ao valor inicial em vez de congelar no final — a barra sumia ao ampliar.
O clone remove todos os `<animate>`; o SVG estático já está no valor final.

### O índice de dificuldade

Nove fatores com peso declarado somando 100, cada nota derivada de dado
rastreável. Dá **95**. Ele exigiu "pelo menos 90%" e o número tem de continuar
sendo média ponderada de verdade, não piso artificial — se mudar dado e cair
abaixo de 90, é para conversar com ele, não para forçar.

O índice bruto do app dá 46 porque só enxerga preço, carteira e volume. Os
cinco fatores que faltavam (marca, plano, funções acumuladas, sublocado, nicho)
entram só aqui.

---

## 7 · A ponte de dados app → documento (o mais recente)

**No app:** Dash de Cotações → botão **📄 DADOS DO DIAGNÓSTICO**.
`mgDiagCalcular()` lê `HIST_COT`, `SALES_DATA`, `MGW_FROTA`, `CP_PRECOS` e o
ciclo, respeitando o período do calendário daquela tela, e devolve JSON.
`mgDiagAbrir()` mostra num modal com botão de copiar.

**No documento:** rodapé → **atualizar números**. Cola, valida, guarda em
`localStorage` sob `mgdiag_dados` e recarrega. Tem "voltar ao padrão" e um selo
dizendo de quando são os números.

Recarregar em vez de remendar é deliberado: o documento inteiro é montado a
partir de `D`, então recarga garante que não sobra número velho em canto nenhum.

### O erro de base que isso corrigiu — vale como lição

O documento dizia **41,7% de clientes ideais**. Ele corrigiu: são **5,1%**.
A diferença era a base — 41,7% saía das vendas, e `cpClassificar` mede sobre
cotações.

Pior: as conversões por perfil que estavam no documento (8,0% e 2,9%) vinham de
uma terceira base ainda. **As duas estavam abaixo da conversão geral de 18,3%,
o que é aritmeticamente impossível** — nenhuma média ponderada delas fecha em
11 vendas. Se alguém na reunião fizesse a conta, o documento caía.

Agora o bloco `DADOS` guarda **só contagens absolutas** e o documento deriva o
resto. Existe uma checagem: a média das duas conversões ponderada pela
composição **tem** de bater com a conversão geral. Foi verificada no navegador.

**Regra que ficou: número derivado de contagem, nunca taxa digitada solta.**

### A parte delicada da atribuição

O total de fechamentos vem da **reserva** — venda de verdade, entra sozinha.
Saber se a venda nasceu de cotação de perfil ideal só é possível pelas
**cotações marcadas como ganha**. Venda que não dá para rastrear entra como
complexa. É critério conservador: nunca infla o lado bom. Quando nenhuma
cotação ideal está marcada, o modal avisa.

### A comparação entre perfis tem três formas

Frase fixa quebrava em dois dos três casos. Hoje há três caminhos — ideal
convertendo melhor, ideal convertendo menos, e ideal sem nenhum fechamento — e
o título da prova 2 se ajusta à faixa do percentual. Os três foram testados.

---

## 8 · Como testar aqui dentro

Playwright com Chromium em `/opt/pw-browsers/chromium-1194/chrome-linux/chrome`.
Os scripts ficam no scratchpad da sessão e **são efêmeros — não estão no
repositório**. Reescreva conforme precisar.

Molde:

```js
const { chromium } = require('./node_modules/playwright');
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const p = await b.newPage({ viewport:{width:1440,height:1000} });
p.on('pageerror', e => err.push(e.message));
await p.route('**://**', r => r.request().url().startsWith('file:') ? r.continue() : r.abort());
await p.goto('file:///home/user/magiway-widget/index.html', { waitUntil:'domcontentloaded' });
```

**A ordem das rotas importa: a que pega tudo tem de ser registrada primeiro.**

Para entrar no app sem login:

```js
window.MGW_AUTENTICADO=true; window.IS_MASTER=true; window.MGW_PAPEL='admin';
document.getElementById('login-page').style.display='none';
document.getElementById('app').style.setProperty('display','flex','important');
if(window.mgwIniciarReservas) mgwIniciarReservas();
```

Para semear reservas, escreva `magiway_resv_cache_v1` num `addInitScript`.

**Sempre verifique**: `pageerror` vazio e nenhuma requisição externa escapando.

### O proxy bloqueia

`docs.google.com`, `*.netlify.app`, `supabase.co`, `docusign.com`,
`docusign.net`, `painelmagiway.nexflowcrm.com.br` — todos 403 no CONNECT.

Ou seja: **não dá para verificar daqui** se o modelo do DocuSign aceita os
rótulos, se o `banco.sql` roda, nem o painel do CRM. Diga isso a ele em vez de
inventar. Ele aceita bem "não consigo verificar daqui"; não aceita bem
descobrir sozinho que algo foi dado como pronto sem teste.

---

## 9 · Pendências, em ordem de urgência

1. **`supabase/banco.sql` não foi rodado.** Até rodar, dado financeiro fica
   legível por qualquer usuário autenticado. É a pendência mais grave e é do
   lado dele — SQL Editor do Supabase. (Ele já colou por engano um comando de
   terminal ali; vale lembrar qual arquivo vai onde.)
2. **Teste T01–T43 do DocuSign.** Foi pedido; a resposta ainda não veio. É o
   que destrava o preenchimento.
3. **Chave RSA de desenvolvedor exposta no chat** — apagar e gerar outra.
4. **Senha `carioteca` em texto claro** no canal anônimo.
5. **CPF e CNH em `localStorage`** do navegador.
6. **Quatro dos cinco CDNs sem proteção** — só o Chart.js tem stub.
7. **Sem log de auditoria** de quem alterou o quê.
8. **Sem emparelhamento manual** de reserva quando o casamento automático erra.
9. **Arquivo monolítico** de 2,6 MB — dividir é grande e ele nunca pediu.
10. **Testes não versionados** — vivem no scratchpad e morrem com a sessão.

Os itens 4 a 10 saíram de uma lista de sugestões que eu apresentei e ele não
mandou executar. **Não faça sem ele pedir.**

---

## 10 · Erros que eu cometi, para não repetir

- **Entreguei um zip incompleto** — 3 de 8 arquivos, faltando o `netlify.toml`
  que era a causa do 404 que ele estava tentando resolver
- **Escrevi asserções de auditoria erradas** e reportei falso negativo: id de
  elemento errado (`#mgcal-disp` em vez de `#mgdisp-tab`), global errado
  (`MGW_AUD` em vez de `MGW_AUDITORIA`), e procurei `salvarPDF` no app quando
  ela vive no popup do voucher
- **Disse que o lado do código do DocuSign estava pronto e o problema era do
  DocuSign.** Era daqui — o `dsMapaCampos` vazio. Custou dias de investigação
  na direção errada
- **Deixei três taxas de bases diferentes** convivendo no mesmo documento sem
  checar se fechavam
- **Editei com ferramenta quando ele tinha pedido o navegador** — ele
  interrompeu

O padrão dos cinco: **assumir em vez de conferir**. Aqui, conferir é barato —
tem navegador, e o app abre de `file://`.

---

## 11 · Último estado conhecido

- Branch: `claude/magiway-notes-calendar-reports-fxlrk0`
- Topo: `123655d` (carimbo) sobre `9513bd6` (correção do DocuSign)
- Versão carimbada no app: `9513bd6`
- Suítes passando: 18/18 de funcionalidades, 10/10 indicadores de saúde,
  zero erro de página, zero requisição externa no documento de apresentação
- Não há pull request aberto; ele nunca pediu um

**A bola está com ele em duas coisas:** rodar o `banco.sql` e rodar o teste
T01–T43. Vale perguntar por essas duas antes de começar assunto novo.
