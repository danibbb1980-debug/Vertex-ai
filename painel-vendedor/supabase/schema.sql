-- =====================================================================
-- Lumivo Web · Painel do Vendedor
-- Esquema completo: tabelas, índices, funções, triggers e políticas RLS.
-- Cole este arquivo inteiro no SQL Editor de um projeto Supabase NOVO
-- (exclusivo deste app) e execute uma única vez.
-- =====================================================================

create extension if not exists pgcrypto;

-- Funções auxiliares ficam num schema que a API (PostgREST) não expõe.
create schema if not exists app_private;
revoke all on schema app_private from public;
grant usage on schema app_private to authenticated;

-- ---------------------------------------------------------------------
-- 1. Perfis (papel e ativo vêm SEMPRE do banco)
-- ---------------------------------------------------------------------
create table public.profiles (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  nome       text not null,
  papel      text not null default 'vendedor' check (papel in ('admin', 'vendedor')),
  ativo      boolean not null default false,
  created_at timestamptz not null default now()
);

-- Usuário logado, com perfil e ativo.
create or replace function app_private.is_active()
returns boolean
language sql stable security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles p
    where p.user_id = auth.uid() and p.ativo
  );
$$;

-- Usuário logado, ativo e admin.
create or replace function app_private.is_admin()
returns boolean
language sql stable security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles p
    where p.user_id = auth.uid() and p.ativo and p.papel = 'admin'
  );
$$;

revoke all on function app_private.is_active() from public;
revoke all on function app_private.is_admin() from public;
grant execute on function app_private.is_active() to authenticated;
grant execute on function app_private.is_admin() to authenticated;

-- Toda conta nova criada no painel do Supabase ganha um perfil de
-- vendedor INATIVO. O admin ativa pelo app (ou via SQL, no caso dele mesmo).
create or replace function app_private.handle_new_user()
returns trigger
language plpgsql security definer
set search_path = ''
as $$
begin
  insert into public.profiles (user_id, nome, papel, ativo)
  values (
    new.id,
    coalesce(nullif(new.raw_user_meta_data ->> 'nome', ''), split_part(new.email, '@', 1)),
    'vendedor',
    false
  )
  on conflict (user_id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function app_private.handle_new_user();

-- ---------------------------------------------------------------------
-- 2. Configurações (linha única)
-- ---------------------------------------------------------------------
create table public.configuracoes (
  id                   smallint primary key default 1 check (id = 1),
  percentual_comissao  numeric(5,2) not null default 25 check (percentual_comissao between 0 and 100),
  meta_ligacoes_dia    integer check (meta_ligacoes_dia is null or meta_ligacoes_dia > 0),
  preco_padrao         numeric(10,2) not null default 797,
  preco_piso           numeric(10,2) not null default 597,
  updated_at           timestamptz not null default now()
);
insert into public.configuracoes (id) values (1);

-- ---------------------------------------------------------------------
-- 3. Leads
-- ---------------------------------------------------------------------
create table public.leads (
  id               uuid primary key default gen_random_uuid(),
  vendedor_id      uuid not null default auth.uid() references public.profiles (user_id),
  nome             text not null check (length(trim(nome)) > 0),
  segmento         text not null check (segmento in ('estetica', 'odontologia', 'advocacia', 'outro')),
  segmento_outro   text,
  cidade           text,
  uf               char(2),
  telefone         text,
  whatsapp         text not null default 'nao_sei' check (whatsapp in ('sim', 'nao', 'nao_sei')),
  instagram        text,
  maps_link        text,
  registro_tipo    text check (registro_tipo in ('CRO', 'OAB', 'outro')),
  registro_numero  text,
  areas            text,
  estilo           text,
  nao_ligar        boolean not null default false,
  ja_tem_site      boolean not null default false,
  retornar_em      date,
  observacoes      text,
  arquivado_em     timestamptz,
  deleted_at       timestamptz,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
create index leads_vendedor_idx on public.leads (vendedor_id) where deleted_at is null;
create index leads_retorno_idx on public.leads (vendedor_id, retornar_em) where deleted_at is null and arquivado_em is null;

-- ---------------------------------------------------------------------
-- 4. Ligações
-- ---------------------------------------------------------------------
create table public.ligacoes (
  id           uuid primary key default gen_random_uuid(),
  lead_id      uuid not null references public.leads (id),
  vendedor_id  uuid not null default auth.uid() references public.profiles (user_id),
  data_hora    timestamptz not null default now(),
  resultado    text not null check (resultado in (
                 'nao_atendeu', 'recepcao', 'reuniao_marcada',
                 'retornar_depois', 'sem_interesse', 'nao_ligar_mais')),
  observacao   text check (observacao is null or length(observacao) <= 500),
  deleted_at   timestamptz,
  created_at   timestamptz not null default now()
);
create index ligacoes_lead_idx on public.ligacoes (lead_id) where deleted_at is null;
create index ligacoes_vendedor_data_idx on public.ligacoes (vendedor_id, data_hora) where deleted_at is null;

-- ---------------------------------------------------------------------
-- 5. Reuniões
-- ---------------------------------------------------------------------
create table public.reunioes (
  id               uuid primary key default gen_random_uuid(),
  lead_id          uuid not null references public.leads (id),
  vendedor_id      uuid not null default auth.uid() references public.profiles (user_id),
  data_hora        timestamptz,
  formato          text not null default 'video' check (formato in ('video', 'presencial')),
  rascunho_status  text not null default 'aguardando_pacote'
                     check (rascunho_status in ('aguardando_pacote', 'em_producao', 'pronto', 'enviado')),
  rascunho_link    text,
  resultado        text check (resultado in ('fechou', 'pediu_tempo', 'recusou', 'faltou', 'remarcou')),
  motivo_perda     text,
  deleted_at       timestamptz,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
create index reunioes_vendedor_data_idx on public.reunioes (vendedor_id, data_hora) where deleted_at is null;
create index reunioes_lead_idx on public.reunioes (lead_id) where deleted_at is null;
create index reunioes_fila_idx on public.reunioes (rascunho_status, data_hora) where deleted_at is null;

-- ---------------------------------------------------------------------
-- 6. Vendas
-- ---------------------------------------------------------------------
create table public.vendas (
  id               uuid primary key default gen_random_uuid(),
  lead_id          uuid not null references public.leads (id),
  vendedor_id      uuid not null default auth.uid() references public.profiles (user_id),
  valor_combinado  numeric(10,2) not null check (valor_combinado > 0),
  valor_fechado    numeric(10,2) check (valor_fechado is null or valor_fechado >= 0),
  forma_pagamento  text not null default 'pix' check (forma_pagamento in ('pix', 'cartao', 'boleto', 'outro')),
  parcelas         smallint not null default 1 check (parcelas between 1 and 6),
  status           text not null default 'aguardando_aprovacao'
                     check (status in ('aguardando_aprovacao', 'aguardando_pagamento', 'paga', 'cancelada')),
  data_pagamento   date,
  observacao       text,
  deleted_at       timestamptz,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
create index vendas_vendedor_idx on public.vendas (vendedor_id, created_at) where deleted_at is null;
create index vendas_lead_idx on public.vendas (lead_id);

-- ---------------------------------------------------------------------
-- 7. Comissões (só o admin escreve)
-- ---------------------------------------------------------------------
create table public.comissoes (
  id              uuid primary key default gen_random_uuid(),
  venda_id        uuid not null unique references public.vendas (id),
  vendedor_id     uuid not null references public.profiles (user_id),
  percentual      numeric(5,2) not null check (percentual between 0 and 100),
  base_calculo    numeric(10,2) not null check (base_calculo >= 0),
  cancelada       boolean not null default false,
  valor           numeric(10,2) generated always as (
                    case when cancelada then 0 else round(base_calculo * percentual / 100, 2) end
                  ) stored,
  status          text not null default 'a_pagar' check (status in ('a_pagar', 'paga')),
  data_pagamento  date,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index comissoes_vendedor_idx on public.comissoes (vendedor_id);

-- =====================================================================
-- TRIGGERS DE INTEGRIDADE E DE CAMPOS EXCLUSIVOS DO ADMIN
-- (RLS decide QUAIS linhas; estes triggers decidem QUAIS colunas)
-- =====================================================================

create or replace function app_private.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger leads_touch before update on public.leads
  for each row execute function app_private.touch_updated_at();
create trigger reunioes_touch before update on public.reunioes
  for each row execute function app_private.touch_updated_at();
create trigger vendas_touch before update on public.vendas
  for each row execute function app_private.touch_updated_at();
create trigger comissoes_touch before update on public.comissoes
  for each row execute function app_private.touch_updated_at();
create trigger configuracoes_touch before update on public.configuracoes
  for each row execute function app_private.touch_updated_at();

-- Leads: vendedor não apaga (deleted_at) nem troca o dono.
create or replace function app_private.guard_leads()
returns trigger language plpgsql
set search_path = ''
as $$
begin
  if app_private.is_admin() then
    return new;
  end if;
  if tg_op = 'INSERT' then
    new.deleted_at := null;
    return new;
  end if;
  if new.deleted_at is distinct from old.deleted_at then
    raise exception 'Somente o admin pode excluir um lead. Use "Arquivar".' using errcode = '42501';
  end if;
  if new.vendedor_id is distinct from old.vendedor_id then
    raise exception 'O dono do lead não pode ser alterado.' using errcode = '42501';
  end if;
  return new;
end;
$$;
create trigger leads_guard before insert or update on public.leads
  for each row execute function app_private.guard_leads();

-- Ligações, reuniões e vendas herdam o vendedor do lead; um vendedor
-- não registra nada em lead que não é dele.
create or replace function app_private.inherit_vendedor()
returns trigger language plpgsql
set search_path = ''
as $$
declare
  dono uuid;
begin
  select l.vendedor_id into dono from public.leads l where l.id = new.lead_id;
  if dono is null then
    raise exception 'Lead não encontrado.' using errcode = '23503';
  end if;
  if tg_op = 'UPDATE' and new.lead_id is distinct from old.lead_id then
    raise exception 'O lead de um registro não pode ser trocado.' using errcode = '42501';
  end if;
  if not app_private.is_admin() and dono <> auth.uid() then
    raise exception 'Este lead pertence a outro vendedor.' using errcode = '42501';
  end if;
  new.vendedor_id := dono;
  return new;
end;
$$;
create trigger ligacoes_inherit before insert or update on public.ligacoes
  for each row execute function app_private.inherit_vendedor();
create trigger reunioes_inherit before insert or update on public.reunioes
  for each row execute function app_private.inherit_vendedor();
create trigger vendas_inherit before insert or update on public.vendas
  for each row execute function app_private.inherit_vendedor();

-- Ligações: vendedor não apaga.
create or replace function app_private.guard_ligacoes()
returns trigger language plpgsql
set search_path = ''
as $$
begin
  if app_private.is_admin() then
    return new;
  end if;
  if tg_op = 'INSERT' then
    new.deleted_at := null;
  elsif new.deleted_at is distinct from old.deleted_at then
    raise exception 'Somente o admin pode excluir uma ligação.' using errcode = '42501';
  end if;
  return new;
end;
$$;
create trigger ligacoes_guard before insert or update on public.ligacoes
  for each row execute function app_private.guard_ligacoes();

-- Ao registrar "não ligar mais", o lead é marcado automaticamente.
create or replace function app_private.after_ligacao()
returns trigger language plpgsql security definer
set search_path = ''
as $$
begin
  if new.resultado = 'nao_ligar_mais' then
    update public.leads set nao_ligar = true where id = new.lead_id;
  end if;
  return null;
end;
$$;
create trigger ligacoes_after after insert on public.ligacoes
  for each row execute function app_private.after_ligacao();

-- Reuniões: rascunho_status, rascunho_link e deleted_at são do admin.
create or replace function app_private.guard_reunioes()
returns trigger language plpgsql
set search_path = ''
as $$
begin
  if app_private.is_admin() then
    return new;
  end if;
  if tg_op = 'INSERT' then
    if new.rascunho_status <> 'aguardando_pacote' or new.rascunho_link is not null then
      raise exception 'Somente o admin altera o status e o link do rascunho.' using errcode = '42501';
    end if;
    new.deleted_at := null;
    return new;
  end if;
  if new.rascunho_status is distinct from old.rascunho_status
     or new.rascunho_link is distinct from old.rascunho_link then
    raise exception 'Somente o admin altera o status e o link do rascunho.' using errcode = '42501';
  end if;
  if new.deleted_at is distinct from old.deleted_at then
    raise exception 'Somente o admin pode excluir uma reunião.' using errcode = '42501';
  end if;
  return new;
end;
$$;
create trigger reunioes_guard before insert or update on public.reunioes
  for each row execute function app_private.guard_reunioes();

-- Vendas: valor_fechado, data_pagamento, status "paga"/"cancelada" e
-- deleted_at são do admin. Vendedor não registra abaixo do piso.
create or replace function app_private.guard_vendas()
returns trigger language plpgsql
set search_path = ''
as $$
declare
  piso numeric;
begin
  if app_private.is_admin() then
    return new;
  end if;
  select c.preco_piso into piso from public.configuracoes c where c.id = 1;
  if tg_op = 'INSERT' then
    if new.valor_fechado is not null or new.data_pagamento is not null then
      raise exception 'Somente o admin informa valor fechado e data de pagamento.' using errcode = '42501';
    end if;
    if new.status not in ('aguardando_aprovacao', 'aguardando_pagamento') then
      raise exception 'Somente o admin marca a venda como paga ou cancelada.' using errcode = '42501';
    end if;
    if new.valor_combinado < coalesce(piso, 0) then
      raise exception 'Valor abaixo do piso. Fale com o Pedro.' using errcode = '23514';
    end if;
    new.deleted_at := null;
    return new;
  end if;
  if new.valor_fechado is distinct from old.valor_fechado
     or new.data_pagamento is distinct from old.data_pagamento then
    raise exception 'Somente o admin informa valor fechado e data de pagamento.' using errcode = '42501';
  end if;
  if new.status is distinct from old.status
     and (new.status not in ('aguardando_aprovacao', 'aguardando_pagamento')
          or old.status not in ('aguardando_aprovacao', 'aguardando_pagamento')) then
    raise exception 'Somente o admin marca a venda como paga ou cancelada.' using errcode = '42501';
  end if;
  if new.valor_combinado is distinct from old.valor_combinado
     and old.status not in ('aguardando_aprovacao', 'aguardando_pagamento') then
    raise exception 'Venda encerrada não pode ser alterada.' using errcode = '42501';
  end if;
  if new.valor_combinado < coalesce(piso, 0) then
    raise exception 'Valor abaixo do piso. Fale com o Pedro.' using errcode = '23514';
  end if;
  if new.deleted_at is distinct from old.deleted_at then
    raise exception 'Somente o admin pode excluir uma venda.' using errcode = '42501';
  end if;
  return new;
end;
$$;
create trigger vendas_guard before insert or update on public.vendas
  for each row execute function app_private.guard_vendas();

-- Venda cancelada/reembolsada zera a comissão.
create or replace function app_private.after_venda()
returns trigger language plpgsql
set search_path = ''
as $$
begin
  if new.status = 'cancelada' then
    update public.comissoes set cancelada = true where venda_id = new.id;
  elsif old.status = 'cancelada' then
    update public.comissoes set cancelada = false where venda_id = new.id;
  end if;
  return null;
end;
$$;
create trigger vendas_after after update of status on public.vendas
  for each row execute function app_private.after_venda();

-- Comissão só nasce de venda PAGA; vendedor da comissão = vendedor da venda.
create or replace function app_private.guard_comissoes()
returns trigger language plpgsql
set search_path = ''
as $$
declare
  v record;
begin
  select vd.status, vd.vendedor_id into v from public.vendas vd where vd.id = new.venda_id;
  if not found then
    raise exception 'Venda não encontrada.' using errcode = '23503';
  end if;
  if tg_op = 'INSERT' and v.status <> 'paga' then
    raise exception 'A comissão só nasce depois que a venda é marcada como paga.' using errcode = '23514';
  end if;
  new.vendedor_id := v.vendedor_id;
  new.cancelada := (v.status = 'cancelada');
  return new;
end;
$$;
create trigger comissoes_guard before insert or update on public.comissoes
  for each row execute function app_private.guard_comissoes();

-- Perfis: ninguém além do admin muda papel/ativo (RLS já bloqueia o
-- vendedor; aqui evitamos que o último admin se tranque para fora).
create or replace function app_private.guard_profiles()
returns trigger language plpgsql
set search_path = ''
as $$
begin
  if old.papel = 'admin' and old.ativo
     and (new.papel <> 'admin' or not new.ativo)
     and not exists (
       select 1 from public.profiles p
       where p.papel = 'admin' and p.ativo and p.user_id <> old.user_id
     ) then
    raise exception 'É preciso manter ao menos um admin ativo.' using errcode = '42501';
  end if;
  if new.user_id is distinct from old.user_id then
    raise exception 'user_id não pode ser alterado.' using errcode = '42501';
  end if;
  return new;
end;
$$;
create trigger profiles_guard before update on public.profiles
  for each row execute function app_private.guard_profiles();

-- =====================================================================
-- VIEW: reuniões com o pacote calculado
-- (security_invoker = as políticas RLS de quem consulta valem aqui)
-- =====================================================================
create view public.reunioes_pacote
with (security_invoker = true)
as
select
  r.*,
  (
    length(trim(coalesce(l.nome, ''))) > 0
    and (l.segmento <> 'outro' or length(trim(coalesce(l.segmento_outro, ''))) > 0)
    and length(trim(coalesce(l.cidade, ''))) > 0
    and length(trim(coalesce(l.maps_link, ''))) > 0
    and length(trim(coalesce(l.instagram, ''))) > 0
    and length(trim(coalesce(l.telefone, ''))) > 0
    and (l.segmento not in ('odontologia', 'advocacia') or length(trim(coalesce(l.registro_numero, ''))) > 0)
    and length(trim(coalesce(l.areas, ''))) > 0
    and r.data_hora is not null
  ) as pacote_completo
from public.reunioes r
join public.leads l on l.id = r.lead_id;

-- =====================================================================
-- RPC do admin: registrar venda paga + comissão numa só transação
-- =====================================================================
create or replace function public.registrar_pagamento(
  p_venda_id uuid,
  p_valor_fechado numeric,
  p_base_liquida numeric,
  p_data_pagamento date,
  p_percentual numeric default null
)
returns public.comissoes
language plpgsql
security invoker
set search_path = ''
as $$
declare
  pct numeric;
  c public.comissoes;
begin
  if not app_private.is_admin() then
    raise exception 'Somente o admin registra pagamentos.' using errcode = '42501';
  end if;
  pct := coalesce(p_percentual, (select percentual_comissao from public.configuracoes where id = 1));

  update public.vendas
     set valor_fechado = p_valor_fechado,
         data_pagamento = p_data_pagamento,
         status = 'paga'
   where id = p_venda_id and deleted_at is null;
  if not found then
    raise exception 'Venda não encontrada.' using errcode = '23503';
  end if;

  insert into public.comissoes (venda_id, vendedor_id, percentual, base_calculo)
  values (p_venda_id, auth.uid(), pct, p_base_liquida)
  on conflict (venda_id) do update
    set percentual = excluded.percentual,
        base_calculo = excluded.base_calculo
  returning * into c;
  return c;
end;
$$;
revoke all on function public.registrar_pagamento(uuid, numeric, numeric, date, numeric) from public, anon;
grant execute on function public.registrar_pagamento(uuid, numeric, numeric, date, numeric) to authenticated;

-- =====================================================================
-- RLS
-- =====================================================================
alter table public.profiles      enable row level security;
alter table public.configuracoes enable row level security;
alter table public.leads         enable row level security;
alter table public.ligacoes      enable row level security;
alter table public.reunioes      enable row level security;
alter table public.vendas        enable row level security;
alter table public.comissoes     enable row level security;

-- Sem login, nada: o papel anon não tem permissão alguma.
revoke all on all tables in schema public from anon;
revoke all on all functions in schema public from anon;
revoke all on all sequences in schema public from anon;
alter default privileges in schema public revoke all on tables from anon;
alter default privileges in schema public revoke all on functions from anon;

-- Logado: privilégios de tabela mínimos; as políticas filtram as linhas.
revoke all on all tables in schema public from authenticated;
grant select, insert, update on public.leads, public.ligacoes, public.reunioes, public.vendas to authenticated;
grant select on public.reunioes_pacote to authenticated;
grant select, insert, update on public.comissoes to authenticated;  -- políticas: só admin escreve
grant select, update on public.profiles to authenticated;            -- políticas: só admin atualiza
grant select, update on public.configuracoes to authenticated;       -- políticas: só admin atualiza
-- Ninguém faz DELETE físico pela API (soft delete com deleted_at).

-- profiles
create policy profiles_select on public.profiles for select to authenticated
  using (app_private.is_admin() or (user_id = auth.uid() and ativo));
create policy profiles_update on public.profiles for update to authenticated
  using (app_private.is_admin()) with check (app_private.is_admin());

-- configuracoes
create policy config_select on public.configuracoes for select to authenticated
  using (app_private.is_active());
create policy config_update on public.configuracoes for update to authenticated
  using (app_private.is_admin()) with check (app_private.is_admin());

-- leads / ligacoes / reunioes / vendas: o mesmo par de regras
create policy leads_select on public.leads for select to authenticated
  using (app_private.is_admin() or (app_private.is_active() and vendedor_id = auth.uid() and deleted_at is null));
create policy leads_insert on public.leads for insert to authenticated
  with check (app_private.is_admin() or (app_private.is_active() and vendedor_id = auth.uid()));
create policy leads_update on public.leads for update to authenticated
  using (app_private.is_admin() or (app_private.is_active() and vendedor_id = auth.uid() and deleted_at is null))
  with check (app_private.is_admin() or (app_private.is_active() and vendedor_id = auth.uid()));

create policy ligacoes_select on public.ligacoes for select to authenticated
  using (app_private.is_admin() or (app_private.is_active() and vendedor_id = auth.uid() and deleted_at is null));
create policy ligacoes_insert on public.ligacoes for insert to authenticated
  with check (app_private.is_admin() or (app_private.is_active() and vendedor_id = auth.uid()));
create policy ligacoes_update on public.ligacoes for update to authenticated
  using (app_private.is_admin() or (app_private.is_active() and vendedor_id = auth.uid() and deleted_at is null))
  with check (app_private.is_admin() or (app_private.is_active() and vendedor_id = auth.uid()));

create policy reunioes_select on public.reunioes for select to authenticated
  using (app_private.is_admin() or (app_private.is_active() and vendedor_id = auth.uid() and deleted_at is null));
create policy reunioes_insert on public.reunioes for insert to authenticated
  with check (app_private.is_admin() or (app_private.is_active() and vendedor_id = auth.uid()));
create policy reunioes_update on public.reunioes for update to authenticated
  using (app_private.is_admin() or (app_private.is_active() and vendedor_id = auth.uid() and deleted_at is null))
  with check (app_private.is_admin() or (app_private.is_active() and vendedor_id = auth.uid()));

create policy vendas_select on public.vendas for select to authenticated
  using (app_private.is_admin() or (app_private.is_active() and vendedor_id = auth.uid() and deleted_at is null));
create policy vendas_insert on public.vendas for insert to authenticated
  with check (app_private.is_admin() or (app_private.is_active() and vendedor_id = auth.uid()));
create policy vendas_update on public.vendas for update to authenticated
  using (app_private.is_admin() or (app_private.is_active() and vendedor_id = auth.uid() and deleted_at is null))
  with check (app_private.is_admin() or (app_private.is_active() and vendedor_id = auth.uid()));

-- comissoes: vendedor só LÊ as próprias; admin faz tudo.
create policy comissoes_select on public.comissoes for select to authenticated
  using (app_private.is_admin() or (app_private.is_active() and vendedor_id = auth.uid()));
create policy comissoes_insert on public.comissoes for insert to authenticated
  with check (app_private.is_admin());
create policy comissoes_update on public.comissoes for update to authenticated
  using (app_private.is_admin()) with check (app_private.is_admin());
