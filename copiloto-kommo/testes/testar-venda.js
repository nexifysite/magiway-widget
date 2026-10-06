/* Testa venda ganha, pacote do Meta, reservas por ciclo e banco de mídia.
   Rode: node testes/testar-venda.js                                   */
var V=require('../site/venda-ganha.js').MGW_VENDA;
var M=require('../site/pacote-meta.js').MGW_META;
var R=require('../site/reservas.js').MGW_RESERVAS;
var MD=require('../site/midia.js').MGW_MIDIA;
var C=require('../site/ciclo.js').MGW_CICLO_K;
var crypto=require('crypto');

var ok=0, erro=0;
function vale(n,c,x){ if(c){ok++;console.log('  ok   '+n);} else {erro++;console.log('  ERRO '+n+(x?'  → '+x:''));} }

console.log('\n1 · Venda ganha — lê o lead do Kommo');
(function(){
  var lead={ id:4821, name:'Ana Paula', price:'8450',
    created_at:'2026-09-20T13:00:00Z', closed_at:'2026-09-28T16:00:00Z',
    responsible_user:{ name:'Luciano Lira' },
    custom_fields_values:[
      { field_name:'utm_campaign', values:[{value:'orlando-dez'}] },
      { field_name:'ad_link', values:[{value:'https://fb.me/abc123'}] },
      { field_name:'email', values:[{value:'ANA@Exemplo.COM '}] },
      { field_name:'telefone', values:[{value:'(11) 98888-7777'}] }
    ]};
  var v=V.ler(lead);
  vale('acha o valor', v.valor===8450, v.valor);
  vale('acha o vendedor dentro do objeto', v.vendedor==='Luciano Lira', v.vendedor);
  vale('acha campo personalizado por nome', v.utmCampaign==='orlando-dez', v.utmCampaign);
  vale('acha o link do anúncio', v.linkDoAnuncio==='https://fb.me/abc123');
  vale('calcula dias até fechar, com fração', v.diasAteFechar===8.1, v.diasAteFechar);
  vale('lista o que faltou', v.faltando.indexOf('fbclid')>=0);
  vale('separa o essencial que faltou', v.faltandoEssencial.indexOf('origem')>=0,
       v.faltandoEssencial.join(','));
})();

console.log('\n2 · O entregável: o que o Kommo não está dando');
(function(){
  var leads=[];
  for(var i=0;i<10;i++) leads.push({ id:i, price:1000+i,
    created_at:'2026-09-01', closed_at:'2026-09-20',
    custom_fields_values:[
      { field_name:'utm_campaign', values:[{value:'c'+(i%2)}] },
      /* o link do anúncio só vem na metade */
      i%2===0 ? { field_name:'ad_link', values:[{value:'https://fb.me/'+i}] }
              : { field_name:'x', values:[{value:'y'}] }
    ]});
  var f=V.oQueFalta(leads);
  vale('conta as vendas', f.total===10);
  var link=f.campos.find(function(c){ return c.campo==='linkDoAnuncio'; });
  vale('aponta o link do anúncio como irregular', link && link.vazios===5, link&&link.vazios);
  vale('e chama de preenchimento irregular, não configuração',
       /irregular/.test(link.diagnostico));
  var email=f.campos.find(function(c){ return c.campo==='email'; });
  vale('campo vazio em todas é marcado como nome errado',
       /nome de campo errado/.test(email.diagnostico));
  vale('essenciais vêm primeiro', f.campos[0].essencial===true, f.campos[0].campo);
  vale('o texto fala em conferir o nome antes de pedir ao suporte',
       /antes de pedir/.test(f.porque));
  console.log('       '+f.porque);

  var vazio=V.oQueFalta([]);
  vale('sem venda nenhuma não inventa diagnóstico', vazio.total===0 && !vazio.campos.length);
})();

console.log('\n3 · Ranking de campanha pelo link do anúncio');
(function(){
  var leads=[];
  /* campanha A: 6 vendas boas. campanha B: 2 vendas de valor alto. */
  for(var i=0;i<6;i++) leads.push({ id:'a'+i, price:5000, closed_at:'2026-09-20',
    custom_fields_values:[{field_name:'ad_link',values:[{value:'https://fb.me/A'}]},
                          {field_name:'criativo',values:[{value:'video1'}]}]});
  for(var j=0;j<2;j++) leads.push({ id:'b'+j, price:20000, closed_at:'2026-09-20',
    custom_fields_values:[{field_name:'ad_link',values:[{value:'https://fb.me/B'}]}]});
  var r=V.porCampanha(leads);
  vale('agrupa pelos dois links', r.length===2, r.length);
  vale('ordena por receita', r[0].receita>=r[1].receita);
  var a=r.find(function(x){ return /\/A$/.test(x.chave); });
  var b=r.find(function(x){ return /\/B$/.test(x.chave); });
  vale('campanha A é confiável (6 vendas)', a.confiavel===true);
  vale('campanha B não é confiável (2 vendas)', b.confiavel===false,
       b.vendas+' vendas');
  vale('traz o criativo', a.criativos[0]==='video1', a.criativos.join(','));
  console.log('       A: '+a.vendas+' vendas, R$ '+a.receita+' | B: '
    +b.vendas+' vendas, R$ '+b.receita+' (não confiável)');
})();

console.log('\n4 · Pacote do Meta — e a trava do envio');
(function(){
  vale('SHA-256 bate com o do Node',
       M.sha256('magiway')===crypto.createHash('sha256').update('magiway').digest('hex'));
  vale('e-mail é minúsculo antes do hash',
       M.hashEmail('ANA@Exemplo.COM ')===M.hashEmail('ana@exemplo.com'));
  vale('e-mail inválido não vira hash', M.hashEmail('nao-e-email')===null);
  vale('telefone recebe o código do país', M.normTel('(11) 98888-7777')==='5511988887777');
  vale('telefone que já tem código não ganha outro',
       M.normTel('+55 11 98888-7777')==='5511988887777');

  var agora=new Date('2026-10-06T12:00:00Z').getTime();
  var venda={ id:1, valor:8450, moeda:'BRL', email:'ana@exemplo.com',
    telefone:'11988887777', fechadoEm:'2026-10-03T10:00:00Z', categoria:'Minivan 7L' };
  var e=M.evento(venda, {agora:agora});
  vale('evento pronto', e.pronto===true, JSON.stringify(e.problemas));
  vale('event_time em segundos', e.evento.event_time===Math.floor(new Date('2026-10-03T10:00:00Z').getTime()/1000));
  vale('e-mail vai com hash, nunca em claro',
       e.evento.user_data.em[0].length===64 && !/ana@/.test(JSON.stringify(e.evento)));
  vale('telefone vai com hash', e.evento.user_data.ph[0].length===64);
  vale('valor e moeda no custom_data',
       e.evento.custom_data.value===8450 && e.evento.custom_data.currency==='BRL');
  vale('event_id estável para o Meta descartar duplicata',
       e.evento.event_id===M.evento(venda,{agora:agora}).evento.event_id);

  /* fbc e fbp NÃO podem ser hasheados */
  var e2=M.evento(Object.assign({},venda,{fbclid:'fb.1.123.abc'}),{agora:agora});
  vale('fbc vai sem hash', e2.evento.user_data.fbc==='fb.1.123.abc');

  var velha=M.evento(Object.assign({},venda,{fechadoEm:'2026-09-20T10:00:00Z'}),{agora:agora});
  vale('venda de 16 dias é bloqueada', velha.pronto===false);
  vale('e o aviso diz o limite de 7 dias', /7/.test(velha.problemas.join(' ')),
       velha.problemas.join(' | '));

  var semId=M.evento({ id:2, valor:100, fechadoEm:'2026-10-05T10:00:00Z' },{agora:agora});
  vale('sem identificador nenhum é bloqueada', semId.pronto===false);
  vale('e explica que não ensina nada', /não ensina nada/.test(semId.problemas.join(' ')));

  var p=M.pacote([venda, Object.assign({},venda,{id:9, email:null, telefone:null})],{agora:agora});
  vale('o pacote separa prontos de bloqueados', p.enviaveis===1 && p.bloqueados===1);
  vale('o corpo só leva os prontos', p.corpo.data.length===1);
  vale('o aviso diz em maiúscula que não foi enviado',
       /NÃO FOI ENVIADO/.test(p.aviso));
  vale('nenhum fetch no arquivo',
       !/fetch\s*\(|XMLHttpRequest/.test(require('fs')
         .readFileSync(__dirname+'/../site/pacote-meta.js','utf8')));
})();

console.log('\n5 · Reservas — e a trava contra divergir do app de vendas');
(function(){
  /* Esta bateria existe porque a primeira versão lia "$1,234.56" como
     1,23 — faturamento mil vezes menor, sem erro nenhum aparecer. */
  vale('lê 1.234,56 (padrão brasileiro)', R.dinheiro('R$ 1.234,56')===1234.56, R.dinheiro('R$ 1.234,56'));
  vale('lê 1,234.56 (padrão americano)', R.dinheiro('$1,234.56')===1234.56, R.dinheiro('$1,234.56'));
  vale('lê 1.234.567,89', R.dinheiro('1.234.567,89')===1234567.89, R.dinheiro('1.234.567,89'));
  vale('lê 1,234,567.89', R.dinheiro('1,234,567.89')===1234567.89, R.dinheiro('1,234,567.89'));
  vale('separador só, com 3 dígitos, é milhar', R.dinheiro('1.234')===1234, R.dinheiro('1.234'));
  vale('e com 2 dígitos é decimal', R.dinheiro('8,50')===8.5, R.dinheiro('8,50'));
  vale('e com 1 dígito é decimal', R.dinheiro('1.5')===1.5, R.dinheiro('1.5'));
  vale('lê número puro', R.dinheiro(99.5)===99.5);
  vale('lê negativo', R.dinheiro('-1.234,56')===-1234.56, R.dinheiro('-1.234,56'));
  vale('lixo vira zero, não NaN', R.dinheiro('abc')===0);
  vale('vazio vira zero', R.dinheiro('')===0 && R.dinheiro(null)===0);
  vale('lê dd/mm/aaaa como dia/mês', C.fmtBR(R.data('05/08/2026'))==='05/08/2026',
       C.fmtBR(R.data('05/08/2026')));

  var linhas=[
    { Cliente:'Ana',   Vendedor:'Luciano', Valor:'5.000,00', 'Data Fechamento':'20/09/2026',
      Retirada:'10/12/2026', Devolucao:'20/12/2026', Custo:'3.000,00' },
    /* pagamento fragmentado: mesma reserva, duas linhas */
    { Cliente:'Bruno', Vendedor:'Dickson', Valor:'2.000,00', 'Data Fechamento':'21/09/2026',
      Retirada:'05/01/2027', Devolucao:'15/01/2027' },
    { Cliente:'Bruno', Vendedor:'Dickson', Valor:'1.500,00', 'Data Fechamento':'25/09/2026',
      Retirada:'05/01/2027', Devolucao:'15/01/2027' },
    /* arquivada: saiu do ciclo */
    { Cliente:'Carla', Vendedor:'Janes',   Valor:'9.000,00', 'Data Fechamento':'22/09/2026',
      Retirada:'01/02/2027', Devolucao:'10/02/2027', _arquivada:true },
    /* de outro ciclo */
    { Cliente:'Davi',  Vendedor:'Luciano', Valor:'4.000,00', 'Data Fechamento':'05/09/2026',
      Retirada:'01/03/2027', Devolucao:'10/03/2027' }
  ];
  var set=C.ciclo('2026_09');   /* 13/09 a 12/10 */
  var d=R.doCiclo(linhas, set, { agora:new Date(2026,9,6).getTime() });
  vale('junta o pagamento fragmentado numa reserva', d.n===2, d.n+' reservas');
  vale('e soma os valores', d.faturamento===8500, d.faturamento);
  vale('marca quantas foram fragmentadas', d.fragmentadas===1);
  vale('não conta a arquivada', !d.reservas.some(function(r){ return r.cliente==='Carla'; }));
  vale('não conta a de outro ciclo (05/09 é agosto)',
       !d.reservas.some(function(r){ return r.cliente==='Davi'; }));
  vale('a data de fechamento da fragmentada é a do primeiro pagamento',
       C.fmtBR(d.reservas.find(function(r){return r.cliente==='Bruno';}).dataFech)==='21/09/2026');
  vale('conta duplicatas removidas', d.duplicatasRemovidas===1);
  vale('ticket médio', d.ticket===4250, d.ticket);
  vale('agrupa por vendedor', d.porVendedor.length===2, d.porVendedor.length);

  /* a aba FECHAMENTOS vale só no ciclo de hoje */
  var semData=[{ Cliente:'Eva', Valor:'1.000,00', Retirada:'01/04/2027',
    Devolucao:'10/04/2027', _src:'fech' }];
  var hoje=R.doCiclo(semData, null, { agora:new Date(2026,9,6).getTime() });
  vale('linha da aba FECHAMENTOS entra no ciclo de hoje mesmo sem data', hoje.n===1);
  vale('e o aviso explica por quê', /já é a declaração/.test(hoje.aviso||''), hoje.aviso);
  var passado=R.doCiclo(semData, C.ciclo('2026_07'), { agora:new Date(2026,9,6).getTime() });
  vale('mas NÃO entra num ciclo passado', passado.n===0);

  var bate=R.conferir(linhas, set, { n:2, faturamento:8500 },
    { agora:new Date(2026,9,6).getTime() });
  vale('conferir aprova quando bate', bate.bate===true);
  var nao=R.conferir(linhas, set, { n:3, faturamento:17500 },
    { agora:new Date(2026,9,6).getTime() });
  vale('conferir reprova quando não bate', nao.bate===false);
  vale('e diz para não publicar', /Não publique/.test(nao.porque));
  vale('e lista onde olhar, em ordem', /fragmentado/.test(nao.porque)
    && /fronteira do ciclo/.test(nao.porque));
  console.log('       '+nao.porque);
})();

console.log('\n6 · Banco de mídia — nada sai sozinho');
(function(){
  var itens=[
    { id:'1', titulo:'Minivan 7 lugares por fora', arquivo:'minivan.jpg',
      etiquetas:['minivan','7 lugares','foto'], tamanhoBytes:2*1048576, usos:5 },
    { id:'2', titulo:'Cadeirinha infantil instalada', arquivo:'cadeirinha.jpg',
      etiquetas:['cadeirinha','criança','segurança'], tamanhoBytes:1048576, usos:12 },
    { id:'3', titulo:'Áudio de boas-vindas', arquivo:'bemvindo.ogg',
      etiquetas:['boas-vindas','áudio'], tamanhoBytes:500000, usos:30 },
    { id:'4', titulo:'Tour pela van', arquivo:'tour.mp4',
      etiquetas:['van','vídeo'], tamanhoBytes:40*1048576 },      /* grande demais */
    { id:'5', titulo:'', arquivo:'sem-nome.jpg', etiquetas:['x'] }, /* sem título */
    { id:'6', titulo:'Sem etiqueta', arquivo:'a.jpg', etiquetas:[] }
  ];
  var cat=MD.catalogo(itens);
  vale('aceita os 3 válidos', cat.itens.length===3, cat.itens.length);
  vale('recusa 3', cat.recusados.length===3, cat.recusados.length);
  vale('recusa o vídeo grande com o motivo certo',
       /WhatsApp corta/.test(cat.recusados.find(function(r){ return r.item.id==='4'; }).erros.join(' ')));
  vale('recusa o sem título', cat.recusados.some(function(r){ return r.item.id==='5'; }));
  vale('recusa o sem etiqueta com o motivo certo',
       /não vai ser encontrado/.test(cat.recusados.find(function(r){ return r.item.id==='6'; }).erros.join(' ')));
  vale('detecta tipo pela extensão', MD.tipoPorExtensao('x.mp4')==='video'
    && MD.tipoPorExtensao('x.ogg')==='audio' && MD.tipoPorExtensao('x.png')==='foto');
  vale('agrupa por tipo', cat.porTipo.foto===2 && cat.porTipo.audio===1,
       JSON.stringify(cat.porTipo));
  vale('lista etiquetas por volume', cat.etiquetas.length>0);
  vale('o aviso conta os recusados', /3 item/.test(cat.aviso||''), cat.aviso);

  /* a busca que importa: o vendedor digita como fala */
  vale('acha cadeirinha pelo termo exato', MD.buscar(cat,'cadeirinha').length===1);
  vale('acha sem acento', MD.buscar(cat,'crianca').length===1,
       MD.buscar(cat,'crianca').length);
  vale('acha por etiqueta', MD.buscar(cat,'7 lugares').length>=1);
  vale('termo sem nada devolve vazio', MD.buscar(cat,'helicoptero').length===0);
  vale('busca vazia devolve tudo pelo mais usado',
       MD.buscar(cat,'')[0].id==='3', MD.buscar(cat,'')[0].id);
  vale('filtra por tipo', MD.buscar(cat,'',{tipo:'audio'}).length===1);

  var p=MD.preparar(cat.itens[1], { telefone:'5511988887777' });
  vale('preparar devolve o envio montado', p.pronto===true && p.envio.itemId==='2');
  vale('e avisa que NÃO enviou', /NÃO ENVIADO/.test(p.aviso));
  vale('sem destinatário não prepara',
       MD.preparar(cat.itens[1], {}).pronto===false);
  vale('item inválido não prepara', MD.preparar(itens[3], {telefone:'1'}).pronto===false);
  vale('nenhum fetch no arquivo',
       !/fetch\s*\(|XMLHttpRequest/.test(require('fs')
         .readFileSync(__dirname+'/../site/midia.js','utf8')));
  vale('registra uso', MD.registrarUso(cat,'2')===true && cat.itens[1].usos===13);
  vale('uso de item inexistente devolve false', MD.registrarUso(cat,'zzz')===false);
})();

console.log('\n'+ok+' passaram, '+erro+' falharam\n');
process.exit(erro?1:0);
