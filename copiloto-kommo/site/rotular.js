/* ═══════════════════════════════════════════════════════════════════
   ROTULAR — transformar o que não foi reconhecido em regra
   ───────────────────────────────────────────────────────────────────
   A busca no histórico resolve HOJE: mostra o que a equipe já respondeu
   a uma pergunta parecida. Mas ela não aprende — amanhã a mesma fala
   volta a não ser reconhecida.

   Este módulo fecha o laço. Pega todas as falas de cliente que o motor
   não classificou, agrupa as que são a mesma pergunta escrita de jeitos
   diferentes, e devolve a lista ordenada por quanto cada grupo aparece.
   O vendedor rotula o grupo UMA vez — "isso é pedido de desconto" — e
   todas as variações passam a ser reconhecidas para sempre.

   Por que agrupar antes de mostrar: sem isso a lista traz 400 frases
   soltas e ninguém encara. Agrupadas, viram 30 ou 40 assuntos, e os dez
   primeiros costumam cobrir metade do volume. Dez minutos de trabalho
   derrubam um pedaço grande do 71% de uma vez.
   ═══════════════════════════════════════════════════════════════════ */
(function(raiz){
'use strict';

var N=(typeof require!=='undefined')?require('./normalizar.js').MGW_NORM
      :(typeof window!=='undefined'?window.MGW_NORM:null);
var P=(typeof require!=='undefined')?require('./parecido.js').MGW_PARECIDO
      :(typeof window!=='undefined'?window.MGW_PARECIDO:null);

/* Palavras que não dizem o assunto. Agrupar por ASSUNTO exige olhar o
   que sobra depois delas: "queria saber o preço" e "qual o preço?" só
   têm "preço" em comum, e é só isso que importa. */
var VAZIAS={de:1,da:1,do:1,a:1,o:1,e:1,que:1,em:1,um:1,uma:1,para:1,com:1,
  no:1,na:1,os:1,as:1,se:1,por:1,eu:1,voce:1,voces:1,ja:1,me:1,meu:1,minha:1,
  qual:1,quais:1,como:1,onde:1,quem:1,tem:1,ter:1,esta:1,sao:1,vai:1,vou:1,
  isso:1,isto:1,aqui:1,ai:1,queria:1,saber:1,gostaria:1,favor:1,obrigado:1,
  oi:1,ola:1,bom:1,boa:1,dia:1,tarde:1,noite:1,sim:1,nao:1,ok:1,e:1,mas:1,
  pode:1,posso:1,poderia:1,fazer:1,ser:1,estar:1,muito:1,mais:1,menos:1};

function conteudo(txt){
  var t=N?N.normalizar(txt):String(txt||'').toLowerCase();
  var out=[], vistos={};
  (t?t.split(' '):[]).forEach(function(p){
    if(!p||VAZIAS[p]||/^\d+$/.test(p)) return;
    var r=N?N.radical(p):p;
    if(r.length<3||vistos[r]) return;
    vistos[r]=1; out.push(r);
  });
  return out;
}

/* Jaccard sobre as palavras de conteúdo. É a medida certa para
   ASSUNTO: não se importa com tamanho nem com ordem, e duas frases que
   compartilham a palavra que importa ficam juntas mesmo escritas de
   formas completamente diferentes. O trigrama do parecido.js compara
   letra, e serve para achar quase-duplicata — não para agrupar tema. */
function parecencaDeAssunto(a,b){
  if(!a.length||!b.length) return 0;
  var mapa={}, i, comum=0;
  for(i=0;i<a.length;i++) mapa[a[i]]=1;
  for(i=0;i<b.length;i++) if(mapa[b[i]]) comum++;
  return comum/(a.length+b.length-comum);
}

/* Agrupamento guloso: cada fala entra no primeiro grupo parecido o
   bastante, senão abre grupo novo. Não é o agrupamento ótimo, e não
   precisa ser — o objetivo é dar uma lista legível para uma pessoa
   rotular, não publicar um artigo. O guloso roda em um passe e a ordem
   do resultado é estável, que é o que importa para quem vai conferir. */
function agrupar(falas, limiar){
  /* 0,30 e não 0,34: duas falas de 2 palavras de conteúdo que
     compartilham UMA dão exatamente 1/3 = 0,333. Com o limiar em 0,34
     "posso retirar de madrugada" e "tem atendimento de madrugada"
     ficavam em grupos separados por um centésimo. Uma palavra em comum
     entre duas frases curtas é sinal suficiente de assunto. */
  limiar=(limiar==null)?0.30:limiar;
  var grupos=[];
  (falas||[]).forEach(function(f){
    var txt=(typeof f==='string')?f:(f.texto||'');
    var cs=conteudo(txt);
    if(!cs.length) return;

    var casa=null, melhor=0;
    for(var i=0;i<grupos.length;i++){
      var s=parecencaDeAssunto(cs, grupos[i].conteudo);
      if(s>=limiar && s>melhor){ melhor=s; casa=grupos[i]; }
    }
    if(casa){
      casa.exemplos.push(txt); casa.n++;
      /* o grupo guarda a interseção: fica cada vez mais específico do
         que de fato une as falas, em vez de inchar com tudo */
      casa.conteudo=casa.conteudo.filter(function(x){ return cs.indexOf(x)>=0; });
      if(!casa.conteudo.length) casa.conteudo=cs.slice(0,2);
    }
    else grupos.push({ chave:txt, conteudo:cs, exemplos:[txt], n:1 });
  });

  /* o exemplo mais curto representa melhor: é a forma mais direta de
     dizer a mesma coisa, e é a que vira regra com menos ruído */
  grupos.forEach(function(g){
    g.exemplos.sort(function(a,b){ return a.length-b.length; });
    g.representante=g.exemplos[0];
    g.sugestaoRegra=sugerirRegra(g.exemplos);
  });
  grupos.sort(function(a,b){ return b.n-a.n; });
  return grupos;
}

/* A expressão que o grupo tem em comum vira o rascunho da regra. Pega a
   sequência de palavras de conteúdo que aparece em mais exemplos — é um
   ponto de partida para a pessoa editar, nunca uma regra pronta: regra
   escrita por máquina e não lida por ninguém é como se entra lixo no
   classificador. */
function sugerirRegra(exemplos){
  var conta={};
  exemplos.forEach(function(ex){
    var ps=(N?N.normalizar(ex):String(ex).toLowerCase()).split(' ').filter(Boolean);
    for(var tam=2;tam<=3;tam++){
      for(var i=0;i+tam<=ps.length;i++){
        var seq=ps.slice(i,i+tam).join(' ');
        conta[seq]=(conta[seq]||0)+1;
      }
    }
  });
  var melhor=null;
  Object.keys(conta).forEach(function(seq){
    var pontos=conta[seq]*seq.split(' ').length;   /* repetida E específica */
    if(!melhor||pontos>melhor.pontos) melhor={seq:seq, pontos:pontos, n:conta[seq]};
  });
  return melhor && melhor.n>=Math.max(2,Math.ceil(exemplos.length*0.4))
    ? melhor.seq : (exemplos[0]||'');
}

/* ── a lista para a tela ────────────────────────────────────────────
   Só os grupos que valem o tempo de alguém: aparecem mais de uma vez.
   Grupo de um exemplo só é cauda longa — rotular um por um custa mais
   do que a busca no histórico já resolve sozinha. */
function paraRotular(falasNaoReconhecidas, opcoes){
  opcoes=opcoes||{};
  var minimo=(opcoes.minimo==null)?2:opcoes.minimo;
  var grupos=agrupar(falasNaoReconhecidas, opcoes.limiar);
  var valem=grupos.filter(function(g){ return g.n>=minimo; });
  var total=(falasNaoReconhecidas||[]).length;
  var cobertos=valem.reduce(function(a,g){ return a+g.n; },0);
  return {
    grupos: valem.slice(0, opcoes.quantos||50),
    totalFalas: total,
    totalGrupos: grupos.length,
    /* quanto do não reconhecido estes grupos resolvem se forem todos
       rotulados — o número que diz se vale a pena sentar e fazer */
    cobertura: total? +(cobertos/total*100).toFixed(1) : 0,
    cauda: grupos.length-valem.length
  };
}

raiz.MGW_ROTULAR={ agrupar:agrupar, paraRotular:paraRotular, sugerirRegra:sugerirRegra,
  conteudo:conteudo, parecencaDeAssunto:parecencaDeAssunto, VAZIAS:VAZIAS };
})(typeof module!=='undefined'&&module.exports?module.exports:(typeof window!=='undefined'?window:this));
