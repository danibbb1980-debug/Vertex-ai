# The Details | Estética Automotiva (rascunho)

Site de página única da The Details, em Poços de Caldas - MG. Vite + React + TypeScript, estático, sem backend. O HTML é pré-renderizado no build: o conteúdo é legível sem JavaScript.

```bash
npm install
npm run dev      # desenvolvimento
npm run build    # gera dist/ (index.html pré-renderizado, CSS inline)
npm run preview  # serve dist/ em http://localhost:4173
```

## Editar o conteúdo: `src/config.ts`

Todos os dados ficam em `src/config.ts`. Campo vazio = o bloco não aparece.

- **Seções**: `CONFIG.secoes.<nome> = false` remove a seção (e o link do menu).
- **Atendimentos**: cada item de `CONFIG.servicos` tem `ativo`. Só os ativos aparecem no site, no formulário e nas mensagens do WhatsApp. Lavagem, higienização, polimento e vitrificação estão desligados até a empresa confirmar.
- **Intro**: `CONFIG.intro` (padrão `false`) fica reservado; o site não tem cortina de abertura.
- **Rascunho**: `CONFIG.rascunho = false` tira a faixa e as metas `noindex`. Para publicar de vez, apague também `public/robots.txt` (ou troque para `Allow: /`), o bloco `X-Robots-Tag` de `vercel.json` e `public/_headers`.
- **URL do site**: `CONFIG.siteUrl` alimenta canonical, og:url, og:image e JSON-LD.
- **Google Maps**: troque `CONFIG.mapsUrl` pelo link oficial do perfil quando o cliente enviar.

## Fotos e vídeos

Os arquivos ficam em `public/media/`. Fotos em três larguras (`-360`, `-560`, `-1100`, WebP), listadas em `CONFIG.trabalhos` (por veículo), `CONFIG.antesDepois` e `CONFIG.videos`. Lista vazia = a seção "Trabalhos" não aparece.

Para adicionar fotos: recorte (sem barra de status ou interface do Instagram), gere as três larguras (veja `scripts/media.py`) e acrescente o item com `alt` descritivo. **Nunca publique placa legível**: a placa do hatch prata no vídeo `espuma.mp4` foi desfocada, assim como a placa da ilustração em `suv-grafite-noite`. As placas "THEDETAILS" são da própria marca.

## Logo

O logotipo foi redesenhado como vetor (`scripts/logo.mjs`, a partir da fonte Lobster, a mais próxima da letra original, e da Hanken Grotesk). Gera `src/assets/logo.svg`, `src/assets/logo-claro.svg`, `public/logo-the-details.svg` e `public/favicon.svg`. `scripts/icons.cjs` gera `favicon-32.png`, `apple-touch-icon.png` e `og.jpg`.
**Pedir ao cliente o arquivo original do logo em alta resolução (vetor ou PNG com fundo transparente)** e substituir os SVGs, se ele preferir o desenho original.

## Antes de publicar: testar

- Testar o link `https://wa.me/5535984220508` em um celular.
- Conferir o formulário "Pedir horário": ele só monta a mensagem e abre o WhatsApp; nada é guardado.

## Pendências com o cliente (o que falta para publicar de forma definitiva)

1. **Quais serviços a The Details oferece de fato** (o perfil só informa detalhamento de carros e motos) e como quer descrevê-los.
2. **Se atende motos** (hoje está ligado).
3. **Link oficial do Google Maps**.
4. Se pode exibir a nota do Google (hoje não aparece).
5. Nome do proprietário, se quiser aparecer.
6. **Autorização das fotos e vídeos** publicados (veículos de clientes) e novas fotos.
7. **Arquivo original do logo**.
