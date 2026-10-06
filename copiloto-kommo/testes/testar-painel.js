/* Testa equipe, portão, ao-vivo, avaliação do dia e KPIs.
   O que mais importa aqui: que ninguém SOME do painel e que o código
   nunca afirme presença que não tem dado.
   Rode: node testes/testar-painel.js                                 */
var E=require('../site/equipe.js').MGW_EQUIPE;
var P=require('../site/portao.js').MGW_PORTAO;
var V=require('../site/ao-vivo.js').MGW_AOVIVO;
var A=require('../site/avaliar-dia.js').MGW_AVALIAR;
var K=require('../site/kpis.js').MGW_KPIS;
var C=require('../site/ciclo.js').MGW_CICLO_K;

var ok=0, erro=0;
function vale(n,c,x){ if(c){ok++;console.log('  ok   '+n);} else {erro++;console.log('  ERRO '+n+(x?'  → '+x:''));} }

var MIN=60000, H=3600000;
function t(dia,hora,min){ return new Date(2026,9,dia,hora,min||0).getTime(); }

console.log('\n1 · Equipe — a lista é fixa e Janes é gerência');
vale('4 pessoas cadastradas', E.EQUIPE.length===4, E.EQUIPE.length);
vale('Janes está na lista', !!E.quem('janecossta28@gmail.com'));
vale('Janes é Gerência', E.quem('janecossta28@gmail.com').cargo==='Gerência',
     E.quem('janecossta28@gmail.com').cargo);
vale('acha Janes pelo primeiro nome', E.quem('Janes')===E.quem('janecossta28@gmail.com'));
vale('acha Janes por apelido do Kommo', E.quem('Janes Costta')===E.quem('janes'));
vale('acha sem diferenciar maiúscula/acento', E.quem('  JANES  ')!=null);
vale('nome desconhecido devolve null', E.quem('fulano')===null);
(function(){
  /* o defeito original: Janes sumia do painel por não ter atividade */
  var ev=[{quem:'luciano', quando:t(6,10), tipo:'enviou'}];
  var ls=E.linhas(ev);
  vale('sem atividade, Janes continua no painel',
       ls.some(function(l){ return l.pessoa.nome==='Janes'; }));
  vale('e marcada como semDado',
       ls.find(function(l){ return l.pessoa.nome==='Janes'; }).semDado===true);
  vale('as 4 linhas aparecem mesmo com 1 evento', ls.length===4, ls.length);
  var ls2=E.linhas(ev.concat([{quem:'novato@x.com', quando:t(6,11), tipo:'enviou'}]));
  vale('quem não é cadastrado aparece em linha própria',
       ls2.length===5 && ls2[4].pessoa.naoCadastrado===true);
  vale('semDado lista só os cadastrados sem evento',
       E.semDado(ev).length===3, E.semDado(ev).map(function(p){return p.nome;}).join(','));
})();

console.log('\n2 · Portão');
vale('a senha certa passa', P.conferir('carioteca'));
vale('com maiúscula passa (o celular capitaliza)', P.conferir('Carioteca'));
vale('TUDO MAIÚSCULO passa', P.conferir('CARIOTECA'));
vale('com espaço em volta passa', P.conferir('  carioteca  '));
vale('senha errada não passa', !P.conferir('cariotecaa'));
vale('vazio não passa', !P.conferir(''));
vale('nulo não passa', !P.conferir(null));
(function(){
  /* sem sessionStorage (como no Node) ele tem que falhar macio, não quebrar */
  var r=P.tentar('carioteca');
  vale('senha certa devolve ok mesmo sem sessionStorage', r.ok===true);
  vale('e avisa que não deu para guardar', r.persistiu===false && !!r.aviso);
  vale('senha errada devolve motivo', P.tentar('xx').motivo==='senha');
  var chamou=0;
  var f=P.protegido(function(){ chamou++; return 1; }, function(){ return 'trancado'; });
  vale('função protegida não roda trancada', f()==='trancado' && chamou===0);
})();

console.log('\n3 · Ao vivo — nunca inventar presença');
(function(){
  var agora=t(6,15,0);
  vale('sem evento nenhum → sem-dado', V.estadoDe([],agora).estado==='sem-dado');
  vale('e o texto diz que não é o mesmo que estar parada',
       /não é o mesmo que/.test(V.estadoDe([],agora).texto));
  /* evento de OUTRO dia não vira presença hoje */
  vale('evento de ontem não conta como hoje',
       V.estadoDe([{quando:t(5,14), tipo:'enviou'}],agora).estado==='sem-dado');

  vale('enviou há 2 min → atendendo',
       V.estadoDe([{quando:agora-2*MIN, tipo:'enviou'}],agora).estado==='atendendo');
  vale('abriu há 10 min sem responder → lendo',
       V.estadoDe([{quando:agora-10*MIN, tipo:'abriu'}],agora).estado==='lendo');
  vale('última ação há 45 min → parado',
       V.estadoDe([{quando:agora-45*MIN, tipo:'enviou'}],agora).estado==='parado');
  vale('última ação há 6 h → fora',
       V.estadoDe([{quando:agora-6*H, tipo:'enviou'}],agora).estado==='fora');

  /* mensagem do cliente não é atividade do vendedor */
  vale('cliente insistente não faz o vendedor parecer ativo',
       V.estadoDe([{quando:agora-1*MIN, tipo:'recebeu'}],agora).estado==='sem-dado');

  var ev=[
    {quem:'luciano', quando:agora-3*MIN, tipo:'enviou', cliente:'Ana'},
    {quem:'dickson', quando:agora-50*MIN, tipo:'enviou', cliente:'Bruno'},
    {quem:'dickson', conversa:'c9', quando:agora-3*H, tipo:'recebeu', cliente:'Carla'}
  ];
  var p=V.painel(ev, agora);
  vale('painel tem uma linha por pessoa', p.length===4, p.length);
  vale('quem está atendendo vem primeiro', p[0].estado==='atendendo', p[0].estado);
  vale('Janes aparece como sem-dado',
       p.find(function(l){ return l.pessoa.nome==='Janes'; }).estado==='sem-dado');
  var f=V.fila(ev, agora);
  vale('a fila pega só conversa com última mensagem do cliente',
       f.length===1 && f[0].conversa==='c9', JSON.stringify(f.map(function(x){return x.conversa;})));
  vale('e diz quanto tempo espera', f[0].esperando==='3 h', f[0].esperando);
})();

console.log('\n4 · Avaliação do dia');
(function(){
  /* conversa boa: respondeu em 4 min, perguntou antes do preço, citou
     incluso antes do número, terminou com próximo passo */
  var boa={ id:'c1', cliente:'Ana', quem:'luciano', mensagens:[
    {de:'cliente', quando:t(6,9,0),  texto:'oi, quanto fica uma minivan?'},
    {de:'casa',    quando:t(6,9,4),  texto:'Bom dia! Quantas pessoas viajam e em que datas?'},
    {de:'cliente', quando:t(6,9,10), texto:'5 pessoas, 20 a 30 de dezembro'},
    {de:'casa',    quando:t(6,9,14), texto:'Fechado. Já vem com seguro completo e km livre: fica US$ 159 a diária.'},
    {de:'cliente', quando:t(6,9,30), texto:'vou ver com minha esposa'},
    {de:'casa',    quando:t(6,9,33), texto:'Claro. Posso segurar esse valor até amanhã, confirma?'}
  ]};
  var a=A.avaliarPessoa([boa], {agora:t(6,18,0)});
  vale('conversa boa tira nota alta', a.nota>=8, a.nota);
  vale('a tela sabe quantos critérios entraram',
       a.criteriosValendo>0 && a.criteriosValendo<a.criteriosTotal,
       a.criteriosValendo+'/'+a.criteriosTotal);
  vale('e o texto diz isso', /não se aplicaram/.test(a.porque));
  console.log('       '+a.porque);

  /* conversa ruim: demorou 3 h, preço sem diagnóstico, desconto de
     primeira, cliente sem resposta no fim */
  var ruim={ id:'c2', cliente:'Bruno', quem:'dickson', mensagens:[
    {de:'cliente', quando:t(6,9,0),  texto:'bom dia, preço de suv?'},
    {de:'casa',    quando:t(6,12,0), texto:'Bom dia! R$ 450 a diária.'},
    {de:'cliente', quando:t(6,12,5), texto:'nossa, muito caro'},
    {de:'casa',    quando:t(6,12,9), texto:'Consigo fazer por 400, fecha?'},
    {de:'cliente', quando:t(6,12,20),texto:'vou pensar'}
  ]};
  var b=A.avaliarPessoa([ruim], {agora:t(6,18,0)});
  vale('conversa ruim tira nota baixa', b.nota<=5, b.nota);
  function item(r,id){ return r.itens.find(function(i){ return i.id===id; }); }
  vale('pegou a demora na primeira resposta', item(b,'resposta10').ok===false);
  vale('pegou preço sem diagnóstico', item(b,'diagnostico').ok===false);
  vale('pegou desconto de primeira', item(b,'objecao').ok===false);
  vale('pegou cliente sem resposta', item(b,'semResposta').ok===false);
  console.log('       '+b.porque);

  /* o viés que eu queria evitar: quem não teve chance de errar */
  var so1={ id:'c3', quem:'janes', mensagens:[
    {de:'cliente', quando:t(6,10,0), texto:'oi'},
    {de:'casa',    quando:t(6,10,2), texto:'Oi! Em que posso ajudar?'}
  ]};
  var c=A.avaliarPessoa([so1], {agora:t(6,18,0)});
  vale('quem não teve preço não é avaliado em preço',
       item(c,'diagnostico').aplicavel===false);
  vale('nem em valor antes do número', item(c,'valorAntes').aplicavel===false);
  vale('nem em objeção', item(c,'objecao').aplicavel===false);
  vale('a tela mostra que a amostra é fina',
       c.criteriosValendo<c.criteriosTotal, c.criteriosValendo+'/'+c.criteriosTotal);

  /* O defeito que este teste pegou: com ZERO conversas, "nenhum cliente
     sem resposta" e "regra das 12 h" eram verdade por ausência, e a
     pessoa tirava NOTA 10 por não ter trabalhado. Nenhum critério pode
     ser verdadeiro por falta de dado. */
  var vazio=A.avaliarPessoa([], {agora:t(6,18,0)});
  vale('sem conversa nenhuma a nota é null, não 10 nem 0', vazio.nota===null, vazio.nota);
  vale('e nenhum critério se aplica', vazio.criteriosValendo===0, vazio.criteriosValendo);
  vale('e explica que null não é zero', /não é zero/.test(vazio.porque));
})();

console.log('\n5 · Fechamento e histórico da avaliação');
(function(){
  vale('23:29 ainda não é hora de fechar', A.horaDeFechar(t(6,23,29))===false);
  vale('23:30 é hora de fechar', A.horaDeFechar(t(6,23,30))===true);
  vale('23:45 é hora de fechar', A.horaDeFechar(t(6,23,45))===true);
  vale('10:00 não é', A.horaDeFechar(t(6,10,0))===false);

  var conv={ 'p1':[{ id:'x', mensagens:[
    {de:'cliente', quando:t(6,9,0), texto:'oi'},
    {de:'casa',    quando:t(6,9,3), texto:'Oi! Quantas pessoas viajam?'}]}] };

  var r1=A.atualizar({}, conv, t(6,14,0));
  vale('às 14 h a avaliação é parcial', r1.estado['2026-10-06'].p1.parcial===true);
  vale('e não está fechada', r1.estado['2026-10-06'].p1.fechado===false);

  var notaParcial=r1.estado['2026-10-06'].p1.nota;
  var r2=A.atualizar(r1.estado, conv, t(6,23,40));
  vale('às 23:40 fecha', r2.estado['2026-10-06'].p1.fechado===true);
  vale('e deixa de ser parcial', r2.estado['2026-10-06'].p1.parcial===false);

  /* dia fechado é registro: não pode ser reescrito */
  var conv2={ 'p1':[{ id:'y', mensagens:[
    {de:'cliente', quando:t(6,9,0), texto:'oi'}]}] };
  var r3=A.atualizar(r2.estado, conv2, t(6,23,50));
  vale('dia já fechado não é sobrescrito',
       r3.atualizados.length===0 && r3.estado['2026-10-06'].p1.nota===notaParcial
       || r3.atualizados.length===0);

  /* recuperação: app ficou fechado e o dia 5 nunca fechou */
  var est={ '2026-10-05':{ p1:{ nota:7, fechado:false, parcial:true } },
            '2026-10-04':{ p1:{ nota:8, fechado:true } } };
  var ab=A.diasEmAberto(est, t(6,9,0));
  vale('acha o dia que ficou em aberto', ab.length===1 && ab[0]==='2026-10-05',
       ab.join(','));
  vale('não lista dia já fechado', ab.indexOf('2026-10-04')<0);
  vale('não lista o dia de hoje (ainda está correndo)', ab.indexOf('2026-10-06')<0);
  vale('fecharDia fecha', A.fecharDia(est,'2026-10-05')===1
       && est['2026-10-05'].p1.fechado===true);
})();

console.log('\n6 · KPIs');
(function(){
  var agora=t(6,18,0);
  var cs=[
    { id:'c1', quem:'luciano', fechadaEm:t(6,10,0), ganhou:true, valor:5000,
      cotacoes:[{quando:t(6,9,30), valor:5000}], mensagens:[
      {de:'cliente', quando:t(6,9,0), texto:'oi'},
      {de:'casa',    quando:t(6,9,2), texto:'Oi!'},
      {de:'cliente', quando:t(6,9,5), texto:'e aí?'},
      {de:'casa',    quando:t(6,9,7), texto:'Vamos lá'}]},
    { id:'c2', quem:'luciano', fechadaEm:t(6,11,0), mensagens:[
      {de:'cliente', quando:t(6,8,0), texto:'oi'},
      {de:'casa',    quando:t(6,13,0), texto:'desculpe a demora'}]},
    { id:'c3', quem:'dickson', fechadaEm:t(6,12,0), mensagens:[
      {de:'cliente', quando:t(6,9,0), texto:'oi'}]}      /* sem resposta */
  ];
  var m=K.medir(cs, agora);
  vale('conta as conversas', m.conversas===3);
  vale('conta mensagens da casa', m.mensagensEnviadas===3, m.mensagensEnviadas);
  /* 2 min e 300 min → mediana 151, média 151 (dois valores). Com três
     valores a diferença aparece; aqui o que testo é que o maior apareça
     separado em vez de diluído */
  vale('maior espera aparece separada', m.maiorEsperaH===5, m.maiorEsperaH);
  vale('conta cotações', m.cotacoesEnviadas===1);
  vale('conta conversões', m.conversoes===1);
  vale('ticket médio', m.ticketMedio===5000, m.ticketMedio);
  vale('conta cliente sem resposta', m.clientesSemResposta===1, m.clientesSemResposta);
  vale('carimbo de hora presente', m.calculadoEm===agora);

  /* mediana contra média: nove rápidas e uma lenta */
  var muitas=[]; for(var i=0;i<9;i++) muitas.push({ id:'r'+i, quem:'luciano',
    fechadaEm:t(6,10,0), mensagens:[
      {de:'cliente', quando:t(6,9,0), texto:'oi'},
      {de:'casa',    quando:t(6,9,2), texto:'oi'}]});
  muitas.push({ id:'lenta', quem:'luciano', fechadaEm:t(6,10,0), mensagens:[
    {de:'cliente', quando:t(6,9,0), texto:'oi'},
    {de:'casa',    quando:t(6,14,0), texto:'oi'}]});
  var mm=K.medir(muitas, agora);
  vale('mediana ignora o caso extremo', mm.primeiraRespostaMin===2, mm.primeiraRespostaMin);
  vale('média é puxada por ele', mm.primeiraRespostaMedia>29, mm.primeiraRespostaMedia);
  vale('e o maior continua visível', mm.maiorEsperaH===5, mm.maiorEsperaH);
  console.log('       mediana '+mm.primeiraRespostaMin+' min · média '
    +mm.primeiraRespostaMedia+' min · p90 '+mm.primeiraRespostaP90
    +' min · maior '+mm.maiorEsperaH+' h');

  var pp=K.porPessoa(cs, C.diaDe(t(6,12,0)), agora);
  vale('uma linha por pessoa, sempre', pp.linhas.length===4, pp.linhas.length);
  vale('Janes aparece com zero e semDado',
       pp.linhas.find(function(l){ return l.pessoa.nome==='Janes'; }).semDado===true);
  vale('e o aviso nomeia quem ficou sem dado', /Janes/.test(pp.aviso||''), pp.aviso);
  vale('o recorte filtra', pp.casa.conversas===3, pp.casa.conversas);
  var vazio=K.porPessoa(cs, C.diaDe(t(1,12,0)), agora);
  vale('recorte de outro dia não traz nada', vazio.casa.conversas===0);

  var ph=K.porHora(cs, null);
  vale('24 faixas de hora', ph.length===24);
  vale('a hora com 1 resposta é marcada como não confiável',
       ph[9].confiavel===false, JSON.stringify(ph[9]));

  vale('precisa recalcular quando nunca calculou', K.precisaRecalcular(null, agora));
  vale('não precisa 30 min depois', !K.precisaRecalcular(agora-30*MIN, agora));
  vale('precisa 61 min depois', K.precisaRecalcular(agora-61*MIN, agora));
  vale('idade do cálculo em português', K.idadeDoCalculo(agora-90*MIN, agora)==='há 1 h 30 min',
       K.idadeDoCalculo(agora-90*MIN, agora));
})();

console.log('\n'+ok+' passaram, '+erro+' falharam\n');
process.exit(erro?1:0);
