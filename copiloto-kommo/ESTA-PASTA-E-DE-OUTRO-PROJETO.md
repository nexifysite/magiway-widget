# Atenção: esta pasta não faz parte do app de vendas

Nada aqui é carregado pelo `index.html`, pelo `cotacao-imediata.html` nem
publicado pela Netlify. Estes arquivos são do **outro** projeto, o
`MAGIWAY-AGENTE-KOMMO` (o Copiloto do Kommo), que vive no computador do
Luciano e tem repositório próprio.

Estão versionados aqui por um motivo só: **backup**. Foram escritos num
container que é apagado quando a sessão fecha, e sem o commit a única
cópia seria o zip baixado. Quando entrarem no projeto do Kommo, esta
pasta pode ser apagada.

```bash
node copiloto-kommo/testes/testar-tudo.js
#   373 asserções passaram, 0 falharam
```

O que ler primeiro: `CONECTAR.md` (ligar no Kommo) e `INSTALAR.md` (o
resto). O que ainda falta e por quê: `ORDEM-DO-PAINEL.md`.

## Duas coisas compartilhadas de verdade entre os dois projetos

**`site/ciclo.js` é cópia** da função de ciclo do app de vendas
(`index.html`, bloco `mgw-ciclo-js`). Se a virada do mês mudar no app,
muda aqui também — senão os dois painéis passam a dar totais diferentes
para o mesmo mês, que é o erro que custou mais caro neste ecossistema
(9 cotações contra 4 para o mesmo agosto).

**`site/equipe.js` repete o cadastro da equipe**, incluindo o cargo da
Janes (**Gerência**, corrigido em 06/10/2026 nos dois projetos). Se
entrar ou sair alguém, os dois lugares mudam: aqui e em
`MGW_USUARIOS` / `MGW_CARGOS_CORRETOS` no `index.html`.

## O único arquivo com rede

`site/kommo-api.js`. Os outros 19 são funções puras, e
`testes/testar-kommo.js` varre a pasta e falha se aparecer um segundo.
O token do Kommo **não** está aqui: fica em `config.json`, que o
`.gitignore` ignora.
