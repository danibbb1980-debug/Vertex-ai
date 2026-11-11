# Natalino Polato · Advogado Criminalista

Site institucional e informativo, versão de produção para **https://natalinoadvcriminal.com**, hospedado no Cloudflare Pages (upload direto do build).

Vite + React + TypeScript + Tailwind 4 + motion. Estático, sem backend, sem analytics, sem formulário (contato só por WhatsApp). Fontes servidas pelo próprio site.

```bash
npm install
npm run build    # checa tipos, gera dist/ e pré-renderiza o HTML (scripts/prerender.mjs)
npm run preview  # serve dist/ localmente
```

## Editar dados

Tudo fica em **`src/config.ts`**: domínio (`siteUrl`), nome, OAB, currículo, formação, docência, áreas, WhatsApp, telefone, endereço, horários e chaves de exibição. Title, meta description, canonical, Open Graph, JSON-LD, `privacidade.html` e `404.html` são gerados a partir dele no build.

- **Áreas:** edite `areas`; só aparecem as com `confirmado: true`. `tema` é o texto usado na mensagem do WhatsApp.
- **Foto:** `public/img/natalino-polato-{480,800,1200}.{avif,webp}`, proporção 4:5. Originais em `referencias/fotos/`.
- **Logo:** `public/img/logo-natalino-polato.webp` e `logo-monograma.webp`. Quando houver o vetor original, substitua mantendo os nomes.
- **Imagem de compartilhamento:** `public/img/og-natalino-polato.jpg` (1200×630).

## Publicação (Cloudflare Pages)

1. `npm run build`.
2. Compacte o **conteúdo** de `dist/` (com `index.html` na raiz): `cd dist && zip -r ../site-natalino-polato-final.zip . -x "*.DS_Store"`.
3. No Cloudflare Pages, envie o zip por upload direto.
4. O redirecionamento de `www.natalinoadvcriminal.com` para `natalinoadvcriminal.com` é feito no painel do Cloudflare (Redirect Rules).

Arquivos de hospedagem em `public/`:

- `_headers`: cabeçalhos de segurança e cache (formato Cloudflare Pages).
- `robots.txt` e `sitemap.xml`: ao alterar o conteúdo, atualize a data em `sitemap.xml`.

O site é uma página única com âncoras, por isso não há `_redirects`.
