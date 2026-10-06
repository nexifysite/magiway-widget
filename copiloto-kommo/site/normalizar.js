/* ═══════════════════════════════════════════════════════════════════
   NORMALIZAR — deixar a fala do cliente comparável
   ───────────────────────────────────────────────────────────────────
   O motor reconhece 29% das falas. Boa parte do que escapa não é fala
   nova: é a MESMA fala escrita de outro jeito. "quanto fica", "qnt
   fica", "Quanto FICA?" e "quanto fica mesmo..." são uma pergunta só, e
   a comparação exata trata as quatro como coisas diferentes.

   Aqui o texto passa por uma peneira antes de qualquer comparação:
   caixa, acento, pontuação repetida, alongamento de vogal, emoji e as
   abreviações que todo mundo usa no WhatsApp.

   O que esta peneira NÃO faz, de propósito:
     · não corrige erro de digitação — isso é do parecido.js, porque
       exige comparar com um alvo, e aqui não há alvo;
     · não tira palavra comum ("de", "para"). Em frase curta de
       WhatsApp, "para" muda o sentido: "para quantas pessoas" não é
       "quantas pessoas". Quem tira palavra comum é o buscar, onde a
       frase é longa e o peso resolve.
   ═══════════════════════════════════════════════════════════════════ */
(function(raiz){
'use strict';

/* As abreviações que aparecem de verdade em conversa de venda. A lista
   nasceu curta de propósito: cada entrada é um palpite sobre o que o
   cliente quis dizer, e palpite errado estraga a comparação. Entram as
   que têm um só sentido possível. */
var ABREV={
  vc:'voce', vcs:'voces', vdd:'verdade', blz:'beleza', tb:'tambem', tbm:'tambem',
  qnt:'quanto', qto:'quanto', qts:'quantos', qtd:'quantidade', qdo:'quando',
  pq:'porque', pfv:'por favor', pf:'por favor', obg:'obrigado', obgd:'obrigado',
  msg:'mensagem', msgs:'mensagens', hj:'hoje', amh:'amanha', ontm:'ontem',
  td:'tudo', td_bem:'tudo bem', dps:'depois', agr:'agora', aki:'aqui',
  mt:'muito', mto:'muito', mts:'muitos', mlr:'melhor', nao:'nao', naum:'nao',
  eh:'e', neh:'ne', ta:'esta', tah:'esta', to:'estou', tou:'estou',
  vlw:'valeu', flw:'falou', bj:'beijo', abs:'abraco',
  cx:'caixa', dc:'desconto', orc:'orcamento', res:'reserva',
  dps_de:'depois de', s:'sim', n:'nao',
  r:'reais', us:'dolar', usd:'dolar', dol:'dolar',
  qlqr:'qualquer', qq:'qualquer', tbem:'tambem', dnv:'de novo',
  cmg:'comigo', ctg:'contigo', nd:'nada', add:'adicionar',
  vei:'veiculo', carr:'carro', min:'minivan', mnv:'minivan',
  pra:'para', pro:'para', ce:'voce', tava:'estava'
};

/* Ficaram DE FORA por terem mais de um sentido, e palpite errado aqui
   estraga a comparação em silêncio:
     "num"  — pode ser "não" ou "em um" ("num carro só")
     "ta"   — já entra como "está", mas "tá" sozinho é "ok"
     "mais" — muita gente escreve no lugar de "mas"
     "la"   — "lá" ou o artigo em outra língua

   E a regra que eu quebrei escrevendo esta lista, para ninguém repetir:
   SÓ ENTRA O QUE NÃO É PALAVRA DE VERDADE. Cheguei a pôr dia→diaria,
   seg→seguro e ai→ai. "dia", "seg" e "ai" são palavras; a expansão
   transformava "pro dia 10" em "para diaria 10" e corrompia a
   comparação sem erro nenhum aparecer. Antes de acrescentar uma
   entrada, pergunte: isto existe no dicionário? Se existir, fica fora. */

function tirarAcento(s){
  return s.normalize('NFD').replace(/[̀-ͯ]/g,'');
}

/* Emoji e símbolo viram espaço, não some: "ok 👍" e "ok👍" devem dar o
   mesmo resultado, e colar as palavras criaria uma terceira forma. */
function tirarEmoji(s){
  return s.replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\u{20E3}\u{2190}-\u{21FF}\u{2B00}-\u{2BFF}]/gu,' ');
}

/* "siiiim", "caaaro", "nãooo" — alongamento de vogal é ênfase, não
   palavra diferente. Três ou mais viram uma; duas ficam, porque em
   português duas letras iguais são comuns e legítimas ("carro"). */
function encurtarRepetidas(s){
  return s.replace(/([a-z])\1{2,}/g,'$1');
}

function expandirAbrev(s){
  return s.split(' ').map(function(p){
    return Object.prototype.hasOwnProperty.call(ABREV,p) ? ABREV[p] : p;
  }).join(' ');
}

function normalizar(txt){
  var s=String(txt==null?'':txt);
  s=s.toLowerCase();
  s=tirarEmoji(s);
  s=tirarAcento(s);
  s=s.replace(/https?:\/\/\S+/g,' ');          /* link não ajuda a comparar */
  s=s.replace(/[^a-z0-9\s]/g,' ');             /* pontuação vira espaço */
  s=s.replace(/\s+/g,' ').trim();
  s=encurtarRepetidas(s);
  s=expandirAbrev(s);
  s=s.replace(/\s+/g,' ').trim();
  return s;
}

/* Números viram um marcador só. Para descobrir o TIPO da fala, "somos 4"
   e "somos 6" são a mesma pergunta; o valor em si quem lê é o leitor de
   perfil, não o classificador. Guardado à parte para não atrapalhar
   quem precisa do número. */
function normalizarSemNumero(txt){
  return normalizar(txt).replace(/\b\d+\b/g,'#').replace(/\s+/g,' ').trim();
}

function palavras(txt){
  var n=normalizar(txt);
  return n?n.split(' '):[];
}

/* ── radical: juntar as formas da mesma palavra ─────────────────────
   "cadeira" e "cadeirinha" são a mesma dúvida, e estão longe demais
   para a tolerância de erro de digitação — a diferença não é dedo
   escorregando, é diminutivo. O mesmo vale para plural ("malas" /
   "mala") e para o aumentativo.

   Este cortador é de propósito TÍMIDO. Stemmer agressivo junta palavra
   que não deve: num negócio onde "caro" e "carro" convivem, errar para
   mais custa mais que errar para menos. Só caem os sufixos abaixo, e
   só quando sobra radical de pelo menos 4 letras. */
/* Diminutivo em português não é só cortar: "cadeirinha" vira "cadeir"
   se a gente só tirar o sufixo, e aí ele não encontra "cadeira", que é a
   palavra que o cliente escreveu. A regra certa devolve a vogal —
   X+inha → X+a, X+inho → X+o. Assim cadeirinha e cadeira viram a mesma
   coisa, carrinho vira carro, descontinho vira desconto. */
var DIMIN=[['zinhas',''],['zinhos',''],['zinha',''],['zinho',''],
           ['inhas','as'],['inhos','os'],['inha','a'],['inho','o']];
var PLURAL=['oes','aes','ais','eis','ns','es','s'];

function radical(p){
  p=String(p||'');
  if(p.length<4) return p;                 /* palavra curta fica inteira */
  var i,suf;
  for(i=0;i<DIMIN.length;i++){
    suf=DIMIN[i][0];
    if(p.length-suf.length>=3 && p.slice(-suf.length)===suf)
      return p.slice(0,p.length-suf.length)+DIMIN[i][1];
  }
  for(i=0;i<PLURAL.length;i++){
    suf=PLURAL[i];
    if(p.length-suf.length>=3 && p.slice(-suf.length)===suf){
      var r=p.slice(0,p.length-suf.length);
      if(suf==='ns') r+='m';               /* "homens" -> "homem" */
      if(suf==='oes'||suf==='aes') r+='ao';/* "aviroes" -> "aviao" */
      return r;
    }
  }
  return p;
}

raiz.MGW_NORM={ normalizar:normalizar, normalizarSemNumero:normalizarSemNumero,
  palavras:palavras, radical:radical, ABREV:ABREV, DIMIN:DIMIN, PLURAL:PLURAL };
})(typeof module!=='undefined'&&module.exports?module.exports:(typeof window!=='undefined'?window:this));
