# Botelho & Neves Advogados Associados: site (rascunho)

Vite + React + TypeScript + Tailwind 4 + motion. Estático, sem backend, sem cookies, sem analytics.
O HTML é pré-renderizado no build (`prerender.mjs`), então o conteúdo chega pronto mesmo antes do JS.

```bash
npm install
npm run dev      # desenvolvimento
npm run build    # gera dist/ (com index.html pré-renderizado, _headers, robots.txt)
npm run preview  # serve o dist
```

## Editar o conteúdo

Tudo fica em `src/config.ts`. Campo vazio (`""`, `null`, lista vazia, `false`) = o bloco não aparece.

- **Ligar/desligar seções:** `CONFIG.secoes` (`escritorio`, `advogados`, `areas`, `quandoProcurar`, `comoFunciona`, `duvidas`, `contato`, `agendar`, `ctaFinal`). A numeração romana se ajusta sozinha.
- **WhatsApp:** troque `CONFIG.whatsapp` pelo número confirmado (só dígitos, com 55 e DDD) e ponha `usarWhatsapp: true`. Todos os botões "Ligar" viram "Agendar pelo WhatsApp" (com "Ligar" ao lado), o botão flutuante muda e a seção **Solicitar agendamento** (#agendar) aparece. O formulário só monta a mensagem e abre o WhatsApp; nada é guardado.
- **Rascunho:** `rascunho: false` remove a faixa e troca as metas para `index, follow`. Depois, apague `public/robots.txt` (ou troque por `Allow: /`) e remova o `X-Robots-Tag` de `public/_headers` e `vercel.json`.
- **Domínio:** ajuste `siteUrl` (usado em canonical, og:url, og:image e JSON-LD). Também em `public/privacidade.html`.
- **Fotos:** `CONFIG.fotos.socios` (já preenchida) e `CONFIG.fotos.escritorio` (vazia). Coloque os arquivos em `public/img/` e os originais em `referencias/fotos/`.
- **Tempo de atuação:** `tempoAtuacao` + `mostrarTempoAtuacao`.

## Foto dos sócios

A foto saiu da arte "1º lugar Sales Pesquisa 2026" enviada pelo cliente. O fundo foi removido (modelo
`isnet-general-use`, rembg) e a imagem foi cortada só nos dois sócios: `referencias/fotos/socios.png` (PNG
transparente) e `public/img/socios.webp` / `socios-400.webp`. O selo do prêmio, o patrocinador e os textos da
arte **não** foram usados: o Provimento 205/2021 restringe premiações e rankings como publicidade.
A foto não identifica quem é quem; para legendar cada sócio, confirme a ordem com o escritório.
A imagem vem de uma arte de Instagram (resolução e compressão limitadas); uma foto original em alta resolução
melhoraria muito o resultado.

## Logo

`referencias/logo.jpg` (640 px, JPG). O monograma e o nome foram vetorizados fielmente (potrace) para
`src/components/monogramPath.ts` e `public/img/*.svg`. Um PNG/SVG original em alta resolução é recomendado.

## Falta confirmar antes de publicar de vez

- CEP da sede em Varginha: usado **37002-089** (Google Maps e cartão). O cliente digitou 37001-089.
- Unidade de Coqueiral: confirmar horários e se atende com hora marcada (hoje só o endereço aparece).
- Qual número deve receber WhatsApp e se pode ser publicado (os celulares do cartão não foram publicados).
- E-mails do cartão: não publicados; confirmar se algum é canal oficial.
- "Mais de 10 anos de atuação": vem da bio do Instagram do escritório; confirmar com os sócios.
- Horários da sede (Google): seg. a sex., 08h às 18h. Confirmar e informar se há pausa de almoço.
- Registro da sociedade na OAB (opcional, `registroSociedade`).
- Logo em alta resolução e fotos originais (sócios e escritório).

## Deploy

`vercel.json` já traz o `X-Robots-Tag: noindex, nofollow` e o build. Na Vercel, aponte o Root Directory
para `botelho-neves/`. Para hospedagens estáticas (Netlify, Cloudflare Pages), envie o conteúdo de `dist/`:
o `_headers` vai junto.
