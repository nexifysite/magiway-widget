/* Suíte dos módulos de reconhecimento. Roda sem rede, sem chave, sem
   banco: só funções sobre texto.      node testes/testar-reconhecimento.js */
const N=require('../site/normalizar.js').MGW_NORM;
const P=require('../site/parecido.js').MGW_PARECIDO;
const C=require('../site/classificar.js').MGW_CLASSIFICAR;
const B=require('../site/buscar-historico.js').MGW_BUSCAR;
const R=require('../site/rotular.js').MGW_ROTULAR;
const A=require('../site/adaptador.js').MGW_ADAPTADOR;

let ok=0, falhou=0;
function t(nome, cond){ if(cond){ok++;} else {falhou++; console.log('  FALHA: '+nome);} }

/* normalizar */
t('abreviação vira palavra', N.normalizar('qnt fica')==='quanto fica');
t('acento e caixa somem',    N.normalizar('Quanto FICA???')==='quanto fica');
t('vogal esticada encurta',  N.normalizar('siiiim')==='sim');
t('número vira marcador',    N.normalizarSemNumero('somos 5')==='somos #');
t('palavra real não expande',N.normalizar('pro dia 10')==='para dia 10');

/* radical */
t('diminutivo junta',   N.radical('cadeirinha')===N.radical('cadeira'));
t('plural junta',       N.radical('malas')===N.radical('mala'));
t('caro ≠ carro',       N.radical('caro')!==N.radical('carro'));
t('dia ≠ diaria',       N.radical('dia')!==N.radical('diaria'));

/* parecido */
t('erro de digitação',  P.perto('cadeirinha','cadeirinnha'));
t('caro nunca é carro', !P.perto('caro','carro'));
t('expressão com erro', P.contemExpressao('entao quanto custaa isso','quanto custa'));
t('não casa à toa',     !P.contemExpressao('qual a cor','quanto custa'));

/* classificar — prioridade */
const REG={saudacao:['bom dia','boa tarde'],sim:['ok','sim'],
           preco:['quanto fica','quanto custa'],desconto:['desconto'],
           pagamento:['parcela','parcela em quantas vezes']};
t('forte vence fraco',  C.classificar('Bom dia! quanto fica?',REG).tipo==='preco');
t('fraco ganha sozinho',C.classificar('Bom dia!',REG).tipo==='saudacao');
t('expressão mais longa',C.classificar('parcela em quantas vezes?',REG).porque==='parcela em quantas vezes');
t('traz a prova',       !!C.classificar('quanto custa?',REG).porque);

/* buscar */
const hist=[
 {pergunta:'o pedagio esta incluso no valor?',resposta:'Pedágios por nossa conta na Flórida.'},
 {pergunta:'tem cadeirinha para crianca?',resposta:'Tem sim, e é cortesia.'},
 {pergunta:'preciso pagar caucao?',resposta:'Zero caução.'},
 {pergunta:'quantas malas cabem na minivan?',resposta:'Na de 7 cabem 4 grandes.'}];
const idx=B.indexar(hist);
t('acha por sinônimo de forma', B.sugerir(idx,'minha filha precisa de cadeira').tem);
t('acha com plural trocado',    B.sugerir(idx,'cabe quantas mala?').tem);
t('não inventa resultado',     !B.sugerir(idx,'qual a cor do carro').tem);
t('não casa por palavra comum',!B.sugerir(idx,'qual o horario').tem);

/* rotular */
const nr=['qual o preco','me informa o preco','queria saber o preco',
          'tem gps?','o carro tem gps','posso retirar de madrugada','chego de madrugada'];
const rot=R.paraRotular(nr);
t('agrupa por assunto', rot.grupos.length>0 && rot.grupos[0].n>=3);
t('cobertura calculada', rot.cobertura>0);

/* adaptador */
const banco={conversas:[{id:1,mensagens:[
  {direcao:'entrada',texto:'tem cadeirinha?'},
  {direcao:'saida',texto:'Tem sim, e é cortesia para vocês.'}]}]};
t('adaptador lê o banco', A.conferir(banco).paresEncontrados===1);
t('descarta resposta com preço', !A.respostaServe('Fica R$ 4.800'));

console.log('\n'+ok+' passaram, '+falhou+' falharam');
process.exit(falhou?1:0);
