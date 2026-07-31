# Magiway Rental Car — landing

Landing page estática, sem build e sem dependências externas. Basta servir a
pasta (ou abrir `index.html`) para ver tudo funcionando.

```
index.html
assets/
  css/landing.css
  js/car3d.js      # renderizador 3D dos veículos (canvas 2D puro)
  js/landing.js    # comportamento da página + configuração
  img/magiway-logo.png
```

## O que precisa ser preenchido antes de publicar

Três coisas estão como **placeholder** e precisam de dado real:

1. **Contato da empresa** — objeto `SITE`, no topo de `assets/js/landing.js`:
   telefone, WhatsApp, e-mail, endereço, horário, Instagram e Facebook.
   Esses valores alimentam a seção de contato, o botão flutuante e o rodapé.
2. **Números da seção "Famílias"** — em `index.html`, os blocos marcados com
   `data-placeholder="true"` (`data-count`). Hoje são valores ilustrativos.
3. **Depoimentos** — também marcados com `data-placeholder="true"`. Substitua
   pelos textos e nomes reais dos clientes.

Procure por `PLACEHOLDER` no `index.html` para achar todos de uma vez.

## Formulário

Enquanto `SITE.formEndpoint` estiver vazio, o formulário monta a mensagem e
abre o WhatsApp com tudo preenchido. Preenchendo o endpoint (Formspree, n8n,
webhook do CRM…), o envio passa a ser um `POST` com JSON.

O formulário já captura `utm_source`, `utm_medium`, `utm_campaign`,
`utm_content`, `utm_term`, `gclid`, `fbclid` e a URL de origem em campos
ocultos — eles seguem junto no envio, então dá para atribuir o lead à
campanha que trouxe o clique.

## Frota e experiência 360º

Os veículos não são fotos: são renders 3D gerados em tempo real por
`assets/js/car3d.js`. Cada modelo é descrito por uma silhueta lateral em
`SPECS` (sedan, SUV, minivan, SUV grande), que o motor "lofta" ao longo da
largura para virar volume. Para mudar a cor de um carro da frota, altere o
campo `color` no array `FLEET`, em `landing.js`; para as cores da experiência
360º, o array `COLORS`.

Trocar por fotos reais é possível sem reescrever nada: basta substituir o
`<canvas>` por um `<img>` (ou por um visualizador de 360 com sequência de
frames) nos mesmos contêineres.

## Interior da Pacifica

O interior é um SVG panorâmico de três telas (frente, 2ª fileira, 3ª fileira
e bagagem) dentro de `index.html`, com dez pontos clicáveis definidos no array
`HOTSPOTS` de `landing.js`.

Ao clicar num ponto, a ampliação é feita recortando o `viewBox` do próprio
desenho — por isso o zoom não perde nitidez. Se você tiver a **foto real**
daquele detalhe, adicione `photo: 'assets/img/arquivo.jpg'` ao item do array:
o lightbox passa a mostrar a foto no lugar do desenho, sem mais nenhuma
alteração.

## Acessibilidade e movimento

Toda a animação (revelações, contadores, rotação dos carros, marquee) é
desligada automaticamente quando o sistema pede `prefers-reduced-motion`. Os
pontos do interior e o 360º respondem a teclado, e o lightbox fecha com `Esc`
e navega com as setas.
