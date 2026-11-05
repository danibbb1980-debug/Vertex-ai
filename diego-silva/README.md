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

### OAB (libera o bloco "O advogado")
- `CONFIG.advogado.oab` no formato `"OAB/UF número"`. Com o campo vazio, o bloco "O advogado", o link "Sobre" do menu e a linha da OAB no rodapé somem; a numeração das seções se ajusta sozinha.
- Hoje está preenchido com **OAB/MG 210.925** e a formação (PUC/MG, pós em Direito e Processo do Trabalho pela PUC/RS, pós em Direito Civil pela ESA), tirados do post do Instagram enviado como referência (`referencias/print-instagram-post.png`). **Confirmar com o advogado.**
- `CONFIG.advogado.trajetoria`: texto opcional (vazio = não aparece).

### Foto
- `CONFIG.foto` aponta para `public/img/retrato-*.{webp,jpg}`, recortadas do print do Instagram (resolução limitada).
  **Pedir o arquivo original em alta** e substituir os 4 arquivos com os mesmos nomes (480 e 800 px de largura, proporção 4:5).
- `CONFIG.foto = null` troca o retrato por uma composição com o emblema.

### WhatsApp: qual número usar
- Site usa **`CONFIG.whatsapp = "5535998215278"`** ((35) 99821-5278, da ficha do Google).
- O link da bio do Instagram usa outro número, `5535998569709` (guardado em `CONFIG.whatsappAlternativo`, **não exibido**).
- **Confirmar qual número é o do escritório.** Se for o outro, troque `whatsapp` e `whatsappExibicao` e, no texto, o FAQ "Como falo com o escritório?" e as páginas `public/privacidade.html` e `public/404.html`.

## O que o advogado deve revisar
- Descrições das 4 áreas (`AREAS`), os 3 conteúdos informativos (`CONTEUDOS`) e o FAQ: revisão técnica. Os textos são gerais, sem prazos, valores ou regras específicas, de propósito.
- Texto do bloco "O advogado" (método de trabalho).

## Logo e a expressão "Advocacia especializada"
O logo completo (`referencias/logo-selo-completo.jpg`) traz a legenda **"Advocacia especializada"**. Pelo Provimento 205/2021 da OAB, "especializado/especialista" só pode ser usado com título de especialista comprovado. Por isso o site usa **apenas o emblema** (hexágono vinho, coluna dourada e balança), redesenhado em vetor (`src/components/Emblem.tsx`, `public/favicon.svg`), junto do nome em tipografia. Sugestão: ter uma versão do logo sem essa legenda.

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
