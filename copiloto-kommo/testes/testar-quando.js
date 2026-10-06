/* Testa o intervalo de retomada.
   O comportamento mais importante deste módulo é RECUSAR. Com 9 casos
   ele tem que dizer "não sei", não dizer um horário.
   Rode: node testes/testar-quando.js                                  */
var Q=require('../site/quando-retomar.js').MGW_QUANDO;

var ok=0, erro=0;
function vale(nome, cond, extra){
  if(cond){ ok++; console.log('  ok   '+nome); }
  else { erro++; console.log('  ERRO '+nome+(extra?'  → '+extra:'')); }
}
var _s=777;
function sorte(){ _s=(_s*1103515245+12345)&0x7fffffff; return _s/0x7fffffff; }

console.log('\n1 · Com pouco dado, recusa');
(function(){
  var r=[];
  for(var i=0;i<9;i++) r.push({esperouHoras:6+i, horaDoDia:10,
    diaSemana:2, respondeu:i%2===0});
  var a=Q.analisar(r);
  vale('9 retomadas → bastaDado:false', a.bastaDado===false);
  vale('não devolve recomendação', a.recomendacao===null);
  vale('diz quantas tem e quantas precisa', a.total===9 && a.precisa===40);
  vale('mantém o padrão das 12 h na explicação', /12 h/.test(a.porque));
  console.log('       '+a.porque);
})();

console.log('\n2 · Com dado bastante, acha o padrão plantado');
(function(){
  /* Verdade plantada: esperar entre 12 e 24 h responde muito mais. */
  var r=[];
  for(var i=0;i<300;i++){
    var h=[3,8,18,36,70,200][Math.floor(sorte()*6)];
    var base=0.22;
    if(h>=12 && h<24) base=0.50;
    r.push({ esperouHoras:h, horaDoDia:Math.floor(sorte()*24),
      diaSemana:Math.floor(sorte()*7), respondeu:sorte()<base });
  }
  var a=Q.analisar(r);
  vale('300 retomadas → bastaDado:true', a.bastaDado===true);
  vale('recomenda a faixa de 12 a 24 h',
       a.recomendacao.espera && /12 a 24/.test(a.recomendacao.espera.rotulo),
       a.recomendacao.espera && a.recomendacao.espera.rotulo);
  vale('a faixa recomendada é confiável (≥12 casos)',
       a.recomendacao.espera && a.recomendacao.espera.n>=12);
  vale('cita quantos pontos acima da média', /pontos acima/.test(a.porque));
  console.log('       '+a.porque);
})();

console.log('\n3 · Sem padrão nenhum, diz que não há padrão');
(function(){
  var r=[];
  for(var i=0;i<300;i++) r.push({
    esperouHoras:[3,8,18,36,70,200][Math.floor(sorte()*6)],
    horaDoDia:Math.floor(sorte()*24),
    diaSemana:Math.floor(sorte()*7), respondeu:sorte()<0.3 });
  var a=Q.analisar(r);
  vale('bastaDado:true mas nada recomendado', a.bastaDado===true
    && !a.recomendacao.espera && !a.recomendacao.hora && !a.recomendacao.dia);
  vale('explica que isso também é resultado', /também é resultado/.test(a.porque));
  console.log('       '+a.porque);
})();

console.log('\n4 · Faixas');
(function(){
  vale('0 h cai em "menos de 6 h"', Q.faixaDe(0).nome==='menos de 6 h');
  vale('12 h cai em "12 a 24 h"', Q.faixaDe(12).nome==='12 a 24 h');
  vale('11,9 h ainda é "6 a 12 h"', Q.faixaDe(11.9).nome==='6 a 12 h');
  vale('1000 h é "mais de 4 dias"', Q.faixaDe(1000).nome==='mais de 4 dias');
  vale('registro sem hora é descartado, não quebra',
       Q.analisar([{respondeu:true},{esperouHoras:-1}]).total===0);
})();

console.log('\n'+ok+' passaram, '+erro+' falharam\n');
process.exit(erro?1:0);
