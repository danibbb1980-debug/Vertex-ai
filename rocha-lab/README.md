# Laboratório de Prótese Dentária Rocha — site (rascunho)

Site B2B, voltado a cirurgiões-dentistas, do Laboratório de Prótese Dentária Rocha
(São João da Boa Vista - SP). Página única, contato só pelo WhatsApp.

Vite · React · TypeScript · Tailwind CSS 4 · motion. Projeto estático, sem backend.
App independente dentro do repositório da Vertex (fora do `tsconfig` e do Tailwind do site principal).

```bash
cd rocha-lab
npm install
npm run dev     # desenvolvimento
npm run build   # gera dist/ (com o HTML já pré-renderizado)
```

## Publicar no Netlify Drop

```bash
npm run build
cd dist && zip -r ../site-rocha-lab.zip . -x "*.DS_Store"
```

Arraste o `site-rocha-lab.zip` (o `index.html` fica na raiz do zip, junto com `_headers`).

## Onde mudar cada coisa

| O quê | Onde |
|---|---|
| Todos os dados (endereço, horários, WhatsApp, mensagens, trabalhos, nota do Google, CRO) | `src/config.ts` |
| Faixa de rascunho e noindex das metas | `CONFIG.rascunho` em `src/config.ts` |
| Domínio usado no canonical, Open Graph e JSON-LD | `CONFIG.siteUrl` |
| Cores e fontes | `src/index.css` (`@theme`) |
| Logo (assinatura temporária em SVG) | `Logo` e `Simbolo` em `src/components/ui.tsx`; favicon em `public/favicon.svg` |
| Imagem de compartilhamento | `public/og.jpg` (1200 × 630) |

Valores `null` em `src/config.ts` (CRO, formação, nota do Google) aparecem no site como
placeholder "a confirmar". Ao preencher, o placeholder some sozinho. A nota do Google só
aparece quando `nota` **e** `avaliacoes` estiverem preenchidas com os valores reais.

### Trocar fotos

1. Coloque a foto original (JPG/PNG/WebP) em `referencias/fotos/` com um nome curto, ex.: `coroa-ceromero.jpg`.
2. Rode `python3 scripts/otimizar-fotos.py` (precisa de Pillow): gera `public/fotos/coroa-ceromero.webp`
   e, se tiver mais de 700 px de largura, também a versão `-640`.
3. Em `src/config.ts`, no trabalho correspondente, preencha `foto: 'coroa-ceromero'`,
   `fotoTamanho: [largura, altura]` e `fotoAlt`.

Trabalhos com `foto: null` mostram o bloco "Foto do trabalho (substituir)". Fotos com menos de
700 px aparecem montadas sobre um passe-partout, sem ampliação exagerada. Não use fotos de
pacientes nem antes e depois. Fotos reais que não entraram no site estão em `referencias/fotos/extras/`.

### Trocar a logo

A logo real recebida tem só 96 px (`referencias/logo.png`), pequena demais para o site. Por isso
há uma assinatura temporária em SVG inspirada nela. Com o arquivo vetorial (SVG ou PDF) da logo,
substitua o conteúdo de `Simbolo`/`Logo` em `src/components/ui.tsx` e o `public/favicon.svg`.

### Desligar o rascunho (quando tudo estiver aprovado)

1. `CONFIG.rascunho = false` e `CONFIG.siteUrl` com o domínio definitivo.
2. Em `public/_headers`, remova a linha `X-Robots-Tag: noindex, nofollow`.
3. Em `public/robots.txt`, troque `Disallow: /` por `Allow: /`.
4. Em `public/privacidade.html` e `public/404.html`, remova a faixa `<div class="faixa">` e as metas `noindex`.

## O que o laboratório precisa confirmar

- [ ] Registro no CRO-SP do laboratório e do responsável técnico
- [ ] Formação e título profissional de Matheus Rocha (o site não usa "especialista" nem "técnico" até confirmar)
- [ ] "Mais de 16 anos de dedicação à prótese dentária" (dado do Instagram)
- [ ] Horários (ficha do Google: seg. a sex. 08h00–12h00 e 13h30–18h00)
- [ ] Prazos de referência e logística de retirada e entrega
- [ ] Fluxo digital: se mantém o bloco, formatos de arquivo aceitos e casos atendidos
- [ ] Trabalhos vindos só da ficha do Google ou de posts: coroa E.max, protocolo sobre implantes,
      provisórios impressos sobre implantes, glaze/estratificação de facetas
- [ ] Se atende dentistas de outras cidades
- [ ] Nota e quantidade de avaliações do Google (só com valores reais)
- [ ] Textos dos compromissos de atendimento (Precisão, Acabamento, Comunicação, Prazos)
- [ ] Fotos dos trabalhos sem imagem (cerômero, E.max, provisórios impressos) e fotos em melhor resolução
- [ ] Logo em arquivo vetorial
- [ ] Domínio definitivo e responsável pelo tratamento de dados (página de privacidade)

## Notas técnicas

- `npm run build` pré-renderiza o HTML (`scripts/prerender.mjs`): o conteúdo aparece antes do JavaScript.
- Fraunces e Manrope (Google Fonts) são servidas pelo próprio site, com `font-display: swap`:
  mais rápido e sem enviar o IP do visitante ao Google.
- Sem analytics, pixels, cookies próprios ou formulário. O mapa do Google é o único conteúdo de terceiros embutido.
- Animações respeitam `prefers-reduced-motion`.
