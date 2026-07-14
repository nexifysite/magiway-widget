# 🚗 MAGIWAY — Controle de Vendas (Google Sheets)

Script do **Google Apps Script** que monta e mantém a planilha de vendas da **MAGIWAY** dentro do Google Sheets, já com todas as mudanças pedidas.

---

## ✅ O que o script faz

| # | Pedido | Como ficou |
|---|--------|-----------|
| 1 | Comissão no **pagamento integral** | Ao lado do **VALOR DO PAGAMENTO** há **% COMISSÃO** (menu suspenso **2 / 3 / 4 / 5%**) e a **COMISSÃO** é calculada sozinha |
| 2 | Comissão no **pagamento fracionado** | Bloco **FRACIONADO — RESUMO** com **% COMISSÃO** (2/3/4/5%) e **COMISSÃO** automática sobre o total |
| 3 | **Barra de progresso** nas parcelas | Cada parcela (e a entrada) tem uma **barra** que enche de 0% a 100% conforme o valor pago |
| 4 | **Vendedores** | Lista suspensa **DICKSON, KEVIN, OUTROS** (coluna VENDEDOR) |
| 5 | **Empresa** | **MAGIWAY** em todos os títulos |
| 6 | **Categorias** | SEDAN, SUV, MINIVAN 7L, MINIVAN 7L LIMITED, MINIVAN 8L, SUV FULL, MUSTANG |
| 7 | Remover **modelo** e **placa** | Colunas excluídas |
| 8 | Trocar **"Alimentado no sistema?"** | Virou **"ADICIONADO À PLANILHA DE FECHAMENTO DO VENDEDOR?"** |
| 9 | **Dashboard só com barras %** | Aba **PAINEL** com o máximo de indicadores, todos em barra percentual |
| 10 | Próximo pagamento + **cores da linha** | 🟩 verde = quitado · 🟥 vermelho = atrasado · 🟦 azul claro = fracionado em dia. O fracionado sempre mostra a **DATA DO PRÓXIMO PAGAMENTO** |
| 11 | Excluir **Controle & Alertas** | Bloco removido |
| 12 | Retirar **Valores & Comissão** (antigo) | Substituído pela comissão por pagamento |
| 13 | Retirar **Modalidade & Progresso** (antigo) | Substituído pelas barras + cores da linha |

---

## 📥 Como instalar (passo a passo)

1. **Importe a planilha** `CONTROLE_DE_VENDAS_MAGIWAY.xlsx` para o Google Sheets
   (Google Drive ▸ Novo ▸ Upload; depois abra e use *Arquivo ▸ Salvar como Planilha Google*), **ou** crie uma planilha nova em branco.
2. Com a planilha aberta, vá em **Extensões ▸ Apps Script**.
3. Apague qualquer código de exemplo, **cole todo o conteúdo de** [`MagiwayVendas.gs`](./MagiwayVendas.gs) e clique em **Salvar** (💾).
4. Volte para a planilha e **recarregue a página** (F5).
5. No menu superior vai aparecer **🚗 MAGIWAY**. Clique em **🔧 Construir / Atualizar tudo**.
6. Na primeira vez o Google pede **autorização** — clique em *Revisar permissões*, escolha sua conta e *Permitir*.
7. Pronto! As abas **VENDAS, PAINEL, CONFIG e COMO USAR** são montadas automaticamente.

> A cada clique em **Construir / Atualizar tudo** as abas são recriadas.
> Ele pergunta antes, pois **substitui os dados já digitados** na aba VENDAS — faça uma cópia se precisar.

---

## 🖱️ Menu 🚗 MAGIWAY

- **🔧 Construir / Atualizar tudo** — cria/reconstrói todas as abas.
- **🧹 Limpar dados (mantém fórmulas)** — apaga só os dados digitados, mantendo fórmulas e formatação.
- **ℹ️ Sobre este script** — resumo do funcionamento.

---

## 📝 Como preencher (resumo)

- **Cada linha = uma reserva.** Comece na linha 4.
- Colunas com **fundo cinza são automáticas** (não digite nelas).
- **Integral:** preencha *VALOR DO PAGAMENTO* + *% COMISSÃO*, data, forma, *PAGO?* e *ADICIONADO À PLANILHA DE FECHAMENTO DO VENDEDOR?*.
- **Fracionado:** escolha o *% COMISSÃO* no resumo, lance a *ENTRADA* e até *4 PARCELAS* (valor, data, forma) e marque *PAGO? = SIM* conforme recebe — as barras sobem e a linha muda de cor.
- Ajuste **META MENSAL** e as **listas** na aba **CONFIG**.

---

## 🔧 Ajustes rápidos

- **Mudar vendedores / categorias / locais / formas / % de comissão:** edite as listas na aba **CONFIG** (colunas E a J). Para valores totalmente novos, altere também as constantes no topo do script (`VENDEDORES`, `CATEGORIAS`, `COMISSOES`, etc.) e rode *Construir / Atualizar tudo*.
- **Quantidade de linhas:** mude `NUM_LINHAS` no topo do script (padrão 100).
- **Cores:** ajuste o objeto `COR` no topo do script.
