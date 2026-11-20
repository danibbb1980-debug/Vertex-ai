-- Teste de segurança: tentativas REAIS com a conta de vendedor de teste.
-- Cada linha executa o SQL como o papel "authenticated" (ou "anon") com o
-- JWT do usuário, exatamente como o PostgREST do Supabase faz.
create schema tst;
create table tst.resultado (n serial, grupo text, teste text, esperado text, obtido text, ok boolean);
grant usage on schema tst to anon, authenticated;
grant insert, select on tst.resultado to anon, authenticated;
grant usage on sequence tst.resultado_n_seq to anon, authenticated;

-- tipo: 'nega'   = deve dar erro OU afetar/retornar 0 linhas
--       'permite' = deve funcionar e afetar/retornar >= 1 linha (controle positivo)
create function tst.tentar(grupo text, teste text, tipo text, cmd text) returns void
language plpgsql as $$
declare n bigint; msg text; is_select boolean := cmd ~* '^\s*select';
begin
  begin
    if is_select then
      execute 'select count(*) from (' || cmd || ') s' into n;
    else
      execute cmd;
      get diagnostics n = row_count;
    end if;
    msg := n || ' linha(s)';
  exception when others then
    n := -1; msg := 'erro: ' || sqlerrm;
  end;
  insert into tst.resultado (grupo, teste, esperado, obtido, ok) values (
    grupo, teste,
    case when tipo = 'nega' then 'bloqueado/vazio' else 'permitido' end,
    msg,
    case when tipo = 'nega' then n <= 0 else n >= 1 end);
end $$;
grant execute on function tst.tentar(text, text, text, text) to anon, authenticated;

-- ============ Como VENDEDOR A ============
set role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-000000000002","role":"authenticated"}', false);

-- controles positivos (provam que o teste não é vazio por acidente)
select tst.tentar('controle', 'A lê os próprios leads', 'permite', 'select * from public.leads');
select tst.tentar('controle', 'A registra ligação no próprio lead', 'permite', $q$insert into public.ligacoes (lead_id, resultado) values ('10000000-0000-0000-0000-00000000000a','recepcao')$q$);
select tst.tentar('controle', 'A edita observações do próprio lead', 'permite', $q$update public.leads set observacoes = 'teste' where id = '10000000-0000-0000-0000-00000000000a'$q$);
select tst.tentar('controle', 'A arquiva o próprio lead', 'permite', $q$update public.leads set arquivado_em = now() where id = '10000000-0000-0000-0000-00000000000a'$q$);
select tst.tentar('controle', 'A cria lead próprio', 'permite', $q$insert into public.leads (nome, segmento) values ('TESTE Lead Novo', 'outro')$q$);
select tst.tentar('controle', 'A registra resultado da reunião', 'permite', $q$update public.reunioes set resultado = 'pediu_tempo' where id = '20000000-0000-0000-0000-00000000000a'$q$);
select tst.tentar('controle', 'A lê a própria comissão', 'permite', 'select * from public.comissoes');
select tst.tentar('controle', 'A vê a própria venda em aberto', 'permite', $q$select * from public.vendas where id = '30000000-0000-0000-0000-00000000000c' and status = 'aguardando_aprovacao'$q$);
select tst.tentar('controle', 'A lê as configurações', 'permite', 'select * from public.configuracoes');

-- (a) linhas de outro vendedor
select tst.tentar('(a) outro vendedor', 'ler leads de B', 'nega', $q$select * from public.leads where vendedor_id <> auth.uid()$q$);
select tst.tentar('(a) outro vendedor', 'ler ligações de B', 'nega', $q$select * from public.ligacoes where vendedor_id <> auth.uid()$q$);
select tst.tentar('(a) outro vendedor', 'ler reuniões de B', 'nega', $q$select * from public.reunioes where vendedor_id <> auth.uid()$q$);
select tst.tentar('(a) outro vendedor', 'ler view reunioes_pacote de B', 'nega', $q$select * from public.reunioes_pacote where vendedor_id <> auth.uid()$q$);
select tst.tentar('(a) outro vendedor', 'ler vendas de B', 'nega', $q$select * from public.vendas where vendedor_id <> auth.uid()$q$);
select tst.tentar('(a) outro vendedor', 'ler comissões de B', 'nega', $q$select * from public.comissoes where vendedor_id <> auth.uid()$q$);
select tst.tentar('(a) outro vendedor', 'editar lead de B', 'nega', $q$update public.leads set nome = 'invadido' where id = '10000000-0000-0000-0000-00000000000b'$q$);
select tst.tentar('(a) outro vendedor', 'registrar ligação no lead de B', 'nega', $q$insert into public.ligacoes (lead_id, resultado) values ('10000000-0000-0000-0000-00000000000b','nao_atendeu')$q$);
select tst.tentar('(a) outro vendedor', 'criar reunião no lead de B', 'nega', $q$insert into public.reunioes (lead_id) values ('10000000-0000-0000-0000-00000000000b')$q$);
select tst.tentar('(a) outro vendedor', 'criar lead em nome de B', 'nega', $q$insert into public.leads (vendedor_id, nome, segmento) values ('00000000-0000-0000-0000-000000000003','x','outro')$q$);
select tst.tentar('(a) outro vendedor', 'passar o próprio lead para B', 'nega', $q$update public.leads set vendedor_id = '00000000-0000-0000-0000-000000000003' where id = '10000000-0000-0000-0000-00000000000a'$q$);

-- (b) campos exclusivos do admin
select tst.tentar('(b) campos do admin', 'alterar rascunho_status', 'nega', $q$update public.reunioes set rascunho_status = 'pronto' where id = '20000000-0000-0000-0000-00000000000a'$q$);
select tst.tentar('(b) campos do admin', 'alterar rascunho_link', 'nega', $q$update public.reunioes set rascunho_link = 'https://x' where id = '20000000-0000-0000-0000-00000000000a'$q$);
select tst.tentar('(b) campos do admin', 'criar reunião já com rascunho "pronto"', 'nega', $q$insert into public.reunioes (lead_id, rascunho_status) values ('10000000-0000-0000-0000-00000000000a','pronto')$q$);
select tst.tentar('(b) campos do admin', 'alterar valor_fechado', 'nega', $q$update public.vendas set valor_fechado = 1 where id = '30000000-0000-0000-0000-00000000000a'$q$);
select tst.tentar('(b) campos do admin', 'alterar data_pagamento', 'nega', $q$update public.vendas set data_pagamento = current_date - 1 where id = '30000000-0000-0000-0000-00000000000a'$q$);
select tst.tentar('(b) campos do admin', 'marcar venda como paga', 'nega', $q$update public.vendas set status = 'paga' where id = '30000000-0000-0000-0000-00000000000c'$q$);
select tst.tentar('(b) campos do admin', 'criar venda já paga', 'nega', $q$insert into public.vendas (lead_id, valor_combinado, status) values ('10000000-0000-0000-0000-00000000000a', 797, 'paga')$q$);
select tst.tentar('(b) campos do admin', 'criar venda abaixo do piso', 'nega', $q$insert into public.vendas (lead_id, valor_combinado) values ('10000000-0000-0000-0000-00000000000a', 100)$q$);

-- (c) comissões
select tst.tentar('(c) comissões', 'criar comissão', 'nega', $q$insert into public.comissoes (venda_id, vendedor_id, percentual, base_calculo) values ('30000000-0000-0000-0000-00000000000a', auth.uid(), 100, 9999)$q$);
select tst.tentar('(c) comissões', 'editar a própria comissão', 'nega', $q$update public.comissoes set percentual = 100, status = 'paga'$q$);
select tst.tentar('(c) comissões', 'apagar comissão', 'nega', $q$delete from public.comissoes$q$);
select tst.tentar('(c) comissões', 'chamar registrar_pagamento', 'nega', $q$select public.registrar_pagamento('30000000-0000-0000-0000-00000000000a', 9999, 9999, current_date, 100)$q$);
select tst.tentar('(c) comissões', 'mudar a configuração de comissão', 'nega', $q$update public.configuracoes set percentual_comissao = 90$q$);

-- (d) próprio papel / ativo
select tst.tentar('(d) próprio perfil', 'virar admin', 'nega', $q$update public.profiles set papel = 'admin' where user_id = auth.uid()$q$);
select tst.tentar('(d) próprio perfil', 'mudar ativo', 'nega', $q$update public.profiles set ativo = true where user_id = auth.uid()$q$);
select tst.tentar('(d) próprio perfil', 'criar outro perfil', 'nega', $q$insert into public.profiles (user_id, nome, papel, ativo) values (gen_random_uuid(), 'x', 'admin', true)$q$);

-- (e) perfis de outros
select tst.tentar('(e) perfis alheios', 'ler perfis de outros usuários', 'nega', $q$select * from public.profiles where user_id <> auth.uid()$q$);

-- apagar dados (soft delete é do admin)
select tst.tentar('soft delete', 'DELETE físico de lead', 'nega', $q$delete from public.leads$q$);
select tst.tentar('soft delete', 'marcar deleted_at no próprio lead', 'nega', $q$update public.leads set deleted_at = now() where id = '10000000-0000-0000-0000-00000000000a'$q$);
select tst.tentar('soft delete', 'DELETE físico de ligação', 'nega', $q$delete from public.ligacoes$q$);

-- ============ (f) SEM LOGIN (anon) ============
reset role;
select set_config('request.jwt.claims', '', false);
set role anon;
select tst.tentar('(f) sem login', 'ler leads', 'nega', 'select * from public.leads');
select tst.tentar('(f) sem login', 'ler ligações', 'nega', 'select * from public.ligacoes');
select tst.tentar('(f) sem login', 'ler reuniões (view)', 'nega', 'select * from public.reunioes_pacote');
select tst.tentar('(f) sem login', 'ler vendas', 'nega', 'select * from public.vendas');
select tst.tentar('(f) sem login', 'ler comissões', 'nega', 'select * from public.comissoes');
select tst.tentar('(f) sem login', 'ler perfis', 'nega', 'select * from public.profiles');
select tst.tentar('(f) sem login', 'ler configurações', 'nega', 'select * from public.configuracoes');
select tst.tentar('(f) sem login', 'criar lead', 'nega', $q$insert into public.leads (vendedor_id, nome, segmento) values ('00000000-0000-0000-0000-000000000002','x','outro')$q$);
select tst.tentar('(f) sem login', 'chamar registrar_pagamento', 'nega', $q$select public.registrar_pagamento('30000000-0000-0000-0000-00000000000a', 1, 1, current_date)$q$);

-- ============ (g) CONTA DESATIVADA ============
reset role;
update public.profiles set ativo = false where user_id = '00000000-0000-0000-0000-000000000004';
set role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-000000000004","role":"authenticated"}', false);
select tst.tentar('(g) conta desativada', 'ler os próprios leads', 'nega', 'select * from public.leads');
select tst.tentar('(g) conta desativada', 'ler o próprio perfil', 'nega', 'select * from public.profiles');
select tst.tentar('(g) conta desativada', 'ler configurações', 'nega', 'select * from public.configuracoes');
select tst.tentar('(g) conta desativada', 'criar lead', 'nega', $q$insert into public.leads (nome, segmento) values ('x','outro')$q$);
select tst.tentar('(g) conta desativada', 'editar o próprio lead', 'nega', $q$update public.leads set nome = 'x'$q$);
select tst.tentar('(g) conta desativada', 'reativar a si mesmo', 'nega', $q$update public.profiles set ativo = true where user_id = auth.uid()$q$);

-- ============ ADMIN (controles e regras de comissão) ============
reset role;
set role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-000000000001","role":"authenticated"}', false);
select tst.tentar('admin', 'admin lê leads de todos', 'permite', $q$select 1 from public.leads having count(distinct vendedor_id) >= 3$q$);
select tst.tentar('admin', 'admin altera rascunho_status', 'permite', $q$update public.reunioes set rascunho_status = 'em_producao', rascunho_link = 'https://rascunho.example' where id = '20000000-0000-0000-0000-00000000000a'$q$);
select tst.tentar('admin', 'comissão = 25% da base líquida (760 → 190,00)', 'permite', $q$select 1 from public.comissoes where venda_id = '30000000-0000-0000-0000-00000000000a' and valor = 190.00$q$);
select tst.tentar('admin', 'admin cancela a venda de B', 'permite', $q$update public.vendas set status = 'cancelada' where id = '30000000-0000-0000-0000-00000000000b'$q$);
select tst.tentar('admin', 'venda cancelada zera a comissão', 'permite', $q$select 1 from public.comissoes where venda_id = '30000000-0000-0000-0000-00000000000b' and valor = 0$q$);
select tst.tentar('admin', 'comissão de venda não paga é recusada', 'nega', $q$insert into public.comissoes (venda_id, vendedor_id, percentual, base_calculo) values ('30000000-0000-0000-0000-00000000000c', '00000000-0000-0000-0000-000000000002', 25, 700)$q$);
select tst.tentar('admin', 'admin marca comissão como paga', 'permite', $q$update public.comissoes set status = 'paga', data_pagamento = current_date where venda_id = '30000000-0000-0000-0000-00000000000a'$q$);
select tst.tentar('admin', 'último admin não se desativa', 'nega', $q$update public.profiles set ativo = false where user_id = auth.uid()$q$);

reset role;
\echo
\echo '==================== RESULTADO DO TESTE DE SEGURANÇA ===================='
select n, grupo, teste, esperado, obtido, case when ok then 'OK' else 'FALHOU' end as status
from tst.resultado order by n;
select count(*) filter (where ok) as ok, count(*) filter (where not ok) as falhas, count(*) as total from tst.resultado;
do $$ begin
  if exists (select 1 from tst.resultado where not ok) then
    raise exception 'TESTE DE SEGURANÇA FALHOU';
  end if;
end $$;
