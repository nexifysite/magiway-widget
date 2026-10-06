/* ═══════════════════════════════════════════════════════════════════
   ADAPTADOR — a única peça que eu não consegui testar
   ───────────────────────────────────────────────────────────────────
   Os outros módulos são funções puras sobre texto: recebem array,
   devolvem array, e estão testados. Este aqui é o que lê o SEU banco,
   e eu não tinha o projeto para conferir o formato real. Escrevi pelo
   que o README descreve.

   É UM ARQUIVO SÓ E SÃO TRÊS FUNÇÕES. Se o painel vier vazio, é aqui
   que está o problema — não nos outros módulos. Abra o seu banco.json,
   olhe uma conversa, e ajuste os nomes dos campos nas três marcações
   ⚠ AJUSTAR abaixo. Nada mais precisa mudar.

   O que cada função precisa produzir:
     paresPerguntaResposta → [{pergunta, resposta, vendedor, quando, conversa}]
         uma fala do cliente e a resposta que o vendedor deu em seguida
     falasDeCliente        → ['texto', 'texto', ...]
     naoReconhecidas       → as falas que o classificador devolveu null
   ═══════════════════════════════════════════════════════════════════ */
(function(raiz){
'use strict';

/* ⚠ AJUSTAR 1 — como saber se a mensagem é do cliente ou do vendedor.
   No README as mensagens têm direção; o nome do campo pode ser
   'direcao', 'tipo', 'in', 'entrada'. Confira numa conversa real. */
function ehDoCliente(m){
  if(!m) return false;
  if(typeof m.do_cliente==='boolean') return m.do_cliente;
  if(m.direcao) return /entr|receb|cliente|in/i.test(String(m.direcao));
  if(m.tipo)    return /entr|receb|cliente|in/i.test(String(m.tipo));
  if(typeof m.entrada==='boolean') return m.entrada;
  return false;
}

/* ⚠ AJUSTAR 2 — onde está o texto e a hora da mensagem. */
function textoDe(m){ return (m&&(m.texto||m.text||m.mensagem||m.body||''))+''; }
function horaDe(m){  return m&&(m.quando||m.data||m.criado_em||m.created_at||m.ts)||null; }

/* ⚠ AJUSTAR 3 — como chegar na lista de conversas e de mensagens. */
function conversasDe(banco){
  if(!banco) return [];
  if(Array.isArray(banco)) return banco;
  return banco.conversas||banco.conversations||banco.talks||[];
}
function mensagensDe(conversa){
  return (conversa&&(conversa.mensagens||conversa.messages||conversa.msgs))||[];
}

/* ── pares pergunta → resposta ──────────────────────────────────────
   Uma fala do cliente vale como "pergunta" quando o vendedor respondeu
   logo em seguida. Respostas que não servem de modelo ficam de fora,
   pela mesma régua que a Biblioteca do projeto já usa: nada com preço,
   link, e-mail ou número longo, porque são de outro cliente e sairiam
   errados se enviados. */
function respostaServe(txt){
  if(!txt) return false;
  var t=String(txt);
  if(t.length<12 || t.length>700) return false;
  if(/R\$|US\$|\$\s?\d/.test(t)) return false;        /* preço de outro cliente */
  if(/https?:\/\//.test(t)) return false;              /* link */
  if(/@\w+\.\w/.test(t)) return false;                 /* e-mail */
  if(/\d{6,}/.test(t)) return false;                   /* número longo */
  return true;
}

function paresPerguntaResposta(banco, opcoes){
  opcoes=opcoes||{};
  var out=[];
  conversasDe(banco).forEach(function(c){
    var ms=mensagensDe(c);
    for(var i=0;i<ms.length-1;i++){
      if(!ehDoCliente(ms[i])) continue;
      /* a próxima mensagem do VENDEDOR, pulando falas seguidas do cliente */
      var j=i+1;
      while(j<ms.length && ehDoCliente(ms[j])) j++;
      if(j>=ms.length) break;
      var p=textoDe(ms[i]).trim(), r=textoDe(ms[j]).trim();
      if(p.length<3 || !respostaServe(r)) continue;
      out.push({
        pergunta:p, resposta:r,
        vendedor:(c.vendedor||c.responsavel||ms[j].autor||''),
        quando:horaDe(ms[j]),
        conversa:(c.id||c.lead_id||c.nome||'')
      });
    }
  });
  return out;
}

function falasDeCliente(banco){
  var out=[];
  conversasDe(banco).forEach(function(c){
    mensagensDe(c).forEach(function(m){
      if(!ehDoCliente(m)) return;
      var t=textoDe(m).trim();
      /* marcador de mídia não é fala: entra como [voice], [picture] */
      if(t.length>=3 && !/^\[\w+\]$/.test(t)) out.push(t);
    });
  });
  return out;
}

function naoReconhecidas(banco, classificar){
  return falasDeCliente(banco).filter(function(t){
    try{ return !classificar(t); }catch(e){ return false; }
  });
}

/* Confere se o adaptador está lendo o banco. Rode ANTES de culpar os
   outros módulos: devolve os números e um exemplo de cada coisa. */
function conferir(banco){
  var convs=conversasDe(banco);
  var falas=falasDeCliente(banco);
  var pares=paresPerguntaResposta(banco);
  return {
    conversas:convs.length,
    falasDeCliente:falas.length,
    paresEncontrados:pares.length,
    exemploFala: falas[0]||null,
    exemploPar: pares[0]||null,
    diagnostico: convs.length===0 ? 'Não achei conversas — ajuste conversasDe()'
               : falas.length===0 ? 'Achei conversas mas nenhuma fala de cliente — ajuste ehDoCliente() ou textoDe()'
               : pares.length===0 ? 'Achei falas mas nenhum par — veja respostaServe() e a ordem das mensagens'
               : 'Está lendo o banco.'
  };
}

raiz.MGW_ADAPTADOR={ paresPerguntaResposta:paresPerguntaResposta,
  falasDeCliente:falasDeCliente, naoReconhecidas:naoReconhecidas,
  conferir:conferir, ehDoCliente:ehDoCliente, respostaServe:respostaServe };
})(typeof module!=='undefined'&&module.exports?module.exports:(typeof window!=='undefined'?window:this));
