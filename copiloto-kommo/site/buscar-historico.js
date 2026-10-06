/* ═══════════════════════════════════════════════════════════════════
   BUSCAR NO HISTÓRICO — o que a equipe já respondeu a isto
   ───────────────────────────────────────────────────────────────────
   Quando o motor não reconhece a fala, hoje o campo fica vazio e a
   responsabilidade volta inteira para o vendedor. Mas a resposta quase
   sempre existe: alguém da casa já respondeu a essa mesma pergunta,
   escrita de outro jeito, em outra conversa.

   Este módulo procura nas conversas guardadas as falas de cliente mais
   parecidas e devolve o que o vendedor respondeu em seguida. Não é IA e
   não inventa frase: é busca no que a equipe já disse.

   Por que BM25 e não os trigramas do parecido.js: comprimento. O
   Jaccard penaliza a frase longa contra a curta, e pergunta de cliente
   varia muito de tamanho. O BM25 pesa palavra rara mais que palavra
   comum e normaliza o tamanho — "sunpass" vale muito, "o" não vale
   nada, e a frase de trinta palavras não é punida por ser longa.
   ═══════════════════════════════════════════════════════════════════ */
(function(raiz){
'use strict';

var N=(typeof require!=='undefined')?require('./normalizar.js').MGW_NORM
      :(typeof window!=='undefined'?window.MGW_NORM:null);
var PAR=(typeof require!=='undefined')?require('./parecido.js').MGW_PARECIDO
      :(typeof window!=='undefined'?window.MGW_PARECIDO:null);

var K1=1.5, B=0.75;   /* constantes usuais do BM25 */

/* Palavras que aparecem em quase toda frase e não distinguem nada. Não
   são removidas do texto (ver normalizar.js): aqui elas só perdem peso,
   e o próprio BM25 já faz isso sozinho pela frequência. A lista existe
   para o caso de o acervo ser pequeno, quando a estatística ainda não
   aprendeu que "de" é comum. */
var VAZIAS={de:1,da:1,do:1,a:1,o:1,e:1,que:1,em:1,um:1,uma:1,para:1,com:1,
  no:1,na:1,os:1,as:1,se:1,por:1,mais:1,eu:1,voce:1,ja:1,me:1,meu:1,minha:1,
  /* interrogativos: estão em quase toda pergunta e não dizem o assunto.
     "qual a cor do carro" casava com "qual o valor da franquia" só por
     causa do "qual". Ficam de fora "quanto" e "quantas", que no nosso
     negócio carregam sentido (preço e número de pessoas). */
  qual:1, quais:1, como:1, onde:1, quem:1, porque:1, tem:1, ter:1,
  esta:1, estao:1, ser:1, sao:1, vai:1, vou:1, isso:1, isto:1, aqui:1, ai:1};

function indexar(registros){
  /* registros: [{ pergunta, resposta, quando, vendedor, conversa }] */
  var docs=[], df={}, soma=0;
  (registros||[]).forEach(function(r,i){
    var t=N?N.normalizar(r.pergunta):String(r.pergunta||'').toLowerCase();
    var ps=t?t.split(' '):[];
    if(!ps.length) return;
    /* guarda o RADICAL: é o que faz "cadeira" encontrar "cadeirinha" */
    ps=ps.map(function(x){ return N?N.radical(x):x; });
    var tf={}, vistos={};
    ps.forEach(function(p){
      tf[p]=(tf[p]||0)+1;
      if(!vistos[p]){ vistos[p]=1; df[p]=(df[p]||0)+1; }
    });
    docs.push({i:i, reg:r, tf:tf, len:ps.length});
    soma+=ps.length;
  });
  return { docs:docs, df:df, n:docs.length, mediaLen:docs.length?soma/docs.length:0 };
}

function idf(df, n){
  /* +1 no fim mantém o idf positivo mesmo para palavra que está em todo
     documento; sem isso ela pontuaria negativo e puxaria o resultado
     para baixo em vez de só não ajudar. */
  return Math.log(1 + (n - df + 0.5)/(df + 0.5));
}

/* ── o termo da pergunta que não existe no acervo ───────────────────
   "cadeira" não casa com "cadeirinha", e as duas são a mesma dúvida. O
   BM25 compara palavra exata; aqui a palavra que não existe no índice
   é trocada pela mais parecida que existe, com desconto — é um palpite,
   e palpite vale menos que o acerto. */
function expandir(indice, termo){
  if(indice.df[termo]) return [{t:termo, peso:1}];
  var fora=[];
  for(var t in indice.df){
    if(PAR&&PAR.perto(termo,t)) fora.push({t:t, peso:0.7});
  }
  return fora.length?fora:[];
}

function buscar(indice, pergunta, quantos){
  quantos=quantos||3;
  var t=N?N.normalizar(pergunta):String(pergunta||'').toLowerCase();
  var termos=(t?t.split(' '):[]).map(function(x){ return N?N.radical(x):x; });
  if(!termos.length||!indice||!indice.n) return [];

  /* cada termo vira uma ou mais buscas, com o peso do palpite junto */
  var usados=[];
  termos.forEach(function(termo){
    expandir(indice,termo).forEach(function(e){
      usados.push({t:e.t, peso:e.peso, original:termo});
    });
  });

  var pontos=indice.docs.map(function(d){
    var s=0, conteudo=0;
    usados.forEach(function(u){
      var f=d.tf[u.t]; if(!f) return;
      var ehVazia=!!VAZIAS[u.t];
      var peso=(ehVazia?0.15:1)*u.peso;
      var df=indice.df[u.t]||1;
      var num=f*(K1+1);
      var den=f+K1*(1-B+B*(d.len/(indice.mediaLen||1)));
      s+=peso*idf(df,indice.n)*(num/den);
      if(!ehVazia) conteudo++;
    });
    return {doc:d, pontos:s, conteudo:conteudo};
  }).filter(function(x){
    /* ── a trava contra o falso positivo ──
       "qual a cor do carro" casava com a resposta sobre franquia do
       seguro, só porque as duas têm "qual", "o" e "do". Pontuação alta
       feita de palavra comum não é semelhança, é coincidência — e
       mostrar a resposta errada é pior que não mostrar nada, porque o
       vendedor pode enviar. Sem nenhuma palavra de conteúdo em comum,
       o resultado nem entra na lista. */
    return x.pontos>0 && x.conteudo>0;
  });

  pontos.sort(function(a,b){ return b.pontos-a.pontos; });

  /* A pontuação do BM25 não tem teto fixo, então sozinha ela não diz se
     o resultado presta. Dividir pelo melhor dá uma leitura relativa, e
     o corte absoluto evita devolver lixo quando NADA se parece. */
  var topo=pontos.length?pontos[0].pontos:0;
  return pontos.slice(0,quantos).map(function(x){
    return {
      pergunta: x.doc.reg.pergunta,
      resposta: x.doc.reg.resposta,
      quando:   x.doc.reg.quando,
      vendedor: x.doc.reg.vendedor,
      conversa: x.doc.reg.conversa,
      pontos:   +x.pontos.toFixed(3),
      termosEmComum: x.conteudo,
      confianca: topo>0 ? +(x.pontos/topo).toFixed(2) : 0
    };
  });
}

/* ── o que a tela deve mostrar ──────────────────────────────────────
   Devolve já decidido se vale mostrar, para a interface não ter de
   reimplementar o critério — e para o critério ser um só. */
function sugerir(indice, pergunta, opcoes){
  opcoes=opcoes||{};
  var minimo=(opcoes.minimo==null)?1.2:opcoes.minimo;
  var achados=buscar(indice, pergunta, opcoes.quantos||3);
  var bons=achados.filter(function(a){ return a.pontos>=minimo; });
  return {
    tem: bons.length>0,
    achados: bons,
    /* o aviso não é enfeite: a resposta veio de OUTRO cliente, em outro
       contexto, e pode citar data, carro ou valor que não valem aqui */
    aviso: bons.length
      ? 'Respostas que a equipe já deu a perguntas parecidas. Leia antes de enviar: foram escritas para outro cliente.'
      : null
  };
}

raiz.MGW_BUSCAR={ indexar:indexar, buscar:buscar, sugerir:sugerir, VAZIAS:VAZIAS };
})(typeof module!=='undefined'&&module.exports?module.exports:(typeof window!=='undefined'?window:this));
