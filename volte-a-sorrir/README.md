# Dentista Volte a Sorrir — site oficial

Site institucional da Dentista Volte a Sorrir (Alfenas – MG), com um molar 3D
animado no hero e foco em agendamento pelo WhatsApp. App Next.js independente
dentro do repositório da Vertex: tem o próprio `package.json` e build.

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 ·
Three.js + React Three Fiber · lucide-react.

## Rodando

```bash
cd volte-a-sorrir
npm install
npm run dev        # http://localhost:3000
npm run lint       # ESLint (eslint-config-next)
npm run typecheck  # tsc --noEmit
npm run build && npm start
```

TypeScript fica em 6.0 (como no `vip-shape/`): o `typescript-eslint` ainda não
suporta o TS 7.

### Deploy na Vercel

Importe o repositório e defina **Root Directory = `volte-a-sorrir`**. O
`vercel.json` fixa o framework em Next.js. Ao conectar o domínio oficial,
configure `NEXT_PUBLIC_SITE_URL` (ver `.env.example`): só então a tag canonical
é emitida, e Open Graph, sitemap e JSON-LD passam a usar o domínio.

## Antes de publicar

1. **WhatsApp.** O link usa o número do briefing, `wa.me/553597597180`. A
   fachada da clínica mostra **(35) 9 9759-7180** (com o nono dígito), que é o
   número exibido para ligações. Abra o link no celular e confirme que cai na
   conversa da clínica; se não cair, defina `NEXT_PUBLIC_WHATSAPP=5535997597180`.
2. **Responsável técnico (obrigatório).** O Código de Ética Odontológica exige
   nome e número de CRO do responsável técnico em toda divulgação da clínica.
   Preencha `technicalLead` em `lib/site.ts`; o rodapé passa a exibir a linha.
3. **Endereço e horário.** Ainda não confirmados. Preencha `streetAddress` e
   `openingHours` em `lib/site.ts` (o site e o JSON-LD usam automaticamente).
   Troque `mapsUrl` pelo link do perfil da clínica no Google, quando houver.
4. **Fotos de antes e depois.** Vêm dos posts do Instagram da própria clínica.
   Confirme que os pacientes autorizaram o uso também no site (termo de
   consentimento), conforme as regras de publicidade do CFO.

## Onde mudar cada coisa

| O quê | Onde |
|---|---|
| Telefone, WhatsApp, Instagram, endereço, horário, responsável técnico, tratamentos, casos | `lib/site.ts` (fonte única) |
| Perguntas do FAQ | `lib/faq.ts` |
| Dados estruturados (`Dentist` + `FAQPage`) | `lib/structured-data.ts` |
| Cores e tipografia | `app/globals.css` (`@theme`) e `app/layout.tsx` |
| Cena 3D (luz, material, animação) | `components/hero/ToothCanvas.tsx` |
| Quando carregar o 3D, pôster, pausa fora da tela | `components/hero/ToothStage.tsx` |

```
app/              layout (metadata, fontes), page, globals.css, OG image, ícones, robots, sitemap, manifest, 404
components/
  hero/           HeroSection (servidor), ToothStage (cliente), ToothCanvas (WebGL, carregado sob demanda)
  layout/         Header, MobileMenu, Footer, MobileCtaBar
  sections/       Intro, Treatments, Results + CaseViewer, Journey, Contact, Faq, FinalCta
  ui/             Button, Logo, BrandIcons, WaveMark/Eyebrow, Reveal, ClientEnhancements
lib/              site, faq, structured-data
public/brand/     logo original + versões derivadas
public/images/    pôster do dente, fotos de casos (public/images/casos)
public/models/    tooth-volte-a-sorrir.glb
scripts/          process-brand.py, generate-tooth.mjs, render-poster.mjs
```

## O dente 3D

**Origem.** Nenhum modelo de terceiros: a geometria é gerada por código em
`scripts/generate-tooth.mjs` (licença do próprio projeto). Um molar inferior
estilizado — coroa com cinco cúspides e sulcos oclusais, colo, tronco radicular
e duas raízes (mesial e distal) com curvatura distal — descrito como função de
distância (SDF), extraído com *surface nets*, simplificado com meshoptimizer
(64 mil triângulos) e exportado em GLB com quantização e compressão meshopt
(≈ 280 KB). As normais vêm do gradiente da SDF e as cores por vértice guardam a
variação de tom (esmalte branco, raiz marfim, sombra leve nos sulcos).

```bash
npm run model:tooth   # regenera public/models/tooth-volte-a-sorrir.glb (~1 min)
```

**Renderização.** `MeshPhysicalMaterial` com verniz (clearcoat), IOR do esmalte
e brilho suave. A iluminação é um estúdio procedural (painéis de luz renderizados
num mapa de ambiente PMREM), sem HDRI externo. Tone mapping neutro, para o
branco não acinzentar.

**Animação.** Entrada suave, flutuação vertical, balanço lento (sem giro
completo), leve inclinação, parallax de rolagem e reação limitada ao cursor
(só em computadores). Com `prefers-reduced-motion`, a cena fica parada na pose
final e o loop de renderização vira "sob demanda". A preferência é acompanhada
ao vivo.

**Performance.**
- O HTML, os textos e os CTAs do hero são Server Components; só o palco do
  dente roda no cliente. Three.js nunca entra no bundle inicial: é importado
  com `next/dynamic` (`ssr: false`) depois que a página pinta (`requestIdleCallback`).
- Um pôster WebP (≈ 22 KB) renderizado da própria cena aparece de imediato e some
  quando o primeiro quadro 3D é desenhado. O palco tem proporção fixa (4:5) e a
  câmera é a mesma em qualquer tela, então pôster e 3D coincidem.
- Sem WebGL, com economia de dados ativa, conexão 2G ou memória < 2 GB, fica
  só o pôster (com flutuação em CSS).
- A renderização para quando o hero sai da tela ou a aba fica oculta.
- `dpr` limitado a 1,5 no celular e 1,75 no desktop.

Para regenerar o pôster depois de mudar a cena: com `npm run dev` rodando,
`node scripts/render-poster.mjs` (requer Playwright com Chromium) e converta o
PNG para WebP (`public/images/tooth-poster.webp`).

## Logotipo

`public/brand/logo-original.jpg` é o arquivo enviado (640×1136, logo sobre
amarelo), mantido intacto. Não há versão vetorial oficial: os PNGs são
**derivados** desse raster por `scripts/process-brand.py`, sem redesenho.

- `logo-vertical.png` — símbolo + lettering, fundo removido.
- `logo-horizontal.png` — versão derivada para o cabeçalho: o mesmo símbolo e o
  mesmo lettering, reposicionados lado a lado.
- `logo-mark.png` — só o símbolo (usado nos ícones do app).
- `logo-on-yellow.png` — recorte quadrado com o amarelo original.

O fundo amarelo foi removido só por fora do dente: o traço amarelo dentro da
coroa faz parte do desenho e foi preservado. Como as raízes do símbolo são
brancas e sem contorno, **o logo deve ficar sempre sobre amarelo ou tons claros
e quentes** — por isso o cabeçalho é amarelo e o rodapé azul usa uma placa
amarela. A resolução de origem é baixa (≈ 350 px de largura útil): peça à
clínica o arquivo vetorial ou em alta resolução para materiais maiores.

## Decisões sobre conteúdo

- **Nada inventado.** Sem nome de dentista, equipe, CRO, especializações,
  tempo de experiência, avaliações ou depoimentos. Preço, convênio e prazos
  levam ao WhatsApp.
- **Tratamentos** vêm da parede da recepção (extração, implantes, obturação,
  canal, dentadura, ponte móvel) e dos posts (aparelho ortodôntico, coroa em
  porcelana e.max, clareamento caseiro ou em consultório, prótese parcial
  removível). As descrições explicam o que é cada tratamento, sem prometer
  resultado.
- **Antes e depois:** cinco casos recortados dos posts da clínica (sem os textos
  e marcas sobrepostos), com aviso de que resultados variam. A imagem de
  "clareamento dental" do material enviado parece ser de banco de imagens e
  **não** foi usada como caso da clínica.
- **JSON-LD** (`Dentist`): só cidade, estado, telefone, Instagram e serviços.
  Sem coordenadas, horário ou avaliações.

## Acessibilidade

Contraste AA em todos os textos (valores em `app/globals.css`), foco visível,
link "Pular para o conteúdo", menu mobile com Esc e foco gerenciado, abas de
casos com navegação por setas (padrão WAI-ARIA), FAQ com `<details>` nativo,
alvos de toque ≥ 44 px, conteúdo legível sem JavaScript e animações
desativadas com `prefers-reduced-motion`.
