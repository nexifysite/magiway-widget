/* Mede o reconhecimento: quantas falas do corpus caem num tipo.
   Compara o motor EXATO (como está hoje) com o motor TOLERANTE
   (normalizar + parecido). O número que interessa é a diferença. */
const corpus=require('./corpus.js');
const N=require('../site/normalizar.js').MGW_NORM;
const P=require('../site/parecido.js').MGW_PARECIDO;

/* As expressões que o motor procura para cada tipo. É a mesma ideia das
   regras que já existem no projeto — aqui reescritas para o teste. */
/* ── as regras, SÓ na forma canônica ──────────────────────────────
   O teste anterior era viciado: eu tinha escrito as regras olhando o
   corpus, então a comparação exata acertava 92% — número que não existe
   na operação real, onde ela acerta 29%. Aqui as regras têm só a forma
   limpa que uma pessoa escreveria ao cadastrar, e o corpus tem o jeito
   torto que o cliente escreve. É assim que a distância aparece. */
const REGRAS={
 preco:['quanto fica','quanto custa','qual o valor','orcamento'],
 caro:['esta caro'],
 desconto:['tem desconto'],
 pensar:['vou pensar'],
 falar_com:['falar com meu marido','falar com minha esposa'],
 concorrente:['mais barato em outro lugar','outra locadora'],
 medo:['sao confiaveis','golpe','nunca ouvi falar'],
 sem_passagem:['nao comprei a passagem'],
 fechar:['quero fechar'],
 pagamento:['como faco o pagamento','aceita cartao','parcela em quantas vezes'],
 voo:['voo atrasar'],
 cadeirinha:['cadeirinha'],
 seguro:['o seguro cobre','franquia'],
 pedagio:['pedagio','sunpass'],
 sim:['sim','ok'],
 saudacao:['bom dia','boa tarde','tudo bem'],
 modelo:['qual o modelo','automatico'],
 malas:['quantas malas','malas grandes'],
 devolucao:['onde devolvo'],
 retirada:['onde retiro'],
 cambio:['qual o cambio'],
 combustivel:['tanque cheio'],
 km:['limite de km'],
 documentos:['carteira internacional'],
 cancelamento:['posso cancelar'],
 fora_florida:['fora da florida','georgia']
};

const C=require('../site/classificar.js').MGW_CLASSIFICAR;
function classificarExato(fala){
  const t=String(fala||'').toLowerCase();
  for(const tipo in REGRAS)
    for(const exp of REGRAS[tipo]) if(t.includes(exp)) return tipo;
  return null;
}
function classificarTolerante(fala){
  for(const tipo in REGRAS)
    for(const exp of REGRAS[tipo]) if(P.contemExpressao(fala,exp)) return tipo;
  return null;
}
function classificarCompleto(fala){
  const r=C.classificar(fala,REGRAS);
  return r?r.tipo:null;
}

function medir(fn,nome){
  let acertos=0, naoReconheceu=0, errou=[];
  corpus.forEach(([fala,esperado])=>{
    const r=fn(fala);
    if(r===null) naoReconheceu++;
    else if(r===esperado) acertos++;
    else errou.push([fala,esperado,r]);
  });
  const total=corpus.length;
  console.log(nome);
  console.log('  reconheceu  : '+(total-naoReconheceu)+'/'+total+'  ('+Math.round((total-naoReconheceu)/total*100)+'%)');
  console.log('  acertou     : '+acertos+'/'+total+'  ('+Math.round(acertos/total*100)+'%)');
  console.log('  classificou errado: '+errou.length);
  errou.slice(0,5).forEach(([f,e,r])=>console.log('     "'+f+'"  esperado '+e+'  veio '+r));
  return {rec:(total-naoReconheceu)/total, ac:acertos/total};
}

console.log('Corpus: '+corpus.length+' falas reais de WhatsApp\n');
const a=medir(classificarExato,    'ANTES  — comparacao exata (como esta hoje)');
console.log();
const b=medir(classificarTolerante,'MEIO   — normalizar + parecido');
console.log();
const c=medir(classificarCompleto, 'DEPOIS — + prioridade (fraco so ganha sozinho)');
console.log('\n'+'─'.repeat(56));
console.log('reconhecimento: '+Math.round(a.rec*100)+'%  ->  '+Math.round(c.rec*100)+'%'
  +'   (+'+Math.round((c.rec-a.rec)*100)+' pontos)');
console.log('acerto do tipo: '+Math.round(a.ac*100)+'%  ->  '+Math.round(c.ac*100)+'%'
  +'   (+'+Math.round((c.ac-a.ac)*100)+' pontos)');
