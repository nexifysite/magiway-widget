/* Confere a bibliografia embarcada.
   É cópia do app de vendas, então o teste não julga o conteúdo — ele
   garante que a cópia está INTEIRA e que a ponte tipo→módulo responde.
   Se algum número aqui cair, a extração perdeu bloco.
   Rode: node testes/testar-bibliografia.js                            */
var B=require('../site/bibliografia.js').MGW_BIBLIOGRAFIA;

var ok=0, erro=0;
function vale(nome, cond, extra){
  if(cond){ ok++; console.log('  ok   '+nome); }
  else { erro++; console.log('  ERRO '+nome+(extra?'  → '+extra:'')); }
}

var n=B.numeros();
console.log('\n1 · A cópia está inteira');
vale('30 módulos de curso', n.modulos===30, n.modulos);
vale('58 referências acadêmicas', n.referencias===58, n.referencias);
vale('28 grupos de manual', n.gruposManual===28, n.gruposManual);
vale('126 situações', n.situacoes===126, n.situacoes);
vale('282 falas prontas', n.falas===282, n.falas);
vale('14 tipos com fundamento', n.tiposComFundamento===14, n.tiposComFundamento);

console.log('\n2 · Módulos numerados 1..30 sem buraco');
(function(){
  var c=B.curso(), vistos={};
  c.forEach(function(m){ vistos[m.n]=1; });
  var falta=[];
  for(var i=1;i<=30;i++) if(!vistos[i]) falta.push(i);
  vale('nenhum número faltando', falta.length===0, falta.join(','));
  vale('todo módulo tem título', c.every(function(m){ return !!m.t; }));
  vale('todo módulo tem eixo', c.every(function(m){ return !!m.eixo; }));
  vale('toda referência tem autor e ano',
       c.every(function(m){ return (m.teoria||[]).every(function(t){
         return !t.ref || /\(\d{4}\)/.test(t.ref); }); }));
})();

console.log('\n3 · A ponte responde — é o que torna o agente independente');
(function(){
  var tipos=Object.keys(B.PONTE);
  var semNada=[];
  tipos.forEach(function(t){
    var f=B.fundamento(t);
    if(!f || !f.modulos.length) semNada.push(t);
  });
  vale('todo tipo da ponte devolve ao menos um módulo',
       semNada.length===0, semNada.join(','));

  /* Este é o teste que importa de verdade, e ele nasceu de um erro:
     a ponte foi escrita contra uma numeração antiga e mandava "caro"
     para o módulo "Os sete passos, montados". Nada quebrava — o agente
     só citava fundamento errado. A régua: ao menos uma palavra de peso
     do `porque` tem que aparecer no título de algum módulo citado. */
  function limpo(s){ return String(s).toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g,''); }
  var incoerentes=[];
  tipos.forEach(function(t){
    var p=B.PONTE[t], f=B.fundamento(t);
    if(!p.curso.length) return;
    var titulos=limpo(f.modulos.map(function(m){ return m.titulo; }).join(' '));
    var palavras=limpo(p.porque).split(/[^a-z]+/).filter(function(w){ return w.length>=5; });
    if(!palavras.some(function(w){ return titulos.indexOf(w)>=0; }))
      incoerentes.push(t+' → "'+p.porque+'" vs "'+titulos+'"');
  });
  vale('o módulo citado combina com o motivo citado',
       incoerentes.length===0, incoerentes.join(' | '));

  var fora=[];
  tipos.forEach(function(t){ B.PONTE[t].curso.forEach(function(n){
    if(!(n>=1&&n<=30)) fora.push(t+':'+n); }); });
  vale('nenhum módulo citado fora de 1..30', fora.length===0, fora.join(','));

  var grupos={}; B.manual().forEach(function(g){ groupKey(g); });
  function groupKey(g){ grupos[g.g]=1; }
  var semGrupo=[];
  tipos.forEach(function(t){ B.PONTE[t].manual.forEach(function(g){
    if(!grupos[g]) semGrupo.push(t+' → "'+g+'"'); }); });
  vale('todo grupo de manual citado existe', semGrupo.length===0, semGrupo.join(' | '));

  var f=B.fundamento('caro');
  vale('"caro" tem fundamento', !!f);
  vale('"caro" cita módulos', f && f.modulos.length>0,
       f && f.modulos.map(function(m){return m.n;}).join(','));
  vale('"caro" tem situação de manual', f && f.situacoes.length>0);
  vale('"caro" tem falas prontas', B.falasPara('caro').length>0,
       B.falasPara('caro').length+' falas');
  vale('tipo inexistente devolve null', B.fundamento('xpto')===null);
  vale('falasPara de tipo inexistente devolve lista vazia',
       B.falasPara('xpto').length===0);
  if(f){
    console.log('       caro → módulos '+f.modulos.map(function(m){
      return m.n+' "'+m.titulo+'"'; }).join(' · '));
    console.log('              '+f.situacoes.length+' situações · '
      +B.falasPara('caro').length+' falas prontas');
  }
})();

console.log('\n4 · Nada de resposta vazia');
(function(){
  var m=B.manual(), vazias=0;
  m.forEach(function(g){ g.itens.forEach(function(i){
    if(!i.f || !i.f.length) vazias++; }); });
  vale('toda situação tem ao menos uma fala', vazias===0, vazias+' sem fala');
  vale('metodoExtra presente', !!B.metodoExtra);
})();

console.log('\n'+ok+' passaram, '+erro+' falharam\n');
process.exit(erro?1:0);
