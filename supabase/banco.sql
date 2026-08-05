-- ═══════════════════════════════════════════════════════════════════
--  MAGIWAY — BANCO DE DADOS (Supabase)
--
--  Como rodar: Supabase → SQL Editor → New query → cole tudo → Run.
--  Pode rodar mais de uma vez sem estragar nada: tudo é "se não existir"
--  ou "apaga e recria a política".
--
--  O que este arquivo resolve, além de criar as tabelas:
--
--  Até agora o servidor mandava TODAS as linhas de shared_state para
--  qualquer pessoa logada, e era o navegador que jogava fora o que não
--  era para ela ver. Quem abrisse o DevTools lia o fluxo de caixa
--  inteiro. As políticas abaixo mudam isso de lugar: o servidor passa a
--  recusar, e aí não tem DevTools que resolva.
--
--  E o canal anônimo ganha tabela própria, sem coluna de autor e sem
--  hora — o que não existe no banco não vaza.
-- ═══════════════════════════════════════════════════════════════════

-- ── 1. PERFIS ──────────────────────────────────────────────────────
-- Uma linha por pessoa que entra no app. É o 'role' daqui que decide
-- quem é gerente.
create table if not exists public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  nome       text,
  role       text not null default 'vendedor',   -- 'admin' = gerente
  vendor_id  text,
  criado_em  timestamptz not null default now()
);

-- Perfil nasce sozinho quando a pessoa é criada no Authentication.
create or replace function public.criar_perfil()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, nome)
  values (new.id, coalesce(new.raw_user_meta_data->>'nome', split_part(new.email,'@',1)))
  on conflict (id) do nothing;
  return new;
end; $$;

drop trigger if exists ao_criar_usuario on auth.users;
create trigger ao_criar_usuario
  after insert on auth.users
  for each row execute function public.criar_perfil();

-- Preenche quem já existe (não mexe em quem já tem perfil).
insert into public.profiles (id, nome)
select u.id, split_part(u.email,'@',1) from auth.users u
on conflict (id) do nothing;

-- ── 2. QUEM É GERENTE ──────────────────────────────────────────────
-- SOMENTE O LUCIANO. Diretoria, Janes e Dickson são 'vendedor'.
update public.profiles p set role = 'admin'
  from auth.users u
 where u.id = p.id and lower(u.email) = 'luciano_lira19@hotmail.com';

update public.profiles p set role = 'vendedor'
  from auth.users u
 where u.id = p.id and lower(u.email) <> 'luciano_lira19@hotmail.com';

-- Função usada pelas políticas. É SECURITY DEFINER de propósito: sem
-- isso, ler profiles dentro de uma política de profiles entra em laço.
create or replace function public.eh_gerente()
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce((select role = 'admin' from public.profiles where id = auth.uid()), false);
$$;

-- ── 3. DADOS DE CADA PESSOA ────────────────────────────────────────
-- Vendas, cotações e configurações do próprio usuário.
create table if not exists public.app_state (
  user_id    uuid not null references auth.users(id) on delete cascade,
  k          text not null,
  v          text,
  updated_at timestamptz not null default now(),
  primary key (user_id, k)
);

-- ── 4. DADOS DA EMPRESA ────────────────────────────────────────────
-- Reservas, frota, suporte, tarefas, NPS, fluxo de caixa. Uma linha por
-- chave; o app funde item a item antes de gravar, então duas pessoas
-- salvando junto não apagam o trabalho uma da outra.
create table if not exists public.shared_state (
  k          text primary key,
  v          text,
  updated_at timestamptz not null default now()
);

-- ── 5. CANAL ANÔNIMO ───────────────────────────────────────────────
-- Repare no que NÃO tem aqui: nenhuma coluna de autor, de login, de
-- aparelho ou de hora. Só a data do dia. Não é promessa de sigilo, é a
-- estrutura da tabela — não há de onde tirar quem escreveu.
create table if not exists public.auditoria (
  id      uuid primary key default gen_random_uuid(),
  tipo    text not null default 'reclamacao',   -- reclamacao | agradecimento | sugestao
  assunto text,
  texto   text not null,
  dia     date not null default current_date
);

-- ── 6. TRANCAS ─────────────────────────────────────────────────────
alter table public.profiles     enable row level security;
alter table public.app_state    enable row level security;
alter table public.shared_state enable row level security;
alter table public.auditoria    enable row level security;

drop policy if exists "perfil proprio"      on public.profiles;
drop policy if exists "meus dados"          on public.app_state;
drop policy if exists "empresa le"          on public.shared_state;
drop policy if exists "empresa insere"      on public.shared_state;
drop policy if exists "empresa atualiza"    on public.shared_state;
drop policy if exists "empresa apaga"       on public.shared_state;
drop policy if exists "todos escrevem"      on public.auditoria;
drop policy if exists "so o gerente le"     on public.auditoria;
drop policy if exists "so o gerente apaga"  on public.auditoria;

-- Cada um lê o próprio perfil; o gerente lê todos.
create policy "perfil proprio" on public.profiles
  for select to authenticated
  using (id = auth.uid() or public.eh_gerente());

-- Os dados de uma pessoa não saem do servidor para outra.
create policy "meus dados" on public.app_state
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- Dados da empresa: todo mundo lê e grava, MENOS o fluxo de caixa, que
-- só sai do servidor para o gerente. Era isso que faltava: a trava
-- existia só no navegador.
create policy "empresa le" on public.shared_state
  for select to authenticated
  using (k <> 'gs_fluxo_v1' or public.eh_gerente());

create policy "empresa insere" on public.shared_state
  for insert to authenticated
  with check (k <> 'gs_fluxo_v1' or public.eh_gerente());

create policy "empresa atualiza" on public.shared_state
  for update to authenticated
  using      (k <> 'gs_fluxo_v1' or public.eh_gerente())
  with check (k <> 'gs_fluxo_v1' or public.eh_gerente());

create policy "empresa apaga" on public.shared_state
  for delete to authenticated
  using (public.eh_gerente());

-- Canal anônimo: qualquer um escreve, ninguém lê de volta — nem quem
-- escreveu. Só o gerente enxerga a caixa.
create policy "todos escrevem" on public.auditoria
  for insert to authenticated with check (true);

create policy "so o gerente le" on public.auditoria
  for select to authenticated using (public.eh_gerente());

create policy "so o gerente apaga" on public.auditoria
  for delete to authenticated using (public.eh_gerente());

-- ── 7. TEMPO REAL ──────────────────────────────────────────────────
-- Faz a mudança de uma pessoa aparecer na tela da outra em ~1s.
-- A auditoria fica DE FORA de propósito: o Realtime empurra a linha
-- para quem está inscrito, e ninguém precisa ver essa chegar.
do $$
begin
  begin
    alter publication supabase_realtime add table public.shared_state;
  exception when duplicate_object then null;
  end;
end $$;

-- ── 8. CONFERÊNCIA ─────────────────────────────────────────────────
-- Deve listar as 4 tabelas com rowsecurity = true.
select tablename, rowsecurity
  from pg_tables
 where schemaname = 'public'
   and tablename in ('profiles','app_state','shared_state','auditoria')
 order by tablename;

-- E aqui, exatamente uma linha com role = 'admin'.
select u.email, p.role
  from public.profiles p join auth.users u on u.id = p.id
 order by p.role, u.email;
