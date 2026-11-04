# Clínica Dr. Feliciano · site (RASCUNHO)

Página única para a Clínica Dr. Feliciano, em Pouso Alegre - MG. Vite + React +
TypeScript + Tailwind 4 + `motion`. Estático, sem backend, sem cookies, sem analytics.

```bash
npm install
npm run dev      # desenvolvimento
npm run build    # gera dist/ (com HTML pré-renderizado e CSS embutido)
npm run preview  # serve o dist/
npm run logo     # regera logo.svg, logo-escuro.svg e favicon.svg
```

## Antes de publicar de forma definitiva

| Pendência | Onde |
|---|---|
| **Conferir o WhatsApp.** Foi recebido "55 35 9984-5687" (8 dígitos). O site usa `5535999845687`, com o 9 de celular acrescentado. Confirmar com a clínica. | `whatsapp` e `telefoneExibicao` |
| **Responsável técnico e CRO** (exigência do CFO para publicidade). Hoje não aparecem. | `responsavelTecnico`, `cro` |
| **Toxina botulínica**: só manter ligada se o profissional tiver habilitação comprovada. | `mostrarToxina` |
| **Logo oficial**: a assinatura atual é provisória, criada pela Lumivo Web para o rascunho. Substituir se a clínica tiver ou quiser outro logo. | `public/logo*.svg`, `public/favicon.svg`, `src/brand/logo-paths.ts` |
| **Fotos** reais da clínica e da equipe (opcional). | `fotos`, `profissionais` |
| **Desligar o rascunho**: tira a faixa e as metas noindex. Remover também `Disallow: /` do `robots.txt` e o `X-Robots-Tag` de `public/_headers` e `vercel.json`. | `rascunho` |
| Atualizar `siteUrl` ao conectar um domínio próprio. | `siteUrl` |

## Como editar

Tudo fica em **`src/config.ts`**. Regra do projeto: **campo vazio = componente não
aparece**. O site nunca mostra placeholder.

- **Seções**: `secoes.clinica`, `secoes.atendimentos`, `secoes.agendar`… `true`/`false`.
  Os links do menu acompanham.
- **Atendimentos**: lista `atendimentos` (nome, resumo educativo, ícone). Nunca usar
  "especialista" sem título registrado no CFO.
- **Horários**: `horarios`. O formulário gera os horários em blocos de 1h a partir
  daqui, sem o horário de fechamento. Se a clínica informar almoço, acrescente
  `almoco: { inicio: "12:00", fim: "13:00" }` no dia correspondente e ele sai da lista.
- **Profissionais e CRO**: preencha `profissionais`, `responsavelTecnico` e `cro`.
  O CRO aparece no rodapé e no JSON-LD.
- **Urgência**: `agendamento.urgencia = true` só se a clínica fizer atendimento de urgência.

## Formulário "Solicitar agendamento" (#agendar)

Monta a mensagem e abre `wa.me` em nova aba. Nada é enviado a servidor, salvo no
navegador ou rastreado. Bloqueia datas passadas e dias fechados (domingo), lista só
os horários de funcionamento e, se o navegador bloquear a nova aba, mostra um botão
"Abrir WhatsApp" com a mesma mensagem. A página `privacidade.html` explica isso.

## Rascunho / noindex (três camadas)

1. `<meta name="robots">` e `googlebot` com `noindex, nofollow` (gerados a partir de `rascunho`).
2. `public/robots.txt` com `Disallow: /`.
3. Cabeçalho `X-Robots-Tag: noindex, nofollow` em `public/_headers` e `vercel.json`.

## Identidade

- Paleta: azul-petróleo `#0F3A40`, linho `#F4EEE4`, papel `#FAF7F1`, mel `#C98A3B`
  (texto em fundo claro: `#8A5A1C`; em fundo escuro: `#E0A458`), sálvia `#8FA898`.
- Tipografia: Fraunces 500 (títulos, com uma palavra em itálico) + DM Sans. Fontes
  servidas do próprio site (`public/fonts`).
- Símbolo: anel aberto em volta de um F de canto suave. O arco do anel passa por baixo
  dos títulos e se fecha no CTA final.
