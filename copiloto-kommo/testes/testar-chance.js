/* Testa a nota de chance de fechar.
   O que importa aqui não é "o modelo acerta" — é que ele RECUSA quando
   deve: com pouco dado, com sinal que não serve, e que aponta o
   vazamento. Modelo que nunca recusa é modelo que vai enganar um dia.
   Rode: node testes/testar-chance.js                                  */
var C=require('../site/chance-de-fechar.js').MGW_CHANCE;

var ok=0, erro=0;
function vale(nome, cond, extra){
  if(cond){ ok++; console.log('  ok   '+nome); }
  else { erro++; console.log('  ERRO '+nome+(extra?'  → '+extra:'')); }
}

/* sorteio com semente, para o teste dar sempre o mesmo resultado */
var _s=12345;
function sorte(){ _s=(_s*1103515245+12345)&0x7fffffff; return _s/0x7fffffff; }

console.log('\n1 · Recusa com pouco dado');
(function(){
  var r=[];
  for(var i=0;i<30;i++) r.push({ganhou:i%3===0, quando:i,
    sinais:{origem:'anuncio', informouDatas:i%2===0}});
  var m=C.treinar(r);
  vale('30 encerradas → serve:false', m.serve===false);
  vale('a recusa diz o número que falta', /60/.test(m.porque||''));

  var so5=[];
  for(var j=0;j<70;j++) so5.push({ganhou:j<5, quando:j,
    sinais:{origem:'anuncio'}});
  var m2=C.treinar(so5);
  vale('70 encerradas mas só 5 ganhas → serve:false', m2.serve===false);
})();

console.log('\n2 · Aprende um sinal plantado e mede em dado novo');
var comSinal=(function(){
  /* Verdade plantada: quem informou as datas E veio por indicação fecha
     muito mais. O resto é barulho. */
  var r=[];
  for(var i=0;i<400;i++){
    var datas=sorte()<0.5;
    var origem=sorte()<0.3?'indicacao':(sorte()<0.6?'anuncio':'organico');
    var base=0.12;
    if(datas) base+=0.30;
    if(origem==='indicacao') base+=0.25;
    r.push({ ganhou:sorte()<base, quando:i, sinais:{
      origem:origem, informouDatas:datas,
      vendedor:['ana','bia','caio'][Math.floor(sorte()*3)],
      diarias:Math.floor(sorte()*14)+1,
      faixaHoraContato:Math.floor(sorte()*24)
    }});
  }
  return r;
})();
(function(){
  var a=C.avaliar(comSinal);
  vale('avaliar() aprova', a.serve===true, a.porque);
  vale('AUC acima de 0,60', a.serve && a.auc>=0.60, 'auc='+(a.auc));
  vale('calibrou 5 faixas', a.serve && a.faixas.length===5);
  if(a.serve){
    var pri=a.faixas[0].taxa, ult=a.faixas[4].taxa;
    vale('faixa alta fecha mais que faixa baixa', ult>pri,
         pri+'% → '+ult+'%');
    console.log('       AUC '+a.auc+' | faixas: '+a.faixas.map(function(f){
      return f.nome+' '+f.taxa+'%'; }).join(' · '));

    var bom=C.pontuar(a.modelo,{origem:'indicacao', informouDatas:true,
      vendedor:'ana', diarias:7, faixaHoraContato:14});
    var ruim=C.pontuar(a.modelo,{origem:'organico', informouDatas:false,
      vendedor:'ana', diarias:7, faixaHoraContato:14});
    vale('lead com os dois sinais bons tira nota maior', bom.nota>ruim.nota,
         bom.nota+' vs '+ruim.nota);
    vale('a explicação cita sinal a favor', bom.aFavor.length>0);
    vale('a explicação cita sinal contra no lead ruim', ruim.contra.length>0);
    /* vendedor, diárias e hora foram sorteados: não têm relação com o
       ganho. Se aparecerem como motivo, a explicação está mentindo. */
    function citados(x){ return x.aFavor.concat(x.contra)
      .map(function(d){ return d.sinal; }).join(' '); }
    vale('não culpa o vendedor por barulho',
         !/vendedor=/.test(citados(bom)+citados(ruim)), citados(bom)+' | '+citados(ruim));
    vale('não cita número sorteado como motivo',
         !/diarias=|faixaHoraContato=/.test(citados(bom)+citados(ruim)),
         citados(bom)+' | '+citados(ruim));
    vale('cita os dois sinais que são de verdade',
         /informouDatas=/.test(citados(bom)+citados(ruim))
         && /origem=/.test(citados(bom)+citados(ruim)));
    console.log('       bom:  '+bom.porque);
    console.log('       ruim: '+ruim.porque);
  }
})();

console.log('\n3 · Recusa quando o sinal não tem nada a ver');
(function(){
  var r=[];
  for(var i=0;i<400;i++) r.push({ ganhou:sorte()<0.35, quando:i, sinais:{
    origem:['a','b','c','d'][Math.floor(sorte()*4)],
    cor:['azul','preto','branco'][Math.floor(sorte()*3)],
    numeroQualquer:Math.floor(sorte()*100)
  }});
  var a=C.avaliar(r);
  vale('barulho puro → serve:false', a.serve===false, 'auc='+a.auc);
  vale('a recusa mostra o AUC medido', a.serve===false && a.auc!=null);
  if(a.serve===false) console.log('       '+a.porque);
})();

console.log('\n4 · Aponta vazamento');
(function(){
  var r=[];
  for(var i=0;i<300;i++){
    var g=sorte()<0.4;
    r.push({ ganhou:g, quando:i, sinais:{
      origem:sorte()<0.5?'anuncio':'organico',
      /* este só existe depois de fechar — é o resultado disfarçado */
      contratoAssinado:g
    }});
  }
  var m=C.treinar(r);
  vale('treinou', m.serve===true);
  vale('achou sinal suspeito', m.suspeitas.length>0,
       JSON.stringify(m.suspeitas.map(function(s){return s.sinal;})));
  vale('o suspeito é o contrato', m.suspeitas.some(function(s){
    return /contratoAssinado/.test(s.sinal); }));
  if(m.suspeitas.length) console.log('       '+m.suspeitas[0].aviso);
})();

console.log('\n5 · Detalhes que já mordem na prática');
(function(){
  var m=C.treinar(comSinal);
  vale('campo vazio não derruba o registro',
       C.tokens({origem:null, informouDatas:false},{}).indexOf('origem=sem-dado')>=0);
  var n=C.pontuar(m,{origem:'marte', informouDatas:true});
  vale('valor nunca visto não quebra nem pesa', n!=null && isFinite(n.nota));
  vale('valor nunca visto aparece marcado', n.todos.some(function(d){
    return /nunca visto/.test(d.nota||''); }));
  vale('pontuar com modelo recusado devolve null',
       C.pontuar({serve:false},{origem:'anuncio'})===null);
  var cortes=C.aprenderCortes([{sinais:{x:1}},{sinais:{x:2}},{sinais:{x:3}},
    {sinais:{x:10}},{sinais:{x:20}},{sinais:{x:30}}]);
  vale('número vira três faixas', !!cortes.x && cortes.x.length===2,
       JSON.stringify(cortes.x));
  vale('AUC de separação perfeita é 1', C.auc([{ganhou:true,nota:2},
    {ganhou:false,nota:1}])===1);
  vale('AUC de nota igual é 0,5', C.auc([{ganhou:true,nota:1},
    {ganhou:false,nota:1}])===0.5);
})();

console.log('\n'+ok+' passaram, '+erro+' falharam\n');
process.exit(erro?1:0);
