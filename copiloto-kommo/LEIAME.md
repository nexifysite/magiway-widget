# Copiloto Magiway — 20 módulos para o painel de gestão

Tudo aqui roda **sem chave da Anthropic**. Dezenove dos vinte módulos
são funções puras sobre texto, data e contagem — sem rede, sem banco. O
vigésimo é a conexão com o Kommo, e ele é **o único arquivo do pacote
que toca a rede**: um teste varre a pasta e falha se aparecer um
segundo (e prova que a varredura enxerga, plantando dois arquivos com
rede e conferindo que acha os dois).

```bash
node testes/testar-tudo.js
#   373 asserções passaram, 0 falharam
```

**Para conectar ao Kommo, leia `CONECTAR.md`.** Em uma linha: a conexão
está escrita e testada; falta o seu token no `config.json`, no seu
computador. Não mande o token para ninguém, inclusive para mim.

---

## Os arquivos

**Reconhecimento da fala do cliente**
```
site/normalizar.js         peneira o texto (abreviação, acento, emoji, radical)
site/parecido.js           compara tolerando erro de digitação
site/classificar.js        decide o tipo quando mais de uma regra casa
site/buscar-historico.js   acha o que a equipe já respondeu a pergunta parecida
site/rotular.js            agrupa o não reconhecido para virar regra
site/bibliografia.js       30 módulos, 126 situações, 282 falas — embarcados
site/adaptador.js          lê o seu banco  ← a única peça não testada
```

**Painel de gestão**
```
site/ciclo.js              o mês 13 → 12, cópia do app de vendas
site/equipe.js             a lista é fixa — Janes nunca mais some
site/portao.js             a senha "carioteca"
site/ao-vivo.js            o que cada pessoa está executando agora
site/avaliar-dia.js        nota por pessoa, parcial a cada hora, fecha 23:30
site/kpis.js               métricas por pessoa nos quatro recortes
site/reservas.js           dash de reservas por ciclo, da planilha
site/midia.js              banco de fotos, áudios e vídeos
```

**Decisão apoiada no histórico**
```
site/quando-retomar.js     o intervalo de retomada que o SEU dado mostra
site/chance-de-fechar.js   nota de lead ajustada no SEU histórico
site/venda-ganha.js        rastreio de origem + o que o Kommo não entrega
site/pacote-meta.js        conversão real para o Meta — monta, não envia
```

**Conexão** ← o único arquivo com rede
```
site/kommo-api.js          cliente do Kommo com fila de 6 req/s
config.exemplo.json        o molde do config.json (que fica fora do Git)
```

**Testes**
```
testes/testar-tudo.js             roda a bateria inteira (373 asserções)
testes/testar-ciclo.js            43 · as fronteiras do mês
testes/testar-reconhecimento.js   25
testes/testar-bibliografia.js     22
testes/testar-chance.js           25
testes/testar-quando.js           15
testes/testar-painel.js           86 · equipe, portão, ao vivo, avaliação, KPIs
testes/testar-venda.js            89 · venda ganha, Meta, reservas, mídia
testes/testar-kommo.js            68 · fila, 429, 403, paginação, tradução
testes/medir.js                   mede o reconhecimento antes e depois
testes/corpus.js                  59 falas reais de WhatsApp
```

---

## O que cada um resolve

**ciclo** — o mês da casa vai do **dia 13 ao dia 12**. Uma venda de
05/08 é de **julho**. Está em arquivo separado para o Copiloto não
reescrever essa conta: no app de vendas, o Histórico contava por
calendário e o Dashboard por ciclo, e deu **9 contra 4 para o mesmo
agosto**. Ninguém viu por semanas. Use `cicloDe(data)`, nunca
`getMonth()` solto. Traz os quatro recortes — dia, semana, ciclo e
período livre — todos com o mesmo formato `{ini, fim, dias}`, para a
tela ter um caminho só.

**equipe** — a lista de pessoas é **fixa, não derivada dos dados**. Era
por isso que a Janes sumia: o painel montava a lista com quem apareceu
no período, e quem não mexeu no Kommo não aparecia. O problema é que
**ausência de atividade é a informação mais importante do painel**, e
era justamente ela que desaparecia. Agora quem não tem evento aparece
com zero e com `semDado` escrito. Janes é **Gerência**. Quem aparece nos
dados sem estar cadastrado ganha linha própria, marcada — é assim que
você descobre que entrou gente nova no Kommo.

**portao** — a senha `carioteca`, sem diferenciar maiúscula e com
`trim()`, guardada em `sessionStorage`. ⚠ Não é segurança: a senha está
no arquivo e quem abrir o código lê. É tranca de conveniência.

**ao-vivo** — uma linha por pessoa com o estado derivado dos eventos:
`atendendo`, `lendo`, `parado`, `fora`, **`sem-dado`**. A regra que não
se quebra: **nunca inventar presença**. Quem não tem evento no dia não
está "parado" — está sem dado, e isso aparece escrito. "Parado" é
acusação; "sem dado" é informação. Mensagem *do cliente* não conta como
atividade do vendedor, senão cliente insistente faz parecer que alguém
está trabalhando.

**avaliar-dia** — nota **por pessoa**, não por conversa (o parecer da
conversa é outra coisa e fica em outra tela). Dez critérios, parcial a
cada hora, fecha às 23:30, recupera dia que ficou em aberto, e **nunca
sobrescreve dia fechado**. A decisão que define se a nota é justa:
**critério que não se aplica não conta** — nem a favor, nem contra. Se
ninguém perguntou preço para a Janes hoje, "valor antes do número" sai
da conta, e a tela mostra que entraram 5 de 10 critérios. Sem isso, quem
atende pouco tira nota alta por não ter tido chance de errar.

**kpis** — contagem crua, sem juízo. **Mediana, não média**: nove
respostas em 2 min e uma em 5 h dão média de 31 min, que não descreve
nem as nove nem a uma. A mediana dá 2 min e o "maior espera" dá 5 h —
duas verdades, cada uma no seu campo. Todo resultado traz
`calculadoEm`: número sem carimbo de hora é número em que ninguém
confia.

**reservas** — dash por ciclo a partir da planilha, com as três regras
do app de vendas: a aba FECHAMENTOS é o ciclo corrente, linha arquivada
saiu, e pagamento fragmentado é uma reserva só. `conferir()` compara com
o total do app de vendas e **manda não publicar** se não bater.

**midia** — catálogo de foto, áudio e vídeo com etiqueta e busca.
Recusa o que vai falhar no envio (vídeo acima do limite do WhatsApp,
item sem etiqueta que nunca seria encontrado). `preparar()` monta o
envio e **devolve**; não envia.

**venda-ganha** — colhe campanha, criativo, link do anúncio, UTMs,
tempo até fechar. E a parte que normalmente se esquece: `oQueFalta()`
**conta quantas vendas vieram sem cada campo**, e diz quando o problema
é nome de campo errado neste arquivo em vez de campo ausente no Kommo —
para ninguém pedir ao suporte um campo que já existe.

**pacote-meta** — monta a conversão real para o Meta: SHA-256 à mão (
funciona no navegador e no Node, sem instalar nada), e-mail minúsculo
antes do hash, telefone com código do país, `fbc`/`fbp` sem hash, limite
de 7 dias conferido antes. **Nada é enviado.** Não tem `fetch`, não tem
chave, não tem endpoint — o envio é o clique do vendedor.

**kommo-api** — a conexão de verdade, e a única com rede. O que define
este arquivo é uma trava: o Kommo permite **7 requisições por segundo**
e **bloqueia a conta inteira** (403 em tudo) se o excesso se repetir.
Então toda chamada passa por uma fila a 6 req/s, 429 recua em 2-4-8
segundos, 429 repetido **para tudo** em vez de martelar, e 403 é tratado
como possível bloqueio. Paginação sempre em série. `conferir()`
diagnostica 401/402/403/404 em português e casa os usuários do Kommo com
o `equipe.js`. E `descobrirTiposDeNota()` **lê a sua conta** para saber
qual tipo de nota carrega mensagem, em vez de eu cravar um nome que
poderia não existir — nome errado faria o painel ler zero mensagens sem
erro nenhum aparecer.

**normalizar** — `"qnt fica"`, `"Quanto FICA???"` e `"quanto fica 👍"`
viram a mesma coisa. `cadeirinha` = `cadeira`, `malas` = `mala`. E
mantém separados os que **não podem** juntar: `caro` ≠ `carro`.

**parecido** — `cadeirinnha` casa com `cadeirinha`. Tem lista de pares
que nunca se confundem, e `caro`/`carro` é o primeiro: sem isso, quem
reclama de preço recebe resposta sobre modelo de veículo.

**classificar** — resolve um defeito do motor atual: **"Bom dia! quanto
fica?" é classificado como saudação**, porque a regra de saudação casa
primeiro. Aqui saudação, "sim" e "ok" são moldura: só vencem quando a
mensagem não tem mais nada.

**buscar-historico** — quando o motor não reconhece, procura nas
conversas guardadas as falas mais parecidas e mostra o que a equipe
respondeu. Não é IA: é BM25 sobre o seu próprio texto.

**rotular** — agrupa o não reconhecido por assunto, por volume, com
rascunho de regra. No teste, 22 falas viraram 12 assuntos e **rotular 5
resolveu 68%**.

**bibliografia** — é o que torna o agente independente da chave. 227 mil
caracteres do app de vendas: 30 módulos com 58 referências, 28 grupos de
manual, 126 situações, 282 falas. Para cada tipo reconhecido, devolve o
módulo que sustenta a resposta. Exemplo: `caro` → módulos 3
(*Ancoragem*), 11 (*Vender caro é outro jogo*) e 26 (*Justiça
percebida*), 5 situações, 13 falas.

**quando-retomar** — conta, das retomadas já enviadas, quais tiveram
resposta. **Recusa recomendar com pouco dado**, e recusa quando a
diferença é do tamanho que o acaso produz.

**chance-de-fechar** — nota de lead por Naive Bayes ajustado nas suas
negociações encerradas. Diz **por quê**, **mede em dado que não viu**
antes de ser usada, e **recusa** se não ganhar do chute.

---

## O que medi, e o que não medi

**Medi** — reconhecimento: 59 falas de WhatsApp com abreviação, erro de
digitação e emoji, contra regras escritas só na forma canônica,
**66% → 73%**.

**Medi** — chance de fechar: 400 negociações sintéticas com padrão
plantado, **AUC 0,729** em dado separado (moeda é 0,500), faixas
calibradas de 8,3% a 45,8%. Com dado sorteado, **recusou** (AUC 0,462).

**Medi** — SHA-256: cinco vetores do padrão, mais comparação com o
`crypto` do Node em texto acentuado e de vários blocos.

**Medi** — a fila do Kommo: com `fetch` falso e relógio injetado, seis
chamadas saem espaçadas de 167 ms cada (1 segundo no total, nenhuma
rajada); três 429 seguidos fazem o cliente **parar** em vez de insistir,
e a chamada seguinte é recusada sem tocar a rede.

**Não medi** — nada no *seu* dado, em nenhum dos módulos. Meu corpus tem
59 falas e eu escrevi as duas pontas; as negociações eram sintéticas; os
eventos do painel são de teste. **É indicativo, não é promessa.**

**Como medir de verdade**: `medir.js` com as falas reais e as regras do
seu motor; `MGW_CHANCE.avaliar()` com as suas encerradas;
`MGW_RESERVAS.conferir()` contra o total do app de vendas;
`MGW_VENDA.oQueFalta()` com as vendas ganhas de verdade. Aí os números
são seus.

---

## Oito coisas que eu achei errando, e deixo como aviso

**1. Quem não trabalhou tirava nota 10.** Na avaliação do dia, dois
critérios eram incondicionais: "nenhum cliente sem resposta" e "regra
das 12 h". Com zero conversas os dois passavam — zero clientes sem
resposta é verdade quando não há clientes — e a pessoa tirava **10,0**
por não ter atendido ninguém. O teste pegou. Regra que ficou:
**nenhum critério pode ser verdadeiro por ausência de dado.**

**2. `$1,234.56` virava 1,23.** O leitor de dinheiro dizia "se tem
vírgula, a vírgula é o decimal". Faturamento mil vezes menor, e a
conferência contra o app de vendas não pegaria se os dois lados lessem
errado igual. Agora decide pelo separador que vem **por último**.

**3. Margem fixa não diz que um número é significativo.** O
`quando-retomar` exigia 5 pontos acima da média. Com dado **sorteado**,
recomendou "esperar 2 a 4 dias: 45,5%, 10,8 pontos acima" com 44 casos.
Não havia padrão: com 44 casos a 35%, o erro padrão é 7,2 pontos — e
**escolher o melhor de seis faixas** encontra algo "acima da média"
quase sempre. Agora a margem é 2,5 erros-padrão, calculados.

**4. A nota culpava uma pessoa por barulho.** O `chance-de-fechar`
citava **"vendedor=ana"** como motivo de perda em teste com dado
sorteado. Os pesos continuam todos na conta, mas só vai para a tela o
sinal que se afasta da média mais do que o acaso explicaria.

**5. A ponte da bibliografia citava o módulo errado.** Foi escrita
contra uma numeração de rascunho: objeção de preço apontava para "Os
sete passos, montados" em vez de "Vender caro é outro jogo". O agente
citava fundamento errado e nada reclamava. Onze tipos corrigidos, e o
teste agora confere que o título do módulo combina com o motivo.

**6. Não expanda abreviação que é palavra de verdade.** Eu pus `dia →
diaria`. "pro dia 10" virava "para diaria 10" e corrompia a comparação
**sem erro nenhum aparecer**. A pergunta antes de acrescentar: isto
existe no dicionário? Se existir, fica fora.

**7. Resultado errado é pior que resultado nenhum.** "qual a cor do
carro" casava com a resposta sobre franquia do seguro, só porque as duas
têm "qual", "o" e "do". Pontuação feita de palavra comum é
coincidência, não semelhança — e o vendedor pode enviar.

**8. O teste que vigia a rede não enxergava a rede.** Ele procurava
`\bfetch(` — que **não casa com `_fetch(`**, o nome que o próprio
cliente do Kommo usa. Ele dizia "nenhum arquivo usa rede" com o cliente
HTTP na frente dele. Corrigido, passou a acusar o `pacote-meta.js`, que
só tem a palavra `fetch` dentro de um comentário dizendo que não usa
fetch. Agora tira comentário e string antes de procurar, procura o
mecanismo por nome, e **prova que enxerga**: planta dois arquivos com
rede (um com sublinhado, um com `require('node:https')`) e confere que
acha os dois. Guarda sem prova de que o guarda vê não guarda nada.
