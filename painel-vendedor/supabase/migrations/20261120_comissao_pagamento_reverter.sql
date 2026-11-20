-- =====================================================================
-- REVERTE a migração 20261120_comissao_pagamento.sql
-- Volta vendas/comissoes ao formato de supabase/schema.sql (v1).
-- ATENÇÃO, perde: a tabela auditoria_pagamentos, a coluna
-- vendas.valor_liquido_recebido (o líquido continua em
-- comissoes.base_calculo) e as colunas valor_repassado/cancelada_em.
-- Comissões em "estornar" voltam como "paga" (repasse feito).
-- =====================================================================

begin;

drop trigger if exists vendas_sincronizar_comissao on public.vendas;
drop trigger if exists vendas_auditoria on public.vendas;
drop trigger if exists comissoes_auditoria on public.comissoes;
drop trigger if exists configuracoes_auditoria on public.configuracoes;
drop function if exists app_private.sincronizar_comissao();
drop function if exists app_private.auditar();
drop table if exists public.auditoria_pagamentos;

-- funções da v1 (antes de remover privilegiado(), de que as novas dependem)
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

drop function if exists app_private.privilegiado();

-- comissoes
alter table public.comissoes disable trigger comissoes_guard;
update public.comissoes set status_repasse = 'paga' where status_repasse = 'estornar';
alter table public.comissoes enable trigger comissoes_guard;
alter table public.comissoes drop constraint if exists comissoes_status_repasse_check;
alter table public.comissoes rename column percentual_aplicado to percentual;
alter table public.comissoes rename column status_repasse to status;
alter table public.comissoes rename column data_repasse to data_pagamento;
alter table public.comissoes add constraint comissoes_status_check check (status in ('a_pagar', 'paga'));
alter table public.comissoes drop column if exists valor_repassado;
alter table public.comissoes drop column if exists cancelada_em;

-- vendas
alter table public.vendas drop constraint if exists vendas_status_check;
alter table public.vendas drop constraint if exists vendas_valor_liquido_check;
alter table public.vendas add constraint vendas_status_check
  check (status in ('aguardando_aprovacao', 'aguardando_pagamento', 'paga', 'cancelada'));
alter table public.vendas alter column status set default 'aguardando_aprovacao';
alter table public.vendas drop column if exists valor_liquido_recebido;

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

grant insert on public.comissoes to authenticated;
drop policy if exists comissoes_select on public.comissoes;
drop policy if exists comissoes_insert on public.comissoes;
create policy comissoes_select on public.comissoes for select to authenticated
  using (app_private.is_admin() or (app_private.is_active() and vendedor_id = auth.uid()));
create policy comissoes_insert on public.comissoes for insert to authenticated
  with check (app_private.is_admin());

commit;
