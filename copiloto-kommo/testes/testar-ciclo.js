/* Testa o ciclo 13→12 nas fronteiras.
   É o teste mais importante do pacote: se o ciclo erra por um dia, todo
   número do painel erra junto e nada reclama.
   Rode: node testes/testar-ciclo.js                                   */
var C=require('../site/ciclo.js').MGW_CICLO_K;

var ok=0, erro=0;
function vale(nome, cond, extra){
  if(cond){ ok++; console.log('  ok   '+nome); }
  else { erro++; console.log('  ERRO '+nome+(extra?'  → '+extra:'')); }
}
function br(d){ return C.fmtBR(d); }

console.log('\n1 · As fronteiras que a especificação nomeia');
vale('12/08/2026 pertence a julho',  C.cicloDe('2026-08-12T10:00:00').label==='julho de 2026',
     C.cicloDe('2026-08-12T10:00:00').label);
vale('13/08/2026 pertence a agosto', C.cicloDe('2026-08-13T10:00:00').label==='agosto de 2026',
     C.cicloDe('2026-08-13T10:00:00').label);
vale('05/01/2026 pertence a dezembro de 2025',
     C.cicloDe('2026-01-05T10:00:00').label==='dezembro de 2025',
     C.cicloDe('2026-01-05T10:00:00').label);
vale('13/01/2026 pertence a janeiro de 2026',
     C.cicloDe('2026-01-13T10:00:00').label==='janeiro de 2026',
     C.cicloDe('2026-01-13T10:00:00').label);
vale('12/01/2026 ainda é dezembro de 2025',
     C.cicloDe('2026-01-12T23:59:00').label==='dezembro de 2025',
     C.cicloDe('2026-01-12T23:59:00').label);

console.log('\n2 · O intervalo do ciclo');
(function(){
  var j=C.ciclo('2026_07');
  vale('julho/2026 começa em 13/07/2026', br(j.ini)==='13/07/2026', br(j.ini));
  vale('julho/2026 termina em 12/08/2026', br(j.fim)==='12/08/2026', br(j.fim));
  vale('julho/2026 tem 31 dias', j.dias===31, j.dias);
  vale('o período aparece escrito', j.periodo==='13/07/2026 a 12/08/2026', j.periodo);

  var f=C.ciclo('2026_01');     /* fevereiro tem 28 em 2026 */
  vale('janeiro/2026: 13/01 a 12/02', f.periodo==='13/01/2026 a 12/02/2026', f.periodo);
  vale('janeiro/2026 tem 31 dias', f.dias===31, f.dias);

  var fev=C.ciclo('2026_02');
  vale('fevereiro/2026: 13/02 a 12/03', fev.periodo==='13/02/2026 a 12/03/2026', fev.periodo);
  vale('fevereiro/2026 tem 28 dias', fev.dias===28, fev.dias);

  var biss=C.ciclo('2024_02');  /* 2024 é bissexto */
  vale('fevereiro/2024 (bissexto) tem 29 dias', biss.dias===29, biss.dias);

  var dez=C.ciclo('2025_12');
  vale('dezembro atravessa o ano: 13/12/2025 a 12/01/2026',
       dez.periodo==='13/12/2025 a 12/01/2026', dez.periodo);
})();

console.log('\n3 · dentro() e filtrar()');
(function(){
  var j=C.ciclo('2026_07');
  vale('13/07 está dentro', C.dentro('2026-07-13T00:00:00',j));
  vale('12/08 está dentro', C.dentro('2026-08-12T23:00:00',j));
  vale('12/07 está fora',  !C.dentro('2026-07-12T23:00:00',j));
  vale('13/08 está fora',  !C.dentro('2026-08-13T00:00:00',j));
  vale('data inválida não entra', !C.dentro('abacaxi',j));
  vale('nulo não entra', !C.dentro(null,j));

  var itens=[{quando:'2026-07-12'},{quando:'2026-07-13'},{quando:'2026-08-12'},
             {quando:'2026-08-13'},{quando:'lixo'}];
  vale('filtrar devolve só os 2 do ciclo', C.filtrar(itens,j).length===2,
       C.filtrar(itens,j).length);
})();

console.log('\n4 · agruparPorCiclo — o que substitui getMonth()');
(function(){
  var itens=[{quando:'2026-08-05'},{quando:'2026-08-11'},  /* julho */
             {quando:'2026-08-13'},{quando:'2026-08-20'},{quando:'2026-09-01'}]; /* agosto */
  var g=C.agruparPorCiclo(itens);
  vale('duas vendas de agosto-calendário caem em julho',
       g.length===2 && g[0].ciclo.label==='julho de 2026' && g[0].itens.length===2,
       g.map(function(x){ return x.ciclo.label+'='+x.itens.length; }).join(' '));
  vale('três caem em agosto', g[1].itens.length===3, g[1].itens.length);
  vale('grupos vêm em ordem', g[0].ciclo.ym<g[1].ciclo.ym);
  vale('data inválida é descartada sem quebrar',
       C.agruparPorCiclo([{quando:'xx'}]).length===0);
})();

console.log('\n5 · Os outros três recortes');
(function(){
  var d=C.diaDe('2026-08-05T15:00:00');
  vale('dia tem 1 dia', d.dias===1 && br(d.ini)==='05/08/2026');

  var s=C.semanaDe('2026-08-05T15:00:00');  /* 05/08/2026 é quarta */
  vale('semana começa na segunda', br(s.ini)==='03/08/2026', br(s.ini));
  vale('semana termina no domingo', br(s.fim)==='09/08/2026', br(s.fim));
  var dom=C.semanaDe('2026-08-09T10:00:00'); /* domingo */
  vale('domingo pertence à semana que começou na segunda anterior',
       br(dom.ini)==='03/08/2026', br(dom.ini));
  var seg=C.semanaDe('2026-08-10T10:00:00');
  vale('segunda abre semana nova', br(seg.ini)==='10/08/2026', br(seg.ini));

  var p=C.periodo('2026-08-20','2026-08-01');
  vale('período aceita datas invertidas', br(p.ini)==='01/08/2026' && p.dias===20,
       p.periodo+' / '+p.dias);

  /* o que faz a tela ter um caminho só: todos os recortes têm ini/fim */
  [d,s,p,C.ciclo('2026_07')].forEach(function(r,i){
    vale('recorte '+i+' tem ini, fim e dias',
         !!r.ini && !!r.fim && r.dias>0);
  });
})();

console.log('\n6 · Seletor de ciclos');
(function(){
  var u=C.ultimosCiclos(13, new Date(2026,7,20));  /* 20/08/2026 */
  vale('13 ciclos', u.length===13, u.length);
  vale('o primeiro é agosto de 2026', u[0].label==='agosto de 2026', u[0].label);
  vale('o último é agosto de 2025', u[12].label==='agosto de 2025', u[12].label);
  vale('nenhum repetido', (function(){
    var v={}; return u.every(function(c){ if(v[c.ym]) return false; v[c.ym]=1; return true; });
  })());
  console.log('       '+u.map(function(c){ return c.curto; }).join(' · '));
})();

console.log('\n7 · Bate com o app de vendas');
(function(){
  vale('a virada é dia 12', C.DIA_VIRADA===12);
  /* número verificado no app de vendas em 06/10/2026: o ciclo corrente
     tinha 42 reservas somando R$ 201.354,38 — se a definição do ciclo
     mudar, aquele total muda, e os dois painéis divergem. */
  var c=C.cicloAtual(new Date(2026,9,6));   /* 06/10/2026 */
  vale('em 06/10/2026 o ciclo é setembro de 2026',
       c.label==='setembro de 2026', c.label);
  vale('e vai de 13/09 a 12/10', c.periodo==='13/09/2026 a 12/10/2026', c.periodo);
})();

console.log('\n'+ok+' passaram, '+erro+' falharam\n');
process.exit(erro?1:0);
