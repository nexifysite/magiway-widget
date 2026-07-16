/************************************************************************************************
 *  MAGIWAY — CONTROLE DE VENDAS  (Google Apps Script)  —  v3
 *  ---------------------------------------------------------------------------------------------
 *  COLE EM UMA PLANILHA VAZIA:
 *    1) Crie uma Planilha Google em branco.
 *    2) Extensões ▸ Apps Script ▸ apague o exemplo ▸ cole TODO este código ▸ salve (💾).
 *    3) Volte à planilha, recarregue a página (F5).
 *    4) Menu "🚗 MAGIWAY" ▸ "🔧 Construir / Atualizar tudo". Autorize na 1ª vez.
 *  O script monta a planilha inteira do zero (COMO USAR, VENDAS, PAINEL, CONFIG).
 *
 *  PEDIDOS ATENDIDOS:
 *   1) % COMISSÃO (menu 2/3/4/5%) ao lado do valor do PAGAMENTO INTEGRAL + comissão automática.
 *   2) % COMISSÃO (2/3/4/5%) também no PAGAMENTO FRACIONADO + comissão automática.
 *   3) BARRA DE PROGRESSO em cada parcela do fracionado (sobe com o valor pago até 100%).
 *   +  BARRA DE PROGRESSO GERAL da reserva fracionada (bloco RESUMO).
 *   4) VENDEDORES em menu suspenso: DICKSON, KEVIN, OUTROS.
 *   5) Empresa MAGIWAY em todos os títulos.
 *   6) CATEGORIAS: SEDAN, SUV, MINIVAN 7L, MINIVAN 7L LIMITED, MINIVAN 8L, SUV FULL, MUSTANG.
 *   7) Sem MODELO do veículo e sem PLACA.
 *   8) "ALIMENTADO NO SISTEMA?" -> "ADICIONADO À PLANILHA DE FECHAMENTO DO VENDEDOR?".
 *   9) PAINEL só com barras percentuais (máximo de indicadores).
 *  10) Fracionado sempre com DATA DO PRÓXIMO PAGAMENTO. Cor automática da linha:
 *        VERMELHA = atrasado · VERDE = quitada (integral/fracionada) · AZUL CLARO = fracionada em dia.
 *  11) Sem colunas de CONTROLE & ALERTAS.
 *  12) Sem bloco antigo VALORES & COMISSÃO (comissão agora é por pagamento).
 *  13) Sem bloco antigo MODALIDADE & PROGRESSO (agora barras + cores).
 *   +  Todos os campos de escolha são MENUS SUSPENSOS (seta), com cor diferente por tipo.
 *   +  Paleta MAGIWAY: #000020 / #171a4a / #2f2c79 / #bd0003 / #ff0000.
 *   +  Extras p/ financeiro: RESUMO na CONFIG, comissão total, % da meta, etc.
 ************************************************************************************************/

/* ======================== PARÂMETROS ======================== */
var FIRST_ROW  = 4;
var NUM_LINHAS = 100;
var LAST_ROW   = FIRST_ROW + NUM_LINHAS - 1;
var ABAS = ['COMO USAR','VENDAS','PAINEL','CONFIG'];

/* Paleta escolhida */
var PAL = {
  base:  '#000020',   // azul quase preto
  navy:  '#171a4a',   // azul marinho
  indigo:'#2f2c79',   // índigo
  dred:  '#bd0003',   // vermelho escuro
  red:   '#ff0000'    // vermelho
};

/* Cores de estado da linha (semânticas, pedidas) e apoio */
var COR = {
  verde:    '#C6EFCE',   // reserva quitada
  vermelho: '#F7CBCB',   // reserva atrasada (tom claro do vermelho da paleta)
  azul:     '#CFE2F3',   // fracionada em dia
  auto:     '#EEF0F4',   // campos automáticos (cinza claro)
  barra:    '#2f2c79'    // barra de progresso (índigo da paleta)
};

/* Tons pastel — uma cor por TIPO de menu suspenso */
var TINT = {
  vendedor: '#E7E6F5',   // índigo claro
  categoria:'#E2EEFB',   // azul claro
  moeda:    '#FFF2CC',   // dourado claro
  local:    '#E6F4EA',   // verde claro
  forma:    '#F1E5F7',   // roxo claro
  pct:      '#FFF7D6',   // amarelo (destaque comissão)
  pago:     '#E9FBEF',   // verde bem claro
  add:      '#FBEBE9'    // rosa/vermelho bem claro
};

var CATEGORIAS = ['SEDAN','SUV','MINIVAN 7L','MINIVAN 7L LIMITED','MINIVAN 8L','SUV FULL','MUSTANG'];
var VENDEDORES = ['Dickson','Kevin','Outros'];
var LOCAIS     = ['MCO','MIA','TAMPA','FLL','ENDEREÇO MCO','ENDEREÇO MIA','PORTO MIA'];
var FORMAS     = ['NOMAD (USD)','WISE (USD)','ZELLE (USD)','TRANSFERÊNCIA (USD)','CASH (USD)',
                  'C6 (USD)','LINK DE PAGAMENTO (USD)','PIX (BRL)','BOLETO (BRL)','CRÉDITO (BRL)'];
var COMISSOES  = [2,3,4,5];
var MOEDAS     = ['USD','BRL'];
var SIMNAO     = ['SIM','NÃO'];

/* ======================== MAPA DE COLUNAS (definido em runtime) ======================== */
// Cada coluna tem uma CHAVE (role). As fórmulas usam a chave, nunca a letra fixa —
// assim, se a ordem mudar, nada quebra.
var GRUPOS = [
  { t:'IDENTIFICAÇÃO DA VENDA', cor:PAL.base, cols:[
      ['Nº DA VENDA','NUM'], ['DATA DA VENDA','DATA'], ['VENDEDOR','VENDEDOR'],
      ['NOME DO CLIENTE','CLIENTE'], ['Nº DO CLIENTE (WhatsApp)','WHATS'],
      ['CATEGORIA VENDIDA','CATEGORIA'], ['MOEDA','MOEDA'] ] },
  { t:'PERÍODO & LOGÍSTICA', cor:PAL.navy, cols:[
      ['DATA RETIRADA','DT_RET'], ['HORA RETIRADA','HR_RET'], ['LOCAL RETIRADA','LOC_RET'],
      ['DATA DEVOLUÇÃO','DT_DEV'], ['HORA DEVOLUÇÃO','HR_DEV'], ['LOCAL DEVOLUÇÃO','LOC_DEV'],
      ['QTD. DE DIÁRIAS','DIARIAS'], ['OBSERVAÇÃO P/ LOGÍSTICA','OBS'] ] },
  { t:'PAGAMENTO INTEGRAL', cor:PAL.indigo, cols:[
      ['VALOR DO PAGAMENTO','I_VALOR'], ['% COMISSÃO','I_PCT'], ['COMISSÃO','I_COM'],
      ['DATA DO PGTO','I_DATA'], ['FORMA DE PAGAMENTO','I_FORMA'], ['Nº PARCELAS (crédito)','I_PARC'],
      ['PAGO?','I_PAGO'], ['ADICIONADO À PLANILHA DE FECHAMENTO DO VENDEDOR?','I_ADD'], ['RECIBO','I_REC'] ] },
  { t:'PAGAMENTO FRACIONADO — RESUMO', cor:'#4a2b6e', cols:[
      ['VALOR TOTAL (FRACIONADO)','F_TOTAL'], ['% COMISSÃO','F_PCT'], ['COMISSÃO','F_COM'],
      ['PRÓXIMO PAGAMENTO','F_PROX'], ['% PAGO (FRACIONADO)','F_PAGOPCT'], ['PROGRESSO DA RESERVA','F_PROG'] ] },
  { t:'ENTRADA (FRACIONADA)', cor:PAL.navy, cols:parcela('E') },
  { t:'PARCELA 1 (DO REMANESCENTE)', cor:PAL.indigo, cols:parcela('P1') },
  { t:'PARCELA 2 (DO REMANESCENTE)', cor:PAL.navy,   cols:parcela('P2') },
  { t:'PARCELA 3 (DO REMANESCENTE)', cor:PAL.indigo, cols:parcela('P3') },
  { t:'PARCELA 4 (DO REMANESCENTE)', cor:PAL.navy,   cols:parcela('P4') }
];
function parcela(p) {
  var vl = (p === 'E') ? 'VALOR DA ENTRADA' : 'VALOR DO PGTO';
  var dt = (p === 'E') ? 'DATA DA ENTRADA'  : 'DATA DO PGTO';
  return [
    [vl, p + '_VALOR'], [dt, p + '_DATA'], ['FORMA DE PAGAMENTO', p + '_FORMA'],
    ['PROGRESSO', p + '_PROG'], ['PAGO?', p + '_PAGO'],
    ['ADICIONADO À PLANILHA DE FECHAMENTO DO VENDEDOR?', p + '_ADD'], ['RECIBO', p + '_REC'] ];
}

var COL = {};          // { chave: 'A', ... }  — preenchido por definirColunas()
var TOTAL_COLS = 0;

function definirColunas() {
  COL = {}; var header = [], idx = 1;
  GRUPOS.forEach(function (g) {
    g.cols.forEach(function (c) { COL[c[1]] = L(idx); header.push(c[0]); idx++; });
  });
  TOTAL_COLS = header.length;
  return header;
}

/* ======================== MENU ======================== */
function onOpen() {
  SpreadsheetApp.getUi().createMenu('🚗 MAGIWAY')
    .addItem('🔧 Construir / Atualizar tudo', 'construirTudo')
    .addSeparator()
    .addItem('🧹 Limpar dados (mantém fórmulas)', 'limparDados')
    .addItem('ℹ️ Sobre este script', 'sobre')
    .addToUi();
}
function sobre() {
  SpreadsheetApp.getUi().alert(
    'MAGIWAY — Controle de Vendas (v3)\n\n' +
    'Monta a planilha inteira do zero: COMO USAR, VENDAS, PAINEL e CONFIG.\n' +
    'Comissão por pagamento (2/3/4/5%), barras de progresso, menus suspensos coloridos, ' +
    'cores automáticas por status e painel só com barras percentuais.');
}

/* ======================== ORQUESTRADOR ======================== */
function construirTudo() {
  var ui = SpreadsheetApp.getUi();
  var resp = ui.alert('MAGIWAY — Construir / Atualizar',
    'As abas COMO USAR, VENDAS, PAINEL e CONFIG serão criadas/recriadas do zero.\n' +
    'Qualquer dado dessas abas será substituído. Continuar?',
    ui.ButtonSet.YES_NO);
  if (resp !== ui.Button.YES) return;

  definirColunas();
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  // 1) recria as 4 abas VAZIAS primeiro (evita #REF! em referências cruzadas)
  var sh = {};
  ABAS.forEach(function (n) { sh[n] = recriarAba(ss, n); });
  removerTemporaria(ss);

  // 2) preenche (CONFIG primeiro: alimenta as validações da VENDAS)
  construirCONFIG(sh['CONFIG']);
  construirVENDAS(sh['VENDAS']);
  construirPAINEL(sh['PAINEL']);
  construirCOMOUSAR(sh['COMO USAR']);

  // 3) remove abas em branco que sobraram (ex.: "Página1" de uma planilha nova)
  ss.getSheets().forEach(function (s) {
    if (ABAS.indexOf(s.getName()) === -1 && s.getName() !== 'TMP_MAGIWAY' && s.getDataRange().isBlank())
      ss.deleteSheet(s);
  });

  // 4) ordena e pinta as guias
  ordenar(ss, ABAS);
  sh['COMO USAR'].setTabColor(PAL.dred);
  sh['VENDAS'].setTabColor(PAL.indigo);
  sh['PAINEL'].setTabColor(PAL.navy);
  sh['CONFIG'].setTabColor('#5F6368');

  ss.setActiveSheet(sh['VENDAS']);
  ui.alert('✅ Planilha MAGIWAY criada!\n\nComece a lançar as vendas na linha 4 da aba VENDAS.');
}

/* ======================== RECRIAÇÃO DE ABAS ======================== */
function recriarAba(ss, nome) {
  var velha = ss.getSheetByName(nome);
  if (velha) {
    if (ss.getSheets().length === 1 && !ss.getSheetByName('TMP_MAGIWAY')) ss.insertSheet('TMP_MAGIWAY');
    ss.deleteSheet(velha);
  }
  return ss.insertSheet(nome);
}
function removerTemporaria(ss) { var t = ss.getSheetByName('TMP_MAGIWAY'); if (t) ss.deleteSheet(t); }
function garantirColunas(sh, n) {
  var max = sh.getMaxColumns();
  if (max < n) sh.insertColumnsAfter(max, n - max);
  else if (max > n) sh.deleteColumns(n + 1, max - n);
}

/* ======================== UTILIDADES ======================== */
function ordenar(ss, ordem) {
  for (var i = 0; i < ordem.length; i++) {
    var sh = ss.getSheetByName(ordem[i]);
    if (sh) { ss.setActiveSheet(sh); ss.moveActiveSheet(i + 1); }
  }
}
function L(n) { var s = ''; while (n > 0) { var m = (n - 1) % 26; s = String.fromCharCode(65 + m) + s; n = (n - m - 1) / 26; } return s; }
function num(col) { var n = 0; for (var i = 0; i < col.length; i++) n = n * 26 + (col.charCodeAt(i) - 64); return n; }
// célula da coluna-chave k na linha r (ex.: c('I_VALOR',4) -> 'P4')
function cel(k, r) { return COL[k] + r; }
// intervalo absoluto da coluna-chave k em VENDAS
function RG(k) { return 'VENDAS!$' + COL[k] + '$' + FIRST_ROW + ':$' + COL[k] + '$' + LAST_ROW; }
function spark(valExpr, color) {
  return 'SPARKLINE(' + valExpr + ',{"charttype","bar";"max",1;"color1","' + color + '";"empty","zero"})';
}
function barFormula(rr, cor) { return '=IF($C' + rr + '="","",' + spark('$C' + rr, cor) + ')'; }

/* ================================================================================
 *  ABA CONFIG
 * ================================================================================ */
function construirCONFIG(sh) {
  sh.getRange('A1:J1').merge().setValue('CONFIGURAÇÕES & RESUMO — MAGIWAY')
    .setBackground(PAL.base).setFontColor('#FFFFFF').setFontWeight('bold').setFontSize(13)
    .setHorizontalAlignment('center');

  sh.getRange('A3').setValue('META MENSAL DE FATURAMENTO:').setFontWeight('bold');
  sh.getRange('B3').setValue(50000).setBackground(TINT.pct).setNumberFormat('#,##0.00').setFontWeight('bold');
  sh.getRange('C3').setValue('◀ usada na coluna "% DA META" do PAINEL (edite aqui)');

  sh.getRange('A5').setValue('RESUMO GERAL (atualiza sozinho)').setFontWeight('bold').setBackground('#E8EAF6');
  var resumo = [
    ['Total de Vendas:',   '=SUMPRODUCT(--(((' + RG('I_VALOR') + '>0)+(' + RG('F_TOTAL') + '>0))>0))'],
    ['Faturamento Total:', '=SUM(' + RG('I_VALOR') + ')+SUM(' + RG('F_TOTAL') + ')'],
    ['Total Já Recebido:', recebidoFormula()],
    ['Total em Aberto:',   '=B7-B8'],
    ['Comissão Total:',    '=SUM(' + RG('I_COM') + ')+SUM(' + RG('F_COM') + ')'],
    ['Vendas QUITADAS:',   quitadasFormula()],
    ['Vendas PARCIAIS:',   parciaisFormula()],
    ['Vendas EM ABERTO:',  '=B6-B11-B12']
  ];
  sh.getRange(6, 1, resumo.length, 2).setValues(resumo);
  sh.getRange('A6:A13').setFontWeight('bold');
  sh.getRange('B7:B10').setNumberFormat('#,##0.00');

  escreverLista(sh, 'E', 'CATEGORIAS', CATEGORIAS);
  escreverLista(sh, 'F', 'VENDEDORES', VENDEDORES);
  escreverLista(sh, 'G', 'LOCAIS RET./DEV.', LOCAIS);
  escreverLista(sh, 'H', 'FORMAS DE PGTO', FORMAS);
  escreverLista(sh, 'I', '% COMISSÃO', COMISSOES);
  escreverLista(sh, 'J', 'MOEDAS', MOEDAS);

  sh.setColumnWidth(1, 230); sh.setColumnWidth(2, 130);
  for (var c = 5; c <= 10; c++) sh.setColumnWidth(c, 170);
  sh.setFrozenRows(1);
}
function escreverLista(sh, col, titulo, itens) {
  sh.getRange(col + '4').setValue(titulo).setFontWeight('bold')
    .setBackground(PAL.navy).setFontColor('#FFFFFF').setHorizontalAlignment('center');
  sh.getRange(col + '5:' + col + (4 + itens.length)).setValues(itens.map(function (x) { return [x]; }));
}

/* ================================================================================
 *  ABA VENDAS
 * ================================================================================ */
function construirVENDAS(sh) {
  var ss = sh.getParent();
  garantirColunas(sh, TOTAL_COLS);
  var header3 = definirColunas();   // garante COL/TOTAL_COLS e devolve os cabeçalhos

  // Faixas de grupo (linha 2) + cabeçalhos (linha 3)
  var start = 1;
  GRUPOS.forEach(function (g) {
    var span = g.cols.length;
    sh.getRange(2, start, 1, span).merge().setValue(g.t)
      .setBackground(g.cor).setFontColor('#FFFFFF').setFontWeight('bold')
      .setHorizontalAlignment('center').setVerticalAlignment('middle');
    start += span;
  });
  sh.getRange(1, 1, 1, TOTAL_COLS).merge().setValue('MAGIWAY   •   CONTROLE DE VENDAS')
    .setBackground(PAL.base).setFontColor('#FFFFFF').setFontWeight('bold').setFontSize(15)
    .setHorizontalAlignment('center');
  sh.getRange(3, 1, 1, TOTAL_COLS).setValues([header3])
    .setFontWeight('bold').setBackground(PAL.navy).setFontColor('#FFFFFF')
    .setWrap(true).setVerticalAlignment('middle').setHorizontalAlignment('center');
  sh.setRowHeight(1, 30); sh.setRowHeight(2, 26); sh.setRowHeight(3, 50);

  /* ---- Fórmulas automáticas ---- */
  colFormula(sh, 'DIARIAS', function (r) { return '=IF(AND(' + cel('DT_RET',r) + '<>"",' + cel('DT_DEV',r) + '<>""),' + cel('DT_DEV',r) + '-' + cel('DT_RET',r) + ',"")'; });
  colFormula(sh, 'I_COM',  function (r) { return '=IF(AND(' + cel('I_VALOR',r) + '<>"",' + cel('I_VALOR',r) + '>0,' + cel('I_PCT',r) + '<>""),' + cel('I_VALOR',r) + '*' + cel('I_PCT',r) + '/100,"")'; });
  colFormula(sh, 'F_TOTAL',function (r) { return '=' + cel('E_VALOR',r) + '+' + cel('P1_VALOR',r) + '+' + cel('P2_VALOR',r) + '+' + cel('P3_VALOR',r) + '+' + cel('P4_VALOR',r); });
  colFormula(sh, 'F_COM',  function (r) { return '=IF(AND(' + cel('F_TOTAL',r) + '>0,' + cel('F_PCT',r) + '<>""),' + cel('F_TOTAL',r) + '*' + cel('F_PCT',r) + '/100,"")'; });
  colFormula(sh, 'F_PROX', proximoPagamento);
  colFormula(sh, 'F_PAGOPCT', function (r) { return '=IFERROR(' + pagoFrac(r) + '/' + cel('F_TOTAL',r) + ',0)'; });
  colFormula(sh, 'F_PROG', function (r) { return '=IF(' + cel('F_TOTAL',r) + '=0,"",' + spark(cel('F_PAGOPCT',r), COR.barra) + ')'; });
  colFormula(sh, 'E_PROG',  function (r) { return barra(r, somaPagas(r, ['E'])); });
  colFormula(sh, 'P1_PROG', function (r) { return barra(r, somaPagas(r, ['E','P1'])); });
  colFormula(sh, 'P2_PROG', function (r) { return barra(r, somaPagas(r, ['E','P1','P2'])); });
  colFormula(sh, 'P3_PROG', function (r) { return barra(r, somaPagas(r, ['E','P1','P2','P3'])); });
  colFormula(sh, 'P4_PROG', function (r) { return barra(r, somaPagas(r, ['E','P1','P2','P3','P4'])); });

  /* ---- Menus suspensos (todos com seta) ---- */
  vRange(ss, sh, 'VENDEDOR',  'CONFIG!F5:F' + (4 + VENDEDORES.length));
  vRange(ss, sh, 'CATEGORIA', 'CONFIG!E5:E' + (4 + CATEGORIAS.length));
  vRange(ss, sh, 'MOEDA',     'CONFIG!J5:J' + (4 + MOEDAS.length));
  vRange(ss, sh, 'LOC_RET',   'CONFIG!G5:G' + (4 + LOCAIS.length));
  vRange(ss, sh, 'LOC_DEV',   'CONFIG!G5:G' + (4 + LOCAIS.length));
  vRange(ss, sh, 'I_PCT',     'CONFIG!I5:I' + (4 + COMISSOES.length));
  vRange(ss, sh, 'F_PCT',     'CONFIG!I5:I' + (4 + COMISSOES.length));
  ['I_FORMA','E_FORMA','P1_FORMA','P2_FORMA','P3_FORMA','P4_FORMA'].forEach(function (k) {
    vRange(ss, sh, k, 'CONFIG!H5:H' + (4 + FORMAS.length));
  });
  ['I_PAGO','E_PAGO','P1_PAGO','P2_PAGO','P3_PAGO','P4_PAGO'].forEach(function (k) { vLista(sh, k, SIMNAO); });
  ['I_ADD','E_ADD','P1_ADD','P2_ADD','P3_ADD','P4_ADD'].forEach(function (k) { vLista(sh, k, SIMNAO); });

  /* ---- Cor de cada TIPO de menu suspenso ---- */
  tint(sh, ['VENDEDOR'], TINT.vendedor);
  tint(sh, ['CATEGORIA'], TINT.categoria);
  tint(sh, ['MOEDA'], TINT.moeda);
  tint(sh, ['LOC_RET','LOC_DEV'], TINT.local);
  tint(sh, ['I_FORMA','E_FORMA','P1_FORMA','P2_FORMA','P3_FORMA','P4_FORMA'], TINT.forma);
  tint(sh, ['I_PCT','F_PCT'], TINT.pct);
  tint(sh, ['I_PAGO','E_PAGO','P1_PAGO','P2_PAGO','P3_PAGO','P4_PAGO'], TINT.pago);
  tint(sh, ['I_ADD','E_ADD','P1_ADD','P2_ADD','P3_ADD','P4_ADD'], TINT.add);
  tint(sh, ['DIARIAS','I_COM','F_TOTAL','F_COM','F_PROX','F_PAGOPCT','F_PROG',
            'E_PROG','P1_PROG','P2_PROG','P3_PROG','P4_PROG'], COR.auto);

  /* ---- Formatos ---- */
  fmt(sh, ['I_VALOR','E_VALOR','P1_VALOR','P2_VALOR','P3_VALOR','P4_VALOR'], '#,##0.00');
  fmt(sh, ['I_COM','F_TOTAL','F_COM'], '#,##0.00;;');
  fmt(sh, ['I_PCT','F_PCT'], '0"%"');
  fmt(sh, ['F_PAGOPCT'], '0%;;');
  fmt(sh, ['DIARIAS'], '0;;');
  fmt(sh, ['DATA','DT_RET','DT_DEV','I_DATA','F_PROX','E_DATA','P1_DATA','P2_DATA','P3_DATA','P4_DATA'], 'dd/mm/yyyy');

  /* ---- Cor automática da LINHA inteira ---- */
  var alvo = [sh.getRange('A' + FIRST_ROW + ':' + L(TOTAL_COLS) + LAST_ROW)];
  var A = '$' + COL.NUM + '4', IV = '$' + COL.I_VALOR + '4', FT = '$' + COL.F_TOTAL + '4',
      IP = '$' + COL.I_PAGO + '4', AC = '$' + COL.F_PAGOPCT + '4', PX = '$' + COL.F_PROX + '4',
      ID = '$' + COL.I_DATA + '4';
  var ativo   = '(OR(' + A + '<>"",' + IV + '>0,' + FT + '>0))';
  var quitado = '(OR(AND(' + IV + '>0,' + IP + '="SIM"),AND(' + FT + '>0,' + AC + '>=1)))';
  var verde = SpreadsheetApp.newConditionalFormatRule()
    .whenFormulaSatisfied('=AND(' + ativo + ',' + quitado + ')').setBackground(COR.verde).setRanges(alvo).build();
  var vermelho = SpreadsheetApp.newConditionalFormatRule()
    .whenFormulaSatisfied('=AND(' + ativo + ',NOT(' + quitado + '),OR(AND(' + FT + '>0,' + PX + '<>"",' + PX + '<TODAY()),AND(' + IV + '>0,' + ID + '<>"",' + ID + '<TODAY(),' + IP + '<>"SIM")))')
    .setBackground(COR.vermelho).setRanges(alvo).build();
  var azul = SpreadsheetApp.newConditionalFormatRule()
    .whenFormulaSatisfied('=AND(' + ativo + ',' + FT + '>0,' + AC + '<1,NOT(AND(' + PX + '<>"",' + PX + '<TODAY())))')
    .setBackground(COR.azul).setRanges(alvo).build();
  sh.setConditionalFormatRules([verde, vermelho, azul]);

  /* ---- Larguras, bordas, congelamento ---- */
  larg(sh, 'NUM', 70); larg(sh, 'CLIENTE', 170); larg(sh, 'OBS', 220);
  larg(sh, 'I_ADD', 200); larg(sh, 'E_ADD', 200);
  ['F_PROG','E_PROG','P1_PROG','P2_PROG','P3_PROG','P4_PROG'].forEach(function (k) { larg(sh, k, 130); });
  ['P1_ADD','P2_ADD','P3_ADD','P4_ADD'].forEach(function (k) { larg(sh, k, 200); });

  sh.getRange(1, 1, 3, TOTAL_COLS).setBorder(true, true, true, true, true, true, '#FFFFFF', SpreadsheetApp.BorderStyle.SOLID);
  sh.getRange(FIRST_ROW, 1, NUM_LINHAS, TOTAL_COLS)
    .setBorder(true, true, true, true, true, true, '#D8DAE5', SpreadsheetApp.BorderStyle.SOLID)
    .setVerticalAlignment('middle');
  // Só linhas congeladas (título mesclado por toda a largura impede congelar colunas).
  sh.setFrozenRows(3);
}

/* ---- helpers de VENDAS ---- */
function colFormula(sh, chave, fn) {
  var arr = [];
  for (var r = FIRST_ROW; r <= LAST_ROW; r++) arr.push([fn(r)]);
  sh.getRange(FIRST_ROW, num(COL[chave]), NUM_LINHAS, 1).setValues(arr);
}
function fmt(sh, chaves, f) { chaves.forEach(function (k) { sh.getRange(FIRST_ROW, num(COL[k]), NUM_LINHAS, 1).setNumberFormat(f); }); }
function tint(sh, chaves, cor) { chaves.forEach(function (k) { sh.getRange(FIRST_ROW, num(COL[k]), NUM_LINHAS, 1).setBackground(cor); }); }
function larg(sh, chave, w) { sh.setColumnWidth(num(COL[chave]), w); }
function vLista(sh, chave, itens) {
  var dv = SpreadsheetApp.newDataValidation().requireValueInList(itens, true).setAllowInvalid(false).build();
  sh.getRange(FIRST_ROW, num(COL[chave]), NUM_LINHAS, 1).setDataValidation(dv);
}
function vRange(ss, sh, chave, rangeA1) {
  var dv = SpreadsheetApp.newDataValidation().requireValueInRange(ss.getRange(rangeA1), true).setAllowInvalid(false).build();
  sh.getRange(FIRST_ROW, num(COL[chave]), NUM_LINHAS, 1).setDataValidation(dv);
}
// soma paga acumulada até um conjunto de blocos (para a barra de cada parcela)
function somaPagas(r, blocos) {
  return '(' + blocos.map(function (b) { return 'IF(' + cel(b + '_PAGO', r) + '="SIM",' + cel(b + '_VALOR', r) + ',0)'; }).join('+') + ')';
}
function pagoFrac(r) { return somaPagas(r, ['E','P1','P2','P3','P4']); }
function barra(r, pagoExpr) {
  return '=IF(' + cel('F_TOTAL', r) + '=0,"",' + spark('IFERROR(' + pagoExpr + '/' + cel('F_TOTAL', r) + ',0)', COR.barra) + ')';
}
function proximoPagamento(r) {
  var blocos = ['E','P1','P2','P3','P4'];
  var parts = blocos.map(function (b) {
    return 'IF(AND(' + cel(b + '_PAGO', r) + '<>"SIM",' + cel(b + '_DATA', r) + '<>""),' + cel(b + '_DATA', r) + ',10^9)';
  });
  var m = 'MIN(' + parts.join(',') + ')';
  return '=IF(' + cel('F_TOTAL', r) + '=0,"",IF(' + m + '>=10^9,"",' + m + '))';
}

/* ---- fórmulas de resumo (usadas em CONFIG e PAINEL) ---- */
function recebidoFormula() {
  var rec = ['SUMIF(' + RG('I_PAGO') + ',"SIM",' + RG('I_VALOR') + ')'];
  ['E','P1','P2','P3','P4'].forEach(function (b) {
    rec.push('SUMIF(' + RG(b + '_PAGO') + ',"SIM",' + RG(b + '_VALOR') + ')');
  });
  return '=' + rec.join('+');
}
function quitadasFormula() {
  return '=SUMPRODUCT(--(((' + RG('I_VALOR') + '>0)*(' + RG('I_PAGO') + '="SIM"))+((' + RG('F_TOTAL') + '>0)*(' + RG('F_PAGOPCT') + '>=1))>0))';
}
function parciaisFormula() {
  return '=SUMPRODUCT(--((' + RG('F_TOTAL') + '>0)*(' + RG('F_PAGOPCT') + '>0)*(' + RG('F_PAGOPCT') + '<1)))';
}
function formaRecebido(f) {
  var s = ['SUMIFS(' + RG('I_VALOR') + ',' + RG('I_FORMA') + ',"' + f + '",' + RG('I_PAGO') + ',"SIM")'];
  ['E','P1','P2','P3','P4'].forEach(function (b) {
    s.push('SUMIFS(' + RG(b + '_VALOR') + ',' + RG(b + '_FORMA') + ',"' + f + '",' + RG(b + '_PAGO') + ',"SIM")');
  });
  return '=' + s.join('+');
}

/* ================================================================================
 *  ABA PAINEL (somente barras percentuais)
 * ================================================================================ */
function construirPAINEL(sh) {
  var mes1 = 'DATE(YEAR(TODAY()),MONTH(TODAY()),1)';
  var base = [
    ['=SUM(' + RG('I_VALOR') + ')+SUM(' + RG('F_TOTAL') + ')'],                                    // J1 faturamento
    [recebidoFormula()],                                                                           // J2 recebido
    ['=$J$1-$J$2'],                                                                                 // J3 em aberto
    ['=SUM(' + RG('I_COM') + ')+SUM(' + RG('F_COM') + ')'],                                         // J4 comissão total
    ['=SUMPRODUCT(--(((' + RG('I_VALOR') + '>0)+(' + RG('F_TOTAL') + '>0))>0))'],                   // J5 nº vendas
    [quitadasFormula()],                                                                           // J6 quitadas
    [parciaisFormula()],                                                                           // J7 parciais
    ['=$J$5-$J$6-$J$7'],                                                                            // J8 em aberto (qtd)
    ['=SUMPRODUCT(--((' + RG('F_TOTAL') + '>0)*(' + RG('F_PAGOPCT') + '<1)))'],                     // J9 fracionadas ativas
    ['=SUMPRODUCT(--((' + RG('F_TOTAL') + '>0)*(' + RG('F_PAGOPCT') + '<1)*(' + RG('F_PROX') + '<>"")*(' + RG('F_PROX') + '<TODAY())))'], // J10 atrasadas
    ['=$J$9-$J$10'],                                                                                // J11 em dia
    ['=CONFIG!$B$3'],                                                                               // J12 meta
    ['=SUMIFS(' + RG('I_VALOR') + ',' + RG('DATA') + ',">="&' + mes1 + ',' + RG('DATA') + ',"<="&EOMONTH(TODAY(),0))+SUMIFS(' + RG('F_TOTAL') + ',' + RG('DATA') + ',">="&' + mes1 + ',' + RG('DATA') + ',"<="&EOMONTH(TODAY(),0))'] // J13 fat mês
  ];
  sh.getRange(1, 10, base.length, 1).setValues(base);

  var rows = [], headerRows = [];
  function addRow(a, b, c, d) { rows.push([a || '', b || '', c || '', d || '']); return rows.length; }
  function secao(t) { headerRows.push(addRow(t, '', '', '')); }
  function ind(label, valFormula, pctFn, cor) {
    var rr = rows.length + 1;
    addRow(label, barFormula(rr, cor), pctFn(rr), valFormula);
  }

  addRow('PAINEL DE VENDAS — MAGIWAY', '', '', '');
  addRow('Todos os indicadores em barras percentuais.', '', '', '');
  addRow('', '', '', '');

  secao('INDICADORES GERAIS');
  ind('% Recebido',                '=$J$2',  function () { return '=IFERROR($J$2/$J$1,0)'; }, PAL.indigo);
  ind('% Em Aberto',               '=$J$3',  function () { return '=IFERROR($J$3/$J$1,0)'; }, PAL.indigo);
  ind('% Comissão s/ Faturamento', '=$J$4',  function () { return '=IFERROR($J$4/$J$1,0)'; }, PAL.indigo);
  ind('Taxa de Quitação',          '=$J$6',  function () { return '=IFERROR($J$6/$J$5,0)'; }, PAL.indigo);
  ind('% Vendas Parciais',         '=$J$7',  function () { return '=IFERROR($J$7/$J$5,0)'; }, PAL.indigo);
  ind('% Vendas Em Aberto',        '=$J$8',  function () { return '=IFERROR($J$8/$J$5,0)'; }, PAL.indigo);
  ind('% da Meta (mês atual)',     '=$J$13', function () { return '=IFERROR($J$13/$J$12,0)'; }, PAL.indigo);

  secao('SITUAÇÃO DAS RESERVAS FRACIONADAS');
  ind('% Fracionadas Em Dia',    '=$J$11', function () { return '=IFERROR($J$11/$J$9,0)'; }, PAL.navy);
  ind('% Fracionadas Atrasadas', '=$J$10', function () { return '=IFERROR($J$10/$J$9,0)'; }, PAL.dred);

  secao('FATURAMENTO POR VENDEDOR (% do total)');
  VENDEDORES.forEach(function (v) {
    ind(v, '=SUMIF(' + RG('VENDEDOR') + ',"' + v + '",' + RG('I_VALOR') + ')+SUMIF(' + RG('VENDEDOR') + ',"' + v + '",' + RG('F_TOTAL') + ')',
        function (rr) { return '=IFERROR($D' + rr + '/$J$1,0)'; }, PAL.navy);
  });

  secao('FATURAMENTO POR CATEGORIA (% do total)');
  CATEGORIAS.forEach(function (cat) {
    ind(cat, '=SUMIF(' + RG('CATEGORIA') + ',"' + cat + '",' + RG('I_VALOR') + ')+SUMIF(' + RG('CATEGORIA') + ',"' + cat + '",' + RG('F_TOTAL') + ')',
        function (rr) { return '=IFERROR($D' + rr + '/$J$1,0)'; }, PAL.indigo);
  });

  secao('RECEBIDO POR FORMA DE PAGAMENTO (% do recebido)');
  FORMAS.forEach(function (f) {
    ind(f, formaRecebido(f), function (rr) { return '=IFERROR($D' + rr + '/$J$2,0)'; }, '#4a2b6e');
  });

  secao('FATURAMENTO POR MOEDA (% do total)');
  MOEDAS.forEach(function (m) {
    ind(m, '=SUMIF(' + RG('MOEDA') + ',"' + m + '",' + RG('I_VALOR') + ')+SUMIF(' + RG('MOEDA') + ',"' + m + '",' + RG('F_TOTAL') + ')',
        function (rr) { return '=IFERROR($D' + rr + '/$J$1,0)'; }, PAL.navy);
  });

  secao('MODALIDADE (% das vendas)');
  var rInt = rows.length + 1, rFrac = rInt + 1;
  addRow('Integral', barFormula(rInt, PAL.indigo),
    '=IFERROR($D' + rInt + '/($D' + rInt + '+$D' + rFrac + '),0)', '=SUMPRODUCT(--(' + RG('I_VALOR') + '>0))');
  addRow('Fracionada', barFormula(rFrac, PAL.indigo),
    '=IFERROR($D' + rFrac + '/($D' + rInt + '+$D' + rFrac + '),0)', '=SUMPRODUCT(--(' + RG('F_TOTAL') + '>0))');

  sh.getRange(1, 1, rows.length, 4).setValues(rows);

  sh.getRange(1, 1, 1, 6).merge().setValue('PAINEL DE VENDAS — MAGIWAY')
    .setBackground(PAL.base).setFontColor('#FFFFFF').setFontWeight('bold').setFontSize(15).setHorizontalAlignment('center');
  sh.getRange(2, 1, 1, 6).merge().setFontColor('#555555').setFontStyle('italic').setHorizontalAlignment('center');
  headerRows.forEach(function (r) {
    sh.getRange(r, 1, 1, 4).merge().setBackground(PAL.navy).setFontColor('#FFFFFF').setFontWeight('bold').setHorizontalAlignment('left');
  });
  sh.getRange('C4:C' + rows.length).setNumberFormat('0.0%');
  sh.getRange('D4:D' + rows.length).setNumberFormat('#,##0.00;;');
  sh.getRange(3, 1).setValue('INDICADOR').setFontWeight('bold');
  sh.getRange(3, 2).setValue('BARRA %').setFontWeight('bold');
  sh.getRange(3, 3).setValue('%').setFontWeight('bold');
  sh.getRange(3, 4).setValue('VALOR').setFontWeight('bold');
  sh.setColumnWidth(1, 260); sh.setColumnWidth(2, 380); sh.setColumnWidth(3, 70); sh.setColumnWidth(4, 140);
  sh.hideColumns(10);
  sh.setFrozenRows(3);
}

/* ================================================================================
 *  ABA COMO USAR
 * ================================================================================ */
function construirCOMOUSAR(sh) {
  var linhas = [
    ['📋  COMO USAR A PLANILHA DE VENDAS — MAGIWAY'],
    [''],
    ['Tudo é preenchido na aba VENDAS. Cada LINHA = uma reserva/venda. Comece na linha 4.'],
    ['As colunas com fundo CINZA são automáticas — não digite nelas.'],
    ['Todos os campos de escolha são MENUS SUSPENSOS (clique na seta). Cada tipo tem uma cor.'],
    [''],
    ['IDENTIFICAÇÃO DA VENDA'],
    ['Nº da venda, data, VENDEDOR (Dickson, Kevin ou Outros), cliente, WhatsApp, CATEGORIA e MOEDA.'],
    ['Categorias: SEDAN, SUV, MINIVAN 7L, MINIVAN 7L LIMITED, MINIVAN 8L, SUV FULL e MUSTANG.'],
    [''],
    ['PERÍODO & LOGÍSTICA'],
    ['Datas/horas/locais de retirada e devolução. A QTD. DE DIÁRIAS é calculada sozinha.'],
    [''],
    ['PAGAMENTO INTEGRAL (pago de uma vez)'],
    ['VALOR DO PAGAMENTO + % COMISSÃO (2/3/4/5%) ao lado; a COMISSÃO é automática. Marque PAGO? e ADICIONADO À PLANILHA DE FECHAMENTO DO VENDEDOR?.'],
    [''],
    ['PAGAMENTO FRACIONADO (entrada + parcelas)'],
    ['No RESUMO escolha o % COMISSÃO. VALOR TOTAL, COMISSÃO, % PAGO, PRÓXIMO PAGAMENTO e a BARRA DE PROGRESSO DA RESERVA são automáticos.'],
    ['Lance a ENTRADA e até 4 PARCELAS. Cada parcela tem sua BARRA DE PROGRESSO, que sobe conforme o valor pago até 100%.'],
    [''],
    ['CORES AUTOMÁTICAS DA LINHA'],
    ['🟩 VERDE = QUITADA (integral ou fracionada).'],
    ['🟥 VERMELHA = ATRASADA (passou a data do próximo pagamento sem marcar PAGO?).'],
    ['🟦 AZUL CLARO = FRACIONADA em dia (ainda não quitada, sem atraso).'],
    [''],
    ['ABA PAINEL'],
    ['Dashboard só com BARRAS PERCENTUAIS: recebido, em aberto, comissão, quitação, por vendedor, categoria, forma de pagamento, moeda, modalidade e % da meta.'],
    [''],
    ['ABA CONFIG'],
    ['Edite a META MENSAL e as listas (CATEGORIAS, VENDEDORES, LOCAIS, FORMAS, % COMISSÃO). O RESUMO GERAL soma tudo sozinho.'],
    [''],
    ['DICA: rode 🚗 MAGIWAY ▸ "Construir / Atualizar tudo" para recriar as abas quando quiser.']
  ];
  sh.getRange(2, 2, linhas.length, 1).setValues(linhas);
  sh.getRange('B2').setFontWeight('bold').setFontSize(14).setFontColor(PAL.base);
  [7, 11, 14, 17, 21, 26, 29].forEach(function (r) { sh.getRange(r, 2).setFontWeight('bold').setFontColor(PAL.indigo); });
  sh.setColumnWidth(1, 30); sh.setColumnWidth(2, 920);
}

/* ================================================================================
 *  LIMPAR DADOS (mantém as fórmulas automáticas)
 * ================================================================================ */
function limparDados() {
  var ui = SpreadsheetApp.getUi();
  if (ui.alert('Limpar dados', 'Apaga TODOS os dados digitados na aba VENDAS (fórmulas e formatos permanecem). Continuar?', ui.ButtonSet.YES_NO) !== ui.Button.YES) return;
  var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('VENDAS');
  if (!sh) { ui.alert('A aba VENDAS não existe. Rode "Construir / Atualizar tudo" primeiro.'); return; }
  definirColunas();
  var auto = ['DIARIAS','I_COM','F_TOTAL','F_COM','F_PROX','F_PAGOPCT','F_PROG','E_PROG','P1_PROG','P2_PROG','P3_PROG','P4_PROG'];
  var autoLetras = auto.map(function (k) { return COL[k]; });
  for (var c = 1; c <= TOTAL_COLS; c++) {
    if (autoLetras.indexOf(L(c)) === -1) sh.getRange(FIRST_ROW, c, NUM_LINHAS, 1).clearContent();
  }
  ui.alert('✅ Dados apagados. As fórmulas continuam ativas.');
}
