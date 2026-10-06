/* ═══════════════════════════════════════════════════════════════════
   AVALIAÇÃO DO DIA — nota POR PESSOA, atualizada a cada hora
   ───────────────────────────────────────────────────────────────────
   Três coisas que precisam ficar separadas na tela, senão viram o mesmo
   número com três nomes:

     · o PARECER DA CONVERSA, que a Biblioteca já faz — uma conversa
       pode ter sido tocada por duas pessoas;
     · a NOTA DA PESSOA, que é isto aqui — o dia dela, somando o que
       passou pela mão dela;
     · a MÉTRICA, que é contagem crua (kpis.js), sem juízo nenhum.

   ─── a decisão que define se a nota é justa ───────────────────────
   **Critério que não se aplica não conta.** Se ninguém perguntou preço
   para a Janes hoje, "apresentou valor antes do número" não pode pesar
   como erro — e também não pode pesar como acerto. Ele sai da conta, e
   a tela mostra quantos critérios entraram. Uma nota de 8,0 em três
   critérios não é a mesma coisa que 8,0 em dez, e a tela diz qual é.

   Sem isso, quem atende pouco tira nota alta por não ter tido chance de
   errar, e quem atende muito é punido por volume. Eu já vi esse viés
   acontecer e ele destrói a confiança no painel em uma semana.

   ─── o fechamento ────────────────────────────────────────────────
   Fecha às 23:30. Se o app estava fechado, recupera na abertura
   seguinte — os dias não ficam em branco. Dia já fechado **nunca** é
   sobrescrito: a avaliação de ontem é registro, não rascunho.
   ═══════════════════════════════════════════════════════════════════ */
(function(raiz){
'use strict';

var MIN=60000, H=3600000;
var HORA_FECHA=23, MIN_FECHA=30;

function ms(x){
  if(x==null) return null;
  if(typeof x==='number') return x;
  var d=new Date(x); return isNaN(d.getTime())?null:d.getTime();
}
function dia(x){
  var d=new Date(ms(x)||Date.now());
  return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')
        +'-'+String(d.getDate()).padStart(2,'0');
}
function mediana(v){
  if(!v.length) return null;
  var a=v.slice().sort(function(x,y){ return x-y; });
  var m=Math.floor(a.length/2);
  return a.length%2 ? a[m] : (a[m-1]+a[m])/2;
}

/* ── A régua ────────────────────────────────────────────────────────
   Cada critério recebe as conversas da pessoa no dia e devolve
   {aplicavel, ok, dado, porque}. `peso` é quanto ele vale quando se
   aplica. Os pesos somam 100 só para leitura; a nota é normalizada
   pelos que entraram.

   Uma conversa chega assim:
     { id, cliente, mensagens:[{de:'cliente'|'casa', quem, quando,
       texto, tipo}], ganhou, valor } */
var REGUA=[
  { id:'resposta10', nome:'Primeira resposta em 10 min', peso:14,
    avalia:function(cs){
      var t=[];
      cs.forEach(function(c){ var x=primeiraResposta(c); if(x!=null) t.push(x); });
      if(!t.length) return { aplicavel:false, porque:'Nenhuma conversa nova para responder.' };
      var med=mediana(t)/MIN;
      return { aplicavel:true, ok:med<=10, dado:+med.toFixed(1),
        porque:'Mediana da primeira resposta: '+med.toFixed(1)+' min em '
              +t.length+' conversa(s). Uso mediana, não média: uma espera de '
              +'3 horas no meio de nove respostas rápidas desaparece na média.' };
    }},
  { id:'maiorEspera', nome:'Maior espera do dia', peso:10,
    avalia:function(cs){
      var pior=0, onde='';
      cs.forEach(function(c){
        var e=maiorEspera(c);
        if(e.ms>pior){ pior=e.ms; onde=c.cliente||c.id; }
      });
      if(!pior) return { aplicavel:false, porque:'Nenhuma espera medida.' };
      return { aplicavel:true, ok:pior<=2*H, dado:+(pior/H).toFixed(1),
        porque:'Maior espera: '+(pior/H).toFixed(1)+' h ('+onde+').' };
    }},
  { id:'semResposta', nome:'Nenhum cliente sem resposta', peso:14,
    avalia:function(cs){
      /* `cs.length>0` não é detalhe: sem ele, quem não teve conversa
         nenhuma passava neste critério (zero clientes sem resposta é
         verdade quando não há clientes) e tirava NOTA 10 por não ter
         trabalhado. O teste pegou isso. Nenhum critério pode ser
         verdadeiro por ausência de dado. */
      if(!cs.length) return { aplicavel:false, porque:'Nenhuma conversa hoje.' };
      var abertas=cs.filter(function(c){ return ultimaEhCliente(c); });
      return { aplicavel:true, ok:abertas.length===0, dado:abertas.length,
        porque: abertas.length
          ? abertas.length+' conversa(s) com a última mensagem do cliente: '
            +abertas.map(function(c){ return c.cliente||c.id; }).slice(0,4).join(', ')+'.'
          : 'Nenhum cliente ficou sem resposta.' };
    }},
  { id:'diagnostico', nome:'Diagnóstico antes do preço', peso:12,
    avalia:function(cs){
      var com=cs.filter(temPreco);
      if(!com.length) return { aplicavel:false, porque:'Nenhum preço enviado hoje.' };
      var bons=com.filter(function(c){ return perguntouAntesDoPreco(c); });
      return { aplicavel:true, ok:bons.length===com.length, dado:bons.length+'/'+com.length,
        porque:bons.length+' de '+com.length+' cotações vieram depois de pergunta '
              +'sobre a viagem. Preço sem diagnóstico é chute com cara de proposta.' };
    }},
  { id:'valorAntes', nome:'Valor antes do número', peso:10,
    avalia:function(cs){
      var com=cs.filter(temPreco);
      if(!com.length) return { aplicavel:false, porque:'Nenhum preço enviado hoje.' };
      var bons=com.filter(function(c){ return inclusosAntesDoNumero(c); });
      return { aplicavel:true, ok:bons.length===com.length, dado:bons.length+'/'+com.length,
        porque:bons.length+' de '+com.length+' mensagens de preço citaram o que está '
              +'incluso antes do valor.' };
    }},
  { id:'objecao', nome:'Objeção sem desconto de primeira', peso:12,
    avalia:function(cs){
      var com=cs.filter(temObjecaoDePreco);
      if(!com.length) return { aplicavel:false, porque:'Nenhuma objeção de preço hoje.' };
      var bons=com.filter(function(c){ return !descontoImediato(c); });
      return { aplicavel:true, ok:bons.length===com.length, dado:bons.length+'/'+com.length,
        porque:bons.length+' de '+com.length+' objeções foram respondidas sem desconto '
              +'na primeira resposta.' };
    }},
  { id:'contratoAntes', nome:'Contrato antes do pagamento', peso:8,
    avalia:function(cs){
      var com=cs.filter(function(c){ return citou(c,/pagamento|pix|cart[aã]o|link de pag/i); });
      if(!com.length) return { aplicavel:false, porque:'Nenhuma cobrança hoje.' };
      var bons=com.filter(function(c){ return contratoAntesDoPagamento(c); });
      return { aplicavel:true, ok:bons.length===com.length, dado:bons.length+'/'+com.length,
        porque:bons.length+' de '+com.length+' cobranças vieram depois do contrato.' };
    }},
  { id:'doze', nome:'Regra das 12 h', peso:10,
    avalia:function(cs){
      if(!cs.length) return { aplicavel:false, porque:'Nenhuma conversa hoje.' };
      var paradas=cs.filter(function(c){ return paradaSemRetomada(c); });
      return { aplicavel:true, ok:paradas.length===0, dado:paradas.length,
        porque: paradas.length
          ? paradas.length+' conversa(s) passaram de 12 h sem retomada.'
          : 'Nenhuma conversa passou de 12 h sem retomada.' };
    }},
  { id:'retomadaMotivo', nome:'Retomada com motivo', peso:5,
    avalia:function(cs){
      var r=[]; cs.forEach(function(c){ retomadas(c).forEach(function(m){ r.push(m); }); });
      if(!r.length) return { aplicavel:false, porque:'Nenhuma retomada hoje.' };
      var bons=r.filter(function(m){ return !soToque(m.texto); });
      return { aplicavel:true, ok:bons.length===r.length, dado:bons.length+'/'+r.length,
        porque:bons.length+' de '+r.length+' retomadas trouxeram motivo, não só '
              +'"oi, tudo bem?".' };
    }},
  { id:'proximoPasso', nome:'Último toque com próximo passo', peso:5,
    avalia:function(cs){
      var fechadas=cs.filter(function(c){ return !ultimaEhCliente(c) && ultima(c); });
      if(!fechadas.length) return { aplicavel:false, porque:'Nenhuma conversa terminou com a casa.' };
      var bons=fechadas.filter(function(c){ return temProximoPasso(ultima(c).texto); });
      return { aplicavel:true, ok:bons.length===fechadas.length, dado:bons.length+'/'+fechadas.length,
        porque:bons.length+' de '+fechadas.length+' últimas mensagens deixaram um '
              +'próximo passo claro.' };
    }}
];

/* ── leitura das conversas ──────────────────────────────────────── */
function msgs(c){ return (c&&c.mensagens)||[]; }
function daCasa(m){ return m && m.de==='casa'; }
function doCli(m){ return m && m.de==='cliente'; }
function ultima(c){ var m=msgs(c); return m.length?m[m.length-1]:null; }
function ultimaEhCliente(c){ var u=ultima(c); return !!u && doCli(u); }
function txt(m){ return String((m&&m.texto)||''); }
function citou(c,re){ return msgs(c).some(function(m){ return daCasa(m)&&re.test(txt(m)); }); }

function primeiraResposta(c){
  var m=msgs(c), ini=null;
  for(var i=0;i<m.length;i++){
    if(doCli(m[i]) && ini==null) ini=ms(m[i].quando);
    else if(daCasa(m[i]) && ini!=null) return ms(m[i].quando)-ini;
  }
  return null;
}
function maiorEspera(c){
  var m=msgs(c), ini=null, pior=0;
  for(var i=0;i<m.length;i++){
    if(doCli(m[i])){ if(ini==null) ini=ms(m[i].quando); }
    else if(daCasa(m[i]) && ini!=null){
      var d=ms(m[i].quando)-ini; if(d>pior) pior=d; ini=null;
    }
  }
  return { ms:pior };
}
var RE_PRECO=/R\$|US\?\$|\$\s?\d|\d+\s*(d[oó]lares|reais)|di[aá]ria de/i;
function temPreco(c){ return msgs(c).some(function(m){ return daCasa(m)&&RE_PRECO.test(txt(m)); }); }
function idxPreco(c){
  var m=msgs(c);
  for(var i=0;i<m.length;i++) if(daCasa(m[i])&&RE_PRECO.test(txt(m[i]))) return i;
  return -1;
}
var RE_PERGUNTA=/\?|quantas pessoas|quando (voc[eê]|vcs?|chega)|quantos dias|que data|crian[cç]a|m[aá]las/i;
function perguntouAntesDoPreco(c){
  var k=idxPreco(c); if(k<0) return true;
  return msgs(c).slice(0,k).some(function(m){ return daCasa(m)&&RE_PERGUNTA.test(txt(m)); });
}
var RE_INCLUSO=/inclu|seguro|quilometragem|km livre|taxa|sem franquia|cobertura|j[aá] vem com/i;
function inclusosAntesDoNumero(c){
  var k=idxPreco(c); if(k<0) return true;
  var m=msgs(c);
  /* na própria mensagem do preço, o incluso tem que vir ANTES do número */
  var t=txt(m[k]), pos=t.search(RE_PRECO), inc=t.search(RE_INCLUSO);
  if(inc>=0 && (pos<0 || inc<pos)) return true;
  return m.slice(0,k).some(function(x){ return daCasa(x)&&RE_INCLUSO.test(txt(x)); });
}
var RE_OBJ=/caro|salgado|fora do meu|acima do|achei muito|t[aá] puxado|consegue melhorar|desconto/i;
function temObjecaoDePreco(c){ return msgs(c).some(function(m){ return doCli(m)&&RE_OBJ.test(txt(m)); }); }
function descontoImediato(c){
  var m=msgs(c);
  for(var i=0;i<m.length;i++){
    if(!(doCli(m[i])&&RE_OBJ.test(txt(m[i])))) continue;
    for(var j=i+1;j<m.length;j++){
      if(!daCasa(m[j])) continue;
      return /desconto|consigo fazer por|fa[cç]o por|abato|baixo para/i.test(txt(m[j]));
    }
  }
  return false;
}
function contratoAntesDoPagamento(c){
  var m=msgs(c), kC=-1, kP=-1;
  for(var i=0;i<m.length;i++){
    if(!daCasa(m[i])) continue;
    if(kC<0 && /contrato|voucher|docusign|assinar/i.test(txt(m[i]))) kC=i;
    if(kP<0 && /pagamento|pix|cart[aã]o|link de pag/i.test(txt(m[i]))) kP=i;
  }
  if(kP<0) return true;
  return kC>=0 && kC<kP;
}
function paradaSemRetomada(c){
  var m=msgs(c); if(!m.length) return false;
  var u=m[m.length-1];
  if(!doCli(u)) return false;
  var agora=ms(c._agora)||Date.now();
  return (agora-ms(u.quando))>12*H;
}
function retomadas(c){
  var m=msgs(c), out=[];
  for(var i=1;i<m.length;i++){
    if(!daCasa(m[i])||!daCasa(m[i-1])) continue;
    if((ms(m[i].quando)-ms(m[i-1].quando))>6*H) out.push(m[i]);
  }
  return out;
}
function soToque(t){
  var s=String(t||'').trim();
  return s.length<40 && !/\?/.test(s)
      && /^(oi|ol[aá]|bom dia|boa tarde|boa noite|e a[ií]|tudo bem)/i.test(s);
}
function temProximoPasso(t){
  return /\?|fico no aguardo|te mando|posso (reservar|enviar|segurar)|confirma|at[eé] (hoje|amanh[aã])|qual (dos|deles)/i
    .test(String(t||''));
}

/* ── a nota ─────────────────────────────────────────────────────── */
function avaliarPessoa(conversas, opcoes){
  opcoes=opcoes||{};
  var cs=(conversas||[]).map(function(c){
    var x=Object.assign({},c); x._agora=opcoes.agora||Date.now(); return x;
  });
  var itens=REGUA.map(function(r){
    var v;
    try{ v=r.avalia(cs)||{}; }
    catch(e){ v={ aplicavel:false, porque:'critério não pôde ser calculado' }; }
    return { id:r.id, nome:r.nome, peso:r.peso, aplicavel:!!v.aplicavel,
             ok:!!v.ok, dado:(v.dado==null?null:v.dado), porque:v.porque||'' };
  });
  var valendo=itens.filter(function(i){ return i.aplicavel; });
  var pesoTotal=valendo.reduce(function(a,i){ return a+i.peso; },0);
  var ganho=valendo.filter(function(i){ return i.ok; })
                   .reduce(function(a,i){ return a+i.peso; },0);
  var nota = pesoTotal? +( ganho/pesoTotal*10 ).toFixed(1) : null;

  return {
    nota:nota, criteriosValendo:valendo.length, criteriosTotal:itens.length,
    conversas:cs.length, itens:itens,
    parcial:!!opcoes.parcial, calculadoEm:opcoes.agora||Date.now(),
    porque: nota==null
      ? 'Sem nota: nenhum critério se aplicou hoje. Isso não é zero — é '
       +'ausência de base. Zero diria que a pessoa errou tudo; aqui ela não '
       +'teve nada avaliável.'
      : 'Nota '+nota.toFixed(1)+' em '+valendo.length+' de '+itens.length
       +' critérios ('+cs.length+' conversa(s)). Os '+(itens.length-valendo.length)
       +' que não se aplicaram ficaram fora da conta, nem a favor nem contra.'
  };
}

/* ── fechamento e histórico ─────────────────────────────────────── */
function horaDeFechar(agora){
  var d=new Date(ms(agora)||Date.now());
  return d.getHours()>HORA_FECHA
      || (d.getHours()===HORA_FECHA && d.getMinutes()>=MIN_FECHA);
}

/* `estado` é o que ficou guardado: { '2026-10-06': { '<id>': {...} } }
   Dias fechados têm `fechado:true` e não são tocados de novo. */
function atualizar(estado, conversasPorPessoa, agora){
  estado=estado||{};
  agora=ms(agora)||Date.now();
  var d=dia(agora), fechar=horaDeFechar(agora);
  var doDia=estado[d]||{};
  var mexeu=[];

  Object.keys(conversasPorPessoa||{}).forEach(function(pid){
    if(doDia[pid]&&doDia[pid].fechado) return;      /* já é registro */
    var a=avaliarPessoa(conversasPorPessoa[pid], {agora:agora, parcial:!fechar});
    a.fechado=fechar;
    doDia[pid]=a; mexeu.push(pid);
  });

  estado[d]=doDia;
  return { estado:estado, dia:d, fechado:fechar, atualizados:mexeu };
}

/* Recuperação: se o app ficou fechado, os dias entre o último fechado e
   hoje continuam abertos para sempre. Esta função diz QUAIS, para quem
   chama buscar as conversas daqueles dias e fechar.
   Ela não inventa nota para dia sem dado — devolve a lista e pronto. */
function diasEmAberto(estado, agora){
  estado=estado||{};
  agora=ms(agora)||Date.now();
  var hoje=dia(agora), out=[];
  Object.keys(estado).sort().forEach(function(d){
    if(d>=hoje) return;
    var pessoas=estado[d]||{};
    var algumAberto=Object.keys(pessoas).some(function(p){ return !pessoas[p].fechado; });
    if(algumAberto) out.push(d);
  });
  return out;
}
function fecharDia(estado, d){
  if(!estado||!estado[d]) return 0;
  var n=0;
  Object.keys(estado[d]).forEach(function(p){
    if(!estado[d][p].fechado){ estado[d][p].fechado=true;
      estado[d][p].parcial=false; n++; }
  });
  return n;
}

raiz.MGW_AVALIAR={ avaliarPessoa:avaliarPessoa, atualizar:atualizar,
  diasEmAberto:diasEmAberto, fecharDia:fecharDia, horaDeFechar:horaDeFechar,
  REGUA:REGUA, dia:dia, mediana:mediana,
  HORA_FECHA:HORA_FECHA, MIN_FECHA:MIN_FECHA };
})(typeof module!=='undefined'&&module.exports?module.exports:(typeof window!=='undefined'?window:this));
