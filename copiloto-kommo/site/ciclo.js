/* ═══════════════════════════════════════════════════════════════════
   CICLO DO MÊS — dia 13 ao dia 12 do mês seguinte
   ───────────────────────────────────────────────────────────────────
   Cópia da função do app de vendas (index.html, bloco mgw-ciclo-js).
   Está aqui para o Copiloto NÃO reescrever a conta do mês.

   Por que isto é um arquivo separado e por que importa: no app de
   vendas, a aba Histórico contava por calendário e o Dashboard contava
   por ciclo. Deu **9 cotações contra 4 para o mesmo agosto**. Ninguém
   viu por semanas, porque as duas telas estavam certas pela própria
   régua — e nenhuma avisava qual régua usava. Dois painéis com totais
   diferentes para o mesmo mês é pior do que um painel a menos.

   Regra, por extenso: o mês de **julho de 2026** vai de **13/07/2026 a
   12/08/2026**. Uma venda de 05/08 é de **julho**. Uma de 13/08 é de
   agosto. Uma de 05/01 é de **dezembro do ano anterior**.

   NÃO USE getMonth() SOLTO para agrupar nada. Use `cicloDe(data)`.
   Só a parte de datas foi copiada: reservas, comissão e metas ficam no
   app de vendas, que é onde está a planilha.
   ═══════════════════════════════════════════════════════════════════ */
(function(raiz){
'use strict';

var DIA_VIRADA=12;   /* o ciclo fecha no dia 12; começa no 13 */

var MESES=['janeiro','fevereiro','março','abril','maio','junho','julho',
           'agosto','setembro','outubro','novembro','dezembro'];
var MES3=['JAN','FEV','MAR','ABR','MAI','JUN','JUL','AGO','SET','OUT','NOV','DEZ'];

function d0(d){ return new Date(d.getFullYear(),d.getMonth(),d.getDate()); }
function fmtBR(d){ return d?(('0'+d.getDate()).slice(-2)+'/'
  +('0'+(d.getMonth()+1)).slice(-2)+'/'+d.getFullYear()):'—'; }
function ym(ano,mes0){ return ano+'_'+String(mes0+1).padStart(2,'0'); }

/* ciclo('2026_07') → 13/07/2026 a 12/08/2026, rotulado "julho de 2026" */
function ciclo(chave){
  var p=String(chave||'').split('_');
  var ano=+p[0], mes=+p[1]-1;
  if(!isFinite(ano)||!isFinite(mes)) return cicloAtual();
  var ini=new Date(ano,mes,DIA_VIRADA+1);
  var fim=new Date(ano,mes+1,DIA_VIRADA);
  return { ym:ym(ano,mes), ini:ini, fim:fim,
    label:MESES[ini.getMonth()]+' de '+ini.getFullYear(),
    curto:MES3[ini.getMonth()]+'/'+ini.getFullYear(),
    periodo:fmtBR(ini)+' a '+fmtBR(fim),
    dias:Math.round((fim-ini)/86400000)+1 };
}

/* O ciclo que contém hoje: antes do dia 13, ainda é o ciclo anterior. */
function cicloAtual(hoje){
  var h=hoje?new Date(hoje):new Date();
  var ano=h.getFullYear(), mes=h.getMonth();
  if(h.getDate()<=DIA_VIRADA){ mes-=1; if(mes<0){ mes=11; ano-=1; } }
  return ciclo(ym(ano,mes));
}

/* A ÚNICA forma de agrupar. Recebe data (ou texto de data) e devolve o
   ciclo a que ela pertence. */
function cicloDe(data){
  var d=(data instanceof Date)?data:new Date(data);
  if(isNaN(d.getTime())) return null;
  return cicloAtual(d);
}
function ymDe(data){ var c=cicloDe(data); return c?c.ym:null; }

function dentro(d,c){
  if(!d||!c) return false;
  var x=d0((d instanceof Date)?d:new Date(d));
  if(isNaN(x.getTime())) return false;
  return x>=d0(c.ini) && x<=d0(c.fim);
}

/* Agrupa qualquer lista por ciclo. `quando` diz onde está a data. */
function agruparPorCiclo(itens, quando){
  quando=quando||function(x){ return x.quando; };
  var m={};
  (itens||[]).forEach(function(x){
    var c=cicloDe(quando(x));
    if(!c) return;
    if(!m[c.ym]) m[c.ym]={ ciclo:c, itens:[] };
    m[c.ym].itens.push(x);
  });
  return Object.keys(m).sort().map(function(k){ return m[k]; });
}

/* Os ciclos anteriores, do mais novo para o mais velho — para o seletor. */
function ultimosCiclos(n, hoje){
  var c=cicloAtual(hoje), out=[c];
  for(var i=1;i<(n||12);i++){
    var p=c.ini;
    var mes=p.getMonth()-i, ano=p.getFullYear();
    while(mes<0){ mes+=12; ano-=1; }
    out.push(ciclo(ym(ano,mes)));
  }
  return out;
}

/* ── os outros três recortes que o painel pede ──────────────────────
   Dia e semana não dependem da virada: o dia é o dia. A semana começa
   na segunda, que é como a equipe fala ("essa semana"). */
function diaDe(data){
  var d=(data instanceof Date)?data:new Date(data);
  if(isNaN(d.getTime())) return null;
  var x=d0(d);
  return { ini:x, fim:x, label:fmtBR(x), periodo:fmtBR(x), dias:1,
           chave:x.getFullYear()+'-'+String(x.getMonth()+1).padStart(2,'0')
                +'-'+String(x.getDate()).padStart(2,'0') };
}
function semanaDe(data){
  var d=(data instanceof Date)?data:new Date(data);
  if(isNaN(d.getTime())) return null;
  var x=d0(d);
  var dow=x.getDay();                 /* 0 domingo */
  var recua=(dow===0)?6:(dow-1);      /* segunda é o início */
  var ini=new Date(x.getFullYear(),x.getMonth(),x.getDate()-recua);
  var fim=new Date(ini.getFullYear(),ini.getMonth(),ini.getDate()+6);
  return { ini:ini, fim:fim, dias:7,
    label:'semana de '+fmtBR(ini), periodo:fmtBR(ini)+' a '+fmtBR(fim),
    chave:ini.getFullYear()+'-S'+fmtBR(ini).slice(0,5) };
}
function periodo(de,ate){
  var a=d0(new Date(de)), b=d0(new Date(ate));
  if(isNaN(a.getTime())||isNaN(b.getTime())) return null;
  if(a>b){ var t=a; a=b; b=t; }
  return { ini:a, fim:b, dias:Math.round((b-a)/86400000)+1,
    label:'período', periodo:fmtBR(a)+' a '+fmtBR(b),
    chave:'P'+fmtBR(a)+'_'+fmtBR(b) };
}

/* Qualquer um dos quatro recortes devolve {ini,fim,...}, então `dentro`
   e `filtrar` funcionam igual para todos. É isso que faz os recortes da
   tela não precisarem de quatro caminhos de código diferentes. */
function filtrar(itens, recorte, quando){
  quando=quando||function(x){ return x.quando; };
  return (itens||[]).filter(function(x){ return dentro(quando(x), recorte); });
}

raiz.MGW_CICLO_K={ DIA_VIRADA:DIA_VIRADA, MESES:MESES, MES3:MES3,
  ciclo:ciclo, cicloAtual:cicloAtual, cicloDe:cicloDe, ymDe:ymDe,
  dentro:dentro, agruparPorCiclo:agruparPorCiclo, ultimosCiclos:ultimosCiclos,
  diaDe:diaDe, semanaDe:semanaDe, periodo:periodo, filtrar:filtrar,
  fmtBR:fmtBR };
})(typeof module!=='undefined'&&module.exports?module.exports:(typeof window!=='undefined'?window:this));
