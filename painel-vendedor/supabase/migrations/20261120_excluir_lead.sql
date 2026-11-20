-- =====================================================================
-- Lumivo Web · Painel do Vendedor
-- Migração 2026-11-20 (2): excluir lead (admin e vendedor)
--
-- Aplica-se DEPOIS de 20261120_comissao_pagamento.sql.
-- Para desfazer: 20261120_excluir_lead_reverter.sql
--
-- Exclusão continua sendo lógica (deleted_at): o lead some das telas e
-- fica no banco (e na exportação CSV do admin).
--  * Função public.excluir_lead(id): o vendedor exclui os PRÓPRIOS leads,
--    desde que o lead não tenha venda em aberto ou paga (venda é registro
--    financeiro: só o admin exclui lead com venda). O admin exclui qualquer um.
--  * Excluir um lead exclui junto as reuniões e ligações dele, para não
--    sobrar reunião "órfã" na agenda e na fila de rascunhos.
--  * Ninguém restaura pelo app (o admin restaura pelo SQL, se precisar).
-- =====================================================================

begin;

-- Leads: a exclusão é feita pela função excluir_lead() (abaixo), que
-- confere dono, conta ativa e venda. Direto na tabela, só o admin.
create or replace function app_private.guard_leads()
returns trigger language plpgsql
set search_path = ''
as $$
begin
  if app_private.privilegiado() then
    return new;
  end if;
  if tg_op = 'INSERT' then
    new.deleted_at := null;
    return new;
  end if;
  if new.deleted_at is distinct from old.deleted_at then
    raise exception 'Use "Excluir lead" no app.' using errcode = '42501';
  end if;
  if new.vendedor_id is distinct from old.vendedor_id then
    raise exception 'O dono do lead não pode ser alterado.' using errcode = '42501';
  end if;
  return new;
end;
$$;

-- Excluir lead (soft delete). Admin: qualquer lead. Vendedor ativo: só
-- os próprios e sem venda em aberto ou paga.
create or replace function public.excluir_lead(p_lead_id uuid)
returns void
language plpgsql security definer
set search_path = ''
as $$
declare
  dono uuid;
begin
  select l.vendedor_id into dono from public.leads l where l.id = p_lead_id and l.deleted_at is null;
  if not found then
    raise exception 'Lead não encontrado.' using errcode = '23503';
  end if;
  if not app_private.is_admin() then
    if not app_private.is_active() or dono is distinct from auth.uid() then
      raise exception 'Lead não encontrado.' using errcode = '23503';
    end if;
    if exists (
      select 1 from public.vendas v
       where v.lead_id = p_lead_id and v.deleted_at is null and v.status <> 'cancelada'
    ) then
      raise exception 'Este lead tem venda registrada. Peça ao Pedro para excluir.' using errcode = '42501';
    end if;
  end if;
  update public.leads set deleted_at = now() where id = p_lead_id;
end;
$$;
revoke all on function public.excluir_lead(uuid) from public, anon;
grant execute on function public.excluir_lead(uuid) to authenticated;

-- Reuniões e ligações: a exclusão em cascata (abaixo) roda como código
-- confiável do banco, por isso as guardas passam a usar privilegiado().
-- Pela API o vendedor continua sem poder excluí-las diretamente.
create or replace function app_private.guard_reunioes()
returns trigger language plpgsql
set search_path = ''
as $$
begin
  if app_private.privilegiado() then
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

create or replace function app_private.guard_ligacoes()
returns trigger language plpgsql
set search_path = ''
as $$
begin
  if app_private.privilegiado() then
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

-- Cascata: lead excluído leva junto reuniões e ligações (vendas ficam:
-- são do financeiro; o admin exclui venda em Admin > Vendas).
create or replace function app_private.excluir_filhos_do_lead()
returns trigger language plpgsql security definer
set search_path = ''
as $$
begin
  if new.deleted_at is not null and old.deleted_at is null then
    update public.reunioes set deleted_at = new.deleted_at where lead_id = new.id and deleted_at is null;
    update public.ligacoes set deleted_at = new.deleted_at where lead_id = new.id and deleted_at is null;
  end if;
  return null;
end;
$$;

drop trigger if exists leads_excluir_filhos on public.leads;
create trigger leads_excluir_filhos
  after update of deleted_at on public.leads
  for each row execute function app_private.excluir_filhos_do_lead();

commit;
