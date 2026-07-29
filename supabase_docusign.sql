-- ═══════════════════════════════════════════════════════════════════
-- MAGIWAY · alimenta o Supabase com a config nova do DocuSign
-- Tabela: shared_state   ·   Linha: k = 'gs_cfg_v1'
--
-- O app grava a config como STRING JSON dentro da coluna jsonb
-- (codificacao dupla): jsonb_typeof(v) = 'string', nao 'object'.
-- Este script detecta isso sozinho e devolve o valor no MESMO formato.
--
-- Faz MERGE e VALIDA antes de gravar: se qualquer coisa fora de
-- "docusign" mudar, o bloco aborta inteiro e nada e escrito.
--
-- Rode o arquivo inteiro de uma vez.
-- ═══════════════════════════════════════════════════════════════════


-- ── PASSO 0 · SO SE VOCE JA RODOU UMA VERSAO ANTERIOR DESTE SCRIPT ──
-- A versao anterior transformava a config num array. Se o PASSO 1 abaixo
-- reclamar, ou se o PASSO 2 abortar dizendo que a config "e array",
-- descomente e rode esta linha para restaurar, depois rode o resto:
--
-- update shared_state s set v = b.v, updated_at = now()
--   from shared_state_backup_docusign b
--  where s.k = b.k and s.k = 'gs_cfg_v1';


-- ── PASSO 1 · backup ──
-- "if not exists" de proposito: preserva SEMPRE o estado da primeira
-- execucao, para o rollback continuar valendo se voce rodar de novo.
-- Para refazer do zero:  drop table shared_state_backup_docusign;
create table if not exists shared_state_backup_docusign as
select *, now() as backup_em from shared_state where k = 'gs_cfg_v1';


-- ── PASSO 2 · aplica (detecta tipo e formato sozinho) ──
do $do$
declare
  v_url    text := $url$https://na4.docusign.net/Member/PowerFormSigning.aspx?PowerFormId=23b3f84d-7579-4dc1-8660-9af1836a0a69&env=na4&acct=db09479d-3111-493a-ad4c-3b2588ef4580&v=2$url$;
  v_mapa   text := $mapa$Nome_Cliente = nome
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
  v_tipo   text;    -- tipo da COLUNA: jsonb ou text
  v_forma  text;    -- formato do CONTEUDO: object ou string
  v_cfg    jsonb;   -- config normalizada como objeto
  v_novo   jsonb;
  v_chaves int;
begin
  select pg_typeof(v)::text into v_tipo from shared_state where k = 'gs_cfg_v1';
  if v_tipo is null then
    raise exception
      'A linha k=''gs_cfg_v1'' nao existe em shared_state. O app ainda nao subiu a config — use o botao SALVAR DOCUSIGN no lugar deste script.';
  end if;

  -- normaliza: obtem o objeto de config, esteja ele direto ou como string
  select jsonb_typeof(v::jsonb),
         case when jsonb_typeof(v::jsonb) = 'string'
              then (v::jsonb #>> '{}')::jsonb
              else v::jsonb end
    into v_forma, v_cfg
    from shared_state where k = 'gs_cfg_v1';

  if jsonb_typeof(v_cfg) <> 'object' then
    raise exception
      'Formato inesperado: a config e % em vez de objeto. Nada foi alterado. Se voce rodou uma versao anterior deste script, restaure pelo PASSO 0.',
      jsonb_typeof(v_cfg);
  end if;

  v_chaves := (select count(*) from jsonb_object_keys(v_cfg));

  v_novo := v_cfg || jsonb_build_object(
              'docusign',
              coalesce(v_cfg -> 'docusign', '{}'::jsonb)
                || jsonb_build_object('contratoUrl', v_url, 'campos', v_mapa));

  -- ── validacao · qualquer desvio aborta e desfaz tudo ──
  if (v_novo - 'docusign') <> (v_cfg - 'docusign') then
    raise exception 'Abortado: algo fora de "docusign" teria mudado.';
  end if;
  if (select count(*) from jsonb_object_keys(v_novo)) <> v_chaves then
    raise exception 'Abortado: o numero de chaves de topo mudaria (% para %).',
      v_chaves, (select count(*) from jsonb_object_keys(v_novo));
  end if;
  if v_novo #>> '{docusign,contratoUrl}' <> v_url then
    raise exception 'Abortado: contratoUrl nao ficou com o valor esperado.';
  end if;

  -- ── grava de volta no MESMO formato em que estava ──
  if v_tipo = 'text' then
    update shared_state set v = v_novo::text,        updated_at = now() where k = 'gs_cfg_v1';
  elsif v_forma = 'string' then
    update shared_state set v = to_jsonb(v_novo::text), updated_at = now() where k = 'gs_cfg_v1';
  else
    update shared_state set v = v_novo,              updated_at = now() where k = 'gs_cfg_v1';
  end if;

  raise notice 'DocuSign atualizado · coluna % · formato % · % rotulos · % chaves de topo preservadas',
               v_tipo, v_forma, array_length(string_to_array(v_mapa, E'\n'), 1), v_chaves;
end
$do$;


-- ── PASSO 3 · conferir ──
-- Esperado: t · 43 · Cliente · t · t · e formato igual ao de antes
with norm as (
  select case when jsonb_typeof(v::jsonb) = 'string'
              then (v::jsonb #>> '{}')::jsonb else v::jsonb end as j,
         jsonb_typeof(v::jsonb) as formato
    from shared_state where k = 'gs_cfg_v1'),
 orig as (
  select case when jsonb_typeof(v::jsonb) = 'string'
              then (v::jsonb #>> '{}')::jsonb else v::jsonb end as j,
         jsonb_typeof(v::jsonb) as formato
    from shared_state_backup_docusign)
select
  (n.j #>> '{docusign,contratoUrl}') like '%23b3f84d%'                                    as contrato_novo_ok,
  array_length(string_to_array(n.j #>> '{docusign,campos}', E'\n'), 1) as linhas_mapeamento,
  n.j #>> '{docusign,role}'                                          as papel_signatario,
  (n.j #>> '{docusign,voucherUrl}') like '%2c25a66c%'                as voucher_preservado,
  (n.j - 'docusign') = (o.j - 'docusign')                            as resto_intacto,
  n.formato = o.formato                                              as formato_preservado
from norm n, orig o;


-- ── Reverter, se precisar ──
-- update shared_state s set v = b.v, updated_at = now()
--   from shared_state_backup_docusign b
--  where s.k = b.k and s.k = 'gs_cfg_v1';
