/* ═══════════════════════════════════════════════════════════════════
   CLASSIFICAR — qual é o tipo da fala, quando mais de um casa
   ───────────────────────────────────────────────────────────────────
   Achado no teste: "Boa tarde! Queria saber o preço" era classificado
   como SAUDAÇÃO. A regra de saudação casava primeiro e vencia por ordem
   de declaração. Na prática isso significa que toda mensagem educada —
   e a maioria é — perde a intenção verdadeira e recebe "olá, tudo bem?"
   em vez do orçamento.

   Três coisas resolvem, nesta ordem:

     1. NÃO PARAR NO PRIMEIRO. Colher todos os tipos que casam e
        escolher, em vez de aceitar quem chegou antes.
     2. TIPO FRACO SÓ GANHA SOZINHO. Saudação, "sim" e despedida são
        moldura da conversa, não o assunto dela. Só vencem quando a
        mensagem não tem mais nada.
     3. EXPRESSÃO MAIS LONGA GANHA. "parcela em quantas vezes" é mais
        específico que "parcela": quem casa com mais texto entendeu mais.
   ═══════════════════════════════════════════════════════════════════ */
(function(raiz){
'use strict';

var P=(typeof require!=='undefined')?require('./parecido.js').MGW_PARECIDO
      :(typeof window!=='undefined'?window.MGW_PARECIDO:null);
var N=(typeof require!=='undefined')?require('./normalizar.js').MGW_NORM
      :(typeof window!=='undefined'?window.MGW_NORM:null);

/* Moldura da conversa, não assunto. Só vencem se nada mais casar. */
var FRACOS=['saudacao','sim','nao','despedida','agradecimento','ok'];

function classificar(fala, regras, opcoes){
  opcoes=opcoes||{};
  var achados=[];
  Object.keys(regras||{}).forEach(function(tipo){
    var melhorExp=null;
    (regras[tipo]||[]).forEach(function(exp){
      var casou = opcoes.exato
        ? (String(fala||'').toLowerCase().indexOf(String(exp).toLowerCase())>=0)
        : (P?P.contemExpressao(fala,exp):false);
      if(casou){
        var tam=(N?N.normalizar(exp):String(exp)).length;
        if(!melhorExp||tam>melhorExp.tam) melhorExp={exp:exp, tam:tam};
      }
    });
    if(melhorExp) achados.push({tipo:tipo, exp:melhorExp.exp, tam:melhorExp.tam,
                                fraco:FRACOS.indexOf(tipo)>=0});
  });

  if(!achados.length) return null;

  var fortes=achados.filter(function(a){ return !a.fraco; });
  var lista=fortes.length?fortes:achados;
  lista.sort(function(a,b){ return b.tam-a.tam; });

  var escolhido=lista[0];
  return {
    tipo:escolhido.tipo,
    /* a prova: com que pedaço de texto ele casou. Sem isto o vendedor
       não tem como discordar — e classificação que não se discute vira
       erro que ninguém corrige. */
    porque:escolhido.exp,
    outros:lista.slice(1).map(function(a){ return a.tipo; }),
    ignorados:fortes.length?achados.filter(function(a){ return a.fraco; })
                              .map(function(a){ return a.tipo; }):[]
  };
}

raiz.MGW_CLASSIFICAR={ classificar:classificar, FRACOS:FRACOS };
})(typeof module!=='undefined'&&module.exports?module.exports:(typeof window!=='undefined'?window:this));
