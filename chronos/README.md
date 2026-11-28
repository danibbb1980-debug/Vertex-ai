# Chronos | Estética Automotiva (rascunho)

Site de página única da Chronos, em Poços de Caldas - MG. Vite + React + TypeScript, estático, sem backend, sem cookies, sem analytics.

> **Rascunho.** A faixa "Rascunho para avaliação" está ligada e o site não é indexado (meta robots, `robots.txt`, `X-Robots-Tag` em `_headers` e `vercel.json`).

## Rodar

```bash
npm install
npm run dev        # desenvolvimento
npm run build      # typecheck + build + pré-renderização do HTML em dist/
npm run preview    # serve o dist em http://localhost:4173
```

## Editar o conteúdo: `src/config.ts`

Tudo o que o site mostra vem de `CONFIG`. Campo vazio = o bloco não aparece.

- **Rascunho:** `rascunho: false` tira a faixa. Para liberar a indexação, apague também as metas `robots`/`googlebot` em `index.html`, `public/robots.txt`, a linha do `X-Robots-Tag` em `public/_headers`, `public/vercel.json` e `vercel.json`.
- **Seções:** `secoes.{nome}: false` desliga a seção.
- **Serviços:** cada item de `servicos` tem `ativo`. Só os ativos aparecem na página e no formulário. Hoje só "Estética automotiva" está ativo; lavagem, polimento, vitrificação etc. estão desligados até a Chronos confirmar.
- **Fotos ("Trabalhos"):** lista `fotos`. Para acrescentar: salve `public/fotos/{nome}-480.webp` (e `-960.webp`, se a foto tiver resolução para isso), adicione um item com `alt` descritivo e legenda neutra. Lista vazia = a seção não existe. Os originais tratados ficam em `referencias/fotos/`. **Nunca publique placa legível nem rosto de cliente sem autorização** (as fotos vieram de prints do Instagram enviados pela Chronos; as quatro com placa visível ou parcial já foram borradas).
- **Horários:** `horarios` (0 = domingo, `null` = fechado). O formulário gera os horários a partir daqui, sempre deixando a última hora livre.
- **Hero:** `HERO_CONFIG` ajusta cores, tempos do splash e a luz em WebGL sem mexer nos componentes. `intro: false` desliga o splash.

## Logo

O logo foi **refeito em vetor** a partir do PNG de 150 px (`referencias/logo-chronos-referencia.jpg`):

- `public/logo-chronos.svg`: versão para fundo escuro (texto convertido em curvas, sem depender de fonte);
- `public/logo-chronos-tinta.svg`: versão para fundo claro;
- `public/favicon.svg`, `favicon-32.png`, `apple-touch-icon.png`: monograma "C" no mostrador;
- `public/og-chronos.png`: imagem de compartilhamento.

A cor de acento `#5DB3C4` foi amostrada do traço de circuito do logo. **Pedir ao cliente o arquivo original em alta resolução, com fundo transparente**, e comparar com a versão refeita antes de publicar.

## WhatsApp: testar o número

O número foi informado como (35) 9126-7375, com 8 dígitos depois do 9 inicial. Teste:

1. `https://wa.me/553591267375`
2. se não abrir a conversa: `https://wa.me/5535991267375`

Mantenha o que funcionar em `CONFIG.whatsapp` (e `whatsappExibicao`), e atualize o número em `index.html` (JSON-LD e `<noscript>`) e em `public/privacidade.html`.

## Depois do primeiro deploy

Atualize `CONFIG.siteUrl` e as URLs absolutas em `index.html` (canonical, `og:url`, `og:image`, JSON-LD) e em `public/privacidade.html`, e faça novo deploy.

## O que falta para publicar de verdade

- **Quais serviços a Chronos oferece de fato e como quer descrevê-los.**
- **Autorização das fotos** usadas na galeria (vieram do zip enviado) e confirmação de que nenhuma mostra cliente ou placa.
- **Nome do proprietário**, se quiser aparecer.
- **Arquivo original do logo** em alta resolução.
- **Confirmação do número de WhatsApp** (ver acima).
