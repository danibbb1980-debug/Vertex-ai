# Araujo Estética Automotiva · site (rascunho)

Página única estática para a Araujo Estética Automotiva, de Poços de Caldas - MG.
Vite + React + TypeScript + Tailwind (utilitários) · pré-renderizado (o conteúdo
existe sem JavaScript) · sem backend, sem cookies, sem analytics.

```bash
npm install
npm run dev        # desenvolvimento
npm run build      # gera dist/ (HTML estático + JS para interações)
npm run preview    # serve dist/ em http://localhost:4173
```

## ⚠️ O que falta para publicar de forma definitiva

1. **"Caixaria"**: confirmar com a Araujo o que exatamente significa no perfil e
   como querem descrever cada serviço. Hoje as descrições são gerais e conservadoras.
2. **Outros serviços** (polimento, vitrificação, cristalização, película, proteção de
   pintura): estão em `src/config.ts` com `ativo: false` e **não aparecem em lugar
   nenhum** (nem no JS publicado). Ligar só depois que a empresa confirmar o que
   oferece e como quer divulgar.
3. **Nome do proprietário**: só se ele quiser aparecer (`proprietario` no config).
4. **Autorização escrita para os vídeos** (uma mensagem no WhatsApp serve) antes de
   publicar de forma definitiva. Pedir também os **arquivos originais**, sem marca-d'água.
5. **Logo**: o logo oficial está em `./referencias/logo-araujo-referencia.jpg` (JPG
   com fundo preto). Pedir ao cliente o **arquivo vetorial ou PNG com fundo
   transparente**. O monograma do site foi recortado do próprio JPG.
6. **Testar o link wa.me** (`https://wa.me/5535999824488`) num celular com WhatsApp.
7. Desligar o rascunho (abaixo) e atualizar `siteUrl`.

## Editar o conteúdo: `src/config.ts`

Tudo o que aparece no site vem desse arquivo. Campo vazio = o bloco não aparece
(não existe placeholder).

| O quê | Onde |
|---|---|
| Endereço, links do Maps e de rota | `endereco`, `mapsUrl`, `rotaUrl`, `mapaEmbedUrl` |
| WhatsApp | `whatsapp` (só dígitos, com 55) e `whatsappExibicao`; `usarWhatsapp` liga/desliga botões e formulário |
| Instagram | `instagram` |
| Horários | `horarios` (fuso `America/Sao_Paulo`) e `avisoHorarios` |
| Serviços | `servicos` → cada item tem `ativo: true/false` |
| Seções | `secoes` → `true/false` para cada seção |
| Abertura (cortina) | `intro` (padrão `false`) |
| URL publicada | `siteUrl` (canonical e Open Graph; nunca localhost) |

## Desligar o rascunho

1. `src/config.ts` → `rascunho: false` (tira a faixa e troca as metas para `index, follow`).
2. `public/robots.txt` → trocar `Disallow: /` por `Allow: /`.
3. Apagar a regra `X-Robots-Tag` de `public/_headers` e de `vercel.json`.

## Vídeos e fotos (seção "Trabalhos")

A seção só existe se houver mídia. A lista é montada no build a partir de:

- `public/videos/*.mp4` (no máximo 3) com pôster `.webp` de mesmo nome;
- `public/fotos/*` (jpg, png, webp, avif) — só fotos **autorizadas**, sem cliente
  identificável nem placa legível.

Sem arquivos nessas pastas, a seção e o item do menu somem e a numeração se refaz.

**Origem dos vídeos atuais**: dois vídeos do Instagram da própria Araujo
(@araujo_estetica.aut), enviados pelo vendedor e guardados em `./referencias/videos/`.
Foram inspecionados quadro a quadro: sem rosto, sem placa legível, sem texto. Um
terceiro vídeo foi descartado (tinha texto sobreposto no centro, sem como recortar), e
trechos com folha de papel no para-brisa e com a frente do carro foram cortados.

**Adicionar ou trocar um vídeo** (limites: mudo, 4 a 8 s, ≤ 720 px, ≤ 3 MB, ideal 1–2 MB):

```bash
ffmpeg -ss INICIO -t DURACAO -i referencias/videos/original.mp4 -an \
  -c:v libx264 -preset slow -crf 26 -r 30 -pix_fmt yuv420p -movflags +faststart \
  -vf "scale=360:640" public/videos/trabalho-3.mp4
ffmpeg -ss SEGUNDO_BOM -i referencias/videos/original.mp4 -frames:v 1 \
  -vf scale=360:640 -c:v libwebp -quality 72 public/videos/trabalho-3.webp
```

Legenda: só quando o serviço for evidente no vídeo, em `legendasTrabalhos`
(`{ "trabalho-3": "Higienização" }`). Os vídeos só carregam ao entrar na tela e,
com "reduzir movimento" ou economia de dados, aparece só o pôster.

**Comparador antes/depois**: coloque o par autorizado em `public/fotos/` e preencha
`antesDepois: [{ antes: "x-antes.jpg", depois: "x-depois.jpg", alt: "..." }]`.

## Trocar o logo

Substitua `src/assets/mono-96.webp`, `mono-160.webp`, `logo-320.webp`,
`public/monograma.png`, `public/favicon.ico`, `favicon-32.png`,
`apple-touch-icon.png` e `icon-512.png` mantendo os nomes. Com o arquivo vetorial do
cliente, basta exportar nesses tamanhos.

## Publicação

- **Vercel**: `vercel.json` já define build, saída `dist/` e o cabeçalho noindex.
  Projeto sugerido: `araujo-estetica-automotiva-rascunho`.
- **Qualquer hospedagem estática** (Netlify, Cloudflare Pages): publicar o `dist/`;
  `_headers` leva o `X-Robots-Tag`.
