# Painel de Gestão do Copiloto — ordem de construção

Especificação do que o Luciano pediu em 06/10/2026, destrinchada em itens
verificáveis. Serve para qualquer Claude (ou pessoa) continuar o trabalho sem
reler a conversa, e para conferir no fim se ficou tudo de pé.

**ESTADO EM 06/10/2026 (fim do dia):** a LÓGICA de todos os dez itens está
escrita e testada — 373 asserções, 20 módulos em `site/`. O que falta é só a
COSTURA com o código do projeto (o `servidor.js`, o painel, o leitor de
planilha) e, para o Kommo, o token no `config.json`. Cada item abaixo diz, no
fim, o que está pronto e o que depende do projeto.

**Projeto:** `MAGIWAY-AGENTE-KOMMO` (Copiloto do Kommo), não o app de vendas.
**Fonte:** o pedido dele + o `README.md` do projeto (versão de 05/10/2026).

---

## 0 · Antes de começar: duas coisas a confirmar com ele

**a) O ciclo do mês está invertido no pedido.** Ele escreveu *"mês de 12 de um
mês a 13 do outro"*. Em todo o resto da operação — app de vendas, comissão,
meta, Rentabilidade, Evolução — o ciclo é **do dia 13 ao dia 12 do mês
seguinte**, e isso foi confirmado por ele em 09/09/2026 com todas as letras.
Construa com **13 → 12** e confirme numa frase. Uma venda de 05/08 pertence ao
ciclo de **julho**.
→ RESOLVIDO: `site/ciclo.js`, cópia da função do app de vendas, 43 asserções
nas fronteiras (12/08 → julho, 13/08 → agosto, 05/01 → dezembro).

**b) O que o painel do Kommo não tem.** Ele pediu "se faltar algo no painel do
cliente avise para ajustarmos". Isso só dá para responder depois de ler os
campos reais da conta. O item 7 abaixo termina com essa lista.

---

## 1 · Portão de senha
→ PRONTO: `site/portao.js`. Senha `carioteca`, sem diferenciar maiúscula,
com `trim()`, em `sessionStorage`. `protegido()` para trancar o carregamento
de dados, não só a tela. Depende do projeto: a tela de senha.


- O painel inteiro só abre depois da senha **`carioteca`**.
- Comparar **sem diferenciar maiúscula** e com `trim()`. No app de vendas isso
  já mordeu: uma tela aceitava "Carioteca" e a outra recusava, e o teclado do
  celular capitaliza a primeira letra sozinho.
- Guardar a liberação em `sessionStorage`, não em `localStorage`: fechou o
  navegador, pede de novo.
- Isto é uma tranca de conveniência, não segurança: o código é legível por quem
  abrir o arquivo. Dizer isso num comentário, para ninguém confiar demais.

## 2 · Bibliografia própria, embarcada — independência da chave
→ PRONTO: `site/bibliografia.js`, 243 KB. Conferido: 30 módulos, 58
referências, 28 grupos, 126 situações, 282 falas, 14 tipos com fundamento.
A ponte tipo→módulo foi corrigida (estava apontando para módulo errado) e o
teste agora confere que o título do módulo combina com o motivo citado.


O objetivo dele: **o agente ficar mais inteligente sem depender da chave da
Anthropic**. O README já diz que o app funciona sem a chave; o que falta é o
agente ter repertório próprio.

- Arquivo novo: `site/bibliografia.js`, no mesmo molde de `site/conhecimento.js`.
- Conteúdo: os 30 módulos do curso e as 126 situações do manual que já existem
  no app de vendas (`index.html`, blocos `MGW_CURSO_A/B/C/D` e `MGW_MANUAL`,
  `_EXTRA`, `_C`, `_D`). **Copiar, não reescrever** — são 141 mil e 77 mil
  caracteres já revisados, com 58 referências acadêmicas.
- O motor por regra passa a consultar essa base: quando reconhece uma fala do
  cliente, traz junto o princípio e o módulo que a sustentam.
- Teste de aceite: desligar a chave da Anthropic e verificar que toda fala
  reconhecida continua recebendo resposta **com fundamento citado**.

## 3 · Janes de volta
→ PRONTO: `site/equipe.js`. A lista é fixa, não derivada dos dados — era essa
a causa do sumiço. Quem não tem evento aparece com `semDado:true`. Quem está
no Kommo sem cadastro ganha linha própria marcada.


- Janes (`janecossta28@gmail.com`, **Gerência**) **fixa no painel
  individual**, mesmo sem nenhuma atividade no Kommo no período.
  ⚠ O cargo foi corrigido por ele em 06/10/2026: antes constava "Gestora
  Operacional" nos dois projetos. No app de vendas o rótulo já foi trocado
  (`MGW_CARGOS_CORRETOS`, que força o cadastro existente e a nuvem). O
  **nível de acesso** continua `usuario` de propósito — mudar permissão é
  decisão dele, não consequência de ajuste de título.
- Motivo: ausência de atividade é informação, e some quando a linha some.
- Mesma regra para qualquer pessoa cadastrada: a lista de colaboradores é
  fixa, não derivada do que apareceu nos dados.

## 4 · Monitoramento ao vivo — o que cada um está executando agora
→ PRONTO: `site/ao-vivo.js`, a derivação do estado (`atendendo`, `lendo`,
`parado`, `fora`, `sem-dado`) e a fila de quem espera resposta. Mensagem do
cliente não conta como atividade do vendedor. Depende do projeto: o SSE de
`/ao-vivo` recebendo webhook do Kommo. ⚠ NÃO faça polling — ver CONECTAR.md.


É o item que ele mais enfatizou ("foque no monitoramento das atividades de cada
colaborador").

- Uma linha por colaborador, atualizada **em tempo real** (o README já tem
  `/ao-vivo`, Server-Sent Events — usar isso, não polling).
- Por pessoa: cliente em que está, há quanto tempo sem mandar mensagem, quantas
  conversas aguardando resposta na fila dela, última ação e o horário.
- Estado derivado, não declarado: `atendendo` (mandou mensagem < 5 min),
  `lendo` (abriu conversa, não respondeu), `parado` (> 30 min sem ação),
  `fora` (sem nenhuma ação no dia).
- **Nunca inventar presença.** Quem não tem evento não está "parado", está
  "sem dado" — e isso aparece escrito.

## 5 · Avaliação diária automática
→ PRONTO: `site/avaliar-dia.js`. Dez critérios, parcial a cada hora, fecha às
23:30, `diasEmAberto()` para recuperar, e dia fechado nunca é sobrescrito.
A decisão central: critério que não se aplica sai da conta. Um defeito achado
pelo teste: com zero conversas a pessoa tirava NOTA 10 — nenhum critério pode
ser verdadeiro por ausência de dado. Depende do projeto: onde guardar o estado.


- Fechamento às **23:30**. Se o app estava fechado, recuperar na próxima
  abertura (não pular o dia).
- Atualização **parcial a cada hora** — assim a nota do dia não nasce só no fim.
- A nota é **por pessoa**, não por conversa. Isto é novo: o parecer que já
  existe na Biblioteca é da conversa, e mais de um atendente pode ter falado
  nela. Separar os dois claramente na tela, senão viram o mesmo número com
  dois nomes.
- Régua: reaproveitar a da Biblioteca (primeira resposta em 10 min, maior
  espera, cliente sem resposta, diagnóstico antes do preço, valor antes do
  número, objeção sem desconto de primeira, contrato antes do pagamento, regra
  das 12 h, retomada com motivo, último toque com próximo passo).
- Guardar o histórico: a avaliação de ontem não pode ser sobrescrita pela de
  hoje.

## 6 · KPIs — por pessoa, dia, semana, período, ciclo
→ PRONTO: `site/kpis.js`. Os quatro recortes vêm de `ciclo.js` com o mesmo
formato. Mediana (e a média ao lado, para comparação), `calculadoEm` em toda
resposta, `precisaRecalcular()` de hora em hora e `porHora()` para o dia
quebrado por hora, com as horas de amostra pequena marcadas.


- Recortes: dia · semana · **ciclo 13→12** · período livre (duas datas).
- Tudo ajustável na tela, e o recorte escolhido fica guardado no navegador.
- Mínimo por pessoa: conversas atendidas, mensagens enviadas, tempo até a
  primeira resposta (mediana, não média — média esconde o caso ruim), maior
  espera, cotações enviadas, conversões, ticket médio, retomadas feitas,
  clientes sem resposta.
- **Métricas recalculadas a cada 1 hora**; a tela diz a hora do último cálculo.
  Número sem carimbo de hora é número em que ninguém confia.

## 7 · Vendas ganhas — a aba de rastreio
→ PRONTO: `site/venda-ganha.js`. Colhe campanha, criativo, link do anúncio,
UTMs e tempo até fechar. A lista do que falta é `oQueFalta()`, que CONTA no
dado real em vez de eu palpitar — e distingue campo ausente de nome de campo
errado. Ranking por link com mínimo de 3 vendas para ser chamado de ranking.


Para cada venda ganha, colher do Kommo o máximo:
campanha · criativo · **link do anúncio** · data de entrada do lead · origem ·
utm (source, medium, campaign, content, term) · primeiro contato · tempo até o
fechamento · vendedor · valor · categoria · datas da viagem.

- Ranking das **melhores campanhas pelos próprios links dos anúncios**.
- **Ao final, listar o que o Kommo NÃO entrega** — ele pediu isso
  explicitamente ("se faltar algo no painel do cliente avise para
  ajustarmos"). Essa lista é entregável, não rodapé.

## 8 · Dash exclusivo de venda ganha → devolver ao Meta
→ PRONTO: `site/pacote-meta.js`. SHA-256 escrito à mão (5 vetores do padrão
conferidos), e-mail minúsculo antes do hash, telefone com código do país,
`fbc`/`fbp` sem hash, limite de 7 dias conferido antes. **Nada é enviado** —
não há `fetch` no arquivo, e um teste garante isso. Depende do projeto: o
botão de envio.


- Separado do item 7: aquele é rastreio, este é alimentação.
- Montar o conjunto que o Meta aceita de volta (evento, valor, moeda, data,
  identificadores disponíveis) para alimentar o algoritmo com conversão real.
- **Não enviar nada sozinho.** Preparar o pacote e deixar o envio no clique —
  mesma regra do resto do app: nada sai sem o vendedor mandar.

## 9 · Reservas por mês, da planilha de fechamento
→ PRONTO: `site/reservas.js`. As três regras do app de vendas (aba
FECHAMENTOS é o ciclo corrente, arquivada saiu, pagamento fragmentado é uma
reserva só) e `conferir()`, que compara com o total do app de vendas e manda
NÃO PUBLICAR se divergir. Um defeito achado pelo teste: `$1,234.56` era lido
como 1,23. Depende do projeto: o leitor da aba ⚙️ DADOS.


- O README já descreve a leitura da aba ⚙️ DADOS (`lib/tabela-planilha.js`).
  Estender para ler as reservas, não só a tabela de preços.
- Dash de reservas por ciclo, batendo com o app de vendas.
- **Conferir contra o app principal antes de dar como pronto.** Dois painéis
  com totais diferentes para o mesmo mês é pior que um painel a menos.

## 10 · Banco de mídia para o cliente
→ PRONTO: `site/midia.js`. Catálogo com etiqueta e busca sem acento, recusa
o que falharia no envio (acima do limite do WhatsApp, sem etiqueta),
`preparar()` monta e devolve. Depende do projeto: upload e Salesbot.


- Fotos, áudios e vídeos, com etiquetas e busca.
- Áudio já existe (aba Áudios, envio por Salesbot). Estender para foto e vídeo
  seguindo o mesmo caminho já documentado.
- Nada sai sozinho: botão por item, clique do vendedor.

---

## Como saber que acabou

- [ ] Senha `carioteca` tranca e destranca, aceitando maiúscula e espaço
- [ ] Janes aparece no painel individual num dia sem atividade nenhuma
- [ ] Monitoramento mostra quem está em quê, e "sem dado" quando não há evento
- [ ] Avaliação do dia nasce às 23:30 e se recupera se o app estava fechado
- [ ] Avaliação parcial muda de valor ao longo do dia
- [ ] Nota por pessoa e parecer por conversa não se confundem na tela
- [ ] Os quatro recortes de período funcionam, e o ciclo é 13→12
- [ ] Ciclo conferido na fronteira: 12/08 → julho, 13/08 → agosto, 05/01 → dezembro
- [ ] Carimbo de hora do último cálculo visível
- [ ] Venda ganha traz link do anúncio quando o Kommo tem
- [ ] A lista do que falta no Kommo foi entregue a ele
- [ ] Pacote do Meta montado, e nada é enviado sem clique
- [ ] Reservas por ciclo batem com o app de vendas
- [ ] `node testes/testar-tudo.js` passa (373 asserções em 06/10/2026)
- [ ] `api.conferir()` devolve ok:true com o token no config.json
- [ ] `api.descobrirTiposDeNota()` rodou e os tipos foram para o config
- [ ] O monitoramento ao vivo vem de webhook+SSE, NÃO de polling
- [ ] Janes aparece como Gerência nas duas telas (app de vendas e Copiloto)
- [ ] Com a chave da Anthropic desligada, o painel inteiro continua de pé

---

## Item 11 (novo) · Conectar ao Kommo

Pedido dele em 06/10/2026: *"já conecte direto aos locais necessários como o
kommo"*.

→ PRONTO: `site/kommo-api.js` + `CONECTAR.md` + `config.exemplo.json`, 68
asserções com `fetch` falso. Cliente com fila de **6 req/s**, recuo em 2-4-8 s
no 429, **parada** no 429 repetido, 403 tratado como possível bloqueio,
paginação em série com aviso de truncagem, diagnóstico de 401/402/403/404 em
português, e `descobrirTiposDeNota()` que lê a conta em vez de adivinhar o
nome do tipo de nota.

**NÃO foi possível conectar de fato, e os dois motivos são de fora do código:**

1. A rede do contêiner bloqueia o Kommo — testado: o gateway respondeu **403 ao
   CONNECT para `www.kommo.com:443`**. Nem a documentação abre de lá.
2. Conectar exige o token, e token de CRM dá acesso a toda a base de clientes.
   Ele **não deve** ser colado numa conversa. Fica no `config.json`, no
   computador dele.

⚠ **O limite de 7 req/s do Kommo bloqueia a conta inteira** (403 em tudo) se o
excesso se repetir. Isso proíbe polling para o monitoramento ao vivo: tem que
ser webhook → servidor → SSE. Está escrito em CONECTAR.md com as contas.

---

## Três coisas que já custaram caro neste ecossistema

Valem como advertência porque aconteceram de verdade, no app de vendas:

1. **Função chamada e nunca definida.** `mgwAbrirZoom` e `mgwFecharZoom` eram
   chamadas em quatro lugares e não existiam. O erro morria dentro do listener:
   clicar no gráfico não fazia nada e o modal abria sem poder fechar. Nada no
   console. **Confira que toda função chamada existe.**

2. **Aba sem painel.** `renderComparativo()` rodava e escrevia em 33 elementos
   que não existiam mais. Zero erro. **Confira que todo alvo de navegação tem
   painel** — o app de vendas ganhou um `mgwSelfCheck()` só para isso.

3. **Duas telas, dois números.** Histórico contava por calendário e Dashboard
   por ciclo: 9 contra 4 para o mesmo agosto. **Toda agregação por mês usa a
   mesma função**, nunca `getMonth()` solto.
