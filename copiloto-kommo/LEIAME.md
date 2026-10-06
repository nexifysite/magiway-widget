# Copiloto Magiway — 10 módulos que funcionam sem crédito de API

Tudo aqui roda **sem chave da Anthropic, sem rede e sem banco**. São
funções sobre texto, data e contagem. Nenhum arquivo faz uma chamada
para fora: dá para conferir procurando por `fetch` e `http` — não tem.

```bash
node testes/testar-tudo.js
#   130 asserções passaram, 0 falharam
```

---

## Os arquivos

```
site/ciclo.js              o mês 13 → 12, cópia do app de vendas
site/normalizar.js         peneira o texto (abreviação, acento, emoji, radical)
site/parecido.js           compara tolerando erro de digitação
site/classificar.js        decide o tipo quando mais de uma regra casa
site/buscar-historico.js   acha o que a equipe já respondeu a pergunta parecida
site/rotular.js            agrupa o não reconhecido para virar regra
site/bibliografia.js       30 módulos, 126 situações, 282 falas — embarcados
site/quando-retomar.js     o intervalo de retomada que o SEU dado mostra
site/chance-de-fechar.js   nota de lead ajustada no SEU histórico
site/adaptador.js          lê o seu banco  ← a única peça não testada

testes/testar-tudo.js             roda a bateria inteira
testes/testar-ciclo.js            43 asserções (as fronteiras do mês)
testes/testar-reconhecimento.js   25 asserções
testes/testar-bibliografia.js     22 asserções
testes/testar-chance.js           25 asserções
testes/testar-quando.js           15 asserções
testes/medir.js                   mede o reconhecimento antes e depois
testes/corpus.js                  59 falas reais de WhatsApp
```

---

## O que cada um resolve

**ciclo** — o mês da casa vai do **dia 13 ao dia 12** do mês seguinte.
Uma venda de 05/08 é de **julho**. Está aqui como arquivo separado para
o Copiloto não reescrever essa conta: no app de vendas, o Histórico
contava por calendário e o Dashboard por ciclo, e deu **9 contra 4 para
o mesmo agosto**. Ninguém viu por semanas. Use `cicloDe(data)`, nunca
`getMonth()` solto. Traz também os outros três recortes que o painel
pede — dia, semana e período livre — todos com o mesmo formato
`{ini, fim, dias}`, para a tela ter um caminho só.

**normalizar** — `"qnt fica"`, `"Quanto FICA???"` e `"quanto fica 👍"`
viram a mesma coisa. Inclui radical: `cadeirinha` = `cadeira`, `malas` =
`mala`. E mantém separados os que **não podem** juntar: `caro` ≠ `carro`,
`dia` ≠ `diaria`.

**parecido** — `cadeirinnha` casa com `cadeirinha`. Tem uma lista de
pares que nunca se confundem, e `caro`/`carro` é o primeiro dela: sem
isso, o cliente que reclama de preço recebe resposta sobre modelo de
veículo.

**classificar** — resolve um defeito que o motor tem hoje: **"Bom dia!
quanto fica?" é classificado como saudação**, porque a regra de saudação
casa primeiro e vence por ordem. Aqui saudação, "sim" e "ok" são
moldura: só vencem quando a mensagem não tem mais nada.

**buscar-historico** — é o que cobre os 71% no mesmo dia. Quando o motor
não reconhece, procura nas conversas guardadas as falas mais parecidas e
mostra o que a equipe respondeu. Não é IA: é BM25 sobre o seu texto.

**rotular** — fecha o laço. Agrupa o não reconhecido por assunto e
devolve a lista por volume, com rascunho de regra. No teste, 22 falas
viraram 12 assuntos e **rotular 5 resolveu 68%**.

**bibliografia** — é o que torna o agente independente da chave. 227 mil
caracteres copiados do app de vendas: 30 módulos de curso com 58
referências acadêmicas, 28 grupos de manual com 126 situações e 282
falas aprovadas. Para cada tipo de fala reconhecido, devolve o módulo
que sustenta a resposta, a situação equivalente e as falas prontas.
Exemplo real: tipo `caro` → módulos 3 (*Ancoragem*), 11 (*Vender caro é
outro jogo*) e 26 (*Justiça percebida*), 5 situações, 13 falas.

**quando-retomar** — a regra das 12 h é palpite razoável; a resposta
verdadeira está no banco. Conta, das retomadas já enviadas, quais
tiveram resposta — por intervalo, hora do dia e dia da semana. **Recusa
recomendar com pouco dado**, e recusa quando a diferença é do tamanho
que o acaso produz.

**chance-de-fechar** — nota de lead por Naive Bayes ajustado nas suas
negociações encerradas. Diz **por quê** (quais sinais puxaram e quantos
casos sustentam cada um), **mede em dado que não viu** antes de ser
usada, e **recusa** se não ganhar do chute. Aponta sinal suspeito de
vazamento.

**adaptador** — lê o seu `banco.json` e alimenta os outros.

---

## O que medi, e o que não medi

**Medi** — reconhecimento: num corpus de 59 falas de WhatsApp com
abreviação, erro de digitação e emoji, contra regras escritas só na
forma canônica, **66% → 73%**.

**Medi** — chance de fechar: com 400 negociações sintéticas e um padrão
plantado, **AUC 0,729** em dado separado (moeda é 0,500), e as faixas
saíram calibradas: 8,3% na mais baixa, 45,8% na mais alta. Com dado
sorteado, **recusou** (AUC 0,462).

**Não medi** — o ganho no *seu* histórico, em nenhum dos dois. O seu
número de reconhecimento é 29%, e ele é baixo porque as regras foram
escritas por uma pessoa e as falas vêm do mundo. Meu corpus tem 59 falas
e eu escrevi as duas pontas: é indicativo, não é promessa.

**Como medir de verdade** quando plugar: `medir.js` trocando o corpus
pelas falas reais e as REGRAS pelas do seu motor; e
`MGW_CHANCE.avaliar()` com as suas negociações encerradas. Aí o número
é seu.

---

## Quatro coisas que eu achei errando, e deixo como aviso

**Não expanda abreviação que é palavra de verdade.** Eu pus `dia →
diaria`, `seg → seguro` e `ai → ai`. "pro dia 10" virava "para diaria
10" e corrompia a comparação **sem erro nenhum aparecer**. A pergunta
antes de acrescentar: isto existe no dicionário? Se existir, fica fora.

**Semelhança de letra não serve para agrupar assunto.** Os trigramas
punem diferença de tamanho: "tem cadeirinha?" contra "vcs tem
cadeirinnha pra bebe" dá 0,41, e são a mesma pergunta. Para assunto,
compare **palavras de conteúdo**.

**Resultado errado é pior que resultado nenhum.** "qual a cor do carro"
casava com a resposta sobre franquia do seguro, só porque as duas têm
"qual", "o" e "do". Pontuação feita de palavra comum é coincidência, não
semelhança — e o vendedor pode enviar.

**Margem fixa não serve para dizer que um número é significativo.** A
primeira versão do `quando-retomar` exigia 5 pontos acima da média.
Testada com dado **sorteado**, ela recomendou "esperar 2 a 4 dias:
45,5%, 10,8 pontos acima" com 44 casos — não havia padrão nenhum, e a
equipe ia mudar a rotina por causa de ruído. Dois erros: 5 pontos fixos
ignora o tamanho da amostra (com 44 casos a 35%, o erro padrão é 7,2
pontos), e **escolher o melhor de seis faixas** encontra algo "acima da
média" quase sempre. Agora a margem é calculada e vale 2,5 erros-padrão.
A mesma régua entrou no `chance-de-fechar`, onde o defeito aparecia
assim: um teste com dado sorteado citava **"vendedor=ana"** como motivo
de perda. Dizer isso de uma pessoa por causa de barulho é pior do que
não explicar nada.
