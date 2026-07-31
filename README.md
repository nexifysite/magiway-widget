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

## Fotos (provisórias)

O hero e os quatro cartões da frota exibem **fotos do Wikimedia Commons**,
apontadas no objeto `PHOTOS`, no topo de `assets/js/landing.js`. Elas estão
ali só para tirar a página do abstrato — cada uma leva o selo *"foto
ilustrativa"*, porque são veículos de outras cores, e não os carros da frota
da Magiway.

O carregamento é tolerante a falha: a foto só aparece depois de carregar e,
se a URL falhar, o `<img>` se remove sozinho e o render 3D do veículo
continua no lugar. A página nunca fica com um buraco.

**Para publicar de verdade**, troque cada URL por um arquivo local:

```js
var PHOTOS = {
  hero: 'assets/img/frota/pacifica-hero.jpg',
  fleet: {
    sedan:   'assets/img/frota/sedan.jpg',
    suv:     'assets/img/frota/suv.jpg',
    minivan: 'assets/img/frota/pacifica.jpg',
    fullsuv: 'assets/img/frota/expedition.jpg'
  }
};
```

Use fotos em proporção deitada (16:9 ou 16:10) — o recorte é `object-fit:
cover`. Com as fotos reais da frota, remova também o selo "foto ilustrativa"
na função `mountPhoto`.

### Crédito das fotos provisórias

As imagens do Wikimedia Commons são Creative Commons e **exigem atribuição**
enquanto estiverem no ar:

| Slot | Arquivo no Commons |
| --- | --- |
| Hero | `2021 Chrysler Pacifica Touring-L, front 7.11.21.jpg` |
| Sedan | `2020 Nissan Altima 2.5 S in White, front right.jpg` |
| SUV | `2020 Ford Explorer ST, front 8.24.19.jpg` |
| Minivan | `2021 Chrysler Pacifica S Hybrid 3of4.jpg` |
| SUV grande | `2019 Ford Expedition XLT, front 1.21.20.jpg` |
| Famílias (principal) | `A mother and her children on a pier (Unsplash).jpg` |
| Famílias (inset) | `Road trip (Unsplash).jpg` |

As duas fotos da seção de famílias são do Unsplash espelhado no Commons, em
CC0 — a licença permite uso comercial sem atribuição. **Mas são pessoas
reais.** Colocar o rosto de alguém numa página que diz "nossos clientes"
sugere uma relação que não existe, e a licença da foto não cobre o direito de
imagem. Trate como rascunho visual e troque por fotos de clientes reais da
Magiway, com autorização, ou por banco de imagens com model release.

Cada arquivo, com autor e licença, está em
`commons.wikimedia.org/wiki/File:<nome do arquivo>`. Trocar pelas fotos
próprias da Magiway resolve a atribuição e a questão das cores de uma vez.

## Frota e experiência 360º

Os veículos não são fotos: são renders 3D gerados em tempo real por
`assets/js/car3d.js`. Cada modelo é descrito por uma silhueta lateral em
`SPECS` (sedan, SUV, minivan, SUV grande), que o motor "lofta" ao longo da
largura para virar volume. Para mudar a cor de um carro da frota, altere o
campo `color` no array `FLEET`, em `landing.js`; para as cores da experiência
360º, o array `COLORS`.

A experiência 360º continua em 3D mesmo com as fotos ligadas: girar o carro
exige uma sequência de dezenas de frames do mesmo veículo, que uma foto solta
não substitui. Quando houver a sequência fotográfica, ela entra no lugar do
`<canvas>` do `#exp360`.

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
