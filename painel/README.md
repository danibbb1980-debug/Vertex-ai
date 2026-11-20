# Lumivo Web · Painel financeiro e de vendas

Painel **privado** dos sócios: vendas, parcelas, custos, funil de leads e quanto
a empresa fatura por mês. Vite + React + TypeScript + Tailwind, dados no
Supabase (ou no próprio navegador, no modo local).

> Esta pasta é um app separado do site da raiz. Tem `package.json`, build e
> deploy próprios.

---

## Rodar no computador

```bash
cd painel
npm install
npm run dev        # http://localhost:5173
```

Sem o arquivo `.env.local`, o painel abre em **modo local**: os dados ficam só
naquele navegador (localStorage) e aparece o aviso "Modo local". Dá para usar
assim desde já. Em **Configurações → Backup** há Exportar/Importar JSON.

Outros comandos:

```bash
npm test           # testes (Vitest)
npx tsc --noEmit   # checagem de tipos
npm run build      # build de produção em dist/
```

---

## Publicar com Supabase (passo a passo)

### 1. Criar o projeto no Supabase

1. Em <https://supabase.com>, crie um projeto (plano gratuito). Região: São Paulo.
2. Abra **SQL Editor → New query**, cole todo o conteúdo de
   [`supabase/schema.sql`](supabase/schema.sql) e clique em **Run**.
   Ele cria as tabelas, os índices, as regras de segurança (RLS) e os custos
   iniciais (Claude R$ 129,90 ativo; "Imposto MEI (DAS)" e "Domínios" sem valor
   e inativos). Pode rodar de novo sem problema.

### 2. Liberar os e-mails dos sócios

No SQL Editor, rode (com os e-mails reais, em minúsculas):

```sql
insert into public.allowed_emails (email) values
  ('socio1@exemplo.com'),
  ('socio2@exemplo.com');
```

Só quem estiver nessa tabela **e** estiver logado lê ou grava qualquer dado.

### 3. Criar os dois usuários

**Authentication → Users → Add user → Create new user**, um para cada sócio,
com e-mail e senha (marque "Auto Confirm User").

### 4. Desativar o cadastro público (importante)

**Authentication → Sign In / Providers → Email**: desligue **"Allow new users
to sign up"**. Assim ninguém cria conta sozinho, mesmo com o link do painel.

Se quiserem entrar por **link mágico**, em **Authentication → URL
Configuration** coloque a URL do painel publicado em "Site URL".

### 5. Publicar na Vercel

1. **Add New → Project**, escolha este repositório.
2. **Root Directory: `painel`** (o resto a Vercel detecta pelo `vercel.json`).
3. Em **Environment Variables**, adicione (valores em Supabase → **Project
   Settings → API**):
   - `VITE_SUPABASE_URL` = Project URL
   - `VITE_SUPABASE_ANON_KEY` = chave `anon` `public`
4. **Deploy**.

A chave `anon` é feita para ficar no navegador; quem protege os dados são as
regras RLS. **Nunca** use a chave `service_role` aqui. Para rodar local
conectado ao Supabase, copie `.env.example` para `.env.local` (que não vai para
o Git) e preencha.

---

## Migrar do modo local para o Supabase

1. No painel em modo local: **Configurações → Backup → Exportar JSON**.
2. Abra o painel publicado (com Supabase), entre com seu e-mail.
3. **Configurações → Backup → Importar JSON** e escolha o arquivo.

A importação adiciona ou atualiza pelo `id`; nada é apagado. Pode importar o
mesmo arquivo duas vezes sem duplicar.

## Adicionar um novo custo

**Custos → Novo custo**: descrição, categoria, valor, recorrência (mensal,
anual ou única) e o dia/data. Custo sem valor pode ficar cadastrado como
inativo até você saber o valor (é o caso do DAS e dos domínios).

---

## Follow-ups (enviado e atrasado)

Você envia os follow-ups **à mão** (WhatsApp, Instagram); o painel só registra.
Não há envio automático de nenhuma mensagem.

### Aplicar a migração no Supabase (uma vez)

1. Supabase → **SQL Editor → New query**.
2. Cole todo o conteúdo de
   [`supabase/migrations/20261114_followups.sql`](supabase/migrations/20261114_followups.sql)
   e clique em **Run**.
3. Faça isso **antes** de publicar esta versão. Sem a tabela, o painel mostra
   um aviso pedindo para rodar a migração.

Ela cria a tabela `followups` (mesma segurança das outras: só logado e com
e-mail em `allowed_emails`, sem exclusão física), três configurações novas e,
para cada lead que já tinha "próximo follow-up", um follow-up em aberto naquela
data (canal conforme a origem do lead). Pode rodar de novo sem duplicar. Nenhum
dado existente é alterado ou apagado.

### Modo local

Na primeira abertura desta versão, o navegador faz a mesma migração sozinho:
se os dados salvos não têm follow-ups, cria um para cada lead com "próximo
follow-up". Acontece uma vez só. Importar um backup JSON antigo também migra.

### Status (calculado, nunca gravado)

Comparando só a data, no fuso America/Sao_Paulo:

| Status | Regra |
|---|---|
| **Enviado** | tem `enviado_em` |
| **Dispensado** | tem `dispensado_em` |
| **Atrasado** | não enviado e `data_prevista` antes de hoje |
| **Hoje** | não enviado e `data_prevista` igual a hoje (não é atrasado) |
| **Pendente** | não enviado e `data_prevista` no futuro |

A data de hoje é reavaliada a cada minuto, então à meia-noite os de "Hoje"
viram "Atrasado" sem recarregar a página.

### Cadência (sugestão automática, sempre editável)

- Lead vai para **Rascunho enviado** ou **Proposta/valor enviado** → cria um
  follow-up para hoje + **2 dias úteis** (configurável). Sexta vira terça.
- **No máximo um** follow-up de 2 dias úteis por lead. Depois de enviado, o
  painel só oferece: retomada em 60 ou 90 dias, ou encerrar (lead vai para
  Perdido com o motivo).
- Data em sábado ou domingo → aviso "Fim de semana: sugerimos segunda-feira",
  com um clique para mover. Nunca move sozinho.
- Venda com **Publicado em** → follow-up "Pós-venda: oferta de manutenção" no
  30º dia (mesma data do fim dos ajustes). Se a venda for cancelada, ele é
  dispensado.
- O "próximo follow-up" do lead virou espelho: mostra a data do follow-up em
  aberto mais próximo.

Adiar (+1 dia útil, +2, +7 ou outra data), dispensar e marcar como enviado
têm "Desfazer". "Enviei antes" registra um envio esquecido com data e hora.
Os modelos do botão "Copiar mensagem" ficam em Configurações.

## Como os números são calculados

- **Líquido** = bruto − taxa (%). A taxa padrão vem de Configurações (por
  plataforma e forma de pagamento) e pode ser trocada em cada venda.
- **Parcelas**: Pix e cartão à vista = 1. Parcelado em N = N parcelas a cada
  30 dias a partir do 1º pagamento (cada uma editável). Plano mensal = uma
  mensalidade por mês, criada automaticamente, até "Encerrar assinatura".
- **Recebido no mês** = líquido das parcelas com data de recebimento no mês.
  **A receber** = parcelas não recebidas com data prevista no mês.
- **Caixa x Competência**: caixa olha quando o dinheiro entrou; competência
  olha a data da venda (proposta e cancelada não contam).
- **Cancelada**: sai da receita e das previsões, fica no histórico. Se já tinha
  recebido algo, aparece "Reembolso pendente" até você marcar como feito.
- **Fim dos ajustes** = publicação + 30 dias (editável). Alerta no painel
  quando faltam 7 dias.
- **MEI**: recebido bruto de vendas no ano + "outras receitas" contra o limite
  (padrão R$ 81.000). Alerta a partir de 70% e 90%. Soma informativa: confirme
  as regras com seu contador.
- Exclusões são lógicas (`deleted_at`), com "Desfazer" por alguns segundos.

## Privacidade

- `noindex` em três camadas: meta tags no `index.html`, `public/robots.txt`
  (`Disallow: /`) e cabeçalho `X-Robots-Tag` no `vercel.json`.
- Sem analytics e sem scripts de terceiros. Fonte (Hanken Grotesk) servida pelo
  próprio site via `@fontsource`.
- `vercel.json` também envia CSP, `X-Frame-Options: DENY`, `nosniff` e
  `Referrer-Policy: no-referrer`.

## Organização do código

```
src/domain/   regras de negócio puras (sem React, sem banco) + testes
  calc.ts       líquido, parcelas, métricas do mês, MEI, custos, equilíbrio
  service.ts    saveSale, markReceived, cancelamento, assinatura...
  followups.ts  status, dias úteis, cadência, marcar enviado/adiar/dispensar, migração
  parser.ts     leitura do texto colado (Asaas, Pix, mensagens)
  events.ts     eventos do calendário e exportação .ics
src/data/     armazenamento (local ou Supabase), estado e rotas
src/pages/    telas
src/ui/       componentes visuais
supabase/     schema.sql e migrations/ (rodar em ordem de data)
```

**Webhook no futuro (Asaas/Mercado Pago):** as funções de `src/domain/service.ts`
recebem os dados e devolvem só as linhas que mudaram. Uma função serverless pode
montar um `SaleDraft` a partir do evento de pagamento, chamar `saveSale` (nova
venda) ou `markReceived` (parcela paga) e gravar o resultado no Supabase com a
chave de serviço, no servidor. Da mesma forma, um lembrete por e-mail ou push
no futuro só precisa ler os follow-ups com status "Hoje"/"Atrasado"
(`followupStatus` em `src/domain/followups.ts`).
