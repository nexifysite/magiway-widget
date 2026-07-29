-- ═══════════════════════════════════════════════════════════════════
-- MAGIWAY · alimenta o Supabase com a config nova do DocuSign
-- Tabela: shared_state   ·   Linha: k = 'gs_cfg_v1'
--
-- Detecta sozinho se a coluna "v" é jsonb ou text — não há variante
-- para escolher. Rode o arquivo inteiro de uma vez.
--
-- Faz MERGE, não overwrite: escreve apenas docusign.contratoUrl e
-- docusign.campos. Todo o resto (cambio, comissao, cats, locs, juros,
-- temporada, empresa, assinatura, voucherUrl, role, apiUrl) fica
-- intacto. Rodar mais de uma vez não causa dano.
-- ═══════════════════════════════════════════════════════════════════


-- ── PASSO 1 · backup ──
-- "if not exists" de proposito: preserva SEMPRE o estado da primeira
-- execucao. Se recriasse a tabela, rodar o script duas vezes gravaria
-- por cima o estado ja modificado e voce perderia o original.
-- Para refazer o backup do zero, apague a tabela antes:
--   drop table shared_state_backup_docusign;
create table if not exists shared_state_backup_docusign as
select *, now() as backup_em from shared_state where k = 'gs_cfg_v1';


-- ── PASSO 2 · aplica (detecta o tipo da coluna sozinho) ──
do $do$
declare
  v_url   text := $url$https://na4.docusign.net/Member/PowerFormSigning.aspx?PowerFormId=23b3f84d-7579-4dc1-8660-9af1836a0a69&env=na4&acct=db09479d-3111-493a-ad4c-3b2588ef4580&v=2$url$;
  v_mapa  text := $mapa$Nome_Cliente = nome
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
Data_ASS = dataass$mapa$;
  v_tipo  text;
  v_patch jsonb;
begin
  select pg_typeof(v)::text into v_tipo from shared_state where k = 'gs_cfg_v1';

  if v_tipo is null then
    raise exception
      'A linha k=''gs_cfg_v1'' nao existe em shared_state. O app ainda nao subiu a config — use o botao SALVAR DOCUSIGN no lugar deste script.';
  end if;

  v_patch := jsonb_build_object('contratoUrl', v_url, 'campos', v_mapa);

  if v_tipo = 'jsonb' then
    update shared_state
       set v = v || jsonb_build_object(
                 'docusign', coalesce(v -> 'docusign', '{}'::jsonb) || v_patch),
           updated_at = now()
     where k = 'gs_cfg_v1';
  else
    update shared_state
       set v = (v::jsonb || jsonb_build_object(
                 'docusign', coalesce(v::jsonb -> 'docusign', '{}'::jsonb) || v_patch))::text,
           updated_at = now()
     where k = 'gs_cfg_v1';
  end if;

  raise notice 'DocuSign atualizado · coluna v do tipo % · % rotulos no mapeamento',
               v_tipo, array_length(string_to_array(v_mapa, E'\n'), 1);
end
$do$;


-- ── PASSO 3 · conferir ──
-- Esperado: contrato_novo_ok = t · linhas_mapeamento = 43
--           voucher_preservado = t · resto_intacto = t
select
  (v::jsonb #>> '{docusign,contratoUrl}') like '%23b3f84d%'          as contrato_novo_ok,
  array_length(string_to_array(v::jsonb #>> '{docusign,campos}', E'\n'), 1)
                                                                       as linhas_mapeamento,
  v::jsonb #>> '{docusign,role}'                                     as papel_signatario,
  (v::jsonb #>> '{docusign,voucherUrl}') like '%2c25a66c%'           as voucher_preservado,
  (select b.v::jsonb - 'docusign' from shared_state_backup_docusign b)
    = (v::jsonb - 'docusign')                                          as resto_intacto
from shared_state
where k = 'gs_cfg_v1';


-- ── Reverter, se precisar ──
-- update shared_state s
--    set v = b.v, updated_at = now()
--   from shared_state_backup_docusign b
--  where s.k = b.k and s.k = 'gs_cfg_v1';
