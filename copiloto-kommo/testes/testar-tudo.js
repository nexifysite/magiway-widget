/* Roda todos os testes e devolve o resumo.
   Rode: node testes/testar-tudo.js
   Sai com código 1 se qualquer um falhar — serve para colar num
   atalho do Windows e rodar antes de publicar.                        */
var cp=require('child_process'), path=require('path');

var ARQUIVOS=[
  ['ciclo',          'testar-ciclo.js'],
  ['reconhecimento', 'testar-reconhecimento.js'],
  ['bibliografia',   'testar-bibliografia.js'],
  ['chance de fechar','testar-chance.js'],
  ['quando retomar', 'testar-quando.js']
];

var largura=62;
function linha(c){ return new Array(largura+1).join(c); }

console.log('\n'+linha('═'));
console.log('  COPILOTO MAGIWAY — bateria completa');
console.log(linha('═'));

var totalOk=0, totalErro=0, quebrou=[];

ARQUIVOS.forEach(function(par){
  var nome=par[0], arq=path.join(__dirname,par[1]);
  var r=cp.spawnSync(process.execPath,[arq],{encoding:'utf8'});
  var saida=(r.stdout||'')+(r.stderr||'');
  var m=saida.match(/(\d+) passaram, (\d+) falharam/);
  if(!m){
    quebrou.push(nome);
    console.log('\n  ✗ '+nome+' — não rodou');
    console.log('    '+saida.trim().split('\n').slice(-6).join('\n    '));
    return;
  }
  var ok=+m[1], er=+m[2];
  totalOk+=ok; totalErro+=er;
  var marca=er?'✗':'·';
  console.log('  '+marca+' '+pad(nome,22)+pad(ok+' ok',10)
             +(er?er+' ERRO':''));
  if(er){
    saida.split('\n').filter(function(l){ return /ERRO/.test(l); })
      .forEach(function(l){ console.log('      '+l.trim()); });
  }
});

function pad(s,n){ s=String(s); while(s.length<n) s+=' '; return s; }

console.log(linha('─'));
console.log('  '+totalOk+' asserções passaram, '+totalErro+' falharam'
  +(quebrou.length?', '+quebrou.length+' arquivo(s) não rodaram':''));
console.log(linha('═')+'\n');

if(totalErro||quebrou.length){
  console.log('  Não publique assim. Corrija e rode de novo.\n');
  process.exit(1);
}
console.log('  Tudo de pé. Nenhuma chamada de rede foi feita.\n');
