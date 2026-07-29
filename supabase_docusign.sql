-- ═══════════════════════════════════════════════════════════════════
-- MAGIWAY · alimenta o Supabase com a config nova do DocuSign
-- Tabela: shared_state   ·   Linha: k = 'gs_cfg_v1'
--
-- Faz um MERGE, não um overwrite: preenche apenas docusign.contratoUrl
-- e docusign.campos. Todo o resto da config (cambio, comissao, cats,
-- locs, juros, temporada, empresa, assinatura, voucherUrl, role,
-- apiUrl) fica intacto.
--
-- Rode os passos NA ORDEM. O passo 2 é o único que escreve.
-- ═══════════════════════════════════════════════════════════════════


-- ── PASSO 0 · descobrir o tipo da coluna e conferir que a linha existe ──
-- Olhe a coluna "tipo_coluna" no resultado: vai dizer 'text' ou 'jsonb'.
-- É isso que decide qual variante do PASSO 2 você usa.
select
  k,
  pg_typeof(v)                as tipo_coluna,
  length(v::text)             as tamanho_atual,
  (v::jsonb #>> '{docusign,contratoUrl}')  as contrato_atual,
  coalesce(nullif(v::jsonb #>> '{docusign,campos}', ''), '(VAZIO)') as mapeamento_atual
from shared_state
where k = 'gs_cfg_v1';
-- Se não voltar nenhuma linha, pare: o app ainda não subiu a config.
-- Nesse caso use o caminho do botão SALVAR DOCUSIGN, não este SQL.


-- ── PASSO 1 · backup (recomendado) ──
create table if not exists shared_state_backup_docusign as
select *, now() as backup_em from shared_state where k = 'gs_cfg_v1';


-- ── PASSO 2 · o update. USE APENAS A VARIANTE QUE BATE COM O PASSO 0 ──

-- ▼▼▼ VARIANTE A — se tipo_coluna = text ▼▼▼
update shared_state
set v = (
      v::jsonb || jsonb_build_object(
        'docusign',
        coalesce(v::jsonb -> 'docusign', '{}'::jsonb) || jsonb_build_object(
          'contratoUrl', $url$https://na4.docusign.net/Member/PowerFormSigning.aspx?PowerFormId=23b3f84d-7579-4dc1-8660-9af1836a0a69&env=na4&acct=db09479d-3111-493a-ad4c-3b2588ef4580&v=2$url$::text,
          'campos',      $mapa$Nome_Cliente = nome
CPF_Cliente = cpf
Telefone_Cliente = tel
email_Cliente = email
Nascimento_Cliente = nasc
CNH_Cliente = cnh
ValCNH_Cliente = cnhval
CEP_N_Cliente = cep
Categoria_Cliente = cat
Diarias_Cliente = dias
Local_Entrega = locret
Local_Devolucao = locdev
Data_Enterga = din
Data_Devolucao = dout
Hora_Entrega = hc
Hora_Devolucao = hd
CA_Entrega = caent
CA_Devolucao = cadev
Valor_Moeda = valor
numeroPorExtenso() = extenso
Modp_Pagamento = forma
Data_Pagamento = pgdata
Nome_ADD1 = ad1nome
CPF_ADD1 = ad1cpf
Nascimento_ADD1 = ad1nasc
CNH_ADD1 = ad1cnh
ValCNH_ADD1 = ad1cnhval
Nome_ADD2 = ad2nome
CPF_ADD2 = ad2cpf
Nascimento_ADD2 = ad2nasc
CNH_ADD2 = ad2cnh
ValCNH_ADD2 = ad2cnhval
Nome_ADD3 = ad3nome
CPF_ADD3 = ad3cpf
Nascimento_ADD3 = ad3nasc
CNH_ADD3 = ad3cnh
ValCNH_ADD3 = ad3cnhval
Nome_ADD4 = ad4nome
CPF_ADD4 = ad4cpf
Nascimento_ADD4 = ad4nasc
CNH_ADD4 = ad4cnh
ValCNH_ADD4 = ad4cnhval
Data_ASS = dataass$mapa$::text
        )
      )
    )::text,
    updated_at = now()
where k = 'gs_cfg_v1';
-- ▲▲▲ FIM DA VARIANTE A ▲▲▲

/*  ▼▼▼ VARIANTE B — se tipo_coluna = jsonb · remova este bloco de comentário ▼▼▼
update shared_state
set v = (
      v || jsonb_build_object(
        'docusign',
        coalesce(v -> 'docusign', '{}'::jsonb) || jsonb_build_object(
          'contratoUrl', $url$https://na4.docusign.net/Member/PowerFormSigning.aspx?PowerFormId=23b3f84d-7579-4dc1-8660-9af1836a0a69&env=na4&acct=db09479d-3111-493a-ad4c-3b2588ef4580&v=2$url$::text,
          'campos',      $mapa$Nome_Cliente = nome
CPF_Cliente = cpf
Telefone_Cliente = tel
email_Cliente = email
Nascimento_Cliente = nasc
CNH_Cliente = cnh
ValCNH_Cliente = cnhval
CEP_N_Cliente = cep
Categoria_Cliente = cat
Diarias_Cliente = dias
Local_Entrega = locret
Local_Devolucao = locdev
Data_Enterga = din
Data_Devolucao = dout
Hora_Entrega = hc
Hora_Devolucao = hd
CA_Entrega = caent
CA_Devolucao = cadev
Valor_Moeda = valor
numeroPorExtenso() = extenso
Modp_Pagamento = forma
Data_Pagamento = pgdata
Nome_ADD1 = ad1nome
CPF_ADD1 = ad1cpf
Nascimento_ADD1 = ad1nasc
CNH_ADD1 = ad1cnh
ValCNH_ADD1 = ad1cnhval
Nome_ADD2 = ad2nome
CPF_ADD2 = ad2cpf
Nascimento_ADD2 = ad2nasc
CNH_ADD2 = ad2cnh
ValCNH_ADD2 = ad2cnhval
Nome_ADD3 = ad3nome
CPF_ADD3 = ad3cpf
Nascimento_ADD3 = ad3nasc
CNH_ADD3 = ad3cnh
ValCNH_ADD3 = ad3cnhval
Nome_ADD4 = ad4nome
CPF_ADD4 = ad4cpf
Nascimento_ADD4 = ad4nasc
CNH_ADD4 = ad4cnh
ValCNH_ADD4 = ad4cnhval
Data_ASS = dataass$mapa$::text
        )
      )
    ),
    updated_at = now()
where k = 'gs_cfg_v1';
    ▲▲▲ FIM DA VARIANTE B ▲▲▲  */


-- ── PASSO 3 · conferir o resultado ──
-- Esperado: contrato_novo com 23b3f84d-… e total_linhas_mapeamento = 43
select
  v::jsonb #>> '{docusign,contratoUrl}' as contrato_novo,
  array_length(
    string_to_array(v::jsonb #>> '{docusign,campos}', E'\n'), 1
  ) as total_linhas_mapeamento,
  v::jsonb #>> '{docusign,role}'        as papel_signatario,
  v::jsonb #>> '{docusign,voucherUrl}'  as voucher_preservado,
  v::jsonb ? 'cats'                       as cats_preservado,
  v::jsonb ? 'juros'                      as juros_preservado
from shared_state
where k = 'gs_cfg_v1';


-- ── Reverter, se precisar ──
-- update shared_state s
-- set v = b.v, updated_at = now()
-- from shared_state_backup_docusign b
-- where s.k = b.k and s.k = 'gs_cfg_v1';
