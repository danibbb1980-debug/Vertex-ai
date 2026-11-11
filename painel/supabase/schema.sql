-- =============================================================================
-- Lumivo Web · Painel financeiro e de vendas
-- Cole este arquivo inteiro no SQL Editor do Supabase e clique em "Run".
-- Pode rodar de novo sem problema: tudo usa "if not exists" / "on conflict".
-- =============================================================================

create extension if not exists pgcrypto;

-- -----------------------------------------------------------------------------
-- E-mails permitidos. Só quem estiver aqui (e logado) lê ou grava qualquer dado.
-- Preencha depois de rodar o arquivo, por exemplo:
--   insert into public.allowed_emails (email) values ('socio1@exemplo.com'), ('socio2@exemplo.com');
-- -----------------------------------------------------------------------------
create table if not exists public.allowed_emails (
  email text primary key check (email = lower(email)),
  created_at timestamptz not null default now()
);

-- Função usada por todas as políticas. "security definer" permite consultar
-- allowed_emails sem dar acesso de leitura a essa tabela pelo app.
create or replace function public.is_allowed()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(auth.jwt() ->> 'role', '') = 'authenticated'
     and exists (
       select 1 from public.allowed_emails a
       where a.email = lower(coalesce(auth.jwt() ->> 'email', ''))
     );
$$;

revoke all on function public.is_allowed() from public, anon;
grant execute on function public.is_allowed() to authenticated;

-- -----------------------------------------------------------------------------
-- Vendas
-- -----------------------------------------------------------------------------
create table if not exists public.sales (
  id uuid primary key default gen_random_uuid(),
  client text not null,
  segment text not null default 'outro'
    check (segment in ('advocacia','odontologia','estetica','clinica_medica','outro')),
  city text,
  contact text,
  lead_origin text check (lead_origin in ('instagram','whatsapp','indicacao','outro')),
  referred_by text,
  package text not null default 'outro'
    check (package in ('essencial','padrao','completo','mensal','outro')),
  description text,
  gross_amount numeric(12,2) not null check (gross_amount >= 0),
  payment_method text not null
    check (payment_method in ('pix','cartao_avista','cartao_parcelado','boleto','transferencia')),
  installments_count integer not null default 1 check (installments_count between 1 and 24),
  platform text not null default 'direto' check (platform in ('asaas','mercado_pago','direto')),
  fee_percent numeric(6,3) not null default 0 check (fee_percent >= 0 and fee_percent < 100),
  net_amount numeric(12,2) not null,
  sale_date date not null,
  first_payment_date date not null,
  status text not null default 'aceita'
    check (status in ('proposta','aceita','aguardando','parcial','paga','cancelada')),
  recurring_active boolean not null default false,
  draft_sent_at date,
  published_at date,
  adjustments_end date,
  domain_expires_at date,
  domain text,
  site_url text,
  notes text,
  refunded_at date,
  lead_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index if not exists sales_sale_date_idx on public.sales (sale_date) where deleted_at is null;
create index if not exists sales_status_idx on public.sales (status) where deleted_at is null;
create index if not exists sales_client_idx on public.sales (lower(client));

-- -----------------------------------------------------------------------------
-- Parcelas / recebimentos
-- -----------------------------------------------------------------------------
create table if not exists public.installments (
  id uuid primary key default gen_random_uuid(),
  sale_id uuid not null references public.sales(id) on delete cascade,
  number integer not null check (number >= 1),
  gross_amount numeric(12,2) not null check (gross_amount >= 0),
  net_amount numeric(12,2) not null,
  due_date date not null,
  received_at date,
  status text not null default 'a_receber'
    check (status in ('a_receber','recebida','atrasada','cancelada')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index if not exists installments_sale_idx on public.installments (sale_id);
create index if not exists installments_due_idx on public.installments (due_date) where deleted_at is null;
create index if not exists installments_received_idx on public.installments (received_at) where deleted_at is null;

-- -----------------------------------------------------------------------------
-- Custos
-- -----------------------------------------------------------------------------
create table if not exists public.costs (
  id uuid primary key default gen_random_uuid(),
  description text not null,
  category text not null default 'outros'
    check (category in ('ferramentas','dominio','hospedagem','taxas','impostos','marketing','outros')),
  amount numeric(12,2) check (amount is null or amount >= 0),
  recurrence text not null default 'mensal' check (recurrence in ('mensal','anual','unica')),
  day_of_month integer check (day_of_month between 1 and 31),
  date date,
  starts_on date,
  active boolean not null default true,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

-- -----------------------------------------------------------------------------
-- Funil de leads
-- -----------------------------------------------------------------------------
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  segment text not null default 'outro'
    check (segment in ('advocacia','odontologia','estetica','clinica_medica','outro')),
  origin text not null default 'outro' check (origin in ('instagram','whatsapp','indicacao','outro')),
  stage text not null default 'contatado'
    check (stage in ('contatado','respondeu','rascunho','proposta','fechado','perdido')),
  stage_dates jsonb not null default '{}'::jsonb,
  offered_amount numeric(12,2),
  last_contact_at date,
  next_followup_at date,
  lost_reason text,
  notes text,
  sale_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index if not exists leads_followup_idx on public.leads (next_followup_at) where deleted_at is null;

-- -----------------------------------------------------------------------------
-- Histórico simples de edições das vendas
-- -----------------------------------------------------------------------------
create table if not exists public.sale_history (
  id uuid primary key default gen_random_uuid(),
  sale_id uuid not null references public.sales(id) on delete cascade,
  at timestamptz not null default now(),
  author text,
  summary text not null
);

create index if not exists sale_history_sale_idx on public.sale_history (sale_id, at desc);

-- -----------------------------------------------------------------------------
-- Configurações (uma linha só, id = 1)
-- -----------------------------------------------------------------------------
create table if not exists public.settings (
  id integer primary key default 1 check (id = 1),
  monthly_goal numeric(12,2) not null default 0,
  mei_limit numeric(12,2) not null default 81000,
  mei_other_revenue numeric(12,2) not null default 0,
  fees jsonb not null default '{}'::jsonb,
  hourly_cost numeric(12,2),
  daily_cost numeric(12,2),
  first_sale_prompt_done boolean not null default false,
  updated_at timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- updated_at automático
-- -----------------------------------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
declare t text;
begin
  foreach t in array array['sales','installments','costs','leads','settings'] loop
    execute format('drop trigger if exists %I_touch on public.%I', t, t);
    execute format('create trigger %I_touch before update on public.%I for each row execute function public.touch_updated_at()', t, t);
  end loop;
end $$;

-- -----------------------------------------------------------------------------
-- Segurança (RLS): sem login e sem e-mail permitido, nada é lido nem gravado.
-- Não há política de DELETE: o app só faz exclusão lógica (deleted_at).
-- -----------------------------------------------------------------------------
alter table public.allowed_emails enable row level security;  -- sem políticas: invisível ao app
alter table public.sales          enable row level security;
alter table public.installments   enable row level security;
alter table public.costs          enable row level security;
alter table public.leads          enable row level security;
alter table public.sale_history   enable row level security;
alter table public.settings       enable row level security;

do $$
declare t text;
begin
  foreach t in array array['sales','installments','costs','leads','sale_history','settings'] loop
    execute format('drop policy if exists %I_select on public.%I', t, t);
    execute format('drop policy if exists %I_insert on public.%I', t, t);
    execute format('drop policy if exists %I_update on public.%I', t, t);
    execute format('create policy %I_select on public.%I for select to authenticated using (public.is_allowed())', t, t);
    execute format('create policy %I_insert on public.%I for insert to authenticated with check (public.is_allowed())', t, t);
    execute format('create policy %I_update on public.%I for update to authenticated using (public.is_allowed()) with check (public.is_allowed())', t, t);
  end loop;
end $$;

-- O papel "anon" (visitante sem login) não recebe nenhum privilégio.
revoke all on public.allowed_emails, public.sales, public.installments, public.costs,
              public.leads, public.sale_history, public.settings from anon;
-- Ninguém pelo app apaga de verdade nem lê a lista de e-mails.
revoke delete, truncate on public.sales, public.installments, public.costs,
              public.leads, public.sale_history, public.settings from authenticated;
revoke all on public.allowed_emails from authenticated;
grant select, insert, update on public.sales, public.installments, public.costs,
              public.leads, public.sale_history, public.settings to authenticated;

-- -----------------------------------------------------------------------------
-- Dados iniciais (só o que é conhecido; nada inventado)
-- -----------------------------------------------------------------------------
insert into public.settings (id) values (1) on conflict (id) do nothing;

insert into public.costs (id, description, category, amount, recurrence, day_of_month, active)
values
  ('00000000-0000-4000-8000-000000000001', 'Claude (assinatura)', 'ferramentas', 129.90, 'mensal', null, true),
  ('00000000-0000-4000-8000-000000000002', 'Imposto MEI (DAS)',   'impostos',    null,   'mensal', null, false),
  ('00000000-0000-4000-8000-000000000003', 'Domínios',            'dominio',     null,   'anual',  null, false)
on conflict (id) do nothing;

-- -----------------------------------------------------------------------------
-- Teste rápido de segurança (rode separado, depois de tudo):
--   set local role anon;
--   select count(*) from public.sales;   -- deve dar ERRO de permissão
--   reset role;
-- -----------------------------------------------------------------------------
