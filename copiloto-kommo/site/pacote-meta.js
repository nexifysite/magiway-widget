/* ═══════════════════════════════════════════════════════════════════
   PACOTE META — monta a conversão real para devolver ao algoritmo
   ───────────────────────────────────────────────────────────────────
   O pedido: um dash exclusivo de venda ganha que alimente o Meta com a
   conversão real, para o algoritmo aprender quem fecha.

   ⚠ **NADA É ENVIADO POR ESTE ARQUIVO.** Ele monta o pacote e devolve.
   Não tem `fetch`, não tem chave, não tem endpoint. O envio fica no
   clique do vendedor, como no resto do app — e foi decisão explícita,
   não esquecimento: um envio automático de conversão errada ensina o
   algoritmo a buscar o cliente errado, e isso custa dinheiro de mídia
   por semanas antes de aparecer.

   O que o Meta exige, e que este arquivo garante:
     · e-mail e telefone **com hash SHA-256**, nunca em claro;
     · e-mail minúsculo e sem espaço ANTES do hash — "A@x.com" e
       "a@x.com " dão hashes diferentes e o Meta não casa com ninguém;
     · telefone só dígitos, com código do país;
     · `fbc` e `fbp` **sem** hash (são identificadores do próprio Meta);
     · `event_time` em segundos, e dentro de 7 dias — fora disso o Meta
       recusa o evento, e este arquivo avisa antes de você tentar;
     · `event_id` estável, para o Meta descartar duplicata se você
        clicar duas vezes.

   O SHA-256 abaixo é escrito à mão de propósito: assim funciona no
   navegador e no Node sem instalar nada, e sem a assincronia do
   SubtleCrypto (que obrigaria a tela inteira a virar async).
   ═══════════════════════════════════════════════════════════════════ */
(function(raiz){
'use strict';

/* ── SHA-256 (FIPS 180-4) ─────────────────────────────────────────── */
var K=[0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,
0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,
0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,
0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,
0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,
0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,
0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,
0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,
0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,
0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,
0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2];

function utf8(s){
  var out=[], str=unescape(encodeURIComponent(String(s)));
  for(var i=0;i<str.length;i++) out.push(str.charCodeAt(i)&0xff);
  return out;
}
function rotr(x,n){ return (x>>>n)|(x<<(32-n)); }

function sha256(texto){
  var b=utf8(texto), L=b.length*8;
  b.push(0x80);
  while((b.length%64)!==56) b.push(0);
  /* comprimento em 64 bits big-endian; mensagens aqui são curtas, então
     os 32 bits altos são sempre zero — mas ficam escritos para o padrão
     não depender disso */
  var alto=Math.floor(L/4294967296);
  b.push((alto>>>24)&255,(alto>>>16)&255,(alto>>>8)&255,alto&255);
  b.push((L>>>24)&255,(L>>>16)&255,(L>>>8)&255,L&255);

  var h=[0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,
         0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19];
  var w=new Array(64);

  for(var p=0;p<b.length;p+=64){
    for(var i=0;i<16;i++)
      w[i]=(b[p+i*4]<<24)|(b[p+i*4+1]<<16)|(b[p+i*4+2]<<8)|b[p+i*4+3];
    for(i=16;i<64;i++){
      var s0=rotr(w[i-15],7)^rotr(w[i-15],18)^(w[i-15]>>>3);
      var s1=rotr(w[i-2],17)^rotr(w[i-2],19)^(w[i-2]>>>10);
      w[i]=(w[i-16]+s0+w[i-7]+s1)|0;
    }
    var a=h[0],bb=h[1],c=h[2],d=h[3],e=h[4],f=h[5],g=h[6],hh=h[7];
    for(i=0;i<64;i++){
      var S1=rotr(e,6)^rotr(e,11)^rotr(e,25);
      var ch=(e&f)^((~e)&g);
      var t1=(hh+S1+ch+K[i]+w[i])|0;
      var S0=rotr(a,2)^rotr(a,13)^rotr(a,22);
      var maj=(a&bb)^(a&c)^(bb&c);
      var t2=(S0+maj)|0;
      hh=g; g=f; f=e; e=(d+t1)|0; d=c; c=bb; bb=a; a=(t1+t2)|0;
    }
    h[0]=(h[0]+a)|0; h[1]=(h[1]+bb)|0; h[2]=(h[2]+c)|0; h[3]=(h[3]+d)|0;
    h[4]=(h[4]+e)|0; h[5]=(h[5]+f)|0; h[6]=(h[6]+g)|0; h[7]=(h[7]+hh)|0;
  }
  return h.map(function(x){ return ('00000000'+(x>>>0).toString(16)).slice(-8); }).join('');
}

/* ── normalização antes do hash ───────────────────────────────────
   É aqui que a integração costuma falhar em silêncio: o hash sai,
   o Meta aceita o evento, e nada casa — porque "A@X.com" e "a@x.com"
   são hashes diferentes e só um deles existe na base do Meta. */
function normEmail(e){
  var s=String(e==null?'':e).trim().toLowerCase();
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(s)?s:null;
}
function normTel(t, paisPadrao){
  var d=String(t==null?'':t).replace(/\D/g,'');
  if(!d) return null;
  /* O Meta quer código do país. Número brasileiro de 10 ou 11 dígitos
     vem sem o 55 do WhatsApp; o americano, sem o 1. Sem este passo o
     telefone não casa com ninguém, e nada avisa. */
  if(d.length<=11){
    var p=String(paisPadrao||'55').replace(/\D/g,'');
    if(d.length===11 || d.length===10) d=p+d;
  }
  return d.length>=10?d:null;
}

function hashEmail(e){ var s=normEmail(e); return s?sha256(s):null; }
function hashTel(t,p){ var s=normTel(t,p); return s?sha256(s):null; }

/* ── o pacote ─────────────────────────────────────────────────────
   venda: o objeto que venda-ganha.js devolve.
   Só entra no pacote o que existe: campo vazio sai fora, porque campo
   presente e vazio reduz a qualidade do casamento no Meta. */
var LIMITE_DIAS=7;

function evento(venda, opcoes){
  opcoes=opcoes||{};
  var agora=opcoes.agora?new Date(opcoes.agora).getTime():Date.now();
  var quando=venda.fechadoEm?new Date(venda.fechadoEm).getTime():null;
  var problemas=[];

  if(!isFinite(quando)) { quando=null; problemas.push(
    'sem data de fechamento — o Meta exige event_time e vai recusar'); }
  if(!(venda.valor>0)) problemas.push(
    'sem valor — a conversão entra sem receita e o algoritmo não aprende quanto vale');

  var dias = quando? (agora-quando)/86400000 : null;
  if(dias!=null && dias>LIMITE_DIAS) problemas.push(
    'fechada há '+dias.toFixed(1)+' dias: o Meta aceita até '+LIMITE_DIAS
    +'. Este evento vai ser recusado — envie as vendas pelo menos uma vez por semana');
  if(dias!=null && dias<0) problemas.push('data de fechamento no futuro');

  var ud={};
  var em=hashEmail(venda.email);   if(em) ud.em=[em];
  var ph=hashTel(venda.telefone, opcoes.pais); if(ph) ud.ph=[ph];
  /* fbc e fbp NÃO são hasheados: são identificadores do próprio Meta */
  if(venda.fbclid) ud.fbc=String(venda.fbclid);
  if(venda.fbp)    ud.fbp=String(venda.fbp);

  if(!Object.keys(ud).length) problemas.push(
    'nenhum identificador (e-mail, telefone, fbc ou fbp): o Meta não tem '
   +'como casar esta conversão com ninguém, e ela não ensina nada');

  var cd={ currency:(venda.moeda||'BRL').toUpperCase() };
  if(venda.valor>0) cd.value=+(+venda.valor).toFixed(2);
  if(venda.categoria) cd.content_category=String(venda.categoria);
  if(venda.campanha) cd.campanha=String(venda.campanha);

  return {
    pronto: problemas.length===0,
    problemas: problemas,
    evento: {
      event_name:'Purchase',
      event_time: quando? Math.floor(quando/1000) : null,
      event_id: 'mgw-'+(venda.id!=null?venda.id:(venda.cliente||'')+'-'+quando),
      action_source: opcoes.origem||'business_messaging',
      user_data: ud,
      custom_data: cd
    }
  };
}

function pacote(vendas, opcoes){
  var evs=(vendas||[]).map(function(v){ return evento(v,opcoes); });
  var bons=evs.filter(function(e){ return e.pronto; });
  var ruins=evs.filter(function(e){ return !e.pronto; });
  return {
    corpo: { data: bons.map(function(e){ return e.evento; }) },
    enviaveis: bons.length, bloqueados: ruins.length,
    bloqueios: ruins.map(function(e,i){
      return { evento:e.evento.event_id, problemas:e.problemas }; }),
    json: JSON.stringify({ data: bons.map(function(e){ return e.evento; }) }, null, 2),
    aviso:'ESTE PACOTE NÃO FOI ENVIADO. Nada neste arquivo faz chamada de '
         +'rede: ele monta e devolve. '+bons.length+' evento(s) prontos, '
         +ruins.length+' bloqueados. Confira os bloqueios antes de enviar — '
         +'conversão errada ensina o algoritmo a buscar o cliente errado, e '
         +'isso só aparece semanas depois, na fatura.',
    porque: bons.length
      ? 'Prontos: '+bons.length+'. Cada um leva valor, moeda, data e ao menos '
       +'um identificador com hash.'
      : 'Nenhum evento pronto. Veja `bloqueios`: quase sempre é e-mail e '
       +'telefone ausentes no Kommo, e aí a correção é no cadastro, não aqui.'
  };
}

raiz.MGW_META={ sha256:sha256, hashEmail:hashEmail, hashTel:hashTel,
  normEmail:normEmail, normTel:normTel, evento:evento, pacote:pacote,
  LIMITE_DIAS:LIMITE_DIAS };
})(typeof module!=='undefined'&&module.exports?module.exports:(typeof window!=='undefined'?window:this));
