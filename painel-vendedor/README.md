# Lumivo · Painel do Vendedor

App privado para o vendedor registrar ligações, reuniões e vendas e acompanhar a comissão.
Projeto **separado** do painel financeiro: Supabase próprio, deploy próprio, nenhum dado em comum.

- Vite + React + TypeScript + Tailwind, SPA estática, sem backend próprio.
- Dados e login no Supabase (plano gratuito). A segurança fica no banco (RLS + triggers em `supabase/schema.sql`).
- Sem analytics, sem scripts de terceiros, fonte auto-hospedada, `noindex` em tudo.

## Rodar no computador

```bash
cd painel-vendedor
npm install
cp .env.example .env.local      # preencha com a URL e a chave anon do Supabase
npm run dev                     # http://localhost:5173
```

Outros comandos: `npm test` (testes de regras), `npm run typecheck`, `npm run build`,
`npm run test:rls` (teste de segurança do banco; precisa de Postgres 16 instalado localmente).

## Publicar (passo a passo)

### 1. Supabase
1. Em [supabase.com](https://supabase.com), crie um projeto **novo**, só para este app (região São Paulo).
2. Abra **SQL Editor**, cole o conteúdo inteiro de `supabase/schema.sql` e clique em **Run**. Depois rode, em ordem de data,
   cada arquivo de `supabase/migrations/` que **não** termina em `_reverter.sql` (veja "Migrações" abaixo). Cada arquivo roda uma vez só.
3. **Desative o cadastro público:** Authentication > Sign In / Providers > Email: desligue
   **Allow new users to sign up** (em versões antigas do painel: Authentication > Settings > "Enable sign ups").
   Deixe o provedor Email ligado: é por ele que vocês entram.
4. **Crie as contas:** Authentication > Users > **Add user** > *Create new user*. Informe e-mail e senha
   e marque **Auto Confirm User**. Faça isso para o Pedro (admin) e para o vendedor.
   Cada conta nova ganha automaticamente uma linha em `profiles` como **vendedor desativado**.
5. **Transforme o Pedro em admin** (SQL Editor, troque o e-mail):
   ```sql
   update public.profiles
      set papel = 'admin', ativo = true, nome = 'Pedro'
    where user_id = (select id from auth.users where email = 'pedro@exemplo.com');
   ```
6. **Ative o vendedor:** entre no app como admin > Admin > Contas > **Ativar**. Ou pelo SQL:
   ```sql
   update public.profiles
      set ativo = true, nome = 'Nome do vendedor'
    where user_id = (select id from auth.users where email = 'vendedor@exemplo.com');
   ```
   (Se as linhas de `profiles` não aparecerem, insira manualmente:
   `insert into public.profiles (user_id, nome, papel, ativo) select id, 'Nome', 'vendedor', true from auth.users where email = '...';`)
7. Em **Project Settings > API Keys**, copie a **Project URL** e a chave **publishable** (`sb_publishable_...`; a "anon" legada também funciona).
   Nunca use a chave `service_role` neste app.

### 2. Vercel
1. Crie um projeto **novo** na Vercel importando este repositório.
2. **Root Directory:** `painel-vendedor`. O framework (Vite) e o build já estão em `vercel.json`.
3. **Environment Variables:** `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` (os valores do passo 1.7).
4. Deploy. Depois, no Supabase, em Authentication > URL Configuration, coloque a URL da Vercel em **Site URL**.

`vercel.json` já traz o rewrite da SPA, `X-Robots-Tag: noindex, nofollow`, CSP restrita ao próprio app e ao Supabase,
e os demais cabeçalhos de segurança. `public/robots.txt` bloqueia tudo.

## Criar e desativar um vendedor

- **Criar:** passo 1.4 acima (Supabase > Add user), depois Admin > Contas > Ativar.
- **Desativar:** Admin > Contas > Desativar. O acesso cai na hora: com `ativo = false` o banco não devolve
  nenhuma linha e não aceita nenhuma escrita dessa conta, mesmo com a sessão ainda aberta.
- **Trocar a senha:** Supabase > Authentication > Users > (usuário) > Send password recovery ou redefinir.
- **Ver o painel de um vendedor:** como admin, escolha o vendedor no topo de Hoje, Leads, Reuniões ou Comissão.
  A tela é somente leitura até tocar em **Editar**, que também libera os campos exclusivos do admin
  (status e link do rascunho).

## Editar os textos do Material

Os textos ficam em `src/content/`, um arquivo Markdown por página:

| Arquivo | Página |
|---|---|
| `1-processo.md` | Processo |
| `2-script-de-ligacao.md` | Script de ligação |
| `3-objecoes.md` | Objeções |
| `4-roteiro-da-reuniao.md` | Roteiro da reunião de 15 minutos |
| `5-o-que-nunca-prometer.md` | O que nunca prometer |
| `6-preco-e-piso.md` | Preço e piso |

- O número no começo do nome define a ordem. Para criar uma página nova, crie `7-qualquer-nome.md`.
- Se o arquivo começar com `# Título`, esse é o título da página.
- Arquivo vazio: em produção a página não aparece (e o menu Material some se todos estiverem vazios);
  em `npm run dev` ela aparece com o aviso "Conteúdo a ser adicionado pelo admin".
- Depois de editar, faça commit: a Vercel publica sozinha.

## Exportar e apagar os dados de um vendedor

1. Como admin: **Admin > Exportar**, escolha o vendedor e baixe os CSVs (leads, ligações, reuniões, vendas, comissões).
   Os arquivos usam `;` e abrem direto no Excel.
2. **Admin > Contas > Desativar.**
3. Para apagar de vez os dados pessoais (nomes e telefones dos leads), rode no SQL Editor, trocando o e-mail:
   ```sql
   begin;
   with v as (select id from auth.users where email = 'vendedor@exemplo.com')
   delete from public.auditoria_pagamentos where venda_id in (select id from public.vendas where vendedor_id in (select id from v));
   with v as (select id from auth.users where email = 'vendedor@exemplo.com')
   delete from public.comissoes where vendedor_id in (select id from v);
   with v as (select id from auth.users where email = 'vendedor@exemplo.com')
   delete from public.vendas    where vendedor_id in (select id from v);
   with v as (select id from auth.users where email = 'vendedor@exemplo.com')
   delete from public.reunioes  where vendedor_id in (select id from v);
   with v as (select id from auth.users where email = 'vendedor@exemplo.com')
   delete from public.ligacoes  where vendedor_id in (select id from v);
   with v as (select id from auth.users where email = 'vendedor@exemplo.com')
   delete from public.leads     where vendedor_id in (select id from v);
   commit;
   ```
   Depois, apague o usuário em Authentication > Users (o perfil some junto).

## Migrações

O banco começa com `supabase/schema.sql` e evolui com os arquivos de `supabase/migrations/`, aplicados em ordem de data.
Cada migração tem um par `_reverter.sql` que a desfaz.

### 20261120_comissao_pagamento (pagamento da venda e comissão)

**Aplicar** (banco que já está em uso, sem perder dados):
1. Faça um backup antes: Database > Backups, ou exporte as tabelas `vendas` e `comissoes` em Table Editor > Export.
2. SQL Editor > New query > cole o conteúdo inteiro de `supabase/migrations/20261120_comissao_pagamento.sql` > **Run**.
   O arquivo roda numa transação: ou aplica tudo, ou nada.
3. Confira: `select status, count(*) from public.vendas group by 1;` (só `aguardando_pagamento`, `paga` ou `cancelada`)
   e `select * from public.auditoria_pagamentos limit 1;` (a tabela existe).
4. Só então publique a versão nova do app (merge na `main`). O app novo não funciona com o banco antigo, e o antigo não funciona com o banco novo.

**Reverter**: SQL Editor > cole `supabase/migrations/20261120_comissao_pagamento_reverter.sql` > **Run**, e volte o app
para a versão anterior. Perde a tabela de auditoria, o campo `valor_liquido_recebido` (o líquido continua em
`comissoes.base_calculo`) e o "estornar" (vira "repasse pago").

## Regra de comissão

- **Quem muda o pagamento:** só o admin, em Admin > Vendas, no seletor "Pagamento do cliente":
  *Aguardando pagamento*, *Paga* ou *Cancelada ou reembolsada*. O vendedor nunca altera esse status.
- **Marcar como paga:** pede a data em que o dinheiro caiu e o **valor líquido** recebido (depois das taxas do Asaas
  ou do Mercado Pago). Líquido em branco = usa o valor fechado. O diálogo mostra a prévia antes de confirmar.
- **Criação automática:** ao confirmar, um trigger no banco cria a comissão: `percentual vigente × base líquida`,
  arredondado ao centavo. Exemplos: R$ 797,00 a 25% = R$ 199,25; líquido R$ 770,00 a 25% = R$ 192,50.
- **Percentual gravado:** o percentual de Admin > Configurações no momento do pagamento fica gravado na comissão.
  Mudar a configuração depois só vale para as próximas. Marcar "Paga" de novo (ou corrigir o líquido) recalcula a
  base, nunca duplica a comissão e mantém o percentual gravado.
- **Reversão:** se uma venda paga volta para *Aguardando pagamento* ou vai para *Cancelada ou reembolsada*, a comissão
  é cancelada (valor zerado, histórico mantido). Se o repasse já tinha sido pago, ela fica em **Estornar** e aparece em
  destaque em Admin > Vendas e em Admin > Comissões a repassar até você clicar em "Marcar estorno como resolvido".
- **O que o vendedor vê:** venda aguardando = "comissão disponível após o pagamento", sem valor nenhum (o banco nem
  devolve a linha). Venda paga = valor exato, data do pagamento e status do repasse. Só então entra nos totais do mês.
- **Auditoria:** cada mudança de status, valor fechado, líquido, data, percentual (da comissão ou da configuração) e
  repasse fica em `auditoria_pagamentos`, com autor e horário. Só o admin lê (Admin > Auditoria).

## Marcar um repasse como pago

Depois de transferir a comissão ao vendedor: Admin > **Comissões a repassar** > filtre por vendedor e mês se quiser >
informe a **data do repasse** na comissão > **Marcar repasse como pago**. O valor repassado fica gravado e passa a contar
em "Recebido" no painel do vendedor (no mês do repasse). O repasse é independente do pagamento do cliente.

## Regras que o banco garante

| Quem | Pode |
|---|---|
| Sem login | Nada (todas as tabelas negam acesso ao papel `anon`). |
| Vendedor ativo | Ler e editar só os próprios leads, ligações, reuniões e vendas; ler as próprias comissões e as configurações. Arquiva leads, não apaga nada. |
| Vendedor desativado | Nada. |
| Admin | Tudo: contas, configurações, rascunhos, pagamentos, comissões, exclusões (soft delete). |

Campos que só o admin altera, mesmo nas linhas do vendedor: `rascunho_status`, `rascunho_link`,
o status do pagamento da venda, `valor_fechado`, `valor_liquido_recebido`, `data_pagamento` e `deleted_at`.
Comissões só são criadas pelo trigger (nem o admin cria à mão), só o admin atualiza o repasse, ninguém apaga.
O vendedor lê só as próprias comissões de vendas pagas (ou em estorno); a auditoria é só do admin.

O teste `npm run test:rls` sobe um Postgres descartável, aplica o `schema.sql` com um stub mínimo do
`auth` do Supabase, insere dados **falsos** no formato antigo, aplica as migrações e executa 118 verificações
reais: tentativas do vendedor (outro vendedor, campos do admin, status do pagamento, comissões, auditoria, perfil),
acesso sem login, conta desativada e as regras de comissão. No fim reverte a migração, confere que os dados
ficaram intactos, reaplica e apaga tudo.
