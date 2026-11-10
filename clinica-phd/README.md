# Site da Clínica PHD (rascunho)

Página única da Clínica PHD (Poços de Caldas - MG), feita para gerar pedidos de
agendamento pelo WhatsApp. Estática, sem backend, sem cookies e sem analytics.

Vite + TypeScript + Tailwind CSS 4, com componentes React rodando sobre Preact
(mesma API, bem menos JavaScript). O HTML é pré-renderizado no build.

> ## ⚠️ Antes de enviar o site
>
> 1. **NÚMERO NÃO VERIFICADO COMO WHATSAPP: testar antes de enviar o site.**
>    O número (35) 3114-1459 é um telefone fixo. Se não tiver WhatsApp, troque
>    `whatsapp` em `src/config.ts` ou use `usarWhatsapp: false` (os botões viram "Ligar").
> 2. **Corpo clínico: dados vindos de listagem de terceiros. Confira cada nome e CRM
>    no portal do CRM-MG e obtenha autorização da clínica antes de publicar.**
> 3. O monograma é uma **reprodução em SVG** do logo (medida sobre `referencias/logo-original.jpg`).
>    Troque pelo arquivo vetorial original quando a clínica enviar.

## Rodando

```bash
npm install
npm run dev       # desenvolvimento
npm run build     # gera dist/ (com o HTML pré-renderizado)
npm run preview   # serve o dist/ em http://localhost:4173
```

## Onde editar

Todo o conteúdo factual está em **`src/config.ts`**. Campo vazio (`""`) ou lista
vazia = o item não aparece, e o layout se reorganiza. O site não mostra
placeholders.

| O quê | Campo |
|---|---|
| Faixa de rascunho e `noindex` nas metas | `rascunho` |
| Domínio usado em canonical, Open Graph e JSON-LD | `siteUrl` |
| Telefone, WhatsApp, e-mail, Instagram, Maps | `telefone`, `whatsapp`, `usarWhatsapp`, `email`, `instagram`, `maps` |
| Horários por dia e pausa de almoço | `horarios`, `almoco` |
| Áreas de atendimento | `areas` |
| Médicos | `profissionais` |
| Fotos do espaço | `fotos` |
| Formulário | `agendamento` |
| Mensagens do WhatsApp | `mensagens` |
| Ligar/desligar seções | `secoes` |

Perguntas frequentes: `src/lib/faq.ts`. Cores e fontes: `src/styles.css`.

### Ligar e desligar seções e profissionais

- Seção: mude para `false` em `CONFIG.secoes` (ex.: `faq: false`).
- Profissional: `mostrar: false` no item de `CONFIG.profissionais`.

### RQE e título de especialista (CFM, Resolução nº 2.336/2023)

Hoje nenhum RQE foi informado. Por isso, cada cartão mostra só
"Dra. Nome · CRM-MG número" e a linha "Atende em: {área}", sem título de
especialista (`mostrarTituloEspecialista` é `false`).

Para liberar o título, preencha `rqe` do profissional. O cartão passa a mostrar,
por exemplo, "Pediatra · CRM-MG 62121 | RQE 12345". Confira o RQE no portal do CRM-MG
antes.

### Cardiologia e Endocrinologia

Aparecem no Instagram, mas sem médico informado. Ficam em `areasPendentes` e
não aparecem. Quando houver médico:

1. adicione a área em `areas` (com `ativa: true`);
2. remova o nome de `areasPendentes`;
3. cadastre o profissional em `profissionais`.

### Fotos

Use apenas fotos reais do espaço (fachada, recepção, consultórios). Nada de
pacientes, crianças, pele, procedimentos ou banco de imagens.

1. Gere `nome.avif` e `nome.webp` (≈1600 px de largura) e coloque em `public/fotos/`.
2. Adicione em `CONFIG.fotos`: `{ src: "/fotos/nome", alt: "Recepção da clínica…", largura: 1600, altura: 1200 }`.

Fotos de médicos: campo `foto` de cada profissional (ex.: `/fotos/equipe/nome.webp`).

### Logo

`src/components/Monograma.tsx` (site) e `public/marca/*.svg` (arquivos soltos:
fundo claro, fundo escuro, quadrado). Ícones e imagem de compartilhamento:
`node scripts/gerar-imagens.cjs` (usa Playwright).

## Modo rascunho e indexação

O `noindex` está em quatro lugares:

- metas `robots` e `googlebot` (geradas a partir de `CONFIG.rascunho`);
- `public/robots.txt` (`Disallow: /`);
- `public/_headers` (`X-Robots-Tag`, para Netlify/Cloudflare);
- `vercel.json` (`X-Robots-Tag`, para a Vercel).

## O que falta para publicar de forma definitiva

1. Testar o WhatsApp no número (ou trocar o número).
2. Conferir nomes e CRMs no portal do CRM-MG e obter autorização da clínica para divulgar os nomes.
3. **Incluir o diretor técnico médico (nome e CRM).** A Resolução CFM nº 2.336/2023 exige
   esse dado na publicidade de clínicas, e ele não foi informado.
4. Preencher os RQEs, se houver, para liberar os títulos de especialista.
5. Receber o logo original em vetor e as fotos reais do espaço (opcional).
6. Definir o domínio e atualizar `siteUrl`.
7. Desligar o rascunho:
   - `rascunho: false` em `src/config.ts`;
   - `public/robots.txt` → `User-agent: *` + `Allow: /`;
   - remover `X-Robots-Tag` de `public/_headers` e de `vercel.json`;
   - remover a faixa e o `noindex` de `public/privacidade.html` e `public/404.html`.

## Deploy

- **Vercel:** importe o repositório com Root Directory = `clinica-phd`. O `vercel.json` já define build e saída.
- **Qualquer hospedagem estática:** envie o conteúdo de `dist/` (o `index.html` fica na raiz).
