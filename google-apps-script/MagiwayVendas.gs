/************************************************************************************************
 *  MAGIWAY — CONTROLE DE VENDAS  (Google Apps Script)  —  v2
 *  ---------------------------------------------------------------------------------------------
 *  COMO INSTALAR:
 *    1) Importe o .xlsx para o Google Sheets (ou use uma planilha em branco).
 *    2) Extensões ▸ Apps Script ▸ apague o exemplo ▸ cole TODO este código ▸ salve (💾).
 *    3) Volte à planilha, recarregue a página (F5).
 *    4) Menu "🚗 MAGIWAY" ▸ "🔧 Construir / Atualizar tudo". Autorize na 1ª vez.
 *
 *  IMPORTANTE (v2): as abas antigas são APAGADAS e RECRIADAS DO ZERO. Isso elimina os
 *  congelamentos, mesclas e formatos que vêm da importação do Excel (a planilha original
 *  tem colunas congeladas em A–G, o que fazia a versão anterior parar com o erro
 *  "Não é possível mesclar colunas congeladas com colunas não congeladas").
 *
 *  O QUE ESTE SCRIPT FAZ (todos os pedidos):
 *   1) Ao lado do VALOR do PAGAMENTO INTEGRAL: % COMISSÃO (menu suspenso 2/3/4/5%) e
 *      COMISSÃO calculada automaticamente.
 *   2) PAGAMENTO FRACIONADO com o mesmo % COMISSÃO (2/3/4/5%) e comissão automática.
 *   3) BARRA DE PROGRESSO em cada parcela do fracionado, subindo com o valor pago até 100%.
 *   4) VENDEDORES em lista suspensa: DICKSON, KEVIN e OUTROS.
 *   5) Empresa MAGIWAY em todos os títulos.
 *   6) CATEGORIAS: SEDAN, SUV, MINIVAN 7L, MINIVAN 7L LIMITED, MINIVAN 8L, SUV FULL, MUSTANG.
 *   7) Removidos MODELO do veículo e PLACA.
 *   8) "ALIMENTADO NO SISTEMA?" virou "ADICIONADO À PLANILHA DE FECHAMENTO DO VENDEDOR?".
 *   9) PAINEL (dashboard) SÓ com barras percentuais — máximo de indicadores possível.
 *  10) Fracionado sempre mostra a DATA DO PRÓXIMO PAGAMENTO. Cor automática da linha:
 *          VERMELHA   = pagamento atrasado
 *          VERDE      = reserva quitada (integral ou fracionada)
 *          AZUL CLARO = reserva fracionada em dia
 *  11) Excluídas as colunas de CONTROLE & ALERTAS.
 *  12) Retirado o bloco antigo VALORES & COMISSÃO (substituído pela comissão por pagamento).
 *  13) Retirado o bloco antigo MODALIDADE & PROGRESSO (substituído por barras + cores).
 ************************************************************************************************/

/* ======================== CONFIGURAÇÕES GERAIS ======================== */
var FIRST_ROW  = 4;                        // primeira linha de dados
var NUM_LINHAS = 100;                      // quantidade de linhas de venda
var LAST_ROW   = FIRST_ROW + NUM_LINHAS - 1;
var TOTAL_COLS = 64;                       // A..BL (definido pelos grupos abaixo)

var COR = {
  titulo:      '#0B3D2E',   // verde escuro Magiway
  ident:       '#1B5E20',
  logistica:   '#00695C',
  integral:    '#1565C0',
  fracResumo:  '#6A1B9A',
  entrada:     '#283593',
  parcela:     '#37474F',
  auto:        '#ECEFF1',   // fundo cinza (campos automáticos)
  input:       '#FFFDE7',   // fundo amarelo claro (campos de escolha do % de comissão)
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
    'MAGIWAY — Controle de Vendas (v2)\n\n' +
    'Use "Construir / Atualizar tudo" para recriar do zero as abas VENDAS, PAINEL, CONFIG e COMO USAR.\n\n' +
    'Comissão por pagamento (2/3/4/5%), barras de progresso nas parcelas, cores automáticas ' +
    'na linha (verde=quitado, vermelho=atrasado, azul=fracionado em dia) e painel só com barras.');
}

/* ======================== ORQUESTRADOR ======================== */
function construirTudo() {
  var ui = SpreadsheetApp.getUi();
  var resp = ui.alert('MAGIWAY — Construir / Atualizar',
    'As abas VENDAS, PAINEL, CONFIG e COMO USAR serão APAGADAS e RECRIADAS DO ZERO ' +
    '(isso remove tudo que veio da importação do Excel, inclusive dados digitados).\n\n' +
    'Faça uma cópia antes se precisar guardar algo.\n\nDeseja continuar?',
    ui.ButtonSet.YES_NO);
  if (resp !== ui.Button.YES) return;

  var ss = SpreadsheetApp.getActiveSpreadsheet();

  // 1) Recria as 4 abas VAZIAS primeiro (nenhuma fórmula é escrita antes de
  //    todas existirem — assim nenhuma referência entre abas quebra em #REF!).
  var vendas  = recriarAba(ss, 'VENDAS');
  var painel  = recriarAba(ss, 'PAINEL');
  var config  = recriarAba(ss, 'CONFIG');
  var comousar= recriarAba(ss, 'COMO USAR');
  removerTemporaria(ss);

  // 2) Preenche (CONFIG primeiro: as listas alimentam as validações de VENDAS).
  construirCONFIG(config);
  construirVENDAS(ss, vendas);
  construirPAINEL(painel);
  construirCOMOUSAR(comousar);

  // 3) Ordena e pinta as guias.
  ordenar(ss, ['COMO USAR','VENDAS','PAINEL','CONFIG']);
  comousar.setTabColor('#E8710A');
  vendas.setTabColor('#0B8043');
  painel.setTabColor('#1A73E8');
  config.setTabColor('#5F6368');

  ss.setActiveSheet(vendas);
  ui.alert('✅ Planilha MAGIWAY construída com sucesso!\n\nComece a lançar as vendas na linha 4 da aba VENDAS.');
}

/* ======================== RECRIAÇÃO DE ABAS ======================== */
// Apaga a aba (se existir) e cria uma nova em branco — sem congelamentos,
// mesclas, validações ou formatos herdados da importação do Excel.
function recriarAba(ss, nome) {
  var velha = ss.getSheetByName(nome);
  if (velha) {
    // nunca deixar a planilha sem abas: cria uma temporária se for a única
    if (ss.getSheets().length === 1 && !ss.getSheetByName('TMP_MAGIWAY')) {
      ss.insertSheet('TMP_MAGIWAY');
    }
    ss.deleteSheet(velha);
  }
  return ss.insertSheet(nome);
}
function removerTemporaria(ss) {
  var tmp = ss.getSheetByName('TMP_MAGIWAY');
  if (tmp) ss.deleteSheet(tmp);
}
// Garante que a aba tenha exatamente n colunas (abas novas nascem com 26).
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
// número da coluna -> letra (1->A, 27->AA ...)
function L(n) {
  var s = '';
  while (n > 0) { var m = (n - 1) % 26; s = String.fromCharCode(65 + m) + s; n = (n - m - 1) / 26; }
  return s;
}
// letra da coluna -> número (A->1, AA->27 ...)
function letra2num(col) {
  var n = 0; for (var i = 0; i < col.length; i++) n = n * 26 + (col.charCodeAt(i) - 64); return n;
}
// intervalo absoluto de uma coluna de VENDAS (ex.: VENDAS!$P$4:$P$103)
function RNG(col) { return 'VENDAS!$' + col + '$' + FIRST_ROW + ':$' + col + '$' + LAST_ROW; }
// barra sparkline (0..1)
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
function construirCONFIG(sh) {
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
  sh.getRange('B7:B10').setNumberFormat('#,##0.00');

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
 *  Colunas (64 = A..BL):
 *   A..G   IDENTIFICAÇÃO: nº, data, vendedor, cliente, whatsapp, categoria, moeda
 *   H..O   PERÍODO & LOGÍSTICA
 *   P..X   PAGAMENTO INTEGRAL: valor, %com, comissão, data, forma, parcelas, pago?, adicionado?, recibo
 *   Y..AC  FRACIONADO — RESUMO: total, %com, comissão, próximo pgto, % pago
 *   AD..AJ ENTRADA:  valor, data, forma, progresso, pago?, adicionado?, recibo
 *   AK..AQ PARCELA 1 | AR..AX PARCELA 2 | AY..BE PARCELA 3 | BF..BL PARCELA 4 (mesmo padrão)
 * ================================================================================ */
function construirVENDAS(ss, sh) {
  garantirColunas(sh, TOTAL_COLS);   // abas novas nascem com 26 colunas; precisamos de 64

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

  // Faixas de grupo (linha 2) e cabeçalhos (linha 3)
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

  // Título geral (linha 1)
  sh.getRange(1, 1, 1, TOTAL_COLS).merge()
    .setValue('MAGIWAY   •   CONTROLE DE VENDAS')
    .setBackground(COR.titulo).setFontColor('#FFFFFF').setFontWeight('bold').setFontSize(15)
    .setHorizontalAlignment('center');

  // Linha 3 (nomes das colunas)
  sh.getRange(3, 1, 1, TOTAL_COLS).setValues([header3])
    .setFontWeight('bold').setBackground('#455A64').setFontColor('#FFFFFF')
    .setWrap(true).setVerticalAlignment('middle').setHorizontalAlignment('center');
  sh.setRowHeight(2, 26); sh.setRowHeight(3, 48);

  /* ---- Fórmulas automáticas ---- */
  escreverFormulaColuna(sh, 'N',  function (r) { return '=IF(AND(H'+r+'<>"",K'+r+'<>""),K'+r+'-H'+r+',"")'; });                    // Diárias
  escreverFormulaColuna(sh, 'R',  function (r) { return '=IF(AND(P'+r+'<>"",P'+r+'>0,Q'+r+'<>""),P'+r+'*Q'+r+'/100,"")'; });       // Comissão integral
  escreverFormulaColuna(sh, 'Y',  function (r) { return '=AD'+r+'+AK'+r+'+AR'+r+'+AY'+r+'+BF'+r; });                                 // Total fracionado
  escreverFormulaColuna(sh, 'AA', function (r) { return '=IF(AND(Y'+r+'>0,Z'+r+'<>""),Y'+r+'*Z'+r+'/100,"")'; });                    // Comissão fracionada
  escreverFormulaColuna(sh, 'AB', proximoPagamento);                                                                                 // Próximo pagamento
  escreverFormulaColuna(sh, 'AC', function (r) { return '=IFERROR('+pagoFrac(r)+'/Y'+r+',0)'; });                                    // % pago fracionado
  escreverFormulaColuna(sh, 'AG', function (r) { return barra(r, '(IF(AH'+r+'="SIM",AD'+r+',0))'); });                               // Progresso entrada
  escreverFormulaColuna(sh, 'AN', function (r) { return barra(r, '(IF(AH'+r+'="SIM",AD'+r+',0)+IF(AO'+r+'="SIM",AK'+r+',0))'); });   // Progresso parc.1
  escreverFormulaColuna(sh, 'AU', function (r) { return barra(r, '(IF(AH'+r+'="SIM",AD'+r+',0)+IF(AO'+r+'="SIM",AK'+r+',0)+IF(AV'+r+'="SIM",AR'+r+',0))'); });
  escreverFormulaColuna(sh, 'BB', function (r) { return barra(r, '(IF(AH'+r+'="SIM",AD'+r+',0)+IF(AO'+r+'="SIM",AK'+r+',0)+IF(AV'+r+'="SIM",AR'+r+',0)+IF(BC'+r+'="SIM",AY'+r+',0))'); });
  escreverFormulaColuna(sh, 'BI', function (r) { return barra(r, pagoFrac(r)); });                                                   // Progresso parc.4 (=total)

  /* ---- Validações (listas suspensas) ---- */
  var ss2 = sh.getParent();
  aplicarValidacaoRange(ss2, sh, 'C',  'CONFIG!F5:F' + (4 + VENDEDORES.length));      // Vendedor
  aplicarValidacaoRange(ss2, sh, 'F',  'CONFIG!E5:E' + (4 + CATEGORIAS.length));      // Categoria
  aplicarValidacaoRange(ss2, sh, 'G',  'CONFIG!J5:J' + (4 + MOEDAS.length));          // Moeda
  aplicarValidacaoRange(ss2, sh, 'J',  'CONFIG!G5:G' + (4 + LOCAIS.length));          // Local retirada
  aplicarValidacaoRange(ss2, sh, 'M',  'CONFIG!G5:G' + (4 + LOCAIS.length));          // Local devolução
  aplicarValidacaoRange(ss2, sh, 'Q',  'CONFIG!I5:I' + (4 + COMISSOES.length));       // % comissão integral
  aplicarValidacaoRange(ss2, sh, 'Z',  'CONFIG!I5:I' + (4 + COMISSOES.length));       // % comissão fracionada
  ['T','AF','AM','AT','BA','BH'].forEach(function (c) {                               // Formas de pagamento
    aplicarValidacaoRange(ss2, sh, c, 'CONFIG!H5:H' + (4 + FORMAS.length));
  });
  ['V','AH','AO','AV','BC','BJ'].forEach(function (c) { aplicarValidacaoLista(sh, c, ['SIM','NÃO']); }); // PAGO?
  ['W','AI','AP','AW','BD','BK'].forEach(function (c) { aplicarValidacaoLista(sh, c, ['SIM','NÃO']); }); // ADICIONADO?

  /* ---- Formatos numéricos ---- */
  fmt(sh, ['P','AD','AK','AR','AY','BF'], '#,##0.00');
  fmt(sh, ['R','Y','AA'], '#,##0.00;;');                         // esconde zero nos automáticos
  fmt(sh, ['Q','Z'], '0"%"');                                    // 2 -> 2%
  fmt(sh, ['AC'], '0%;;');                                       // % pago (esconde zero)
  fmt(sh, ['N'], '0;;');                                         // diárias
  fmt(sh, ['B','H','K','S','AE','AL','AS','AZ','BG','AB'], 'dd/mm/yyyy');

  /* ---- Sombreamento: automáticos (cinza) e % comissão (amarelo) ---- */
  ['N','R','Y','AA','AB','AC','AG','AN','AU','BB','BI'].forEach(function (c) {
    sh.getRange(FIRST_ROW, letra2num(c), NUM_LINHAS, 1).setBackground(COR.auto);
  });
  ['Q','Z'].forEach(function (c) {
    sh.getRange(FIRST_ROW, letra2num(c), NUM_LINHAS, 1).setBackground(COR.input);
  });

  /* ---- Formatação condicional: cor da LINHA inteira ---- */
  var alvo = [sh.getRange('A' + FIRST_ROW + ':' + L(TOTAL_COLS) + LAST_ROW)];
  var ativo   = '(OR($A4<>"",$P4>0,$Y4>0))';
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
  sh.setColumnWidth(letra2num('O'), 220);
  sh.setColumnWidth(letra2num('W'), 190);
  ['AG','AN','AU','BB','BI'].forEach(function (c) { sh.setColumnWidth(letra2num(c), 130); });
  ['AI','AP','AW','BD','BK'].forEach(function (c) { sh.setColumnWidth(letra2num(c), 190); });
  // Só congelamos LINHAS. Não congelar colunas: o título das linhas 1–2 é mesclado por toda
  // a largura, e o Sheets proíbe mescla cruzando a fronteira de colunas congeladas.
  sh.setFrozenRows(3);
  sh.getRange(FIRST_ROW, 1, NUM_LINHAS, TOTAL_COLS).setVerticalAlignment('middle');
}

/* ---- helpers de VENDAS ---- */
function parcelaCols() {
  return ['VALOR DO PGTO','DATA DO PGTO','FORMA DE PAGAMENTO','PROGRESSO','PAGO?',
          'ADICIONADO À PLANILHA DE FECHAMENTO DO VENDEDOR?','RECIBO'];
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
function construirPAINEL(sh) {
  // Métricas-base ocultas na coluna J (referenciadas pelas barras)
  var base = [
    ['=SUM(' + RNG('P') + ')+SUM(' + RNG('Y') + ')'],                                   // J1 faturamento
    [recebidoFormula()],                                                                // J2 recebido
    ['=$J$1-$J$2'],                                                                      // J3 em aberto ($)
    ['=SUM(' + RNG('R') + ')+SUM(' + RNG('AA') + ')'],                                   // J4 comissão total
    ['=SUMPRODUCT(--(((' + RNG('P') + '>0)+(' + RNG('Y') + '>0))>0))'],                  // J5 nº vendas
    [quitadasFormula()],                                                                // J6 quitadas
    [parciaisFormula()],                                                                // J7 parciais
    ['=$J$5-$J$6-$J$7'],                                                                 // J8 em aberto (qtd)
    ['=SUMPRODUCT(--((' + RNG('Y') + '>0)*(' + RNG('AC') + '<1)))'],                     // J9 fracionadas ativas
    ['=SUMPRODUCT(--((' + RNG('Y') + '>0)*(' + RNG('AC') + '<1)*(' + RNG('AB') + '<>"")*(' + RNG('AB') + '<TODAY())))'], // J10 atrasadas
    ['=$J$9-$J$10'],                                                                     // J11 em dia
    ['=CONFIG!$B$3'],                                                                    // J12 meta
    ['=SUMIFS(' + RNG('P') + ',' + RNG('B') + ',">="&DATE(YEAR(TODAY()),MONTH(TODAY()),1),' + RNG('B') + ',"<="&EOMONTH(TODAY(),0))+SUMIFS(' + RNG('Y') + ',' + RNG('B') + ',">="&DATE(YEAR(TODAY()),MONTH(TODAY()),1),' + RNG('B') + ',"<="&EOMONTH(TODAY(),0))'] // J13 fat. mês atual
  ];
  sh.getRange(1, 10, base.length, 1).setValues(base);

  // Estrutura de linhas
  var rows = [];        // [A,B,C,D]
  var headerRows = [];  // linhas de título de seção
  var barRows = [];     // linhas com barra
  function addRow(a, b, c, d) { rows.push([a || '', b || '', c || '', d || '']); return rows.length; }
  function secao(titulo) { var r = addRow(titulo, '', '', ''); headerRows.push(r); }
  function ind(label, valFormula, pctExprFn, cor) {
    var rr = rows.length + 1;
    addRow(label, barFormula(rr, cor), pctExprFn(rr), valFormula);
    barRows.push(rr);
  }

  addRow('PAINEL DE VENDAS — MAGIWAY', '', '', '');                  // linha 1
  addRow('Todos os indicadores em barras percentuais.', '', '', ''); // linha 2
  addRow('', '', '', '');                                            // linha 3 (rótulos depois)

  var C1 = '#1A73E8', C2 = '#0B8043', C3 = '#8E24AA', C4 = '#E8710A', C5 = '#00838F', C6c = '#5F6368';

  secao('INDICADORES GERAIS');
  ind('% Recebido',                '=$J$2',  function () { return '=IFERROR($J$2/$J$1,0)'; }, C1);
  ind('% Em Aberto',               '=$J$3',  function () { return '=IFERROR($J$3/$J$1,0)'; }, C1);
  ind('% Comissão s/ Faturamento', '=$J$4',  function () { return '=IFERROR($J$4/$J$1,0)'; }, C1);
  ind('Taxa de Quitação',          '=$J$6',  function () { return '=IFERROR($J$6/$J$5,0)'; }, C1);
  ind('% Vendas Parciais',         '=$J$7',  function () { return '=IFERROR($J$7/$J$5,0)'; }, C1);
  ind('% Vendas Em Aberto',        '=$J$8',  function () { return '=IFERROR($J$8/$J$5,0)'; }, C1);
  ind('% da Meta (mês atual)',     '=$J$13', function () { return '=IFERROR($J$13/$J$12,0)'; }, C1);

  secao('SITUAÇÃO DAS RESERVAS FRACIONADAS');
  ind('% Fracionadas Em Dia',    '=$J$11', function () { return '=IFERROR($J$11/$J$9,0)'; }, C2);
  ind('% Fracionadas Atrasadas', '=$J$10', function () { return '=IFERROR($J$10/$J$9,0)'; }, C2);

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
  var rInt = rows.length + 1, rFrac = rInt + 1;   // duas linhas consecutivas
  addRow('Integral', barFormula(rInt, C1),
         '=IFERROR($D' + rInt + '/($D' + rInt + '+$D' + rFrac + '),0)',
         '=SUMPRODUCT(--(' + RNG('P') + '>0))');
  barRows.push(rInt);
  addRow('Fracionada', barFormula(rFrac, C1),
         '=IFERROR($D' + rFrac + '/($D' + rInt + '+$D' + rFrac + '),0)',
         '=SUMPRODUCT(--(' + RNG('Y') + '>0))');
  barRows.push(rFrac);

  // Escreve tudo de uma vez
  sh.getRange(1, 1, rows.length, 4).setValues(rows);

  // Título / subtítulo
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

  // Formatos do corpo
  sh.getRange('C4:C' + rows.length).setNumberFormat('0.0%');
  sh.getRange('D4:D' + rows.length).setNumberFormat('#,##0.00;;');

  // Rótulos das colunas (linha 3)
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
function construirCOMOUSAR(sh) {
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
    ['DICA: rode o menu 🚗 MAGIWAY ▸ "Construir / Atualizar tudo" sempre que quiser recriar as abas do zero.']
  ];
  sh.getRange(2, 2, linhas.length, 1).setValues(linhas);
  sh.getRange('B2').setFontWeight('bold').setFontSize(14).setFontColor(COR.titulo);
  // realça os subtítulos (linhas onde começam as seções)
  [7, 11, 14, 18, 23, 28, 33, 36].forEach(function (r) {
    sh.getRange(r, 2).setFontWeight('bold').setFontColor(COR.titulo);
  });
  sh.setColumnWidth(1, 30);
  sh.setColumnWidth(2, 900);
}

/* ================================================================================
 *  LIMPAR DADOS (mantém as fórmulas automáticas)
 * ================================================================================ */
function limparDados() {
  var ui = SpreadsheetApp.getUi();
  var resp = ui.alert('Limpar dados',
    'Isto apaga TODOS os dados digitados na aba VENDAS (as fórmulas e formatações permanecem). Continuar?',
    ui.ButtonSet.YES_NO);
  if (resp !== ui.Button.YES) return;
  var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('VENDAS');
  if (!sh) { ui.alert('A aba VENDAS não existe. Rode antes "Construir / Atualizar tudo".'); return; }
  // Colunas automáticas (com fórmula) — todas as outras são de digitação
  var auto = ['N','R','Y','AA','AB','AC','AG','AN','AU','BB','BI'];
  for (var c = 1; c <= TOTAL_COLS; c++) {
    if (auto.indexOf(L(c)) === -1) {
      sh.getRange(FIRST_ROW, c, NUM_LINHAS, 1).clearContent();
    }
  }
  ui.alert('✅ Dados apagados. As fórmulas continuam ativas.');
}
