/* ═══════════════════════════════════════════════════════════════════
   PORTÃO — a senha que libera o painel
   ───────────────────────────────────────────────────────────────────
   ⚠ ISTO NÃO É SEGURANÇA. É uma tranca de conveniência: a senha está
   escrita neste arquivo e qualquer pessoa que abra o código a lê. Serve
   para o painel não ficar aberto na tela quando alguém passa pela mesa.
   Se precisar de segurança de verdade, a verificação tem que ser no
   servidor, e aí é outro trabalho.

   Duas decisões que vêm de erro já cometido no app de vendas:

   1. Compara SEM diferenciar maiúscula e com trim(). O teclado do
      celular capitaliza a primeira letra sozinho. No app de vendas uma
      tela aceitava "Carioteca" e outra recusava, e ninguém entendia por
      quê — era a mesma senha digitada no mesmo teclado.

   2. Guarda em sessionStorage, não em localStorage. Fechou o navegador,
      pede de novo. localStorage deixaria o painel destrancado para
      sempre naquele computador, o que anula a tranca.
   ═══════════════════════════════════════════════════════════════════ */
(function(raiz){
'use strict';

var SENHA='carioteca';
var CHAVE='mgw_painel_liberado';

function limpa(s){ return String(s==null?'':s).trim().toLowerCase(); }

function conferir(digitada){ return limpa(digitada)===limpa(SENHA); }

/* O armazenamento pode não existir: janela anônima, cookie bloqueado,
   iframe sem permissão. Tudo aqui é embrulhado — se o sessionStorage
   não responde, o painel pede a senha a cada carga em vez de quebrar. */
function guardar(){
  try{ sessionStorage.setItem(CHAVE,'1'); return true; }catch(e){ return false; }
}
function liberado(){
  try{ return sessionStorage.getItem(CHAVE)==='1'; }catch(e){ return false; }
}
function trancar(){
  try{ sessionStorage.removeItem(CHAVE); }catch(e){}
}

/* Tentar: devolve o que a tela precisa dizer, inclusive quando a senha
   está certa mas a liberação não pôde ser guardada — senão o painel
   abriria e fecharia sozinho na navegação seguinte, sem explicação. */
function tentar(digitada){
  if(!conferir(digitada))
    return { ok:false, motivo:'senha', aviso:'Senha incorreta.' };
  var g=guardar();
  return { ok:true, persistiu:g, motivo:null,
    aviso: g?null:'Senha aceita, mas este navegador não deixa guardar a '
          +'liberação (janela anônima ou cookies bloqueados). O painel vai '
          +'pedir a senha de novo a cada página.' };
}

/* Protege uma função: ela só roda com o painel liberado. Use nos
   carregamentos de dados, não só na troca de tela — tranca que só
   esconde a tela deixa a requisição acontecer atrás dela. */
function protegido(fn, senaoLiberado){
  return function(){
    if(!liberado()){
      if(typeof senaoLiberado==='function') return senaoLiberado();
      return undefined;
    }
    return fn.apply(this, arguments);
  };
}

raiz.MGW_PORTAO={ conferir:conferir, tentar:tentar, liberado:liberado,
  trancar:trancar, protegido:protegido, CHAVE:CHAVE };
})(typeof module!=='undefined'&&module.exports?module.exports:(typeof window!=='undefined'?window:this));
