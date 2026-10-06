/* ═══════════════════════════════════════════════════════════════════
   RESERVAS — dash por ciclo, a partir da planilha de fechamento
   ───────────────────────────────────────────────────────────────────
   O pedido: puxar os dados da planilha de fechamento para um dash
   completo de reservas de cada mês.

   A regra que não pode ser violada: **este dash tem que bater com o app
   de vendas.** Dois painéis com totais diferentes para o mesmo mês é
   pior do que um painel a menos, porque aí ninguém sabe em qual
   acreditar e os dois perdem o uso. `conferir()` existe para isso: você
   passa o total que o app de vendas mostra e ele diz se bate, e onde
   não bate.

   Três regras copiadas do app de vendas, porque cada uma nasceu de um
   erro real:

   1. **A aba FECHAMENTOS é o ciclo corrente.** Estar nela já é a
      declaração de que a venda fechou neste ciclo — e é mais confiável
      que a coluna de data, que fica em branco ou errada justamente
      enquanto a linha está sendo trabalhada. Antes o app olhava só a
      data, e venda lançada sem data ficava fora do faturamento e fora
      da meta sem ninguém perceber.
      Isso vale SÓ quando o ciclo pedido é o de hoje: num mês passado a
      aba de fechamento não pode ser arrastada para dentro dele.

   2. **Linha arquivada saiu do ciclo.** É o que faz o relatório
      recomeçar do zero na virada.

   3. **Pagamento fragmentado gera linha repetida.** A mesma reserva
      aparece duas ou três vezes quando o cliente paga em partes. Sem
      remover a repetição, o faturamento infla e a contagem de reservas
      mente. A chave de duplicata é cliente + retirada + devolução.
   ═══════════════════════════════════════════════════════════════════ */
(function(raiz){
'use strict';

function dep(nome, caminho){
  if(raiz[nome]) return raiz[nome];
  if(typeof require!=='undefined') return require(caminho)[nome];
  throw new Error('reservas precisa de '+caminho+' carregado antes');
}

function norm(s){ return String(s==null?'':s).toLowerCase()
  .normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/\s+/g,' ').trim(); }

/* Aceita "1.234,56", "1234.56", "R$ 1.234,56", "$1,234.56" e número.
   Decide pelo separador que vem POR ÚLTIMO, não por "se tem vírgula".
   A primeira versão desta função dizia "se tem vírgula, a vírgula é o
   decimal" — e lia "$1,234.56" como **1,23**. Um faturamento mil vezes
   menor, e a conferência contra o app de vendas não pegaria se os dois
   lados lessem errado do mesmo jeito.
   O caso ambíguo é um separador só com 3 dígitos depois ("1.234"): aqui
   vale como milhar, porque a planilha é de dinheiro em reais e valor
   com três decimais não existe nela. */
function dinheiro(v){
  if(typeof v==='number') return isFinite(v)?v:0;
  var s=String(v==null?'':v).replace(/[^\d.,-]/g,'');
  if(!s) return 0;
  var neg=/^-/.test(s); s=s.replace(/-/g,'');
  var pv=s.lastIndexOf(','), pp=s.lastIndexOf('.');
  var dec=Math.max(pv,pp);
  if(dec>=0){
    var depois=s.length-dec-1;
    var outro=(dec===pv)?pp:pv;
    if(depois===3 && outro<0) s=s.replace(/[.,]/g,'');      /* milhar */
    else s=s.slice(0,dec).replace(/[.,]/g,'')+'.'+s.slice(dec+1).replace(/[.,]/g,'');
  }
  var n=parseFloat(s);
  if(!isFinite(n)) return 0;
  return neg?-n:n;
}
function data(v){
  if(v instanceof Date) return isNaN(v.getTime())?null:v;
  if(v==null||v==='') return null;
  var s=String(v).trim();
  /* dd/mm/aaaa — formato da planilha. new Date() leria como mm/dd. */
  var m=s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
  if(m){
    var a=+m[3]; if(a<100) a+=2000;
    var d=new Date(a, +m[2]-1, +m[1]);
    return isNaN(d.getTime())?null:d;
  }
  var x=new Date(s);
  return isNaN(x.getTime())?null:x;
}

/* linha: o que o leitor de planilha devolve. Nomes de coluna variam, e
   as alternativas abaixo são as que o app de vendas aceita. */
function ler(linha){
  function col(nomes){
    for(var i=0;i<nomes.length;i++){
      var k=Object.keys(linha).find(function(c){ return norm(c)===norm(nomes[i]); });
      if(k!=null && linha[k]!=='' && linha[k]!=null) return linha[k];
    }
    return null;
  }
  var r={
    cliente: col(['cliente','nome','nome do cliente','passageiro']),
    vendedor: col(['vendedor','responsavel','consultor']),
    valor: dinheiro(col(['valor','total','valor total','faturamento'])),
    custoReal: dinheiro(col(['custo','custo real','custo total'])),
    dataFech: data(col(['data fechamento','data de fechamento','fechamento','data fech'])),
    retirada: data(col(['retirada','data retirada','inicio','check-in'])),
    devolucao: data(col(['devolucao','data devolucao','fim','check-out'])),
    categoria: col(['categoria','carro','veiculo','modelo']),
    _src: linha._src||null,          /* 'fech' = aba FECHAMENTOS */
    _arquivada: !!linha._arquivada,
    _cru: linha
  };
  r.chave=[norm(r.cliente),
           r.retirada?r.retirada.getTime():'',
           r.devolucao?r.devolucao.getTime():''].join('|');
  return r;
}

/* Remove a repetição do pagamento fragmentado: mesma reserva, somando
   o valor e guardando quantas linhas entraram — para a tela poder
   mostrar "3 pagamentos" em vez de sumir com a informação. */
function juntarFragmentos(rs){
  var m={}, ordem=[];
  rs.forEach(function(r){
    if(!m[r.chave]){ m[r.chave]=Object.assign({},r,{_partes:1}); ordem.push(r.chave); }
    else {
      var a=m[r.chave];
      a.valor+=r.valor; a.custoReal+=r.custoReal; a._partes++;
      /* a data de fechamento da reserva é a do PRIMEIRO pagamento:
         é quando o cliente decidiu, e é o que o ciclo deve enxergar */
      if(r.dataFech && (!a.dataFech || r.dataFech<a.dataFech)) a.dataFech=r.dataFech;
      if(!a._src && r._src) a._src=r._src;
      a._arquivada = a._arquivada && r._arquivada;
    }
  });
  return ordem.map(function(k){ return m[k]; });
}

function ehDoCiclo(r, c, hoje, C){
  if(r._arquivada) return false;
  if(C.dentro(r.dataFech, c)) return true;
  /* a aba de fechamento só vale para o ciclo de hoje */
  if(r._src==='fech' && hoje && c.ym===hoje.ym) return true;
  return false;
}

function doCiclo(linhas, ciclo, opcoes){
  opcoes=opcoes||{};
  var C=opcoes.ciclo||dep('MGW_CICLO_K','./ciclo.js');
  var hoje=C.cicloAtual(opcoes.agora);
  var c=ciclo||hoje;
  var rs=juntarFragmentos((linhas||[]).map(ler));
  var dentro=rs.filter(function(r){ return ehDoCiclo(r,c,hoje,C); });

  var fat=dentro.reduce(function(a,r){ return a+r.valor; },0);
  var custo=dentro.reduce(function(a,r){ return a+r.custoReal; },0);
  var semData=dentro.filter(function(r){ return !r.dataFech; }).length;

  return {
    ciclo:c, reservas:dentro,
    n:dentro.length,
    faturamento:+fat.toFixed(2),
    custo:+custo.toFixed(2),
    lucroBruto:+(fat-custo).toFixed(2),
    ticket: dentro.length? +(fat/dentro.length).toFixed(2) : null,
    fragmentadas:dentro.filter(function(r){ return r._partes>1; }).length,
    semDataFechamento:semData,
    linhasLidas:(linhas||[]).length,
    duplicatasRemovidas:(linhas||[]).length-rs.length,
    porVendedor:porVendedor(dentro),
    aviso: semData
      ? semData+' reserva(s) entraram pela aba FECHAMENTOS, sem data de '
       +'fechamento preenchida. Estão contadas de propósito — estar na aba '
       +'já é a declaração de que fecharam neste ciclo. Preencher a data '
       +'evita que elas sumam quando o ciclo virar.'
      : null
  };
}

function porVendedor(rs){
  var m={};
  rs.forEach(function(r){
    var k=r.vendedor||'(sem vendedor)';
    var g=m[k]=m[k]||{ vendedor:k, n:0, faturamento:0 };
    g.n++; g.faturamento+=r.valor;
  });
  return Object.keys(m).map(function(k){
    var g=m[k]; g.faturamento=+g.faturamento.toFixed(2);
    g.ticket=+(g.faturamento/g.n).toFixed(2);
    return g;
  }).sort(function(a,b){ return b.faturamento-a.faturamento; });
}

function porCiclos(linhas, quantos, opcoes){
  opcoes=opcoes||{};
  var C=opcoes.ciclo||dep('MGW_CICLO_K','./ciclo.js');
  return C.ultimosCiclos(quantos||13, opcoes.agora).map(function(c){
    var d=doCiclo(linhas,c,opcoes);
    return { ciclo:c, n:d.n, faturamento:d.faturamento,
             lucroBruto:d.lucroBruto, ticket:d.ticket };
  });
}

/* ── a trava contra o erro mais caro ────────────────────────────────
   `esperado` é o que o APP DE VENDAS mostra para o mesmo ciclo. Se não
   bater, isto grita — e tem que gritar, porque divergência silenciosa
   entre dois painéis destrói a confiança nos dois.
   Tolerância de 1 centavo é arredondamento; qualquer coisa acima é
   diferença de regra. */
function conferir(linhas, ciclo, esperado, opcoes){
  var d=doCiclo(linhas, ciclo, opcoes);
  var difN=d.n-(esperado&&esperado.n||0);
  var difV=+(d.faturamento-(esperado&&esperado.faturamento||0)).toFixed(2);
  var bate=difN===0 && Math.abs(difV)<=0.01;
  return {
    bate:bate, aqui:{ n:d.n, faturamento:d.faturamento },
    appDeVendas:{ n:(esperado&&esperado.n)||0,
                  faturamento:(esperado&&esperado.faturamento)||0 },
    diferencaReservas:difN, diferencaValor:difV,
    porque: bate
      ? 'Bate com o app de vendas: '+d.n+' reservas, R$ '
       +d.faturamento.toLocaleString('pt-BR',{minimumFractionDigits:2})+'.'
      : 'NÃO BATE com o app de vendas. Aqui: '+d.n+' reservas / R$ '
       +d.faturamento.toFixed(2)+'. Lá: '+((esperado&&esperado.n)||0)
       +' / R$ '+((esperado&&esperado.faturamento)||0).toFixed(2)+'. '
       +'Diferença de '+difN+' reserva(s) e R$ '+difV.toFixed(2)+'. '
       +'Não publique este dash assim. Onde olhar, em ordem: '
       +(d.duplicatasRemovidas?'pagamento fragmentado ('+d.duplicatasRemovidas
          +' linha(s) juntadas aqui — o app de vendas junta igual?); ':'')
       +'linha arquivada contada de um lado e não do outro; '
       +'reserva sem data de fechamento ('+d.semDataFechamento+' aqui); '
       +'e a fronteira do ciclo — 12 e 13 do mês.'
  };
}

raiz.MGW_RESERVAS={ ler:ler, doCiclo:doCiclo, porCiclos:porCiclos,
  conferir:conferir, juntarFragmentos:juntarFragmentos,
  dinheiro:dinheiro, data:data, porVendedor:porVendedor };
})(typeof module!=='undefined'&&module.exports?module.exports:(typeof window!=='undefined'?window:this));
