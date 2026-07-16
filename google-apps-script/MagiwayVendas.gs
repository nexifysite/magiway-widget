/************************************************************************************************
 *  MAGIWAY — CONTROLE DE VENDAS  (Google Apps Script)
 *  ---------------------------------------------------------------------------------------------
 *  Cole este script no editor de Apps Script da sua planilha (Extensões ▸ Apps Script),
 *  salve e recarregue a planilha. Um menu "🚗 MAGIWAY" aparece na barra superior.
 *  Clique em  "🔧 Construir / Atualizar tudo"  para montar (ou reconstruir) as abas:
 *      • VENDAS   • PAINEL   • CONFIG   • COMO USAR
 *
 *  O QUE ESTE SCRIPT FAZ (pedido do cliente):
 *   1) Ao lado do VALOR de cada PAGAMENTO INTEGRAL há um % de COMISSÃO (menu suspenso 2/3/4/5%)
 *      e a COMISSÃO já é calculada automaticamente.
 *   2) O PAGAMENTO FRACIONADO também tem % de COMISSÃO (2/3/4/5%) e comissão calculada.
 *   3) Cada PARCELA do pagamento fracionado tem uma BARRA DE PROGRESSO que enche conforme o
 *      valor efetivamente pago, até a quitação (100%).
 *   4) VENDEDORES em lista suspensa: DICKSON, KEVIN e OUTROS.
 *   5) Empresa MAGIWAY em todos os títulos.
 *   6) CATEGORIAS: SEDAN, SUV, MINIVAN 7L, MINIVAN 7L LIMITED, MINIVAN 8L, SUV FULL, MUSTANG.
 *   7) Removidos os campos MODELO do veículo e PLACA.
 *   8) O antigo "ALIMENTADO NO SISTEMA?" virou "ADICIONADO À PLANILHA DE FECHAMENTO DO VENDEDOR?".
 *   9) O PAINEL (dashboard) usa APENAS barras percentuais, com o máximo de indicadores possível.
 *  10) No fracionado há sempre a DATA DO PRÓXIMO PAGAMENTO. Cores automáticas da linha:
 *          VERMELHA  = pagamento atrasado
 *          VERDE     = reserva quitada (integral ou fracionada)
 *          AZUL CLARO= reserva fracionada em dia (ainda não quitada)
 *  11) Removidas as colunas de CONTROLE & ALERTAS.
 *  12) Removido o bloco VALORES & COMISSÃO antigo (substituído pela comissão por pagamento).
 *  13) Removido o bloco MODALIDADE & PROGRESSO antigo (substituído por barras + cores da linha).
 ************************************************************************************************/

/* ======================== CONFIGURAÇÕES GERAIS ======================== */
var FIRST_ROW  = 4;                       // primeira linha de dados
var NUM_LINHAS = 100;                      // quantidade de linhas de venda
var LAST_ROW   = FIRST_ROW + NUM_LINHAS - 1;

var COR = {
  titulo:      '#0B3D2E',   // verde escuro Magiway
  ident:       '#1B5E20',
  logistica:   '#00695C',
  integral:    '#1565C0',
  fracResumo:  '#6A1B9A',
  entrada:     '#283593',
  parcela:     '#37474F',
  auto:        '#ECEFF1',   // fundo cinza (campos automáticos)
  input:       '#FFFDE7',   // fundo amarelo claro (campos de digitação-chave)
  verde:       '#C6EFCE',   // linha quitada
  vermelho:    '#F4CCCC',   // linha atrasada
  azul:        '#CFE2F3',   // linha fracionada em dia
  barra:       '#16A34A'    // barra de progresso
};

var CATEGORIAS = ['SEDAN','SUV','MINIVAN 7L','MINIVAN 7L LIMITED','MINIVAN 8L','SUV FULL','MUSTANG'];
var VENDEDORES = ['Dickson','Kevin','Outros'];
var LOCAIS     = ['MCO','MIA','TAMPA','FLL','ENDEREÇO MCO','ENDEREÇO MIA','PORTO MIA'];
var FORMAS     = ['NOMAD (USD)','WISE (USD)','ZELLE (USD)','TRANSFERÊNCIA (USD)','CASH (USD)',
                  'C6 (USD)','LINK DE PAGAMENTO (USD)','PIX (BRL)','BOLETO (BRL)','CRÉDITO (BRL)'];
var COMISSOES  = [2,3,4,5];
var MOEDAS     = ['USD','BRL'];

/* ======================== MENU ======================== */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('🚗 MAGIWAY')
    .addItem('🔧 Construir / Atualizar tudo', 'construirTudo')
    .addSeparator()
    .addItem('🧹 Limpar dados (mantém fórmulas)', 'limparDados')
    .addItem('ℹ️ Sobre este script', 'sobre')
    .addToUi();
}

function sobre() {
  SpreadsheetApp.getUi().alert(
    'MAGIWAY — Controle de Vendas\n\n' +
    'Use "Construir / Atualizar tudo" para montar as abas VENDAS, PAINEL, CONFIG e COMO USAR.\n\n' +
    'Comissão por pagamento (2/3/4/5%), barras de progresso nas parcelas, cores automáticas ' +
    'na linha (verde=quitado, vermelho=atrasado, azul=fracionado em dia) e painel só com barras.');
}

/* ======================== ORQUESTRADOR ======================== */
function construirTudo() {
  var ui = SpreadsheetApp.getUi();
  var resp = ui.alert('MAGIWAY — Construir / Atualizar',
    'Isto vai CRIAR ou RECONSTRUIR as abas VENDAS, PAINEL, CONFIG e COMO USAR.\n\n' +
    '⚠️ Os dados já digitados na aba VENDAS serão substituídos. Faça uma cópia antes se precisar.\n\nDeseja continuar?',
    ui.ButtonSet.YES_NO);
  if (resp !== ui.Button.YES) return;
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  construirCONFIG(ss);   // primeiro: as listas alimentam as validações de VENDAS
  construirVENDAS(ss);
  construirPAINEL(ss);
  construirCOMOUSAR(ss);
  // ordena as abas
  ordenar(ss, ['COMO USAR','VENDAS','PAINEL','CONFIG']);
  ss.setActiveSheet(getSheet(ss,'VENDAS'));
  SpreadsheetApp.getUi().alert('✅ Planilha MAGIWAY construída/atualizada com sucesso!');
}

/* ======================== UTILIDADES ======================== */
function getSheet(ss, name) {
  var sh = ss.getSheetByName(name);
  if (!sh) sh = ss.insertSheet(name);
  return sh;
}
function ordenar(ss, ordem) {
  for (var i = 0; i < ordem.length; i++) {
    var sh = ss.getSheetByName(ordem[i]);
    if (sh) { ss.setActiveSheet(sh); ss.moveActiveSheet(i + 1); }
  }
}
// número da coluna -> letra (1->A, 27->AA ...)
function L(n) {
  var s = '';
  while (n > 0) { var m = (n - 1) % 26; s = String.fromCharCode(65 + m) + s; n = (n - m - 1) / 26; }
  return s;
}
// intervalo absoluto de uma coluna de VENDAS (ex.: VENDAS!$P$4:$P$103)
function RNG(col) { return 'VENDAS!$' + col + '$' + FIRST_ROW + ':$' + col + '$' + LAST_ROW; }
// barra sparkline
function spark(valExpr, color) {
  return 'SPARKLINE(' + valExpr + ',{"charttype","bar";"max",1;"color1","' + color + '";"empty","zero"})';
}
// barra de um indicador do PAINEL: lê o % da coluna C da própria linha
function barFormula(rr, cor) {
  return '=IF($C' + rr + '="","",' + spark('$C' + rr, cor) + ')';
}

/* ================================================================================
 *  ABA  CONFIG
 * ================================================================================ */
function construirCONFIG(ss) {
  var sh = getSheet(ss, 'CONFIG');
  sh.clear();
  sh.getDataRange().clearDataValidations && sh.getRange(1,1,sh.getMaxRows(),sh.getMaxColumns()).clearDataValidations();

  // Título
  sh.getRange('A1:J1').merge().setValue('CONFIGURAÇÕES & RESUMO — MAGIWAY')
    .setBackground(COR.titulo).setFontColor('#FFFFFF').setFontWeight('bold').setFontSize(13)
    .setHorizontalAlignment('center');

  // Meta mensal (célula amarela editável)
  sh.getRange('A3').setValue('META MENSAL DE FATURAMENTO:').setFontWeight('bold');
  sh.getRange('B3').setValue(50000).setBackground(COR.input).setNumberFormat('#,##0.00')
    .setFontWeight('bold');
  sh.getRange('C3').setValue('◀ usada na coluna "% DA META" do PAINEL (edite aqui)');

  // Resumo geral (automático)
  sh.getRange('A5').setValue('RESUMO GERAL (atualiza sozinho)').setFontWeight('bold')
    .setBackground('#E8F5E9');
  var resumo = [
    ['Total de Vendas:',      '=SUMPRODUCT(--(((' + RNG('P') + '>0)+(' + RNG('Y') + '>0))>0))'],
    ['Faturamento Total:',    '=SUM(' + RNG('P') + ')+SUM(' + RNG('Y') + ')'],
    ['Total Já Recebido:',    recebidoFormula()],
    ['Total em Aberto:',      '=B7-B8'],
    ['Comissão Total:',       '=SUM(' + RNG('R') + ')+SUM(' + RNG('AA') + ')'],
    ['Vendas QUITADAS:',      quitadasFormula()],
    ['Vendas PARCIAIS:',      parciaisFormula()],
    ['Vendas EM ABERTO:',     '=B6-B11-B12']
  ];
  sh.getRange(6, 1, resumo.length, 2).setValues(resumo);
  sh.getRange('A6:A13').setFontWeight('bold');
  sh.getRange('B7:B8').setNumberFormat('#,##0.00');
  sh.getRange('B9').setNumberFormat('#,##0.00');
  sh.getRange('B10').setNumberFormat('#,##0.00');

  // Listas (usadas nas validações da aba VENDAS)
  escreverLista(sh, 'E', 'CATEGORIAS', CATEGORIAS);
  escreverLista(sh, 'F', 'VENDEDORES', VENDEDORES);
  escreverLista(sh, 'G', 'LOCAIS RET./DEV.', LOCAIS);
  escreverLista(sh, 'H', 'FORMAS DE PGTO', FORMAS);
  escreverLista(sh, 'I', '% COMISSÃO', COMISSOES);
  escreverLista(sh, 'J', 'MOEDAS', MOEDAS);

  sh.setColumnWidth(1, 230);
  sh.setColumnWidth(2, 130);
  for (var c = 5; c <= 10; c++) sh.setColumnWidth(c, 170);
  sh.setFrozenRows(1);
}

function escreverLista(sh, col, titulo, itens) {
  sh.getRange(col + '4').setValue(titulo).setFontWeight('bold')
    .setBackground('#263238').setFontColor('#FFFFFF').setHorizontalAlignment('center');
  var arr = itens.map(function (x) { return [x]; });
  sh.getRange(col + '5:' + col + (4 + itens.length)).setValues(arr);
}

/* ================================================================================
 *  ABA  VENDAS
 * ================================================================================ */
function construirVENDAS(ss) {
  var sh = getSheet(ss, 'VENDAS');
  sh.clear();
  sh.getRange(1, 1, sh.getMaxRows(), sh.getMaxColumns()).clearDataValidations().clearFormat();
  var rules = sh.getConditionalFormatRules(); if (rules.length) sh.clearConditionalFormatRules();

  /* ---- Grupos de colunas ---- */
  var grupos = [
    { titulo: 'IDENTIFICAÇÃO DA VENDA', cor: COR.ident, cols: [
        'Nº DA VENDA','DATA DA VENDA','VENDEDOR','NOME DO CLIENTE','Nº DO CLIENTE (WhatsApp)',
        'CATEGORIA VENDIDA','MOEDA'] },
    { titulo: 'PERÍODO & LOGÍSTICA', cor: COR.logistica, cols: [
        'DATA RETIRADA','HORA RETIRADA','LOCAL RETIRADA','DATA DEVOLUÇÃO','HORA DEVOLUÇÃO',
        'LOCAL DEVOLUÇÃO','QTD. DE DIÁRIAS','OBSERVAÇÃO P/ LOGÍSTICA'] },
    { titulo: 'PAGAMENTO INTEGRAL', cor: COR.integral, cols: [
        'VALOR DO PAGAMENTO','% COMISSÃO','COMISSÃO','DATA DO PGTO','FORMA DE PAGAMENTO',
        'Nº PARCELAS (crédito)','PAGO?','ADICIONADO À PLANILHA DE FECHAMENTO DO VENDEDOR?','RECIBO'] },
    { titulo: 'PAGAMENTO FRACIONADO — RESUMO', cor: COR.fracResumo, cols: [
        'VALOR TOTAL (FRACIONADO)','% COMISSÃO','COMISSÃO','PRÓXIMO PAGAMENTO','% PAGO (FRACIONADO)'] },
    { titulo: 'ENTRADA (FRACIONADA)', cor: COR.entrada, cols: [
        'VALOR DA ENTRADA','DATA DA ENTRADA','FORMA DE PAGAMENTO','PROGRESSO','PAGO?',
        'ADICIONADO À PLANILHA DE FECHAMENTO DO VENDEDOR?','RECIBO'] },
    { titulo: 'PARCELA 1 (DO REMANESCENTE)', cor: COR.parcela, cols: parcelaCols() },
    { titulo: 'PARCELA 2 (DO REMANESCENTE)', cor: COR.parcela, cols: parcelaCols() },
    { titulo: 'PARCELA 3 (DO REMANESCENTE)', cor: COR.parcela, cols: parcelaCols() },
    { titulo: 'PARCELA 4 (DO REMANESCENTE)', cor: COR.parcela, cols: parcelaCols() }
  ];

  // Cabeçalhos (linha 3) e faixas de grupo (linha 2)
  var header3 = [];
  var start = 1;
  grupos.forEach(function (g) {
    var span = g.cols.length;
    sh.getRange(2, start, 1, span).merge().setValue(g.titulo)
      .setBackground(g.cor).setFontColor('#FFFFFF').setFontWeight('bold')
      .setHorizontalAlignment('center').setVerticalAlignment('middle');
    header3 = header3.concat(g.cols);
    start += span;
  });
  var totalCols = header3.length; // 64

  // Título geral (linha 1)
  sh.getRange(1, 1, 1, totalCols).merge()
    .setValue('MAGIWAY   •   CONTROLE DE VENDAS')
    .setBackground(COR.titulo).setFontColor('#FFFFFF').setFontWeight('bold').setFontSize(15)
    .setHorizontalAlignment('center');

  // Linha 3 (nomes das colunas)
  sh.getRange(3, 1, 1, totalCols).setValues([header3])
    .setFontWeight('bold').setBackground('#455A64').setFontColor('#FFFFFF')
    .setWrap(true).setVerticalAlignment('middle').setHorizontalAlignment('center');
  sh.setRowHeight(2, 26); sh.setRowHeight(3, 48);

  /* ---- Fórmulas automáticas (uma coluna de cada vez, deixando os campos de digitação em branco) ---- */
  escreverFormulaColuna(sh, 'N',  function (r) { return '=IF(AND(H'+r+'<>"",K'+r+'<>""),K'+r+'-H'+r+',"")'; });                       // Diárias
  escreverFormulaColuna(sh, 'R',  function (r) { return '=IF(AND(P'+r+'<>"",P'+r+'>0,Q'+r+'<>""),P'+r+'*Q'+r+'/100,"")'; });          // Comissão integral
  escreverFormulaColuna(sh, 'Y',  function (r) { return '=AD'+r+'+AK'+r+'+AR'+r+'+AY'+r+'+BF'+r; });                                    // Total fracionado
  escreverFormulaColuna(sh, 'AA', function (r) { return '=IF(AND(Y'+r+'>0,Z'+r+'<>""),Y'+r+'*Z'+r+'/100,"")'; });                       // Comissão fracionada
  escreverFormulaColuna(sh, 'AB', proximoPagamento);                                                                                    // Próximo pagamento
  escreverFormulaColuna(sh, 'AC', function (r) { return '=IFERROR('+pagoFrac(r)+'/Y'+r+',0)'; });                                       // % pago fracionado
  escreverFormulaColuna(sh, 'AG', function (r) { return barra(r, '(IF(AH'+r+'="SIM",AD'+r+',0))'); });                                  // Progresso entrada
  escreverFormulaColuna(sh, 'AN', function (r) { return barra(r, '(IF(AH'+r+'="SIM",AD'+r+',0)+IF(AO'+r+'="SIM",AK'+r+',0))'); });      // Progresso parc.1
  escreverFormulaColuna(sh, 'AU', function (r) { return barra(r, '(IF(AH'+r+'="SIM",AD'+r+',0)+IF(AO'+r+'="SIM",AK'+r+',0)+IF(AV'+r+'="SIM",AR'+r+',0))'); });
  escreverFormulaColuna(sh, 'BB', function (r) { return barra(r, '(IF(AH'+r+'="SIM",AD'+r+',0)+IF(AO'+r+'="SIM",AK'+r+',0)+IF(AV'+r+'="SIM",AR'+r+',0)+IF(BC'+r+'="SIM",AY'+r+',0))'); });
  escreverFormulaColuna(sh, 'BI', function (r) { return barra(r, pagoFrac(r)); });                                                      // Progresso parc.4 (=total)

  /* ---- Validações (listas suspensas) ---- */
  aplicarValidacaoRange(ss, sh, 'C',  'CONFIG!F5:F' + (4 + VENDEDORES.length));      // Vendedor
  aplicarValidacaoRange(ss, sh, 'F',  'CONFIG!E5:E' + (4 + CATEGORIAS.length));      // Categoria
  aplicarValidacaoRange(ss, sh, 'G',  'CONFIG!J5:J' + (4 + MOEDAS.length));          // Moeda
  aplicarValidacaoRange(ss, sh, 'J',  'CONFIG!G5:G' + (4 + LOCAIS.length));          // Local retirada
  aplicarValidacaoRange(ss, sh, 'M',  'CONFIG!G5:G' + (4 + LOCAIS.length));          // Local devolução
  aplicarValidacaoRange(ss, sh, 'Q',  'CONFIG!I5:I' + (4 + COMISSOES.length));       // % comissão integral
  aplicarValidacaoRange(ss, sh, 'Z',  'CONFIG!I5:I' + (4 + COMISSOES.length));       // % comissão fracionada
  ['T','AF','AM','AT','BA','BH'].forEach(function (c) {                              // Formas de pagamento
    aplicarValidacaoRange(ss, sh, c, 'CONFIG!H5:H' + (4 + FORMAS.length));
  });
  ['V','AH','AO','AV','BC','BJ'].forEach(function (c) { aplicarValidacaoLista(sh, c, ['SIM','NÃO']); }); // PAGO?
  ['W','AI','AP','AW','BD','BK'].forEach(function (c) { aplicarValidacaoLista(sh, c, ['SIM','NÃO']); }); // ADICIONADO?

  /* ---- Formatos numéricos ---- */
  fmt(sh, ['P','R','Y','AA','AD','AK','AR','AY','BF'], '#,##0.00');
  fmt(sh, ['R','Y','AA'], '#,##0.00;;');                         // esconde zero nos automáticos
  fmt(sh, ['Q','Z'], '0"%"');                                    // 2 -> 2%
  fmt(sh, ['AC'], '0%;;');                                       // % pago (esconde zero)
  fmt(sh, ['N'], '0;;');                                         // diárias
  fmt(sh, ['B','H','K','S','AE','AL','AS','AZ','BG','AB'], 'dd/mm/yyyy');

  /* ---- Sombreamento: automáticos (cinza) e chave (amarelo) ---- */
  ['N','R','Y','AA','AB','AC','AG','AN','AU','BB','BI'].forEach(function (c) {
    sh.getRange(FIRST_ROW, letra2num(c), NUM_LINHAS, 1).setBackground(COR.auto);
  });
  ['Q','Z'].forEach(function (c) {
    sh.getRange(FIRST_ROW, letra2num(c), NUM_LINHAS, 1).setBackground(COR.input);
  });

  /* ---- Formatação condicional: cor da LINHA inteira ---- */
  var alvo = [sh.getRange('A' + FIRST_ROW + ':' + L(totalCols) + LAST_ROW)];
  var ativo = '(OR($A4<>"",$P4>0,$Y4>0))';
  var quitado = '(OR(AND($P4>0,$V4="SIM"),AND($Y4>0,$AC4>=1)))';
  var verde = SpreadsheetApp.newConditionalFormatRule()
    .whenFormulaSatisfied('=AND(' + ativo + ',' + quitado + ')')
    .setBackground(COR.verde).setRanges(alvo).build();
  var vermelho = SpreadsheetApp.newConditionalFormatRule()
    .whenFormulaSatisfied('=AND(' + ativo + ',NOT(' + quitado + '),OR(AND($Y4>0,$AB4<>"",$AB4<TODAY()),AND($P4>0,$S4<>"",$S4<TODAY(),$V4<>"SIM")))')
    .setBackground(COR.vermelho).setRanges(alvo).build();
  var azul = SpreadsheetApp.newConditionalFormatRule()
    .whenFormulaSatisfied('=AND(' + ativo + ',$Y4>0,$AC4<1,NOT(AND($AB4<>"",$AB4<TODAY())))')
    .setBackground(COR.azul).setRanges(alvo).build();
  sh.setConditionalFormatRules([verde, vermelho, azul]); // ordem = prioridade

  /* ---- Larguras / congelamento ---- */
  sh.setColumnWidth(letra2num('A'), 80);
  sh.setColumnWidth(letra2num('D'), 170);
  sh.setColumnWidth(letra2num('H'), 90);
  sh.setColumnWidth(letra2num('W'), 190);
  ['AG','AN','AU','BB','BI'].forEach(function (c) { sh.setColumnWidth(letra2num(c), 130); });
  ['AI','AP','AW','BD','BK'].forEach(function (c) { sh.setColumnWidth(letra2num(c), 190); });
  sh.setFrozenRows(3);
  // Obs.: não congelamos colunas — o título e as faixas de grupo são mesclados por toda a
  // largura, e o Google Sheets não permite mesclar cruzando a fronteira de colunas congeladas.
  sh.getRange(FIRST_ROW, 1, NUM_LINHAS, totalCols).setVerticalAlignment('middle');
}

/* ---- helpers de VENDAS ---- */
function parcelaCols() {
  return ['VALOR DO PGTO','DATA DO PGTO','FORMA DE PAGAMENTO','PROGRESSO','PAGO?',
          'ADICIONADO À PLANILHA DE FECHAMENTO DO VENDEDOR?','RECIBO'];
}
function letra2num(col) {
  var n = 0; for (var i = 0; i < col.length; i++) n = n * 26 + (col.charCodeAt(i) - 64); return n;
}
function escreverFormulaColuna(sh, col, fn) {
  var arr = [];
  for (var r = FIRST_ROW; r <= LAST_ROW; r++) arr.push([fn(r)]);
  sh.getRange(FIRST_ROW, letra2num(col), NUM_LINHAS, 1).setValues(arr);
}
function fmt(sh, cols, format) {
  cols.forEach(function (c) { sh.getRange(FIRST_ROW, letra2num(c), NUM_LINHAS, 1).setNumberFormat(format); });
}
function aplicarValidacaoLista(sh, col, itens) {
  var dv = SpreadsheetApp.newDataValidation().requireValueInList(itens, true).setAllowInvalid(false).build();
  sh.getRange(FIRST_ROW, letra2num(col), NUM_LINHAS, 1).setDataValidation(dv);
}
function aplicarValidacaoRange(ss, sh, col, rangeA1) {
  var rng = ss.getRange(rangeA1);
  var dv = SpreadsheetApp.newDataValidation().requireValueInRange(rng, true).setAllowInvalid(false).build();
  sh.getRange(FIRST_ROW, letra2num(col), NUM_LINHAS, 1).setDataValidation(dv);
}
// soma paga (fracionado) na linha r
function pagoFrac(r) {
  return '(IF(AH'+r+'="SIM",AD'+r+',0)+IF(AO'+r+'="SIM",AK'+r+',0)+IF(AV'+r+'="SIM",AR'+r+',0)+IF(BC'+r+'="SIM",AY'+r+',0)+IF(BJ'+r+'="SIM",BF'+r+',0))';
}
// barra de progresso proporcional ao total fracionado
function barra(r, pagoExpr) {
  return '=IF(Y'+r+'=0,"",' + spark('IFERROR('+pagoExpr+'/Y'+r+',0)', COR.barra) + ')';
}
// data do próximo pagamento em aberto (fracionado)
function proximoPagamento(r) {
  var m = 'MIN(' +
    'IF(AND(AH'+r+'<>"SIM",AE'+r+'<>""),AE'+r+',10^9),' +
    'IF(AND(AO'+r+'<>"SIM",AL'+r+'<>""),AL'+r+',10^9),' +
    'IF(AND(AV'+r+'<>"SIM",AS'+r+'<>""),AS'+r+',10^9),' +
    'IF(AND(BC'+r+'<>"SIM",AZ'+r+'<>""),AZ'+r+',10^9),' +
    'IF(AND(BJ'+r+'<>"SIM",BG'+r+'<>""),BG'+r+',10^9))';
  return '=IF(Y'+r+'=0,"",IF('+m+'>=10^9,"",'+m+'))';
}

/* ---- fórmulas reaproveitadas (recebido / quitadas / parciais) ---- */
function recebidoFormula() {
  var recInt  = 'SUMIF(' + RNG('V') + ',"SIM",' + RNG('P') + ')';
  var recFrac = 'SUMIF(' + RNG('AH') + ',"SIM",' + RNG('AD') + ')' +
                '+SUMIF(' + RNG('AO') + ',"SIM",' + RNG('AK') + ')' +
                '+SUMIF(' + RNG('AV') + ',"SIM",' + RNG('AR') + ')' +
                '+SUMIF(' + RNG('BC') + ',"SIM",' + RNG('AY') + ')' +
                '+SUMIF(' + RNG('BJ') + ',"SIM",' + RNG('BF') + ')';
  return '=' + recInt + '+' + recFrac;
}
function quitadasFormula() {
  return '=SUMPRODUCT(--(((' + RNG('P') + '>0)*(' + RNG('V') + '="SIM"))+((' + RNG('Y') + '>0)*(' + RNG('AC') + '>=1))>0))';
}
function parciaisFormula() {
  return '=SUMPRODUCT(--((' + RNG('Y') + '>0)*(' + RNG('AC') + '>0)*(' + RNG('AC') + '<1)))';
}

/* ================================================================================
 *  ABA  PAINEL  (somente barras percentuais)
 * ================================================================================ */
function construirPAINEL(ss) {
  var sh = getSheet(ss, 'PAINEL');
  sh.clear();
  sh.getRange(1, 1, sh.getMaxRows(), sh.getMaxColumns()).clearFormat();
  var rules = sh.getConditionalFormatRules(); if (rules.length) sh.clearConditionalFormatRules();

  // Métricas-base ocultas na coluna J (referenciadas pelas barras)
  var base = [
    ['=SUM(' + RNG('P') + ')+SUM(' + RNG('Y') + ')'],                                   // J1 faturamento
    [recebidoFormula()],                                                                // J2 recebido
    ['=$J$1-$J$2'],                                                                      // J3 em aberto (R$)
    ['=SUM(' + RNG('R') + ')+SUM(' + RNG('AA') + ')'],                                   // J4 comissão total
    ['=SUMPRODUCT(--(((' + RNG('P') + '>0)+(' + RNG('Y') + '>0))>0))'],                  // J5 nº vendas
    [quitadasFormula()],                                                                // J6 quitadas
    [parciaisFormula()],                                                                // J7 parciais
    ['=$J$5-$J$6-$J$7'],                                                                 // J8 em aberto (qtd)
    ['=SUMPRODUCT(--((' + RNG('Y') + '>0)*(' + RNG('AC') + '<1)))'],                     // J9 fracionadas ativas
    ['=SUMPRODUCT(--((' + RNG('Y') + '>0)*(' + RNG('AC') + '<1)*(' + RNG('AB') + '<>"")*(' + RNG('AB') + '<TODAY())))'], // J10 atrasadas
    ['=$J$9-$J$10'],                                                                     // J11 em dia
    ['=CONFIG!$B$3'],                                                                    // J12 meta
    ['=SUMIFS(' + RNG('P') + ',' + RNG('B') + ',">="&DATE(YEAR(TODAY()),MONTH(TODAY()),1),' + RNG('B') + ',"<="&EOMONTH(TODAY(),0))+SUMIFS(' + RNG('Y') + ',' + RNG('B') + ',">="&DATE(YEAR(TODAY()),MONTH(TODAY()),1),' + RNG('B') + ',"<="&EOMONTH(TODAY(),0))'] // J13 fat. mês
  ];
  sh.getRange(1, 10, base.length, 1).setValues(base);

  // Estrutura de linhas
  var rows = [];        // [A,B,C,D]
  var headerRows = [];  // linhas de título de seção (para formatar)
  var barRows = [];     // linhas com barra (col B) -> [rowIndex, cor]
  function addRow(a, b, c, d) { rows.push([a || '', b || '', c || '', d || '']); return rows.length; }
  function secao(titulo) { var r = addRow(titulo, '', '', ''); headerRows.push(r); }
  // indicador: pctExpr é função(rr) que devolve a fórmula do % (col C)
  function ind(label, valFormula, pctExprFn, cor) {
    var rr = rows.length + 1;
    var pct = pctExprFn(rr);
    addRow(label, barFormula(rr, cor), pct, valFormula);
    barRows.push(rr);
  }

  // Título
  addRow('PAINEL DE VENDAS — MAGIWAY', '', '', '');            // linha 1
  addRow('Todos os indicadores em barras percentuais.', '', '', ''); // linha 2
  addRow('', '', '', '');

  var C1 = '#1A73E8', C2 = '#0B8043', C3 = '#8E24AA', C4 = '#E8710A', C5 = '#00838F', C6c = '#5F6368';

  secao('INDICADORES GERAIS');
  ind('% Recebido',                '=$J$2', function () { return '=IFERROR($J$2/$J$1,0)'; }, C1);
  ind('% Em Aberto',               '=$J$3', function () { return '=IFERROR($J$3/$J$1,0)'; }, C1);
  ind('% Comissão s/ Faturamento', '=$J$4', function () { return '=IFERROR($J$4/$J$1,0)'; }, C1);
  ind('Taxa de Quitação',          '=$J$6', function () { return '=IFERROR($J$6/$J$5,0)'; }, C1);
  ind('% Vendas Parciais',         '=$J$7', function () { return '=IFERROR($J$7/$J$5,0)'; }, C1);
  ind('% Vendas Em Aberto',        '=$J$8', function () { return '=IFERROR($J$8/$J$5,0)'; }, C1);
  ind('% da Meta (mês atual)',     '=$J$13', function () { return '=IFERROR($J$13/$J$12,0)'; }, C1);

  secao('SITUAÇÃO DAS RESERVAS FRACIONADAS');
  ind('% Fracionadas Em Dia',   '=$J$11', function () { return '=IFERROR($J$11/$J$9,0)'; }, C2);
  ind('% Fracionadas Atrasadas','=$J$10', function () { return '=IFERROR($J$10/$J$9,0)'; }, C2);

  secao('FATURAMENTO POR VENDEDOR (% do total)');
  VENDEDORES.forEach(function (v) {
    ind(v, '=SUMIF(' + RNG('C') + ',"' + v + '",' + RNG('P') + ')+SUMIF(' + RNG('C') + ',"' + v + '",' + RNG('Y') + ')',
        function (rr) { return '=IFERROR($D' + rr + '/$J$1,0)'; }, C3);
  });

  secao('FATURAMENTO POR CATEGORIA (% do total)');
  CATEGORIAS.forEach(function (cat) {
    ind(cat, '=SUMIF(' + RNG('F') + ',"' + cat + '",' + RNG('P') + ')+SUMIF(' + RNG('F') + ',"' + cat + '",' + RNG('Y') + ')',
        function (rr) { return '=IFERROR($D' + rr + '/$J$1,0)'; }, C4);
  });

  secao('RECEBIDO POR FORMA DE PAGAMENTO (% do recebido)');
  FORMAS.forEach(function (f) {
    ind(f, formaRecebido(f), function (rr) { return '=IFERROR($D' + rr + '/$J$2,0)'; }, C5);
  });

  secao('FATURAMENTO POR MOEDA (% do total)');
  MOEDAS.forEach(function (m) {
    ind(m, '=SUMIF(' + RNG('G') + ',"' + m + '",' + RNG('P') + ')+SUMIF(' + RNG('G') + ',"' + m + '",' + RNG('Y') + ')',
        function (rr) { return '=IFERROR($D' + rr + '/$J$1,0)'; }, C6c);
  });

  secao('MODALIDADE (% das vendas)');
  var rInt = rows.length + 1, rFrac = rInt + 1;   // linhas consecutivas
  addRow('Integral', barFormula(rInt, C1),
         '=IFERROR($D' + rInt + '/($D' + rInt + '+$D' + rFrac + '),0)',
         '=SUMPRODUCT(--(' + RNG('P') + '>0))');
  barRows.push(rInt);
  addRow('Fracionada', barFormula(rFrac, C1),
         '=IFERROR($D' + rFrac + '/($D' + rInt + '+$D' + rFrac + '),0)',
         '=SUMPRODUCT(--(' + RNG('Y') + '>0))');
  barRows.push(rFrac);

  // Escreve tudo
  sh.getRange(1, 1, rows.length, 4).setValues(rows);

  // Formatação de título/subtítulo
  sh.getRange(1, 1, 1, 6).merge().setValue('PAINEL DE VENDAS — MAGIWAY')
    .setBackground(COR.titulo).setFontColor('#FFFFFF').setFontWeight('bold').setFontSize(15)
    .setHorizontalAlignment('center');
  sh.getRange(2, 1, 1, 6).merge().setFontColor('#555555').setFontStyle('italic')
    .setHorizontalAlignment('center');

  // Seções
  headerRows.forEach(function (r) {
    sh.getRange(r, 1, 1, 4).merge().setBackground('#263238').setFontColor('#FFFFFF')
      .setFontWeight('bold').setHorizontalAlignment('left');
  });

  // Colunas do corpo
  sh.getRange('C4:C' + rows.length).setNumberFormat('0.0%');
  sh.getRange('D4:D' + rows.length).setNumberFormat('#,##0.00;;');
  barRows.forEach(function (r) {
    sh.getRange(r, 3).setFontColor('#333333');
  });

  // Cabeçalho das colunas do corpo (rótulos)
  sh.getRange(3, 1).setValue('INDICADOR').setFontWeight('bold');
  sh.getRange(3, 2).setValue('BARRA %').setFontWeight('bold');
  sh.getRange(3, 3).setValue('%').setFontWeight('bold');
  sh.getRange(3, 4).setValue('VALOR').setFontWeight('bold');

  sh.setColumnWidth(1, 260);
  sh.setColumnWidth(2, 360);
  sh.setColumnWidth(3, 70);
  sh.setColumnWidth(4, 140);
  sh.hideColumns(10); // oculta métricas-base (coluna J)
  sh.setFrozenRows(3);
}

function formaRecebido(f) {
  return '=SUMIFS(' + RNG('P') + ',' + RNG('T') + ',"' + f + '",' + RNG('V') + ',"SIM")' +
         '+SUMIFS(' + RNG('AD') + ',' + RNG('AF') + ',"' + f + '",' + RNG('AH') + ',"SIM")' +
         '+SUMIFS(' + RNG('AK') + ',' + RNG('AM') + ',"' + f + '",' + RNG('AO') + ',"SIM")' +
         '+SUMIFS(' + RNG('AR') + ',' + RNG('AT') + ',"' + f + '",' + RNG('AV') + ',"SIM")' +
         '+SUMIFS(' + RNG('AY') + ',' + RNG('BA') + ',"' + f + '",' + RNG('BC') + ',"SIM")' +
         '+SUMIFS(' + RNG('BF') + ',' + RNG('BH') + ',"' + f + '",' + RNG('BJ') + ',"SIM")';
}

/* ================================================================================
 *  ABA  COMO USAR
 * ================================================================================ */
function construirCOMOUSAR(ss) {
  var sh = getSheet(ss, 'COMO USAR');
  sh.clear();
  var linhas = [
    ['📋  COMO USAR A PLANILHA DE VENDAS — MAGIWAY'],
    [''],
    ['Tudo é preenchido na aba VENDAS. Cada LINHA = uma reserva/venda. Comece na linha 4.'],
    ['As colunas com fundo CINZA são automáticas — não digite nelas.'],
    [''],
    ['IDENTIFICAÇÃO DA VENDA'],
    ['Nº da venda, data, VENDEDOR (Dickson, Kevin ou Outros), cliente, WhatsApp, CATEGORIA e MOEDA (listas suspensas).'],
    ['Categorias: SEDAN, SUV, MINIVAN 7L, MINIVAN 7L LIMITED, MINIVAN 8L, SUV FULL e MUSTANG.'],
    [''],
    ['PERÍODO & LOGÍSTICA'],
    ['Datas/horas/locais de retirada e devolução. A QTD. DE DIÁRIAS é calculada sozinha. Use a OBSERVAÇÃO para recados.'],
    [''],
    ['SE FOR PAGAMENTO INTEGRAL (pago de uma vez)'],
    ['Preencha o bloco PAGAMENTO INTEGRAL: VALOR DO PAGAMENTO e, ao lado, o % COMISSÃO (2, 3, 4 ou 5%).'],
    ['A COMISSÃO é calculada automaticamente. Informe data, forma, marque PAGO? e ADICIONADO À PLANILHA DE FECHAMENTO DO VENDEDOR?, e anexe o RECIBO.'],
    [''],
    ['SE FOR PAGAMENTO FRACIONADO (entrada + parcelas)'],
    ['No bloco FRACIONADO — RESUMO escolha o % COMISSÃO (2/3/4/5%). O VALOR TOTAL, a COMISSÃO, o % PAGO e o PRÓXIMO PAGAMENTO são automáticos.'],
    ['Lance a ENTRADA e até 4 PARCELAS (valor, data e forma de cada uma). Marque PAGO? = SIM conforme recebe.'],
    ['Cada parcela tem uma BARRA DE PROGRESSO que enche de 0% a 100% conforme o valor pago até a quitação.'],
    [''],
    ['CORES AUTOMÁTICAS DA LINHA'],
    ['🟩 VERDE  = reserva QUITADA (integral ou fracionada).'],
    ['🟥 VERMELHA = pagamento ATRASADO (passou a data do próximo pagamento sem marcar PAGO?).'],
    ['🟦 AZUL CLARO = reserva FRACIONADA em dia (ainda não quitada, sem atraso).'],
    [''],
    ['SINALIZADORES EM CADA PAGAMENTO'],
    ['• PAGO? = SIM/NÃO  → move as barras de progresso e as cores.'],
    ['• ADICIONADO À PLANILHA DE FECHAMENTO DO VENDEDOR? = SIM/NÃO  → controle do repasse ao fechamento do vendedor.'],
    ['• RECIBO  → nome/link do comprovante.'],
    [''],
    ['ABA PAINEL'],
    ['Dashboard só com BARRAS PERCENTUAIS: recebido, em aberto, comissão, quitação, por vendedor, por categoria, por forma de pagamento, por moeda, modalidade e % da meta.'],
    [''],
    ['ABA CONFIG'],
    ['Edite a META MENSAL (célula amarela) e as listas de CATEGORIAS, VENDEDORES, LOCAIS, FORMAS e % COMISSÃO. O RESUMO GERAL soma tudo sozinho.'],
    [''],
    ['DICA: rode o menu 🚗 MAGIWAY ▸ "Construir / Atualizar tudo" sempre que quiser recriar as abas.']
  ];
  sh.getRange(2, 2, linhas.length, 1).setValues(linhas);
  sh.getRange('B2').setFontWeight('bold').setFontSize(14).setFontColor(COR.titulo);
  // realça os subtítulos
  [6,10,13,17,22,27,32,35].forEach(function (r) {
    sh.getRange(r + 1, 2).setFontWeight('bold').setFontColor(COR.titulo);
  });
  sh.setColumnWidth(1, 30);
  sh.setColumnWidth(2, 900);
  sh.setHiddenGridlines && sh.setHiddenGridlines(true);
  sh.getRange(1,1,sh.getMaxRows(),1).setBackground('#FFFFFF');
}

/* ================================================================================
 *  LIMPAR DADOS (mantém as fórmulas automáticas)
 * ================================================================================ */
function limparDados() {
  var ui = SpreadsheetApp.getUi();
  var resp = ui.alert('Limpar dados', 'Isto apaga TODOS os dados digitados na aba VENDAS (as fórmulas e formatações permanecem). Continuar?', ui.ButtonSet.YES_NO);
  if (resp !== ui.Button.YES) return;
  var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('VENDAS');
  if (!sh) return;
  // Colunas de digitação (todas menos as automáticas)
  var auto = ['N','R','Y','AA','AB','AC','AG','AN','AU','BB','BI'];
  var total = 64;
  for (var c = 1; c <= total; c++) {
    var letra = L(c);
    if (auto.indexOf(letra) === -1) {
      sh.getRange(FIRST_ROW, c, NUM_LINHAS, 1).clearContent();
    }
  }
  ui.alert('✅ Dados apagados. As fórmulas continuam ativas.');
}
