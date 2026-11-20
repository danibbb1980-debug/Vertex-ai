-- =====================================================================
-- REVERTE 20261120_excluir_lead.sql: volta as guardas da v1 (só o admin
-- exclui) e remove a cascata. Leads, reuniões e ligações já excluídos
-- continuam excluídos.
-- =====================================================================

begin;

drop trigger if exists leads_excluir_filhos on public.leads;
drop function if exists app_private.excluir_filhos_do_lead();
drop function if exists public.excluir_lead(uuid);

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

commit;
