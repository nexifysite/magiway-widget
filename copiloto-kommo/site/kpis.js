/* ═══════════════════════════════════════════════════════════════════
   KPIs — por pessoa, por dia, semana, ciclo 13→12 e período livre
   ───────────────────────────────────────────────────────────────────
   Contagem crua, sem juízo. A nota de desempenho é outro arquivo
   (avaliar-dia.js); aqui é só o número, para quem quiser conferir a
   nota na mão.

   Três decisões:

   **Mediana, não média.** Média de tempo de resposta esconde o caso
   ruim: nove respostas em 2 min e uma em 5 h dão média de 31 min, que
   não descreve nem as nove nem a uma. A mediana dá 2 min e o "maior
   espera" dá 5 h — duas verdades, cada uma no seu campo. A média
   continua disponível em `media`, para comparação, mas o número grande
   na tela é a mediana.

   **Carimbo de hora obrigatório.** `calculadoEm` vem em toda resposta e
   a tela mostra. Número sem hora é número em que ninguém confia: na
   dúvida sobre se o painel está vivo, é o carimbo que responde.

   **Os quatro recortes usam a mesma função.** Dia, semana, ciclo e
   período livre viram `{ini, fim}` em ciclo.js e entram aqui iguais.
   É o que evita a tela ter quatro caminhos e três deles errarem.
   ═══════════════════════════════════════════════════════════════════ */
(function(raiz){
'use strict';

var MIN=60000, H=3600000;
var RECALCULO_MS=60*MIN;    /* o pedido: métricas a cada 1 hora */

function dep(nome, caminho){
  if(raiz[nome]) return raiz[nome];
  if(typeof require!=='undefined') return require(caminho)[nome];
  throw new Error('kpis precisa de '+caminho+' carregado antes');
}

function ms(x){
  if(x==null) return null;
  if(typeof x==='number') return x;
  var d=new Date(x); return isNaN(d.getTime())?null:d.getTime();
}
function mediana(v){
  if(!v||!v.length) return null;
  var a=v.slice().sort(function(x,y){ return x-y; });
  var m=Math.floor(a.length/2);
  return a.length%2 ? a[m] : (a[m-1]+a[m])/2;
}
function media(v){
  if(!v||!v.length) return null;
  return v.reduce(function(a,b){ return a+b; },0)/v.length;
}
function p90(v){
  if(!v||!v.length) return null;
  var a=v.slice().sort(function(x,y){ return x-y; });
  return a[Math.min(a.length-1, Math.ceil(a.length*0.9)-1)];
}

/* conversa: { id, cliente, quem, mensagens:[{de,quem,quando,texto,tipo}],
              cotacoes:[{quando,valor}], ganhou, valor, fechadaEm } */
function daCasa(m){ return m&&m.de==='casa'; }
function doCli(m){ return m&&m.de==='cliente'; }

function esperas(c){
  var m=(c.mensagens||[]), ini=null, out=[];
  for(var i=0;i<m.length;i++){
    if(doCli(m[i])){ if(ini==null) ini=ms(m[i].quando); }
    else if(daCasa(m[i]) && ini!=null){ out.push(ms(m[i].quando)-ini); ini=null; }
  }
  return out;
}
function primeiraResposta(c){
  var m=(c.mensagens||[]), ini=null;
  for(var i=0;i<m.length;i++){
    if(doCli(m[i]) && ini==null) ini=ms(m[i].quando);
    else if(daCasa(m[i]) && ini!=null) return ms(m[i].quando)-ini;
  }
  return null;
}
function semResposta(c){
  var m=(c.mensagens||[]);
  return m.length>0 && doCli(m[m.length-1]);
}
function retomadas(c){
  var m=(c.mensagens||[]), n=0;
  for(var i=1;i<m.length;i++)
    if(daCasa(m[i])&&daCasa(m[i-1])&&(ms(m[i].quando)-ms(m[i-1].quando))>6*H) n++;
  return n;
}

/* ── um bloco de KPIs para um conjunto de conversas ─────────────── */
function medir(conversas, agora){
  var cs=conversas||[];
  var pr=[], todasEsperas=[], msgsCasa=0, cot=0, ganhas=0, receita=0,
      pend=0, ret=0;

  cs.forEach(function(c){
    var p=primeiraResposta(c); if(p!=null) pr.push(p);
    esperas(c).forEach(function(e){ todasEsperas.push(e); });
    (c.mensagens||[]).forEach(function(m){ if(daCasa(m)) msgsCasa++; });
    cot += (c.cotacoes||[]).length;
    if(c.ganhou){ ganhas++; receita += (+c.valor||0); }
    if(semResposta(c)) pend++;
    ret += retomadas(c);
  });

  return {
    conversas:cs.length,
    mensagensEnviadas:msgsCasa,
    primeiraRespostaMin: pr.length? +(mediana(pr)/MIN).toFixed(1) : null,
    primeiraRespostaMedia: pr.length? +(media(pr)/MIN).toFixed(1) : null,
    primeiraRespostaP90: pr.length? +(p90(pr)/MIN).toFixed(1) : null,
    respostasMedidas: pr.length,
    maiorEsperaH: todasEsperas.length? +(Math.max.apply(null,todasEsperas)/H).toFixed(1) : null,
    cotacoesEnviadas:cot,
    conversoes:ganhas,
    taxaConversao: cs.length? +(ganhas/cs.length*100).toFixed(1) : null,
    receita:receita,
    ticketMedio: ganhas? +(receita/ganhas).toFixed(2) : null,
    retomadas:ret,
    clientesSemResposta:pend,
    calculadoEm: ms(agora)||Date.now()
  };
}

/* ── por pessoa, no recorte escolhido ───────────────────────────────
   A lista de pessoas é a FIXA (equipe.js): quem não teve conversa
   aparece com tudo em zero e `semDado:true`. Some a linha e some o
   motivo de olhar para ela. */
function porPessoa(conversas, recorte, agora, deps){
  deps=deps||{};
  var E=deps.equipe||dep('MGW_EQUIPE','./equipe.js');
  var C=deps.ciclo||dep('MGW_CICLO_K','./ciclo.js');
  agora=ms(agora)||Date.now();

  var noRecorte=(conversas||[]).filter(function(c){
    if(!recorte) return true;
    var q=c.fechadaEm||primeiraMensagem(c);
    return C.dentro(q, recorte);
  });

  var porId={};
  E.EQUIPE.forEach(function(p){ porId[p.id]=[]; });
  var fora={};
  noRecorte.forEach(function(c){
    var p=E.quem(c.quem);
    if(p) porId[p.id].push(c);
    else { var k=E.norm(c.quem)||'(sem identificação)';
           (fora[k]=fora[k]||[]).push(c); }
  });

  var linhas=E.EQUIPE.map(function(p){
    var m=medir(porId[p.id], agora);
    m.pessoa=p; m.semDado=porId[p.id].length===0;
    return m;
  });
  Object.keys(fora).sort().forEach(function(k){
    var m=medir(fora[k], agora);
    m.pessoa={ id:'?'+k, nome:k, iniciais:'??', cargo:'não cadastrado',
               cor:'#8892a6', naoCadastrado:true };
    m.semDado=false;
    linhas.push(m);
  });

  return {
    recorte:recorte||null,
    periodo:recorte?recorte.periodo:'tudo',
    linhas:linhas,
    casa:medir(noRecorte, agora),
    calculadoEm:agora,
    aviso: linhas.some(function(l){ return l.semDado; })
      ? linhas.filter(function(l){ return l.semDado; })
          .map(function(l){ return l.pessoa.nome; }).join(', ')
        +' sem nenhuma conversa neste recorte. Linha mantida de propósito: '
        +'ausência é informação.'
      : null
  };
}
function primeiraMensagem(c){
  var m=(c.mensagens||[]); return m.length? m[0].quando : null;
}

/* ── distribuição por hora do dia ──────────────────────────────────
   "As métricas a cada 1 hora" tem duas leituras e as duas são úteis:
   recalcular de hora em hora (abaixo, `precisaRecalcular`) e ver o dia
   quebrado por hora — que é o que mostra se às 14 h ninguém responde. */
function porHora(conversas, recorte, deps){
  deps=deps||{};
  var C=deps.ciclo||dep('MGW_CICLO_K','./ciclo.js');
  var faixas=[];
  for(var h=0;h<24;h++) faixas.push({ hora:h, mensagens:0, respostas:[], recebidas:0 });

  (conversas||[]).forEach(function(c){
    (c.mensagens||[]).forEach(function(m){
      var t=ms(m.quando); if(t==null) return;
      if(recorte && !C.dentro(t,recorte)) return;
      var h=new Date(t).getHours();
      if(daCasa(m)) faixas[h].mensagens++; else faixas[h].recebidas++;
    });
    var m2=(c.mensagens||[]), ini=null;
    for(var i=0;i<m2.length;i++){
      if(doCli(m2[i])){ if(ini==null) ini=ms(m2[i].quando); }
      else if(daCasa(m2[i])&&ini!=null){
        var t2=ms(m2[i].quando);
        if(!recorte || C.dentro(t2,recorte))
          faixas[new Date(ini).getHours()].respostas.push(t2-ini);
        ini=null;
      }
    }
  });

  return faixas.map(function(f){
    return { hora:f.hora, rotulo:String(f.hora).padStart(2,'0')+'h',
      mensagens:f.mensagens, recebidas:f.recebidas,
      respostaMin: f.respostas.length? +(mediana(f.respostas)/MIN).toFixed(1) : null,
      amostra:f.respostas.length,
      /* uma hora com 1 ou 2 respostas não descreve nada: a tela mostra
         o número em cinza, e isto é o sinalizador */
      confiavel:f.respostas.length>=5 };
  });
}

/* ── cadência de recálculo ─────────────────────────────────────────
   Não agenda nada: responde se já passou a hora. Quem chama decide
   se usa setInterval, SSE ou recálculo na abertura. */
function precisaRecalcular(ultimoCalculo, agora, intervaloMs){
  var u=ms(ultimoCalculo), a=ms(agora)||Date.now();
  if(u==null) return true;
  return (a-u)>=(intervaloMs||RECALCULO_MS);
}
function idadeDoCalculo(ultimoCalculo, agora){
  var u=ms(ultimoCalculo), a=ms(agora)||Date.now();
  if(u==null) return 'nunca calculado';
  var m=Math.round((a-u)/MIN);
  if(m<1) return 'agora';
  if(m<60) return 'há '+m+' min';
  var h=Math.floor(m/60);
  return 'há '+h+' h'+((m%60)?' '+(m%60)+' min':'');
}

raiz.MGW_KPIS={ medir:medir, porPessoa:porPessoa, porHora:porHora,
  precisaRecalcular:precisaRecalcular, idadeDoCalculo:idadeDoCalculo,
  mediana:mediana, media:media, p90:p90, RECALCULO_MS:RECALCULO_MS };
})(typeof module!=='undefined'&&module.exports?module.exports:(typeof window!=='undefined'?window:this));
