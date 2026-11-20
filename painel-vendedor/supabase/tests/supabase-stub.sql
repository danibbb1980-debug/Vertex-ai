-- Stub mínimo do ambiente Supabase, usado SOMENTE no teste local.
-- Reproduz os papéis anon/authenticated e auth.uid() como no Supabase
-- (auth.uid() lê o "sub" de request.jwt.claims).
do $$ begin
  if not exists (select 1 from pg_roles where rolname = 'anon') then create role anon nologin; end if;
  if not exists (select 1 from pg_roles where rolname = 'authenticated') then create role authenticated nologin; end if;
  if not exists (select 1 from pg_roles where rolname = 'service_role') then create role service_role nologin bypassrls; end if;
end $$;
create schema auth;
create table auth.users (
  id uuid primary key,
  email text,
  raw_user_meta_data jsonb default '{}'::jsonb
);
create function auth.uid() returns uuid language sql stable as $$
  select nullif(nullif(current_setting('request.jwt.claims', true), '')::json ->> 'sub', '')::uuid
$$;
grant usage on schema auth to anon, authenticated;
grant execute on function auth.uid() to anon, authenticated;
-- Como no Supabase: os papéis da API recebem privilégios amplos por padrão
-- no schema public; quem protege é o RLS + os revokes do schema.sql.
grant usage on schema public to anon, authenticated;
alter default privileges in schema public grant all on tables to anon, authenticated;
alter default privileges in schema public grant all on functions to anon, authenticated;
