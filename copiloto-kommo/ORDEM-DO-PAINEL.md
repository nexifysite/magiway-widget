# Painel de Gestão do Copiloto — ordem de construção

Especificação do que o Luciano pediu em 06/10/2026, destrinchada em itens
verificáveis. Serve para qualquer Claude (ou pessoa) continuar o trabalho sem
reler a conversa, e para conferir no fim se ficou tudo de pé.

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

**b) O que o painel do Kommo não tem.** Ele pediu "se faltar algo no painel do
cliente avise para ajustarmos". Isso só dá para responder depois de ler os
campos reais da conta. O item 7 abaixo termina com essa lista.

---

## 1 · Portão de senha

- O painel inteiro só abre depois da senha **`carioteca`**.
- Comparar **sem diferenciar maiúscula** e com `trim()`. No app de vendas isso
  já mordeu: uma tela aceitava "Carioteca" e a outra recusava, e o teclado do
  celular capitaliza a primeira letra sozinho.
- Guardar a liberação em `sessionStorage`, não em `localStorage`: fechou o
  navegador, pede de novo.
- Isto é uma tranca de conveniência, não segurança: o código é legível por quem
  abrir o arquivo. Dizer isso num comentário, para ninguém confiar demais.

## 2 · Bibliografia própria, embarcada — independência da chave

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

- Janes (`janecossta28@gmail.com`, Gestora Operacional) **fixa no painel
  individual**, mesmo sem nenhuma atividade no Kommo no período.
- Motivo: ausência de atividade é informação, e some quando a linha some.
- Mesma regra para qualquer pessoa cadastrada: a lista de colaboradores é
  fixa, não derivada do que apareceu nos dados.

## 4 · Monitoramento ao vivo — o que cada um está executando agora

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

- Recortes: dia · semana · **ciclo 13→12** · período livre (duas datas).
- Tudo ajustável na tela, e o recorte escolhido fica guardado no navegador.
- Mínimo por pessoa: conversas atendidas, mensagens enviadas, tempo até a
  primeira resposta (mediana, não média — média esconde o caso ruim), maior
  espera, cotações enviadas, conversões, ticket médio, retomadas feitas,
  clientes sem resposta.
- **Métricas recalculadas a cada 1 hora**; a tela diz a hora do último cálculo.
  Número sem carimbo de hora é número em que ninguém confia.

## 7 · Vendas ganhas — a aba de rastreio

Para cada venda ganha, colher do Kommo o máximo:
campanha · criativo · **link do anúncio** · data de entrada do lead · origem ·
utm (source, medium, campaign, content, term) · primeiro contato · tempo até o
fechamento · vendedor · valor · categoria · datas da viagem.

- Ranking das **melhores campanhas pelos próprios links dos anúncios**.
- **Ao final, listar o que o Kommo NÃO entrega** — ele pediu isso
  explicitamente ("se faltar algo no painel do cliente avise para
  ajustarmos"). Essa lista é entregável, não rodapé.

## 8 · Dash exclusivo de venda ganha → devolver ao Meta

- Separado do item 7: aquele é rastreio, este é alimentação.
- Montar o conjunto que o Meta aceita de volta (evento, valor, moeda, data,
  identificadores disponíveis) para alimentar o algoritmo com conversão real.
- **Não enviar nada sozinho.** Preparar o pacote e deixar o envio no clique —
  mesma regra do resto do app: nada sai sem o vendedor mandar.

## 9 · Reservas por mês, da planilha de fechamento

- O README já descreve a leitura da aba ⚙️ DADOS (`lib/tabela-planilha.js`).
  Estender para ler as reservas, não só a tabela de preços.
- Dash de reservas por ciclo, batendo com o app de vendas.
- **Conferir contra o app principal antes de dar como pronto.** Dois painéis
  com totais diferentes para o mesmo mês é pior que um painel a menos.

## 10 · Banco de mídia para o cliente

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
- [ ] `node testes/testar.js` passa
- [ ] Com a chave da Anthropic desligada, o painel inteiro continua de pé

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
