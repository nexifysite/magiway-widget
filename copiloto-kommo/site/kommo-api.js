/* ═══════════════════════════════════════════════════════════════════
   KOMMO API — a conexão de verdade com a sua conta
   ───────────────────────────────────────────────────────────────────
   ⚠ **ESTE É O ÚNICO ARQUIVO DO PACOTE QUE USA REDE.** Os outros 19 são
   funções puras e os testes provam isso. Se algum dia alguém precisar
   auditar o que sai deste projeto para fora, é aqui e em nenhum outro
   lugar.

   ─── a trava mais importante: 6 requisições por segundo ──────────
   O Kommo permite **7 req/s**. Ao exceder devolve 429. E se o excesso
   se repetir, **a conta é bloqueada e passa a devolver 403 em TUDO** —
   não só na API: a integração inteira para. Isso não é um aviso teórico
   copiado da documentação; é o motivo de este arquivo ter uma fila em
   vez de chamar `fetch` direto.

   Por isso:
     · toda chamada passa por uma fila a 6 req/s (margem de propósito);
     · 429 → espera e tenta de novo, no máximo 3 vezes;
     · 429 repetido → **para tudo** e devolve erro gritando, em vez de
       continuar martelando e queimar a conta;
     · 403 → trata como possível bloqueio e manda parar, não insistir.

   Um painel "em tempo real" que faz polling de 1 segundo por pessoa
   estoura esse limite em uma manhã. O monitoramento ao vivo tem que vir
   do SSE do seu servidor (que recebe webhook do Kommo), e as métricas
   de hora em hora — que é exatamente o que você pediu.

   ─── o token NÃO entra neste arquivo ─────────────────────────────
   Ele vem de `config.json`, que fica fora do Git. **Não me mande o
   token.** Token de CRM dá acesso a toda a base de clientes; se vazar,
   quem tiver acesso lê, altera e apaga tudo. Você já teve uma chave
   privada exposta nesta conversa — não repita com o Kommo.
   ═══════════════════════════════════════════════════════════════════ */
(function(raiz){
'use strict';

var LIMITE_RPS=6;          /* o Kommo aceita 7; uso 6 de propósito */
var MAX_TENTATIVAS=3;
var LIMITE_PAGINA=250;     /* máximo que o Kommo devolve por página */
var GANHO=142, PERDA=143;  /* status padrão do Kommo: ganho e perda */

/* ── a fila ────────────────────────────────────────────────────────
   Serializa e espaça as chamadas. `agora` e `dormir` são injetáveis
   para o teste rodar em milissegundos em vez de segundos. */
function criarFila(opcoes){
  opcoes=opcoes||{};
  var rps=opcoes.rps||LIMITE_RPS;
  var intervalo=1000/rps;
  var agora=opcoes.agora||function(){ return Date.now(); };
  var dormir=opcoes.dormir||function(ms){
    return new Promise(function(r){ setTimeout(r,ms); }); };
  var ultima=0, corrente=Promise.resolve();
  var bloqueada=false, motivoBloqueio=null;

  function bloquear(motivo){ bloqueada=true; motivoBloqueio=motivo; }

  function entrar(fn){
    corrente=corrente.then(function(){
      if(bloqueada) throw new Error(motivoBloqueio);
      var espera=Math.max(0, ultima+intervalo-agora());
      return (espera?dormir(espera):Promise.resolve()).then(function(){
        ultima=agora();
        return fn();
      });
    }, function(e){
      /* um erro não pode envenenar a fila para sempre: a corrente é
         recriada, mas o bloqueio por 403 permanece de propósito */
      corrente=Promise.resolve();
      throw e;
    });
    return corrente;
  }
  return { entrar:entrar, bloquear:bloquear,
    estaBloqueada:function(){ return bloqueada; },
    motivo:function(){ return motivoBloqueio; },
    dormir:dormir };
}

/* ── o cliente ─────────────────────────────────────────────────── */
function criar(cfg){
  cfg=cfg||{};
  var sub=String(cfg.subdominio||'').replace(/\.kommo\.com.*$/,'').trim();
  var token=cfg.token||'';
  var base=cfg.base||('https://'+sub+'.kommo.com/api/v4');
  var _fetch=cfg.fetch||(typeof fetch!=='undefined'?fetch:null);
  var fila=criarFila(cfg);
  var log=cfg.log||function(){};

  function erro(msg, extra){
    var e=new Error(msg);
    Object.keys(extra||{}).forEach(function(k){ e[k]=extra[k]; });
    return e;
  }

  function diagnosticar(status, corpo){
    if(status===401) return 'Token inválido ou expirado (401). Gere outro em '
      +'Configurações → Integrações no Kommo e troque em config.json. '
      +'Não me mande o token.';
    if(status===402) return 'A assinatura do Kommo está vencida (402). '
      +'Nenhum código resolve isso.';
    if(status===403) return 'Proibido (403). Duas causas, e a segunda é '
      +'grave: (a) o token não tem o escopo necessário; (b) a conta foi '
      +'BLOQUEADA por exceder o limite de requisições. Se tudo passou a '
      +'dar 403 de repente, é (b): pare as chamadas por algumas horas e '
      +'baixe a frequência antes de voltar.';
    if(status===404) return 'Não encontrado (404). Confira o subdomínio '
      +'em config.json — o endereço montado foi '+base+'. Se o seu Kommo '
      +'abre em magiway.kommo.com, o subdomínio é "magiway".';
    if(status===429) return 'Limite de requisições estourado (429).';
    return 'HTTP '+status+(corpo?': '+String(corpo).slice(0,200):'');
  }

  function pedir(caminho, params, tentativa){
    tentativa=tentativa||1;
    if(!_fetch) return Promise.reject(erro('Sem fetch disponível neste ambiente'));
    if(!sub)   return Promise.reject(erro('Falta o subdomínio em config.json'));
    if(!token) return Promise.reject(erro('Falta o token em config.json. '
      +'Gere em Configurações → Integrações no Kommo. Não me mande o token.'));

    var url=base+caminho+monta(params);
    return fila.entrar(function(){
      log('GET '+url);
      return _fetch(url, { method:'GET', headers:{
        'Authorization':'Bearer '+token, 'Accept':'application/json' } });
    }).then(function(r){
      if(r.status===204) return null;            /* sem conteúdo */
      if(r.status===429){
        if(tentativa>=MAX_TENTATIVAS){
          fila.bloquear('PARADO: o Kommo devolveu 429 '+MAX_TENTATIVAS
            +' vezes. Continuar martelando BLOQUEIA a conta inteira (403 em '
            +'tudo, não só na API). Baixe a frequência e recomece a sessão.');
          throw erro(fila.motivo(), { status:429, parou:true });
        }
        var espera=Math.pow(2,tentativa)*1000;
        log('429 — esperando '+espera+' ms (tentativa '+tentativa+')');
        return fila.dormir(espera).then(function(){
          return pedir(caminho, params, tentativa+1); });
      }
      if(r.status===403){
        fila.bloquear(diagnosticar(403));
        throw erro(diagnosticar(403), { status:403, parou:true });
      }
      if(!r.ok) return (r.text?r.text():Promise.resolve('')).then(function(t){
        throw erro(diagnosticar(r.status,t), { status:r.status }); });
      return r.json();
    });
  }

  function monta(p){
    if(!p) return '';
    var partes=[];
    Object.keys(p).forEach(function(k){
      var v=p[k];
      if(v==null||v==='') return;
      if(Array.isArray(v)) v.forEach(function(x,i){
        partes.push(encodeURIComponent(k+'['+i+']')+'='+encodeURIComponent(x)); });
      else partes.push(encodeURIComponent(k)+'='+encodeURIComponent(v));
    });
    return partes.length?('?'+partes.join('&')):'';
  }

  /* Paginação: o Kommo devolve `_embedded` e `_links.next`. Páginas são
     buscadas uma a uma pela fila — nunca em paralelo, senão o limite de
     requisições é estourado por construção.
     `maxPaginas` existe para o painel não puxar 40 mil leads sem
     ninguém pedir: é melhor mostrar 2.500 e um aviso. */
  function paginar(caminho, params, colecao, opcoes){
    opcoes=opcoes||{};
    var max=opcoes.maxPaginas||10;
    var out=[], pagina=1, truncou=false;

    function volta(){
      var p=Object.assign({}, params, { page:pagina, limit:LIMITE_PAGINA });
      return pedir(caminho, p).then(function(r){
        if(!r) return out;
        var emb=(r._embedded&&r._embedded[colecao])||[];
        emb.forEach(function(x){ out.push(x); });
        var temMais=!!(r._links&&r._links.next)&&emb.length>0;
        if(!temMais) return out;
        if(pagina>=max){ truncou=true; return out; }
        pagina++;
        return volta();
      });
    }
    return volta().then(function(lista){
      lista._truncou=truncou;
      lista._paginas=pagina;
      if(truncou) log('AVISO: parei em '+max+' páginas ('+lista.length
        +' itens). Aumente maxPaginas se precisar de mais — e lembre do '
        +'limite de requisições.');
      return lista;
    });
  }

  /* ── endpoints ─────────────────────────────────────────────────── */
  function conta(){ return pedir('/account'); }
  function usuarios(){ return paginar('/users', {}, 'users'); }

  function leads(filtros, opcoes){
    return paginar('/leads', Object.assign({ with:'contacts,source_id' },
      filtros||{}), 'leads', opcoes);
  }
  /* Ganho é o status 142 e perda o 143 — padrão do Kommo em todo funil.
     `de` e `ate` em segundos, como a API espera. */
  function ganhas(de, ate, opcoes){
    var f={ 'filter[statuses][0][status_id]':GANHO };
    if(de)  f['filter[closed_at][from]']=Math.floor(new Date(de).getTime()/1000);
    if(ate) f['filter[closed_at][to]']  =Math.floor(new Date(ate).getTime()/1000);
    return leads(f, opcoes);
  }
  function encerradas(de, ate, opcoes){
    /* ganhas E perdidas: é o que `chance-de-fechar` precisa para
       treinar. Treinar só com ganhas ensina que tudo fecha. */
    var f={ 'filter[statuses][0][status_id]':GANHO,
            'filter[statuses][1][status_id]':PERDA };
    if(de)  f['filter[closed_at][from]']=Math.floor(new Date(de).getTime()/1000);
    if(ate) f['filter[closed_at][to]']  =Math.floor(new Date(ate).getTime()/1000);
    return leads(f, opcoes);
  }
  function eventos(de, ate, opcoes){
    var f={};
    if(de)  f['filter[created_at][from]']=Math.floor(new Date(de).getTime()/1000);
    if(ate) f['filter[created_at][to]']  =Math.floor(new Date(ate).getTime()/1000);
    return paginar('/events', f, 'events', opcoes);
  }
  function notas(entidade, opcoes){
    return paginar('/'+(entidade||'leads')+'/notes', {}, 'notes', opcoes);
  }
  function notasDoLead(id, opcoes){
    return paginar('/leads/'+id+'/notes', {}, 'notes', opcoes);
  }

  /* ── descobrir em vez de adivinhar ─────────────────────────────────
     O tipo de nota que carrega mensagem de WhatsApp muda conforme a
     integração instalada na conta. Em vez de eu cravar um nome que pode
     não existir na sua, isto LÊ uma amostra e diz quais tipos aparecem
     de fato, com um exemplo de cada. É o mesmo princípio do
     `oQueFalta()` do venda-ganha.js. */
  function descobrirTiposDeNota(opcoes){
    return notas('leads', { maxPaginas:(opcoes&&opcoes.maxPaginas)||2 })
      .then(function(ns){
        var m={};
        ns.forEach(function(n){
          var t=n.note_type||'(sem tipo)';
          if(!m[t]) m[t]={ tipo:t, n:0, exemplo:null };
          m[t].n++;
          if(!m[t].exemplo && n.params){
            var p=n.params;
            m[t].exemplo=String(p.text||p.message||p.link||'').slice(0,120);
          }
        });
        var lista=Object.keys(m).map(function(k){ return m[k]; })
          .sort(function(a,b){ return b.n-a.n; });
        return { amostra:ns.length, tipos:lista,
          porque:'Encontrei '+lista.length+' tipo(s) de nota em '+ns.length
            +' nota(s). Os que têm texto de conversa são os que o painel '
            +'deve ler; passe os nomes deles em `tiposDeMensagem` ao montar '
            +'as conversas. Não cravei nome nenhum porque isso depende da '
            +'integração instalada na SUA conta.' };
      });
  }

  /* ── diagnóstico: rode isto primeiro ───────────────────────────────
     Duas requisições, não mais. Diz exatamente o que está errado. */
  function conferir(){
    if(!sub) return Promise.resolve({ ok:false, etapa:'config',
      porque:'Falta `subdominio` em config.json.' });
    if(!token) return Promise.resolve({ ok:false, etapa:'config',
      porque:'Falta `token` em config.json. Gere em Configurações → '
            +'Integrações no Kommo. Não me mande o token.' });
    return conta().then(function(c){
      return usuarios().then(function(us){
        var E=raiz.MGW_EQUIPE||(typeof require!=='undefined'
              ? require('./equipe.js').MGW_EQUIPE : null);
        var naoCadastrados=[], semKommo=[];
        if(E){
          us.forEach(function(u){
            if(!E.quem(u.email)&&!E.quem(u.name))
              naoCadastrados.push((u.name||'?')+' <'+(u.email||'')+'>');
          });
          E.EQUIPE.forEach(function(p){
            if(!us.some(function(u){ return E.norm(u.email)===E.norm(p.email); }))
              semKommo.push(p.nome);
          });
        }
        return { ok:true, conta:{ id:c&&c.id, nome:c&&c.name,
            subdominio:c&&c.subdomain, moeda:c&&c.currency },
          usuarios:us.length,
          naoCadastrados:naoCadastrados, semContaNoKommo:semKommo,
          porque:'Conectado em '+(c&&c.name||sub)+' com '+us.length
            +' usuário(s) no Kommo.'
            +(naoCadastrados.length? ' Há '+naoCadastrados.length
               +' pessoa(s) no Kommo que não estão em equipe.js: '
               +naoCadastrados.join(', ')+'. Acrescente lá, senão a '
               +'atividade delas cai numa linha "não cadastrado".':'')
            +(semKommo.length? ' E '+semKommo.join(', ')+' está(ão) em '
               +'equipe.js sem conta correspondente no Kommo — a linha vai '
               +'aparecer sempre como "sem dado".':'') };
      });
    }).catch(function(e){
      return { ok:false, etapa:'conexao', status:e.status||null,
        parou:!!e.parou, porque:e.message };
    });
  }

  return { conta:conta, usuarios:usuarios, leads:leads, ganhas:ganhas,
    encerradas:encerradas, eventos:eventos, notas:notas,
    notasDoLead:notasDoLead, descobrirTiposDeNota:descobrirTiposDeNota,
    conferir:conferir, pedir:pedir, paginar:paginar,
    fila:fila, base:base, GANHO:GANHO, PERDA:PERDA };
}

/* ── tradução para o formato dos outros módulos ────────────────────
   Os 19 módulos não sabem nada de Kommo, e é isso que os torna
   testáveis. Estas três funções são a fronteira. */

/* evento do Kommo → o que ao-vivo.js espera */
var TIPO_EVENTO={
  'outgoing_chat_message':'enviou', 'outgoing_sms':'enviou',
  'outgoing_call':'enviou',         'outgoing_email':'enviou',
  'incoming_chat_message':'recebeu','incoming_sms':'recebeu',
  'incoming_call':'recebeu',        'incoming_email':'recebeu',
  'lead_status_changed':'moveu',    'entity_responsible_changed':'moveu',
  'task_added':'moveu',             'task_completed':'moveu',
  'entity_linked':'abriu',          'common_note_added':'enviou'
};
function paraEventos(eventosDoKommo){
  return (eventosDoKommo||[]).map(function(e){
    return {
      quem: (e.created_by!=null?String(e.created_by):'') ,
      quando: (e.created_at||0)*1000,
      tipo: TIPO_EVENTO[e.type] || 'moveu',
      conversa: e.entity_id!=null?String(e.entity_id):'',
      cliente: (e.value_after&&e.value_after[0]&&e.value_after[0].note
                && e.value_after[0].note.text) || '',
      _tipoKommo: e.type, _cru:e
    };
  }).filter(function(x){ return x.quando>0; });
}

/* notas de um lead → a conversa que avaliar-dia.js e kpis.js esperam.
   `tiposDeMensagem` vem de descobrirTiposDeNota() — não é adivinhado. */
function paraConversa(lead, notas, opcoes){
  opcoes=opcoes||{};
  var tipos=opcoes.tiposDeMensagem||['common','message_cashier','amomail',
    'chat_message','sms_in','sms_out'];
  var msgs=(notas||[]).filter(function(n){
      return tipos.indexOf(n.note_type)>=0; })
    .map(function(n){
      var p=n.params||{};
      var texto=String(p.text||p.message||'');
      /* a direção vem do tipo da nota ou de um campo `in`; quando não
         dá para saber, a mensagem é descartada em vez de entrar com
         direção errada — direção errada estraga toda a régua da
         avaliação em silêncio */
      var de=null;
      if(typeof p.in==='boolean') de=p.in?'cliente':'casa';
      else if(/in$|incoming/.test(String(n.note_type))) de='cliente';
      else if(/out$|outgoing/.test(String(n.note_type))) de='casa';
      else if(n.created_by===0) de='cliente';     /* 0 = não é usuário */
      else if(n.created_by>0) de='casa';
      if(!de||!texto) return null;
      return { de:de, quem:String(n.created_by||''),
               quando:(n.created_at||0)*1000, texto:texto,
               _tipoKommo:n.note_type };
    }).filter(Boolean)
    .sort(function(a,b){ return a.quando-b.quando; });

  return {
    id:String(lead&&lead.id||''),
    cliente:(lead&&lead.name)||'',
    quem:String((lead&&lead.responsible_user_id)||''),
    mensagens:msgs,
    ganhou:(lead&&lead.status_id)===GANHO,
    valor:+(lead&&lead.price)||0,
    fechadaEm:(lead&&lead.closed_at)?lead.closed_at*1000:null,
    _descartadas:(notas||[]).length-msgs.length
  };
}

/* lead ganho do Kommo → o que venda-ganha.js lê.
   Não traduz campo por campo de propósito: venda-ganha.js já procura
   por vários nomes e CONTA o que não achou. Aqui só achatamos os
   campos personalizados para ele conseguir ver. */
function paraLead(lead){
  var out=Object.assign({}, lead);
  var cf=lead&&(lead.custom_fields_values||lead.custom_fields);
  if(Array.isArray(cf)) cf.forEach(function(c){
    var nome=c.field_name||c.name;
    if(!nome) return;
    var vs=c.values;
    out[nome]=(Array.isArray(vs)&&vs.length)
      ? (vs[0].value!=null?vs[0].value:vs[0]) : c.value;
  });
  if(lead&&lead.closed_at) out.closed_at=new Date(lead.closed_at*1000).toISOString();
  if(lead&&lead.created_at) out.created_at=new Date(lead.created_at*1000).toISOString();
  var ct=lead&&lead._embedded&&lead._embedded.contacts&&lead._embedded.contacts[0];
  if(ct){ if(ct.email&&!out.email) out.email=ct.email;
          if(ct.phone&&!out.phone) out.phone=ct.phone; }
  return out;
}
function paraLeads(leads){ return (leads||[]).map(paraLead); }

raiz.MGW_KOMMO={ criar:criar, criarFila:criarFila,
  paraEventos:paraEventos, paraConversa:paraConversa,
  paraLead:paraLead, paraLeads:paraLeads,
  TIPO_EVENTO:TIPO_EVENTO, LIMITE_RPS:LIMITE_RPS,
  LIMITE_PAGINA:LIMITE_PAGINA, GANHO:GANHO, PERDA:PERDA };
})(typeof module!=='undefined'&&module.exports?module.exports:(typeof window!=='undefined'?window:this));
