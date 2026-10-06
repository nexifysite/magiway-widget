/* ═══════════════════════════════════════════════════════════════════
   CHANCE DE FECHAR — nota de lead ajustada no SEU histórico
   ───────────────────────────────────────────────────────────────────
   O que faz: olha as negociações que já terminaram (ganhas e perdidas),
   descobre quais sinais andaram junto com o ganho, e dá uma nota para
   as que ainda estão abertas. Sem chave de API, sem rede: é contagem
   e logaritmo.

   O modelo é Naive Bayes. Escolhi ele por três motivos, nesta ordem:
     1. treina com pouco dado — centenas bastam, não precisa de milhares;
     2. o peso de cada sinal é legível, então a tela pode dizer POR QUÊ
        a nota é essa, e o vendedor julga se faz sentido;
     3. cabe em 200 linhas sem dependência nenhuma.

   O preço de escolher ele: Naive Bayes supõe que os sinais são
   independentes, e os seus não são ("pediu cotação" e "informou datas"
   andam juntos). Isso faz a nota exagerar nos extremos — por isso ela
   NUNCA é apresentada como porcentagem do modelo. O que a tela mostra é
   a taxa que REALMENTE aconteceu na faixa, medida no teste.

   ─── as três travas, e por que existem ───────────────────────────
   a) NÃO TREINA COM POUCO DADO. Abaixo de 60 encerradas, ou de 15 em
      qualquer um dos dois lados, devolve `serve:false`. Um modelo com
      20 casos acerta o passado e erra o futuro, e ninguém percebe.
   b) MEDE EM DADO QUE NÃO VIU. Treina nas mais antigas, testa nas mais
      novas. Medir no mesmo dado em que treinou dá número bonito e
      mentiroso — foi exatamente o erro que eu cometi medindo o
      reconhecimento (92% virou 66% quando parei de me avaliar).
   c) RECUSA SE NÃO GANHA DA MOEDA. Se no teste a nota não separa
      melhor que o chute (AUC < 0,60), devolve `serve:false` com o
      número. Modelo que não ganha do chute é pior que não ter modelo,
      porque dá confiança.

   ─── vazamento: a armadilha que estraga este tipo de nota ────────
   Se entrar um sinal que só existe DEPOIS do fim ("contrato enviado",
   "pagamento feito"), o acerto vai a 99% e a nota não serve para nada:
   ela está lendo o resultado, não prevendo. `treinar` procura sinais
   assim e avisa em `suspeitas`. A pergunta para cada sinal é uma só:
   **isto eu sei no momento em que quero a nota?** Se a resposta é não,
   fora.
   ═══════════════════════════════════════════════════════════════════ */
(function(raiz){
'use strict';

var MIN_TOTAL=60;      /* encerradas, somando ganhas e perdidas */
var MIN_POR_LADO=15;   /* ganhas, e perdidas, cada uma */
var MIN_TESTE=20;      /* casos no teste, senão a medição é ruído */
var AUC_MINIMO=0.60;   /* abaixo disso não serve */
var SUAVIZA=1;         /* Laplace: evita log(0) num valor nunca visto */

/* ── preparar os sinais ─────────────────────────────────────────────
   Cada registro traz um objeto `sinais` com valores simples. Número
   vira faixa (terço de baixo / meio / alto), calculada no treino e
   guardada no modelo — assim o teste e o dia a dia usam a MESMA régua.
   Vazio e nulo entram como 'sem-dado': ausência de informação é
   informação, e jogar fora o registro inteiro por um campo vazio
   descarta dado bom. */
function ehNumero(v){ return typeof v==='number' && isFinite(v); }

function cortesDe(valores){
  var v=valores.slice().sort(function(a,b){ return a-b; });
  if(v.length<6) return null;
  return [ v[Math.floor(v.length/3)], v[Math.floor(v.length*2/3)] ];
}

function aprenderCortes(regs){
  var porChave={};
  regs.forEach(function(r){
    var s=r.sinais||{};
    Object.keys(s).forEach(function(k){
      if(!ehNumero(s[k])) return;
      (porChave[k]=porChave[k]||[]).push(s[k]);
    });
  });
  var cortes={};
  Object.keys(porChave).forEach(function(k){
    var c=cortesDe(porChave[k]);
    if(c && c[0]!==c[1]) cortes[k]=c;
  });
  return cortes;
}

function tokens(sinais, cortes){
  var out=[], s=sinais||{};
  Object.keys(s).forEach(function(k){
    var v=s[k], rot;
    if(v===null||v===undefined||v==='') rot='sem-dado';
    else if(typeof v==='boolean') rot=v?'sim':'nao';
    else if(ehNumero(v)){
      var c=cortes[k];
      if(!c) rot='num';
      else rot = v<=c[0]?'baixo' : (v<=c[1]?'medio':'alto');
    }
    else rot=String(v).toLowerCase().trim().slice(0,40)||'sem-dado';
    out.push(k+'='+rot);
  });
  return out;
}

/* ── treino ─────────────────────────────────────────────────────────
   registros: [{ganhou:true|false, quando:<data|ts>, sinais:{...}}]
   Só entram os ENCERRADOS. Lead aberto não tem rótulo e, se entrar
   como perdido, ensina o modelo que negociação em andamento é derrota. */
function treinar(registros, opcoes){
  opcoes=opcoes||{};
  var regs=(registros||[]).filter(function(r){
    return r && typeof r.ganhou==='boolean' && r.sinais;
  });
  var g=regs.filter(function(r){ return r.ganhou; }).length;
  var p=regs.length-g;

  if(regs.length<MIN_TOTAL || g<MIN_POR_LADO || p<MIN_POR_LADO){
    return { serve:false, total:regs.length, ganhas:g, perdidas:p,
      porque:'Precisa de pelo menos '+MIN_TOTAL+' negociações encerradas e '
            +MIN_POR_LADO+' de cada lado. Tem '+regs.length+' ('+g+' ganhas, '
            +p+' perdidas). Com menos que isso o modelo decora o passado e '
            +'erra o futuro — e erra com cara de certeza.' };
  }

  var cortes=opcoes.cortes||aprenderCortes(regs);
  var cont={}, nG=0, nP=0, valores={};
  regs.forEach(function(r){
    if(r.ganhou) nG++; else nP++;
    tokens(r.sinais,cortes).forEach(function(t){
      var k=t.split('=')[0];
      (valores[k]=valores[k]||{})[t]=1;
      var c=cont[t]=cont[t]||{g:0,p:0};
      if(r.ganhou) c.g++; else c.p++;
    });
  });

  /* peso = log da razão de verossimilhança, com Laplace pelo número de
     valores que a chave tem. Positivo puxa para ganho. */
  var pesos={};
  Object.keys(cont).forEach(function(t){
    var k=t.split('=')[0], nv=Object.keys(valores[k]).length, c=cont[t];
    var pg=(c.g+SUAVIZA)/(nG+SUAVIZA*nv);
    var pp=(c.p+SUAVIZA)/(nP+SUAVIZA*nv);
    pesos[t]={ peso:Math.log(pg/pp), vezes:c.g+c.p, ganhas:c.g, perdidas:c.p,
               taxa:(c.g+c.p)?c.g/(c.g+c.p):0 };
  });
  /* Quais pesos valem ser MOSTRADOS. Todos entram na conta — o modelo
     usa o conjunto —, mas na tela só aparece o que se afasta da média
     mais do que o acaso explicaria. Sem isto, um sinal sem relação
     nenhuma vira frase: no meu teste com dado sorteado, "vendedor=ana"
     apareceu como motivo de perda. Dizer isso de uma pessoa por conta
     de barulho é pior do que não explicar nada. Dois erros-padrão é a
     régua, e ela é frouxa de propósito: aqui o certo é mostrar menos. */
  var taxaBase=nG/(nG+nP);
  Object.keys(pesos).forEach(function(t){
    var w=pesos[t];
    var erro=Math.sqrt(taxaBase*(1-taxaBase)/Math.max(1,w.vezes));
    w.destaque=Math.abs(w.taxa-taxaBase) >= 2*erro;
    w.pontos=+((w.taxa-taxaBase)*100).toFixed(1);
  });

  return { serve:true, cortes:cortes, pesos:pesos,
    base:Math.log((nG+1)/(nP+1)), taxaBase:+(nG/(nG+nP)*100).toFixed(1),
    total:regs.length, ganhas:nG, perdidas:nP,
    suspeitas:procurarVazamento(cont, nG, nP) };
}

/* Um valor que aparece bastante e cai quase todo de um lado só é
   suspeito de vazamento. Não dá para decidir daqui se é: "cliente
   mandou os dados do contrato" separa quase perfeito E é vazamento;
   "veio por indicação" separa bem e é sinal legítimo. Então eu aponto
   e deixo a pergunta escrita — quem conhece a operação decide. */
function procurarVazamento(cont, nG, nP){
  var out=[];
  Object.keys(cont).forEach(function(t){
    var c=cont[t], n=c.g+c.p;
    if(n<10) return;
    var pureza=Math.max(c.g,c.p)/n;
    if(pureza>=0.97) out.push({ sinal:t, vezes:n, ganhas:c.g, perdidas:c.p,
      aviso:'"'+t+'" apareceu '+n+' vezes e caiu '+(pureza*100).toFixed(0)
           +'% de um lado só. Pergunta: este sinal já existe no momento em '
           +'que você quer a nota? Se ele só aparece depois de fechar, ele '
           +'não prevê nada — está lendo o resultado. Tire e meça de novo.' });
  });
  return out;
}

/* ── pontuar ────────────────────────────────────────────────────────
   Devolve a soma dos pesos (`nota`, log-odds) e a explicação: os
   sinais que mais puxaram para cima e para baixo. A explicação não é
   enfeite — é o que permite ao vendedor discordar da nota. */
function pontuar(modelo, sinais){
  if(!modelo||!modelo.serve) return null;
  var ts=tokens(sinais, modelo.cortes), soma=modelo.base, det=[];
  ts.forEach(function(t){
    var w=modelo.pesos[t];
    if(!w){ det.push({sinal:t, peso:0, nota:'nunca visto no histórico'}); return; }
    soma+=w.peso;
    det.push({sinal:t, peso:+w.peso.toFixed(3), vezes:w.vezes,
              ganhas:w.ganhas, perdidas:w.perdidas,
              pontos:w.pontos, destaque:!!w.destaque});
  });
  det.sort(function(a,b){ return Math.abs(b.peso)-Math.abs(a.peso); });
  var faixa = modelo.faixas ? faixaDaNota(modelo, soma) : null;
  /* só vai para a tela o que passou na régua do destaque */
  function mostrar(sinal){ return det.filter(function(d){
    return d.destaque && (sinal>0 ? d.peso>0 : d.peso<0); }).slice(0,4); }
  return {
    nota:+soma.toFixed(3),
    faixa:faixa,
    aFavor:mostrar(1),
    contra:mostrar(-1),
    todos:det,
    porque:textoDaNota(modelo, soma, faixa, det)
  };
}

function faixaDaNota(modelo, nota){
  var f=modelo.faixas;
  for(var i=0;i<f.length;i++) if(nota<=f[i].ate) return f[i];
  return f[f.length-1];
}

function textoDaNota(modelo, nota, faixa, det){
  var p=[];
  if(faixa) p.push('Faixa '+faixa.nome+': no teste, '+faixa.taxa+'% das '
                  +faixa.n+' negociações desta faixa fecharam (média geral da casa: '
                  +modelo.taxaBase+'%).');
  else p.push('Nota '+nota.toFixed(2)+'. Sem faixa calibrada: rode avaliar() '
             +'para saber quanto cada faixa fecha de verdade.');
  var forte=det.filter(function(d){ return d.destaque; });
  var pro=forte.filter(function(d){ return d.peso>0; }).slice(0,3);
  var con=forte.filter(function(d){ return d.peso<0; }).slice(0,3);
  function frase(d){ return d.sinal+' ('+d.ganhas+' de '+d.vezes+' fecharam, '
    +(d.pontos>0?'+':'')+d.pontos+' pontos)'; }
  if(pro.length) p.push('A favor: '+pro.map(frase).join(', ')+'.');
  if(con.length) p.push('Contra: '+con.map(frase).join(', ')+'.');
  if(!pro.length && !con.length)
    p.push('Nenhum sinal deste lead se afasta da média mais do que o acaso '
          +'explicaria, então não há motivo que eu possa citar. A nota é a '
          +'soma de empurrões pequenos — trate-a como ordem de fila, não '
          +'como diagnóstico.');
  p.push('A nota é a conta do seu histórico, não um juízo sobre o cliente — '
        +'se ela contraria o que você viu na conversa, a conversa vale mais.');
  return p.join(' ');
}

/* ── medir, antes de confiar ────────────────────────────────────────
   Treina nas mais antigas e testa nas mais novas. AUC é a chance de
   uma ganha sorteada ter nota maior que uma perdida sorteada: 0,5 é
   moeda, 1,0 é perfeito. Uso AUC e não acerto porque acerto engana
   quando um lado é maior — num funil de 30% de ganho, dizer "perde"
   sempre acerta 70% e não serve para nada. */
function auc(pontos){
  var pos=pontos.filter(function(x){ return x.ganhou; }).map(function(x){ return x.nota; });
  var neg=pontos.filter(function(x){ return !x.ganhou; }).map(function(x){ return x.nota; });
  if(!pos.length||!neg.length) return null;
  var soma=0;
  pos.forEach(function(a){ neg.forEach(function(b){
    soma += a>b?1 : (a===b?0.5:0); }); });
  return soma/(pos.length*neg.length);
}

function calibrar(pontos, quantas){
  var ord=pontos.slice().sort(function(a,b){ return a.nota-b.nota; });
  var nomes=['muito baixa','baixa','média','alta','muito alta'];
  var n=quantas||5, faixas=[], passo=Math.floor(ord.length/n);
  if(passo<2) return [];
  for(var i=0;i<n;i++){
    var ini=i*passo, fim=(i===n-1)?ord.length:(i+1)*passo;
    var fatia=ord.slice(ini,fim);
    var ganhas=fatia.filter(function(x){ return x.ganhou; }).length;
    faixas.push({ nome:nomes[i]||('faixa '+(i+1)),
      de:+fatia[0].nota.toFixed(3), ate:+fatia[fatia.length-1].nota.toFixed(3),
      n:fatia.length, ganhas:ganhas, taxa:+(ganhas/fatia.length*100).toFixed(1) });
  }
  faixas[faixas.length-1].ate=1e9;
  return faixas;
}

function avaliar(registros, opcoes){
  opcoes=opcoes||{};
  var corte=opcoes.fracaoTreino||0.7;
  var regs=(registros||[]).filter(function(r){
    return r && typeof r.ganhou==='boolean' && r.sinais;
  }).sort(function(a,b){ return tempo(a)-tempo(b); });

  var k=Math.floor(regs.length*corte);
  var treino=regs.slice(0,k), teste=regs.slice(k);

  var m=treinar(treino);
  if(!m.serve) return { serve:false, etapa:'treino', porque:m.porque, modelo:m };

  var tG=teste.filter(function(r){ return r.ganhou; }).length;
  if(teste.length<MIN_TESTE || tG<5 || (teste.length-tG)<5){
    return { serve:false, etapa:'teste',
      porque:'O teste ficou com '+teste.length+' casos ('+tG+' ganhas). '
            +'Sem pelo menos '+MIN_TESTE+' e 5 de cada lado, a medição é '
            +'ruído e eu não tenho como dizer se o modelo presta.' };
  }

  var pontos=teste.map(function(r){
    return { ganhou:r.ganhou, nota:pontuar(m,r.sinais).nota };
  });
  var a=auc(pontos);

  if(a<AUC_MINIMO) return { serve:false, etapa:'medicao', auc:+a.toFixed(3),
    porque:'No teste o AUC foi '+a.toFixed(3)+' (moeda é 0,500; o mínimo que '
          +'aceito é '+AUC_MINIMO.toFixed(2)+'). Os sinais que você está '
          +'passando não separam ganho de perda. Não é para usar a nota — '
          +'é para olhar quais sinais estão entrando.' };

  m.faixas=calibrar(pontos);
  return { serve:true, modelo:m, auc:+a.toFixed(3),
    treino:treino.length, teste:teste.length, faixas:m.faixas,
    suspeitas:m.suspeitas,
    porque:'AUC '+a.toFixed(3)+' em '+teste.length+' negociações que o modelo '
          +'não viu no treino (moeda é 0,500). Treinado em '+treino.length
          +', testado nas mais recentes. '+(m.suspeitas.length
            ? 'Atenção: '+m.suspeitas.length+' sinal(is) sob suspeita de '
             +'vazamento — veja `suspeitas` antes de confiar neste número.'
            : 'Nenhum sinal sob suspeita de vazamento.') };
}

function tempo(r){
  var q=r.quando;
  if(q==null) return 0;
  if(ehNumero(q)) return q;
  var d=new Date(q);
  return isNaN(d.getTime())?0:d.getTime();
}

/* Sinais que eu sugiro — todos conhecidos ANTES do fim. Serve de
   checklist para montar `sinais` a partir do Kommo. */
var SUGESTAO_DE_SINAIS=[
  'origem           — anúncio, indicação, orgânico, repetido',
  'campanha         — nome da campanha, quando houver',
  'informouDatas    — booleano: já disse quando viaja',
  'antecedenciaDias — número: dias entre o contato e a viagem',
  'categoria        — a categoria que ele pediu',
  'diarias          — número de diárias pedidas',
  'cotacaoEnviada   — booleano',
  'cotacoesEnviadas — número: quantas versões já foram',
  'msgsCliente      — número: quantas mensagens ele mandou',
  'primeiraResposta — número: minutos até a casa responder',
  'maiorEspera      — número: horas de maior silêncio da casa',
  'falouPreco       — booleano: reclamou de valor',
  'pediuDesconto    — booleano',
  'citouConcorrente — booleano',
  'vendedor         — quem atende',
  'faixaHoraContato — número: hora do primeiro contato',
  'retomadas        — número: quantas retomadas enviadas'
];

raiz.MGW_CHANCE={ treinar:treinar, pontuar:pontuar, avaliar:avaliar,
  auc:auc, calibrar:calibrar, tokens:tokens, aprenderCortes:aprenderCortes,
  SUGESTAO_DE_SINAIS:SUGESTAO_DE_SINAIS,
  MIN_TOTAL:MIN_TOTAL, MIN_POR_LADO:MIN_POR_LADO, AUC_MINIMO:AUC_MINIMO };
})(typeof module!=='undefined'&&module.exports?module.exports:(typeof window!=='undefined'?window:this));
