/* Testa o cliente do Kommo com um `fetch` FALSO — nenhuma chamada de
   rede acontece neste teste.

   O que mais importa aqui não é "funciona": é que ele **não queime a
   conta**. O Kommo bloqueia a conta inteira (403 em tudo) quando o
   limite de requisições é estourado de forma repetida. Então a fila, o
   recuo no 429 e a parada no 403 são o teste principal.
   Rode: node testes/testar-kommo.js                                   */
var K=require('../site/kommo-api.js').MGW_KOMMO;

var ok=0, erro=0;
function vale(n,c,x){ if(c){ok++;console.log('  ok   '+n);} else {erro++;console.log('  ERRO '+n+(x?'  → '+x:''));} }

/* relógio falso: o teste roda em milissegundos, não em segundos */
function relogio(){
  var t=0;
  return { agora:function(){ return t; },
    dormir:function(ms){ t+=ms; return Promise.resolve(); },
    avancar:function(ms){ t+=ms; }, valor:function(){ return t; } };
}
function resp(status, corpo){
  return Promise.resolve({ status:status, ok:status>=200&&status<300,
    json:function(){ return Promise.resolve(corpo); },
    text:function(){ return Promise.resolve(JSON.stringify(corpo||'')); } });
}

var testes=[];
function teste(nome, fn){ testes.push([nome,fn]); }

/* ─────────────────────────────────────────────────────────────────── */
teste('1 · Configuração faltando é dita, não quebrada', function(){
  var c=K.criar({ subdominio:'', token:'' , fetch:function(){ throw new Error('não devia chamar'); }});
  return c.conferir().then(function(r){
    vale('sem subdomínio não tenta conectar', r.ok===false && r.etapa==='config');
    vale('e explica o que falta', /subdominio/.test(r.porque), r.porque);
    var c2=K.criar({ subdominio:'magiway', token:'', fetch:function(){ throw new Error('não devia chamar'); }});
    return c2.conferir();
  }).then(function(r){
    vale('sem token não tenta conectar', r.ok===false);
    vale('e diz para não me mandar o token', /Não me mande o token/.test(r.porque));
  });
});

teste('2 · A fila respeita 6 req/s', function(){
  var rel=relogio(), chamadas=[];
  var c=K.criar({ subdominio:'magiway', token:'t', rps:6,
    agora:rel.agora, dormir:rel.dormir,
    fetch:function(){ chamadas.push(rel.valor()); return resp(200,{ok:1}); }});
  var ps=[];
  for(var i=0;i<6;i++) ps.push(c.pedir('/account'));
  return Promise.all(ps).then(function(){
    vale('as 6 chamadas saíram', chamadas.length===6, chamadas.length);
    /* a 1ª em t=0, as outras espaçadas ~167 ms */
    var gaps=[];
    for(var j=1;j<chamadas.length;j++) gaps.push(chamadas[j]-chamadas[j-1]);
    vale('nenhuma chamada em rajada', gaps.every(function(g){ return g>=166; }),
         gaps.join(','));
    vale('6 chamadas levam ~1 segundo', chamadas[5]>=833 && chamadas[5]<=1000,
         chamadas[5]+' ms');
    console.log('       intervalos: '+gaps.join(' · ')+' ms');
  });
});

teste('3 · 429 recua e tenta de novo', function(){
  var rel=relogio(), n=0;
  var c=K.criar({ subdominio:'magiway', token:'t',
    agora:rel.agora, dormir:rel.dormir,
    fetch:function(){ n++; return n<3? resp(429,{}) : resp(200,{ok:1}); }});
  return c.pedir('/account').then(function(r){
    vale('recuperou depois de dois 429', r && r.ok===1);
    vale('tentou 3 vezes', n===3, n);
    vale('e esperou (2s + 4s)', rel.valor()>=6000, rel.valor()+' ms');
  });
});

teste('4 · 429 repetido PARA, em vez de queimar a conta', function(){
  var rel=relogio(), n=0;
  var c=K.criar({ subdominio:'magiway', token:'t',
    agora:rel.agora, dormir:rel.dormir,
    fetch:function(){ n++; return resp(429,{}); }});
  return c.pedir('/account').then(function(){
    vale('devia ter falhado', false);
  }, function(e){
    vale('parou com erro', !!e && e.parou===true);
    vale('não martelou além de 3 tentativas', n===3, n+' chamadas');
    vale('e o erro avisa do bloqueio da conta', /BLOQUEIA a conta/.test(e.message),
         e.message);
    vale('a fila fica bloqueada depois disso', c.fila.estaBloqueada()===true);
    console.log('       '+e.message);
    /* qualquer chamada posterior tem que ser recusada sem ir à rede */
    var antes=n;
    return c.pedir('/users').then(function(){ vale('devia recusar', false); },
      function(){ vale('chamada seguinte é recusada sem tocar a rede', n===antes, n); });
  });
});

teste('5 · 403 é tratado como possível bloqueio', function(){
  var rel=relogio(), n=0;
  var c=K.criar({ subdominio:'magiway', token:'t',
    agora:rel.agora, dormir:rel.dormir,
    fetch:function(){ n++; return resp(403,{}); }});
  return c.conferir().then(function(r){
    vale('conferir devolve o diagnóstico em vez de estourar', r.ok===false);
    vale('status 403 registrado', r.status===403, r.status);
    vale('manda parar, não insistir', r.parou===true);
    vale('e explica as duas causas', /escopo/.test(r.porque) && /BLOQUEADA/.test(r.porque));
    vale('não repetiu a chamada', n===1, n);
    console.log('       '+r.porque);
  });
});

teste('6 · Diagnóstico de 401 e 404', function(){
  var rel=relogio();
  function cli(status){ return K.criar({ subdominio:'magiway', token:'t',
    agora:rel.agora, dormir:rel.dormir, fetch:function(){ return resp(status,{}); }}); }
  return cli(401).conferir().then(function(r){
    vale('401 fala de token', /Token inválido/.test(r.porque));
    return cli(404).conferir();
  }).then(function(r){
    vale('404 fala de subdomínio', /subdomínio/.test(r.porque));
    vale('e mostra o endereço montado', /magiway\.kommo\.com/.test(r.porque), r.porque);
    return cli(402).conferir();
  }).then(function(r){
    vale('402 fala de assinatura vencida', /assinatura/.test(r.porque));
  });
});

teste('7 · Paginação', function(){
  var rel=relogio(), paginas=0;
  var c=K.criar({ subdominio:'magiway', token:'t',
    agora:rel.agora, dormir:rel.dormir,
    fetch:function(url){
      paginas++;
      var p=+(/page=(\d+)/.exec(url)||[])[1]||1;
      var itens=[]; for(var i=0;i<250;i++) itens.push({ id:(p-1)*250+i });
      return resp(200, { _embedded:{ leads:itens },
        _links: p<3? { next:{href:'x'} } : {} });
    }});
  return c.leads({}, {maxPaginas:10}).then(function(l){
    vale('juntou as 3 páginas', l.length===750, l.length);
    vale('fez 3 requisições', paginas===3, paginas);
    vale('não marcou truncado', l._truncou===false);
    vale('as páginas vieram em série, não em paralelo',
         rel.valor()>=333, rel.valor()+' ms');
  });
});

teste('8 · Paginação para no limite e avisa', function(){
  var rel=relogio(), avisos=[];
  var c=K.criar({ subdominio:'magiway', token:'t',
    agora:rel.agora, dormir:rel.dormir, log:function(m){ avisos.push(m); },
    fetch:function(){
      var itens=[]; for(var i=0;i<250;i++) itens.push({id:i});
      return resp(200,{ _embedded:{leads:itens}, _links:{next:{href:'x'}} });
    }});
  return c.leads({}, {maxPaginas:2}).then(function(l){
    vale('parou em 2 páginas', l.length===500, l.length);
    vale('marcou que truncou', l._truncou===true);
    vale('e avisou no log', avisos.some(function(a){ return /parei em 2/.test(a); }),
         avisos.join(' | '));
  });
});

teste('9 · conferir() casa os usuários com equipe.js', function(){
  var rel=relogio();
  var c=K.criar({ subdominio:'magiway', token:'t',
    agora:rel.agora, dormir:rel.dormir,
    fetch:function(url){
      if(/\/account/.test(url)) return resp(200,{ id:9, name:'Magiway', subdomain:'magiway' });
      return resp(200,{ _embedded:{ users:[
        { id:1, name:'Luciano Lira', email:'luciano_lira19@hotmail.com' },
        { id:2, name:'Janes', email:'janecossta28@gmail.com' },
        { id:3, name:'Novato', email:'novato@magiway.com' }
      ]}, _links:{} });
    }});
  return c.conferir().then(function(r){
    vale('conectou', r.ok===true, r.porque);
    vale('contou os usuários', r.usuarios===3, r.usuarios);
    vale('achou quem está no Kommo e não em equipe.js',
         r.naoCadastrados.length===1 && /Novato/.test(r.naoCadastrados[0]),
         r.naoCadastrados.join(','));
    vale('achou quem está em equipe.js e não no Kommo',
         r.semContaNoKommo.length===2, r.semContaNoKommo.join(','));
    vale('e diz o que fazer com cada caso',
         /Acrescente lá/.test(r.porque) && /sem dado/.test(r.porque));
    console.log('       '+r.porque);
  });
});

teste('10 · descobrirTiposDeNota não adivinha', function(){
  var rel=relogio();
  var c=K.criar({ subdominio:'magiway', token:'t',
    agora:rel.agora, dormir:rel.dormir,
    fetch:function(){ return resp(200,{ _embedded:{ notes:[
      { note_type:'common', params:{ text:'oi, quanto fica?' } },
      { note_type:'common', params:{ text:'bom dia' } },
      { note_type:'lead_status_changed', params:{} },
      { note_type:'chat_message', params:{ message:'tem cadeirinha?' } }
    ]}, _links:{} }); }});
  return c.descobrirTiposDeNota().then(function(r){
    vale('lista os tipos achados', r.tipos.length===3, r.tipos.length);
    vale('ordena por volume', r.tipos[0].tipo==='common' && r.tipos[0].n===2);
    vale('traz exemplo de texto', /quanto fica/.test(r.tipos[0].exemplo));
    vale('diz que não cravou nome nenhum', /Não cravei nome nenhum/.test(r.porque));
    console.log('       '+r.tipos.map(function(t){ return t.tipo+'('+t.n+')'; }).join(' · '));
  });
});

teste('11 · Tradução para o formato dos módulos', function(){
  var evs=K.paraEventos([
    { type:'outgoing_chat_message', created_by:1, created_at:1760000000, entity_id:50 },
    { type:'incoming_chat_message', created_by:0, created_at:1760000100, entity_id:50 },
    { type:'lead_status_changed',   created_by:1, created_at:1760000200, entity_id:51 },
    { type:'coisa_desconhecida',    created_by:1, created_at:1760000300, entity_id:52 },
    { type:'outgoing_chat_message', created_by:1, created_at:0, entity_id:53 }
  ]);
  vale('descarta evento sem data', evs.length===4, evs.length);
  vale('saída do vendedor vira "enviou"', evs[0].tipo==='enviou');
  vale('entrada do cliente vira "recebeu"', evs[1].tipo==='recebeu');
  vale('mudança de etapa vira "moveu"', evs[2].tipo==='moveu');
  vale('tipo desconhecido não quebra, vira "moveu"', evs[3].tipo==='moveu');
  vale('a data vira milissegundos', evs[0].quando===1760000000000, evs[0].quando);

  var conv=K.paraConversa(
    { id:77, name:'Ana', responsible_user_id:1, status_id:142, price:8450,
      closed_at:1760000500 },
    [ { note_type:'common', created_by:0, created_at:1760000000, params:{text:'oi'} },
      { note_type:'common', created_by:1, created_at:1760000120, params:{text:'Bom dia! Quantas pessoas?'} },
      { note_type:'lead_status_changed', created_by:1, created_at:1760000300, params:{} },
      { note_type:'common', created_by:1, created_at:1760000200, params:{text:''} } ]);
  vale('monta a conversa', conv.id==='77' && conv.cliente==='Ana');
  vale('created_by 0 é o cliente', conv.mensagens[0].de==='cliente');
  vale('created_by maior que 0 é a casa', conv.mensagens[1].de==='casa');
  vale('ordena por hora', conv.mensagens[0].quando<conv.mensagens[1].quando);
  vale('descarta nota sem texto e nota que não é mensagem',
       conv.mensagens.length===2, conv.mensagens.length);
  vale('conta as descartadas', conv._descartadas===2, conv._descartadas);
  vale('marca ganhou pelo status 142', conv.ganhou===true);
  vale('traz o valor e a data de fechamento',
       conv.valor===8450 && conv.fechadaEm===1760000500000);

  var l=K.paraLead({ id:1, price:5000, closed_at:1760000000, created_at:1759000000,
    custom_fields_values:[
      { field_name:'utm_campaign', values:[{value:'orlando'}] },
      { field_name:'ad_link', values:[{value:'https://fb.me/x'}] } ],
    _embedded:{ contacts:[{ email:'a@b.com', phone:'11999998888' }] } });
  vale('achata campo personalizado', l.utm_campaign==='orlando');
  vale('achata o link do anúncio', l.ad_link==='https://fb.me/x');
  vale('data vira ISO para venda-ganha.js ler', /^2025|^2026/.test(l.closed_at),
       l.closed_at);
  vale('pega e-mail e telefone do contato', l.email==='a@b.com' && l.phone==='11999998888');

  /* a ponta a ponta: Kommo → venda-ganha → pacote do Meta */
  var V=require('../site/venda-ganha.js').MGW_VENDA;
  var M=require('../site/pacote-meta.js').MGW_META;
  var v=V.ler(l);
  vale('venda-ganha lê o lead traduzido', v.valor===5000 && v.linkDoAnuncio==='https://fb.me/x',
       JSON.stringify({valor:v.valor, link:v.linkDoAnuncio}));
  var p=M.pacote([v], { agora:new Date(l.closed_at).getTime()+86400000 });
  vale('e o pacote do Meta sai pronto', p.enviaveis===1, JSON.stringify(p.bloqueios));
  return Promise.resolve();
});

teste('12 · Só este arquivo usa rede', function(){
  var fs=require('fs');
  var dir=__dirname+'/../site/';

  /* Este teste já me pegou duas vezes, e as duas valem registro:
     · a primeira versão procurava `\bfetch\(`, que NÃO casa com
       `_fetch(` — o nome que eu mesmo uso aqui. Ela dizia "nenhum
       arquivo usa rede" com o cliente HTTP na frente dela;
     · a segunda acusava o pacote-meta.js, que só tem a palavra `fetch`
       dentro de um comentário dizendo que não usa fetch.
     Daí a regra: tira comentário e string, e aí procura o mecanismo —
     por nome, não por sintaxe de chamada. */
  function semComentario(t){
    return t.replace(/\/\*[\s\S]*?\*\//g,' ')      /* bloco */
            .replace(/(^|[^:])\/\/[^\n]*/g,'$1 ')  /* linha, sem matar http:// */
            .replace(/'(?:[^'\\]|\\.)*'/g,"''")    /* strings */
            .replace(/"(?:[^"\\]|\\.)*"/g,'""');
  }
  /* mecanismos de navegador: procurados no código sem comentário nem
     string. `require` de módulo irmão é local e não entra aqui. */
  var MECANISMO=/fetch|XMLHttpRequest|EventSource|WebSocket|sendBeacon/;
  /* módulo de rede do Node: procurado no texto cru, porque o nome do
     módulo é exatamente a string que o strip apagaria */
  var MODULO=/require\(\s*['"](?:node:)?(?:http|https|net|tls|dgram|dns)['"]\s*\)/;

  function usaRede(arquivo){
    var cru=fs.readFileSync(arquivo,'utf8');
    return MECANISMO.test(semComentario(cru)) || MODULO.test(cru);
  }
  function varrer(){
    return fs.readdirSync(dir).filter(function(f){
      return /\.js$/.test(f) && usaRede(dir+f); });
  }
  var comRede=varrer();
  vale('exatamente um arquivo com rede', comRede.length===1, comRede.join(','));
  vale('e é o kommo-api.js', comRede[0]==='kommo-api.js', comRede[0]);

  /* A detecção precisa funcionar de verdade: planto dois arquivos com
     rede e confiro que ela acha os dois. Teste de guarda sem prova de
     que o guarda enxerga não guarda nada. */
  var f1=dir+'_temp_fetch.js', f2=dir+'_temp_node.js';
  fs.writeFileSync(f1, 'var x=_fetch("/a");');           /* com sublinhado */
  fs.writeFileSync(f2, "var h=require('node:https');");  /* módulo do Node */
  try{
    var dnv=varrer();
    vale('a detecção acha os dois arquivos plantados', dnv.length===3, dnv.join(','));
    vale('acha mesmo com sublinhado (_fetch)', dnv.indexOf('_temp_fetch.js')>=0);
    vale('acha require de https do Node', dnv.indexOf('_temp_node.js')>=0);
  } finally { fs.unlinkSync(f1); fs.unlinkSync(f2); }
  vale('e a varredura volta a 1 depois de remover', varrer().length===1);

  var t=fs.readFileSync(dir+'kommo-api.js','utf8');
  vale('nenhum token escrito no código',
       !/Bearer\s+[A-Za-z0-9._-]{20,}|eyJ[A-Za-z0-9._-]{20,}/.test(t));
  vale('nenhum subdomínio cravado',
       !/https:\/\/[a-z0-9-]+\.kommo\.com/.test(t.replace(/\/\*[\s\S]*?\*\//g,'')),
       'o endereço tem que ser montado a partir de config.json');
  return Promise.resolve();
});

/* ── roda em série ─────────────────────────────────────────────────── */
(function proximo(i){
  if(i>=testes.length){
    console.log('\n'+ok+' passaram, '+erro+' falharam\n');
    process.exit(erro?1:0);
    return;
  }
  console.log('\n'+testes[i][0]);
  Promise.resolve().then(testes[i][1]).then(function(){ proximo(i+1); },
    function(e){ erro++; console.log('  ERRO exceção: '+e.message); proximo(i+1); });
})(0);
