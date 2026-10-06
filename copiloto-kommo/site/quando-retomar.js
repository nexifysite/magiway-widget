/* ═══════════════════════════════════════════════════════════════════
   QUANDO RETOMAR — o intervalo que o SEU histórico mostra
   ───────────────────────────────────────────────────────────────────
   A regra das 12 h é um palpite razoável e vale como padrão. Mas a
   resposta verdadeira já está no banco: dá para contar, das retomadas
   que a casa já enviou, quais tiveram resposta — por quanto tempo se
   esperou e em que hora do dia a mensagem saiu.

   É contagem, não modelo. Nenhuma chamada a nada.

   O cuidado que define se isto presta: NÃO RECOMENDAR COM POUCO DADO.
   Três retomadas num horário não dizem nada sobre aquele horário, e uma
   recomendação apoiada em três casos é pior que nenhuma — porque ela
   parece ter base. Abaixo do mínimo, a função devolve o padrão e diz
   por quê.
   ═══════════════════════════════════════════════════════════════════ */
(function(raiz){
'use strict';

var MINIMO_POR_FAIXA=12;   /* abaixo disso a faixa não opina */
var MINIMO_TOTAL=40;       /* abaixo disso nada é recomendado */

var FAIXAS=[
  {de:0,   ate:6,   nome:'menos de 6 h'},
  {de:6,   ate:12,  nome:'6 a 12 h'},
  {de:12,  ate:24,  nome:'12 a 24 h'},
  {de:24,  ate:48,  nome:'1 a 2 dias'},
  {de:48,  ate:96,  nome:'2 a 4 dias'},
  {de:96,  ate:1e9, nome:'mais de 4 dias'}
];

function faixaDe(horas){
  for(var i=0;i<FAIXAS.length;i++)
    if(horas>=FAIXAS[i].de && horas<FAIXAS[i].ate) return FAIXAS[i];
  return FAIXAS[FAIXAS.length-1];
}

/* registros: [{esperouHoras, horaDoDia, diaSemana, respondeu}]
   Um por retomada enviada. 'respondeu' é se o cliente falou depois. */
function analisar(registros, opcoes){
  opcoes=opcoes||{};
  var minFaixa=opcoes.minimoPorFaixa||MINIMO_POR_FAIXA;
  var minTotal=opcoes.minimoTotal||MINIMO_TOTAL;
  var regs=(registros||[]).filter(function(r){
    return r && isFinite(r.esperouHoras) && r.esperouHoras>=0;
  });

  if(regs.length<minTotal){
    return {
      bastaDado:false,
      total:regs.length,
      precisa:minTotal,
      recomendacao:null,
      porque:'Só '+regs.length+' retomada(s) registradas. Com menos de '+minTotal
            +' qualquer recomendação seria ruído — continua valendo a regra das 12 h.'
    };
  }

  function agrupar(chave, rotulo){
    var m={};
    regs.forEach(function(r){
      var k=chave(r); if(k==null) return;
      if(!m[k]) m[k]={k:k, n:0, resp:0};
      m[k].n++; if(r.respondeu) m[k].resp++;
    });
    return Object.keys(m).map(function(k){
      var g=m[k];
      return {chave:g.k, rotulo:rotulo(g.k), n:g.n, respostas:g.resp,
              taxa:+(g.resp/g.n*100).toFixed(1), confiavel:g.n>=minFaixa};
    }).sort(function(a,b){ return b.taxa-a.taxa; });
  }

  var porEspera=agrupar(function(r){ return faixaDe(r.esperouHoras).nome; },
                        function(k){ return k; });
  var porHora=agrupar(function(r){ return (r.horaDoDia==null)?null:Math.floor(r.horaDoDia/3)*3; },
                      function(k){ return k+'h às '+(+k+3)+'h'; });
  var porDia=agrupar(function(r){ return r.diaSemana==null?null:r.diaSemana; },
                     function(k){ return ['domingo','segunda','terça','quarta','quinta','sexta','sábado'][+k]||('dia '+k); });

  var mediaGeral=regs.filter(function(r){return r.respondeu;}).length/regs.length*100;

  function melhorDe(lista){
    var bons=lista.filter(function(x){ return x.confiavel; });
    return bons.length?bons[0]:null;
  }
  var mE=melhorDe(porEspera), mH=melhorDe(porHora), mD=melhorDe(porDia);

  /* Só vira recomendação quando a diferença é grande o bastante para
     não ser sorte — e "grande" depende de quantos casos tem.
     A primeira versão disto exigia 5 pontos acima da média, fixo. Num
     teste com dado SORTEADO, taxa de resposta constante, ela recomendou
     "esperar 2 a 4 dias: 45,5%, 10,8 pontos acima da média" com 44
     casos. Não havia padrão nenhum: eu estava lendo o ruído e a equipe
     ia mudar a rotina por causa dele.
     Dois motivos para o erro, e os dois estão corrigidos aqui:
       · 5 pontos fixos ignora o tamanho. Com 44 casos a 35%, o erro
         padrão é 7,2 pontos — 10,8 é metade de um desvio.
       · eu escolho o MELHOR de seis faixas. Quem escolhe o melhor de
         seis encontra algo "acima da média" quase sempre. Por isso
         2,5 erros-padrão, e não 2: é o preço de olhar seis.
     Com 300 casos e padrão de verdade plantado, a faixa certa passa com
     23 pontos. O número real sobrevive; o ruído não. */
  var Z=2.5;
  function valeDizer(x){
    if(!x) return false;
    var p=mediaGeral/100;
    var erro=Math.sqrt(p*(1-p)/x.n)*100;
    var exigido=Math.max(5, Z*erro);
    x.exigido=+exigido.toFixed(1);
    x.acima=+(x.taxa-mediaGeral).toFixed(1);
    return x.acima>=exigido;
  }

  return {
    bastaDado:true,
    total:regs.length,
    taxaMedia:+mediaGeral.toFixed(1),
    porEspera:porEspera, porHora:porHora, porDia:porDia,
    recomendacao:{
      espera: valeDizer(mE)?mE:null,
      hora:   valeDizer(mH)?mH:null,
      dia:    valeDizer(mD)?mD:null
    },
    porque: montarTexto(mediaGeral, valeDizer(mE)?mE:null, valeDizer(mH)?mH:null, valeDizer(mD)?mD:null)
  };
}

function montarTexto(media, e, h, d){
  var p=['De todas as retomadas enviadas, '+media.toFixed(1)+'% tiveram resposta.'];
  if(!e&&!h&&!d){
    p.push('Nenhum recorte se destacou o bastante da média para virar recomendação. '
          +'Isso também é resultado: significa que, no seu histórico, a hora e o intervalo '
          +'importam menos do que o conteúdo da mensagem. '
          +'Pode haver diferença entre as faixas na tela — ela só não é maior do que '
          +'a que o acaso produz com esse número de casos, e eu não recomendo em cima disso.');
    return p.join(' ');
  }
  if(e) p.push('Esperar '+e.rotulo+' respondeu '+e.taxa+'% ('+e.n+' casos), '
              +e.acima+' pontos acima da média — passou da margem de '
              +e.exigido+' pontos que esse número de casos exige.');
  if(h) p.push('Enviar entre '+h.rotulo+' respondeu '+h.taxa+'% ('+h.n+' casos, '
              +h.acima+' pontos acima).');
  if(d) p.push('Na '+d.rotulo+' a taxa foi '+d.taxa+'% ('+d.n+' casos, '
              +d.acima+' pontos acima).');
  p.push('São números do seu próprio histórico, não regra de manual.');
  return p.join(' ');
}

raiz.MGW_QUANDO={ analisar:analisar, FAIXAS:FAIXAS, faixaDe:faixaDe };
})(typeof module!=='undefined'&&module.exports?module.exports:(typeof window!=='undefined'?window:this));
