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
select tst.tentar('controle', 'A vê a própria venda em aberto', 'permite', $q$select * from public.vendas where id = '30000000-0000-0000-0000-00000000000c' and status = 'aguardando_pagamento'$q$);
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
select tst.tentar('(c) comissões', 'criar comissão', 'nega', $q$insert into public.comissoes (venda_id, vendedor_id, percentual_aplicado, base_calculo) values ('30000000-0000-0000-0000-00000000000a', auth.uid(), 100, 9999)$q$);
select tst.tentar('(c) comissões', 'editar a própria comissão', 'nega', $q$update public.comissoes set percentual_aplicado = 100, status_repasse = 'paga', data_repasse = current_date$q$);
select tst.tentar('(c) comissões', 'apagar comissão', 'nega', $q$delete from public.comissoes$q$);
select tst.tentar('(c) comissões', 'mudar a configuração de comissão', 'nega', $q$update public.configuracoes set percentual_comissao = 90$q$);

-- (d) próprio papel / ativo
select tst.tentar('(d) próprio perfil', 'virar admin', 'nega', $q$update public.profiles set papel = 'admin' where user_id = auth.uid()$q$);
select tst.tentar('(d) próprio perfil', 'mudar ativo', 'nega', $q$update public.profiles set ativo = true where user_id = auth.uid()$q$);
select tst.tentar('(d) próprio perfil', 'criar outro perfil', 'nega', $q$insert into public.profiles (user_id, nome, papel, ativo) values (gen_random_uuid(), 'x', 'admin', true)$q$);

-- (e) perfis de outros
select tst.tentar('(e) perfis alheios', 'ler perfis de outros usuários', 'nega', $q$select * from public.profiles where user_id <> auth.uid()$q$);

-- apagar dados (soft delete é do admin)
select tst.tentar('soft delete', 'DELETE físico de lead', 'nega', $q$delete from public.leads$q$);
select tst.tentar('soft delete', 'excluir o próprio lead que tem venda', 'nega', $q$select public.excluir_lead('10000000-0000-0000-0000-00000000000a')$q$);
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
select tst.tentar('(f) sem login', 'ler auditoria', 'nega', 'select * from public.auditoria_pagamentos');

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
select tst.tentar('admin', 'admin não cria comissão à mão (só o trigger)', 'nega', $q$insert into public.comissoes (venda_id, vendedor_id, percentual_aplicado, base_calculo) values ('30000000-0000-0000-0000-00000000000c', '00000000-0000-0000-0000-000000000002', 25, 700)$q$);
select tst.tentar('admin', 'admin marca comissão como paga', 'permite', $q$update public.comissoes set status_repasse = 'paga', data_repasse = current_date where venda_id = '30000000-0000-0000-0000-00000000000a'$q$);
select tst.tentar('admin', 'último admin não se desativa', 'nega', $q$update public.profiles set ativo = false where user_id = auth.uid()$q$);


-- =====================================================================
-- PAGAMENTO DA VENDA E COMISSÃO (migração 20261120)
-- Vendas novas do vendedor A (lead a). Tudo com dados FALSOS.
-- =====================================================================
reset role;
set role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-000000000002","role":"authenticated"}', false);
select tst.tentar('pagamento', 'vendedor registra venda (aguardando pagamento)', 'permite', $q$insert into public.vendas (id, lead_id, valor_combinado) values ('40000000-0000-0000-0000-00000000000d', '10000000-0000-0000-0000-00000000000a', 797), ('40000000-0000-0000-0000-00000000000e', '10000000-0000-0000-0000-00000000000a', 797), ('40000000-0000-0000-0000-00000000000f', '10000000-0000-0000-0000-00000000000a', 797)$q$);
select tst.tentar('pagamento', 'venda nova nasce aguardando pagamento', 'permite', $q$select 1 from public.vendas where id = '40000000-0000-0000-0000-00000000000d' and status = 'aguardando_pagamento'$q$);
-- (a) status do pagamento
select tst.tentar('(a) status do pagamento', 'vendedor marca a própria venda como paga', 'nega', $q$update public.vendas set status = 'paga', data_pagamento = current_date where id = '40000000-0000-0000-0000-00000000000d'$q$);
select tst.tentar('(a) status do pagamento', 'vendedor cancela a própria venda', 'nega', $q$update public.vendas set status = 'cancelada' where id = '40000000-0000-0000-0000-00000000000d'$q$);
select tst.tentar('(a) status do pagamento', 'vendedor informa valor líquido', 'nega', $q$update public.vendas set valor_liquido_recebido = 700 where id = '40000000-0000-0000-0000-00000000000d'$q$);
select tst.tentar('(a) status do pagamento', 'vendedor cria venda já paga', 'nega', $q$insert into public.vendas (lead_id, valor_combinado, status, data_pagamento) values ('10000000-0000-0000-0000-00000000000a', 797, 'paga', current_date)$q$);
-- (c) aguardando pagamento: nada de comissão
select tst.tentar('(c) comissão de venda aguardando', 'ver comissão de venda aguardando', 'nega', $q$select * from public.comissoes where venda_id = '40000000-0000-0000-0000-00000000000d'$q$);

-- ---------- admin marca como paga ----------
reset role;
set role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-000000000001","role":"authenticated"}', false);
select tst.tentar('regra', 'aguardando pagamento não tem comissão', 'nega', $q$select * from public.comissoes where venda_id = '40000000-0000-0000-0000-00000000000d'$q$);
select tst.tentar('regra', 'marcar "paga" exige a data do dinheiro', 'nega', $q$update public.vendas set status = 'paga' where id = '40000000-0000-0000-0000-00000000000d'$q$);
select tst.tentar('regra', 'admin marca D como paga, líquido em branco', 'permite', $q$update public.vendas set status = 'paga', data_pagamento = current_date, valor_fechado = 797 where id = '40000000-0000-0000-0000-00000000000d'$q$);
select tst.tentar('regra', 'líquido em branco usa o fechado: 25% de 797 = 199,25', 'permite', $q$select 1 from public.comissoes where venda_id = '40000000-0000-0000-0000-00000000000d' and percentual_aplicado = 25 and base_calculo = 797 and valor = 199.25 and status_repasse = 'a_pagar' and not cancelada$q$);
select tst.tentar('regra', 'marcar "paga" de novo', 'permite', $q$update public.vendas set status = 'paga', data_pagamento = current_date where id = '40000000-0000-0000-0000-00000000000d'$q$);
select tst.tentar('regra', 'marcar duas vezes não duplica', 'permite', $q$select 1 from public.comissoes where venda_id = '40000000-0000-0000-0000-00000000000d' having count(*) = 1$q$);
select tst.tentar('regra', 'admin marca E como paga com líquido 770,00', 'permite', $q$update public.vendas set status = 'paga', data_pagamento = current_date, valor_fechado = 797, valor_liquido_recebido = 770 where id = '40000000-0000-0000-0000-00000000000e'$q$);
select tst.tentar('regra', 'líquido 770,00 a 25% = 192,50', 'permite', $q$select 1 from public.comissoes where venda_id = '40000000-0000-0000-0000-00000000000e' and base_calculo = 770 and valor = 192.50$q$);
select tst.tentar('regra', 'admin muda o percentual para 30%', 'permite', $q$update public.configuracoes set percentual_comissao = 30$q$);
select tst.tentar('regra', 'percentual novo não altera comissão antiga', 'permite', $q$select 1 from public.comissoes where venda_id in ('40000000-0000-0000-0000-00000000000d','40000000-0000-0000-0000-00000000000e') having count(*) = 2 and bool_and(percentual_aplicado = 25)$q$);
select tst.tentar('regra', 'venda F paga depois usa 30% gravado', 'permite', $q$update public.vendas set status = 'paga', data_pagamento = current_date, valor_fechado = 797 where id = '40000000-0000-0000-0000-00000000000f'$q$);
select tst.tentar('regra', 'F: 30% de 797 = 239,10', 'permite', $q$select 1 from public.comissoes where venda_id = '40000000-0000-0000-0000-00000000000f' and percentual_aplicado = 30 and valor = 239.10$q$);
select tst.tentar('regra', 'repasse exige data', 'nega', $q$update public.comissoes set status_repasse = 'paga' where venda_id = '40000000-0000-0000-0000-00000000000e'$q$);
select tst.tentar('regra', 'admin marca repasse de E como pago', 'permite', $q$update public.comissoes set status_repasse = 'paga', data_repasse = current_date where venda_id = '40000000-0000-0000-0000-00000000000e'$q$);
select tst.tentar('regra', 'repasse grava o valor repassado', 'permite', $q$select 1 from public.comissoes where venda_id = '40000000-0000-0000-0000-00000000000e' and valor_repassado = 192.50$q$);
select tst.tentar('regra', 'admin desfaz o pagamento de D (volta a aguardando)', 'permite', $q$update public.vendas set status = 'aguardando_pagamento' where id = '40000000-0000-0000-0000-00000000000d'$q$);
select tst.tentar('regra', 'desfazer cancela a comissão (valor 0, histórico mantido)', 'permite', $q$select 1 from public.comissoes where venda_id = '40000000-0000-0000-0000-00000000000d' and cancelada and valor = 0 and cancelada_em is not null and base_calculo = 797$q$);
select tst.tentar('regra', 'desfazer limpa data e líquido da venda', 'permite', $q$select 1 from public.vendas where id = '40000000-0000-0000-0000-00000000000d' and data_pagamento is null and valor_liquido_recebido is null$q$);
select tst.tentar('regra', 'comissão cancelada não pode ser repassada', 'nega', $q$update public.comissoes set status_repasse = 'paga', data_repasse = current_date where venda_id = '40000000-0000-0000-0000-00000000000d'$q$);
select tst.tentar('regra', 'admin cancela E (repasse já pago)', 'permite', $q$update public.vendas set status = 'cancelada' where id = '40000000-0000-0000-0000-00000000000e'$q$);
select tst.tentar('regra', 'repasse já pago vira "estornar"', 'permite', $q$select 1 from public.comissoes where venda_id = '40000000-0000-0000-0000-00000000000e' and cancelada and valor = 0 and status_repasse = 'estornar' and valor_repassado = 192.50$q$);
select tst.tentar('regra', 'D paga de novo (com config em 30%)', 'permite', $q$update public.vendas set status = 'paga', data_pagamento = current_date where id = '40000000-0000-0000-0000-00000000000d'$q$);
select tst.tentar('regra', 'reativada mantém o percentual gravado (25%)', 'permite', $q$select 1 from public.comissoes where venda_id = '40000000-0000-0000-0000-00000000000d' and not cancelada and percentual_aplicado = 25 and valor = 199.25$q$);
select tst.tentar('regra', 'ainda uma comissão por venda', 'permite', $q$select 1 from public.comissoes where venda_id = '40000000-0000-0000-0000-00000000000d' having count(*) = 1$q$);
select tst.tentar('regra', 'admin volta o percentual para 25%', 'permite', $q$update public.configuracoes set percentual_comissao = 25$q$);
select tst.tentar('auditoria', 'auditoria registra status com autor', 'permite', $q$select 1 from public.auditoria_pagamentos where venda_id = '40000000-0000-0000-0000-00000000000d' and campo = 'status' and valor_novo = 'paga' and autor_id = '00000000-0000-0000-0000-000000000001'$q$);
select tst.tentar('auditoria', 'auditoria registra líquido, repasse e percentual', 'permite', $q$select 1 from public.auditoria_pagamentos having count(*) filter (where campo = 'valor_liquido_recebido') > 0 and count(*) filter (where campo = 'status_repasse') > 0 and count(*) filter (where campo = 'percentual_comissao') > 0$q$);
select tst.tentar('regra', 'admin desfaz o pagamento de F (nunca repassada)', 'permite', $q$update public.vendas set status = 'aguardando_pagamento' where id = '40000000-0000-0000-0000-00000000000f'$q$);
-- vendedor B com venda paga, para o teste (d)
select tst.tentar('pagamento', 'admin registra e paga venda do vendedor B', 'permite', $q$insert into public.vendas (id, lead_id, valor_combinado, valor_fechado, status, data_pagamento) values ('40000000-0000-0000-0000-0000000000b1', '10000000-0000-0000-0000-00000000000b', 797, 797, 'paga', current_date)$q$);

-- ---------- de volta ao vendedor A ----------
reset role;
set role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-000000000002","role":"authenticated"}', false);
select tst.tentar('(c) comissão de venda aguardando', 'ver comissão cancelada de F (voltou a aguardando)', 'nega', $q$select * from public.comissoes where venda_id = '40000000-0000-0000-0000-00000000000f'$q$);
select tst.tentar('(c) comissão de venda aguardando', 'ver líquido/data de F na venda', 'nega', $q$select * from public.vendas where id = '40000000-0000-0000-0000-00000000000f' and (valor_liquido_recebido is not null or data_pagamento is not null)$q$);
select tst.tentar('controle', 'A ainda vê a venda F (sem valores de pagamento)', 'permite', $q$select 1 from public.vendas where id = '40000000-0000-0000-0000-00000000000f' and status = 'aguardando_pagamento'$q$);
reset role;
set role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-000000000002","role":"authenticated"}', false);
select tst.tentar('controle', 'A vê a comissão da venda paga D', 'permite', $q$select 1 from public.comissoes where venda_id = '40000000-0000-0000-0000-00000000000d' and valor = 199.25$q$);
select tst.tentar('controle', 'A vê o estorno pendente de E', 'permite', $q$select 1 from public.comissoes where venda_id = '40000000-0000-0000-0000-00000000000e' and status_repasse = 'estornar'$q$);
select tst.tentar('(b) comissões', 'criar comissão para venda paga', 'nega', $q$insert into public.comissoes (venda_id, vendedor_id, percentual_aplicado, base_calculo) values ('40000000-0000-0000-0000-00000000000f', auth.uid(), 100, 9999)$q$);
select tst.tentar('(b) comissões', 'editar valor/percentual da própria comissão', 'nega', $q$update public.comissoes set percentual_aplicado = 100, base_calculo = 9999 where venda_id = '40000000-0000-0000-0000-00000000000d'$q$);
select tst.tentar('(b) comissões', 'marcar o próprio repasse como pago', 'nega', $q$update public.comissoes set status_repasse = 'paga', data_repasse = current_date where venda_id = '40000000-0000-0000-0000-00000000000d'$q$);
select tst.tentar('(b) comissões', 'cancelar o próprio estorno', 'nega', $q$update public.comissoes set status_repasse = 'a_pagar' where venda_id = '40000000-0000-0000-0000-00000000000e'$q$);
select tst.tentar('(b) comissões', 'apagar comissão', 'nega', $q$delete from public.comissoes where venda_id = '40000000-0000-0000-0000-00000000000d'$q$);
select tst.tentar('(d) outro vendedor', 'ler comissão paga do vendedor B', 'nega', $q$select * from public.comissoes where venda_id = '40000000-0000-0000-0000-0000000000b1'$q$);
select tst.tentar('(d) outro vendedor', 'ler venda paga do vendedor B', 'nega', $q$select * from public.vendas where id = '40000000-0000-0000-0000-0000000000b1'$q$);
select tst.tentar('(e) auditoria', 'ler a tabela de auditoria', 'nega', 'select * from public.auditoria_pagamentos');
select tst.tentar('(e) auditoria', 'escrever na auditoria', 'nega', $q$insert into public.auditoria_pagamentos (tabela, campo) values ('x', 'y')$q$);
select tst.tentar('(e) auditoria', 'apagar a auditoria', 'nega', 'delete from public.auditoria_pagamentos');

-- ---------- conta desativada ----------
reset role;
set role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-000000000004","role":"authenticated"}', false);
select tst.tentar('(g) conta desativada', 'ler comissões', 'nega', 'select * from public.comissoes');
select tst.tentar('(g) conta desativada', 'ler auditoria', 'nega', 'select * from public.auditoria_pagamentos');
select tst.tentar('(g) conta desativada', 'ler vendas', 'nega', 'select * from public.vendas');

-- ---------- sem login ----------
reset role;
select set_config('request.jwt.claims', '', false);
set role anon;
select tst.tentar('(f) sem login', 'ler comissões (pós-migração)', 'nega', 'select * from public.comissoes');
select tst.tentar('(f) sem login', 'marcar venda como paga', 'nega', $q$update public.vendas set status = 'paga', data_pagamento = current_date$q$);

-- =====================================================================
-- EXCLUIR LEAD (migração 20261120_excluir_lead) e EXCLUIR VENDA (admin)
-- =====================================================================
reset role;
set role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-000000000002","role":"authenticated"}', false);
select tst.tentar('excluir lead', 'A cria lead sem venda, com reunião e ligação', 'permite', $q$with l as (insert into public.leads (id, nome, segmento) values ('10000000-0000-0000-0000-0000000000e1', 'TESTE Lead para excluir', 'outro') returning id), g as (insert into public.ligacoes (lead_id, resultado) select id, 'reuniao_marcada' from l returning 1) insert into public.reunioes (id, lead_id, data_hora) select '20000000-0000-0000-0000-0000000000e1', id, now() + interval '2 days' from l$q$);
select tst.tentar('excluir lead', 'vendedor exclui reunião direto (continua proibido)', 'nega', $q$update public.reunioes set deleted_at = now() where id = '20000000-0000-0000-0000-0000000000e1'$q$);
select tst.tentar('excluir lead', 'vendedor exclui o próprio lead sem venda', 'permite', $q$select public.excluir_lead('10000000-0000-0000-0000-0000000000e1')$q$);
select tst.tentar('excluir lead', 'lead excluído some para o vendedor', 'nega', $q$select * from public.leads where id = '10000000-0000-0000-0000-0000000000e1'$q$);
select tst.tentar('excluir lead', 'reuniões do lead excluído somem (cascata)', 'nega', $q$select * from public.reunioes_pacote where lead_id = '10000000-0000-0000-0000-0000000000e1'$q$);
select tst.tentar('excluir lead', 'ligações do lead excluído somem (cascata)', 'nega', $q$select * from public.ligacoes where lead_id = '10000000-0000-0000-0000-0000000000e1'$q$);
select tst.tentar('excluir lead', 'vendedor restaura lead excluído', 'nega', $q$update public.leads set deleted_at = null where id = '10000000-0000-0000-0000-0000000000e1'$q$);
select tst.tentar('excluir lead', 'vendedor exclui lead de outro vendedor', 'nega', $q$select public.excluir_lead('10000000-0000-0000-0000-00000000000b')$q$);
select tst.tentar('excluir lead', 'vendedor marca deleted_at direto na tabela', 'nega', $q$update public.leads set deleted_at = now() where id = '10000000-0000-0000-0000-00000000000a'$q$);
select tst.tentar('excluir lead', 'DELETE físico continua proibido', 'nega', $q$delete from public.leads where id = '10000000-0000-0000-0000-00000000000a'$q$);

reset role;
set role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-000000000001","role":"authenticated"}', false);
reset role;
set role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-000000000004","role":"authenticated"}', false);
select tst.tentar('excluir lead', 'conta desativada exclui o próprio lead', 'nega', $q$select public.excluir_lead('10000000-0000-0000-0000-00000000000c')$q$);
reset role;
select set_config('request.jwt.claims', '', false);
set role anon;
select tst.tentar('excluir lead', 'sem login chama excluir_lead', 'nega', $q$select public.excluir_lead('10000000-0000-0000-0000-00000000000c')$q$);
reset role;
set role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-000000000001","role":"authenticated"}', false);
select tst.tentar('excluir lead', 'admin vê o lead e a reunião marcados como excluídos', 'permite', $q$select 1 from public.leads l join public.reunioes r on r.lead_id = l.id where l.id = '10000000-0000-0000-0000-0000000000e1' and l.deleted_at is not null and r.deleted_at is not null$q$);
select tst.tentar('excluir venda', 'admin exclui venda paga D', 'permite', $q$update public.vendas set deleted_at = now() where id = '40000000-0000-0000-0000-00000000000d'$q$);
select tst.tentar('excluir venda', 'venda excluída cancela a comissão', 'permite', $q$select 1 from public.comissoes where venda_id = '40000000-0000-0000-0000-00000000000d' and cancelada and valor = 0$q$);
select tst.tentar('excluir venda', 'exclusão fica na auditoria', 'permite', $q$select 1 from public.auditoria_pagamentos where venda_id = '40000000-0000-0000-0000-00000000000d' and campo = 'deleted_at' and valor_novo is not null$q$);
select tst.tentar('excluir lead', 'admin exclui lead com venda', 'permite', $q$select public.excluir_lead('10000000-0000-0000-0000-00000000000c')$q$);

reset role;
set role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-000000000002","role":"authenticated"}', false);
select tst.tentar('excluir venda', 'vendedor exclui venda', 'nega', $q$update public.vendas set deleted_at = now() where id = '40000000-0000-0000-0000-00000000000f'$q$);
select tst.tentar('excluir venda', 'venda excluída some para o vendedor', 'nega', $q$select * from public.vendas where id = '40000000-0000-0000-0000-00000000000d'$q$);
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
