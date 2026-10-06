/* ═══════════════════════════════════════════════════════════════════
   PARECIDO — comparar duas falas sem exigir que sejam iguais
   ───────────────────────────────────────────────────────────────────
   Depois da peneira do normalizar.js ainda sobra o erro de digitação:
   "cadeirinnha", "minivann", "quanto custaa". Comparação exata trata
   cada um como palavra nova; a regex do motor não casa; a fala cai nos
   71% que ninguém atende.

   Duas medidas, usadas para coisas diferentes:

     SIMILAR (trigramas de Jaccard) — para comparar frases de tamanho
       PARECIDO: agrupar falas quase repetidas, achar duplicata. Ele
       penaliza diferença de comprimento, então "tem cadeirinha?" contra
       "vcs tem cadeirinnha pra bebe" dá só 0,41 — as duas são a mesma
       pergunta, mas uma tem o triplo do tamanho. Para descobrir INTENÇÃO
       use contemExpressao; para buscar no histórico use o buscar.js, que
       trata comprimento direito.

     PERTO (distância de edição limitada) — para palavra contra palavra.
       Caro demais para frase inteira, mas exato em palavra curta. É o
       que responde "cadeirinnha é cadeirinha com um dedo escorregando?".

   A combinação importa: trigrama sozinho confunde frases curtas que
   compartilham pedaços ("tem carro" e "tem caro"), e edição sozinha não
   aguenta a palavra trocada de lugar.
   ═══════════════════════════════════════════════════════════════════ */
(function(raiz){
'use strict';

var N=(typeof require!=='undefined')?require('./normalizar.js').MGW_NORM
      :(typeof window!=='undefined'?window.MGW_NORM:null);

/* ── distância de edição com teto ──────────────────────────────────
   Para no momento em que passa do limite, em vez de calcular a matriz
   inteira. Numa comparação contra centenas de alvos isso é a diferença
   entre instantâneo e travado. */
function distancia(a,b,teto){
  if(a===b) return 0;
  var la=a.length, lb=b.length;
  if(teto==null) teto=Math.max(la,lb);
  if(Math.abs(la-lb)>teto) return teto+1;
  if(!la) return lb; if(!lb) return la;
  var ant=new Array(lb+1), atu=new Array(lb+1), i, j;
  for(j=0;j<=lb;j++) ant[j]=j;
  for(i=1;i<=la;i++){
    atu[0]=i;
    var menor=atu[0];
    for(j=1;j<=lb;j++){
      var custo=(a.charCodeAt(i-1)===b.charCodeAt(j-1))?0:1;
      atu[j]=Math.min(atu[j-1]+1, ant[j]+1, ant[j-1]+custo);
      if(atu[j]<menor) menor=atu[j];
    }
    if(menor>teto) return teto+1;              /* não vai melhorar */
    var t=ant; ant=atu; atu=t;
  }
  return ant[lb];
}

/* Quantos erros tolerar depende do tamanho: numa palavra de 4 letras um
   erro já é outra palavra ("caro"/"carro"); numa de 12, dois erros
   ainda são a mesma ("estacionamento"). */
function tolerancia(n){
  if(n<=3) return 0;
  if(n<=5) return 1;
  if(n<=9) return 2;
  return 3;
}

/* ── pares que NUNCA podem ser confundidos ────────────────────────
   Estão a uma letra de distância e significam coisas opostas neste
   negócio. Sem esta trava, "achei caro" casa com a regra de "carro" e
   o cliente que reclamou de preço recebe resposta sobre modelo de
   veículo — o erro mais constrangedor que este módulo poderia gerar,
   e silencioso, porque a resposta sai bem escrita.
   Cresce quando aparecer outro par assim no histórico. */
var NUNCA=[
  ['caro','carro'],
  ['cara','carra'],
  ['taxa','taxi'],
  ['mala','mal'],
  ['dias','diaria']
];
function proibido(a,b){
  for(var i=0;i<NUNCA.length;i++){
    var p=NUNCA[i];
    if((a===p[0]&&b===p[1])||(a===p[1]&&b===p[0])) return true;
  }
  return false;
}

function perto(a,b){
  a=String(a||''); b=String(b||'');
  if(a===b) return true;
  if(proibido(a,b)) return false;
  var t=tolerancia(Math.min(a.length,b.length));
  if(!t) return false;
  return distancia(a,b,t)<=t;
}

/* ── trigramas ────────────────────────────────────────────────────── */
function trigramas(s){
  s=' '+String(s||'').replace(/\s+/g,' ').trim()+' ';
  var out=[];
  for(var i=0;i<s.length-2;i++) out.push(s.slice(i,i+3));
  return out;
}

function similar(a,b){
  var na=N?N.normalizar(a):String(a||'').toLowerCase();
  var nb=N?N.normalizar(b):String(b||'').toLowerCase();
  if(!na||!nb) return 0;
  if(na===nb) return 1;
  var ta=trigramas(na), tb=trigramas(nb);
  if(!ta.length||!tb.length) return 0;
  var mapa={}, i;
  for(i=0;i<ta.length;i++) mapa[ta[i]]=(mapa[ta[i]]||0)+1;
  var comum=0;
  for(i=0;i<tb.length;i++){ if(mapa[tb[i]]>0){ mapa[tb[i]]--; comum++; } }
  /* Jaccard sobre multiconjunto: comum ÷ (total dos dois − comum) */
  return comum/(ta.length+tb.length-comum);
}

/* ── frase contém a expressão, mesmo com dedo escorregando ──────────
   Procura a sequência de palavras do alvo dentro da fala, aceitando
   troca por palavra parecida. É o que permite a regra "quanto custa"
   casar com "entao quanto custaa isso". */
function contemExpressao(fala, expressao){
  var pf=(N?N.normalizar(fala):String(fala||'')).split(' ').filter(Boolean);
  var pe=(N?N.normalizar(expressao):String(expressao||'')).split(' ').filter(Boolean);
  if(!pe.length||pf.length<pe.length) return false;
  for(var i=0;i<=pf.length-pe.length;i++){
    var bate=true;
    for(var j=0;j<pe.length;j++){
      if(!perto(pf[i+j],pe[j])){ bate=false; break; }
    }
    if(bate) return true;
  }
  return false;
}

/* ── o melhor alvo de uma lista ─────────────────────────────────────
   Devolve também a pontuação e o alvo, nunca só o índice: quem chama
   precisa poder decidir se a semelhança foi boa o bastante, e mostrar
   ao vendedor com o que a fala se pareceu. Resposta sem a prova vira
   caixa-preta, e caixa-preta ninguém confere. */
function melhor(fala, alvos, minimo){
  minimo=(minimo==null)?0.45:minimo;
  var bom=null;
  (alvos||[]).forEach(function(alvo,i){
    var txt=(typeof alvo==='string')?alvo:(alvo.texto||alvo.t||'');
    var s=similar(fala,txt);
    if(!bom||s>bom.pontos) bom={pontos:s, i:i, alvo:alvo, texto:txt};
  });
  if(!bom||bom.pontos<minimo) return null;
  return bom;
}

raiz.MGW_PARECIDO={ similar:similar, perto:perto, distancia:distancia,
  contemExpressao:contemExpressao, melhor:melhor, trigramas:trigramas,
  tolerancia:tolerancia, NUNCA:NUNCA };
})(typeof module!=='undefined'&&module.exports?module.exports:(typeof window!=='undefined'?window:this));
