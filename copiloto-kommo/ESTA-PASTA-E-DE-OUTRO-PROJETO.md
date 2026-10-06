# Atenção: esta pasta não faz parte do app de vendas

Nada aqui é carregado pelo `index.html`, pelo `cotacao-imediata.html`
nem publicado pela Netlify. Estes arquivos são do **outro** projeto, o
`MAGIWAY-AGENTE-KOMMO` (o Copiloto do Kommo), que vive no computador do
Luciano e tem repositório próprio.

Estão versionados aqui por um motivo só: **backup**. Foram escritos num
container que é apagado quando a sessão fecha, e sem o commit a única
cópia seria o zip baixado. Quando entrarem no projeto do Kommo, esta
pasta pode ser apagada.

O que ler primeiro: `INSTALAR.md`. O que ainda falta e por quê:
`ORDEM-DO-PAINEL.md`.

```bash
node copiloto-kommo/testes/testar-tudo.js
#   130 asserções passaram, 0 falharam
```

Uma coisa é compartilhada de verdade entre os dois projetos e merece
cuidado: `site/ciclo.js` é **cópia** da função de ciclo do app de vendas
(`index.html`, bloco `mgw-ciclo-js`). Se a virada do mês mudar no app,
muda aqui também — senão os dois painéis passam a dar totais diferentes
para o mesmo mês, que é exatamente o erro que custou mais caro neste
ecossistema (9 cotações contra 4 para o mesmo agosto).
