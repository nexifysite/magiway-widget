/* ═══════════════════════════════════════════════════════════════════
   BANCO DE MÍDIA — fotos, áudios e vídeos para enviar ao cliente
   ───────────────────────────────────────────────────────────────────
   O projeto já tem a aba de Áudios com envio pelo Salesbot. Isto é o
   catálogo que estende o mesmo caminho para foto e vídeo: etiquetas,
   busca e a contagem de uso.

   **Nada sai sozinho.** Cada item tem botão, e o envio é clique do
   vendedor — a mesma regra do resto do app. `preparar()` monta o que o
   envio precisa e devolve; não envia. É de propósito: mídia errada
   mandada para o cliente errado não tem como voltar.

   A busca não é por nome de arquivo. Procura em título, etiquetas e
   descrição, com o mesmo normalizador do resto do projeto — senão
   "cadeirinha" não acha "Cadeirinha infantil" e o vendedor desiste de
   usar o banco na segunda tentativa.
   ═══════════════════════════════════════════════════════════════════ */
(function(raiz){
'use strict';

var TIPOS={
  foto:  { nome:'foto',  ext:['jpg','jpeg','png','webp','heic'], limiteMB:16 },
  video: { nome:'vídeo', ext:['mp4','mov','webm','3gp'],         limiteMB:16 },
  audio: { nome:'áudio', ext:['ogg','opus','mp3','m4a','aac'],   limiteMB:16 },
  doc:   { nome:'documento', ext:['pdf'],                        limiteMB:100 }
};

function dep(){
  if(raiz.MGW_NORM) return raiz.MGW_NORM;
  if(typeof require!=='undefined') return require('./normalizar.js').MGW_NORM;
  return null;
}
function norm(s){
  var N=dep();
  if(N && typeof N.normalizar==='function'){
    try{ return N.normalizar(s); }catch(e){}
  }
  return String(s==null?'':s).toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g,'').trim();
}

function tipoPorExtensao(nomeArquivo){
  var e=String(nomeArquivo||'').split('.').pop().toLowerCase();
  var achou=null;
  Object.keys(TIPOS).forEach(function(t){
    if(TIPOS[t].ext.indexOf(e)>=0) achou=t;
  });
  return achou;
}

/* item: { id, titulo, tipo, arquivo, url, tamanhoBytes, etiquetas:[],
          descricao, criadoEm, usos } */
function validar(item){
  var erros=[];
  if(!item||!item.id) erros.push('sem id');
  if(!item||!item.titulo) erros.push('sem título — o vendedor procura pelo título, não pelo nome do arquivo');
  var tipo=(item&&item.tipo)||tipoPorExtensao(item&&(item.arquivo||item.url));
  if(!tipo) erros.push('tipo não reconhecido pela extensão: diga o tipo à mão');
  else if(!TIPOS[tipo]) erros.push('tipo desconhecido: '+tipo);
  if(tipo && TIPOS[tipo] && item.tamanhoBytes>0){
    var mb=item.tamanhoBytes/1048576;
    if(mb>TIPOS[tipo].limiteMB) erros.push(
      'tem '+mb.toFixed(1)+' MB e o WhatsApp corta '+TIPOS[tipo].nome
      +' acima de '+TIPOS[tipo].limiteMB+' MB — o envio vai falhar sem explicar');
  }
  if(!item||!item.etiquetas||!item.etiquetas.length) erros.push(
    'sem etiqueta: vai existir no banco e não vai ser encontrado');
  return { ok:erros.length===0, tipo:tipo||null, erros:erros };
}

function catalogo(itens){
  var ok=[], recusados=[];
  (itens||[]).forEach(function(i){
    var v=validar(i);
    var x=Object.assign({}, i, { tipo:v.tipo,
      _busca:[norm(i.titulo), norm(i.descricao),
              (i.etiquetas||[]).map(norm).join(' ')].join(' ') });
    if(v.ok) ok.push(x);
    else recusados.push({ item:i, erros:v.erros });
  });
  return { itens:ok, recusados:recusados,
    porTipo:(function(){ var m={}; ok.forEach(function(i){ m[i.tipo]=(m[i.tipo]||0)+1; }); return m; })(),
    etiquetas:(function(){
      var m={}; ok.forEach(function(i){ (i.etiquetas||[]).forEach(function(e){
        m[norm(e)]=(m[norm(e)]||0)+1; }); });
      return Object.keys(m).sort(function(a,b){ return m[b]-m[a]; })
        .map(function(e){ return { etiqueta:e, n:m[e] }; });
    })(),
    aviso: recusados.length? recusados.length+' item(ns) fora do catálogo — '
      +'veja `recusados`. Eles não aparecem na busca, e isso é melhor do que '
      +'aparecer e falhar no envio.' : null };
}

function buscar(cat, termo, opcoes){
  opcoes=opcoes||{};
  var t=norm(termo);
  var itens=cat.itens||[];
  if(opcoes.tipo) itens=itens.filter(function(i){ return i.tipo===opcoes.tipo; });
  if(!t) return itens.slice().sort(porUso);
  var pal=t.split(/\s+/).filter(Boolean);
  return itens.map(function(i){
    var pontos=0;
    pal.forEach(function(p){
      if(i._busca.indexOf(p)>=0) pontos+=2;
      if(norm(i.titulo).indexOf(p)>=0) pontos+=3;
      if((i.etiquetas||[]).some(function(e){ return norm(e).indexOf(p)>=0; })) pontos+=2;
    });
    return { item:i, pontos:pontos };
  }).filter(function(x){ return x.pontos>0; })
    .sort(function(a,b){ return (b.pontos-a.pontos)||porUso(a.item,b.item); })
    .map(function(x){ return x.item; });
}
function porUso(a,b){ return (b.usos||0)-(a.usos||0); }

/* Monta o envio e DEVOLVE. Não envia. */
function preparar(item, cliente){
  var v=validar(item);
  if(!v.ok) return { pronto:false, erros:v.erros,
    aviso:'Item não está em condição de ser enviado.' };
  if(!cliente || !(cliente.telefone||cliente.conversa))
    return { pronto:false, erros:['sem destinatário (telefone ou conversa)'],
      aviso:'Faltou para quem enviar.' };
  return {
    pronto:true,
    envio:{ tipo:v.tipo, url:item.url||null, arquivo:item.arquivo||null,
      legenda:item.legendaPadrao||item.titulo||'',
      para:cliente.telefone||null, conversa:cliente.conversa||null,
      itemId:item.id },
    aviso:'PREPARADO, NÃO ENVIADO. O envio é o clique do vendedor — nada '
         +'neste arquivo manda mensagem.'
  };
}

/* Registra o uso depois do envio confirmado, para a busca subir o que a
   equipe usa de verdade. Quem chama só deve registrar se o envio deu
   certo — senão o ranking premia o que falha. */
function registrarUso(cat, itemId){
  var i=(cat.itens||[]).find(function(x){ return x.id===itemId; });
  if(!i) return false;
  i.usos=(i.usos||0)+1;
  i.ultimoUso=Date.now();
  return true;
}

raiz.MGW_MIDIA={ TIPOS:TIPOS, validar:validar, catalogo:catalogo,
  buscar:buscar, preparar:preparar, registrarUso:registrarUso,
  tipoPorExtensao:tipoPorExtensao };
})(typeof module!=='undefined'&&module.exports?module.exports:(typeof window!=='undefined'?window:this));
