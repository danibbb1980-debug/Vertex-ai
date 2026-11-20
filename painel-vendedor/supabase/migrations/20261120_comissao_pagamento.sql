-- =====================================================================
-- Lumivo Web · Painel do Vendedor
-- Migração 2026-11-20: pagamento da venda e comissão do vendedor
--
-- Aplica-se SOBRE o banco criado por supabase/schema.sql, sem perder dados.
-- Cole o arquivo inteiro no SQL Editor do Supabase e execute uma vez.
-- Para desfazer: 20261120_comissao_pagamento_reverter.sql
--
-- O que muda
--  * vendas: status do pagamento do cliente vira só
--      aguardando_pagamento | paga | cancelada   (aguardando_aprovacao é
--    absorvido por aguardando_pagamento); novo campo valor_liquido_recebido.
--    Só o admin escreve status, valor_fechado, valor_liquido_recebido,
--    data_pagamento e deleted_at.
--  * comissoes: percentual -> percentual_aplicado, status -> status_repasse
--    (a_pagar | paga | estornar), data_pagamento -> data_repasse; novos
--    valor_repassado e cancelada_em. A comissão é criada, recalculada ou
--    cancelada por TRIGGER quando o status da venda muda (idempotente).
--  * auditoria_pagamentos: quem mudou o quê e quando; só o admin lê.
--  * a RPC registrar_pagamento deixa de existir (o trigger faz o trabalho).
-- =====================================================================

begin;

-- ---------------------------------------------------------------------
-- 0. Quem pode escrever campos de admin: o admin pela API, ou código
--    confiável do próprio banco (SQL Editor, funções security definer).
--    Pela API o papel é sempre "authenticated" ou "anon".
-- ---------------------------------------------------------------------
create or replace function app_private.privilegiado()
returns boolean
language sql stable
set search_path = ''
as $$
  select app_private.is_admin() or current_user not in ('authenticated', 'anon');
$$;
revoke all on function app_private.privilegiado() from public;
grant execute on function app_private.privilegiado() to authenticated;

-- ---------------------------------------------------------------------
-- 1. Saem as peças antigas de pagamento
-- ---------------------------------------------------------------------
drop trigger if exists vendas_after on public.vendas;
drop function if exists app_private.after_venda();
drop function if exists public.registrar_pagamento(uuid, numeric, numeric, date, numeric);
drop policy if exists comissoes_insert on public.comissoes;

-- ---------------------------------------------------------------------
-- 2. vendas
-- ---------------------------------------------------------------------
do $$
declare r record;
begin
  for r in
    select conname from pg_constraint
     where conrelid = 'public.vendas'::regclass and contype = 'c'
       and pg_get_constraintdef(oid) ilike '%status%'
  loop
    execute format('alter table public.vendas drop constraint %I', r.conname);
  end loop;
end $$;

alter table public.vendas disable trigger vendas_guard;
update public.vendas set status = 'aguardando_pagamento' where status = 'aguardando_aprovacao';
alter table public.vendas enable trigger vendas_guard;

alter table public.vendas alter column status set default 'aguardando_pagamento';
alter table public.vendas add constraint vendas_status_check
  check (status in ('aguardando_pagamento', 'paga', 'cancelada'));
alter table public.vendas add column if not exists valor_liquido_recebido numeric(10,2);
alter table public.vendas drop constraint if exists vendas_valor_liquido_check;
alter table public.vendas add constraint vendas_valor_liquido_check
  check (valor_liquido_recebido is null or valor_liquido_recebido >= 0);

-- ---------------------------------------------------------------------
-- 3. comissoes
-- ---------------------------------------------------------------------
do $$
begin
  if exists (select 1 from information_schema.columns
              where table_schema = 'public' and table_name = 'comissoes' and column_name = 'percentual') then
    alter table public.comissoes rename column percentual to percentual_aplicado;
  end if;
  if exists (select 1 from information_schema.columns
              where table_schema = 'public' and table_name = 'comissoes' and column_name = 'status') then
    alter table public.comissoes rename column status to status_repasse;
  end if;
  if exists (select 1 from information_schema.columns
              where table_schema = 'public' and table_name = 'comissoes' and column_name = 'data_pagamento') then
    alter table public.comissoes rename column data_pagamento to data_repasse;
  end if;
end $$;

do $$
declare r record;
begin
  for r in
    select conname from pg_constraint
     where conrelid = 'public.comissoes'::regclass and contype = 'c'
       and pg_get_constraintdef(oid) ilike '%status_repasse%'
  loop
    execute format('alter table public.comissoes drop constraint %I', r.conname);
  end loop;
end $$;

alter table public.comissoes add constraint comissoes_status_repasse_check
  check (status_repasse in ('a_pagar', 'paga', 'estornar'));
alter table public.comissoes add column if not exists valor_repassado numeric(10,2);
alter table public.comissoes add column if not exists cancelada_em timestamptz;

-- comissões antigas: o que já foi repassado guarda o valor repassado;
-- comissão de venda cancelada fica cancelada (com data).
update public.comissoes
   set valor_repassado = valor
 where status_repasse = 'paga' and valor_repassado is null;
update public.comissoes
   set cancelada_em = coalesce(cancelada_em, updated_at)
 where cancelada and cancelada_em is null;

-- ---------------------------------------------------------------------
-- 4. Guarda de vendas: campos de pagamento são só do admin
-- ---------------------------------------------------------------------
create or replace function app_private.guard_vendas()
returns trigger language plpgsql
set search_path = ''
as $$
declare
  piso numeric;
begin
  if app_private.privilegiado() then
    -- fora de "paga" não há dinheiro recebido: limpa data e líquido
    -- (o valor anterior fica registrado na auditoria)
    if new.status <> 'paga' then
      new.data_pagamento := null;
      new.valor_liquido_recebido := null;
    elsif new.data_pagamento is null then
      raise exception 'Informe a data em que o dinheiro caiu.' using errcode = '23514';
    end if;
    return new;
  end if;

  select c.preco_piso into piso from public.configuracoes c where c.id = 1;

  if tg_op = 'INSERT' then
    if new.status is distinct from 'aguardando_pagamento'
       or new.valor_fechado is not null
       or new.valor_liquido_recebido is not null
       or new.data_pagamento is not null then
      raise exception 'Somente o admin altera o pagamento da venda.' using errcode = '42501';
    end if;
    if new.valor_combinado < coalesce(piso, 0) then
      raise exception 'Valor abaixo do piso. Fale com o Pedro.' using errcode = '23514';
    end if;
    new.deleted_at := null;
    return new;
  end if;

  if new.status is distinct from old.status
     or new.valor_fechado is distinct from old.valor_fechado
     or new.valor_liquido_recebido is distinct from old.valor_liquido_recebido
     or new.data_pagamento is distinct from old.data_pagamento then
    raise exception 'Somente o admin altera o pagamento da venda.' using errcode = '42501';
  end if;
  if new.deleted_at is distinct from old.deleted_at then
    raise exception 'Somente o admin pode excluir uma venda.' using errcode = '42501';
  end if;
  if new.valor_combinado is distinct from old.valor_combinado then
    if old.status <> 'aguardando_pagamento' then
      raise exception 'Venda encerrada não pode ser alterada.' using errcode = '42501';
    end if;
    if new.valor_combinado < coalesce(piso, 0) then
      raise exception 'Valor abaixo do piso. Fale com o Pedro.' using errcode = '23514';
    end if;
  end if;
  return new;
end;
$$;

-- ---------------------------------------------------------------------
-- 5. Guarda de comissões: integridade do repasse
-- ---------------------------------------------------------------------
create or replace function app_private.guard_comissoes()
returns trigger language plpgsql
set search_path = ''
as $$
declare
  v record;
begin
  if not app_private.privilegiado() then
    raise exception 'Somente o admin altera comissões.' using errcode = '42501';
  end if;

  if tg_op = 'INSERT' then
    select vd.status, vd.vendedor_id into v from public.vendas vd where vd.id = new.venda_id;
    if not found then
      raise exception 'Venda não encontrada.' using errcode = '23503';
    end if;
    if v.status <> 'paga' then
      raise exception 'A comissão só nasce depois que a venda é marcada como paga.' using errcode = '23514';
    end if;
    new.vendedor_id := v.vendedor_id;
    return new;
  end if;

  if new.venda_id is distinct from old.venda_id or new.vendedor_id is distinct from old.vendedor_id then
    raise exception 'A venda e o vendedor de uma comissão não podem ser trocados.' using errcode = '42501';
  end if;

  if new.status_repasse = 'paga' and old.status_repasse is distinct from 'paga' then
    if new.cancelada then
      raise exception 'Comissão cancelada não pode ser repassada.' using errcode = '23514';
    end if;
    if new.data_repasse is null then
      raise exception 'Informe a data do repasse.' using errcode = '23514';
    end if;
    new.valor_repassado := round(new.base_calculo * new.percentual_aplicado / 100, 2);
  elsif new.status_repasse = 'a_pagar' and old.status_repasse = 'paga' then
    -- repasse desfeito pelo admin
    new.data_repasse := null;
    new.valor_repassado := null;
  end if;
  return new;
end;
$$;

-- ---------------------------------------------------------------------
-- 6. O coração: status da venda -> comissão (idempotente)
--   paga                 -> cria a comissão com o percentual vigente
--                           (gravado nela) sobre o líquido, ou recalcula
--                           a base se ela já existe; marcar "paga" de novo
--                           não duplica (venda_id é único).
--   aguardando/cancelada -> cancela a comissão (valor 0, histórico
--   ou venda excluída       mantido); repasse já pago vira "estornar".
-- ---------------------------------------------------------------------
create or replace function app_private.sincronizar_comissao()
returns trigger language plpgsql security definer
set search_path = ''
as $$
declare
  c public.comissoes;
  existe boolean;
  pct numeric;
  base numeric;
begin
  select * into c from public.comissoes where venda_id = new.id for update;
  existe := found;

  if new.status = 'paga' and new.deleted_at is null then
    base := coalesce(new.valor_liquido_recebido, new.valor_fechado, new.valor_combinado);
    if not existe then
      select cf.percentual_comissao into pct from public.configuracoes cf where cf.id = 1;
      insert into public.comissoes (venda_id, vendedor_id, percentual_aplicado, base_calculo)
      values (new.id, new.vendedor_id, coalesce(pct, 25), base);
    elsif c.cancelada or c.base_calculo is distinct from base or c.status_repasse = 'estornar' then
      -- pago de novo depois de desfeito: reativa mantendo o percentual
      -- gravado na primeira vez; se o repasse estava para estornar, o
      -- vendedor fica com o que já recebeu.
      update public.comissoes
         set base_calculo   = base,
             cancelada      = false,
             cancelada_em   = null,
             status_repasse = case when c.status_repasse = 'estornar' then 'paga' else c.status_repasse end
       where id = c.id;
    end if;
  elsif existe and not c.cancelada then
    update public.comissoes
       set cancelada      = true,
           cancelada_em   = now(),
           status_repasse = case when c.status_repasse = 'paga' then 'estornar' else c.status_repasse end
     where id = c.id;
  end if;
  return null;
end;
$$;

drop trigger if exists vendas_sincronizar_comissao on public.vendas;
create trigger vendas_sincronizar_comissao
  after insert or update of status, valor_liquido_recebido, valor_fechado, valor_combinado, deleted_at
  on public.vendas
  for each row execute function app_private.sincronizar_comissao();

-- ---------------------------------------------------------------------
-- 7. Auditoria
-- ---------------------------------------------------------------------
create table if not exists public.auditoria_pagamentos (
  id             bigint generated always as identity primary key,
  criado_em      timestamptz not null default now(),
  autor_id       uuid,
  tabela         text not null,
  registro_id    text,
  venda_id       uuid,
  campo          text not null,
  valor_anterior text,
  valor_novo     text
);
create index if not exists auditoria_pagamentos_venda_idx on public.auditoria_pagamentos (venda_id, criado_em);
create index if not exists auditoria_pagamentos_data_idx on public.auditoria_pagamentos (criado_em desc);

-- Registra uma linha por campo alterado. Os campos vêm em TG_ARGV.
create or replace function app_private.auditar()
returns trigger language plpgsql security definer
set search_path = ''
as $$
declare
  antes jsonb := case when tg_op = 'INSERT' then '{}'::jsonb else to_jsonb(old) end;
  depois jsonb := to_jsonb(new);
  campo text;
  venda uuid;
begin
  venda := case tg_table_name
             when 'vendas' then (depois ->> 'id')::uuid
             when 'comissoes' then (depois ->> 'venda_id')::uuid
             else null
           end;
  foreach campo in array tg_argv loop
    if (antes ->> campo) is distinct from (depois ->> campo) then
      insert into public.auditoria_pagamentos (autor_id, tabela, registro_id, venda_id, campo, valor_anterior, valor_novo)
      values (auth.uid(), tg_table_name, depois ->> 'id', venda, campo, antes ->> campo, depois ->> campo);
    end if;
  end loop;
  return null;
end;
$$;

drop trigger if exists vendas_auditoria on public.vendas;
create trigger vendas_auditoria
  after insert or update on public.vendas
  for each row execute function app_private.auditar(
    'status', 'valor_fechado', 'valor_liquido_recebido', 'data_pagamento', 'deleted_at');

drop trigger if exists comissoes_auditoria on public.comissoes;
create trigger comissoes_auditoria
  after insert or update on public.comissoes
  for each row execute function app_private.auditar(
    'percentual_aplicado', 'base_calculo', 'cancelada', 'status_repasse', 'data_repasse');

drop trigger if exists configuracoes_auditoria on public.configuracoes;
create trigger configuracoes_auditoria
  after update on public.configuracoes
  for each row execute function app_private.auditar('percentual_comissao');

-- ---------------------------------------------------------------------
-- 8. RLS e privilégios
-- ---------------------------------------------------------------------
alter table public.auditoria_pagamentos enable row level security;
revoke all on public.auditoria_pagamentos from anon, authenticated;
grant select on public.auditoria_pagamentos to authenticated;
drop policy if exists auditoria_select on public.auditoria_pagamentos;
create policy auditoria_select on public.auditoria_pagamentos for select to authenticated
  using (app_private.is_admin());

-- Comissões: só o trigger cria; o admin atualiza o repasse; ninguém apaga.
revoke insert, delete on public.comissoes from authenticated;
-- Vendedor vê só as próprias comissões vivas (venda paga) ou as que
-- precisam ser estornadas. Comissão cancelada sem repasse some para ele.
drop policy if exists comissoes_select on public.comissoes;
create policy comissoes_select on public.comissoes for select to authenticated
  using (
    app_private.is_admin()
    or (app_private.is_active() and vendedor_id = auth.uid()
        and (not cancelada or status_repasse = 'estornar'))
  );

commit;
