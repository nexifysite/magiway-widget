/* ═══════════════════════════════════════════════════════════════════
   VENDA GANHA — rastreio da origem, e o que o Kommo NÃO entrega
   ───────────────────────────────────────────────────────────────────
   O pedido tinha duas partes, e a segunda é a que normalmente se
   esquece: *"se faltar algo no painel do cliente avise para
   ajustarmos"*. Então este arquivo não só colhe os campos — ele conta
   **quantas vendas vieram sem cada campo** e devolve isso como
   entregável, não como rodapé.

   Por que medir em vez de eu listar o que falta: eu não tenho acesso à
   conta do Kommo. Qualquer lista que eu escrevesse seria palpite sobre
   a configuração dele. `oQueFalta()` responde com o dado real — e
   continua respondendo depois, quando a configuração mudar.

   ⚠ Os nomes de campo do Kommo variam por conta (campos
   personalizados têm id numérico). `LEITORES` abaixo tenta os nomes
   mais comuns; quando um campo vem vazio em TODAS as vendas, é quase
   sempre nome errado, não campo ausente — e `oQueFalta` diz isso com
   essas palavras, para ninguém sair pedindo ao suporte do Kommo um
   campo que já existe.
   ═══════════════════════════════════════════════════════════════════ */
(function(raiz){
'use strict';

function dep(nome, caminho){
  if(raiz[nome]) return raiz[nome];
  if(typeof require!=='undefined') return require(caminho)[nome];
  throw new Error('venda-ganha precisa de '+caminho+' carregado antes');
}

function prim(obj, nomes){
  for(var i=0;i<nomes.length;i++){
    var v=cavar(obj, nomes[i]);
    if(v!=null && v!=='' && !(Array.isArray(v)&&!v.length)) return v;
  }
  return null;
}
/* aceita 'a.b.c' e procura também dentro de custom_fields_values */
function cavar(obj, caminho){
  if(!obj) return null;
  var p=String(caminho).split('.'), x=obj;
  for(var i=0;i<p.length;i++){
    if(x==null) return null;
    x=x[p[i]];
  }
  if(x!=null) return x;
  var cf=obj.custom_fields_values||obj.custom_fields||obj.campos;
  if(Array.isArray(cf)){
    for(var j=0;j<cf.length;j++){
      var c=cf[j], nome=String(c.field_name||c.name||c.nome||'').toLowerCase();
      if(nome===String(caminho).toLowerCase()){
        var vs=c.values||c.valores;
        if(Array.isArray(vs)&&vs.length) return vs[0].value!=null?vs[0].value:vs[0];
        return c.value!=null?c.value:null;
      }
    }
  }
  return null;
}

/* O que colher, e de onde tentar. A ordem é a preferência. */
var LEITORES={
  id:            ['id','lead_id'],
  cliente:       ['name','nome','contato.nome','contact.name'],
  valor:         ['price','valor','sale','preco'],
  moeda:         ['currency','moeda'],
  vendedor:      ['responsible_user','responsavel','vendedor','responsible_user_id'],
  entrouEm:      ['created_at','criado_em','data_entrada','entrada'],
  fechadoEm:     ['closed_at','closest_task_at','fechado_em','data_fechamento'],
  primeiroToque: ['first_message_at','primeiro_contato','primeira_mensagem'],
  origem:        ['source','origem','_embedded.source.name','utm_source'],
  campanha:      ['campaign','campanha','utm_campaign'],
  criativo:      ['creative','criativo','utm_content','ad_name'],
  linkDoAnuncio: ['ad_link','link_anuncio','anuncio_url','ad_url','referrer'],
  utmSource:     ['utm_source'],
  utmMedium:     ['utm_medium'],
  utmCampaign:   ['utm_campaign'],
  utmContent:    ['utm_content'],
  utmTerm:       ['utm_term'],
  categoria:     ['categoria','car_category','veiculo'],
  retirada:      ['data_retirada','pickup','inicio_viagem'],
  devolucao:     ['data_devolucao','dropoff','fim_viagem'],
  email:         ['email','contato.email','contact.email'],
  telefone:      ['phone','telefone','contato.telefone','contact.phone'],
  fbclid:        ['fbclid','fbc','_fbc'],
  fbp:           ['fbp','_fbp']
};

/* Campos sem os quais o rastreio de campanha não funciona. A separação
   existe para a tela não dar o mesmo alarme por "falta o link do
   anúncio" e por "falta o termo da UTM". */
var ESSENCIAIS=['valor','entrouEm','fechadoEm','origem','campanha','linkDoAnuncio'];

function ler(lead){
  var out={ _cru:lead };
  Object.keys(LEITORES).forEach(function(k){
    out[k]=prim(lead, LEITORES[k]);
  });
  /* responsible_user pode vir como objeto ou id */
  if(out.vendedor && typeof out.vendedor==='object')
    out.vendedor=out.vendedor.name||out.vendedor.nome||out.vendedor.id||null;
  out.valor=(+out.valor||0)||null;
  out.moeda=out.moeda||'BRL';
  if(out.entrouEm && out.fechadoEm){
    var a=new Date(out.entrouEm).getTime(), b=new Date(out.fechadoEm).getTime();
    if(isFinite(a)&&isFinite(b)&&b>=a) out.diasAteFechar=+((b-a)/86400000).toFixed(1);
  }
  out.faltando=Object.keys(LEITORES).filter(function(k){
    return out[k]==null || out[k]===''; });
  out.faltandoEssencial=out.faltando.filter(function(k){
    return ESSENCIAIS.indexOf(k)>=0; });
  return out;
}

function lerTodas(leads){ return (leads||[]).map(ler); }

/* ── o entregável: o que o Kommo não está dando ─────────────────── */
function oQueFalta(leads){
  var vs=lerTodas(leads);
  if(!vs.length) return { total:0, campos:[],
    porque:'Nenhuma venda ganha no recorte — não há o que conferir.' };

  var campos=Object.keys(LEITORES).map(function(k){
    var vazios=vs.filter(function(v){ return v[k]==null||v[k]===''; }).length;
    var pct=vazios/vs.length*100;
    return { campo:k, vazios:vazios, total:vs.length, pct:+pct.toFixed(1),
      essencial:ESSENCIAIS.indexOf(k)>=0,
      diagnostico: vazios===vs.length
        ? 'vazio em TODAS — quase sempre é nome de campo errado neste '
         +'arquivo, não campo ausente no Kommo. Confira o nome real antes '
         +'de pedir ao suporte.'
        : vazios===0 ? 'sempre presente'
        : 'presente em '+(vs.length-vazios)+' de '+vs.length
         +' — é preenchimento irregular, não configuração.' };
  }).filter(function(c){ return c.vazios>0; })
    .sort(function(a,b){
      return (b.essencial-a.essencial)||(b.vazios-a.vazios); });

  var todosVazios=campos.filter(function(c){ return c.vazios===c.total; });
  var essenciais=campos.filter(function(c){ return c.essencial; });

  return { total:vs.length, campos:campos,
    porque:'Em '+vs.length+' venda(s) ganha(s): '+campos.length
      +' campo(s) vêm incompletos, '+essenciais.length+' deles essenciais '
      +'para rastrear campanha. '+(todosVazios.length
        ? todosVazios.length+' estão vazios em todas as vendas ('
         +todosVazios.map(function(c){return c.campo;}).join(', ')
         +') — antes de pedir ajuste ao Kommo, confira se o nome do campo '
         +'neste arquivo bate com o nome real da sua conta.'
        : 'Nenhum campo está vazio em todas, então os nomes estão certos.') };
}

/* ── ranking de campanha pelo próprio link do anúncio ───────────── */
function porCampanha(leads, opcoes){
  opcoes=opcoes||{};
  var minimo=opcoes.minimo||3;
  var vs=lerTodas(leads).filter(function(v){ return v.valor>0; });
  var m={};
  vs.forEach(function(v){
    var chave=v.linkDoAnuncio||v.campanha||v.utmCampaign||'(sem campanha)';
    var g=m[chave]=m[chave]||{ chave:chave, link:v.linkDoAnuncio||null,
      campanha:v.campanha||v.utmCampaign||null, criativos:{},
      n:0, receita:0, dias:[] };
    g.n++; g.receita+=v.valor;
    if(v.criativo) g.criativos[v.criativo]=(g.criativos[v.criativo]||0)+1;
    if(v.diasAteFechar!=null) g.dias.push(v.diasAteFechar);
  });
  return Object.keys(m).map(function(k){
    var g=m[k];
    return { chave:g.chave, link:g.link, campanha:g.campanha,
      vendas:g.n, receita:+g.receita.toFixed(2),
      ticket:+(g.receita/g.n).toFixed(2),
      diasMedio: g.dias.length? +(g.dias.reduce(function(a,b){return a+b;},0)/g.dias.length).toFixed(1):null,
      criativos:Object.keys(g.criativos).sort(function(a,b){
        return g.criativos[b]-g.criativos[a]; }).slice(0,5),
      /* o ranking só é ranking acima do mínimo: duas vendas numa
         campanha não dizem que ela é melhor que outra com quinze */
      confiavel:g.n>=minimo };
  }).sort(function(a,b){ return b.receita-a.receita; });
}

/* Agrupa venda ganha por ciclo 13→12, para bater com o app de vendas. */
function porCiclo(leads, deps){
  var C=(deps&&deps.ciclo)||dep('MGW_CICLO_K','./ciclo.js');
  var vs=lerTodas(leads).filter(function(v){ return v.fechadoEm; });
  return C.agruparPorCiclo(vs, function(v){ return v.fechadoEm; })
    .map(function(g){
      var r=g.itens.reduce(function(a,v){ return a+(v.valor||0); },0);
      return { ciclo:g.ciclo, vendas:g.itens.length, receita:+r.toFixed(2),
        ticket:g.itens.length?+(r/g.itens.length).toFixed(2):null,
        itens:g.itens };
    });
}

raiz.MGW_VENDA={ ler:ler, lerTodas:lerTodas, oQueFalta:oQueFalta,
  porCampanha:porCampanha, porCiclo:porCiclo,
  LEITORES:LEITORES, ESSENCIAIS:ESSENCIAIS };
})(typeof module!=='undefined'&&module.exports?module.exports:(typeof window!=='undefined'?window:this));
