/* ═══════════════════════════════════════════════════════════════════
   AO VIVO — o que cada pessoa está executando agora
   ───────────────────────────────────────────────────────────────────
   O item mais enfatizado no pedido: "foque no monitoramento das
   atividades de cada colaborador".

   Aqui está só a DERIVAÇÃO: eventos entram, estado sai. O transporte
   (o `/ao-vivo` por Server-Sent Events que o projeto já tem) continua
   no servidor — e é bom que fique, porque assim esta parte é testável
   sem servidor nenhum, e é ela que decide o que aparece escrito na
   tela sobre uma pessoa.

   ─── a regra que não pode ser quebrada ───────────────────────────
   **Nunca inventar presença.** Quem não tem nenhum evento no dia não
   está "parado": está **sem dado**. A diferença importa porque "parado"
   é uma acusação e "sem dado" é uma informação. Alguém de férias, de
   folga, ou atendendo por telefone aparece como parado se o código
   confundir as duas coisas — e aí o painel mente sobre uma pessoa.

   Os estados, e o que cada um exige:
     atendendo  mandou mensagem nos últimos 5 min
     lendo      abriu conversa e ainda não respondeu
     parado     TEM evento no dia, mas nenhum nos últimos 30 min
     fora       TEM evento no dia, nenhum nas últimas 4 h
     sem-dado   NENHUM evento no dia — não se afirma nada
   ═══════════════════════════════════════════════════════════════════ */
(function(raiz){
'use strict';

var MIN=60000, H=3600000;
var ATENDENDO=5*MIN, PARADO=30*MIN, FORA=4*H;

var ESTADOS={
  'atendendo':{ rotulo:'atendendo',  cor:'#22c55e', peso:5 },
  'lendo':    { rotulo:'lendo',      cor:'#3B9EFF', peso:4 },
  'parado':   { rotulo:'parado',     cor:'#f59e0b', peso:3 },
  'fora':     { rotulo:'fora',       cor:'#8892a6', peso:2 },
  'sem-dado': { rotulo:'sem dado',   cor:'#4a5265', peso:1 }
};

function ms(x){
  if(x==null) return null;
  if(typeof x==='number') return x;
  var d=new Date(x);
  return isNaN(d.getTime())?null:d.getTime();
}
function mesmoDia(a,b){
  var x=new Date(a), y=new Date(b);
  return x.getFullYear()===y.getFullYear() && x.getMonth()===y.getMonth()
      && x.getDate()===y.getDate();
}

/* evento: {quem, quando, tipo, conversa, cliente}
   tipo: 'enviou' | 'abriu' | 'recebeu' | 'moveu' | outro
   `recebeu` é mensagem DO CLIENTE: entra para medir espera, mas não
   conta como atividade da pessoa — senão cliente insistente faria
   parecer que o vendedor está trabalhando. */
function ehAtividade(e){ return e && e.tipo!=='recebeu'; }

function estadoDe(eventos, agora){
  agora=ms(agora)||Date.now();
  var meus=(eventos||[]).map(function(e){
    return { e:e, t:ms(e.quando) };
  }).filter(function(x){ return x.t!=null; })
    .sort(function(a,b){ return b.t-a.t; });

  var doDia=meus.filter(function(x){ return mesmoDia(x.t,agora); });
  var atividade=doDia.filter(function(x){ return ehAtividade(x.e); });

  if(!atividade.length){
    return { estado:'sem-dado', desde:null, ultima:null,
      texto:'Sem dado hoje. Nenhum evento no Kommo — não é o mesmo que '
           +'estar parada: pode estar de folga, no telefone ou fora do CRM.' };
  }

  var ult=atividade[0], idade=agora-ult.t;
  var estado;
  if(ult.e.tipo==='enviou' && idade<=ATENDENDO) estado='atendendo';
  else if(ult.e.tipo==='abriu' && idade<=PARADO) estado='lendo';
  else if(idade>FORA) estado='fora';
  else if(idade>PARADO) estado='parado';
  else estado='atendendo';

  return { estado:estado, desde:ult.t, ultima:ult.e, idadeMs:idade,
    texto:textoDoEstado(estado, idade, ult.e) };
}

function humano(ms_){
  var m=Math.round(ms_/MIN);
  if(m<1) return 'agora';
  if(m<60) return m+' min';
  var h=Math.floor(m/60);
  return h+' h'+((m%60)?' '+(m%60)+' min':'');
}

function textoDoEstado(estado, idade, ev){
  var onde=ev&&(ev.cliente||ev.conversa)?' — '+(ev.cliente||ev.conversa):'';
  if(estado==='atendendo') return 'Atendendo'+onde+'. Última ação há '+humano(idade)+'.';
  if(estado==='lendo')     return 'Abriu'+onde+' há '+humano(idade)+' e ainda não respondeu.';
  if(estado==='parado')    return 'Sem ação há '+humano(idade)+'. Última'+onde+'.';
  if(estado==='fora')      return 'Nada há '+humano(idade)+'. Teve atividade hoje, mas parou.';
  return 'Sem dado.';
}

/* Fila de quem está esperando resposta, por pessoa. Conta conversa em
   que a última mensagem é DO CLIENTE — é essa a definição operacional
   de "aguardando resposta", e é ela que a régua da avaliação usa. */
function fila(eventos, agora){
  agora=ms(agora)||Date.now();
  var porConversa={};
  (eventos||[]).forEach(function(e){
    var t=ms(e.quando); if(t==null||!e.conversa) return;
    var c=porConversa[e.conversa];
    if(!c || t>c.t) porConversa[e.conversa]={ t:t, e:e };
  });
  var out=[];
  Object.keys(porConversa).forEach(function(k){
    var x=porConversa[k];
    if(x.e.tipo!=='recebeu') return;       /* já foi respondida */
    out.push({ conversa:k, cliente:x.e.cliente||'', quem:x.e.quem||'',
      esperandoMs:agora-x.t, esperando:humano(agora-x.t), desde:x.t });
  });
  return out.sort(function(a,b){ return b.esperandoMs-a.esperandoMs; });
}

/* A tela inteira: uma linha por pessoa cadastrada, sempre.
   Depende de MGW_EQUIPE para a lista não ser derivada dos dados. */
function painel(eventos, agora, equipe){
  var E=equipe||raiz.MGW_EQUIPE||(typeof require!=='undefined'
        ? require('./equipe.js').MGW_EQUIPE : null);
  if(!E) throw new Error('ao-vivo precisa de equipe.js carregado antes');
  agora=ms(agora)||Date.now();
  var f=fila(eventos,agora);
  return E.linhas(eventos).map(function(l){
    var est=estadoDe(l.eventos, agora);
    var minha=f.filter(function(x){
      return E.quem(x.quem)===l.pessoa || x.quem===l.pessoa.nome; });
    return {
      pessoa:l.pessoa, estado:est.estado, cor:ESTADOS[est.estado].cor,
      texto:est.texto, ultima:est.ultima, desde:est.desde,
      aguardando:minha.length,
      maiorEspera:minha.length?minha[0].esperando:null,
      fila:minha, eventosHoje:l.eventos.length
    };
  }).sort(function(a,b){
    var d=ESTADOS[b.estado].peso-ESTADOS[a.estado].peso;
    return d||(b.aguardando-a.aguardando);
  });
}

raiz.MGW_AOVIVO={ estadoDe:estadoDe, fila:fila, painel:painel,
  ESTADOS:ESTADOS, humano:humano, ehAtividade:ehAtividade,
  ATENDENDO:ATENDENDO, PARADO:PARADO, FORA:FORA };
})(typeof module!=='undefined'&&module.exports?module.exports:(typeof window!=='undefined'?window:this));
