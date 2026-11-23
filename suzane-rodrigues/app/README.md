# Suzane Rodrigues · site (rascunho)

Site de página única para Suzane Rodrigues, estética facial e corporal em Pirassununga - SP.
Vite + React + TypeScript + Tailwind. Estático, sem backend, sem cookies, sem analytics.
O HTML é pré-renderizado no build (`prerender.mjs`), então o conteúdo aparece antes do JavaScript.

```bash
npm install
npm run dev      # desenvolvimento
npm run build    # gera dist/ (com HTML pré-renderizado)
npm run preview  # serve o dist/
```

## Editar conteúdo: `src/config.ts`

Tudo que o site mostra vem desse arquivo. Campo vazio ou ausente = o bloco não aparece.

- **Seções**: `CONFIG.secoes` liga/desliga cada seção (`true`/`false`). Os links do menu acompanham.
- **Atendimentos**: `CONFIG.atendimentos`. Cada item tem `ativo`. Só os ativos aparecem
  (índice, formulário, dúvidas e JSON-LD). "Fios de colágeno", "Harmony Face" e "Criomodelagem" estão
  **desligados**: só ligue depois que a cliente confirmar que pode anunciar e como descrever. Mesmo ligado,
  escreva uma descrição geral, sem técnica, aparelho, marca, prazo ou promessa.
- **Formação**: `CONFIG.formacao` + `CONFIG.mostrarFormacao` (padrão `false`). Confirme o curso e o
  certificado antes de ligar. Quando ligada, aparece em "A profissional" e no rodapé.
- **Foto da profissional**: `CONFIG.fotoProfissional` (recorte sem fundo em `public/img/suzane-*.webp`,
  feito a partir do post do Instagram enviado). Para esconder, use `null`. Uma foto original em alta
  resolução, autorizada, melhora a nitidez; substitua os três arquivos (360, 540 e 700 px de largura).
- **Outras fotos autorizadas**: coloque em `public/img/` e liste em `CONFIG.fotos`.
- **Logo**: `public/img/logo-sr.svg` é uma recriação vetorial do medalhão (o original está em
  `../referencias/logo.jpg`). Se a cliente tiver o arquivo oficial em vetor ou PNG grande com fundo
  transparente, troque o arquivo e ajuste `CONFIG.logo`. O favicon é `public/favicon.svg`.
- **WhatsApp**: `CONFIG.whatsapp` (só números, com 55). **Teste o link** `https://wa.me/5519996784888`
  em um celular antes de publicar de forma definitiva.

## Rascunho e indexação

Enquanto `CONFIG.rascunho = true` aparece a faixa "Rascunho para avaliação" e o site fica fora dos
buscadores em três camadas: metas `robots`/`googlebot`, `public/robots.txt` (`Disallow: /`) e o
cabeçalho `X-Robots-Tag` (`public/_headers` e `vercel.json`).

Para publicar de verdade:
1. `CONFIG.rascunho = false` e `CONFIG.siteUrl` com o domínio final;
2. `public/robots.txt` → `User-agent: *` + `Allow: /`;
3. remova o `X-Robots-Tag` de `public/_headers` e de `vercel.json`;
4. remova a faixa de rascunho de `public/privacidade.html`.

## O que falta para a versão definitiva

- Confirmação da formação ("Licenciada em Estética Integrativa") antes de ligar `mostrarFormacao`.
- Confirmação de quais atendimentos podem ser anunciados (os três desligados acima) e como descrevê-los.
- Logo oficial em alta resolução.
- Foto original autorizada em alta resolução (a atual vem de um print do Instagram) e, se houver, fotos do espaço.
- Teste do link wa.me em um celular.
