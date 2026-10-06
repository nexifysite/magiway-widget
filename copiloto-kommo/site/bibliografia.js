/* ═══════════════════════════════════════════════════════════════════
   BIBLIOGRAFIA — o repertório da casa, dentro do agente
   ───────────────────────────────────────────────────────────────────
   Extraído do app de vendas (index.html) em 06/10/2026. São 227 mil
   caracteres: 30 módulos de curso com 58 referências acadêmicas, 28
   grupos de manual com 126 situações e 282 falas prontas, e as três
   camadas de cada passo do método.

   Para que serve aqui: o motor por regra reconhece o TIPO da fala do
   cliente, mas não sabia o porquê — respondia certo sem conseguir
   explicar. Agora, para cada tipo reconhecido, ele traz o módulo que
   sustenta a resposta, a situação equivalente do manual e as falas que
   a casa já aprovou. Nada disso chama a Anthropic.

   NÃO EDITE ESTE ARQUIVO À MÃO. Ele é cópia: a fonte é o app de vendas,
   e editar aqui cria duas verdades que divergem em silêncio. Para
   atualizar, extraia de novo.
   ═══════════════════════════════════════════════════════════════════ */
(function(raiz){
'use strict';

var MGW_CURSO_A=[

{id:'m1', n:1, eixo:'Fundamentos',
 t:'Como uma decisão de compra realmente acontece',
 sub:'Por que a planilha não convence, e o que convence',
 tempo:'25 min',
 porque:'Vendedor treinado em "argumentar melhor" perde para vendedor que faz o cliente se sentir seguro. Não é injustiça: é como a decisão funciona. Este módulo é a base de todos os outros — sem ele, os passos do método viram truque decorado.',
 teoria:[
  {h:'A hipótese do marcador somático — Damásio (1994)',
   p:'António Damásio, neurologista português, estudou pacientes com lesão no córtex pré-frontal ventromediano. O raciocínio lógico deles ficava <b>intacto</b>: QI normal, memória normal, capacidade de listar prós e contras normal. O que sumia era a capacidade de <b>decidir</b>. Um paciente podia passar meia hora comparando duas datas para uma consulta, listando vantagens de cada uma, sem conseguir escolher.<br><br>A conclusão de Damásio: a emoção não atrapalha a razão — ela é o que <b>encerra</b> a deliberação. Estados corporais associados a experiências passadas (os "marcadores somáticos") reduzem o espaço de opções antes de a razão entrar. Sem eles, a análise não converge.',
   ref:'Damásio, A. (1994). Descartes\' Error: Emotion, Reason and the Human Brain. Putnam.'},
  {h:'Dois sistemas — Kahneman (2011)',
   p:'Daniel Kahneman, Nobel de Economia de 2002, descreve o pensamento em dois modos. O <b>Sistema 1</b> é rápido, automático, emocional, sempre ligado, e não se desliga por vontade. O <b>Sistema 2</b> é lento, deliberado, custoso — e preguiçoso: só entra quando é convocado, e mesmo assim tende a <b>ratificar</b> o que o Sistema 1 já concluiu, produzindo justificativa em vez de análise.<br><br>Para a venda, a consequência é direta: quando o cliente diz "vou pensar", raramente ele vai pensar. Ele já sentiu alguma coisa — e vai procurar razões para o que sentiu.',
   ref:'Kahneman, D. (2011). Thinking, Fast and Slow. Farrar, Straus and Giroux.'}
 ],
 evidencia:'No Iowa Gambling Task, participantes escolhem cartas de quatro baralhos; dois dão ganhos altos com perdas catastróficas, dois dão ganhos modestos e seguros. Pessoas saudáveis começam a produzir <b>resposta de condutância da pele</b> ao aproximar a mão dos baralhos ruins por volta da carta 10 — e passam a evitá-los por volta da carta 50, antes de conseguirem explicar por quê. O corpo sabe antes da consciência. Pacientes com a lesão ventromediana não produzem a resposta antecipatória e continuam escolhendo os baralhos ruins mesmo depois de conseguirem explicar, verbalmente, que são ruins.',
 limite:'Isto <b>não</b> significa que argumento não importa, nem que se deva manipular emoção. Significa que argumento sozinho não fecha, e que argumento apresentado antes de haver segurança emocional não é processado. A hipótese do marcador somático também é debatida: parte da literatura questiona a interpretação do Iowa Gambling Task (Maia e McClelland, 2004, mostraram que os participantes têm mais conhecimento explícito do que o estudo original supunha). O que sobrevive à crítica e nos interessa: emoção e decisão não são sistemas separados.',
 aplicacao:[
  'Ordem do atendimento: primeiro segurança, depois informação. Nunca o contrário.',
  'Antes de mandar valor, o cliente precisa ter sentido que existe alguém do outro lado. É o passo 1 do método.',
  'Quando o cliente pede "só o preço", ele está pedindo ao Sistema 1 o que só o Sistema 2 deveria julgar. Uma pergunta antes do número muda o modo de processamento.',
  'Depoimento em vídeo funciona melhor que lista de benefícios porque produz estado emocional, não informação.'
 ],
 scripts:[
  'Antes de te passar o valor, deixa eu entender a viagem de vocês — assim eu monto certo e você não perde tempo comparando coisa diferente.',
  'Vou te falar o valor, mas antes preciso que você saiba o que vai dentro. Se eu inverter a ordem, você compara laranja com maçã.'
 ],
 erros:[
  'Responder "quanto custa?" com o número, sem uma pergunta antes.',
  'Achar que uma tabela comparativa convence alguém que ainda não confia.',
  'Tratar "vou pensar" como pedido de mais informação. Quase nunca é.'
 ],
 exercicio:'Nos próximos 10 atendimentos, conte quantos você conseguiu abrir com uma pergunta antes de qualquer número. Anote a taxa de resposta dos dois grupos. É o experimento mais barato deste curso.',
 grafico:{tipo:'barra', t:'O que decide, e o que justifica',
   sub:'Ordem em que o cérebro processa uma proposta comercial',
   labels:['Sensação de segurança','Percepção de valor','Comparação de preço','Justificativa racional'],
   vals:[100,72,48,30], cor:'#FF2D2D',
   exp:'A altura representa a <b>ordem e o peso</b> de cada etapa na formação da decisão, não um percentual medido. A leitura é a sequência: segurança abre a porta, valor sustenta, preço compara, razão justifica o que já foi decidido. Vender começando pela última barra é falar com o sistema que chega por último — e que, na maioria das vezes, só ratifica.'}
},

{id:'m2', n:2, eixo:'Fundamentos',
 t:'Confiança vem antes de competência',
 sub:'Os dois eixos com que somos julgados em milissegundos',
 tempo:'25 min',
 porque:'A Magiway é pequena e cobra acima do mercado. As duas coisas juntas fazem o cliente entrar desconfiado por padrão. Se a desconfiança não for resolvida primeiro, nenhum argumento de valor é processado — ele é ouvido como propaganda.',
 teoria:[
  {h:'Calor e competência — Fiske, Cuddy e Glick (2007)',
   p:'Ao avaliar qualquer pessoa ou organização desconhecida, usamos duas dimensões: <b>calor</b> (esta pessoa tem boas intenções em relação a mim?) e <b>competência</b> (ela é capaz de executar?). O modelo se sustenta em dezenas de culturas.<br><br>O detalhe que muda a prática: <b>calor é julgado primeiro e pesa mais</b>. Faz sentido evolutivo — diante de um estranho, saber se ele quer me ajudar ou me prejudicar é mais urgente do que saber se ele é bom no que faz. Competência alta com calor baixo produz a combinação mais perigosa: admiração com desconfiança, que em vendas se traduz em "parece bom demais".',
   ref:'Fiske, S., Cuddy, A., & Glick, P. (2007). Universal dimensions of social cognition: warmth and competence. Trends in Cognitive Sciences, 11(2), 77-83.'},
  {h:'Julgamento em 100 milissegundos — Willis e Todorov (2006)',
   p:'Participantes viram rostos por 100ms, 500ms ou 1000ms e julgaram confiabilidade, competência, simpatia e agressividade. Os julgamentos feitos em 100ms <b>correlacionaram fortemente</b> com os feitos sem limite de tempo. Mais tempo não mudou o julgamento — só aumentou a confiança do participante nele.<br><br>Em atendimento por texto, o equivalente de 100ms é a <b>primeira mensagem</b>. Ela não é aquecimento: é onde o julgamento se forma.',
   ref:'Willis, J., & Todorov, A. (2006). First impressions: making up your mind after a 100-ms exposure to a face. Psychological Science, 17(7), 592-598.'}
 ],
 evidencia:'No estudo de Willis e Todorov, a correlação entre o julgamento de confiabilidade a 100ms e o julgamento sem restrição de tempo foi de <b>r = 0,73</b> — a mais alta entre os traços testados. Confiabilidade é o traço julgado mais rápido e o mais estável. Exposição adicional não corrigiu a primeira impressão; apenas aumentou a certeza subjetiva sobre ela.',
 limite:'Julgamento rápido é <b>rápido</b>, não <b>correto</b>. A literatura de primeira impressão mostra formação veloz, não acurácia — e há viés documentado nesses julgamentos. Para nós isso é um alerta duplo: a primeira mensagem pesa muito, e o cliente pode nos julgar mal por motivos que nada têm a ver com a qualidade do serviço. A resposta a isso não é técnica de seseção; é dar, cedo, prova verificável.',
 aplicacao:[
  'A primeira mensagem carrega nome próprio, não nome de empresa. "Aqui é o Luciano" cria calor; "Magiway Rental Car informa" cria distância.',
  'Prova verificável nos primeiros minutos: CNPJ, Instagram aberto, contrato antes do pagamento. Isso é competência sem custar calor.',
  'Nunca se ofender com desconfiança. Ofensa é lida como calor baixo e confirma a suspeita.',
  'Empresa pequena tem vantagem de calor e desvantagem de competência percebida. A estratégia é usar a primeira para comprar a segunda — e nunca fingir ser grande.'
 ],
 scripts:[
  'Oi, {nome}! Aqui é o {vendedor} da Magiway — sou eu que vou cuidar do carro de vocês do começo ao fim.',
  'Justíssimo desconfiar, é o seu dinheiro. Te mando agora o CNPJ, o Instagram e o contrato pra você ler ANTES de pagar qualquer coisa.',
  'A gente não é gigante, e é exatamente por isso que você fala comigo e não com um robô.'
 ],
 erros:[
  'Abrir com "Segue o orçamento conforme solicitado" — competência sem calor nenhum.',
  'Responder à desconfiança com indignação.',
  'Demorar horas para a primeira resposta. O julgamento se forma no vazio, e o vazio não joga a nosso favor.'
 ],
 exercicio:'Pegue as suas últimas 10 primeiras mensagens. Marque quantas tinham nome próprio e quantas abriam com preço ou com "segue". Reescreva as que abriam por competência.',
 grafico:{tipo:'barra', t:'Peso na formação da primeira impressão',
   sub:'Modelo calor × competência aplicado a atendimento comercial',
   labels:['Calor percebido','Competência percebida'],
   vals:[100,62], cor:'#1AFF9D',
   exp:'O modelo de Fiske indica que calor é julgado <b>antes</b> e domina a avaliação inicial de um desconhecido. As barras representam esse peso relativo na formação da impressão, não uma medição da Magiway. A consequência prática: uma proposta impecável enviada com frieza é avaliada pelo eixo em que ela é fraca.'}
},

{id:'m3', n:3, eixo:'Preço',
 t:'Ancoragem — o primeiro número vira a régua',
 sub:'Por que a ordem em que se fala de preço decide a venda',
 tempo:'30 min',
 porque:'Cobramos, em média, cerca de 60% acima do nicho B/C. Se a régua do cliente for a tarifa da concorrente, perdemos antes de falar. Se for o que está incluso, competimos em outro campo. A ancoragem é a ferramenta mais concreta deste curso.',
 teoria:[
  {h:'Ancoragem e ajuste — Tversky e Kahneman (1974)',
   p:'Um número apresentado antes de um julgamento numérico contamina esse julgamento, mesmo quando é <b>obviamente irrelevante</b>. As pessoas partem da âncora e ajustam — e o ajuste é sistematicamente insuficiente.<br><br>Em vendas, a âncora quase nunca somos nós: o cliente chega com a tarifa que viu no comparador. Nossa proposta é então lida como "quanto acima" daquele número, e não pelo que ela é.',
   ref:'Tversky, A., & Kahneman, D. (1974). Judgment under Uncertainty: Heuristics and Biases. Science, 185(4157), 1124-1131.'},
  {h:'Ancoragem arbitrária — Ariely, Loewenstein e Prelec (2003)',
   p:'Participantes escreveram os dois últimos dígitos do próprio CPF (no original, do Social Security) e em seguida disseram quanto pagariam por produtos. Quem tinha dígitos altos ofereceu <b>substancialmente mais</b> pelos mesmos produtos. Um número sem qualquer relação com valor ancorou a disposição a pagar.<br><br>Os autores chamam isso de "coerência arbitrária": o valor inicial é arbitrário, mas a partir dele as preferências se tornam coerentes e estáveis.',
   ref:'Ariely, D., Loewenstein, G., & Prelec, D. (2003). Coherent Arbitrariness. Quarterly Journal of Economics, 118(1), 73-105.'}
 ],
 evidencia:'No estudo de Ariely e colegas, participantes com dígitos no quintil superior ofereceram, em média, <b>de 216% a 346% mais</b> pelos mesmos itens do que os do quintil inferior, dependendo do produto. Nenhum participante acreditou que os dígitos tivessem influenciado sua avaliação.',
 limite:'A magnitude de efeitos de ancoragem em contextos reais de compra é <b>menor</b> que em laboratório, e algumas replicações encontraram efeitos mais modestos que os originais. Além disso, ancoragem funciona com quem tem pouca referência de valor; especialista ancora menos. Na prática: o cliente que aluga carro nos EUA todo ano ancora menos que o de primeira viagem — e com ele o caminho é comparação item a item, não reancoragem.',
 aplicacao:[
  'Nunca mandar o preço no primeiro contato. Nem quando pedem. Uma pergunta antes.',
  'Ancorar no que está incluso, na ordem: zero caução → seguro total → suporte em português → carro reserva → só então o total.',
  'Quando o cliente cita o valor da concorrente, pedir a proposta e comparar item a item. Isso desmonta a âncora com fato, não com adjetivo.',
  'Falar o total da viagem, não a diária. "R$ 4.500 nos 12 dias" ancora diferente de "R$ 375 por dia" — e o total é a decisão real.',
  'Dividir por pessoa quando o grupo é grande: é a comparação certa, porque a decisão é do grupo.'
 ],
 scripts:[
  'Antes do valor, deixa eu te falar o que já vai dentro — porque isso muda a comparação.',
  'Me manda a proposta que você recebeu, eu comparo com você linha a linha. Sem enrolação: se lá estiver melhor, eu te falo.',
  'São {dias} dias por {valor} no total. Divididos por {n} pessoas, dá {porPessoa} por pessoa na viagem inteira.'
 ],
 erros:[
  'Mandar tabela de diárias como primeira mensagem.',
  'Dizer "é mais caro, mas...". O "mas" apaga tudo que veio antes — use "e" ou ponto final.',
  'Justificar o preço antes de o cliente questionar. Justificativa não pedida cria a dúvida que ia resolver.'
 ],
 exercicio:'Escreva a sua sequência de inclusos na ordem de perda evitada e cronometre: ela precisa caber em 40 segundos de áudio. Se passar disso, o cliente já pulou para o número.',
 grafico:{tipo:'barra', t:'A mesma proposta, duas âncoras',
   sub:'Como o valor percebido muda com a ordem de apresentação',
   labels:['Âncora = tarifa do concorrente','Âncora = o que está incluso'],
   vals:[38,84], cor:'#FFD11A',
   exp:'Representa o <b>valor percebido</b> da mesma proposta conforme o que foi apresentado primeiro. Não é medição da Magiway: é a ilustração do mecanismo descrito por Tversky e Kahneman. Quando a régua é a tarifa alheia, tudo o que fazemos aparece como sobrepreço; quando a régua é o pacote, o preço aparece como o custo daquilo.'}
},

{id:'m4', n:4, eixo:'Preço',
 t:'Aversão à perda — evitar dói mais que ganhar',
 sub:'Por que caução zero vende mais que qualquer adjetivo',
 tempo:'25 min',
 porque:'Nossa lista de inclusos é grande, e o vendedor tende a recitá-la inteira. Só que os itens não têm o mesmo peso: os que evitam PERDA valem muito mais na cabeça do cliente do que os que oferecem GANHO. Saber quais são muda a ordem e o resultado.',
 teoria:[
  {h:'Teoria do prospecto — Kahneman e Tversky (1979)',
   p:'Pessoas avaliam resultados como ganhos e perdas em relação a um ponto de referência, não em valores absolutos. E a função de valor é <b>assimétrica</b>: a curva das perdas é mais íngreme que a dos ganhos. Perder R$ 100 dói mais do que ganhar R$ 100 agrada — a razão estimada fica em torno de 2 para 1.',
   ref:'Kahneman, D., & Tversky, A. (1979). Prospect Theory: An Analysis of Decision under Risk. Econometrica, 47(2), 263-291.'},
  {h:'Enquadramento — Tversky e Kahneman (1981)',
   p:'O "problema da doença asiática": o mesmo resultado, descrito como "200 pessoas serão salvas" ou como "400 pessoas morrerão", produz preferências opostas. Ganho enquadrado leva à aversão ao risco; perda enquadrada leva à busca de risco. A informação é idêntica; o enquadramento não.',
   ref:'Tversky, A., & Kahneman, D. (1981). The Framing of Decisions and the Psychology of Choice. Science, 211(4481), 453-458.'}
 ],
 evidencia:'No problema da doença asiática, <b>72%</b> escolheram a opção certa quando enquadrada como ganho ("200 salvos"); com o enquadramento de perda ("400 morrerão"), apenas <b>22%</b> escolheram a mesma opção. Uma diferença de 50 pontos percentuais produzida apenas pela redação.',
 limite:'Enquadrar não é mentir, e a linha é nítida: descrever o mesmo fato por outro ângulo é legítimo; omitir fato relevante não é. Se existe taxa de one-way, ela é dita — inclusive porque a descoberta tardia produz exatamente a perda que estamos tentando evitar, e com juros de confiança. Além disso, efeitos de enquadramento variam muito conforme envolvimento e conhecimento do decisor.',
 aplicacao:[
  'Traduzir cada incluso em perda evitada: "não bloqueia seu cartão", "não paga franquia", "não fica sem carro", "não precisa falar inglês numa emergência".',
  'Zero caução vem primeiro. É a maior perda evitada da lista: dinheiro travado durante a viagem inteira.',
  'Falar o que acontece QUANDO DÁ ERRADO. É onde nossa diferença existe — e é o cenário de perda.',
  'Nunca inventar perda. Urgência falsa descoberta destrói o eixo de calor, e ele não volta.'
 ],
 scripts:[
  'A locadora americana bloqueia de 500 a 1.500 dólares no seu cartão e libera semanas depois. Com a gente não bloqueia nada — seu limite fica livre pra viagem.',
  'Seguro total sem franquia: se acontecer alguma coisa, você não paga nada e não discute em inglês.',
  'Carro reserva: deu pane, a gente troca. Sua viagem não para.'
 ],
 erros:[
  'Listar inclusos como características ("temos seguro total") em vez de perdas evitadas ("você não paga franquia").',
  'Deixar caução zero por último, no meio de uma lista de dez itens.',
  'Criar urgência inventada. Uma vez descoberta, contamina tudo o mais que foi dito.'
 ],
 exercicio:'Pegue os cinco inclusos principais e reescreva cada um começando por "você não". Se algum não couber nessa forma, ele é ganho, não perda evitada — e vai depois na ordem.',
 grafico:{tipo:'barra', t:'Peso percebido: perda evitada × ganho oferecido',
   sub:'Função de valor assimétrica aplicada aos nossos inclusos',
   labels:['Não bloqueia caução','Não paga franquia','Não fica sem carro','Ganha suporte 24h','Ganha 12x'],
   vals:[100,88,74,52,44], cor:'#FF6B78',
   exp:'As três primeiras barras são <b>perdas evitadas</b>; as duas últimas são <b>ganhos oferecidos</b>. A diferença de altura reflete a assimetria de Kahneman e Tversky — a curva das perdas é mais íngreme. Por isso a ordem de apresentação importa: começar pelos ganhos gasta a atenção do cliente na parte que pesa menos.'}
},

{id:'m5', n:5, eixo:'Vínculo',
 t:'Escutar é a técnica mais subestimada',
 sub:'Falar de si ativa recompensa — e quem pergunta colhe o crédito',
 tempo:'25 min',
 porque:'O vendedor ansioso fala. Fala dos carros, dos inclusos, da empresa. E sai da conversa sem saber a única coisa que faria a proposta convencer: o que aquele cliente teme. Escutar não é gentileza — é coleta de dados e construção de vínculo ao mesmo tempo.',
 teoria:[
  {h:'Autorrevelação é intrinsecamente recompensadora — Tamir e Mitchell (2012)',
   p:'Falar sobre si mesmo produz ativação em regiões associadas a recompensa — núcleo accumbens e área tegmental ventral —, as mesmas envolvidas em recompensas primárias. Em experimentos comportamentais, participantes <b>abriram mão de dinheiro</b> pela oportunidade de responder perguntas sobre si em vez de responder sobre outras pessoas.',
   ref:'Tamir, D., & Mitchell, J. (2012). Disclosing information about the self is intrinsically rewarding. PNAS, 109(21), 8038-8043.'},
  {h:'Mimetismo aumenta cooperação — Van Baaren et al. (2003, 2004)',
   p:'Repetir postura, ritmo e — no nosso caso — as <b>palavras exatas</b> do interlocutor aumenta comportamento pró-social mensurável. Garçons que repetiram literalmente o pedido receberam gorjetas maiores que os que parafrasearam ou confirmaram com "ok".',
   ref:'Van Baaren, R., Holland, R., Steenaert, B., & van Knippenberg, A. (2003). Mimicry for money: Behavioral consequences of imitation. Journal of Experimental Social Psychology, 39(4), 393-398.'}
 ],
 evidencia:'No estudo de gorjetas de Van Baaren e colegas, a condição de <b>repetição literal</b> do pedido produziu gorjetas significativamente maiores do que a condição de confirmação genérica — com o mesmo garçom, no mesmo restaurante, variando apenas a formulação da confirmação. No estudo de Tamir e Mitchell, participantes aceitaram perder cerca de <b>17% a 25%</b> do ganho possível para poder falar de si.',
 limite:'Mimetismo <b>percebido como técnica</b> produz o efeito oposto: quando o interlocutor nota que está sendo imitado, a avaliação cai. Repetir as palavras do cliente é natural quando você de fato escutou; vira caricatura quando é aplicado como fórmula. E a autorrevelação recompensa quem fala, não quem ouve — o ganho para nós é indireto: informação e vínculo.',
 aplicacao:[
  'Perguntas abertas, uma por vez. Bloco de perguntas parece formulário e derruba a resposta.',
  'Anotar as palavras exatas do cliente. Elas voltam no espelhamento e na conexão.',
  'Sempre extrair UMA preocupação declarada antes de propor. Sem ela, você vende no escuro.',
  'Confirmar repetindo os números dele: "vocês são 6, chegam dia 10, ficam 12 dias, e o que mais preocupa é a bagagem — é isso?"'
 ],
 scripts:[
  'O que mais te deixa em dúvida nessa parte do carro? Pergunto porque cada família se preocupa com uma coisa diferente.',
  'Já alugaram carro nos Estados Unidos antes? Teve alguma coisa que incomodou?',
  'Deixa eu ver se entendi: vocês são {n}, chegam {data}, ficam {dias} dias, e a maior preocupação é {preocupacao}. É isso?'
 ],
 erros:[
  'Perguntar tudo de uma vez, em lista.',
  'Parafrasear em vez de repetir. "Então você quer economia" apaga o que ele disse; "então o que te preocupa é a caução travar seu cartão" devolve.',
  'Ir para a proposta sem uma preocupação declarada na mão.'
 ],
 exercicio:'Nos próximos 5 atendimentos, escreva a preocupação do cliente com as palavras dele antes de montar a proposta. Se não conseguir escrever, você não perguntou o suficiente.',
 grafico:{tipo:'barra', t:'Quanto o cliente fala × chance de fechar',
   sub:'Proporção da conversa ocupada pelo cliente',
   labels:['Cliente fala <20%','20 a 40%','40 a 60%','Cliente fala >60%'],
   vals:[22,48,86,71], cor:'#A855F7',
   exp:'Ilustra a relação em U invertido descrita na literatura de vendas consultivas: conversa em que o vendedor monopoliza a fala converte pouco, e conversa em que ele quase não conduz também. O ponto alto fica quando o cliente fala <b>um pouco mais</b> que o vendedor — tempo suficiente para revelar a preocupação, com condução suficiente para chegar a algum lugar. Os valores são ilustrativos do formato da curva, não medição da Magiway.'}
},

{id:'m6', n:6, eixo:'Vínculo',
 t:'História sincroniza cérebros',
 sub:'Por que um caso real vale mais que dez benefícios',
 tempo:'25 min',
 porque:'Nosso diferencial é abstrato: "a gente resolve se der problema". Abstração não gera imagem nem memória. Uma história com nome, cidade e desfecho gera as duas — e é a forma mais eficaz de transmitir o que não dá para provar antes da viagem.',
 teoria:[
  {h:'Acoplamento neural entre quem fala e quem ouve — Stephens, Silbert e Hasson (2010)',
   p:'Com ressonância funcional, os pesquisadores registraram a atividade de uma pessoa contando uma história espontânea e, depois, de pessoas ouvindo a gravação. A atividade cerebral do ouvinte passou a <b>espelhar</b> a do narrador, com atraso de alguns segundos. Em algumas áreas o padrão do ouvinte <b>antecipava</b> o do narrador — e maior antecipação correspondeu a maior compreensão medida.<br><br>Quando o mesmo experimento foi feito com uma língua que o ouvinte não entendia, o acoplamento desapareceu. Não é o som: é o significado compartilhado.',
   ref:'Stephens, G., Silbert, L., & Hasson, U. (2010). Speaker-listener neural coupling underlies successful communication. PNAS, 107(32), 14425-14430.'},
  {h:'Transporte narrativo — Green e Brock (2000)',
   p:'Quanto mais uma pessoa é "transportada" para dentro de uma narrativa, menos ela produz contra-argumentação — e mais as crenças da história se transferem para a vida real. Argumento convida a refutação; história suspende a refutação enquanto dura.',
   ref:'Green, M., & Brock, T. (2000). The role of transportation in the persuasiveness of public narratives. Journal of Personality and Social Psychology, 79(5), 701-721.'}
 ],
 evidencia:'No estudo de Hasson, a extensão do acoplamento neural entre narrador e ouvinte <b>previu a compreensão</b> medida por questionário posterior: quanto maior a sobreposição de padrões, maior o entendimento relatado e testado. O acoplamento era ausente na condição de língua incompreensível, mostrando que o efeito depende de conteúdo, não de prosódia.',
 limite:'Transporte narrativo reduz contra-argumentação — o que é justamente o motivo pelo qual há responsabilidade ética envolvida. História falsa persuade tão bem quanto história verdadeira, e é por isso que a regra aqui é rígida: só contamos caso que aconteceu. Além disso, o efeito depende de identificação: história de um casal sem filhos não transporta uma família de seis.',
 aplicacao:[
  'Uma história por atendimento. A segunda apaga a primeira.',
  'Com nome (ou cidade) e desfecho concreto. "Uma família de Belo Horizonte" transporta; "vários clientes" não.',
  'Escolhida pela preocupação declarada do cliente, não pela sua história favorita.',
  'Terminar devolvendo o controle: "faz sentido pra vocês?". Isso evita a reatância do módulo 8.'
 ],
 scripts:[
  'Você falou que a maior preocupação é {preocupacao}. Deixa eu te contar de uma família de {cidade} que passou por isso mês passado.',
  'Eles estavam a caminho do parque e o carro não ligou. Me mandaram mensagem 7h da manhã de domingo. Às 9h estavam com outro carro, sem pagar nada. Perderam duas horas, não o dia.',
  'É por isso que a gente cobra diferente. Não é o carro que é diferente — é não ficar sozinho lá.'
 ],
 erros:[
  'História genérica, sem nome nem cidade.',
  'Contar duas ou três seguidas.',
  'Inventar ou inflar o caso. Além de antiético, cria expectativa que a operação não entrega.'
 ],
 exercicio:'Monte um banco de 5 histórias reais, uma por preocupação típica: caução, seguro, bagagem, dirigir do outro lado, imprevisto. Cada uma em até 4 frases, com cidade e desfecho.',
 grafico:{tipo:'barra', t:'Retenção da mensagem por formato',
   sub:'O que o cliente ainda lembra depois da conversa',
   labels:['Lista de benefícios','Comparativo de preço','Depoimento de terceiro','História com nome e desfecho'],
   vals:[24,31,58,88], cor:'#3B9EFF',
   exp:'Ilustra o achado consolidado de que narrativa é retida melhor que informação isolada, e que a diferença cresce com o tempo entre a conversa e a decisão. Como quase toda decisão de aluguel envolve dias de intervalo e uma conversa com o cônjuge, o que importa não é o que convence na hora — é o que sobrevive até a conversa em casa.'}
}
];
var MGW_CURSO_B=[

{id:'m7', n:7, eixo:'Vínculo',
 t:'A memória da experiência: pico e fim',
 sub:'O que o cliente vai lembrar não é a média da viagem',
 tempo:'25 min',
 porque:'Indicação é a alavanca mais barata que uma marca cara tem. E indicação depende do que ficou na memória — que não é a soma da experiência, mas dois instantes dela. Saber quais são muda onde se investe atenção.',
 teoria:[
  {h:'Regra do pico-fim — Kahneman, Fredrickson, Schreiber e Redelmeier (1993)',
   p:'A avaliação retrospectiva de uma experiência é aproximadamente a média entre o momento mais intenso (o <b>pico</b>) e o momento final (o <b>fim</b>). A duração é quase ignorada — fenômeno chamado de "negligência da duração".',
   ref:'Kahneman, D., Fredrickson, B., Schreiber, C., & Redelmeier, D. (1993). When more pain is preferred to less: Adding a better end. Psychological Science, 4(6), 401-405.'},
  {h:'O experimento da colonoscopia — Redelmeier e Kahneman (1996)',
   p:'Pacientes reais foram divididos em dois grupos. No grupo B, o exame foi <b>prolongado</b> por um minuto extra com o endoscópio parado — desconforto menor, mas mais tempo total de desconforto. Objetivamente, o grupo B sofreu mais. Subjetivamente, avaliou o procedimento como <b>menos ruim</b> e mostrou maior disposição a repetir.',
   ref:'Redelmeier, D., & Kahneman, D. (1996). Patients\' memories of painful medical treatments. Pain, 66(1), 3-8.'}
 ],
 evidencia:'No estudo da colonoscopia, com 682 pacientes, o grupo com o final menos doloroso avaliou retrospectivamente a experiência como menos aversiva <b>apesar de ter durado mais e acumulado mais desconforto total</b>. Cinco anos depois, a taxa de retorno para exame de acompanhamento foi maior nesse grupo.',
 limite:'A regra descreve a <b>memória</b> da experiência, não a experiência vivida. Um final bom não compensa um serviço ruim no meio — compensa a <b>lembrança</b> dele, e por pouco tempo. Usar isto como substituto de qualidade operacional é o caminho para avaliação boa hoje e reputação ruim em seis meses. E há debate: a regra é mais robusta para experiências curtas e intensas do que para longas e variadas, e uma viagem de 12 dias é do segundo tipo.',
 aplicacao:[
  'Investir nos dois instantes que a memória guarda: a <b>retirada</b> (pico de ansiedade) e a <b>devolução</b> (fim).',
  'Mensagem na véspera, com passo a passo da retirada. É onde a ansiedade está no máximo — e portanto onde um gesto pesa mais.',
  'Mensagem no dia da chegada: "conseguiram pegar o carro sem problema?".',
  'A indicação se pede na devolução. Antes disso soa a cobrança; muito depois, já esfriou.',
  'Quando algo dá errado, o esforço vai para o FINAL do episódio. Como termina define como será lembrado.'
 ],
 scripts:[
  '{nome}, amanhã é o grande dia! Seu carro está confirmado. Na chegada é só {passo}. Qualquer coisa me chama — estou aqui.',
  'Chegaram bem? Conseguiram pegar o carro sem problema?',
  'Que bom que deu tudo certo! Posso te pedir uma coisa? Se conhece alguém que vai pra Orlando, me indica. É assim que a gente cresce.'
 ],
 erros:[
  'Sumir depois do pagamento e reaparecer só na devolução.',
  'Pedir indicação antes de a viagem terminar.',
  'Encerrar um problema resolvido sem uma última mensagem boa. O fim do episódio é o que fica.'
 ],
 exercicio:'Desenhe a linha do tempo da sua última venda e marque onde estão o pico e o fim. Depois, escreva a mensagem que você mandaria em cada um.',
 grafico:{tipo:'linha', t:'O que fica na memória de uma viagem',
   sub:'Intensidade emocional ao longo da jornada',
   labels:['Fechamento','Espera','Véspera','Retirada','Viagem','Devolução','Depois'],
   vals:[62,28,74,92,55,80,44], cor:'#FFD11A',
   exp:'A curva mostra a intensidade emocional em cada etapa. O <b>pico</b> está na retirada — o momento de maior ansiedade, e portanto de maior alavancagem para um gesto nosso. O <b>fim</b> é a devolução. Segundo Kahneman, a lembrança que sobra é aproximadamente a média desses dois pontos, e a duração do meio quase não conta. Traduzindo: dez mensagens durante a viagem valem menos que uma na véspera e uma na devolução.'}
},

{id:'m8', n:8, eixo:'Condução',
 t:'Autonomia e reatância — por que empurrar afasta',
 sub:'A diferença entre "vamos fechar?" e "manhã ou tarde?"',
 tempo:'20 min',
 porque:'O fechamento é onde mais se perde venda já ganha. Pressão aumenta resistência, e a resistência não é teimosia: é uma resposta automática à ameaça de liberdade. Conduzir sem empurrar é uma habilidade treinável.',
 teoria:[
  {h:'Teoria da reatância psicológica — Brehm (1966)',
   p:'Quando uma pessoa percebe que sua liberdade de escolha está sendo ameaçada ou eliminada, surge um estado motivacional que a leva a <b>restaurar</b> essa liberdade — geralmente valorizando mais a opção ameaçada e resistindo à pressão. É a razão pela qual "você precisa decidir hoje" produz o efeito contrário do pretendido.',
   ref:'Brehm, J. (1966). A Theory of Psychological Reactance. Academic Press.'},
  {h:'Autonomia como necessidade básica — Deci e Ryan (1985, 2000)',
   p:'A teoria da autodeterminação identifica três necessidades psicológicas básicas: <b>autonomia</b>, competência e vínculo. Contextos que apoiam a autonomia produzem motivação mais duradoura e maior satisfação com a decisão tomada — o que, em vendas, se traduz em menos arrependimento pós-compra e menos cancelamento.',
   ref:'Deci, E., & Ryan, R. (2000). The "what" and "why" of goal pursuits: Human needs and the self-determination of behavior. Psychological Inquiry, 11(4), 227-268.'}
 ],
 evidencia:'A literatura de reatância mostra consistentemente que mensagens percebidas como controladoras ("você tem que", "é obrigatório") reduzem a adesão em comparação a mensagens que preservam a escolha ("você pode considerar"), mesmo quando o conteúdo factual é idêntico. Meta-análises em comunicação em saúde encontram efeito robusto de linguagem controladora sobre resistência.',
 limite:'Preservar autonomia <b>não</b> significa não conduzir. Cliente sem condução decide não decidir — e "vou pensar" é a forma mais comum de não decidir. A habilidade é oferecer estrutura sem retirar escolha: duas opções concretas, e não a opção de sim ou não. E escassez real pode ser dita; escassez inventada é o pior movimento possível, porque quando descoberta destrói o eixo de calor do módulo 2.',
 aplicacao:[
  'Nunca perguntar "vamos fechar?" — pergunta de sim ou não convida o não.',
  'Sempre A ou B: manhã ou tarde, PIX ou parcelado, agora ou depois de falar com a família.',
  'Silêncio depois da pergunta de fechamento. Quem fala primeiro cede.',
  'Se houver urgência real (feriado, alta temporada, frota), dizer com o motivo. Se não houver, não inventar.',
  'Dar sempre a saída: "sem compromisso até assinar" reduz a ameaça e aumenta o avanço.'
 ],
 scripts:[
  'Prefere retirar de manhã ou à tarde no dia {data}?',
  'À vista no PIX com desconto, ou em 12x? Qual funciona melhor pra vocês?',
  'Eu reservo agora e te mando o contrato. Você lê com calma e só assina se estiver tudo certo. Sem compromisso até assinar. Pode ser?'
 ],
 erros:[
  '"Vamos fechar?" e variações de sim ou não.',
  'Urgência inventada.',
  'Preencher o silêncio depois da pergunta. É a hora de esperar.'
 ],
 exercicio:'Reescreva as suas 3 frases de fechamento mais usadas no formato A ou B. Teste por uma semana e compare a taxa de resposta.',
 grafico:{tipo:'barra', t:'Formato da pergunta de fechamento',
   sub:'Avanço para o próximo passo conforme a formulação',
   labels:['"Vamos fechar?"','"Tem interesse?"','"Manhã ou tarde?"','"PIX ou parcelado?"'],
   vals:[30,36,78,74], cor:'#1AFF9D',
   exp:'As duas primeiras são perguntas de <b>sim ou não</b> — e "não" é sempre a resposta mais fácil, porque encerra a conversa sem custo. As duas últimas oferecem escolha <b>dentro</b> do avanço: qualquer resposta move para frente, e a sensação de escolha permanece intacta. É a aplicação direta de Brehm: estrutura sem retirada de liberdade.'}
},

{id:'m9', n:9, eixo:'Condução',
 t:'Prova social, autoridade e escassez — com ética',
 sub:'Os princípios de Cialdini e onde eles quebram',
 tempo:'30 min',
 porque:'Somos desconhecidos para quase todo cliente novo. Prova social é o atalho que o cérebro usa quando não tem experiência própria — e é o mais barato de construir. Mas é também o mais fácil de falsificar, e falsificar aqui custa a empresa.',
 teoria:[
  {h:'Os princípios da influência — Cialdini (1984)',
   p:'Robert Cialdini identificou princípios que operam como atalhos de decisão: <b>reciprocidade</b>, <b>compromisso e coerência</b>, <b>prova social</b>, <b>afinidade</b>, <b>autoridade</b> e <b>escassez</b> (depois acrescentou <b>unidade</b>). São heurísticas úteis: na maior parte das vezes seguir a maioria, ou o especialista, produz boa decisão a baixo custo cognitivo.',
   ref:'Cialdini, R. (1984). Influence: The Psychology of Persuasion. Harper Business.'},
  {h:'Prova social funciona melhor sob incerteza e semelhança',
   p:'O efeito é mais forte quando a pessoa está insegura sobre o que fazer e quando os "outros" são <b>semelhantes</b> a ela. Para nós isso é decisivo: o depoimento que converte não é o de "um cliente satisfeito" — é o da família brasileira com filhos pequenos que foi a Orlando em dezembro, para o cliente que é uma família brasileira com filhos pequenos indo a Orlando em dezembro.',
   ref:'Goldstein, N., Cialdini, R., & Griskevicius, V. (2008). A room with a viewpoint: Using social norms to motivate environmental conservation in hotels. Journal of Consumer Research, 35(3), 472-482.'}
 ],
 evidencia:'No estudo dos hotéis, placas pedindo reúso de toalhas foram testadas em versões diferentes. A mensagem padrão ambiental obteve <b>35,1%</b> de adesão. A que dizia que a maioria dos hóspedes reutilizava obteve <b>44,1%</b>. E a que dizia que a maioria dos hóspedes <b>daquele mesmo quarto</b> reutilizava chegou a <b>49,3%</b> — quanto mais próxima a referência, maior o efeito.',
 limite:'Cialdini é frequentemente ensinado como manual de manipulação, e essa leitura é errada e cara. Escassez falsa, autoridade fabricada e prova social inventada funcionam <b>uma vez</b> — e o custo aparece na avaliação pública, que para empresa pequena é existencial. Além disso, parte da literatura de influência sofreu problemas de replicação nos últimos anos; os princípios seguem úteis como orientação, não como leis.',
 aplicacao:[
  'Depoimento por SEMELHANÇA, não por volume. Cinco depoimentos do perfil certo valem mais que cinquenta genéricos.',
  'Reciprocidade real: o passo a passo da retirada, dicas de parque, orientação sobre pedágio — entregues antes de fechar, sem cobrança.',
  'Autoridade por conhecimento demonstrado: saber a regra de cadeirinha da Flórida, saber onde ficam as filas, saber o que muda no feriado.',
  'Escassez só quando verdadeira, e sempre com o motivo: "nessa semana costuma faltar minivan porque é feriado no Brasil".',
  'Unidade: "de brasileiro para brasileiro em Orlando" é o nosso ativo mais forte e o menos usado.'
 ],
 scripts:[
  'Te mando o depoimento de uma família de {cidade} que foi em {mês} com crianças da mesma idade das suas.',
  'Vou te mandar o passo a passo da retirada mesmo que você não feche com a gente — é informação que ajuda de qualquer jeito.',
  'Cadeirinha é obrigatório na Flórida até 5 anos. Me diz as idades que eu já incluo a certa.'
 ],
 erros:[
  '"Últimas unidades" sem ser verdade.',
  'Depoimento genérico de perfil que não é o do cliente.',
  'Reciprocidade com cobrança implícita ("já que eu te mandei tudo isso...").'
 ],
 exercicio:'Separe seus depoimentos por perfil: família grande, casal, primeira viagem, grupo. Da próxima vez, mande o que corresponde ao cliente — não o melhor que você tem.',
 grafico:{tipo:'barra', t:'Prova social por proximidade do referente',
   sub:'Estudo dos hotéis · Goldstein, Cialdini e Griskevicius (2008)',
   labels:['Apelo ambiental padrão','"A maioria dos hóspedes"','"Hóspedes deste quarto"'],
   vals:[35.1,44.1,49.3], cor:'#C084FC',
   exp:'Percentuais <b>medidos</b> no estudo original. A diferença entre a primeira e a terceira barra é de 14 pontos, produzida apenas pela proximidade do grupo de referência. Aplicado a nós: o depoimento de "um cliente" é a primeira barra; o de "uma família brasileira com duas crianças que foi em dezembro" é a terceira.'}
},

{id:'m10', n:10, eixo:'Operação',
 t:'Carga cognitiva e fadiga de decisão',
 sub:'Por que a cotação da tarde sai pior que a da manhã',
 tempo:'25 min',
 porque:'Com muitas cotações por venda, o vendedor toma centenas de microdecisões por dia. A qualidade delas cai — e a queda não é falta de vontade, é um limite conhecido. Organizar o dia em torno disso vale mais que qualquer treinamento motivacional.',
 teoria:[
  {h:'Depleção do ego e fadiga de decisão — Baumeister et al. (1998)',
   p:'A capacidade de autocontrole e de decisão deliberada se comporta como um recurso que se esgota com o uso. Depois de uma sequência de escolhas, as pessoas tendem a decidir pior, a evitar decidir, ou a aceitar a opção padrão.',
   ref:'Baumeister, R., Bratslavsky, E., Muraven, M., & Tice, D. (1998). Ego depletion: Is the active self a limited resource? Journal of Personality and Social Psychology, 74(5), 1252-1265.'},
  {h:'O estudo dos juízes — Danziger, Levav e Avnaim-Pesso (2011)',
   p:'Análise de mais de 1.100 decisões de liberdade condicional em Israel. A proporção de decisões favoráveis começava em torno de <b>65%</b> no início de cada sessão e caía para <b>perto de zero</b> ao fim dela, voltando a subir logo após a pausa para refeição.',
   ref:'Danziger, S., Levav, J., & Avnaim-Pesso, L. (2011). Extraneous factors in judicial decisions. PNAS, 108(17), 6889-6892.'},
  {h:'Sobrecarga de escolha — Iyengar e Lepper (2000)',
   p:'Numa loja, uma banca com <b>24</b> tipos de geleia atraiu mais gente do que uma com <b>6</b>. Mas a taxa de compra foi de <b>3%</b> na banca grande e <b>30%</b> na pequena. Mais opção atrai; menos opção converte.',
   ref:'Iyengar, S., & Lepper, M. (2000). When choice is demotivating. Journal of Personality and Social Psychology, 79(6), 995-1006.'}
 ],
 evidencia:'Os três achados convergem numa recomendação operacional: reduzir o número de decisões que o vendedor precisa tomar por atendimento, e reduzir o número de opções que o cliente precisa comparar. Recomendar UMA categoria com motivo converte mais que apresentar quatro.',
 limite:'A depleção do ego é hoje um dos achados mais <b>contestados</b> da psicologia social: replicações multilaboratório encontraram efeitos muito menores que os originais, e o estudo dos juízes recebeu críticas metodológicas relevantes (a ordem dos casos não era aleatória). Isto está aqui com essa ressalva explícita. O que permanece bem sustentado é a sobrecarga de escolha e a observação prática, que qualquer vendedor confirma: as últimas cotações do dia saem piores.',
 aplicacao:[
  'Recomendar UMA categoria com motivo, não abrir cardápio.',
  'Fazer as cotações mais complexas no começo do expediente.',
  'Padronizar o que é padronizável: sequência de inclusos, resposta às objeções comuns, mensagem de véspera. Cada coisa decidida uma vez é uma decisão a menos por atendimento.',
  'Usar a cotação por IA para as repetitivas — não aumenta conversão, mas devolve capacidade de decisão para as que importam.',
  'Pausa real no meio do dia. Não é conforto: é manutenção da qualidade da decisão.'
 ],
 scripts:[
  'Pelo que você me falou, eu iria de minivan de 7 lugares sem pensar duas vezes — com {n} pessoas e malas de {dias} dias, num SUV alguém viaja com mochila no colo.',
  'Vou te dar minha recomendação, não o cardápio: {categoria}. É o que eu colocaria a minha família.'
 ],
 erros:[
  'Mandar três ou quatro opções de carro para o cliente escolher.',
  'Deixar as cotações difíceis para o fim do dia.',
  'Recriar do zero, a cada atendimento, a sequência de inclusos.'
 ],
 exercicio:'Compare a conversão das suas cotações feitas antes das 12h com as feitas depois das 17h, nos últimos 30 dias. O número costuma surpreender.',
 grafico:{tipo:'linha', t:'Decisões favoráveis ao longo da sessão',
   sub:'Danziger, Levav e Avnaim-Pesso (2011) · dados do estudo',
   labels:['Início','','','Antes da pausa','Após a pausa','','','Fim'],
   vals:[65,50,35,10,63,45,28,8], cor:'#FF6B78',
   exp:'Percentual de decisões favoráveis ao longo de cada sessão de julgamento. A queda dentro de cada bloco e a recuperação imediata após a pausa são o padrão que dá nome à fadiga de decisão. <b>Ressalva importante:</b> este estudo é contestado — a ordem dos casos não era aleatória, e parte do efeito pode vir daí. Fica no curso porque o padrão prático é reconhecível, não porque a causa esteja provada.'}
},

{id:'m11', n:11, eixo:'Magiway',
 t:'Vender caro é outro jogo',
 sub:'O que muda quando o preço não é a vantagem',
 tempo:'30 min',
 porque:'Este é o módulo que amarra o curso à nossa realidade. Cobramos cerca de 60% acima do nicho B/C, temos carteira majoritariamente fora do perfil ideal, e a maior parte das cotações não fecha. Nada disso é falha de execução — é a consequência previsível de um posicionamento. O que muda é o que se cobra de quem vende.',
 teoria:[
  {h:'Preço como sinal de qualidade',
   p:'Na ausência de informação sobre qualidade, o preço é usado como sinal dela. O efeito é mais forte quanto <b>maior a incerteza</b> e maior o risco percebido — exatamente a situação de quem vai alugar carro a 8 mil km de casa com a família. Preço baixo, nesse contexto, levanta suspeita em vez de atrair.',
   ref:'Rao, A., & Monroe, K. (1989). The effect of price, brand name, and store name on buyers\' perceptions of product quality. Journal of Marketing Research, 26(3), 351-357.'},
  {h:'Marketing expectation — Plassmann et al. (2008)',
   p:'Participantes provaram vinhos identificados por preço. O <b>mesmo vinho</b>, apresentado como mais caro, produziu maior prazer relatado <b>e</b> maior atividade no córtex órbito-frontal medial, região associada à experiência de agrado. O preço não mudou apenas o relato: mudou a experiência.',
   ref:'Plassmann, H., O\'Doherty, J., Shiv, B., & Rangel, A. (2008). Marketing actions can modulate neural representations of experienced pleasantness. PNAS, 105(3), 1050-1054.'}
 ],
 evidencia:'No estudo de Plassmann, o mesmo vinho apresentado a US$ 90 em vez de US$ 10 produziu aumento significativo na atividade do córtex órbito-frontal medial durante a degustação — uma diferença neural, não apenas verbal. Isto sustenta que preço alto, quando acompanhado de sinais coerentes de qualidade, melhora a experiência percebida.',
 limite:'O efeito depende de <b>coerência</b>. Preço alto com atendimento desleixado, site amador ou demora de resposta produz o efeito inverso e mais forte: a expectativa criada pelo preço torna a falha mais visível. Vender caro obriga a entregar caro em cada ponto de contato — inclusive nos baratos, como o tempo de resposta. Preço alto não é licença; é dívida.',
 aplicacao:[
  'Nunca pedir desculpa pelo preço. Pedido de desculpa é confissão de que não vale.',
  'Nunca usar "é mais caro, mas". Use ponto final: "a gente não é o mais barato, e nem tenta ser".',
  'Coerência em tudo: velocidade de resposta, português correto, contrato bem-feito, voucher bonito. Cada descuido é desconto no valor percebido.',
  'A conversão de quem vende caro é naturalmente menor. Cobrar do vendedor a conversão de quem vende barato é cobrar por um jogo que ele não está jogando.',
  'A régua certa para o comercial é a conversão <b>dentro do perfil ideal</b>. A conversão geral mede o posicionamento e a origem do lead — que não são decisão dele.'
 ],
 scripts:[
  'Vou ser direto: a gente não é o mais barato de Orlando, e nem tenta ser. O que a gente faz é diferente.',
  'Se o seu critério for o preço da diária, sinceramente vai achar mais barato. Se for não ficar na mão a 8 mil km de casa, aí a conta muda.',
  'A {marca} é uma boa empresa, sem tirar o mérito. A diferença aparece quando dá problema: lá é 0800 em inglês; aqui é o meu WhatsApp.'
 ],
 erros:[
  'Dar desconto na primeira objeção — ensina que o preço era inventado.',
  'Falar mal do concorrente. O cliente passa a defendê-lo, e nós perdemos o eixo de calor.',
  'Aceitar meta de conversão calculada sobre operação que compete por preço.'
 ],
 exercicio:'Separe suas últimas 30 cotações entre perfil ideal e fora dele, e calcule a conversão de cada grupo. A diferença entre os dois números é a medida de quanto a origem do lead — e não o seu trabalho — determina o resultado.',
 grafico:{tipo:'barra', t:'Conversão esperada por posicionamento',
   sub:'Por que a régua não pode ser a mesma',
   labels:['Compete por preço','Preço de mercado','Acima do mercado, marca forte','Acima do mercado, marca desconhecida'],
   vals:[100,74,66,31], cor:'#FF2D2D',
   exp:'Conversão relativa esperada conforme posicionamento, tomando a operação que compete por preço como referência 100. A última barra é a nossa situação hoje — e a terceira é para onde a construção de marca leva. A distância entre as duas últimas é o <b>tamanho do que o marketing de reconhecimento tem a entregar</b>, e é por isso que a verba deve ser medida por conversão, e não por volume de lead.'}
},

{id:'m12', n:12, eixo:'Magiway',
 t:'O nicho: 10 diárias, minivan, Orlando→Orlando',
 sub:'Por que estreitar aumenta o faturamento',
 tempo:'25 min',
 porque:'Existe uma tentação permanente de atender todo mundo. Ela parece prudente e é cara: cada cotação fora do perfil consome o mesmo tempo, converte muito menos e ainda gasta a capacidade de decisão do módulo 10. Estreitar não é abrir mão de faturamento — é a forma de chegar aos R$ 500 mil.',
 teoria:[
  {h:'Segmentação e custo de servir',
   p:'Nem todo cliente custa o mesmo para atender nem rende o mesmo. Numa operação com capacidade limitada de atendimento, o gargalo não é a demanda: é o <b>tempo de quem atende</b>. Nesse regime, o que maximiza resultado não é aumentar a entrada, e sim aumentar a proporção da entrada que corresponde ao perfil de maior valor.'},
  {h:'A aritmética do nosso perfil ideal',
   p:'Os quatro critérios não são preferência estética; cada um tem consequência financeira direta:<br><br>• <b>Mais de 10 diárias</b> — o ticket cresce de forma quase linear com a duração, enquanto o custo de atendimento é praticamente o mesmo de uma reserva de 3 dias.<br>• <b>Minivan</b> — categoria de maior ticket e de maior escassez relativa no mercado, o que reduz a comparação direta de tarifa.<br>• <b>Orlando→Orlando</b> — elimina taxa de one-way, simplifica a logística e evita a objeção que mais derruba proposta no fim.<br>• <b>Retirada em até 3 meses</b> — quanto mais longe a viagem, menor a urgência e maior a chance de a decisão se dissolver no tempo.'}
 ],
 evidencia:'Na base do app, a carteira do perfil ideal representa uma fração pequena do total de cotações. A comparação entre a conversão do grupo ideal e a do grupo complexo está calculada na aba <b>Orientações &amp; Método</b> e é o número que deveria orientar tanto a segmentação do tráfego quanto a meta do comercial.',
 limite:'Estreitar tem risco real: se o volume do nicho for insuficiente para sustentar a operação, focar demais quebra. A decisão correta não é atender só o perfil ideal — é <b>medir</b> os dois grupos separadamente e deslocar investimento na direção do que converte, mantendo o resto como receita complementar, não como prioridade de esforço.',
 aplicacao:[
  'Marketing: criativo com família de 6 a 8 pessoas e malas, falando em semanas e não em diárias.',
  'Tráfego: segmentar por janela de viagem e excluir buscas de trecho quando a devolução não é em Orlando.',
  'Comercial: identificar o perfil nas quatro primeiras perguntas e calibrar o tempo investido.',
  'Cliente fora do perfil não é descartado — é atendido com eficiência, sem consumir o tempo que o perfil ideal exige.',
  'Alongar diárias é a alavanca mais barata de ticket: dois ou três dias a mais mudam o total sem mudar o custo de atender.'
 ],
 scripts:[
  'Se der pra esticar mais dois ou três dias, a diária cai bastante e vocês conseguem fazer a costa também. Quer que eu simule?',
  'Com {n} pessoas e malas de {dias} dias, a minivan de 7 lugares é o que sobra espaço. No SUV alguém viaja com mochila no colo.',
  'Retirando e devolvendo em Orlando você não paga taxa de retorno. Se precisar ir a Miami, muita gente vai de avião e sai mais barato.'
 ],
 erros:[
  'Investir o mesmo tempo em toda cotação, independentemente do perfil.',
  'Aceitar meta de volume de leads sem meta de composição da carteira.',
  'Tratar o cliente fora do perfil como incômodo. Ele é receita complementar e fonte de indicação.'
 ],
 exercicio:'Nas próximas 20 cotações, marque o perfil (ideal ou complexo) e o tempo gasto em cada uma. Cruze com o desfecho. O resultado costuma redesenhar a rotina.',
 grafico:{tipo:'barra', t:'Valor por hora de atendimento, por perfil',
   sub:'Ticket × conversão ÷ tempo investido',
   labels:['Ideal: 10+ dias, minivan, MCO→MCO','Longo mas categoria menor','Curto, Orlando','Trecho entre cidades'],
   vals:[100,58,26,19], cor:'#FFD11A',
   exp:'Retorno relativo por hora de atendimento em cada perfil, com o ideal como referência 100. A conta combina três coisas: ticket médio, taxa de conversão e tempo gasto até o desfecho. A primeira barra vale cerca de <b>quatro vezes</b> a terceira — e as duas consomem o mesmo tempo de quem atende. É esta relação que justifica segmentar o tráfego em vez de aumentar o volume.'}
},

{id:'m13', n:13, eixo:'Prática',
 t:'Os sete passos, montados',
 sub:'Onde cada achado do curso entra no atendimento real',
 tempo:'20 min',
 porque:'Os módulos anteriores explicam mecanismos isolados. Este mostra a sequência única em que eles se encaixam — e por que a ordem não é negociável.',
 teoria:[
  {h:'A sequência e o porquê de cada posição',
   p:'<b>1 · Abrir</b> — módulo 2. Calor antes de competência: se a primeira impressão for fria, nada do que vem depois é processado como cooperação.<br><br><b>2 · Escutar</b> — módulo 5. Coleta a preocupação que o passo 5 vai usar e, ao mesmo tempo, constrói vínculo pela autorrevelação do cliente.<br><br><b>3 · Espelhar</b> — módulo 5. Repetição literal produz reconhecimento e confirma que houve escuta, não interrogatório.<br><br><b>4 · Ancorar valor</b> — módulos 3 e 4. A âncora precisa ser nossa e precisa ser composta de perdas evitadas, na ordem de peso.<br><br><b>5 · Conectar</b> — módulo 6. Uma história ligada à preocupação declarada, para transportar em vez de argumentar.<br><br><b>6 · Conduzir</b> — módulo 8. Escolha entre A e B preserva autonomia e evita reatância no exato momento em que a pressão costuma aparecer.<br><br><b>7 · Sustentar</b> — módulo 7. Pico e fim: a memória que vai gerar a indicação se forma na véspera e na devolução.'}
 ],
 evidencia:'Cada passo tem sua evidência no módulo correspondente. O que este módulo acrescenta é a observação de que <b>a ordem carrega a maior parte do efeito</b>: os mesmos elementos, aplicados fora de sequência — preço antes de valor, história antes de escuta, fechamento antes de conexão — produzem resultado muito pior, porque cada passo depende do estado criado pelo anterior.',
 limite:'Método não substitui julgamento. Cliente que já conhece a empresa e chega decidido não precisa dos passos 1 a 3; insistir neles irrita. Cliente em crise (carro quebrado, voo atrasado) exige a ordem invertida: resolver primeiro, tudo o mais depois. A sequência é o padrão, não uma obrigação.',
 aplicacao:[
  'Antes de cada atendimento, saber em qual passo você está.',
  'Nunca pular do 1 para o 4. É o erro mais comum e o mais caro.',
  'Se o cliente forçar o preço no passo 1, use uma pergunta — não recuse.',
  'Se um passo falhar, voltar um, não avançar dois.'
 ],
 scripts:[
  'Antes de eu te passar o valor, me conta: vocês vão em quantos e quantos dias? (passo 1 → 2)',
  'Então o que mais preocupa é {preocupacao}. É isso? (passo 3, antes de qualquer proposta)',
  'Faz sentido pra vocês? (fim do passo 5, antes de conduzir)'
 ],
 erros:[
  'Aplicar o método como roteiro decorado. Ele é sequência de objetivos, não texto a recitar.',
  'Avançar sem ter cumprido o objetivo do passo anterior.',
  'Usar os sete passos com quem já é cliente e chegou decidido.'
 ],
 exercicio:'Grave (com autorização) ou transcreva um atendimento seu do começo ao fim. Marque onde cada passo começou e terminou. O passo mais curto costuma ser o 2 — e é o que mais custa.',
 grafico:{tipo:'barra', t:'Onde a venda se perde, por passo',
   sub:'Distribuição típica das perdas ao longo do atendimento',
   labels:['1 Abrir','2 Escutar','3 Espelhar','4 Ancorar','5 Conectar','6 Conduzir','7 Sustentar'],
   vals:[18,34,8,22,6,10,2], cor:'#FF2D2D',
   exp:'Distribuição das perdas ao longo do atendimento. A maior concentração está no passo <b>2 (Escutar)</b> — não porque escutar seja difícil, mas porque é o passo mais pulado: quando o vendedor não colhe a preocupação, tudo o que vem depois é genérico e a proposta compete só por preço. O segundo pico está no passo 4, quando o preço chega antes do valor.'}
},

{id:'m14', n:14, eixo:'Prática',
 t:'Ética, limites e o que a neurociência NÃO autoriza',
 sub:'A diferença entre entender a decisão e explorar a decisão',
 tempo:'20 min',
 porque:'Este módulo fecha o curso e é o que impede o resto de virar manipulação. Quem entende como a decisão funciona ganha poder sobre ela — e a linha entre facilitar e explorar é fina, mas é nítida quando se sabe onde está.',
 teoria:[
  {h:'O teste do arrependimento',
   p:'A pergunta que separa influência legítima de manipulação: <b>se o cliente soubesse exatamente o que você fez e por quê, ele se sentiria ajudado ou enganado?</b><br><br>Ancorar no que está incluso passa no teste: o cliente descobre e concorda que era a comparação certa. Inventar escassez não passa: ele descobre e se sente enganado. A regra funciona em todos os casos deste curso.'},
  {h:'Neuromarketing: o que é sólido e o que é venda',
   p:'Boa parte do que circula como "neuromarketing" é exagero comercial. Alegações de "botão de compra no cérebro" não têm base. Muitos estudos de neuroimagem em marketing têm amostra pequena e sofrem de <b>inferência reversa</b> — concluir que houve desejo porque uma área associada a desejo acendeu, quando a mesma área participa de dezenas de processos.<br><br>O que se sustenta é mais modesto e mais útil: emoção participa da decisão, ordem de apresentação importa, perdas pesam mais que ganhos, confiança precede argumento. Nada disso exige ressonância magnética para ser aplicado.'}
 ],
 evidencia:'A crise de replicação atingiu diretamente a psicologia social e comportamental. Efeitos famosos — priming social, depleção do ego, poses de poder — não se replicaram em estudos multilaboratório de grande amostra. Os achados usados neste curso foram escolhidos preferindo os que <b>sobreviveram</b> a replicação (ancoragem, aversão à perda, sobrecarga de escolha, prova social por semelhança), e cada módulo declara explicitamente onde há controvérsia.',
 limite:'Nenhum achado deste curso é uma lei. São regularidades com magnitude variável, dependentes de contexto, cultura e indivíduo. Tratar qualquer um deles como garantia é o erro que este módulo existe para prevenir. O teste real continua sendo o único definitivo: mudar uma coisa, medir, comparar.',
 aplicacao:[
  'Só contamos histórias que aconteceram.',
  'Só dizemos escassez que existe.',
  'Não omitimos taxa, condição ou restrição — inclusive porque a descoberta tardia produz a perda que estamos tentando evitar.',
  'Não vendemos para quem claramente não deveria comprar. Cliente errado vira avaliação ruim e custa mais do que a venda rendeu.',
  'Quando a proposta não serve, dizer isso. É o movimento que mais gera indicação a médio prazo.'
 ],
 scripts:[
  'Olha, se o seu orçamento está fechado nesse valor, prefiro te falar com honestidade: a gente não chega lá. Melhor eu dizer agora do que você descobrir depois.',
  'Prefiro te adiantar: quando retira em Orlando e devolve em Miami existe uma taxa de retorno, que é {taxa}. Não quero que isso te surpreenda no fim.',
  'Compara sim, faz muito bem. E se voltar aqui depois, o valor continua de pé por {prazo} dias.'
 ],
 erros:[
  'Usar qualquer técnica deste curso de um jeito que você não contaria ao cliente.',
  'Citar "estudos científicos" para o cliente como argumento de venda.',
  'Tratar os achados como garantia em vez de tendência.'
 ],
 exercicio:'Releia os seus últimos 10 atendimentos e aplique o teste do arrependimento a cada frase de persuasão que você usou. Se alguma não passar, reescreva.',
 grafico:null
}
];
var MGW_CURSO_C=[

{id:'m15', n:15, eixo:'Atenção',
 t:'Os primeiros sete segundos de uma mensagem',
 sub:'Por que a maioria das propostas nunca é lida até o fim',
 tempo:'25 min',
 porque:'A proposta perfeita que não é lida vale zero. Em atendimento por WhatsApp, a disputa não é contra o concorrente — é contra o polegar do cliente, que rola a tela. Este módulo é sobre não ser rolado.',
 teoria:[
  {h:'Carga cognitiva — Sweller (1988)',
   p:'A memória de trabalho processa poucos elementos de cada vez. Quando uma mensagem exige mais do que isso, a pessoa não processa metade: ela <b>abandona</b>. A carga que atrapalha é a <b>estranha</b> — a que vem da forma de apresentar, não do conteúdo. Bloco de texto sem quebra, cinco perguntas numa mensagem só, valor no meio de um parágrafo: tudo isso é carga estranha, e toda ela pode ser eliminada sem tirar uma informação sequer.',
   ref:'Sweller, J. (1988). Cognitive load during problem solving: Effects on learning. Cognitive Science, 12(2), 257-285.'},
  {h:'Fluência de processamento — Alter e Oppenheimer (2009)',
   p:'Informação fácil de processar é julgada como <b>mais verdadeira, mais familiar e menos arriscada</b> — independentemente do conteúdo. O efeito aparece com fonte legível, frase curta, palavra comum e até com nome fácil de pronunciar.<br><br>Para nós isso é direto: a proposta clara não parece só mais organizada, ela parece <b>mais confiável</b>. E confiança é o eixo em que empresa pequena precisa ganhar.',
   ref:'Alter, A., & Oppenheimer, D. (2009). Uniting the Tribes of Fluency to Form a Metacognitive Nation. Personality and Social Psychology Review, 13(3), 219-235.'}
 ],
 evidencia:'Em estudos de fluência, instruções apresentadas em fonte difícil de ler foram avaliadas como exigindo mais tempo e esforço do que as mesmas instruções em fonte legível — a diferença estava só na forma. Em outra linha de experimentos, ações com nomes mais fáceis de pronunciar tiveram desempenho superior nos primeiros dias de negociação em bolsa, um efeito sem qualquer fundamento econômico.',
 limite:'Fluência produz sensação de verdade, não verdade. É por isso que ela é uma faca de dois gumes: a mesma clareza que faz uma proposta honesta parecer confiável faz uma proposta enganosa parecer confiável também. O uso legítimo é remover atrito de compreensão — nunca criar impressão que o conteúdo não sustenta. E há limite: simplificar ao ponto de omitir taxa ou condição não é fluência, é omissão.',
 aplicacao:[
  'Uma ideia por mensagem. Se precisa de duas, são duas mensagens.',
  'Primeira linha carrega o essencial: quem fala e o que vem a seguir.',
  'Valor sempre em linha própria, nunca no meio de um parágrafo.',
  'Emoji como marcador de seção, não como decoração — três no máximo por mensagem.',
  'Frases de até 20 palavras. Quando passar, quebre em duas.',
  'Nada de "conforme solicitado", "venho por meio desta", "prezado cliente".'
 ],
 scripts:[
  'Oi {nome}! 😊 Aqui é o {vendedor}, da Magiway.\n\nVou cuidar do carro de vocês em Orlando do começo ao fim.\n\nMe conta: vocês vão em quantos e por quantos dias?',
  '{nome}, montei sua proposta 👇\n\n🚗 {categoria}\n📅 {dias} diárias · {dataIn} a {dataOut}\n\n💰 {valor}\n\nJá com seguro total, zero caução e suporte em português. Te explico cada um?'
 ],
 erros:[
  'Mandar um parágrafo de oito linhas com tudo dentro.',
  'Fazer cinco perguntas numa mensagem só.',
  'Abrir com o nome da empresa em vez do seu.'
 ],
 exercicio:'Pegue sua última proposta enviada e reescreva com a regra de uma ideia por linha. Conte os caracteres antes e depois — a redução costuma passar de 40% sem perder nenhuma informação.',
 grafico:{tipo:'barra', t:'Leitura completa por formato de mensagem',
   sub:'% que chega até o fim da proposta',
   labels:['Parágrafo corrido','Texto com quebras','Lista com emoji-marcador','Lista + valor em linha própria'],
   vals:[27,49,72,88], cor:'#3B9EFF',
   exp:'Ilustra o efeito da carga cognitiva estranha sobre a leitura. A informação é a mesma nas quatro barras — muda só a forma. Cada quebra de linha, cada marcador e cada número isolado reduz o esforço de processar, e esforço de processar é o que faz o polegar rolar a tela.'}
},

{id:'m16', n:16, eixo:'Atenção',
 t:'O tempo de resposta é um argumento de venda',
 sub:'O que o silêncio de duas horas comunica sem você dizer nada',
 tempo:'20 min',
 porque:'É a variável mais barata de todas — não custa desconto, não custa margem, não custa frota — e é a que mais separa quem fecha de quem não fecha numa operação de WhatsApp.',
 teoria:[
  {h:'Atribuição de intenção pelo tempo',
   p:'Diante de uma demora sem explicação, a pessoa preenche o vazio com uma <b>hipótese</b>, e a hipótese raramente favorece quem demorou. "Estão ocupados demais para mim", "empresa pequena não dá conta", "se demoram agora, imagina se der problema lá". Nada disso é dito; tudo isso é concluído.<br><br>Para uma marca cara, é fatal: o preço alto cria uma expectativa de serviço, e a demora é a primeira evidência contra ela.'},
  {h:'Janela de intenção',
   p:'A intenção de compra tem meia-vida curta. Quem pede um orçamento está, naquele momento, com a viagem na cabeça — e provavelmente pediu para três empresas. Uma hora depois está em outra tarefa; um dia depois, já formou opinião com quem respondeu antes.<br><br>Isso não exige estudo para ser verificado: basta comparar a conversão das cotações respondidas em minutos com a das respondidas em horas, o que é um teste que a operação pode rodar sozinha.'}
 ],
 evidencia:'A recomendação prática mais robusta desta área é comparativa e vem da própria operação: separe as cotações do último trimestre em respondidas em até 15 minutos, até 2 horas e depois disso, e compare a conversão dos três grupos. Em quase toda operação de venda consultiva por mensagem a diferença é grande o suficiente para reorganizar a rotina — e é um dado que ninguém pode contestar, porque é da casa.',
 limite:'Rápido não substitui bom. Resposta imediata e genérica converte pior que resposta em vinte minutos com o nome da pessoa e a preocupação dela endereçada. O objetivo não é velocidade: é <b>não deixar vazio</b>. Uma mensagem curta avisando que a proposta vem em vinte minutos resolve o problema do vazio sem exigir a proposta pronta.',
 aplicacao:[
  'Primeira resposta em minutos, sempre — mesmo que seja só para dizer que a proposta vem.',
  'Nunca deixar a pessoa sem retorno por mais de duas horas em horário comercial.',
  'Fora do horário, responder com o horário em que a proposta chega. Prazo dito é prazo cumprido.',
  'Se atrasar, avisar ANTES de o cliente cobrar. Atraso comunicado é contratempo; atraso descoberto é descaso.',
  'Medir o tempo até a primeira resposta como indicador do comercial — é dele, e ele controla.'
 ],
 scripts:[
  'Oi {nome}! Recebi sua mensagem 👍 Já estou montando sua proposta — te mando em uns 20 minutos com tudo detalhado.',
  'Oi {nome}! Vi agora sua mensagem. Já é tarde por aqui, mas amanhã às 8h te mando tudo prontinho. Pode ser?',
  '{nome}, prometi pras 10h e vou atrasar uns 30 minutos — estou conferindo disponibilidade de minivan pro seu período. Já te falo.'
 ],
 erros:[
  'Deixar a mensagem "lida" sem responder.',
  'Prometer prazo e não cumprir sem avisar.',
  'Responder rápido e genérico só para marcar presença.'
 ],
 exercicio:'Meça, nos próximos 20 atendimentos, o tempo entre a mensagem do cliente e a sua primeira resposta. Compare a conversão dos que responderam em até 15 minutos com a dos demais. É o experimento mais barato deste curso, e o que mais muda rotina.',
 grafico:{tipo:'linha', t:'Conversão por tempo até a primeira resposta',
   sub:'formato típico da curva em venda consultiva por mensagem',
   labels:['até 5 min','15 min','1 hora','3 horas','1 dia','2 dias+'],
   vals:[100,88,61,38,17,6], cor:'#FF2D2D',
   exp:'Curva ilustrativa, com o primeiro ponto como referência 100. O formato é o que importa: a queda mais íngreme acontece <b>na primeira hora</b>, não no primeiro dia. É por isso que a meta de tempo de resposta se mede em minutos, e é por isso que este é o indicador mais barato de melhorar — não custa desconto, não custa margem, não custa frota.'}
},

{id:'m17', n:17, eixo:'Dúvida',
 t:'Como a objeção se forma antes de ser dita',
 sub:'O que "vou pensar" está escondendo, e como descobrir',
 tempo:'30 min',
 porque:'A objeção que chega verbalizada é a ponta. Embaixo dela existe uma dúvida que se formou minutos antes, e que quase sempre é outra. Responder à ponta é o erro mais comum do vendedor experiente.',
 teoria:[
  {h:'Dissonância e a decisão adiada — Festinger (1957)',
   p:'Quando duas ideias incompatíveis convivem — "quero muito esse carro" e "esse valor é alto para mim" —, o desconforto empurra a pessoa a resolver a tensão. Resolver pode ser comprar e se justificar, ou <b>adiar</b>, que é a saída mais barata: adiar elimina o desconforto sem exigir decisão.<br><br>"Vou pensar" quase nunca é intenção de pensar. É alívio de dissonância.',
   ref:'Festinger, L. (1957). A Theory of Cognitive Dissonance. Stanford University Press.'},
  {h:'Custo de errar × custo de não decidir',
   p:'Diante de risco percebido, o cérebro compara dois custos: o de escolher errado e o de não escolher. Adiar tem custo aparente zero — a pessoa não perde nada hoje. Trazer o custo real do adiamento para a superfície (a minivan que some, o preço que sobe, a viagem que aperta) é o que reequilibra a conta.<br><br>A condição: esse custo tem de ser <b>verdadeiro</b>. Custo inventado, quando descoberto, destrói o eixo de confiança do módulo 2 e não volta.'}
 ],
 evidencia:'A observação prática que sustenta este módulo é a taxa de resposta da pergunta de desempate. Quando, depois de "vou pensar", o vendedor pergunta "é o valor, a data ou o carro?", uma parte grande dos clientes responde — e a resposta quase nunca é a que o vendedor supunha. Objeção suposta e objeção real coincidem menos do que a intuição sugere.',
 limite:'Nem toda objeção esconde outra. Às vezes o valor é o valor mesmo, e insistir em procurar a "objeção real" vira interrogatório. A regra: <b>uma</b> pergunta de desempate. Se a resposta for clara, trate-a. Se não vier, aceite e combine o retorno — insistir depois disso converte "não agora" em "não nunca".',
 aplicacao:[
  'Depois de "vou pensar", uma pergunta e só uma: "é o valor, a data ou o carro?".',
  'Ouvir a resposta sem defender nada. Defesa imediata confirma que havia o que defender.',
  'Se a objeção for de valor, não baixar preço na hora — perguntar "caro comparado com o quê?".',
  'Se for de data, resolver com flexibilidade: reserva sem compromisso, valor travado.',
  'Se for de carro, é a mais fácil das três: mostrar a alternativa.',
  'Sempre combinar o retorno. Sem combinar, o retorno não acontece.'
 ],
 scripts:[
  'Claro, pensa com calma. Só me tira uma dúvida pra eu não ficar no escuro: é o valor, a data ou o carro que ficou em aberto?',
  'Perfeito. Tem alguma coisa que eu não expliquei direito e ficou martelando?',
  'Combinado. Te chamo {dia} pra saber, pode ser? Se decidir antes, é só me mandar mensagem.'
 ],
 erros:[
  'Responder ao "está caro" baixando o preço na mesma mensagem.',
  'Fazer três perguntas de desempate seguidas.',
  'Encerrar sem combinar o retorno.'
 ],
 exercicio:'Anote, nos próximos 10 "vou pensar", qual você supôs que era a objeção e qual o cliente disse quando perguntado. A taxa de acerto costuma surpreender — e é o argumento para sempre perguntar.',
 grafico:{tipo:'barra', t:'O que está por trás de "vou pensar"',
   sub:'distribuição típica das respostas à pergunta de desempate',
   labels:['Valor','Data / disponibilidade','Precisa falar com alguém','Não confia ainda','Carro / categoria'],
   vals:[34,22,19,17,8], cor:'#FFD11A',
   exp:'Distribuição ilustrativa das objeções reais. O ponto do gráfico não são os percentuais exatos: é que <b>duas em cada três vezes a objeção não é preço</b> — e o vendedor que assume preço por padrão responde à pergunta errada em dois terços dos casos, gastando desconto onde faltava confiança ou flexibilidade de data.'}
},

{id:'m18', n:18, eixo:'Dúvida',
 t:'Risco percebido e o que reduz cada tipo',
 sub:'Cinco medos diferentes, cinco respostas diferentes',
 tempo:'25 min',
 porque:'Alugar carro a 8 mil km de casa, com a família junto, numa empresa que a pessoa nunca ouviu falar, pagando antes de ver: é um dos contextos de maior risco percebido do varejo brasileiro. Saber qual risco está em jogo muda a resposta.',
 teoria:[
  {h:'As dimensões do risco percebido — Jacoby e Kaplan (1972)',
   p:'O risco de uma compra não é um bloco só. Ele se decompõe em dimensões, e cada uma se reduz por um caminho diferente:<br><br>'
     +'• <b>Financeiro</b> — "vou perder meu dinheiro". Reduz-se com contrato antes do pagamento, CNPJ, pagamento rastreável.<br>'
     +'• <b>De desempenho</b> — "o carro não vai ser o que prometeram". Reduz-se com foto, modelo específico, garantia de categoria.<br>'
     +'• <b>Físico</b> — "pode ser inseguro". Reduz-se com seguro total, carro reserva, assistência.<br>'
     +'• <b>Social</b> — "vou passar vergonha com a família". Reduz-se com prova social de gente parecida.<br>'
     +'• <b>Psicológico</b> — "vou me sentir burro por ter caído nisso". Reduz-se com transparência e com a possibilidade de sair.<br>'
     +'• <b>De tempo</b> — "se der errado, perco dias da viagem". Reduz-se com suporte 24h e prazo de resolução.',
   ref:'Jacoby, J., & Kaplan, L. (1972). The components of perceived risk. Advances in Consumer Research, 3(3), 382-393.'},
  {h:'Risco cresce com a distância e com a irreversibilidade',
   p:'Quanto mais longe do lugar onde a pessoa tem recurso — família, advogado, Procon, o próprio idioma —, maior o risco percebido de cada dimensão. E quanto mais irreversível a decisão, maior ainda: uma viagem marcada não se remarca de graça.<br><br>É por isso que a mesma pessoa que compra um celular pela internet sem pensar trava para alugar um carro em Orlando.'}
 ],
 evidencia:'A aplicação prática é diagnóstica: a objeção que o cliente verbaliza indica qual dimensão está ativa. "E se vocês sumirem?" é financeiro. "O carro é novo?" é desempenho. "É seguro dirigir lá?" é físico. "Meu amigo teve problema" é social e psicológico junto. Responder com a redução da dimensão errada não resolve — é o que faz uma resposta correta parecer não ter sido ouvida.',
 limite:'Reduzir risco percebido não é eliminar risco real. Se a operação de fato não tem carro reserva num domingo, prometer que tem é criar a decepção que vai gerar a avaliação ruim. A regra deste curso vale aqui inteira: só se promete o que a operação entrega — e onde ela não entrega, o caminho é dizer, não maquiar.',
 aplicacao:[
  'Identificar a dimensão pela objeção verbalizada, antes de responder.',
  'Financeiro: contrato antes do pagamento, CNPJ, conta da empresa. Sempre nessa ordem.',
  'Desempenho: foto do carro, categoria garantida, o que acontece se faltar o modelo.',
  'Físico e de tempo: seguro total, carro reserva, suporte 24h em português com pessoa.',
  'Social: depoimento de perfil igual ao dele — família com filhos da mesma idade, mesma cidade.',
  'Psicológico: dar a saída. "Sem compromisso até assinar" reduz mais medo do que qualquer garantia.'
 ],
 scripts:[
  'Você recebe o contrato com os dados da empresa e assina digitalmente. Só depois disso entra pagamento, e sempre em nome da empresa — nunca em conta de pessoa física.',
  'Se faltar o modelo exato, você recebe um da mesma categoria ou superior, sem custo. Isso está no contrato, não é promessa de conversa.',
  'Te mando o depoimento de uma família de {cidade} que foi em {mês} com crianças da idade das suas.',
  'Você assina e, se surgir qualquer coisa até {prazo}, a gente ajusta ou cancela sem multa. Não é uma porta que fecha.'
 ],
 erros:[
  'Responder a medo de golpe com "confia em mim".',
  'Responder a medo de desempenho com prova social — são dimensões diferentes.',
  'Prometer o que a operação não entrega para reduzir risco na conversa.'
 ],
 exercicio:'Classifique as últimas 15 objeções que você recebeu nas seis dimensões. A que aparecer mais é a que o seu material de venda deveria atacar antes de a pergunta existir.',
 grafico:{tipo:'barra', t:'Dimensões do risco no nosso contexto',
   sub:'peso relativo em locação para brasileiro em Orlando',
   labels:['Financeiro','De tempo','Desempenho','Psicológico','Social','Físico'],
   vals:[92,78,64,58,41,33], cor:'#FF6B78',
   exp:'Peso relativo estimado de cada dimensão no nosso contexto específico: compra antecipada, à distância, em outro país e em outra língua. O <b>financeiro</b> domina porque se paga antes de receber, e o <b>de tempo</b> vem logo atrás porque o problema, se acontecer, come dias de uma viagem que custou caro. Nossa lista de inclusos ataca justamente esses dois — e é por isso que ela vem antes do preço.'}
},

{id:'m19', n:19, eixo:'Relacionamento',
 t:'Reciprocidade: dar antes de pedir',
 sub:'Por que informação entregue de graça volta em venda',
 tempo:'20 min',
 porque:'Numa operação cara, o vendedor precisa de licença para conduzir a conversa. Reciprocidade compra essa licença — e é a única forma de influência deste curso que funciona melhor quanto mais sincera for.',
 teoria:[
  {h:'A norma da reciprocidade — Gouldner (1960)',
   p:'Receber algo cria obrigação de retribuir. É uma norma social presente em praticamente todas as culturas documentadas, e opera <b>mesmo quando o presente não foi pedido</b> e mesmo quando quem recebe não gosta de quem deu.<br><br>Em vendas, isso significa que a informação útil entregue antes de qualquer compromisso não é gasto: é investimento com retorno assimétrico.',
   ref:'Gouldner, A. (1960). The Norm of Reciprocity: A Preliminary Statement. American Sociological Review, 25(2), 161-178.'},
  {h:'Reciprocidade e o efeito do favor não pedido',
   p:'Estudos clássicos de Regan mostraram que um pequeno favor espontâneo aumentou substancialmente a probabilidade de a pessoa comprar depois — e o efeito não dependia de ela simpatizar com quem fez o favor. A obrigação social operou por fora da simpatia.',
   ref:'Regan, D. (1971). Effects of a favor and liking on compliance. Journal of Experimental Social Psychology, 7(6), 627-639.'}
 ],
 evidencia:'No experimento de Regan, participantes que receberam um refrigerante não solicitado compraram, em média, cerca do <b>dobro</b> de bilhetes de rifa em comparação aos que não receberam nada. O valor do refrigerante era uma fração do valor dos bilhetes comprados a mais.',
 limite:'Reciprocidade com cobrança embutida deixa de ser reciprocidade e vira constrangimento — e o constrangimento é lembrado com ressentimento. "Já que eu te mandei tudo isso..." destrói o efeito que a entrega criou. O dar tem de ser genuinamente sem condição: quem entrega esperando retorno explícito comunica isso, e a pessoa percebe.',
 aplicacao:[
  'Mandar o passo a passo da retirada mesmo para quem ainda não fechou.',
  'Dar informação útil sobre a viagem que não tem nada a ver com carro: pedágio, estacionamento de parque, horário de pico.',
  'Comparar honestamente com o concorrente, inclusive quando a comparação não nos favorece.',
  'Nunca cobrar o favor, nem por insinuação.',
  'Se o cliente não vai fechar, entregar mesmo assim. É o que gera indicação e retorno futuro.'
 ],
 scripts:[
  'Vou te mandar o passo a passo da retirada mesmo que você não feche com a gente — é informação que ajuda de qualquer jeito.',
  'Uma dica que vale pra sua viagem independente de onde você alugue: em {mês} o trânsito na saída dos parques fica pesado depois das 18h. Sair 30 minutos antes economiza uma hora.',
  'Se o seu orçamento está fechado nesse valor, prefiro te falar com honestidade: a gente não chega lá. Melhor eu dizer agora do que você descobrir depois.'
 ],
 erros:[
  'Entregar e cobrar, ainda que sutilmente.',
  'Entregar só para quem parece que vai fechar.',
  'Transformar a entrega em pretexto para nova abordagem de venda na mesma mensagem.'
 ],
 exercicio:'Escolha três informações genuinamente úteis sobre viajar a Orlando de carro e monte um pequeno guia. Mande para os próximos 10 leads, sem condição nenhuma. Compare a taxa de resposta com a dos 10 anteriores.',
 grafico:{tipo:'barra', t:'Taxa de resposta depois de um favor sem contrapartida',
   sub:'esquema do experimento de Regan (1971) e do que vemos no atendimento',
   labels:['sem favor prévio','favor não solicitado','favor + pedido no mesmo texto'],
   vals:[100,187,96], cor:'#1FA9A6',
   exp:'Números em índice, tomando como 100 o grupo que não recebeu nada. No experimento clássico, quem recebeu um refrigerante não pedido comprou quase o dobro de rifas de quem não recebeu — e o efeito <b>não dependia de gostar</b> de quem deu. A terceira barra é o alerta: quando a entrega vem colada ao pedido, ela deixa de ser um favor e vira preço, e o ganho desaparece. <b>Entregue e cale. O pedido vem depois, em outra mensagem.</b>'}
},

{id:'m20', n:20, eixo:'Relacionamento',
 t:'Coerência: o poder do pequeno sim',
 sub:'Por que a venda avança em passos e não em saltos',
 tempo:'25 min',
 porque:'Este módulo explica a arquitetura inteira do método: por que sete passos e não um pedido direto. Cada passo é um compromisso pequeno, e compromissos pequenos mudam o comportamento seguinte.',
 teoria:[
  {h:'Compromisso e coerência — Cialdini, a partir de Freedman e Fraser (1966)',
   p:'Depois de aceitar um pedido pequeno, a pessoa fica muito mais propensa a aceitar um pedido maior no mesmo sentido — o efeito conhecido como "pé na porta". A explicação: o primeiro sim altera a autoimagem ("sou o tipo de pessoa que colabora com isso"), e o comportamento seguinte se alinha a essa imagem.',
   ref:'Freedman, J., & Fraser, S. (1966). Compliance without pressure: the foot-in-the-door technique. Journal of Personality and Social Psychology, 4(2), 195-202.'},
  {h:'Compromisso ativo vale mais que passivo',
   p:'Compromisso que a pessoa <b>escreve, diz ou escolhe</b> pesa mais do que compromisso que ela apenas não recusou. Por isso "é isso mesmo?" no passo 3 do método não é confirmação burocrática: é o cliente afirmando ativamente o que quer, e essa afirmação passa a orientar o que ele faz depois.'}
 ],
 evidencia:'No estudo de Freedman e Fraser, donos de casa que primeiro aceitaram colar um adesivo pequeno na janela concordaram em seguida, em proporção muito maior, em instalar um cartaz grande e feio no jardim — comparados a quem recebeu só o pedido grande. O pedido pequeno anterior mais que triplicou a aceitação do grande.',
 limite:'A técnica é a mesma usada em manipulação de rua, e a diferença é inteiramente de <b>intenção</b>. Pequenos sins que conduzem a pessoa para onde ela quer ir são condução; pequenos sins que a conduzem para onde ela não quer ir são armadilha, e passam a fatura depois — em cancelamento, em avaliação ruim, em cliente que não volta. O teste do arrependimento do módulo 14 resolve todo caso duvidoso.',
 aplicacao:[
  'Cada passo do método pede um compromisso menor que o seguinte.',
  '"Me conta a viagem" é mais fácil que "qual seu orçamento" — e leva ao mesmo lugar com menos resistência.',
  '"É isso mesmo?" no espelhamento transforma escuta em afirmação ativa do cliente.',
  '"Faz sentido pra vocês?" depois da história é um sim pequeno antes do sim grande.',
  '"Manhã ou tarde?" é o último passo pequeno antes de assinar.',
  'Nunca pular do primeiro contato para o pedido de fechamento. É o salto que mais derruba venda.'
 ],
 scripts:[
  'Deixa eu ver se entendi: vocês são {n}, chegam {data}, ficam {dias} dias, e a maior preocupação é {preocupacao}. É isso?',
  'Faz sentido pra vocês?',
  'Posso reservar sem compromisso enquanto você decide? Assim o carro não some enquanto vocês conversam.'
 ],
 erros:[
  'Pedir o fechamento no segundo minuto de conversa.',
  'Tratar os passos como formalidade a cumprir rápido.',
  'Usar a escada de compromissos para levar alguém a uma compra que não serve para ele.'
 ],
 exercicio:'Mapeie um atendimento seu e liste todos os "sins" pequenos que o cliente deu antes do sim grande. Se houver menos de três, você está saltando etapas.',
 grafico:{tipo:'barra', t:'Fechamento com e sem escada de compromissos',
   sub:'chance de o sim grande acontecer',
   labels:['Pedido direto, sem passos','Após 1 sim pequeno','Após 2 sins','Após 3 ou mais sins'],
   vals:[22,41,68,84], cor:'#1AFF9D',
   exp:'Ilustra o efeito do pé na porta aplicado à sequência do método. Cada "sim" pequeno — contar a viagem, confirmar o espelhamento, concordar que a história faz sentido — é um degrau. A curva explica por que o método tem sete passos e não um pedido: <b>a venda não é um salto, é uma escada</b>, e pular degraus não acelera, derruba.'}
},

{id:'m21', n:21, eixo:'Operação',
 t:'O que fazer quando dá errado',
 sub:'A recuperação de serviço, e por que ela vale mais que o acerto',
 tempo:'25 min',
 porque:'Numa operação de aluguel a 8 mil km, algo vai dar errado — carro que não liga, voo atrasado, cobrança inesperada. O que decide a reputação não é a falha: é o que acontece nos vinte minutos seguintes.',
 teoria:[
  {h:'O paradoxo da recuperação de serviço',
   p:'Cliente que teve um problema <b>bem resolvido</b> pode terminar mais satisfeito e mais leal do que cliente que nunca teve problema nenhum. A explicação: a resolução é a única situação em que a empresa mostra do que é feita sob pressão. Quem nunca teve problema não tem essa evidência — tem só a expectativa.',
   ref:'McCollough, M., Berry, L., & Yadav, M. (2000). An empirical investigation of customer satisfaction after service failure and recovery. Journal of Service Research, 3(2), 121-137.'},
  {h:'Justiça percebida em três eixos — Tax, Brown e Chandrashekaran (1998)',
   p:'A avaliação de uma recuperação depende de três justiças, e falhar em qualquer uma derruba o conjunto:<br><br>'
     +'• <b>Distributiva</b> — a compensação foi adequada ao dano?<br>'
     +'• <b>Processual</b> — foi rápido, sem burocracia, sem repetir a história cinco vezes?<br>'
     +'• <b>Interacional</b> — fui tratado com respeito, ouvido, e alguém assumiu?<br><br>'
     +'A terceira é a mais barata de entregar e a mais lembrada. Compensação generosa entregue com má vontade avalia pior que compensação modesta entregue com cuidado.',
   ref:'Tax, S., Brown, S., & Chandrashekaran, M. (1998). Customer evaluations of service complaint experiences. Journal of Marketing, 62(2), 60-76.'}
 ],
 evidencia:'O paradoxo da recuperação é debatido — nem toda falha bem resolvida supera a ausência de falha, e o efeito depende da gravidade e de ser a primeira vez. O que a literatura sustenta com firmeza é o inverso: <b>recuperação malfeita destrói</b> mais valor do que a falha original criou de dano. Ou seja, a assimetria existe e é grande, mesmo que o "paradoxo" nem sempre se confirme.',
 limite:'Não se pode contar com o paradoxo. Falhar de propósito para "recuperar bem" é absurdo, e falhas repetidas não são recuperáveis por atendimento nenhum — a segunda vez cancela o crédito da primeira. A leitura correta é defensiva: como a falha vai acontecer, o processo de recuperação tem de estar pronto antes, e não ser improvisado no domingo de manhã.',
 aplicacao:[
  'Ordem obrigatória: pessoas → segurança → procedimento. Nunca perguntar do carro antes de perguntar das pessoas.',
  'Assumir na primeira mensagem, mesmo antes de saber a causa. Explicação vem depois; acolhimento vem antes.',
  'Não pedir para o cliente repetir a história. Justiça processual é o eixo mais fácil de falhar.',
  'Resolver com prazo dito e cumprido. Se atrasar, avisar antes de ser cobrado.',
  'Fechar o episódio com uma última mensagem boa — é ela que vira a lembrança, pela regra do pico-fim.',
  'Se o erro foi nosso, devolver dinheiro rápido. Discussão de valor destrói justiça distributiva e interacional ao mesmo tempo.'
 ],
 scripts:[
  '{nome}, respira que eu resolvo. Primeiro: todo mundo está bem?',
  'Isso não deveria ter acontecido e a responsabilidade é nossa. Me dá uma hora que eu volto com a solução — não com explicação.',
  'Você não vai pagar nada por isso e não vai ficar sem carro. Estou acompanhando até você estar rodando de novo.',
  'Conferi: foi {motivo}, no dia {data}. Se for erro nosso, eu devolvo hoje — segue o comprovante.'
 ],
 erros:[
  'Perguntar do carro antes de perguntar das pessoas.',
  'Explicar antes de acolher.',
  'Fazer o cliente repetir a história para outra pessoa.',
  'Encerrar um problema resolvido sem uma última mensagem.'
 ],
 exercicio:'Escreva o roteiro de recuperação para os três problemas mais comuns da operação, com prazo de resposta e quem assume cada um. Roteiro escrito antes é a diferença entre recuperação e improviso.',
 grafico:{tipo:'barra', t:'Satisfação depois de um problema',
   sub:'conforme a qualidade da recuperação',
   labels:['Falha sem recuperação','Recuperação lenta','Recuperação rápida e fria','Recuperação rápida e humana','Nunca teve problema'],
   vals:[11,34,62,94,80], cor:'#1FA9A6',
   exp:'A barra mais alta não é a de quem nunca teve problema — é a de quem teve e foi bem cuidado. É o paradoxo da recuperação, e ele existe porque a resolução é a <b>única evidência</b> de como a empresa se comporta sob pressão. Repare também na distância entre "rápida e fria" e "rápida e humana": mesma velocidade, mesma solução, 32 pontos de diferença. Essa distância é a justiça interacional, e é de graça.'}
},

{id:'m22', n:22, eixo:'Operação',
 t:'Hábito, rotina e por que o método se perde',
 sub:'Como fazer o que foi aprendido sobreviver ao mês movimentado',
 tempo:'25 min',
 porque:'O maior inimigo deste curso não é a discordância — é o mês corrido. Método aprendido e não convertido em rotina desaparece em três semanas, e volta tudo a ser como era. Este módulo é sobre não deixar isso acontecer.',
 teoria:[
  {h:'O laço do hábito — Duhigg, a partir da pesquisa em gânglios da base',
   p:'Um hábito tem três partes: <b>deixa</b> (o gatilho), <b>rotina</b> (o comportamento) e <b>recompensa</b>. Comportamento sem deixa clara não vira hábito — depende de lembrar, e lembrar falha exatamente nos dias em que a carga é maior.<br><br>Aplicado ao método: "escutar mais" não é uma deixa. "Toda vez que o cliente pedir preço, fazer uma pergunta antes" é.',
   ref:'Duhigg, C. (2012). The Power of Habit. Random House. (síntese da literatura sobre gânglios da base e formação de rotinas)'},
  {h:'Intenções de implementação — Gollwitzer (1999)',
   p:'Intenções no formato <b>"quando X acontecer, farei Y"</b> aumentam substancialmente a probabilidade de execução em comparação a intenções genéricas ("vou me esforçar mais"). O plano condicional delega o disparo ao ambiente, em vez de depender de força de vontade no momento.',
   ref:'Gollwitzer, P. (1999). Implementation intentions: Strong effects of simple plans. American Psychologist, 54(7), 493-503.'}
 ],
 evidencia:'Meta-análises de intenções de implementação encontram efeito médio consistente e de tamanho relevante sobre o cumprimento de metas comportamentais, em domínios que vão de exercício físico a adesão a tratamento. É um dos achados mais replicados da psicologia da mudança de comportamento — e um dos mais baratos de aplicar, porque exige apenas reescrever a intenção.',
 limite:'Intenções de implementação funcionam melhor para comportamentos que a pessoa já quer executar e esquece, e pior para comportamentos que ela resiste a executar. Se o vendedor discorda do método, nenhum "quando X, farei Y" resolve — aí o problema é de convencimento, e o lugar dele é a discussão dos módulos, não a rotina.',
 aplicacao:[
  'Transformar cada passo do método numa frase "quando X, farei Y".',
  'Deixas concretas: "quando o cliente pedir o preço na primeira mensagem, farei uma pergunta sobre a viagem antes".',
  '"Quando eu for mandar o valor, colocarei os inclusos antes, na ordem da perda evitada."',
  '"Quando o cliente disser vou pensar, perguntarei se é valor, data ou carro."',
  '"Quando a viagem terminar, pedirei a indicação."',
  'Revisar uma vez por semana, com a tela do app aberta. Sem revisão, o método vira intenção.',
  'Uma mudança por vez. Tentar aplicar sete passos novos na mesma semana é a forma mais certa de não aplicar nenhum.'
 ],
 scripts:[
  '(para você, não para o cliente) Quando alguém pedir preço na primeira mensagem, eu respondo: "Consigo sim! Só uma coisa antes pra eu não te passar valor errado: vocês são quantas pessoas?"',
  '(para você) Quando eu terminar de montar a proposta, antes de enviar, releio e pergunto: os inclusos vêm antes do número?'
 ],
 erros:[
  'Sair do curso com a intenção de "vender melhor" — genérico demais para virar comportamento.',
  'Tentar mudar tudo na mesma semana.',
  'Não marcar revisão. O que não é revisado volta ao padrão anterior em cerca de três semanas.'
 ],
 exercicio:'Escreva três frases "quando X, farei Y" — uma para o passo 2, uma para o 4 e uma para o 6. Cole na tela do computador. Revise na sexta-feira: quantas vezes o X aconteceu e quantas vezes o Y foi feito?',
 grafico:{tipo:'linha', t:'Retenção do método ao longo das semanas',
   sub:'com e sem rotina de revisão',
   labels:['semana 1','semana 2','semana 3','semana 4','semana 6','semana 8'],
   vals:[100,82,58,37,21,12], cor:'#FF2D2D',
   exp:'Curva de decaimento típica de um treinamento sem rotina de reforço: por volta da terceira semana já se perdeu metade, e no segundo mês resta pouco mais de um décimo. <b>Não é falta de interesse — é como a memória de procedimento funciona sem gatilho.</b> A revisão semanal com a tela aberta e as frases "quando X, farei Y" existem exatamente para achatar esta curva.'}
}
];
var MGW_CURSO_D=[

{id:'m23', n:23, eixo:'Teoria',
 t:'A curva do esquecimento e por que o treinamento não pega',
 sub:'O que a memória faz com este curso depois que você fecha a aba',
 tempo:'30 min',
 porque:'Você vai esquecer a maior parte deste curso. Isso não é falha sua nem do material — é como a memória humana funciona, e está medido desde 1885. O módulo existe para transformar esse fato de desculpa em ferramenta: sabendo a forma da curva, dá para colocar reforço exatamente onde ela cai.',
 teoria:[
  {h:'A curva do esquecimento — Ebbinghaus (1885)',
   p:'Hermann Ebbinghaus decorou milhares de sílabas sem sentido e mediu, em si mesmo, quanto sobrava depois de intervalos crescentes. Encontrou uma curva com forma muito característica: <b>a perda é brutal nas primeiras horas e depois desacelera</b>. Boa parte do que se aprende numa sessão se perde no mesmo dia; o que sobrevive à primeira semana tende a durar bem mais.<br><br>O achado que interessa não é a perda — é que <b>a curva pode ser achatada por repetição espaçada</b>. Cada revisão não só recupera o que caiu: torna a queda seguinte mais lenta.',
   ref:'Ebbinghaus, H. (1885). Über das Gedächtnis. Leipzig: Duncker & Humblot. [trad. Memory: A Contribution to Experimental Psychology, 1913]'},
  {h:'Efeito do espaçamento — Cepeda et al. (2006)',
   p:'Uma meta-análise de mais de 300 experimentos confirmou o que Ebbinghaus sugeriu: <b>estudar a mesma coisa em sessões separadas produz muito mais retenção do que estudar tudo de uma vez</b>, mesmo com o tempo total idêntico. O intervalo ótimo cresce com o prazo que se quer reter: para lembrar daqui a um mês, revisar a cada poucos dias; para lembrar daqui a um ano, a cada poucas semanas.<br><br>É por isso que um treinamento de oito horas num sábado rende menos que oito conversas de uma hora ao longo de dois meses. A prática do mercado é exatamente a menos eficiente.',
   ref:'Cepeda, N., Pashler, H., Vul, E., Wixted, J., & Rohrer, D. (2006). Distributed practice in verbal recall tasks: A review and quantitative synthesis. Psychological Bulletin, 132(3), 354-380.'},
  {h:'Efeito de teste — Roediger e Karpicke (2006)',
   p:'Recuperar da memória fortalece mais do que reler. Em experimentos diretos, grupos que <b>testaram</b> o que sabiam superaram com folga grupos que estudaram o mesmo material pelo mesmo tempo — e a diferença crescia com o prazo. O detalhe cruel: os que releram <b>previam</b> que iriam melhor. A sensação de fluência ao reler é confundida com aprendizado.<br><br>Aplicado aqui: fechar esta aba e tentar dizer em voz alta os sete passos vale mais do que ler os sete passos de novo.',
   ref:'Roediger, H., & Karpicke, J. (2006). Test-Enhanced Learning: Taking Memory Tests Improves Long-Term Retention. Psychological Science, 17(3), 249-255.'}
 ],
 evidencia:'Nos estudos de Roediger e Karpicke, a vantagem do grupo que se autotestou apareceu com clareza nas medições feitas dias depois, e não na medida imediata — em prazo curto, reler chega a parecer melhor. É exatamente o desenho que engana quem avalia treinamento pelo teste feito no fim do dia.',
 limite:'Nada disso diz que a aula não serve, nem que basta testar. O espaçamento e o teste organizam a prática de algo que já foi ensinado — não substituem a instrução inicial, e não compensam material ruim. E a curva de Ebbinghaus foi medida com sílabas sem sentido: material com significado e ligado à prática esquece bem mais devagar. O que fica é a forma, não os números exatos.',
 aplicacao:[
  'Um módulo por semana, não o curso inteiro num domingo.',
  'Antes de reabrir um módulo lido, tente dizer o que ele dizia. Só então releia.',
  'Revisão na semana 1, na 3 e na 8 — os pontos onde a curva mais cai.',
  'Na reunião, alguém explica um módulo em voz alta para os outros. Explicar é a forma mais forte de recuperar.',
  'Anote a data em que leu cada módulo. Sem data não há espaçamento, há acaso.'
 ],
 scripts:[],
 erros:[
  'Ler oito módulos de uma vez e achar que aprendeu oito.',
  'Confundir a facilidade de reler com domínio — é a ilusão de fluência.',
  'Marcar tudo como lido no primeiro dia e nunca voltar.'
 ],
 exercicio:'Feche esta aba. Numa folha, escreva os sete passos do método na ordem, com uma frase cada. Depois abra e confira. O que você errou é exatamente o que precisa de revisão — e o que acertou já está mais firme por ter sido recuperado.',
 leitura:[
  {o:'Brown, Roediger & McDaniel — <i>Make It Stick</i> (2014)', q:'Procure os capítulos sobre prática intercalada e sobre a ilusão de saber. É a ponte entre a pesquisa e a rotina.'},
  {o:'Cepeda et al. (2006), a meta-análise', q:'Vá direto à tabela de intervalos ótimos por prazo de retenção. É o que define quando revisar.'}
 ],
 questoes:[
  'Se a curva do esquecimento vale para o vendedor, ela vale para o CLIENTE. O que ele lembra da sua proposta três dias depois — e o que isso muda no follow-up?',
  'Qual parte do nosso método é a mais esquecida na prática? Por que justamente ela?'
 ],
 grafico:{tipo:'linha', t:'Retenção com e sem revisão espaçada',
   sub:'forma da curva de Ebbinghaus, em índice',
   labels:['20 min','1 dia','2 dias','6 dias','31 dias'],
   vals:[58,44,36,25,21], cor:'#FF2D2D',
   exp:'Os pontos seguem a forma clássica medida por Ebbinghaus em si mesmo, em índice sobre o aprendido: a maior parte da perda acontece <b>logo</b>, e depois a curva quase deita. Duas consequências práticas: a revisão mais valiosa é a mais próxima da leitura, e treinamento sem nenhum reforço nas primeiras 48 horas perde a maior parte do investimento antes da primeira segunda-feira. <b>Cada revisão levanta a curva e deixa a queda seguinte mais lenta.</b>'}},

{id:'m24', n:24, eixo:'Teoria',
 t:'O que é confiança, tecnicamente',
 sub:'Habilidade, benevolência e integridade — e por que faltar uma derruba as outras',
 tempo:'30 min',
 porque:'A Magiway vende confiança antes de vender carro — é a premissa de toda a operação. Mas "confiança" usada como palavra bonita não orienta ninguém. Existe um modelo com décadas de teste que a decompõe em três coisas separadas, cada uma construída de um jeito diferente. Saber qual das três está faltando é a diferença entre corrigir e insistir.',
 teoria:[
  {h:'O modelo ABI — Mayer, Davis e Schoorman (1995)',
   p:'Confiar é <b>aceitar ficar vulnerável a outro</b> com base na expectativa de que ele agirá bem, mesmo sem poder monitorá-lo. A disposição de confiar depende de três percepções independentes:<br><br><b>Ability</b> (habilidade) — ele é competente NAQUILO. Competência é específica de domínio: confiar no seu médico não é confiar no seu mecânico.<br><b>Benevolence</b> (benevolência) — ele quer o meu bem, para além do interesse próprio.<br><b>Integrity</b> (integridade) — ele age por princípios que eu aceito, e é consistente.<br><br>As três são <b>necessárias</b>. Alta habilidade com baixa integridade produz alguém competente de quem se desconfia — que é como o mercado enxerga vendedor por padrão.',
   ref:'Mayer, R., Davis, J., & Schoorman, F. (1995). An Integrative Model of Organizational Trust. Academy of Management Review, 20(3), 709-734.'},
  {h:'Confiança e risco são inseparáveis',
   p:'Não existe confiança sem exposição. Se não há nada em jogo, não se está confiando — apenas prevendo. O cliente que paga antes de viajar, para uma empresa que ele não conhece, no outro hemisfério, está <b>genuinamente vulnerável</b>, e é por isso que a decisão dele é pesada.<br><br>Isso reposiciona todo o trabalho: reduzir o risco percebido não é retórica, é remover objetivamente o que ele tem a perder — zero caução, seguro incluso, suporte com nome e rosto, o passo a passo por escrito.',
   ref:'Rousseau, D., Sitkin, S., Burt, R., & Camerer, C. (1998). Not So Different After All: A Cross-Discipline View of Trust. Academy of Management Review, 23(3), 393-404.'},
  {h:'A assimetria: confiança sobe devagar e cai de uma vez',
   p:'Eventos negativos pesam mais que positivos na formação de julgamento, e no caso da integridade o efeito é extremo: <b>um único ato claramente desonesto</b> reconfigura a avaliação inteira, enquanto muitos atos honestos movem pouco — porque honestidade é o esperado. Já para a habilidade a assimetria é inversa: um erro isolado é perdoado se o padrão for bom.<br><br>Consequência direta: exagerar uma cobertura para fechar uma venda não é um risco proporcional ao ganho. É apostar o ativo inteiro numa reserva.',
   ref:'Baumeister, R., Bratslavsky, E., Finkenauer, C., & Vohs, K. (2001). Bad Is Stronger Than Good. Review of General Psychology, 5(4), 323-370.'}
 ],
 evidencia:'Revisões do modelo ABI em contextos organizacionais encontram as três dimensões separáveis empiricamente — pessoas avaliam competência, boa intenção e coerência como coisas distintas, e a confiança resultante depende da combinação, não da média. É por isso que "ele é ótimo, mas eu não deixaria minha viagem na mão dele" é uma frase coerente.',
 limite:'O modelo descreve como a confiança se forma; não é um roteiro para produzi-la. E há um limite ético que o próprio modelo torna óbvio: as três dimensões são <b>percepções</b>, e percepção pode ser manipulada sem substância. Fabricar sinais de benevolência sem benevolência funciona por um tempo e falha exatamente quando é testado — que é quando o cliente já está do outro lado do mundo, dependendo de você.',
 aplicacao:[
  'Habilidade: demonstre conhecimento específico de Orlando, não competência genérica. Detalhe verificável vale mais que adjetivo.',
  'Benevolência: entregue algo que não te beneficia. Dizer "esse seguro de saúde eu não vendo, mas contrate" é benevolência demonstrada, não declarada.',
  'Integridade: diga o limite antes de ser perguntado. O que NÃO está coberto, dito por você primeiro, é a prova mais barata que existe.',
  'Quando o cliente hesita, descubra QUAL das três falta. "Não sei se vocês dão conta" é habilidade; "acho que estão me empurrando" é benevolência; "e se não for o que está escrito?" é integridade. As três pedem respostas diferentes.',
  'Nunca arredonde para cima uma cobertura. O ganho é uma venda; a perda é a categoria inteira.'
 ],
 scripts:[
  '{nome}, vou te falar o que NÃO está incluso antes de falar do que está: {exclusoes}. Prefiro que você saiba agora.',
  'Uma dica que não me dá dinheiro nenhum: {dicaUtil}. Vale mesmo que você alugue com outra empresa.',
  'Se em algum momento você achar que eu te empurrei alguma coisa, me fala. Eu prefiro perder a venda a perder isso aqui.'
 ],
 erros:[
  'Tratar "confiança" como simpatia. Simpatia é uma pista de benevolência e não diz nada sobre habilidade ou integridade.',
  'Responder uma dúvida de integridade com prova de competência — mostrar quantos carros temos não responde "vocês cumprem o que dizem?".',
  'Prometer cobertura por cima para fechar. É o único erro deste curso cujo custo não é a venda, é a empresa.'
 ],
 exercicio:'Pegue os últimos 5 clientes que NÃO fecharam. Para cada um, classifique a hesitação em habilidade, benevolência ou integridade. Se você não conseguir classificar, é porque não perguntou o suficiente — e essa é a descoberta do exercício.',
 leitura:[
  {o:'Mayer, Davis & Schoorman (1995), o artigo original', q:'Leia a seção que separa confiança de propensão a confiar. Explica por que o mesmo atendimento funciona com um cliente e não com outro.'},
  {o:'Baumeister et al. (2001) — <i>Bad Is Stronger Than Good</i>', q:'Procure a discussão sobre assimetria em relacionamentos. É o argumento contra qualquer exagero tático.'}
 ],
 questoes:[
  'Das três dimensões, qual a Magiway tem mais dificuldade de demonstrar para quem nunca ouviu falar dela? O que hoje é feito para isso — e funciona?',
  'Se integridade cai de uma vez e sobe devagar, quanto vale uma venda fechada com um exagero? Faça a conta em número de indicações perdidas.'
 ],
 grafico:{tipo:'barra', t:'As três dimensões e o que cada uma exige',
   sub:'esforço relativo para construir e para destruir',
   labels:['Habilidade','Benevolência','Integridade'],
   vals:[100,100,100], cor:'#1FA9A6',
   exp:'As três valem igual na formação da confiança — a barra é a mesma de propósito. O que muda é a <b>assimetria</b>: habilidade tolera um erro isolado se o padrão for bom; benevolência se constrói com gestos repetidos e sem cobrança; <b>integridade se perde inteira num único ato</b>. Por isso o exagero de cobertura não é um risco proporcional: a barra da integridade não cai um pedaço, ela zera.'}}
,
{id:'m25', n:25, eixo:'Teoria',
 t:'Comunicar risco em números que o cliente entende',
 sub:'Por que "99% de cobertura" informa menos que "1 em cada 100"',
 tempo:'30 min',
 porque:'Metade do nosso trabalho é falar de risco: seguro, franquia, caução, o que acontece se der errado. E existe um corpo de pesquisa mostrando que o mesmo risco, escrito de duas maneiras, produz decisões opostas — inclusive em médicos e juízes. Comunicar mal um risco não é detalhe de redação: é induzir o cliente a uma decisão que ele não tomaria se tivesse entendido.',
 teoria:[
  {h:'Formatos de frequência natural — Gigerenzer e Hoffrage (1995)',
   p:'Probabilidades em porcentagem são difíceis até para especialistas. Reescritas como <b>frequências naturais</b> — "4 em cada 1.000" em vez de "0,4%" —, as mesmas perguntas passam a ser respondidas corretamente por uma proporção muito maior de pessoas, sem nenhum treinamento.<br><br>A razão é que a frequência natural preserva a informação sobre o tamanho do grupo, que a porcentagem descarta. O cérebro lida bem com contagem e mal com razão abstrata.',
   ref:'Gigerenzer, G., & Hoffrage, U. (1995). How to Improve Bayesian Reasoning Without Instruction: Frequency Formats. Psychological Review, 102(4), 684-704.'},
  {h:'Enquadramento — Tversky e Kahneman (1981)',
   p:'O mesmo desfecho descrito como ganho ou como perda muda a escolha da maioria. No experimento clássico da doença asiática, "salva 200 de 600" e "morrem 400 de 600" descrevem o mesmo resultado, e as pessoas preferem a opção segura no primeiro enquadramento e a arriscada no segundo.<br><br>Para nós: "cobre 90% dos casos" e "não cobre 1 em cada 10" são o mesmo fato. Escolher o enquadramento é inevitável — <b>não existe versão neutra</b>. Por isso a escolha tem de ser feita com critério declarado, e o nosso é: quando o risco é do cliente, enquadre pela perda, porque é ela que ele precisa enxergar para decidir.',
   ref:'Tversky, A., & Kahneman, D. (1981). The Framing of Decisions and the Psychology of Choice. Science, 211(4481), 453-458.'},
  {h:'Risco como sentimento — Loewenstein et al. (2001)',
   p:'A reação emocional ao risco e a avaliação cognitiva dele <b>divergem sistematicamente</b>, e quando divergem é a emoção que costuma dirigir o comportamento. Fatores que quase não mudam a probabilidade — vividez da imagem, proximidade no tempo, se a pessoa já viu acontecer — mudam muito o medo sentido.<br><br>Daí o cliente que tem pavor de bater num país estranho e nenhum medo de dirigir 400 km no mesmo dia, sendo o segundo objetivamente mais perigoso. Discutir a estatística com ele não resolve: o medo não veio de estatística.',
   ref:'Loewenstein, G., Weber, E., Hsee, C., & Welch, N. (2001). Risk as Feelings. Psychological Bulletin, 127(2), 267-286.'}
 ],
 evidencia:'Nos estudos de frequência natural, problemas de diagnóstico que quase ninguém resolvia em formato de porcentagem passaram a ser resolvidos por uma parcela substancial dos participantes apenas com a reescrita em contagens — mesma matemática, mesma pergunta, apresentação diferente.',
 limite:'Frequência natural melhora a compreensão; não garante decisão melhor, e não anula o medo, que tem outra origem. E há um risco ético embutido: quem domina enquadramento pode escolher o que faz o cliente decidir como convém a quem fala. A regra que adotamos é simples de auditar — <b>use o enquadramento que o cliente usaria para se proteger</b>, não o que fecha mais rápido. Na dúvida, dê os dois.',
 aplicacao:[
  'Troque porcentagem por contagem: "1 em cada 20 viagens" em vez de "5%".',
  'Ao explicar cobertura, diga o que NÃO cobre no mesmo formato do que cobre. Formatos diferentes escondem a comparação.',
  'Quando o medo do cliente não bate com o risco real, não corrija com estatística — reconheça o medo e reduza a exposição concreta.',
  'Nunca use dois enquadramentos diferentes para o nosso lado e o do concorrente. É a manipulação mais fácil de fazer e a mais fácil de detectar.',
  'Números redondos e verificáveis. "Praticamente sempre" não é informação, é impressão.'
 ],
 scripts:[
  'Deixa eu te dar em número de gente, que fica mais claro: de cada 100 famílias que a gente atende, {n} passam por {situacao}. Nessas, o que acontece é {oQue}.',
  'Vou te falar o lado ruim também: {exclusao}. É {n} em cada 100. Pequeno, mas existe, e você tem que saber.',
  'Entendo o medo de dirigir lá — é normal e quase todo mundo sente. Não vou te convencer com estatística. Vou te contar o que a gente faz para isso ficar mais fácil: {medidas}.'
 ],
 erros:[
  'Dizer "cobertura total" quando existe exclusão. É enquadramento que vira mentira.',
  'Responder medo com número. O medo não veio de número e não sai por número.',
  'Usar porcentagem para o que é bom e contagem para o que é ruim (ou o contrário).'
 ],
 exercicio:'Pegue as três explicações de seguro que você mais usa. Reescreva cada uma em frequência natural ("x em cada 100") e inclua a exclusão no mesmo formato. Use por uma semana e repare em quantas perguntas de acompanhamento você recebe — menos perguntas significa que entenderam.',
 leitura:[
  {o:'Gigerenzer — <i>Calculated Risks</i> / <i>Reckoning with Risk</i>', q:'Os capítulos sobre exames médicos. Troque "paciente" por "cliente" e o argumento é o mesmo.'},
  {o:'Tversky & Kahneman (1981), o artigo da Science', q:'São quatro páginas. Leia o problema da doença asiática e tente prever sua própria resposta antes de virar a página.'}
 ],
 questoes:[
  'Quais enquadramentos nós usamos hoje que passariam mal no teste "o cliente usaria este para se proteger?"',
  'Qual medo dos nossos clientes é maior que o risco real? E qual risco real é maior que o medo — que é o caso perigoso?'
 ],
 grafico:{tipo:'barra', t:'Mesma informação, dois formatos',
   sub:'proporção que responde corretamente ao problema de diagnóstico',
   labels:['em porcentagem','em frequência natural'],
   vals:[16,46], cor:'#FFD11A',
   exp:'Ordem de grandeza observada nos estudos de Gigerenzer e Hoffrage: o mesmo problema, com os mesmos números, é resolvido por uma parcela muito maior quando escrito como contagem em vez de porcentagem. <b>Nada mudou na matemática — mudou o que o cérebro precisa fazer para chegar lá.</b> Toda vez que você escreve 5%, está escolhendo o formato que a pesquisa mostra ser o mais difícil. "1 em cada 20" custa o mesmo espaço e é entendido.'}},

{id:'m26', n:26, eixo:'Teoria',
 t:'Justiça percebida: por que o cliente aceita um preço e recusa outro igual',
 sub:'Distributiva, procedimental e interacional — as três justiças',
 tempo:'30 min',
 porque:'Vender acima do mercado exige que o preço pareça JUSTO, não que pareça baixo. E justiça percebida não é sinônimo de valor: o mesmo número é aceito quando a pessoa entende como ele foi formado e recusado quando parece arbitrário. Este módulo é sobre a diferença entre caro e injusto — que é onde a Magiway vive.',
 teoria:[
  {h:'Teoria da equidade — Adams (1963)',
   p:'As pessoas avaliam uma troca comparando a razão entre o que dão e o que recebem <b>com a razão de outro alguém</b>. O que incomoda não é dar muito: é dar mais do que o outro deu pelo mesmo. Daí a força devastadora de "meu amigo pagou menos" — o valor absoluto nem entra na conta.<br><br>A implicação prática é dura: descontos concedidos sem critério explícito criam injustiça percebida em todos os outros clientes assim que a informação circula. E ela circula.',
   ref:'Adams, J. S. (1963). Toward an Understanding of Inequity. Journal of Abnormal and Social Psychology, 67(5), 422-436.'},
  {h:'As três dimensões da justiça — Colquitt (2001)',
   p:'A pesquisa organizacional separa três julgamentos distintos:<br><br><b>Distributiva</b> — o resultado é justo? (quanto paguei pelo que recebi)<br><b>Procedimental</b> — a REGRA que produziu o resultado é justa? (como esse preço foi formado, vale para todo mundo?)<br><b>Interacional</b> — fui tratado com respeito e me explicaram? (o tom, a transparência)<br><br>O achado que mais importa aqui: quando a distributiva é desfavorável — o cliente paga caro —, <b>a procedimental e a interacional passam a pesar muito mais</b>. Preço alto com regra clara e trato respeitoso é aceito; preço alto sem explicação é sentido como abuso.',
   ref:'Colquitt, J. (2001). On the Dimensionality of Organizational Justice: A Construct Validation of a Measure. Journal of Applied Psychology, 86(3), 386-400.'},
  {h:'Justiça de preço e o princípio do direito adquirido — Kahneman, Knetsch e Thaler (1986)',
   p:'As pessoas julgam aumentos de preço como justos ou injustos por uma regra bastante estável: <b>é justo repassar aumento de custo; é injusto explorar um aumento de demanda</b>. A loja que sobe o preço da pá de neve durante a nevasca é condenada por ampla maioria, mesmo sendo economicamente racional.<br><br>Para nós, em alta temporada: dizer "está mais caro porque tem mais gente procurando" ativa exatamente o julgamento de exploração. Dizer "nesta época a diária que a gente paga sobe" — quando for verdade — é a mesma alta com o enquadramento que a pesquisa mostra ser aceito.',
   ref:'Kahneman, D., Knetsch, J., & Thaler, R. (1986). Fairness as a Constraint on Profit Seeking: Entitlements in the Market. American Economic Review, 76(4), 728-741.'}
 ],
 evidencia:'No estudo de Kahneman, Knetsch e Thaler, a proporção que considerou injusto subir o preço na alta demanda foi esmagadora, enquanto a mesma alta justificada por aumento de custo foi majoritariamente aceita — sendo o preço final idêntico nos dois casos.',
 limite:'Justiça percebida é percepção, e ela pode ser fabricada com uma justificativa falsa de custo. Além de desonesto, é frágil: numa praça em que o cliente compara com Hub e Orlando Rental Car, uma justificativa inventada é conferida em minutos. A regra é usar a explicação verdadeira — e, quando a verdadeira for "somos mais caros porque entregamos mais", dizer isso, que também passa no teste de justiça procedimental.',
 aplicacao:[
  'Toda vez que der desconto, declare o critério. "Por ser 12 diárias" é procedimental; "porque você insistiu" ensina que insistir funciona.',
  'Tenha UMA regra de preço e aplique igual. A regra é mais defensável que qualquer número.',
  'Na alta temporada, explique pela sua estrutura de custo, nunca pela procura — se a alta for de custo.',
  'Quando o cliente citar um preço menor, compare o pacote item a item antes de falar de valor. Justiça distributiva se discute com o que está dentro.',
  'Trate bem quem não fecha. A justiça interacional é a que sobra na memória e vira indicação.'
 ],
 scripts:[
  'Nosso preço segue uma regra que vale para todo mundo: {regra}. Não é negociação caso a caso — se fosse, quem grita mais pagaria menos, e não é assim que eu trabalho.',
  'Consigo ajustar por um motivo concreto: são {dias} diárias. Não é favor nem exceção — é a nossa faixa para viagem longa, e vale para qualquer cliente nessa situação.',
  'Somos mais caros, sim. O que está dentro é {inclusos} — se você tirar tudo isso, o número fica parecido. A diferença não é margem, é o que vem junto.'
 ],
 erros:[
  'Dar desconto "porque o cliente pediu". Ensina que pedir é o caminho e torna o preço injusto para todos os outros.',
  'Justificar alta de preço pela demanda. É o enquadramento que a pesquisa mostra ser rejeitado.',
  'Tratar mal quem não fechou. É onde a justiça interacional cobra mais caro, porque é o que ele conta.'
 ],
 exercicio:'Escreva em uma frase a REGRA do nosso preço, de um jeito que você diria em voz alta para um cliente. Mostre para dois colegas. Se as três frases forem diferentes, não existe regra — existem três, e é isso que o cliente sente.',
 leitura:[
  {o:'Kahneman, Knetsch & Thaler (1986)', q:'Leia os cenários do questionário. São situações de comércio comum, e as respostas são o mapa do que o mercado tolera.'},
  {o:'Colquitt (2001)', q:'Vá à tabela com os itens de cada dimensão. Cada item é, na prática, uma pergunta que o cliente se faz.'}
 ],
 questoes:[
  'Nosso preço tem uma regra que qualquer um da equipe enunciaria igual? Se não, qual é o custo disso?',
  'Em que situações a gente hoje justifica preço pela procura? O que aconteceria se trocássemos pela justificativa de custo real?'
 ],
 grafico:{tipo:'barra', t:'A mesma alta de preço, duas justificativas',
   sub:'proporção que considera a alta aceitável',
   labels:['justificada por aumento de custo','justificada por aumento de procura'],
   vals:[79,18], cor:'#1AFF9D',
   exp:'Ordem de grandeza dos cenários de Kahneman, Knetsch e Thaler: <b>o preço final é o mesmo nos dois casos</b>. O que muda é só a frase que acompanha, e ela decide entre aceitação ampla e rejeição ampla. Não é técnica de venda — é o julgamento de justiça funcionando. Por isso, na alta temporada, a frase que se usa importa tanto quanto o número; e por isso ela precisa ser verdadeira, já que numa praça comparável a justificativa falsa é conferida.'}}
,
{id:'m27', n:27, eixo:'Teoria',
 t:'Identidade e pertencimento: por que "gente como a gente" compra',
 sub:'Grupo, semelhança e o limite ético de usar isso',
 tempo:'25 min',
 porque:'Nosso cliente é o brasileiro em Orlando. Isso não é só um recorte de mercado — é uma identidade, e identidade muda como a pessoa avalia quem está do outro lado. Entender o mecanismo explica por que "atendimento em português" vale muito mais do que a tradução que ele oferece, e onde usar isso deixa de ser legítimo.',
 teoria:[
  {h:'Teoria da identidade social — Tajfel e Turner (1979)',
   p:'Basta uma categorização mínima — mesmo arbitrária, sorteada na hora — para as pessoas favorecerem os do próprio grupo. Nos experimentos de grupo mínimo, participantes divididos por critérios sem nenhum significado já distribuíam recursos favorecendo os "seus".<br><br>O mecanismo: parte da autoimagem vem dos grupos a que se pertence, então favorecer o grupo é, indiretamente, sustentar a própria imagem. Não exige história comum nem afinidade real.',
   ref:'Tajfel, H., & Turner, J. (1979). An Integrative Theory of Intergroup Conflict. In: The Social Psychology of Intergroup Relations. Monterey: Brooks/Cole.'},
  {h:'Semelhança e confiança',
   p:'Semelhança percebida aumenta simpatia e disposição de confiar — e vale para semelhanças triviais: mesma região, mesmo time, filhos da mesma idade, o mesmo receio de dirigir do outro lado da pista. A pesquisa sobre atração interpessoal encontra o efeito de forma consistente.<br><br>Para o atendimento, isso significa que o vendedor brasileiro falando com o cliente brasileiro <b>já começa dentro do grupo</b>. Esse crédito inicial é um ativo — e, como todo crédito, pode ser gasto rápido se o que vier depois não sustentar.',
   ref:'Montoya, R., Horton, R., & Kirchner, J. (2008). Is actual similarity necessary for attraction? Journal of Social and Personal Relationships, 25(6), 889-922.'},
  {h:'Pertencimento como necessidade — Baumeister e Leary (1995)',
   p:'A necessidade de pertencer é uma motivação humana fundamental, não uma preferência. Pessoas em ambiente estranho — outro país, outra língua, com a família dependendo delas — têm essa necessidade <b>ativada</b>, e a reação a alguém que representa o próprio grupo fica proporcionalmente mais forte.<br><br>É a situação exata do nosso cliente pousando em Orlando. O que a gente chama de "suporte em português" é, na experiência dele, alguém do lado dele num lugar onde ele não tem ninguém.',
   ref:'Baumeister, R., & Leary, M. (1995). The Need to Belong. Psychological Bulletin, 117(3), 497-529.'}
 ],
 evidencia:'Nos paradigmas de grupo mínimo, o favorecimento aparece mesmo quando os participantes sabem que a divisão foi feita por sorteio e nunca encontram os outros membros — o que mostra que o efeito não depende de vínculo real, e sim da categorização.',
 limite:'Este é o módulo com o limite ético mais estreito do curso, e por dois motivos. Primeiro: o mesmo mecanismo que aproxima o de dentro <b>afasta o de fora</b>, e usar identidade para vender resvala facilmente em desqualificar quem não é do grupo. Segundo: fabricar semelhança — inventar filho da mesma idade, time, cidade — é mentira, e mentira sobre identidade é das que mais ofendem quando descoberta.<br><br>A regra: use as semelhanças que <b>existem</b>, e nunca use o pertencimento para insinuar que o concorrente estrangeiro vai maltratar o cliente. Se a nossa vantagem é real, ela se descreve sozinha.',
 aplicacao:[
  'Fale como brasileiro fala. Formalidade importada quebra justamente o que nos coloca dentro do grupo.',
  'Nomeie a experiência compartilhada quando ela for real: dirigir do outro lado, o susto do pedágio eletrônico, a mala que não cabe.',
  'Suporte em português é a nossa vantagem de pertencimento — descreva o que ele significa na prática, não como slogan.',
  'Nunca sugira que a locadora americana vai enganar o cliente. Compare o que a gente entrega, ponto.',
  'Semelhança inventada é mentira. Se não tem filho, não diga que tem.'
 ],
 scripts:[
  'Sei exatamente o que você tá pensando, porque é a pergunta que 9 em cada 10 famílias me fazem: e se der problema e eu não souber explicar em inglês?',
  'Você vai falar comigo, em português, do jeito que a gente tá falando agora. Não é call center, não é tradutor — sou eu.',
  'A primeira vez dirigindo lá dá um frio na barriga. Todo mundo sente. O que ajuda é {dica} — é o que eu falo pra minha família também.'
 ],
 erros:[
  'Falar "prezado cliente" com quem está do seu lado do grupo. Formalidade é distância.',
  'Insinuar que estrangeiro vai passar a perna. É usar pertencimento para desqualificar, e é o uso que não se sustenta.',
  'Inventar semelhança para criar vínculo. Funciona até a primeira pergunta de acompanhamento.'
 ],
 exercicio:'Liste cinco experiências que você DE FATO compartilha com o cliente típico da Magiway. Para cada uma, escreva a frase que a nomeia sem exagero. São suas — não invente a sexta.',
 leitura:[
  {o:'Baumeister & Leary (1995) — <i>The Need to Belong</i>', q:'A seção sobre efeitos da privação de pertencimento. Ajuda a entender o cliente recém-chegado, sozinho, com a família olhando para ele.'},
  {o:'Tajfel & Turner (1979)', q:'Procure a descrição dos experimentos de grupo mínimo. O quanto basta para criar "nós" é a parte que assusta.'}
 ],
 questoes:[
  'Onde a nossa comunicação usa pertencimento de um jeito que não passaria no teste "isso é verdade e não desqualifica ninguém"?',
  'Se a vantagem do português é tão grande, por que ela não aparece com mais força na proposta? O que a substitui hoje?'
 ],
 grafico:{tipo:'barra', t:'O que o cliente diz que mais pesa na escolha',
   sub:'ordem relativa declarada em atendimento — não é pesquisa formal',
   labels:['Suporte em português','Zero caução','Seguro incluso','Preço'],
   vals:[100,86,74,62], cor:'#3B9EFF',
   exp:'Ordem relativa do que aparece nas conversas quando se pergunta ao cliente o que pesou — não é levantamento estatístico, e está aqui como <b>hipótese a testar</b>, não como dado. Se a ordem for mesmo esta, ela diz uma coisa importante: o item que mais pesa é o único que o concorrente estrangeiro não consegue copiar, e é justamente o que costuma aparecer por último na proposta. <b>Vale medir de verdade antes de reorganizar a comunicação em cima disso.</b>'}},

{id:'m28', n:28, eixo:'Teoria',
 t:'Negociar ampliando, em vez de dividir',
 sub:'Interesses e posições, BATNA, e por que desconto é a pior moeda',
 tempo:'35 min',
 porque:'Quando o cliente diz "está caro", a saída óbvia é ceder preço — e é a pior de todas, porque preço é a única moeda que sai inteira do nosso bolso. A negociação integrativa oferece um repertório maior, e ele é ensinável.',
 teoria:[
  {h:'Posições × interesses — Fisher e Ury (1981)',
   p:'Posição é o que a pessoa <b>pede</b>; interesse é o que ela <b>quer</b>. "Me dá 15% de desconto" é posição. O interesse por trás pode ser caber no orçamento, sentir que negociou bem, justificar a escolha para o cônjuge, ou não se sentir passado para trás.<br><br>Posições colidem — só uma pode vencer. Interesses frequentemente não colidem, e é aí que existe acordo melhor para os dois. A pergunta que abre isso é sempre a mesma: <b>por quê?</b>',
   ref:'Fisher, R., & Ury, W. (1981). Getting to Yes: Negotiating Agreement Without Giving In. Boston: Houghton Mifflin.'},
  {h:'BATNA — a alternativa, e o poder que ela dá',
   p:'O poder numa negociação vem da qualidade da <b>melhor alternativa caso não haja acordo</b>. Quem tem alternativa boa negocia sem medo; quem não tem, cede.<br><br>Duas leituras para nós. A do cliente: em plena alta temporada, com minivan escassa, a alternativa dele é pior do que ele imagina — e o trabalho é <b>informar</b>, não pressionar. A nossa: quando o mês está fraco, a nossa alternativa piora e a tentação de ceder cresce. Reconhecer isso é o que evita transformar um mês ruim numa tabela de preços destruída.',
   ref:'Fisher, R., & Ury, W. (1981), op. cit., cap. 6.'},
  {h:'A âncora e o custo de ceder rápido — Galinsky e Mussweiler (2001)',
   p:'Quem faz a primeira oferta ancora o resultado, e a vantagem é robusta. Mas há um segundo efeito, mais relevante no dia a dia: <b>a velocidade da concessão informa o valor</b>. Ceder 10% em trinta segundos ensina que o preço era inflado e que há mais para ceder. A mesma concessão, feita devagar e com contrapartida, preserva a percepção de valor.',
   ref:'Galinsky, A., & Mussweiler, T. (2001). First offers as anchors: The role of perspective-taking and negotiator focus. Journal of Personality and Social Psychology, 81(4), 657-669.'}
 ],
 evidencia:'Em experimentos de negociação, participantes instruídos a investigar interesses chegam com mais frequência a acordos integrativos — que deixam os dois lados melhor — do que participantes que apenas trocam propostas de valor. A diferença não está em habilidade retórica: está em ter feito perguntas antes de contrapropor.',
 limite:'Nem toda negociação tem espaço integrativo. Quando o orçamento do cliente está de fato abaixo do nosso piso, ampliar o bolo é conversa fiada e o honesto é dizer que não dá — que é o conteúdo do grupo "Quando a resposta é não" do manual. Insistir em criatividade quando o número não fecha é fazer a pessoa perder tempo com jeitinho.',
 aplicacao:[
  'Antes de qualquer contraproposta, pergunte por quê. "O que faria esse valor fazer sentido pra você?"',
  'Tenha uma lista de moedas que não são preço: diárias extras, upgrade quando houver, flexibilidade de horário, motorista adicional, entrega em outro ponto.',
  'Toda concessão pede contrapartida — pagamento à vista, mais diárias, indicação, prazo. Concessão sem troca vira expectativa.',
  'Nunca ceda rápido. A velocidade comunica que havia gordura.',
  'Se a alternativa do cliente for pior do que ele pensa, informe com fato verificável. Informar é legítimo; assustar não.'
 ],
 scripts:[
  'Antes de eu ver o que dá pra fazer, me ajuda com uma coisa: o que faria esse valor fazer sentido pra vocês? É o número em si, ou é comparado com alguma coisa que você viu?',
  'Desconto direto eu não consigo. Agora, se vocês puderem {contrapartida}, aí eu consigo {concessao} — e aí o valor por diária cai de verdade.',
  'Posso fazer diferente: em vez de baixar o preço, incluo {item}. Custa parecido pra vocês e vale mais na viagem.'
 ],
 erros:[
  'Contrapropor antes de perguntar por quê. Perde-se toda a informação que abriria uma saída melhor.',
  'Dar desconto de graça e rápido. Ensina duas coisas erradas de uma vez.',
  'Insistir em alternativa criativa quando o orçamento não fecha de jeito nenhum.'
 ],
 exercicio:'Nos próximos 5 pedidos de desconto, não conte a proposta: conte quantas perguntas você fez antes de responder. Meta: pelo menos duas. Anote também o que você descobriu com elas que não sabia.',
 leitura:[
  {o:'Fisher & Ury — <i>Como Chegar ao Sim</i>', q:'O capítulo sobre interesses e o sobre BATNA. Os dois somam menos de 50 páginas e são a base de tudo aqui.'},
  {o:'Bazerman & Neale — <i>Negotiating Rationally</i>', q:'Os capítulos sobre a "mítica torta fixa" — a crença de que o que um ganha o outro perde. É o erro mais caro em negociação.'}
 ],
 questoes:[
  'Que moedas que não são preço a Magiway pode oferecer hoje, sem custo relevante? Elas estão escritas em algum lugar ou dependem da memória de cada um?',
  'Em que situações a NOSSA alternativa é ruim e a gente cede por isso, sem admitir? Como reconhecer isso antes de destruir a tabela?'
 ],
 grafico:{tipo:'barra', t:'O que acontece depois de uma concessão',
   sub:'esquema do efeito da velocidade — ilustrativo',
   labels:['concessão rápida e sem troca','concessão lenta com contrapartida'],
   vals:[100,34], cor:'#FF2D2D',
   exp:'Índice do quanto o cliente <b>volta a pedir</b> depois da primeira concessão. Ceder rápido e de graça comunica duas coisas ao mesmo tempo: que o preço tinha gordura e que pedir funciona — então ele pede de novo, e agora com razão. A mesma concessão, feita devagar e trocada por algo, encerra o assunto. <b>O que muda o comportamento seguinte não é o tamanho do desconto, é o que a forma de dá-lo ensinou.</b>'}}
,
{id:'m29', n:29, eixo:'Teoria',
 t:'Você não sabe o quanto você sabe',
 sub:'Calibração, excesso de confiança e como a prática vira competência',
 tempo:'30 min',
 porque:'Todo vendedor acha que sabe vender. É uma crença especialmente resistente porque o feedback do ofício é lento, ruidoso e enviesado: a venda perdida quase nunca diz por quê. Este módulo é sobre como saber o que você realmente domina — e é o módulo que torna todos os outros úteis, porque sem calibração ninguém revisa o que já acha que sabe.',
 teoria:[
  {h:'Excesso de confiança e o efeito Dunning-Kruger (1999)',
   p:'Quem tem pouco domínio de uma habilidade tende a <b>superestimar</b> o próprio desempenho, e por um motivo específico: as competências necessárias para executar bem são as mesmas necessárias para avaliar a execução. Quem não as tem não tem como perceber que não as tem.<br><br>O outro lado é menos citado e importa igual: com o aumento do domínio, a autoavaliação melhora — e especialistas frequentemente <b>subestimam</b> a própria posição relativa, por supor que o que é fácil para eles é fácil para todos.',
   ref:'Kruger, J., & Dunning, D. (1999). Unskilled and Unaware of It. Journal of Personality and Social Psychology, 77(6), 1121-1134.'},
  {h:'Prática deliberada — Ericsson, Krampe e Tesch-Römer (1993)',
   p:'Tempo de exercício não produz competência sozinho. O que separa quem melhora de quem apenas acumula anos é a <b>prática deliberada</b>: atividade escolhida para atacar uma fraqueza específica, com feedback imediato e repetição com correção.<br><br>Dez anos atendendo sem nunca revisar um atendimento produzem dez anos do mesmo nível. É a diferença entre praticar e repetir — e explica por que veterano nem sempre é melhor.',
   ref:'Ericsson, K. A., Krampe, R., & Tesch-Römer, C. (1993). The Role of Deliberate Practice in the Acquisition of Expert Performance. Psychological Review, 100(3), 363-406.'},
  {h:'Ambientes de aprendizado gentis e cruéis — Hogarth (2001)',
   p:'A intuição só se torna confiável em ambientes que dão feedback rápido, claro e não enviesado. Vendas é um ambiente <b>cruel</b> nesse sentido: o resultado demora, a causa é ambígua e o feedback é assimétrico — o cliente que fecha explica, o que some não explica nada.<br><br>Em ambiente cruel, a experiência produz confiança sem produzir acurácia. A correção não é confiar menos na intuição: é <b>construir feedback artificialmente</b>, com registro, revisão e comparação.',
   ref:'Hogarth, R. (2001). Educating Intuition. Chicago: University of Chicago Press.'}
 ],
 evidencia:'No estudo original de Kruger e Dunning, participantes no quartil inferior de desempenho estimaram estar acima da média — e, o mais relevante para nós, a autoavaliação deles <b>melhorou depois de receberem treinamento na habilidade</b>. Aprender a fazer é o que ensina a enxergar o próprio nível.',
 limite:'O efeito é objeto de disputa metodológica ativa: parte do padrão pode vir de regressão à média e do fato de que quase todo mundo se avalia perto da média. O que sobrevive à crítica, e é o que interessa aqui, é mais modesto e ainda assim decisivo: <b>autoavaliação sem medida externa é pouco confiável</b>, para qualquer nível. Não é uma acusação de incompetência — é um argumento a favor de medir.',
 aplicacao:[
  'Registre a cotação no app SEMPRE. Sem registro não há feedback, e sem feedback a experiência não vira competência.',
  'Escolha UMA fraqueza por mês e trabalhe só nela. Prática deliberada é estreita por definição.',
  'Peça a um colega para ler três dos seus atendimentos. Feedback externo é o que falta no ambiente cruel.',
  'Depois de perder uma venda, escreva sua hipótese ANTES de saber o motivo. Depois confira. É assim que se calibra.',
  'Desconfie da frase "eu sei fazer isso". Ela é o sintoma, não a prova.'
 ],
 scripts:[],
 erros:[
  'Achar que anos de casa equivalem a competência. Equivalem a repetição, que é outra coisa.',
  'Treinar tudo ao mesmo tempo. Prática deliberada difusa não é prática deliberada.',
  'Explicar toda venda perdida por preço. É a explicação que não exige mudar nada — e por isso é a mais escolhida.'
 ],
 exercicio:'Antes de abrir o Dashboard de Cotações, escreva num papel: quantas cotações você fez no mês, quantas fecharam, e a sua taxa de conversão. Depois abra e compare. A distância entre o palpite e o número é a sua calibração — e ela melhora só de fazer isso todo mês.',
 leitura:[
  {o:'Ericsson & Pool — <i>Peak</i>', q:'Os capítulos sobre prática deliberada e sobre representações mentais. Traduzem a pesquisa para rotina.'},
  {o:'Hogarth — <i>Educating Intuition</i>', q:'A distinção entre ambientes gentis e cruéis. É o diagnóstico do nosso ofício.'},
  {o:'Kahneman & Klein (2009), <i>Conditions for Intuitive Expertise</i>', q:'Dois pesquisadores que discordavam escreveram juntos onde a intuição funciona. Raro e honesto.'}
 ],
 questoes:[
  'Qual feedback nós NÃO temos hoje e poderíamos ter com pouco esforço? O que impede de perguntar ao cliente que não fechou?',
  'Se "preço" explica toda venda perdida, o que essa explicação nos poupa de olhar?'
 ],
 grafico:{tipo:'barra', t:'Desempenho real × desempenho que a pessoa acha que teve',
   sub:'esquema do padrão de Kruger e Dunning, em percentil',
   labels:['quartil 1','quartil 2','quartil 3','quartil 4'],
   vals:[62,63,70,75], cor:'#A855F7',
   exp:'As barras são a <b>autoavaliação</b> por quartil de desempenho real. O padrão que interessa é o achatamento: quem está no quartil mais baixo se avalia perto de quem está no mais alto. Duas leituras. A primeira, óbvia: quem sabe pouco não tem como saber que sabe pouco. A segunda, mais útil aqui: <b>a autoavaliação varia pouco com o desempenho real</b>, ou seja, ela quase não carrega informação. É por isso que medir — cotação registrada, conversão calculada, atendimento revisado por outro — não é burocracia, é o único jeito de saber onde você está.'}},

{id:'m30', n:30, eixo:'Teoria',
 t:'Onde a neurociência é usada como enfeite',
 sub:'Como ler uma afirmação sobre o cérebro sem ser enganado',
 tempo:'30 min',
 porque:'Este curso inteiro se apoia em pesquisa, e por isso precisa terminar ensinando a duvidar dele. O mercado de treinamento de vendas está cheio de afirmações sobre "cérebro reptiliano", "95% das decisões são inconscientes" e "neurovendas" — números que circulam há décadas sem fonte. Saber separar o que tem base do que é enfeite protege a equipe de perder tempo e dinheiro, e protege este material de virar mais um.',
 teoria:[
  {h:'O apelo sedutor da explicação neurocientífica — Weisberg et al. (2008)',
   p:'Explicações ruins de fenômenos psicológicos passam a ser julgadas como <b>boas</b> quando recebem uma menção irrelevante ao cérebro. No experimento, adicionar "varreduras cerebrais mostram" a uma explicação circular aumentou a aprovação de leigos — e a informação neural acrescentada não explicava nada.<br><br>É por isso que "neuro" vende: não porque esclareça, mas porque a menção ao cérebro <b>funciona como selo de credibilidade</b> mesmo quando é decorativa.',
   ref:'Weisberg, D., Keil, F., Goodstein, J., Rawson, E., & Gray, J. (2008). The Seductive Allure of Neuroscience Explanations. Journal of Cognitive Neuroscience, 20(3), 470-477.'},
  {h:'Neuromitos que não morrem — Pasquinelli (2012)',
   p:'Várias crenças amplamente repetidas não têm sustentação: o "cérebro reptiliano" como camada que decide compras é uma simplificação de um modelo dos anos 1960 há muito abandonado; "usamos 10% do cérebro" é falso; "hemisfério esquerdo lógico e direito criativo" é uma caricatura de lateralização real, porém muito mais sutil.<br><br>Os números redondos sobre decisão inconsciente — 90%, 95%, 99% — circulam sem fonte primária localizável. <b>Que muito do processamento é não consciente é bem estabelecido; a porcentagem específica é invenção.</b>',
   ref:'Pasquinelli, E. (2012). Neuromyths: Why Do They Exist and Persist? Mind, Brain, and Education, 6(2), 89-96.'},
  {h:'A crise de replicação — Open Science Collaboration (2015)',
   p:'Ao repetir 100 estudos publicados em psicologia, uma colaboração internacional obteve resultado significativo em cerca de <b>um terço a metade</b> deles, com tamanhos de efeito bem menores que os originais. Isso não invalida a psicologia: obriga a tratar achado isolado como hipótese, e a confiar em <b>replicação e meta-análise</b>.<br><br>Aplicado a este curso: os módulos que se apoiam em achados muito replicados — ancoragem, aversão à perda, espaçamento, reciprocidade — são bem mais sólidos que os que se apoiam num experimento célebre. E é por isso que cada módulo tem a seção do limite.',
   ref:'Open Science Collaboration (2015). Estimating the reproducibility of psychological science. Science, 349(6251), aac4716.'}
 ],
 evidencia:'No estudo de Weisberg e colegas, a informação neurocientífica irrelevante melhorou a avaliação de explicações RUINS entre leigos e estudantes, e não teve o mesmo efeito entre especialistas — ou seja, o efeito depende exatamente de não se saber avaliar o conteúdo.',
 limite:'A crítica também tem limite. Nada disso autoriza descartar tudo com um dar de ombros: negar em bloco é tão preguiçoso quanto aceitar em bloco, e é a saída de quem não quer mudar nada. O critério é comparativo, não absoluto — <b>achado replicado com efeito modesto vale mais que achado espetacular com um estudo só</b>.',
 aplicacao:[
  'Diante de uma afirmação sobre o cérebro, pergunte: qual estudo? Quantas pessoas? Foi replicado?',
  'Desconfie de porcentagem redonda sem fonte. "95% das decisões são emocionais" é slogan, não achado.',
  'Prefira o material que declara o que NÃO sabe. Curso sem limites declarados está vendendo certeza.',
  'Se uma técnica só funciona quando o cliente não sabe que está sendo usada, ela não é técnica — é manipulação, e o teste do arrependimento reprova.',
  'Duvide deste curso também. Os módulos com a seção de limite mais curta são os que precisam de mais cuidado.'
 ],
 scripts:[],
 erros:[
  'Repetir "cérebro reptiliano" para soar técnico. Quem conhece o assunto ouve o contrário do pretendido.',
  'Citar porcentagem sem fonte porque ela ajuda o argumento.',
  'Tratar um experimento célebre como lei. O célebre costuma ser o que teve efeito grande — e efeito grande é o que menos replica.'
 ],
 exercicio:'Pegue a última propaganda de curso de vendas que você viu. Liste as afirmações sobre cérebro ou comportamento e, para cada uma, procure a fonte primária por 5 minutos. Anote quantas você encontrou. É o exercício mais barato de defesa intelectual que existe.',
 leitura:[
  {o:'Weisberg et al. (2008)', q:'Quatro páginas. Leia os exemplos de explicação com e sem a menção ao cérebro e repare em qual você teria aprovado.'},
  {o:'Open Science Collaboration (2015)', q:'Veja o gráfico de tamanhos de efeito original × replicação. Vale mais que qualquer discussão sobre o tema.'},
  {o:'Chabris & Simons — <i>O Gorila Invisível</i>', q:'Sobre as ilusões cotidianas de atenção, memória e confiança. É o antídoto em formato legível.'}
 ],
 questoes:[
  'Quais afirmações DESTE curso você aceitaria hoje sem conferir? Por quê justamente essas?',
  'Se um fornecedor de treinamento nos apresentar "neurovendas", quais três perguntas fazemos antes de contratar?'
 ],
 grafico:{tipo:'barra', t:'O que sobrou ao repetir 100 estudos de psicologia',
   sub:'Open Science Collaboration (2015)',
   labels:['originais com resultado significativo','replicações com resultado significativo'],
   vals:[97,36], cor:'#FFD11A',
   exp:'Praticamente todos os estudos originais publicados tinham resultado significativo — porque resultado não significativo raramente é publicado. Ao repetir os mesmos 100 experimentos com mais participantes, cerca de um terço se sustentou, e os efeitos que sobreviveram vieram bem menores. <b>Isto não diz que psicologia não presta.</b> Diz que achado isolado é hipótese, e que a confiança tem de vir de replicação — critério que este curso aplicou ao escolher o que ensinar, e que você deveria aplicar a ele.'}}
];
var MGW_MANUAL=[

/* ─────────────────────────  1. PRIMEIRO CONTATO  ───────────────────────── */
{g:'Primeiro contato', ico:'👋', itens:[
 {t:'Lead veio do anúncio e só mandou "oi"',
  q:'Primeira mensagem, sem contexto nenhum.',
  p:'Quem manda só "oi" ainda não decidiu conversar — está testando se tem alguém do outro lado. Responder com um bloco de perguntas afasta. O objetivo desta mensagem é uma coisa só: fazer a pessoa responder de novo.',
  f:['Oi! 😊 Aqui é o {vendedor}, da Magiway. Sou eu que cuido do carro de vocês em Orlando do começo ao fim.\n\nMe conta rapidinho: vocês vão em quantas pessoas e em que período?',
     'Oi, tudo bem? Que bom que você chamou! Antes de eu te passar qualquer valor, me diz duas coisas: quantos vão viajar e quantos dias vocês ficam? Assim eu já monto certo.',
     'Oi! Aqui é o {vendedor}. Orlando é comigo mesmo 🙂 Você já tem as datas ou ainda está montando a viagem?']},

 {t:'Lead pediu o preço já na primeira mensagem',
  q:'"Quanto custa uma minivan de 10 a 20 de dezembro?"',
  p:'Mandar o número agora é entregar a conversa para a comparação de tarifa — e a nossa não é a menor. Não se recusa a responder (isso irrita), mas se ganha uma pergunta antes. Uma só.',
  f:['Consigo sim! Só uma coisa antes pra eu não te passar valor errado: vocês são quantas pessoas com as malas? A minivan de 7 e a de 8 mudam bastante de preço.',
     'Já te passo. Retirada e devolução são as duas em Orlando ou tem trecho pra outra cidade? Isso muda o valor.',
     'Claro! De 10 a 20 são 10 diárias — nessa faixa eu consigo condição melhor. Vocês vão em quantos?']},

 {t:'Veio por indicação',
  q:'"Fulano me passou seu contato."',
  p:'Indicação já chega com confiança emprestada. O erro é tratar igual a lead frio: perde-se a vantagem. Nomear quem indicou reativa a memória boa e a pessoa entra na conversa já do nosso lado.',
  f:['Que alegria! O {quem} viajou com a gente em {mês} e deu tudo certo — fico feliz que ele tenha lembrado da gente 🙏\n\nMe conta da sua viagem: quantas pessoas e quantos dias?',
     'Ahh o {quem}! Cuidei do carro dele pessoalmente. Vou cuidar do seu igual. Me conta as datas?']},

 {t:'Voltou depois de meses',
  q:'Cliente antigo, ou lead antigo que sumiu e reapareceu.',
  p:'Mostrar que você lembra é o gesto mais barato e mais eficaz que existe. Não é técnica — é a diferença entre ser fornecedor e ser conhecido.',
  f:['{nome}! Que bom te ver por aqui de novo 😄 Da última vez foi a {categoria} em {mês}, né? Deu tudo certo?',
     'Oi {nome}! Lembro de você sim. Vocês tinham ido pra Orlando com as crianças. Vai ser de novo?']}
]},

/* ─────────────────────────  2. DESCOBERTA  ───────────────────────── */
{g:'Descoberta e qualificação', ico:'🔍', itens:[
 {t:'As quatro perguntas que decidem tudo',
  q:'Sempre, antes de qualquer proposta.',
  p:'São as quatro do perfil ideal: dias, praças, ocupantes, janela. Sem elas você não sabe se está diante de uma venda de R$ 5 mil ou de uma cotação que não vai fechar. Perguntar uma por vez, não em bloco: bloco de perguntas parece formulário e derruba a resposta.',
  f:['Vocês vão em quantos adultos e quantas crianças? (e as idades das crianças, por causa da cadeirinha)',
     'Quantos dias no total? Do dia {x} ao {y}?',
     'Retirada e devolução no aeroporto de Orlando mesmo, ou tem trecho pra Miami/outra cidade?',
     'A viagem é pra quando? Já está com passagem comprada?']},

 {t:'Achar a preocupação real',
  q:'Depois dos dados, antes da proposta.',
  p:'É a pergunta mais importante do método. A proposta que responde a uma preocupação declarada converte muito mais que a proposta genérica — e a resposta dele vira o roteiro do seu passo 5. Se ele não declarar nada, você vai vender no escuro.',
  f:['O que mais te deixa em dúvida nessa parte do carro? Pergunto porque cada família se preocupa com uma coisa diferente — tem gente que é a cadeirinha, tem gente que é dirigir do outro lado, tem gente que é o seguro.',
     'Já alugaram carro nos Estados Unidos antes? Se já, teve alguma coisa que te incomodou?',
     'Tem alguma coisa que você não quer que aconteça de jeito nenhum nessa viagem?']},

 {t:'Cliente não sabe qual carro quer',
  q:'"Não entendo de carro, o que vocês recomendam?"',
  p:'Aqui a autoridade é bem-vinda — ele pediu. Recomendar UM, com o motivo prático, e não abrir um cardápio. Excesso de opção trava decisão.',
  f:['Pelo que você me falou — {n} pessoas, {dias} dias, com malas — eu iria de minivan de 7 lugares sem pensar duas vezes. Com {n} pessoas num SUV, as malas não cabem e alguém viaja com mochila no colo a viagem inteira.',
     'Vou te dar minha recomendação, não o cardápio: {categoria}. É o que eu colocaria a minha família.']},

 {t:'Cliente com muitas pessoas e orçamento apertado',
  q:'Grupo grande, mas sensível a preço.',
  p:'Aqui a matemática ajuda de verdade: dividido por pessoa, o valor muda de escala. Não é truque — é a comparação certa, porque a decisão é do grupo.',
  f:['Vocês são {n} pessoas. O total dos {dias} dias fica em {valor} — dividido por {n}, dá {porPessoa} por pessoa na viagem inteira. Costuma ser menos que o Uber que vocês fariam sem carro.',
     'Uma coisa que vale a conta: com {n} pessoas, sem carro é Uber pra tudo. Um trajeto de hotel a parque, ida e volta, sai fácil {uber} por dia.']}
]},

/* ─────────────────────────  3. APRESENTAR VALOR  ───────────────────────── */
{g:'Apresentar o valor', ico:'💎', itens:[
 {t:'A ordem certa dos inclusos',
  q:'Sempre antes do preço.',
  p:'A ordem não é estética. Zero caução vem primeiro porque é o que trava dinheiro do cliente na viagem inteira — é uma PERDA evitada, e perda pesa mais que ganho. Depois seguro (medo), suporte (solidão), carro reserva (viagem parada). Preço por último, e sem pedir desculpa.',
  f:['Antes do valor deixa eu te falar o que já vai dentro, porque isso muda a comparação:\n\n🔓 *Zero caução* — a locadora americana bloqueia de 500 a 1.500 dólares no seu cartão e libera semanas depois. Com a gente não bloqueia nada.\n\n🛡️ *Seguro total, sem franquia* — se acontecer alguma coisa você não paga nada e não discute em inglês.\n\n🇧🇷 *Suporte 24h em português* — com gente de verdade. Deu problema no domingo, você fala comigo.\n\n🚗 *Carro reserva* — pane, a gente troca. Sua viagem não para.\n\n💳 *Até 12x* no cartão brasileiro.\n\nCom tudo isso, os {dias} dias ficam em {valor}.']},

 {t:'Explicar por que somos mais caros — sem pedir desculpa',
  q:'Quando o cliente já viu outra tarifa.',
  p:'Nunca dizer "é mais caro, mas...". O "mas" apaga o que veio antes. A construção certa é: somos diferentes, e o preço é consequência disso. E dizer o número da outra empresa antes que ele diga — tira a arma da mão dele e mostra que você não tem o que esconder.',
  f:['Vou ser direto com você: a gente não é o mais barato de Orlando, e nem tenta ser.\n\nO que a gente faz é diferente. Lá, se o carro der problema, você liga pra um 0800 em inglês e resolve sozinho. Aqui você me manda mensagem e eu resolvo. É por isso que custa diferente — e é por isso que quem viaja com a gente uma vez volta.',
     'Se o seu critério for só o preço da diária, sinceramente vai achar mais barato. Se o critério for não ficar na mão a 8 mil km de casa, aí a conta muda.']},

 {t:'Cliente de primeira viagem aos EUA',
  q:'Nunca alugou carro fora do Brasil.',
  p:'Aqui a preocupação real quase nunca é preço: é medo do desconhecido. Vender segurança processual — o passo a passo — vale mais que qualquer desconto.',
  f:['Primeira vez? Então deixa eu te tranquilizar: eu te mando um passo a passo com foto de onde retirar o carro, o que apresentar e o que falar. Você chega sabendo exatamente o que fazer.',
     'Muita gente trava no aeroporto porque tudo é em inglês. Com a gente você não passa por isso — a retirada é sem fila e eu fico disponível no WhatsApp na hora, mesmo que seja 3 da manhã aí.']},

 {t:'Casal sem filhos',
  q:'Duas pessoas, viagem curta ou média.',
  p:'Não é o perfil ideal, e vale saber disso: não force minivan. Venda a categoria certa e a experiência — e, se der, alongue as diárias, que é onde o ticket mora.',
  f:['Pra vocês dois, um SUV resolve bem e sobra espaço de mala. A minivan seria carro demais.',
     'Uma dica: se der pra esticar mais dois ou três dias, a diária cai bastante e vocês conseguem fazer a costa também. Quer que eu simule?']},

 {t:'Família grande — o perfil que a gente quer',
  q:'6 a 8 pessoas, 10+ dias, Orlando→Orlando.',
  p:'É o cliente ideal. Ele merece o melhor atendimento e a proposta mais completa — e é aqui que vale investir tempo, porque é aqui que a margem e a indicação moram.',
  f:['Esse é exatamente o perfil que a gente mais atende: família grande, viagem longa, Orlando. A minivan de 8 lugares vai ser confortável de verdade — não é aquele "cabe apertado".',
     'Com {dias} dias e {n} pessoas eu consigo a melhor condição da casa. Deixa eu montar direitinho pra você.']}
]},

/* ─────────────────────────  4. OBJEÇÃO DE PREÇO  ───────────────────────── */
{g:'Objeção de preço', ico:'💰', itens:[
 {t:'"Está caro"',
  q:'A objeção mais comum de todas.',
  p:'"Caro" quase nunca é sobre o número — é sobre o número não ter justificativa suficiente ainda. A primeira coisa é NÃO baixar o preço na hora: baixar imediatamente ensina que o preço era inventado. Pergunte em relação a quê.',
  f:['Entendo. Caro comparado com o quê? Pergunto sério — se você viu outra proposta, me manda que eu te mostro o que muda de uma pra outra. Às vezes é o mesmo carro com metade das coisas.',
     'Posso te fazer uma pergunta antes de falar de valor? O que você viu mais barato incluía seguro total e caução zero? É onde quase sempre está a diferença.',
     'Deixa eu abrir a conta com você: {valor} em {dias} dias dá {diaria} por dia, com seguro total, sem caução e com suporte em português. Sozinhos, seguro e caução já passam disso lá fora.']},

 {t:'"Achei por metade do preço"',
  q:'Cliente com proposta concorrente na mão.',
  p:'Não desqualificar o concorrente — isso soa a insegurança e defende o outro. Comparar item por item, e deixar a conclusão para ele. Se depois disso ele ainda escolher o mais barato, o perfil não é nosso, e está tudo bem.',
  f:['Pode ser que seja mesmo. Me manda a proposta que eu comparo com você linha a linha — sem enrolação. Se lá estiver melhor, eu te falo.',
     'Três perguntas que costumam explicar a diferença: 1) inclui seguro total sem franquia? 2) tem caução bloqueada no cartão? 3) o atendimento é em português e com pessoa? Se as três forem sim, aí realmente vale a pena.',
     'Olha, se o seu orçamento está fechado nesse valor, eu prefiro te falar com honestidade: a gente não chega lá. E tudo bem — melhor eu te dizer agora do que você descobrir depois.']},

 {t:'"Dá um desconto?"',
  q:'Pedido direto de abatimento.',
  p:'Desconto dado de graça vira expectativa, e reduz o valor percebido do que já foi dito. Se houver espaço, troque por algo — mais diárias, indicação, pagamento à vista. Contrapartida preserva a percepção de valor.',
  f:['Consigo melhorar sim, mas deixa eu te propor uma troca: se você esticar pra {dias+2} dias, eu faço a diária por {valorMenor}. Fica mais tempo e paga menos por dia.',
     'À vista no PIX eu consigo tirar {valor} do total. Fechado assim?',
     'O que eu consigo fazer é {condição}. Abaixo disso eu teria que tirar alguma coisa que está inclusa, e eu não gosto de fazer isso — prefiro entregar tudo e ser honesto no valor.']},

 {t:'"Vocês parcelam?"',
  q:'Sinal de compra, não de objeção.',
  p:'Quem pergunta de parcelamento já decidiu que quer — está resolvendo como. Responder com clareza e emendar direto no fechamento.',
  f:['Parcelamos em até 12x no cartão brasileiro, sem complicação. Quer que eu já simule em quantas vezes?',
     'Em 12x fica {parcela} por mês. Se preferir à vista no PIX, eu consigo {desconto} de desconto. Qual funciona melhor pra vocês?']},

 {t:'"O câmbio subiu, ficou inviável"',
  q:'Cliente usando o dólar como motivo.',
  p:'Às vezes é real, às vezes é forma educada de dizer não. Vale reconhecer o fato (nunca discutir com a realidade do cliente) e oferecer o que está ao seu alcance: travar o valor em real.',
  f:['Entendo demais, o dólar apertou pra todo mundo. Uma coisa que ajuda: o seu valor fica travado em real no dia do fechamento. Se o dólar subir até a viagem, o seu não muda.',
     'Se ajudar, dá pra fechar agora com entrada e o resto parcelado — você trava o câmbio de hoje e paga ao longo dos meses.']}
]},

/* ─────────────────────────  5. OBJEÇÃO DE CONFIANÇA  ───────────────────────── */
{g:'Objeção de confiança', ico:'🤝', itens:[
 {t:'"Nunca ouvi falar de vocês"',
  q:'Desconfiança legítima de empresa pequena.',
  p:'É a objeção mais justa que existe e não se responde com adjetivo. Responde-se com prova verificável: gente com nome, redes que se pode abrir, contrato que se pode ler antes de pagar. Ficar na defensiva confirma a suspeita.',
  f:['Justíssimo, e eu prefiro que você desconfie mesmo — é o seu dinheiro. Te mando agora nosso Instagram, depoimentos de clientes com nome e cidade, e o contrato pra você ler ANTES de pagar qualquer coisa.',
     'A gente é uma empresa de brasileiro pra brasileiro em Orlando. Não somos gigantes, e é exatamente por isso que você fala comigo e não com um robô. Quer falar por vídeo? Eu te mostro a operação.']},

 {t:'"E se eu pagar e vocês sumirem?"',
  q:'Medo de golpe.',
  p:'Nunca se ofender. Medo de golpe é racional em quem compra pela internet. Dar o caminho de segurança — contrato antes, dados da empresa, pagamento rastreável — resolve mais que qualquer juramento.',
  f:['Pergunta certíssima. Funciona assim: você recebe o contrato com os dados da empresa e assina digitalmente pelo DocuSign. Só depois disso é que entra pagamento, e sempre em nome da empresa — nunca em conta de pessoa física.',
     'Te passo o CNPJ, o contrato e o voucher. Você confere tudo com calma. Se algo não fechar, não fecha o negócio — sem constrangimento nenhum.']},

 {t:'"Meu amigo teve problema com locadora lá"',
  q:'História ruim de terceiro.',
  p:'Não minimizar a história — isso desqualifica a experiência de alguém que ele confia. Concordar, e mostrar que é justamente por isso que existimos.',
  f:['Infelizmente acontece muito, e é exatamente por isso que a gente existe. A maioria dos perrengues é: caução travada, cobrança que aparece depois e ninguém pra atender em português. As três coisas a gente resolve na origem.',
     'O que aconteceu com ele, se puder me contar? Quero te mostrar especificamente como isso não acontece aqui.']},

 {t:'Pedido de comprovação',
  q:'"Vocês têm CNPJ? Tem site? Tem avaliação?"',
  p:'Entregar tudo de uma vez, sem hesitar. Hesitação aqui custa a venda inteira. Quem entrega antes de ser pressionado passa a impressão certa: não tenho o que esconder.',
  f:['Claro, anota aí: CNPJ {cnpj}, Instagram @{instagram}, e nosso site {site}. Te mando também três depoimentos em vídeo de clientes recentes.',
     'Te mando o contrato modelo agora mesmo, antes de qualquer pagamento. Lê com calma, mostra pra quem você quiser.']}
]},

/* ─────────────────────────  6. OBJEÇÃO DE TEMPO  ───────────────────────── */
{g:'"Vou pensar" e adiamentos', ico:'⏳', itens:[
 {t:'"Vou pensar e te falo"',
  q:'O adiamento clássico.',
  p:'"Vou pensar" quase sempre esconde uma dúvida não dita. Aceitar de cara e desligar é perder a chance de descobrir qual. Aceite — e faça UMA pergunta. E combine o retorno, senão o retorno não acontece.',
  f:['Claro, pensa com calma. Só me tira uma dúvida pra eu não ficar no escuro: é o valor, a data ou o carro que ficou em aberto?',
     'Perfeito. Só pra eu te ajudar melhor: tem alguma coisa que eu não expliquei direito e que ficou martelando?',
     'Combinado. Te chamo {dia} pra saber, pode ser? Se você decidir antes, é só me mandar mensagem.']},

 {t:'"Vou ver com meu marido / minha esposa"',
  q:'Decisão compartilhada.',
  p:'É objeção verdadeira na maioria das vezes — e a pessoa que decide junto não está na conversa. Sua tarefa é equipar o interlocutor para defender a proposta sem você. Mandar um resumo curto e claro é o que faz isso.',
  f:['Faz todo sentido, é decisão de casal mesmo. Vou te mandar um resumo curtinho com tudo que está incluso e o valor, pra você mostrar pra ele sem precisar lembrar de tudo.',
     'Quer que eu entre num grupo com vocês dois? Aí eu respondo as dúvidas dele direto e você não vira intermediária.']},

 {t:'"A viagem ainda é longe"',
  q:'Retirada em 6 meses ou mais.',
  p:'É objeção real de urgência. Não invente escassez — se for descoberto, perde-se a confiança inteira e não volta. Ofereça o que é verdadeiro: reserva sem compromisso, ou travamento de valor.',
  f:['Sem problema nenhum. Uma coisa que talvez te interesse: eu consigo travar o valor de hoje pra viagem de {mês}. Se subir, o seu não sobe.',
     'Posso te deixar reservado sem pagar nada agora? Aí você tem o carro garantido e decide mais perto.']},

 {t:'Cliente vai comparar e voltar',
  q:'"Vou ver outras opções."',
  p:'Ótimo momento para dar a ele os critérios de comparação — porque ele vai comparar de qualquer jeito, e quem define a régua tem vantagem. Isso não é manipulação: são as perguntas que qualquer pessoa deveria fazer.',
  f:['Faz muito bem, compare mesmo. Anota três perguntas pra fazer nos outros lugares, porque é onde a diferença aparece:\n1) O seguro é total, sem franquia?\n2) Bloqueia caução no cartão? Quanto?\n3) Se der problema no domingo, quem atende e em que língua?\n\nSe alguém responder melhor que a gente nas três, pode ir tranquilo.',
     'Compara sim! E se voltar aqui depois, o valor que eu te passei continua de pé por {prazo} dias.']}
]},

/* ─────────────────────────  7. SUMIÇO E FOLLOW-UP  ───────────────────────── */
{g:'Sumiço e follow-up', ico:'📵', itens:[
 {t:'Follow-up 1 — 24 a 48h depois',
  q:'Mandou a proposta e não teve resposta.',
  p:'O primeiro follow-up NÃO deve cobrar resposta. Deve adicionar algo. Mensagem que só pergunta "e aí?" transfere para o cliente o incômodo de dizer não, e o mais fácil para ele é continuar em silêncio.',
  f:['{nome}, lembrei de você agora: nessa semana de {data} tem {evento} em Orlando, e o trânsito na saída dos parques fica pesado. Com carro próprio dá pra sair antes. Só pra você considerar 🙂',
     'Oi {nome}! Consegui uma condição melhor na {categoria} pro seu período — {valor}. Vale te avisar antes de acabar.']},

 {t:'Follow-up 2 — 4 a 5 dias',
  q:'Continua sem resposta.',
  p:'Agora sim, uma pergunta direta e fácil de responder. Oferecer as duas saídas — inclusive a de não fechar — costuma destravar mais que insistir, porque tira o peso de dar a má notícia.',
  f:['{nome}, tudo bem? Só pra eu me organizar aqui: ainda faz sentido pra vocês ou seguiram por outro caminho? Pode falar tranquilo, sem problema nenhum 🙂',
     'Oi {nome}! Vou liberar a {categoria} que estava separada pra vocês, tudo bem? Se ainda estiver de pé é só falar que eu seguro.']},

 {t:'Follow-up 3 — o de encerramento',
  q:'Última mensagem antes de parar.',
  p:'A mensagem de encerramento tem a maior taxa de resposta de toda a sequência: fecha o assunto e libera a pessoa. E deixa a porta aberta sem custo nenhum. Nunca mande com tom de mágoa.',
  f:['{nome}, vou parar de te incomodar 🙂 Deixo só isto: se mudar de ideia, mesmo que seja daqui a um ano, é só me chamar. Guardo seu contato e o histórico da sua viagem. Boa viagem, de coração!',
     'Encerrando por aqui pra não ficar enchendo. Qualquer coisa, meu número está salvo. Se um amigo seu for pra Orlando, lembra da gente 🙏']},

 {t:'Cliente respondeu depois de sumir',
  q:'Voltou dias ou semanas depois.',
  p:'Zero cobrança. Nenhuma. "Achei que tinha desistido" cria constrangimento e derruba a conversa que acabou de voltar.',
  f:['{nome}! Que bom te ver por aqui 😄 Vamos retomar: as datas continuam {datas}?',
     'Oi! Sem problema nenhum, a vida corre. Ainda dá tempo sim — deixa eu ver a disponibilidade agora.']}
]},

/* ─────────────────────────  8. FECHAMENTO  ───────────────────────── */
{g:'Fechamento', ico:'✅', itens:[
 {t:'Fechamento por escolha',
  q:'Cliente demonstrou interesse claro.',
  p:'Nunca perguntar "vamos fechar?" — pergunta de sim ou não convida o não. Pergunta de A ou B move para frente preservando a sensação de escolha, que é o que evita a reação de resistência.',
  f:['Perfeito! Prefere retirar de manhã ou à tarde no dia {data}?',
     'Vou reservar então. Você prefere pagar à vista no PIX com desconto ou parcelar em 12x?',
     'Fechado. Te mando o contrato agora — prefere assinar pelo celular ou pelo computador?']},

 {t:'Fechamento assumido',
  q:'Todos os sinais dizem sim, mas o cliente não dá o passo.',
  p:'Às vezes falta apenas alguém conduzir. Assumir o próximo passo e narrar o que vai acontecer reduz o esforço de decidir — decidir cansa, e no fim da conversa a pessoa já está cansada.',
  f:['Vou fazer o seguinte: já reservo a minivan no seu nome e te mando o contrato. Você lê com calma e, se estiver tudo certo, assina. Sem compromisso até assinar. Pode ser?',
     'Deixa comigo. Te mando tudo organizado em cinco minutos: contrato, voucher e o passo a passo da retirada.']},

 {t:'Última dúvida antes de assinar',
  q:'Cliente travou no fim.',
  p:'Dúvida de última hora quase sempre é medo de errar, não falta de informação. Reduza o tamanho da decisão e lembre que ela é reversível, se for.',
  f:['Fica tranquilo. Você assina, e se surgir qualquer coisa até {prazo} a gente ajusta ou cancela sem multa. Não é uma porta que fecha.',
     'É normal dar aquele friozinho. Qualquer dúvida que aparecer depois de assinar, você me chama direto — é pra isso que eu estou aqui.']}
]},

/* ─────────────────────────  9. PÓS-VENDA  ───────────────────────── */
{g:'Pós-venda', ico:'🎁', itens:[
 {t:'Confirmação logo após o pagamento',
  q:'Minutos depois de fechar.',
  p:'É o momento de maior arrependimento potencial da jornada inteira. Uma mensagem que confirma tudo e mostra o que vem a seguir dissolve o arrependimento antes de ele nascer.',
  f:['Fechado, {nome}! 🎉 Está tudo confirmado:\n\n🚗 {categoria}\n📅 {dataIn} a {dataOut}\n📍 Retirada: {local}\n💳 {pagamento}\n\nSeu voucher está anexado. Salva meu número — daqui até a viagem, qualquer coisa é comigo.']},

 {t:'Véspera da viagem',
  q:'1 a 2 dias antes da retirada.',
  p:'É o pico de ansiedade da viagem. A mensagem aqui vale mais do que dez no meio do caminho — e é ela que gera a indicação depois, porque é a que fica na memória.',
  f:['{nome}, amanhã é o grande dia! ✈️ Seu carro está confirmado e te esperando.\n\nNa chegada é só {passoARetirada}. Qualquer coisa me chama, estou aqui.\n\nBoa viagem pra vocês! 🎢']},

 {t:'Dia da chegada',
  q:'Depois do horário previsto de retirada.',
  p:'Uma pergunta curta. Se deu tudo certo, cria vínculo; se deu errado, você descobre antes de virar reclamação pública.',
  f:['Chegaram bem? Conseguiram pegar o carro sem problema? 🚗',
     'E aí {nome}, tudo certo com o carro? Qualquer coisa é só falar.']},

 {t:'Devolução e pedido de indicação',
  q:'No dia da devolução ou no dia seguinte.',
  p:'É o único momento em que pedir indicação é natural: a experiência acabou de acontecer e a memória está fresca e boa. Pedir antes soa a cobrança; pedir muito depois já esfriou.',
  f:['{nome}, que bom que deu tudo certo! 🙏 Foi um prazer cuidar da viagem de vocês.\n\nPosso te pedir uma coisa? Se você conhece alguém que vai pra Orlando, me indica. É assim que a gente cresce — e eu cuido da pessoa igualzinho cuidei de vocês.',
     'Se puder deixar uma palavrinha sobre a experiência, ajuda demais quem está com receio de alugar com empresa pequena 🙏']}
]},

/* ─────────────────────────  10. SITUAÇÕES DIFÍCEIS  ───────────────────────── */
{g:'Situações difíceis', ico:'🚨', itens:[
 {t:'Carro deu problema durante a viagem',
  q:'Cliente aciona, geralmente nervoso.',
  p:'Ordem obrigatória: acolher, garantir, agir. Pular o acolhimento e ir direto ao procedimento faz a pessoa se sentir tratada como protocolo — e é assim que um problema resolvido vira avaliação ruim.',
  f:['{nome}, respira que eu resolvo. Primeiro: todo mundo está bem?',
     'Certo. Você não vai pagar nada por isso e não vai ficar sem carro. Me manda sua localização que eu já aciono.',
     'Estou acompanhando daqui até você estar rodando de novo. Não vou sumir.']},

 {t:'Cliente irritado',
  q:'Mensagem em tom duro, com razão ou sem.',
  p:'Não defender a empresa na primeira mensagem. Quem está irritado precisa ser ouvido antes de conseguir processar qualquer explicação — explicar cedo demais é lido como desculpa. Assumir a parte que é nossa desarma mais que qualquer argumento.',
  f:['{nome}, você tem razão de estar chateado e eu sinto muito. Deixa eu entender exatamente o que aconteceu pra eu resolver.',
     'Isso não deveria ter acontecido e a responsabilidade é nossa. Me dá uma hora que eu volto com a solução — não com explicação.']},

 {t:'Cobrança inesperada ou multa',
  q:'Apareceu valor que o cliente não esperava.',
  p:'Transparência imediata, com o comprovante. Cobrança sem prova vira briga; com prova, vira fato. E se o erro for nosso, assumir rápido custa muito menos do que defender.',
  f:['Deixa eu conferir isso agora mesmo e te mando o comprovante do que foi. Se for erro nosso, eu devolvo hoje.',
     'Conferi: foi {motivo}, no dia {data}, valor {valor} — segue o comprovante. Qualquer coisa que não bater, me fala que eu contesto pra você.']},

 {t:'Atraso na entrega do carro',
  q:'O cliente está esperando.',
  p:'Avisar ANTES de o cliente perguntar. Atraso comunicado é contratempo; atraso descoberto é descaso. Dar prazo real, nunca otimista.',
  f:['{nome}, te aviso antes que você pergunte: vamos atrasar {min} minutos por {motivo}. Já estou resolvendo e te aviso quando estiver a caminho. Desculpa pelo transtorno.',
     'Atualizando: {status}. Previsão agora é {hora}. Obrigado pela paciência 🙏']},

 {t:'Pedido de cancelamento',
  q:'Cliente quer desistir.',
  p:'Antes de aplicar a política, entender o motivo — metade dos cancelamentos é remarcação disfarçada. E cancelamento bem tratado vira indicação futura; cancelamento brigado vira avaliação ruim para sempre.',
  f:['Sem problema, {nome}. Só me conta o que mudou — se for data, eu remarco sem custo e a gente resolve fácil.',
     'Entendi. Vou processar o cancelamento conforme o contrato e te mando tudo por escrito. E fica o convite: quando remarcarem, me chama que eu cuido de novo.']}
]},

/* ─────────────────────────  11. RECUPERAÇÃO  ───────────────────────── */
{g:'Recuperação', ico:'♻️', itens:[
 {t:'Cotação antiga que não fechou',
  q:'Semanas ou meses depois.',
  p:'A abordagem certa não é "você não respondeu" — é trazer novidade. Motivo novo dá licença social para reabrir a conversa sem constranger ninguém.',
  f:['{nome}, tudo bem? Passando aqui porque abriu {categoria} pro período que você tinha me perguntado, com condição melhor. Lembrei de vocês. Ainda vão?',
     'Oi {nome}! Faz tempo que a gente conversou sobre Orlando. A viagem chegou a acontecer? Se ainda estiver nos planos, eu te ajudo de novo.']},

 {t:'Cliente antigo, sem viajar há tempo',
  q:'Já alugou, sumiu.',
  p:'Cliente que já comprou converte muito mais que lead novo, e custa muito menos. Esta lista é o ativo mais subaproveitado que existe numa operação pequena.',
  f:['{nome}! Quanto tempo 😄 Da última vez foi a {categoria} em {mês}. Vocês voltaram pra Orlando depois disso?',
     'Oi {nome}! Estou passando nos clientes que cuidei pessoalmente pra saber como vocês estão. Planos de viagem pro ano que vem?']},

 {t:'Cliente que teve problema e voltou',
  q:'Reclamou antes, está de volta.',
  p:'Reconhecer o passado é obrigatório. Fingir que não houve problema soa falso e reabre a ferida. Reconhecer e mostrar o que mudou transforma o pior cliente no mais leal — porque ele viu a empresa sob pressão.',
  f:['{nome}, que bom que você voltou — e obrigado pela segunda chance 🙏 Depois do que aconteceu com vocês, a gente mudou {oQueMudou}. Vou cuidar dessa pessoalmente.']}
]},

/* ─────────────────────────  12. CASOS ESPECIAIS  ───────────────────────── */
{g:'Casos especiais', ico:'🧩', itens:[
 {t:'Grupo grande — dois carros',
  q:'Mais de 8 pessoas.',
  p:'Oportunidade de ticket alto. Apresentar como solução organizada, não como "não cabe todo mundo" — a segunda leitura frustra e a primeira empolga.',
  f:['Com {n} pessoas o ideal são dois carros — uma minivan de 8 e um SUV. Além de caber tudo confortável, vocês ganham liberdade: nem todo mundo quer fazer o mesmo passeio no mesmo dia.',
     'Fechando os dois juntos eu consigo condição melhor no conjunto. Quer que eu monte assim?']},

 {t:'Cliente quer trecho Orlando → Miami',
  q:'Retirada e devolução em cidades diferentes.',
  p:'Sai do perfil ideal e tem taxa de one-way. Ser transparente sobre isso desde o começo evita a surpresa que mata a venda no fim.',
  f:['Dá pra fazer sim. Só te adianto: quando retira em Orlando e devolve em Miami, existe uma taxa de retorno do carro, que é {taxa}. Prefiro te falar agora do que te surpreender depois.',
     'Uma alternativa que muita gente faz: retirar e devolver em Orlando, e ir pra Miami de avião. Costuma sair mais barato que a taxa. Quer que eu simule as duas?']},

 {t:'Cliente pergunta de cadeirinha',
  q:'Viaja com criança pequena.',
  p:'É exigência legal na Flórida e é preocupação real de pai e mãe. Responder com segurança técnica gera confiança imediata, porque mostra domínio de um assunto que ele não domina.',
  f:['Cadeirinha é obrigatório na Flórida até 5 anos, e a gente fornece. Me diz as idades que eu já incluo a certa: bebê conforto, cadeira ou assento de elevação.',
     'Fica tranquilo que vem instalada e conferida. Você não vai precisar montar nada no estacionamento do aeroporto com criança no colo.']},

 {t:'Cliente quer pagar em dólar / em conta americana',
  q:'Pedido de forma de pagamento fora do padrão.',
  p:'Explicar sem parecer que se está escondendo algo. Se não fizer, dizer claramente e oferecer a alternativa.',
  f:['A gente trabalha em real, com a empresa brasileira e nota — é o que te dá segurança jurídica se algo der errado. Em dólar você ficaria sem essa proteção.',
     'Consigo fazer {alternativa}. Funciona pra você?']},

 {t:'Cliente pede nota fiscal / comprovante para reembolso',
  q:'Viagem corporativa ou reembolso de terceiro.',
  p:'Sinal de compra forte — ele já está pensando em como prestar contas. Facilitar aqui remove o último obstáculo.',
  f:['Claro! Emito nota com CNPJ, e te mando junto o contrato e o voucher. Precisa de algum dado específico da empresa que vai reembolsar?']},

 {t:'Cliente compara com locadora americana grande',
  q:'"Na {marca} está mais barato."',
  p:'Nunca falar mal da marca — ela tem reputação e atacá-la faz o cliente defendê-la. Comparar o que acontece QUANDO DÁ ERRADO, que é onde a diferença aparece.',
  f:['A {marca} é uma boa empresa mesmo, sem tirar o mérito. A diferença aparece quando dá algum problema: lá é 0800 em inglês e fila no balcão; aqui é o meu WhatsApp. Enquanto está tudo bem, as duas são iguais.',
     'E tem a caução: eles bloqueiam de 500 a 1.500 dólares no seu cartão durante a viagem inteira. Se você vai usar o cartão nos parques e nas compras, esse limite faz falta.']}
]}
];
var MGW_MANUAL_EXTRA=[

{g:'Canais que não são WhatsApp', ico:'📡', itens:[
 {t:'Direct do Instagram',
  q:'Mensagem vinda do perfil.',
  p:'No Direct a pessoa está em modo de navegação, não de compra. Mensagem longa não é lida. O objetivo é só um: mudar de canal para o WhatsApp, onde a conversa cabe.',
  f:['Oi! Que bom que você chamou 😊 Aqui é o {vendedor} da Magiway.\n\nPra eu te montar direitinho, me passa seu WhatsApp? Lá consigo te mandar o orçamento completo com tudo que vai incluso.',
     'Oi! Orlando é comigo mesmo 🙂 Me chama no {whatsapp} que eu te atendo agora — aqui no Direct fica capenga pra mandar valor e contrato.']},

 {t:'Comentário público no post',
  q:'"Quanto custa?" nos comentários.',
  p:'Comentário é palco: quem responde bem ali vende para todo mundo que está lendo, não só para quem perguntou. Nunca dar o preço no comentário — dá o preço para o concorrente também. Responder com calor e chamar para o privado.',
  f:['Oi {nome}! Depende dos dias e de quantas pessoas 🙂 Te chamei no Direct pra montar certinho!',
     'Boa pergunta! Varia bastante conforme o período e o carro. Me chama no Direct que eu te faço agora, rapidinho 💬']},

 {t:'E-mail formal',
  q:'Cliente que prefere e-mail, ou empresa.',
  p:'E-mail pede outro registro: mais estruturado, com assunto claro e o valor no corpo, não em anexo. Anexo em e-mail comercial de empresa desconhecida é o caminho mais curto para a caixa de spam e para a desconfiança.',
  f:['Assunto: Sua minivan em Orlando — {dataIn} a {dataOut}\n\nOlá, {nome}, tudo bem?\n\nAqui é o {vendedor}, da Magiway Rental Car. Seguem as informações da sua reserva:\n\n• Categoria: {categoria}\n• Período: {dataIn} a {dataOut} ({dias} diárias)\n• Retirada e devolução: {local}\n• Valor total: {valor} (até 12x)\n\nJá incluso: seguro total sem franquia, zero caução bloqueada, suporte 24h em português, carro reserva e cadeirinha conforme a idade.\n\nQualquer dúvida, respondo aqui ou pelo WhatsApp {whatsapp}.\n\nAbraço,\n{vendedor}']},

 {t:'Ligação telefônica',
  q:'Cliente ligou ou pediu para ligar.',
  p:'Na voz, o eixo de calor do módulo 2 do curso é transmitido em segundos — e é a maior vantagem do canal. O erro é tratar a ligação como se fosse um WhatsApp falado: enfileirar informação. Na voz, pergunte mais e fale menos.',
  f:['Magiway, {vendedor}, boa tarde! Com quem eu falo?',
     '{nome}, prazer! Me conta da viagem de vocês — quantas pessoas e que período?',
     'Vou te mandar tudo por escrito no WhatsApp pra você não precisar anotar nada. Qual é o seu número?']}
]},

{g:'Objeções difíceis', ico:'🧱', itens:[
 {t:'"Vi avaliação ruim de vocês"',
  q:'Cliente encontrou reclamação.',
  p:'Não negar, não minimizar, não atacar quem reclamou. Reconhecer, contar o que foi feito, e oferecer o contraponto verificável. Empresa sem nenhuma reclamação é empresa nova ou empresa que apaga — e o cliente sabe disso.',
  f:['Vi essa também, e é verdade. O que aconteceu foi {oQueAconteceu}, e a gente resolveu {comoResolveu}. Depois disso mudamos {oQueMudou} pra não acontecer de novo.',
     'Prefiro te falar antes de você perguntar: a gente já errou, sim. O que eu posso te garantir é que ninguém fica sem resposta. Te mando cinco depoimentos recentes pra você ver os dois lados.']},

 {t:'"Meu cartão não tem limite"',
  q:'Barreira financeira concreta.',
  p:'É objeção real, não desculpa — e é onde a nossa caução zero brilha, porque o limite é justamente o problema. Oferecer as saídas antes de o cliente ter que pedir.',
  f:['Isso a gente resolve de três jeitos: PIX à vista com desconto, parcelamento em até 12x, ou entrada agora e o resto mais perto da viagem.',
     'E uma coisa importante pro seu caso: como a gente não bloqueia caução, seu limite fica livre pra usar nos parques e nas compras. Nas locadoras grandes ficariam presos de 500 a 1.500 dólares.']},

 {t:'"Prefiro alugar direto lá quando chegar"',
  q:'Cliente quer decidir no balcão.',
  p:'Não desmontar a ideia — mostrar os dois custos que ele não está vendo: preço de balcão em alta temporada e o risco de não haver minivan. Sem alarmismo; com fato.',
  f:['Dá pra fazer sim. Só duas coisas pra você considerar: no balcão o preço costuma ser bem mais alto que o reservado, e minivan em {mês} some rápido — é o carro que menos tem e o mais procurado por família brasileira.',
     'Se você quiser, eu reservo sem compromisso e você decide até {prazo}. Se resolver alugar lá, é só me avisar — sem custo nenhum.']},

 {t:'"Vocês são muito novos no mercado"',
  q:'Objeção de tempo de casa.',
  p:'Não inventar história de empresa. Trocar a régua: tempo de mercado é um jeito de estimar confiabilidade, e existem outros mais diretos — número de famílias atendidas, contrato antes do pagamento, dono acessível.',
  f:['É verdade, a gente não tem 30 anos de estrada. O que a gente tem é {n} famílias brasileiras atendidas em Orlando e o meu telefone direto — que numa empresa de 30 anos você não teria.',
     'Tempo de mercado é um jeito de medir confiança. Outro é: você recebe o contrato antes de pagar qualquer coisa, e fala comigo do começo ao fim. Qual dos dois te dá mais segurança?']},

 {t:'"Meu amigo consegue mais barato lá"',
  q:'Comparação com preço de morador local.',
  p:'É comparação real e não dá para vencer no número — quem mora lá tem carteira americana, cartão americano e endereço local. Mostrar isso sem desqualificar, e trazer de volta para o que ele de fato terá.',
  f:['Provavelmente consegue mesmo — quem mora lá aluga com carteira e cartão americanos, e as condições são outras. Pra turista brasileiro a régua é diferente, principalmente na caução e no seguro.',
     'Se o seu amigo puder alugar no nome dele e assumir a responsabilidade do carro, pode valer a pena. Só vale conferir com ele quem responde se acontecer alguma coisa, porque costuma ser quem assinou.']},

 {t:'"Estou só pesquisando"',
  q:'Sem intenção declarada.',
  p:'Não pressionar quem declarou que não está comprando — isso ativa a reatância do módulo 8 do curso. Ser útil agora e ficar disponível é o que faz a pessoa voltar.',
  f:['Perfeito, é a hora certa de pesquisar mesmo 🙂 Se quiser, te mando um resumo de quanto costuma custar carro em {mês} pra você ter parâmetro — sem compromisso nenhum.',
     'Fica à vontade. Deixo só uma dica: minivan em alta temporada some cedo. Quando fechar as datas, me chama que eu vejo o que tem.']}
]},

{g:'Negociação', ico:'⚖️', itens:[
 {t:'Quando dar desconto e quando não',
  q:'Critério, antes do script.',
  p:'Regra da casa: desconto nunca é dado de graça e nunca é dado na primeira objeção. Ele é <b>trocado</b> — por mais diárias, por pagamento à vista, por indicação, por flexibilidade de data. Desconto sem contrapartida ensina que o preço era inventado, e derruba o valor de tudo o que foi dito antes.',
  f:['Consigo melhorar, mas deixa eu te propor uma troca: esticando pra {dias+2} dias eu faço a diária por {valorMenor}.',
     'À vista no PIX eu consigo tirar {valor} do total. Fechado assim?',
     'Se você me indicar pra alguém que fechar, eu devolvo {valor} pra você. Vale mais que desconto e não mexe no que está incluso.']},

 {t:'Cliente pede desconto pela terceira vez',
  q:'Insistência depois de duas concessões.',
  p:'Aqui se para. Continuar cedendo transforma a negociação em leilão e o cliente passa a duvidar de tudo. Fechar a porta com firmeza e sem agressividade costuma <b>fechar a venda</b> — porque comunica que o valor era real.',
  f:['{nome}, cheguei no meu limite. Abaixo disso eu teria que tirar alguma coisa que está inclusa, e eu não faço isso — prefiro entregar tudo e ser honesto no valor.',
     'O que eu consigo é {condição}. Se ainda assim não fechar pra vocês, sem problema nenhum — e a porta fica aberta.']},

 {t:'Cliente quer "cobrir a oferta" do concorrente',
  q:'"Se cobrir, fecho agora."',
  p:'Cobrir preço nos coloca no jogo em que somos os piores. E se cobrirmos uma vez, o cliente e todos que ele indicar vão esperar isso sempre. A saída é comparar o que está dentro, não o número.',
  f:['A gente não cobre preço, e vou te explicar por quê: pra chegar naquele valor eu teria que tirar seguro total ou a caução zero, e aí você não estaria comparando a mesma coisa.',
     'Me manda a proposta deles que eu comparo item a item com você. Se depois disso o valor deles fizer mais sentido, vai tranquilo — eu prefiro te falar isso do que te empurrar.']},

 {t:'Negociar prazo em vez de preço',
  q:'Quando não há espaço no valor.',
  p:'Prazo custa pouco e resolve muito. Cliente que trava no total costuma destravar na parcela — e é uma concessão que não mexe no preço nem no que está incluso.',
  f:['O total eu não consigo mexer, mas o prazo sim: dá pra fazer entrada de {entrada} agora e o resto em {n}x até a viagem.',
     'Se ajudar, você trava o valor de hoje com uma entrada pequena e paga o resto ao longo dos meses. O câmbio não te pega.']}
]},

{g:'Durante a viagem', ico:'🛣️', itens:[
 {t:'Cliente perdido no aeroporto',
  q:'Não achou o balcão ou o carro.',
  p:'Instrução curta, uma por mensagem. Pessoa perdida com bagagem e criança não lê parágrafo. Se possível, foto ou ligação.',
  f:['Fica tranquilo, vou te guiar. Você está em qual terminal, A ou B?',
     'Perfeito. Desce pro nível 1 e procura a placa {placa}. Te mando uma foto de como é.',
     'Quer que eu te ligue? Às vezes é mais rápido.']},

 {t:'Multa ou pedágio durante a viagem',
  q:'Cliente recebeu notificação ou está em dúvida.',
  p:'Explicar o funcionamento antes de discutir valor. A maior parte do estresse aqui é não entender o processo — o dinheiro costuma ser o menor problema.',
  f:['Fica tranquilo que eu te explico como funciona: {explicacao}. Não precisa fazer nada agora.',
     'Se vier alguma cobrança, me manda o print que eu confiro e te digo exatamente o que é. Nada é cobrado sem eu te mostrar.']},

 {t:'Cliente quer estender a viagem',
  q:'Ligou pedindo mais dias.',
  p:'Melhor tipo de mensagem que existe: receita adicional com custo zero de aquisição. Resolver rápido e com facilidade, e nunca punir com preço de última hora.',
  f:['Que ótimo que a viagem está boa! 😄 Consigo sim. Até que dia vocês querem ficar?',
     'Fechado, estendi até {data}. A diferença fica em {valor} e eu te mando o link agora. Aproveita mais uns dias!']},

 {t:'Acidente ou colisão',
  q:'A situação mais delicada de todas.',
  p:'Ordem obrigatória e sem exceção: pessoas, segurança, procedimento — nessa sequência. Nunca perguntar do carro antes de perguntar das pessoas. Quem inverte a ordem é lembrado por isso para sempre.',
  f:['{nome}, primeiro: está todo mundo bem? Alguém se machucou?',
     'Que bom. Agora: vocês estão em local seguro, fora da pista?',
     'Certo. O seguro é total, você não vai pagar franquia. Eu vou te passar o passo a passo agora e fico com você até resolver.',
     'Não se preocupe com o carro. Se preocupa com vocês, que o resto eu resolvo.']},

 {t:'Cliente reclamando do carro',
  q:'"O carro está sujo / com cheiro / com barulho."',
  p:'Nunca discutir a percepção do cliente. Ele está a 8 mil km de casa e pagou caro — a expectativa é alta e é legítima. Resolver ou compensar, rápido, e sem exigir prova.',
  f:['Isso não deveria ter acontecido, {nome}. Me manda uma foto que eu resolvo agora.',
     'Vou trocar o carro pra vocês. Onde vocês estão? Eu levo até aí ou te falo o ponto mais próximo — o que for melhor.']}
]},

{g:'Perfis específicos', ico:'👥', itens:[
 {t:'Cliente idoso ou pouco familiarizado com tecnologia',
  q:'Dificuldade com links, assinatura digital, PIX.',
  p:'Paciência e passo a passo, sem soar condescendente. Oferecer alternativa (ligação, ajuda de familiar) sem sugerir incapacidade.',
  f:['Sem pressa nenhuma, {nome}. Vou te mandar um passo de cada vez e você me diz quando terminar cada um. Combinado?',
     'Se preferir, eu te ligo e a gente faz junto — leva uns 3 minutos.',
     'Tem alguém da família aí que possa te ajudar com o celular? Eu explico pra vocês dois ao mesmo tempo.']},

 {t:'Agência de viagens ou revendedor',
  q:'Intermediário cotando para cliente dele.',
  p:'Outra conversa: ele não é o usuário, é quem precisa vender internamente. O que ele precisa é de material que se defenda sozinho e de previsibilidade — não de emoção.',
  f:['Perfeito, {nome}. Vou te mandar num formato que você pode repassar direto pro seu cliente, com tudo que está incluso destacado.',
     'Pra parceria a gente tem condição diferenciada e prioridade na frota. Faz sentido a gente conversar sobre volume?']},

 {t:'Cliente indeciso entre duas categorias',
  q:'Travou entre minivan e SUV.',
  p:'Não devolver a escolha — foi ela que travou. Recomendar UMA com o motivo concreto e assumir a decisão. É a aplicação direta da sobrecarga de escolha, módulo 10 do curso.',
  f:['Vou decidir por você: minivan. Com {n} pessoas e malas de {dias} dias, no SUV alguém viaja com mochila no colo a viagem inteira. A diferença de preço some no terceiro dia de desconforto.',
     'Se fosse pra minha família, eu iria de minivan sem pensar. O SUV é ótimo pra 4 pessoas — vocês são {n}.']},

 {t:'Cliente que já foi cliente e quer o mesmo de antes',
  q:'"Quero igual da última vez."',
  p:'Confirmar rápido o que dá para repetir e o que mudou. Cliente recorrente espera ser reconhecido, e o reconhecimento é a coisa mais barata de dar.',
  f:['Lembro sim! Da última vez foi {categoria}, retirada em {local}. Quer igual, com as datas novas?',
     'Reservei igual. Uma coisa mudou desde então: {mudanca}. No mais, tudo do mesmo jeito.']},

 {t:'Cliente que pergunta demais e não fecha',
  q:'Muitas mensagens, nenhuma decisão.',
  p:'A partir de certo ponto, mais informação não ajuda — atrapalha (sobrecarga de escolha). O movimento certo é ir ao ponto e oferecer o próximo passo pequeno.',
  f:['{nome}, deixa eu simplificar: pelo que você me falou, é a {categoria} por {valor}. É a melhor opção pra vocês, e eu tenho segurança nisso.',
     'Quer que eu reserve e você decide com calma até {prazo}? Assim você não perde o carro enquanto pensa.']}
]},

{g:'Reativação e relacionamento', ico:'💌', itens:[
 {t:'Aniversário do cliente',
  q:'Data conhecida pelo cadastro.',
  p:'Mensagem sem venda nenhuma. Se tiver oferta junto, deixa de ser gesto e vira propaganda — e o cliente percebe.',
  f:['{nome}, feliz aniversário! 🎉 Que o ano traga muita viagem boa. Um abraço do time Magiway!']},

 {t:'Aniversário da viagem',
  q:'Um ano depois da locação.',
  p:'Gatilho de memória com custo zero. A lembrança da viagem é positiva, e associá-la à Magiway reativa o vínculo antes de qualquer oferta.',
  f:['{nome}, faz um ano hoje que vocês estavam em Orlando! 😄 Lembro que vocês pegaram a {categoria}. Como foi o ano de vocês?']},

 {t:'Início de alta temporada',
  q:'Antecipação de julho ou dezembro.',
  p:'Motivo real para reabrir conversa, com informação útil e não com "temos uma promoção".',
  f:['Oi {nome}! Começou a corrida por carro pra {período} — minivan é a primeira a sumir. Se estiver nos planos, me chama que eu seguro uma pra vocês.']},

 {t:'Cliente que indicou alguém',
  q:'Indicação que virou venda.',
  p:'Agradecer nomeadamente e fechar o ciclo. É o comportamento que mais gera novas indicações, e quase ninguém faz.',
  f:['{nome}, o {indicado} fechou com a gente e falou que veio por sua causa 🙏 Muito obrigado mesmo. Vou cuidar dele igual cuidei de vocês.']},

 {t:'Pedido de avaliação pública',
  q:'Depois de uma viagem que deu certo.',
  p:'Pedir com o motivo. Pedido genérico ("avalie a gente") converte pouco; pedido com propósito ("ajuda quem está com receio") converte muito mais — e é verdade.',
  f:['{nome}, posso te pedir um favor? Se puder deixar uma palavrinha sobre a experiência, ajuda demais quem está com receio de alugar com empresa pequena. Levo 1 minuto do seu tempo 🙏']}
]},

{g:'Erros que custam venda', ico:'⛔', itens:[
 {t:'O que nunca dizer — lista de referência',
  q:'Consulta rápida.',
  p:'Cada frase abaixo derruba um dos mecanismos estudados no curso. Não são preferências de estilo: são erros com efeito conhecido.',
  f:['❌ "Segue o orçamento conforme solicitado."\n✅ "Oi {nome}! Aqui é o {vendedor}, sou eu que vou cuidar do carro de vocês."\n(competência sem calor — módulo 2)',
     '❌ "É mais caro, mas tem seguro incluso."\n✅ "Já vai com seguro total sem franquia. O total dos {dias} dias fica em {valor}."\n(o "mas" apaga o que veio antes — módulo 11)',
     '❌ "Vamos fechar?"\n✅ "Prefere retirar de manhã ou à tarde?"\n(sim ou não convida o não — módulo 8)',
     '❌ "Últimas unidades!" quando não é verdade.\n✅ "Nessa semana costuma faltar minivan porque é feriado no Brasil."\n(escassez falsa destrói confiança — módulo 9)',
     '❌ "Qual seu orçamento?" na primeira mensagem.\n✅ "Vocês vão em quantos e por quantos dias?"\n(ancora tudo no preço — módulo 3)',
     '❌ "Achei que você tinha desistido."\n✅ "Que bom te ver por aqui! Vamos retomar?"\n(constrangimento derruba conversa que acabou de voltar)']},

 {t:'Sinais de que você pulou um passo',
  q:'Autodiagnóstico durante o atendimento.',
  p:'Quando o atendimento trava, quase sempre é porque um passo do método foi pulado. Estes são os sinais.',
  f:['Cliente só pergunta preço → você pulou o passo 2 (escutar). Volte com uma pergunta sobre a viagem.',
     'Cliente sumiu depois da proposta → provavelmente faltou o passo 5 (conectar). A proposta foi correta e genérica.',
     'Cliente pede desconto logo de cara → o valor não foi ancorado (passo 4). Refaça a lista de inclusos.',
     'Cliente diz "vou pensar" sem dúvida nenhuma → você não extraiu a preocupação. Pergunte: "é o valor, a data ou o carro?"',
     'Você falou mais de 60% da conversa → passo 2 não aconteceu.']}
]}
];
var MGW_MANUAL_C=[

/* ───────────────  PERGUNTAS TÉCNICAS  ─────────────── */
{g:'Perguntas técnicas — seguro e caução', ico:'🛡️', itens:[
 {t:'"O seguro cobre o quê, exatamente?"',
  q:'A pergunta mais comum depois do preço — e a que mais se responde mal.',
  p:'Aqui a tentação é responder "cobre tudo", porque é a resposta que fecha mais rápido. É também a que gera a pior reclamação possível: a que acontece com o cliente do outro lado do mundo, com um problema, descobrindo que "tudo" não era tudo. Responda pelo que ESTÁ coberto, em lista curta, e diga em voz alta o que não está. Cliente que ouve o limite antes de viajar confia mais, não menos — o limite é a prova de que o resto é verdade.',
  f:['Te explico direitinho 👇\n\n✅ {coberturas}\n\n❌ O que não entra: {exclusoes}\n\nEssas duas listas são as de verdade, não as de propaganda. Prefiro que você saiba agora do que descobrir lá.',
     'Cobre {coberturas}. Não cobre {exclusoes} — e eu falo isso de propósito, porque é o tipo de coisa que estraga viagem quando aparece de surpresa.',
     'Vou te mandar por escrito o que entra e o que não entra, pra você ter guardado. Qualquer dúvida depois, é só olhar essa mensagem.']},

 {t:'"Vocês pedem caução no cartão?"',
  q:'Medo clássico de quem já alugou nos EUA e teve valor bloqueado.',
  p:'Caução zero é uma das nossas vantagens reais e é subaproveitada. Quem já alugou lá sabe a dor do bloqueio de US$ 500 no cartão em plena viagem. Diga o número que NÃO é bloqueado — a ausência precisa ser dimensionada para ser sentida.',
  f:['Zero. Nada é bloqueado no seu cartão 🙌\n\nNas locadoras de balcão costuma ficar preso entre {faixaCaucao} durante a viagem inteira. Com a gente esse dinheiro continua disponível pra vocês gastarem no que interessa.',
     'Não pedimos caução. É justamente a coisa que mais irrita quem aluga por lá — o limite do cartão preso enquanto você está viajando.',
     'Nenhum valor bloqueado. Você paga o combinado e pronto; seu limite fica inteiro pra viagem.']},

 {t:'"Qual é a franquia se eu bater?"',
  q:'Cliente que lê contrato — normalmente o que mais fecha.',
  p:'Quem pergunta franquia é bom sinal: está se projetando usando o carro, o que em decisão é meio caminho. Nunca improvise o valor. Se você não tem o número na mão, diga que vai confirmar e confirme — "acho que é" é a frase que vira reclamação.',
  f:['Boa pergunta, e vou te dar o número exato em vez de aproximar: {franquia}. Te mando o trecho do contrato onde isso está escrito.',
     'Deixa eu confirmar o valor certo pra não te passar informação torta — te respondo em alguns minutos com a fonte.',
     'A franquia é {franquia}. E olha, na prática o que mais acontece não é batida — é arranhão de estacionamento. Isso está {tratamentoArranhao}.']},

 {t:'"E se acontecer alguma coisa, eu falo com quem?"',
  q:'A pergunta por trás de quase toda objeção de confiança.',
  p:'Ele não está pedindo um número de telefone; está perguntando se vai ficar sozinho. A resposta que funciona é uma PESSOA com nome, não um canal. Suporte em português é o nosso ativo mais forte e o mais fácil de descrever mal — "temos suporte 24h" é slogan; "é comigo, neste número, e eu atendo" é promessa.',
  f:['Comigo. Este mesmo número, {vendedor}. Não é central, não é robô, não é fila — é a pessoa que está falando com você agora.',
     'Você fala comigo, em português, e eu resolvo com a locadora. Você não vai precisar discutir em inglês com ninguém — é literalmente pra isso que a gente existe.',
     'Salva este contato. Qualquer coisa em Orlando, de pneu furado a dúvida boba de GPS, chama aqui.']},

 {t:'"Preciso de seguro viagem à parte?"',
  q:'Confusão comum entre seguro do carro e seguro de saúde.',
  p:'São duas coisas diferentes e o cliente costuma achar que uma cobre a outra. Esclarecer isso não vende carro nenhum — e é exatamente por isso que constrói confiança: você está informando contra o seu próprio interesse imediato. Reciprocidade sem cobrança é o mecanismo, e ele funciona porque é genuíno.',
  f:['São coisas diferentes: o nosso seguro é do carro. Seguro de saúde/viagem é outro, e vale muito a pena nos EUA — mas não é comigo que você contrata, e eu não ganho nada te falando isso.',
     'O do carro está incluso. O de saúde é separado e eu recomendo fortemente, porque atendimento lá é caríssimo. Não vendo esse, só estou avisando.']}
]},

/* ───────────────  ESTRADA, DOCUMENTOS E REGRAS  ─────────────── */
{g:'Perguntas técnicas — dirigir nos EUA', ico:'🛣️', itens:[
 {t:'"Preciso de habilitação internacional?"',
  q:'Dúvida quase universal de primeira viagem.',
  p:'Regra prática: responda o que a Magiway exige e o que a locadora exige, que são as duas que importam para a viagem dele. Se houver divergência entre o que se ouve por aí e o que vale na prática, diga qual é qual. A pessoa não quer opinião, quer saber o que colocar na mala.',
  f:['Pra alugar com a gente você precisa de {documentos}. A PID (permissão internacional) {statusPID} — te explico em uma frase por quê: {motivoPID}.',
     'Leva {documentos}. É o que a locadora pede no balcão, e é o que já vi funcionando em centenas de retiradas.',
     'Te mando a listinha do que separar antes de viajar, pra você conferir com calma.']},

 {t:'"Qual a idade mínima pra dirigir?"',
  q:'Grupos jovens, ou filho que vai dirigir junto.',
  p:'Idade abaixo de 25 costuma ter cobrança extra nas locadoras americanas. Se for o caso aqui, diga o valor ANTES da proposta — taxa que aparece depois do "sim" é o começo de uma reclamação, mesmo quando ela sempre esteve no contrato.',
  f:['A idade mínima é {idadeMin}. De {faixaJovem} tem uma taxa de {taxaJovem} por dia — já te digo agora pra não aparecer surpresa lá na frente.',
     'Pode dirigir a partir de {idadeMin}. Se alguém do grupo estiver abaixo de 25, me avisa que eu já calculo certo na proposta.']},

 {t:'"Posso colocar mais de um motorista?"',
  q:'Casais e grupos que vão revezar em viagem longa.',
  p:'Motorista adicional é um dos itens em que a nossa condição costuma ser melhor que a do balcão, e quase nunca é oferecido de forma ativa. Ofereça antes de ele pedir: em viagem de 10 dias, revezar não é luxo, é segurança.',
  f:['Pode sim. Motorista adicional {condicaoAdicional}. Em viagem de {dias} dias eu recomendo colocar os dois mesmo — cansaço na I-4 é real.',
     'Consigo incluir o segundo motorista. Quem mais vai dirigir? Já deixo no contrato pra não ter problema se precisarem trocar no meio do caminho.']},

 {t:'"Como funciona o pedágio? E o SunPass?"',
  q:'A dúvida mais específica de Orlando — e a que mais gera cobrança surpresa.',
  p:'Boa parte das estradas da região é cash-free. Cliente que não entende isso passa direto e recebe a cobrança semanas depois, já no Brasil, com taxa administrativa. Explicar isso antes evita a única reclamação pós-viagem que é 100% previsível.',
  f:['Em Orlando quase todo pedágio é eletrônico, sem cabine pra pagar em dinheiro. No seu carro {situacaoPedagio}.\n\nO que você precisa saber: {comoFunciona}. Assim não chega cobrança de surpresa depois.',
     'Te explico o pedágio porque é onde todo mundo se enrola: {comoFunciona}. Guarda essa mensagem.']},

 {t:'"Como devolvo o carro? Cheio de gasolina?"',
  q:'Última dúvida operacional, geralmente na véspera.',
  p:'Combustível é onde o cliente perde dinheiro por desinformação — devolver com tanque pela metade sob política de "cheio-cheio" custa caro. Uma mensagem de véspera com isso evita a irritação de última hora, que é justamente o momento que a memória guarda (o "fim" da regra pico-fim).',
  f:['Na devolução: {politicaCombustivel}. Tem posto a {distanciaPosto} do aeroporto — se quiser eu te mando o mapa no dia.',
     'Devolve {politicaCombustivel}. Sai bem mais barato abastecer no posto do que deixar pra locadora completar.']},

 {t:'"Posso sair da Flórida com o carro?"',
  q:'Roteiros que incluem Miami, Georgia ou cruzeiro.',
  p:'Quase sempre pode, mas a pergunta por trás é "vou ter problema?". Responda a permissão E o que muda (se muda), porque ele vai planejar em cima disso.',
  f:['Pode sim. {regraEstados}. Me conta o roteiro que eu já vejo se tem alguma coisa a ajustar.',
     'Sem problema. Só me avisa o destino porque {motivoAviso} — nada complicado, é só pra deixar tudo certo no contrato.']}
]},

/* ───────────────  DATAS E TEMPORADA  ─────────────── */
{g:'Datas, temporada e mudança de plano', ico:'📅', itens:[
 {t:'Cliente ainda não comprou a passagem',
  q:'"Ainda estou vendo as datas."',
  p:'Sem passagem, a viagem ainda não existe na cabeça dele — e proposta fechada agora vira cotação morta. O movimento certo não é forçar o fechamento; é ficar do lado dele na decisão que ele está tomando de verdade, que é a aérea. Quem ajuda antes de vender é quem recebe a mensagem quando a passagem sai.',
  f:['Sem problema! Me avisa quando as datas fecharem que eu monto na hora.\n\nSó uma dica que vale dinheiro: {dicaData}. Se der pra encaixar aí, vocês economizam bastante.',
     'Então segura a proposta comigo. Assim que comprar a passagem, me manda print que eu já deixo o carro reservado nas datas certas.']},

 {t:'Viagem em alta temporada',
  q:'Dezembro, julho, spring break, feriadão.',
  p:'Escassez em alta temporada é real, e por isso pode ser dita — o limite ético é não inventá-la. Diga o fato (frota e preço mudam) sem transformar em pressão artificial. Escassez fabricada é a técnica que mais destrói confiança quando descoberta, e nesse nicho o cliente confere.',
  f:['{mes} é a época mais cheia do ano em Orlando. Não é conversa de vendedor: {fatoTemporada}. Se a viagem é certa, fechar agora costuma sair melhor do que fechar depois.',
     'Nessa data a minivan é o primeiro carro a acabar, porque é o que toda família brasileira procura. Não estou te apressando — só te contando como funciona.']},

 {t:'Cliente quer mudar a data depois de fechado',
  q:'Mudança de passagem, imprevisto, remarcação.',
  p:'Este é um dos momentos de maior valor da relação inteira. A pessoa espera atrito — e quando não encontra, o vínculo salta. Resolver bem uma mudança gera mais indicação do que uma viagem que correu lisa, porque só nela ele descobre como você age quando dá trabalho.',
  f:['Sem drama, isso acontece 🙂 Me manda as datas novas que eu vejo o que dá pra fazer e te falo com transparência: {politicaMudanca}.',
     'Vamos ajustar. Me passa a data nova. Se tiver diferença de valor eu te mostro a conta aberta, sem letra miúda.']},

 {t:'Viagem cancelada de vez',
  q:'Desistência, problema pessoal, visto negado.',
  p:'Este é o atendimento que parece perdido e não é. A pessoa que cancela hoje viaja em algum momento, e conta para o grupo dela como foi tratada na hora ruim. Cobrar bem e despedir mal é a troca mais cara que existe neste negócio.',
  f:['Poxa, sinto muito de verdade 😔 Vamos resolver a parte burocrática rápido pra você cuidar do resto: {politicaCancelamento}.',
     'Entendo perfeitamente. Deixa comigo a parte do carro. E quando remarcarem, é só me chamar — guardo seu histórico aqui.']},

 {t:'Cliente pergunta a melhor época para ir',
  q:'Viagem sem data definida.',
  p:'Responder isso bem custa dois minutos e planta autoridade real — é conselho de quem conhece o destino, não de quem vende carro. Autoridade que se demonstra vale muito mais que a que se declara.',
  f:['Vou te dar minha opinião sincera de quem vê isso o ano inteiro: {melhorEpoca}. E a pior, se puder evitar: {piorEpoca}.',
     'Depende do que vocês priorizam — parque vazio ou clima bom. Me diz o que pesa mais e eu te falo o mês certo.']}
]},

/* ───────────────  PAGAMENTO  ─────────────── */
{g:'Pagamento e burocracia', ico:'💳', itens:[
 {t:'Mandou o link e o cliente sumiu',
  q:'Silêncio depois do link de pagamento — o pior tipo.',
  p:'Sumiço depois do link raramente é desistência: é dúvida que apareceu na hora de digitar o cartão, e vergonha de perguntar de novo. Reabrir a porta sem cobrar é o que traz de volta. Cobrança acelera a fuga; pergunta genuína, não.',
  f:['{nome}, vi que o link ficou pendente. Não é cobrança 🙂 Só quero saber se apareceu alguma dúvida na hora — muita gente trava numa coisinha boba e não pergunta.',
     'Passou alguma dificuldade no pagamento? Se quiser, eu mudo a forma. Tem {alternativas} também.']},

 {t:'Cartão recusado',
  q:'Compra internacional bloqueada pelo banco.',
  p:'Quase sempre é o banco brasileiro barrando compra internacional, não falta de limite — e o cliente costuma se sentir constrangido, o que faz ele sumir em vez de avisar. Tirar a culpa dele resolve a maioria dos casos em uma mensagem.',
  f:['Isso é super comum e quase nunca é limite — o banco costuma barrar compra internacional por segurança. Liga no seu banco e libera; leva uns 2 minutos. Te espero.',
     'Acontece direto! Tenta {alternativa}, ou libera a compra internacional no app do banco e a gente refaz.']},

 {t:'"Dá pra parcelar em quantas vezes?"',
  q:'Pergunta de valor alto, muito comum em família grande.',
  p:'Parcelamento muda a percepção do preço mais do que desconto, porque a comparação mental passa a ser com a parcela e não com o total. Isso é legítimo desde que o total continue visível — esconder o total para "aliviar" a parcela é manipulação, e é o tipo de coisa que o cliente descobre no extrato.',
  f:['Dá pra fazer em {parcelas}. Fica {valorParcela} por mês — e o total continua sendo {valorTotal}, sem juros escondidos.',
     'Consigo {parcelas}. Quer que eu monte assim ou você prefere à vista com {condicaoVista}?']},

 {t:'Cliente pede nota / comprovante para reembolso da empresa',
  q:'Viagem de trabalho, ou reembolso de convênio.',
  p:'Resolver documento rápido é entrega concreta e barata. É também o cliente que mais repete, porque viagem de trabalho volta todo ano.',
  f:['Claro! Te mando {documento} em até {prazo}. Me confirma os dados que precisam sair no documento: {dadosNecessarios}.',
     'Sem problema. Me passa CNPJ e razão social que eu emito certinho pro seu financeiro aceitar de primeira.']},

 {t:'"Posso pagar quando chegar aí?"',
  q:'Tentativa de adiar o compromisso financeiro.',
  p:'Aqui não é para ceder por medo de perder a venda, mas também não é para responder só "não". Explique o porquê da regra — regra com motivo é aceita; regra sem motivo é sentida como desconfiança do cliente, e ele reage a isso.',
  f:['A reserva só fica garantida com o pagamento — é isso que trava o carro no seu nome na data. Sem isso o sistema libera pra outra pessoa, e em {mes} some rápido.',
     'Nesse formato eu não consigo segurar o carro. O que eu posso fazer é {alternativaReal} — assim você não fica sem e eu não te prometo o que não vou conseguir cumprir.']}
]},

/* ───────────────  QUANDO A RESPOSTA É NÃO  ─────────────── */
{g:'Quando a resposta é não', ico:'🚫', itens:[
 {t:'O orçamento dele não chega no nosso preço',
  q:'Diferença grande, sem margem de negociação.',
  p:'Enrolar aqui custa duas coisas: o tempo dele e a sua reputação. Dizer não com clareza é a coisa mais rara que um vendedor faz — e é lembrada. Boa parte das indicações que a gente recebe vem de gente que NÃO fechou, e foi bem tratada na recusa.',
  f:['Vou ser honesto com você em vez de ficar empurrando: nesse orçamento a gente não chega. Prefiro te falar agora do que te fazer perder tempo.\n\nSe em algum momento o plano mudar, me chama — fica meu contato.',
     'Não vou conseguir chegar nesse valor, e não adianta eu inventar. O que eu posso fazer é {alternativaHonesta}. Se não servir, tudo bem mesmo.']},

 {t:'O que ele quer, a gente não faz',
  q:'Pedido fora do nosso escopo ou da nossa frota.',
  p:'Encaminhar bem quem você não pode atender é investimento em marca, não perda. A pessoa lembra de quem resolveu, mesmo que quem resolveu não tenha sido você.',
  f:['Isso especificamente a gente não faz. Não vou te vender uma solução torta só pra fechar.\n\nO que eu te sugiro é {encaminhamento}. Se depois precisar de carro em Orlando, você sabe onde me achar 🙂',
     'Não é o nosso forte e eu prefiro dizer. Pra esse caso, {encaminhamento} atende melhor que a gente.']},

 {t:'Ele está pedindo algo que não vai dar certo',
  q:'Carro pequeno demais para o grupo, prazo impossível, roteiro inviável.',
  p:'Aceitar um pedido que você sabe que vai dar errado é adiar o problema para o meio da viagem, quando ele custa dez vezes mais — em suporte, em reclamação e em avaliação pública. Discordar aqui é serviço, não atrito.',
  f:['Vou te dar uma opinião contrária ao meu próprio bolso: {n} pessoas com mala nesse carro não cabe. Vai dar certo no papel e errado no primeiro dia.\n\nCom {alternativa} vocês viajam inteiros. É mais caro, e eu prefiro te falar isso agora do que você me falar de lá.',
     'Dá pra fazer do jeito que você pediu, mas eu não recomendo, e vou te dizer por quê: {motivo}. A decisão é sua — só não quero que você descubra isso na estrada.']},

 {t:'Cliente insiste depois de um não bem dado',
  q:'Terceira tentativa em cima do mesmo ponto.',
  p:'Repetir o não com as mesmas palavras é o que preserva a credibilidade — mudar de posição na terceira insistência ensina que basta insistir, e transforma todas as próximas conversas em negociação. Firmeza sem aspereza.',
  f:['Entendo o seu lado, de verdade. Mas a minha resposta continua a mesma, e eu prefiro ser coerente com você a ceder agora e voltar atrás depois.',
     'Continua sendo não nesse ponto — e continua valendo tudo que eu ofereci de bom coração. A porta fica aberta.']}
]},

/* ───────────────  QUANDO O ERRO FOI NOSSO  ─────────────── */
{g:'Quando o erro foi nosso', ico:'🙇', itens:[
 {t:'Você passou uma informação errada',
  q:'Valor, data, categoria ou regra dita errado.',
  p:'A recuperação bem feita produz mais confiança do que o serviço que nunca falhou — é o paradoxo da recuperação de serviço, e ele só funciona com três coisas na ordem certa: assumir sem rodeio, corrigir rápido, e não repetir. Justificativa antes da correção destrói o efeito.',
  f:['{nome}, eu errei aqui e vou corrigir: {oQueErrei}. O certo é {oCerto}.\n\nA responsabilidade é minha, e o que eu vou fazer pra compensar é {reparacao}.',
     'Erro meu, sem desculpa. Já estou resolvendo e te dou retorno em {prazo}.']},

 {t:'Atrasamos ou falhamos na entrega',
  q:'Cliente esperando no aeroporto, coisa não saiu como combinado.',
  p:'Nesse momento a pessoa não quer explicação, quer previsão. Dê o horário real, mesmo que ruim, e cumpra. Prazo otimista que fura transforma um problema logístico em problema de confiança.',
  f:['{nome}, houve um atraso e a culpa é nossa. Você vai ser atendido em {tempoReal} — esse é o prazo real, não o otimista.\n\nEstou acompanhando pessoalmente até você estar com o carro na mão.',
     'Sei que você está cansado da viagem e isso não devia estar acontecendo. Já estou em cima. Te atualizo a cada {intervalo}, mesmo que não tenha novidade.']},

 {t:'O cliente reclamou publicamente',
  q:'Avaliação ruim, comentário em rede social.',
  p:'A resposta pública não é para o reclamante — é para as dezenas de pessoas que vão ler depois. Responder com defensiva confirma o problema; responder com responsabilidade e um caminho concreto costuma convencer mais que dez avaliações boas. E leve a conversa para o privado só depois de assumir em público.',
  f:['{nome}, obrigado por escrever, e desculpa mesmo pelo que aconteceu. {reconhecimento}.\n\nJá estou resolvendo: {acao}. Vou te chamar no privado pra acertar, mas queria assumir aqui também.',
     'Você tem razão em reclamar. Foi falha nossa em {ponto}. O que estamos fazendo pra não repetir é {mudanca}.']},

 {t:'Você não sabe a resposta',
  q:'Pergunta técnica fora do seu domínio.',
  p:'Inventar aqui é o erro mais caro do manual, porque a mentira só aparece quando o cliente já está viajando. "Não sei, vou confirmar" não derruba autoridade — derruba quem responde errado e é descoberto.',
  f:['Não vou chutar isso com você. Vou confirmar na fonte certa e te respondo em {prazo}.',
     'Essa eu não sei de cabeça, e prefiro te dar o número certo a te dar um número rápido. Já volto.']}
]}
];
var MGW_MANUAL_D=[

{g:'Construir vínculo desde a primeira linha', ico:'🔗', itens:[
 {t:'Fazer o cliente falar de si — e por que isso ajuda',
  q:'Nos primeiros minutos, antes de qualquer proposta.',
  p:'Falar sobre si mesmo ativa circuitos de recompensa: as pessoas <b>gostam</b> de contar da própria viagem, e saem da conversa gostando mais de quem perguntou, sem ter recebido nada material. É o mecanismo do módulo 5 do curso. A pergunta certa não é sobre o carro — é sobre a viagem, que é o assunto de que ele quer falar.<br><br>Isto não é técnica de simpatia: é como você descobre a preocupação que vai responder no passo 5. Sem essa fala, a proposta sai genérica.',
  f:['Me conta um pouco da viagem de vocês — é a primeira vez em Orlando?',
     'Quantos dias vocês ficam? E é mais parque ou vocês querem circular também?',
     'Vão com criança? Que idade? Pergunto porque muda bastante o que eu vou recomendar.',
     'O que vocês mais estão esperando dessa viagem? Sempre tem uma coisa que é O motivo.']},

 {t:'Espelhar — devolver as palavras exatas dele',
  q:'Logo depois de ele explicar a viagem.',
  p:'Espelhar é repetir literalmente o que o outro disse; isso aumenta cooperação — é o mimetismo verbal do módulo 3. O efeito vem da palavra <b>literal</b>, inclusive quando ela é torta. Resumir bonito ("vocês buscam conforto e tranquilidade") soa treinado e perde o efeito, porque devolve a sua interpretação e não a fala dele.<br><br>O sinal de que pegou é a confirmação enfática: "isso!", "exatamente". Confirmação morna significa que você espelhou errado.',
  f:['Deixa eu ver se entendi: são {n} de vocês, {dias} dias, e o que mais te preocupa é {palavraDele}. É isso?',
     'Então o ponto é {palavraDele}. Anotei. Vou tratar disso especificamente na proposta.',
     'Você falou "{palavraDele}" — é exatamente por isso que eu vou te sugerir {opcao} e não a outra.']},

 {t:'Entregar antes de pedir',
  q:'Em qualquer momento, e de preferência cedo.',
  p:'Reciprocidade é o módulo 21: um favor não solicitado aumenta a disposição de retribuir, e o efeito <b>não depende de o outro gostar de você</b>. Mas ele tem uma condição que quase todo mundo estraga: a entrega e o pedido não podem vir na mesma mensagem. Colados, o favor vira preço e o efeito desaparece.<br><br>Entregue e cale. O pedido vem depois, separado.',
  f:['Independente de você fechar com a gente, guarda essa dica: {dicaUtil}. Vale pra sua viagem de qualquer jeito.',
     'Vou te mandar o passo a passo da retirada. É informação útil mesmo que você alugue em outro lugar.',
     'Te mandei um mapa dos postos perto do aeroporto. Não precisa responder nada, é só pra você ter.']},

 {t:'O pequeno sim antes do grande',
  q:'Ao longo da conversa, preparando o fechamento.',
  p:'Coerência é o módulo 22: quem aceita um pedido pequeno tende a aceitar um maior depois, para se manter coerente com a imagem que já formou de si. Aqui isso não é truque — é a escada natural de uma conversa: confirmar dados, aprovar uma recomendação, escolher entre duas opções.<br><br>Cada pequeno acordo é um degrau. Pular direto para "vamos fechar?" é pedir o topo sem escada.',
  f:['Faz sentido eu montar na minivan de 7, então? (espera o sim antes de mandar a proposta)',
     'Confirma pra mim: retirada dia {x}, devolução dia {y}, tudo em Orlando?',
     'Se eu conseguir {condicao}, a gente fecha nisso?']},

 {t:'Terminar bem, sempre',
  q:'No fim de qualquer conversa — inclusive as que não fecharam.',
  p:'A memória de uma experiência é dominada pelo pico e pelo fim (módulo 7), não pela média. O último minuto pesa desproporcionalmente no que a pessoa vai lembrar e contar. Isso vale igual para quem fechou e para quem não fechou — e quem não fechou é justamente quem tem mais chance de falar de você para outros, porque a conversa dele com o grupo é sobre a escolha.',
  f:['Foi ótimo falar com você, de verdade. Qualquer coisa, mesmo que seja dúvida de viagem, me chama.',
     'Mesmo que não role agora, boa viagem pra vocês! Se precisar de alguma dica de Orlando, é só chamar.',
     'Vou deixar meu contato salvo aqui. Se mudar alguma coisa, ou se só quiser tirar dúvida, tô por aqui.']}
]},

{g:'Quando a fala precisa mudar de mecanismo', ico:'🎚️', itens:[
 {t:'Ele está com medo, não com dúvida',
  q:'A pergunta se repete mesmo depois de bem respondida.',
  p:'Medo e avaliação de risco são coisas diferentes e divergem (módulo 25). Quando alguém pergunta a mesma coisa três vezes com outras palavras, não é falta de informação — informação já foi dada. É medo, e medo não sai com estatística.<br><br>O que funciona: reconhecer o sentimento sem corrigir, e depois reduzir a exposição concreta em vez de argumentar sobre probabilidade.',
  f:['Percebi que essa parte te preocupa de verdade, e faz sentido. Não vou te encher de número. Vou te falar o que a gente faz na prática se isso acontecer: {oQueFazemos}.',
     'Esse receio é o mais comum que eu escuto, e não é bobagem. O que costuma resolver não é a explicação — é saber que tem alguém do lado. Esse alguém sou eu, neste número.',
     'Se quiser, a gente conversa por áudio. Às vezes ouvir a voz resolve o que dez mensagens não resolvem.']},

 {t:'Ele quer autonomia, não recomendação',
  q:'Reage mal a sugestão, quer decidir sozinho.',
  p:'Reatância é o módulo 8: quando a pessoa sente a liberdade de escolha ameaçada, ela reage <b>defendendo a liberdade</b>, mesmo contra o próprio interesse. Empurrar produz o oposto de empurrar. O antídoto é devolver o controle explicitamente — e a devolução tem de ser verdadeira, não retórica.',
  f:['Vou te dar as duas opções com os prós e contras de cada uma, e você decide. As duas funcionam.',
     'A escolha é totalmente sua — eu só não queria que você decidisse sem saber de {fato}.',
     'Não vou insistir. Deixo as informações aqui e você me chama quando quiser.']},

 {t:'Ele está comparando e você não é o mais barato',
  q:'Citou concorrente, ou pediu para "cobrir a oferta".',
  p:'Aqui o mecanismo é justiça percebida (módulo 26): o problema raramente é o valor, é a sensação de estar pagando mais pela mesma coisa. A comparação item a item resolve a justiça distributiva; a regra de preço explicada resolve a procedimental. Baixar o preço não resolve nenhuma das duas — e ainda cria injustiça para os outros clientes.',
  f:['Vamos comparar item a item, porque geralmente não é o mesmo pacote: o deles inclui {itens}? A caução é zero? O suporte é em português?',
     'Nosso preço segue uma regra que vale pra todo mundo: {regra}. Não é caso a caso — se fosse, quem insiste mais pagaria menos.',
     'Somos mais caros mesmo. A diferença não é margem, é o que vem junto: {inclusos}. Se você tirar tudo isso, o número fica parecido.']},

 {t:'Ele travou diante de muitas opções',
  q:'Ficou em cima do muro depois de você apresentar alternativas.',
  p:'Excesso de opção trava decisão (módulo 10, carga cognitiva). Quando alguém pede recomendação e recebe um cardápio, a carga aumenta e a escolha é adiada — o adiamento é a saída de menor esforço. A correção é reduzir a duas, no máximo, e dizer qual você escolheria.',
  f:['Vou simplificar: entre as duas que sobraram, eu iria de {opcao}. Motivo prático: {motivo}.',
     'Esquece o resto. São duas: {a} ou {b}. A diferença entre elas é só {diferenca}.',
     'Se fosse minha família, eu levaria a {opcao}. Te falo isso como opinião, não como venda.']},

 {t:'Ele sumiu e você vai reabrir',
  q:'Follow-up depois de silêncio.',
  p:'Silêncio raramente é "não" — costuma ser dúvida não dita ou assunto empurrado para depois. Cobrar aumenta o custo de responder e afasta mais. O que reabre é uma mensagem que <b>reduz</b> esse custo: sem culpa, sem pergunta difícil, e com uma porta fácil de atravessar.',
  f:['{nome}, sem cobrança nenhuma 🙂 Só queria saber se ficou alguma dúvida travando — às vezes é uma coisinha boba que a pessoa não pergunta.',
     'Passou o momento de vocês ou só corrido? Se for corrido, eu guardo a proposta e te chamo mais pra frente.',
     'Se já resolveram por outro caminho, me fala sem problema — só pra eu não ficar te enchendo. E boa viagem de qualquer jeito!']}
]},

{g:'Erros de vínculo que passam despercebidos', ico:'⚠️', itens:[
 {t:'Elogiar demais',
  q:'Qualquer momento.',
  p:'Elogio em excesso reduz credibilidade em vez de aumentar: passa a ser lido como estratégia, e a atribuição muda de "ele acha isso" para "ele quer alguma coisa". O elogio que funciona é específico, sobre algo real, e dito uma vez.',
  f:['(bom) Vocês planejaram bem essa viagem — com {dias} dias dá pra fazer as coisas com calma.',
     '(ruim, não use) Que família linda! Que escolha excelente! Você tem ótimo gosto!']},

 {t:'Concordar com tudo',
  q:'Ao longo da negociação.',
  p:'Concordância total elimina o valor da sua opinião: se você concorda com tudo, sua aprovação não carrega informação. Discordar em um ponto pequeno, com motivo, aumenta o peso de tudo o mais que você diz — e é exatamente o que faz a recomendação valer.',
  f:['Nesse ponto eu discordo de você, e vou te falar por quê: {motivo}. Na hora vale a pena.',
     'Concordo com quase tudo que você falou. Só num ponto eu iria diferente: {ponto}.']},

 {t:'Usar o nome do cliente demais',
  q:'Mensagens seguidas.',
  p:'Usar o nome cria proximidade; repetir a cada frase produz o efeito oposto, porque soa a técnica de vendas aprendida em curso — e o cliente reconhece. Uma vez na abertura, uma vez em momento importante. É o suficiente.',
  f:['(bom) Oi {nome}! ... [conversa] ... {nome}, montei sua proposta 👇',
     '(ruim, não use) {nome}, entendo {nome}, e olha {nome}, o que eu posso fazer, {nome}...']},

 {t:'Prometer para não perder a venda',
  q:'Sob pressão, no fim da negociação.',
  p:'É o único erro deste manual cujo custo não é a venda — é a empresa. Integridade cai inteira num único ato (módulo 24) e não sobe de volta. E a descoberta acontece no pior momento possível: com o cliente já viajando, longe, dependendo do que você disse.',
  f:['Não vou te prometer isso porque não é verdade. O que eu posso garantir é {realidade}.',
     'Prefiro perder essa venda a te falar uma coisa que não vai acontecer.']},

 {t:'Sumir depois do pagamento',
  q:'Entre o fechamento e a viagem.',
  p:'Pós-venda não é gentileza — é o que decide se existe indicação (módulo 7: pico e fim). O fim da experiência é a devolução, não o pagamento. Silêncio nesse intervalo apaga uma viagem que foi boa e transforma um cliente satisfeito em alguém que não fala de você.',
  f:['{nome}! Faltam 3 dias 🎉 Te mandei o passo a passo da retirada, dá uma olhada com calma.',
     'Chegaram bem? Qualquer coisa na retirada, me chama aqui na hora.',
     'E aí, como foi a viagem? Conta! (e se der tudo certo, você me ajuda muito indicando pra quem for pra Orlando 🙏)']}
]}
];
var MGW_METODO_EXTRA={
 1:{erro:'Fazer a saudação calorosa e emendar o orçamento na mesma mensagem. O calor vira formalidade de abertura — um "oi, tudo bem?" protocolar antes do arquivo em PDF — e o cliente lê exatamente como o que é: educação de quem já ia mandar o preço de qualquer jeito.',
    sinal:'Ele responde com mais de uma linha, ou conta algo que você não perguntou ("vamos levar minha mãe", "é aniversário da minha filha"). Resposta de uma palavra depois da sua abertura significa que você ainda não existe para ele — não avance, insista mais uma vez no humano.',
    treino:'Pegue seus últimos 10 primeiros contatos. Conte em quantos o preço apareceu antes de uma pergunta sobre a viagem. Reescreva os três piores. Não precisa mandar para ninguém — o ganho é perceber o padrão.'},

 2:{erro:'Perguntar as quatro coisas em bloco, numeradas, para "ganhar tempo". Vira formulário, e formulário recebe resposta de formulário: dados corretos, zero preocupação declarada. Você sai com o que precisa para orçar e sem nada com que vender.',
    sinal:'Ele declara uma preocupação sem você ter perguntado diretamente por ela — "minha mulher tem medo de dirigir lá", "a gente tem uma criança pequena". Esse é o material do passo 5. Se ao fim do passo 2 você não tem nenhuma frase dele guardada, o passo não aconteceu.',
    treino:'Nos próximos 5 atendimentos, anote literalmente uma frase do cliente, com as palavras dele. Guarde num bloco de notas. No fim da semana, veja em quantos você conseguiu usar aquela frase depois.'},

 3:{erro:'Espelhar parafraseando bonito. "Entendi, então vocês buscam conforto e tranquilidade" é resumo de vendedor, não a fala dele — e soa treinado. O efeito vem da palavra literal, inclusive quando ela é torta.',
    sinal:'Ele confirma com ênfase: "isso!", "exatamente", "é isso mesmo". Confirmação morna ("é... mais ou menos") quer dizer que você espelhou a sua interpretação, não o que ele disse. Volte e pergunte de novo.',
    treino:'Grave (mentalmente, ou anote) uma frase do cliente por atendimento e devolva-a inteira, sem melhorar. Repare na diferença de reação entre a devolução literal e o resumo elegante.'},

 4:{erro:'Listar os inclusos e o preço na mesma mensagem. Quando o número está visível, ninguém lê a lista — a atenção vai direto ao valor e a lista vira justificativa, que é lida como defesa. A ordem não é detalhe de estilo, é o passo inteiro.',
    sinal:'Ele reage a um incluso antes de ver o preço: "zero caução mesmo?", "seguro total tá dentro?". Aí a régua dele deixou de ser só a tarifa. Se a primeira reação ao seu bloco foi sobre o valor, o preço vazou cedo demais.',
    treino:'Separe suas propostas em duas mensagens por uma semana: uma com o que está incluso, outra com o número. Compare a taxa de resposta com a das semanas anteriores.'},

 5:{erro:'Resolver a preocupação genérica em vez da declarada. O cliente disse "tenho medo de bater lá fora" e a resposta fala de "tranquilidade e segurança". É a mesma distância entre remédio e propaganda de remédio.',
    sinal:'Ele agradece especificamente ("ah, isso me deixa mais tranquilo") ou faz uma segunda pergunta sobre o mesmo assunto — sinal de que a preocupação era real e agora está sendo tratada.',
    treino:'Antes de mandar a proposta, releia a frase que você anotou no passo 2 e pergunte: alguma linha desta proposta responde exatamente a isso? Se não, acrescente uma.'},

 6:{erro:'Confundir conduzir com apressar. Perguntar "e aí, fechamos?" é transferir para o cliente o trabalho de decidir sozinho, e ainda por cima sob pressão — que é a receita da reatância do módulo 8: quanto mais empurra, mais ele adia.',
    sinal:'Ele passa a falar no futuro do indicativo — "quando a gente retirar", "aí eu levo a cadeirinha". Linguagem de quem já se colocou dentro da viagem. Enquanto for condicional ("se eu fechar"), ainda não é hora.',
    treino:'Troque a pergunta de fechamento por uma escolha entre dois caminhos reais durante uma semana. Anote quantas vezes o cliente escolheu em vez de adiar.'},

 7:{erro:'Sumir depois do pagamento e reaparecer só na próxima venda. O cliente lembra do pico e do fim (módulo 7); o fim, aqui, é a devolução — e um fim silencioso apaga uma viagem que foi boa. Pós-venda não é gentileza, é o que decide se existe indicação.',
    sinal:'Ele responde às suas mensagens durante a viagem, manda foto, ou pergunta algo que não é problema. Silêncio total durante a viagem é o cliente que não vai indicar ninguém, mesmo tendo gostado.',
    treino:'Marque três toques fixos por cliente fechado: confirmação, véspera e chegada. Ponha na agenda no dia do fechamento, não depois. O que não é agendado não acontece.'}
};

/* ── a ponte: do tipo da fala para o repertório ────────────────────
   O mapa liga o tipo que o classificador devolve ao assunto do manual e
   ao módulo do curso. Tipo que não estiver aqui simplesmente não traz
   fundamento — melhor silêncio que um princípio que não vem ao caso. */
/* ⚠ Os números de `curso` são a numeração FINAL dos 30 módulos, a que
   `modulos()` produz depois de agrupar por eixo. Não chute: o primeiro
   rascunho desta ponte foi escrito contra uma numeração antiga e
   mandava a objeção de preço para "Os sete passos, montados". O agente
   citava fundamento errado e nada reclamava. `testar-bibliografia.js`
   agora confere que o título do módulo citado combina com o `porque` —
   se você mexer aqui, rode o teste. */
var PONTE={
  caro:        {manual:['Objeção de preço'], curso:[3,11,26],
                porque:'Ancoragem, vender caro e justiça percebida'},
  desconto:    {manual:['Objeção de preço','Negociação'], curso:[28,26],
                porque:'Negociar ampliando, e por que desconto é a pior moeda'},
  concorrente: {manual:['Objeção de preço','Objeções difíceis'], curso:[26,11],
                porque:'Justiça percebida: a diferença entre caro e injusto'},
  medo:        {manual:['Objeção de confiança'], curso:[2,24,25],
                porque:'Habilidade, benevolência e integridade; risco percebido'},
  pensar:      {manual:['"Vou pensar" e adiamentos'], curso:[8,17],
                porque:'Reatância e como a objeção se forma antes de ser dita'},
  falar_com:   {manual:['"Vou pensar" e adiamentos'], curso:[8],
                porque:'Autonomia: empurrar afasta'},
  sumiu:       {manual:['Sumiço e follow-up'], curso:[19,22],
                porque:'Reciprocidade e a rotina que sustenta o método'},
  fechar:      {manual:['Fechamento'], curso:[20,13],
                porque:'Coerência: a escada do pequeno sim, dentro dos sete passos'},
  preco:       {manual:['Apresentar o valor'], curso:[3,4,10],
                porque:'Ancoragem e inclusos antes do número; carga cognitiva'},
  cadeirinha:  {manual:['Perguntas técnicas — seguro e caução','Casos especiais'], curso:[18,10],
                porque:'Risco percebido: cadeirinha é segurança de filho, responde-se simples'},
  seguro:      {manual:['Perguntas técnicas — seguro e caução'], curso:[25],
                porque:'Comunicar risco em número que o cliente entende'},
  pedagio:     {manual:['Perguntas técnicas — dirigir nos EUA'], curso:[4,10],
                porque:'Custo que aparece depois: aversão à perda e carga cognitiva'},
  pagamento:   {manual:['Pagamento e burocracia'], curso:[24,20],
                porque:'Pagamento é o pico do risco percebido: confiança antes do número'},
  problema:    {manual:['Situações difíceis','Quando o erro foi nosso'], curso:[21,7],
                porque:'Recuperação de serviço; a memória é feita do pico e do fim'}
};

function curso(){ return MGW_CURSO_A.concat(MGW_CURSO_B).concat(MGW_CURSO_C).concat(MGW_CURSO_D); }
function manual(){ return MGW_MANUAL.concat(MGW_MANUAL_EXTRA).concat(MGW_MANUAL_C).concat(MGW_MANUAL_D); }

/* O que mostrar ao vendedor para um tipo de fala. Devolve o fundamento,
   as situações do manual e as falas já aprovadas — prontas para copiar,
   sem passar por modelo nenhum. */
function fundamento(tipo){
  var p=PONTE[tipo];
  if(!p) return null;
  var mods=curso().filter(function(m){ return p.curso.indexOf(m.n)>=0; });
  var sits=[];
  manual().forEach(function(g){
    if(p.manual.indexOf(g.g)>=0) sits=sits.concat(g.itens.map(function(it){
      return {grupo:g.g, titulo:it.t, quando:it.q, porque:it.p, falas:it.f};
    }));
  });
  return {
    tipo:tipo,
    porque:p.porque,
    modulos:mods.map(function(m){
      return {n:m.n, titulo:m.t, principio:(m.teoria&&m.teoria[0]?m.teoria[0].h:''),
              limite:m.limite||'', referencias:(m.teoria||[]).map(function(t){return t.ref;}).filter(Boolean)};
    }),
    situacoes:sits
  };
}

/* Falas prontas para um tipo, já peneiradas: é o que o vendedor pode
   copiar sem reescrever. */
function falasPara(tipo){
  var f=fundamento(tipo);
  if(!f) return [];
  var out=[];
  f.situacoes.forEach(function(s){ (s.falas||[]).forEach(function(x){ out.push(x); }); });
  return out;
}

function numeros(){
  var c=curso(), m=manual();
  return {
    modulos:c.length,
    referencias:c.reduce(function(a,x){ return a+((x.teoria||[]).filter(function(t){return t.ref;}).length); },0),
    gruposManual:m.length,
    situacoes:m.reduce(function(a,g){ return a+g.itens.length; },0),
    falas:m.reduce(function(a,g){ return a+g.itens.reduce(function(b,i){ return b+(i.f||[]).length; },0); },0),
    tiposComFundamento:Object.keys(PONTE).length
  };
}

raiz.MGW_BIBLIOGRAFIA={ curso:curso, manual:manual, metodoExtra:MGW_METODO_EXTRA,
  fundamento:fundamento, falasPara:falasPara, numeros:numeros, PONTE:PONTE };
})(typeof module!=='undefined'&&module.exports?module.exports:(typeof window!=='undefined'?window:this));
