# Diego Silva Advocacia & Consultoria Jurídica (rascunho)

Rascunho de site proposto pela Lumivo Web. Página única + `privacidade.html` + `404.html`.
Vite + React + TypeScript + Tailwind 4 + motion + Lenis. Estático, sem backend, sem cookies, sem analytics.
O HTML é pré-renderizado no build (o conteúdo aparece antes do JavaScript carregar).

```bash
npm install
npm run dev      # desenvolvimento
npm run build    # gera dist/ (index.html pré-renderizado)
npm run preview  # serve o dist/
```

## Onde editar

Tudo fica em **`src/config.ts`**: nome, WhatsApp, Instagram, endereço, horários, áreas, etapas, conteúdos, FAQ.
Campo vazio faz o bloco sumir do site. Nunca use "[A CONFIRMAR]" ou textos provisórios.

### Seção "Sobre" (menu) = "O escritório" + "O advogado"
- **O escritório** (sempre aparece): título "O escritório", nome do escritório, abertura, parágrafos, `fecho` (frase final em destaque) e `valores`. Tudo em `CONFIG.sobre`.
- `CONFIG.mostrarTempoEscritorio` (`true`) + `CONFIG.tempoEscritorio` (`"Há cinco anos"`): com `false`, a abertura começa em "Nascemos com um propósito claro...". **Atualizar a frase a cada ano.** Não usar "mais de", "vasta" ou "ampla".
- **O advogado** (subbloco ligado ao escritório): só aparece com `CONFIG.advogado.oab` no formato `"OAB/UF número"` (hoje **OAB/MG 210.925**). Mostra foto, "Dr. Diego Silva, OAB", `advogado.texto` e `advogado.formacao` (`"Curso, Instituição"`, sem anos). Com a OAB vazia, o subbloco e a OAB do rodapé somem.
- Textos fornecidos pelo advogado e ajustados ao Provimento 205/2021: sem promessas nem autoelogio ("ágil", "de qualidade", "resultados" etc.).

### Foto
- `CONFIG.foto` aponta para `public/img/retrato-*.{webp,jpg}`, recortadas do print do Instagram (resolução limitada).
  **Pedir o arquivo original em alta** e substituir os 4 arquivos com os mesmos nomes (480 e 800 px de largura, proporção 4:5).
- `CONFIG.foto = null` troca o retrato por uma composição com o emblema.

### WhatsApp
- Número do escritório, confirmado pelo advogado: **(35) 99856-9709** → `CONFIG.whatsapp = "5535998569709"` e `CONFIG.whatsappExibicao`.
- Todos os botões, o formulário de pré-atendimento, o FAQ e o JSON-LD leem do config. Só `public/privacidade.html` e `public/404.html` têm o número escrito à mão: ao trocar, atualize esses dois também.

## O que o advogado deve revisar
- Descrições das 4 áreas (`AREAS`), os 3 conteúdos informativos (`CONTEUDOS`) e o FAQ: revisão técnica. Os textos são gerais, sem prazos, valores ou regras específicas, de propósito.

## Logo
O logo completo (`referencias/logo-selo-completo.jpg`) traz uma legenda que o Provimento 205/2021 da OAB só permite com título comprovado. Por isso o site usa **apenas o emblema** (hexágono vinho, coluna dourada e balança), redesenhado em vetor (`src/components/Emblem.tsx`, `public/favicon.svg`), junto do nome "Diego Silva Advocacia & Consultoria Jurídica" em tipografia. Sugestão: ter uma versão do logo sem a legenda.

## Desligar o modo rascunho (quando for publicar de verdade)
1. `src/config.ts`: `rascunho: false` (some a faixa e a meta robots passa a `index, follow`).
2. `public/robots.txt`: trocar por `User-agent: *` + `Allow: /`.
3. `public/_headers` e `vercel.json`: remover a linha `X-Robots-Tag: noindex, nofollow`.
4. `public/privacidade.html` e `public/404.html`: remover a meta `noindex` e a faixa de rascunho da privacidade.
5. Atualizar `CONFIG.siteUrl` com o domínio final.

## Detalhes técnicos
- Fontes self-hosted e recortadas (Newsreader e Inter Tight, ~124 KB no total) em `src/fonts/`.
- Movimento: revelação do título em CSS (não espera o JS), Lenis + cursor carregados só depois do `load`, tudo desligado com `prefers-reduced-motion`.
- Mapa do Google só carrega com clique (evita cookies de terceiros).
- Formulário de pré-atendimento: monta a mensagem e abre `wa.me`; não envia nada a servidor, não usa localStorage nem cookies.
- `og.jpg` (1200×630) e ícones em `public/`.

## Histórico de alterações
- **Atualização 3:** seção "Sobre" reorganizada: primeiro "O escritório" (texto, valores e nome do escritório), depois o subbloco "O advogado" (foto, OAB, texto de fundação e formação).
- **Atualização 2:** WhatsApp trocado para (35) 99856-9709 em todo o site; texto "Sobre o escritório" e valores fornecidos pelo advogado; formação atualizada (bacharel PUC/MG, pós em Direito e Processo do Trabalho PUC/RS, pós em Advocacia Cível ESA); opção `mostrarTempoEscritorio`.
