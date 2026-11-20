-- =============================================================================
-- Lumivo Web · Painel · Migração: controle de follow-ups (enviado e atrasado)
-- Rode DEPOIS do supabase/schema.sql. Cole no SQL Editor do Supabase e clique
-- em "Run". Pode rodar de novo sem problema (idempotente) e não apaga nada.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Tabela de follow-ups (histórico: uma linha por follow-up)
-- O status NÃO é gravado: é calculado pelo app a partir das datas.
-- -----------------------------------------------------------------------------
create table if not exists public.followups (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references public.leads(id) on delete cascade,
  sale_id uuid references public.sales(id) on delete cascade,
  tipo text not null default 'followup_2du'
    check (tipo in ('followup_2du','retomada','pos_venda','outro')),
  canal text not null default 'whatsapp'
    check (canal in ('whatsapp','instagram','email','outro')),
  data_prevista date not null,
  enviado_em timestamptz,
  enviado_manual boolean not null default false,
  dispensado_em timestamptz,
  motivo_dispensa text,
  observacao text check (observacao is null or char_length(observacao) <= 500),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  -- lead obrigatório, exceto no pós-venda de uma venda (que usa sale_id)
  constraint followups_alvo check (lead_id is not null or sale_id is not null)
);

create index if not exists followups_lead_idx on public.followups (lead_id) where deleted_at is null;
create index if not exists followups_sale_idx on public.followups (sale_id) where deleted_at is null;
create index if not exists followups_abertos_idx on public.followups (data_prevista)
  where deleted_at is null and enviado_em is null and dispensado_em is null;
create index if not exists followups_enviados_idx on public.followups (enviado_em desc)
  where deleted_at is null and enviado_em is not null;

drop trigger if exists followups_touch on public.followups;
create trigger followups_touch before update on public.followups
  for each row execute function public.touch_updated_at();

-- -----------------------------------------------------------------------------
-- Segurança: igual às demais tabelas (só logado e com e-mail permitido;
-- sem DELETE, a exclusão é lógica por deleted_at)
-- -----------------------------------------------------------------------------
alter table public.followups enable row level security;

drop policy if exists followups_select on public.followups;
drop policy if exists followups_insert on public.followups;
drop policy if exists followups_update on public.followups;
create policy followups_select on public.followups for select to authenticated using (public.is_allowed());
create policy followups_insert on public.followups for insert to authenticated with check (public.is_allowed());
create policy followups_update on public.followups for update to authenticated
  using (public.is_allowed()) with check (public.is_allowed());

revoke all on public.followups from anon;
revoke delete, truncate on public.followups from authenticated;
grant select, insert, update on public.followups to authenticated;

-- -----------------------------------------------------------------------------
-- Configurações novas
-- -----------------------------------------------------------------------------
alter table public.settings add column if not exists followup_templates jsonb not null default '{}'::jsonb;
alter table public.settings add column if not exists followup_business_days integer not null default 2
  check (followup_business_days between 1 and 15);
alter table public.settings add column if not exists followup_retake_days integer not null default 60
  check (followup_retake_days between 1 and 365);

-- -----------------------------------------------------------------------------
-- Migração dos dados: cada lead com "próximo follow-up" preenchido ganha um
-- follow-up de 2 dias úteis em aberto naquela data (canal conforme a origem).
-- O campo antigo do lead continua lá, como espelho. Nada é apagado.
-- -----------------------------------------------------------------------------
insert into public.followups (lead_id, tipo, canal, data_prevista, enviado_manual, created_at, deleted_at)
select l.id,
       'followup_2du',
       case l.origin when 'whatsapp' then 'whatsapp' when 'instagram' then 'instagram' else 'outro' end,
       l.next_followup_at,
       false,
       l.updated_at,
       l.deleted_at
from public.leads l
where l.next_followup_at is not null
  and not exists (
    select 1 from public.followups f
    where f.lead_id = l.id and f.data_prevista = l.next_followup_at
  );
