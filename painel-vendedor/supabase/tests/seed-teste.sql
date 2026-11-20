-- DADOS FALSOS, SOMENTE PARA O TESTE LOCAL. Nunca rode isto no projeto real.
-- IDs fixos para facilitar a leitura do teste.
--  ...0001 = admin (teste)   ...0002 = vendedor A (teste)
--  ...0003 = vendedor B      ...0004 = vendedor C (desativado)
insert into auth.users (id, email, raw_user_meta_data) values
  ('00000000-0000-0000-0000-000000000001', 'admin@teste.invalid',    '{"nome":"Admin Teste"}'),
  ('00000000-0000-0000-0000-000000000002', 'vend-a@teste.invalid',   '{"nome":"Vendedor A Teste"}'),
  ('00000000-0000-0000-0000-000000000003', 'vend-b@teste.invalid',   '{"nome":"Vendedor B Teste"}'),
  ('00000000-0000-0000-0000-000000000004', 'vend-c@teste.invalid',   '{"nome":"Vendedor C Teste"}');

-- Bootstrap do admin (é o mesmo SQL do README) e ativação dos vendedores.
update public.profiles set papel = 'admin', ativo = true where user_id = '00000000-0000-0000-0000-000000000001';
update public.profiles set ativo = true where user_id in ('00000000-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000003','00000000-0000-0000-0000-000000000004');

-- A partir daqui, como admin pela API (papel authenticated + JWT).
set role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-000000000001","role":"authenticated"}', false);

insert into public.leads (id, vendedor_id, nome, segmento, cidade, uf, telefone, instagram, maps_link, registro_tipo, registro_numero, areas) values
  ('10000000-0000-0000-0000-00000000000a', '00000000-0000-0000-0000-000000000002', 'TESTE Clínica Fictícia A', 'odontologia', 'Cidade Teste', 'MG', '(00) 0000-0001', '@teste_a', 'https://maps.example/a', 'CRO', '00000', 'Implante (teste)'),
  ('10000000-0000-0000-0000-00000000000b', '00000000-0000-0000-0000-000000000003', 'TESTE Escritório Fictício B', 'advocacia', 'Cidade Teste', 'MG', '(00) 0000-0002', null, null, null, null, null),
  ('10000000-0000-0000-0000-00000000000c', '00000000-0000-0000-0000-000000000004', 'TESTE Estética Fictícia C', 'estetica', 'Cidade Teste', 'MG', '(00) 0000-0003', null, null, null, null, null);

insert into public.ligacoes (lead_id, resultado) values
  ('10000000-0000-0000-0000-00000000000a', 'nao_atendeu'),
  ('10000000-0000-0000-0000-00000000000b', 'reuniao_marcada');

insert into public.reunioes (id, lead_id, data_hora) values
  ('20000000-0000-0000-0000-00000000000a', '10000000-0000-0000-0000-00000000000a', now() + interval '1 day'),
  ('20000000-0000-0000-0000-00000000000b', '10000000-0000-0000-0000-00000000000b', now() + interval '1 day');

insert into public.vendas (id, lead_id, valor_combinado) values
  ('30000000-0000-0000-0000-00000000000a', '10000000-0000-0000-0000-00000000000a', 797),
  ('30000000-0000-0000-0000-00000000000b', '10000000-0000-0000-0000-00000000000b', 797),
  ('30000000-0000-0000-0000-00000000000c', '10000000-0000-0000-0000-00000000000a', 797);

-- Venda de A já paga, com comissão (para A tentar mexer nela).
select public.registrar_pagamento('30000000-0000-0000-0000-00000000000a', 797, 760, current_date);
select public.registrar_pagamento('30000000-0000-0000-0000-00000000000b', 797, 760, current_date);

reset role;
select set_config('request.jwt.claims', '', false);
