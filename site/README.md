# Magiway Florida — site em HTML

Página única, sem build e sem dependência externa. Abra o `index.html` direto no navegador
ou suba a pasta `site/` inteira em qualquer hospedagem estática (Netlify, Vercel, Hostinger, GitHub Pages).

```
site/
├── index.html          ← a página inteira (CSS e JS embutidos)
├── README.md
└── assets/
    ├── (fotos das seções)
    ├── interior/       ← fotos do interior da Pacifica Limited
    └── spin/           ← sequência de ângulos da Pacifica (360°)
```

---

## 1. Configuração — abra o `index.html` e procure `const CONTATO`

Fica no começo do `<script>`, perto do final do arquivo. É o único lugar que precisa ser editado:

```js
const CONTATO = {
  whatsapp:  '5500000000000',                          // DDI+DDD+número, só dígitos
  telefone:  '+1 (000) 000-0000',                      // como aparece na tela
  email:     'contato@magiway.com',
  instagram: '@magiwayflorida',
  instaUrl:  'https://instagram.com/magiwayflorida',
  googleUrl: 'https://g.page/r/SEU-ID-AQUI/review'     // link de avaliação do Google
};
```

Esses valores alimentam de uma vez: os botões de WhatsApp da página inteira, o bloco de contato,
o rodapé e o botão flutuante. **Enquanto o número não for trocado, os botões não levam a lugar nenhum.**

---

## 2. Imagens

Enquanto um arquivo não existir, aparece um bloco listrado no lugar com o nome esperado —
a página não quebra. Basta soltar o arquivo com o nome certo em `assets/` que ele entra sozinho.

### Fotos das seções

| Arquivo | Onde aparece | Proporção |
|---|---|---|
| `hero-familia-aeroporto.jpg` | Topo da página | 16:9 (larga) |
| `familia-feliz-no-carro.jpg` | "Por que os brasileiros preferem" | 4:3 |
| `familia-castelo-disney.jpg` | Seção Excelência (fundo azul arroxeado) | 16:9 |
| `depoimento-1.jpg` | Depoimento da esquerda | 16:11 |
| `depoimento-2.jpg` | Depoimento da direita | 16:11 |
| `familia-pacifica.jpg` | Seção de contato (fundo) | 16:9 |

### Frota (PNG com fundo transparente fica melhor)

| Arquivo | Veículo |
|---|---|
| `frota-pacifica-preta.png` | Chrysler Pacifica preta, última geração |
| `frota-kia-k4-preto.png` | Kia K4 preto |
| `frota-kia-sportage.png` | Kia Sportage |
| `frota-ford-expedition-limited.png` | Ford Expedition Limited |

### Interior da Pacifica Limited — `assets/interior/`

`painel.jpg`, `bancos-couro.jpg`, `teto-solar.jpg`, `porta-malas.jpg`, `terceira-fileira.jpg`,
`central-multimidia.jpg`, `stow-n-go.jpg`, `ar-condicionado.jpg`, `cadeirinha.jpg`, `portas-eletricas.jpg`

Para acrescentar ou remover fotos, edite a lista `const INTERIOR` no `<script>`:

```js
const INTERIOR = [
  ['painel.jpg', 'Painel'],
  ['nova-foto.jpg', 'Legenda da nova foto'],   // é só adicionar a linha
];
```

### Giro 360° — `assets/spin/`

`pacifica-01.jpg` até `pacifica-36.jpg` — 36 fotos do carro girando, uma a cada 10°,
todas do mesmo enquadramento e mesma distância (senão o carro "pula" ao girar).

- Se quiser outra quantidade, mude `const SPIN_FRAMES = 36`.
- Enquanto as fotos não existirem, a área mostra um aviso explicando o que falta.
- **O carro nunca gira sozinho.** Só muda de ângulo com arraste do mouse, com o dedo,
  ou com as setas ← → do teclado.

---

## 3. O que cada seção faz

| Seção | Comportamento |
|---|---|
| **Topo** | Barra de benefícios em movimento contínuo, que pausa quando o mouse passa por cima |
| **Por que a Magiway** | Seis cartões que sobem no hover + foto da família |
| **Excelência** | Fundo azul arroxeado sobre a foto no castelo, com números que contam ao aparecer |
| **Passo a passo** | Oito cartões que entram em cascata, com linha de progresso ligada à rolagem |
| **Frota** | Carrossel com loop infinito, arraste, autoplay que pausa no hover, setas e dots |
| **Pacifica 360°** | Arraste para mudar de ângulo + galeria do interior com lightbox |
| **Depoimentos** | Dois cartões com foto e citação em vidro fosco |
| **FAQ** | Caixas cinza translúcidas, cantos retos, sem borda, que **crescem** no hover |
| **Contato** | Formulário (nome, telefone, cidade) que abre o WhatsApp preenchido + dados da empresa |

Cada seção tem um **botão verde do WhatsApp**, menor no celular. Mais o botão flutuante fixo no canto.

---

## 4. Formulário

Não tem servidor: ao clicar em **Enviar**, ele monta a mensagem com nome, telefone e cidade
e abre o WhatsApp já preenchido. As cidades do menu são Orlando, Miami, Tampa e Fort Lauderdale (FLL).

Se um dia quiser gravar os leads em algum lugar (planilha, CRM, e-mail), o ponto de troca é o
`addEventListener('submit', ...)` no final do `<script>`.

---

## 5. Tipografia e cores

- **Fonte:** Manrope nos títulos, Inter no corpo — retas, legíveis, sem itálico e sem serifa.
  Carregadas do Google Fonts; se não carregarem, cai na fonte do sistema sem quebrar o layout.
- **Cores:** azul-marinho `#0A1B2E`, vermelho `#E1222E`, creme `#FBF7F2`,
  azul arroxeado `#453A8E` (só na seção Excelência) e verde WhatsApp `#25D366` nos botões.
  Todas ficam em `:root`, no topo do `<style>`.

---

## 6. Acessibilidade

Contraste AA, navegação por teclado em todos os controles, `aria-label` nos botões de ícone,
lightbox que fecha no Esc e devolve o foco, e `prefers-reduced-motion` respeitado —
quem pede menos movimento não recebe o marquee nem o autoplay do carrossel.
