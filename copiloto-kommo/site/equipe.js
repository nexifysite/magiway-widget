/* ═══════════════════════════════════════════════════════════════════
   EQUIPE — a lista é FIXA, não é derivada dos dados
   ───────────────────────────────────────────────────────────────────
   O pedido era "adicione Janes de volta ao painel". Ela tinha sumido
   porque o painel montava a lista a partir de quem apareceu nos dados
   do período — e quem não trabalhou no Kommo naquele período não
   aparecia. O problema disso é que **ausência de atividade é a
   informação mais importante do painel**, e era exatamente ela que
   desaparecia: a linha sumia junto com o motivo de olhar para ela.

   Aqui a lista vem do cadastro. Quem não tem evento aparece com zero e
   com o estado escrito — nunca some, e nunca é inventado.

   Os quatro cadastros são os mesmos do app de vendas (índices e e-mails
   conferidos em index.html, bloco MGW_USUARIOS, 06/10/2026). Janes é
   **Gerência** — corrigido pelo Luciano em 06/10/2026; antes estava
   "Gestora Operacional" nos dois projetos.
   ═══════════════════════════════════════════════════════════════════ */
(function(raiz){
'use strict';

/* `kommo` é o identificador da pessoa DENTRO do Kommo, que pode não ser
   o e-mail. Deixei como lista para aceitar mais de um apelido: se o
   Kommo devolve "Janes C." numa tela e "janecossta28" na outra, as duas
   formas apontam para a mesma pessoa em vez de criarem duas linhas. */
var EQUIPE=[
  { id:'90f61b19-51e9-4297-81e5-58dd188a13d9', nome:'Luciano Lira',
    iniciais:'LL', cargo:'Gerente Comercial', cor:'#FF0000',
    email:'luciano_lira19@hotmail.com',
    kommo:['luciano_lira19@hotmail.com','luciano lira','luciano'] },
  { id:'6bafe0bf-64a9-438c-b751-8b25c0b0f36d', nome:'Dickson Medeiros',
    iniciais:'DM', cargo:'SDR', cor:'#1FA9A6',
    email:'dicksonmedeiros29@gmail.com',
    kommo:['dicksonmedeiros29@gmail.com','dickson medeiros','dickson'] },
  { id:'6316d403-3d2f-4f87-94ef-d74fb48a9b1f', nome:'Janes',
    iniciais:'JA', cargo:'Gerência', cor:'#FFD11A',
    email:'janecossta28@gmail.com',
    kommo:['janecossta28@gmail.com','janes costta','janes','jane'] },
  { id:'2e2b5819-d978-4589-91aa-aaac51ea918d', nome:'Diretoria',
    iniciais:'DI', cargo:'Diretoria', cor:'#3B9EFF',
    email:'magiwayrentalcarusa@gmail.com',
    kommo:['magiwayrentalcarusa@gmail.com','diretoria','magiway'] }
];

function norm(s){ return String(s==null?'':s).toLowerCase()
  .normalize('NFD').replace(/[̀-ͯ]/g,'').trim(); }

/* Acha a pessoa por qualquer apelido conhecido. Devolve null quando não
   reconhece — e aí a tela mostra o nome cru numa linha separada, em vez
   de jogar a atividade na conta de quem calhar. */
function quem(identificador){
  var k=norm(identificador);
  if(!k) return null;
  for(var i=0;i<EQUIPE.length;i++){
    var p=EQUIPE[i];
    if(norm(p.email)===k || norm(p.nome)===k || p.id===identificador) return p;
    for(var j=0;j<p.kommo.length;j++) if(norm(p.kommo[j])===k) return p;
  }
  return null;
}

/* Linhas do painel: UMA por pessoa cadastrada, sempre, mais uma por
   identificador que apareceu nos dados e não está no cadastro.
   O segundo grupo existe porque silenciar atividade de alguém que
   ninguém cadastrou é perder dado real — e porque é assim que você
   descobre que entrou gente nova no Kommo. */
function linhas(eventos, dono){
  dono=dono||function(e){ return e.quem; };
  var porPessoa={}, forasteiros={};
  EQUIPE.forEach(function(p){ porPessoa[p.id]={ pessoa:p, eventos:[] }; });

  (eventos||[]).forEach(function(e){
    var ident=dono(e);
    var p=quem(ident);
    if(p){ porPessoa[p.id].eventos.push(e); return; }
    var k=norm(ident)||'(sem identificação)';
    if(!forasteiros[k]) forasteiros[k]={
      pessoa:{ id:'?'+k, nome:String(ident||'(sem identificação)'),
               iniciais:'??', cargo:'não cadastrado', cor:'#8892a6',
               email:'', kommo:[], naoCadastrado:true },
      eventos:[] };
    forasteiros[k].eventos.push(e);
  });

  var out=EQUIPE.map(function(p){ return porPessoa[p.id]; });
  Object.keys(forasteiros).sort().forEach(function(k){ out.push(forasteiros[k]); });
  out.forEach(function(l){ l.semDado=l.eventos.length===0; });
  return out;
}

/* Quem ficou sem nenhum evento no recorte. É uma lista para a tela
   mostrar com destaque, não um erro. */
function semDado(eventos, dono){
  return linhas(eventos,dono).filter(function(l){
    return l.semDado && !l.pessoa.naoCadastrado; }).map(function(l){ return l.pessoa; });
}

function porId(id){ for(var i=0;i<EQUIPE.length;i++) if(EQUIPE[i].id===id) return EQUIPE[i]; return null; }

raiz.MGW_EQUIPE={ EQUIPE:EQUIPE, quem:quem, porId:porId,
  linhas:linhas, semDado:semDado, norm:norm };
})(typeof module!=='undefined'&&module.exports?module.exports:(typeof window!=='undefined'?window:this));
