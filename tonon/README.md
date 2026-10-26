# Laboratório Tonon — site oficial

Site institucional de **Matheus Tonon / Laboratório Tonon** (São João da Boa
Vista – SP), com um hero 3D interativo — coroa cerâmica sobre pilar e implante
de titânio — e foco em levar o visitante ao WhatsApp. App Next.js
independente dentro do repositório da Vertex: tem o próprio `package.json` e build.

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 ·
three.js + React Three Fiber + drei · lucide-react. Sem framer-motion: as
animações de interface são CSS; a do objeto 3D roda no loop do R3F. Tudo
respeita `prefers-reduced-motion`.

## Rodando

```bash
cd tonon
npm install
npm run dev        # http://localhost:3000
npm run lint       # ESLint (eslint-config-next)
npm run typecheck  # tsc --noEmit
npm run build && npm start
```

TypeScript fica em 6.0 (como no `vip-shape/`) porque o `typescript-eslint`
ainda não suporta o TS 7.

### Deploy na Vercel

Importe o repositório e defina **Root Directory = `tonon`**. O `vercel.json`
fixa o framework em Next.js (com o preset "Other" a Vercel publica sem as rotas
do Next e o site responde 404). Ao conectar o domínio oficial, configure
`NEXT_PUBLIC_SITE_URL` (ver `.env.example`): só então a tag canonical é
emitida, e Open Graph, sitemap e JSON-LD passam a usar o domínio.

## Onde mudar cada coisa

| O quê | Onde |
|---|---|
| Endereço, WhatsApp, links, horários, comodidades, mensagens, fotos e casos | `lib/site-data.ts` (fonte única) |
| Perguntas frequentes (também viram JSON-LD) | `lib/faq.ts` |
| Dados estruturados (LocalBusiness + FAQPage) | `lib/structured-data.ts` |
| Cores, tipografia e contrastes | `app/globals.css` (`@theme`) e `app/layout.tsx` |
| Assinatura tipográfica (logotipo provisório) | `components/ui/Wordmark.tsx` |
| Forma da coroa | `lib/three/crown-geometry.ts` |
| Pilar e implante | `lib/three/implant-geometry.ts` |
| Materiais, luz e movimento do 3D | `components/hero/DentalScene.tsx` |

```
app/            layout (metadata, fontes), page, globals.css, OG image, icon, manifest, robots, sitemap, 404
components/
  hero/         Hero (texto), HeroVisual (pôster + carregamento do 3D), HeroCanvas, DentalScene
  layout/       Header (menu mobile), Footer
  sections/     Positioning, About, Cases, Approach, Visit, Faq, FinalCta
  ui/           Button, Reveal, SectionLabel, Wordmark, CompareSlider, OpenStatus,
                FloatingWhatsApp, BrandIcons, ClientEnhancements
lib/            site-data, faq, structured-data
lib/three/      noise, crown-geometry, implant-geometry, build-geometries
public/images/  retrato e casos (antes/depois)
public/hero/    pôster do 3D (WebP) e versão PNG para a imagem de compartilhamento
scripts/        prepare-images.mjs, capture-poster.mjs
```

## O objeto 3D

Toda a geometria é **procedural**, gerada no navegador — nenhum modelo é baixado:

- **Coroa** (`crown-geometry.ts`): molar com planta romboide, constrição
  cervical, quatro cúspides de alturas diferentes, cristas triangulares e
  marginais, sulcos sinuosos, fossa central e fossetas. Ruído fractal de baixa
  amplitude e cor por vértice (cervical mais quente, cúspides mais claras,
  leve caracterização nos sulcos) evitam o aspecto de plástico.
- **Pilar e implante** (`implant-geometry.ts`): perfis usinados com anéis,
  ombro de assentamento e acesso do parafuso; pescoço com microrroscas; corpo
  com rosca helicoidal de passo constante e ápice com três canais de corte.
- **Luz**: estúdio montado com `Lightformer`s do drei (nada de HDR externo);
  o fundo do estúdio usa o mesmo azul do hero, por isso o metal o reflete.

Para trocar por um modelo `.glb` profissional no futuro, substitua as malhas em
`DentalScene.tsx` por um `useGLTF` — o restante (luz, movimento, pôster,
carregamento) continua valendo.

**Movimento:** flutuação lenta, paralaxe pelo ponteiro (só desktop) e "vista
explodida" ao rolar o hero (a coroa sobe e aparecem as anotações). Com
movimento reduzido, o objeto fica parado na pose inicial.

**Desempenho:**

- o hero é renderizado no servidor; o LCP é texto ou o pôster estático;
- o pacote do three.js (~270 KB gzip) só é baixado **depois do evento `load`**,
  num momento ocioso, e só se houver WebGL;
- a geometria é gerada em etapas (cedendo a thread entre as peças), e os
  shaders são compilados de forma assíncrona antes de o canvas aparecer;
- celulares e máquinas modestas usam o modo leve: malhas menores, materiais
  mais simples e cerca de 30 fps; o `PerformanceMonitor` baixa a resolução se o FPS cair;
- o loop pausa quando o hero sai da tela ou a aba fica oculta;
- sem WebGL (ou enquanto ele carrega) aparece `public/hero/poster.webp`, uma
  foto da própria cena.

Depois de mudar a geometria, a luz ou a câmera, **gere o pôster de novo**:

```bash
npm run build && npm start      # em outro terminal
npm run poster                  # requer Playwright: npm i -D playwright && npx playwright install chromium
```

## Imagens

- `public/images/casos/*` vêm das composições de antes/depois enviadas
  (publicadas no Instagram de Matheus Tonon). O script
  `scripts/prepare-images.mjs` separa cada composição em "antes" e "depois",
  sem retoque. Para refazer: `npm run images -- <pasta-com-os-originais>`.
- O caso 01 tem resolução baixa (656 px de largura) porque o original é uma
  composição de três painéis; substitua por um original melhor se houver.
- `public/images/matheus-tonon.jpg` é um recorte do retrato enviado.

## Decisões sobre conteúdo

- **Nada inventado.** Sem títulos, diplomas, certificações, prêmios, tempo de
  experiência, número de pacientes, depoimentos ou estatísticas. Sem "Dr.".
  A faixa de números da referência visual foi substituída por valores da marca, em texto.
- Os casos têm rótulos que descrevem a foto ("Vista lateral", "Cor e
  contorno"), não o procedimento, e vêm com o aviso de que cada caso depende de
  avaliação individual.
- JSON-LD com tipo genérico `LocalBusiness` (não assumimos uma categoria mais
  específica), sem avaliações, coordenadas, e-mail ou CNPJ.
- Status "Aberto agora" calculado no navegador, no fuso America/Sao_Paulo.
- O mapa usa o endpoint público de incorporação do Google Maps (sem chave de
  API), pelo endereço. Se for bloqueado, aparece o endereço e o botão
  "Como chegar" abre o link oficial.

## Pendências para o cliente

- **Autorização de imagem:** confirmar que os pacientes autorizaram o uso das
  fotos de antes/depois também no site (elas já estão no Instagram, mas o site
  é outro meio).
- **Logotipo:** a assinatura "TONON / Laboratório" é tipográfica e provisória.
  Troque pelo vetor oficial em `components/ui/Wordmark.tsx`.
- **Domínio:** configurar `NEXT_PUBLIC_SITE_URL` ao conectar o domínio.
- Conferir no celular que `https://wa.me/5519981357500` abre a conta certa.
