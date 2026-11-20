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
2. Abra **SQL Editor**, cole o conteúdo inteiro de `supabase/schema.sql` e clique em **Run**. Rode uma vez só.
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
7. Em **Project Settings > API**, copie a **Project URL** e a chave **anon / publishable**.
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

## Regras que o banco garante

| Quem | Pode |
|---|---|
| Sem login | Nada (todas as tabelas negam acesso ao papel `anon`). |
| Vendedor ativo | Ler e editar só os próprios leads, ligações, reuniões e vendas; ler as próprias comissões e as configurações. Arquiva leads, não apaga nada. |
| Vendedor desativado | Nada. |
| Admin | Tudo: contas, configurações, rascunhos, pagamentos, comissões, exclusões (soft delete). |

Campos que só o admin altera, mesmo nas linhas do vendedor: `rascunho_status`, `rascunho_link`,
`valor_fechado`, `data_pagamento`, status "paga"/"cancelada" da venda e `deleted_at`.
A comissão só nasce de venda paga (`registrar_pagamento`), vale `percentual × base líquida`,
e é zerada quando a venda é cancelada ou reembolsada.

O teste `npm run test:rls` sobe um Postgres descartável, aplica o `schema.sql` com um stub mínimo do
`auth` do Supabase, insere dados **falsos** e executa 63 tentativas reais (leitura de outro vendedor,
alteração de campos do admin, comissões, perfil, acesso sem login, conta desativada). Tudo é apagado no fim.
