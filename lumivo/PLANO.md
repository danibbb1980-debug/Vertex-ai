# Plano — site da Lumivo Web

Site de uma página, mobile-first, em `lumivo/` (app independente do site da Vertex na raiz e da `vip-shape/`).

## Stack
Vite 8 + React 19 + TypeScript + Tailwind CSS 4 (só reset e utilitários; o visual vive em `src/styles/globals.css` com tokens CSS) + `motion` (LazyMotion, features carregadas sob demanda) + Lenis (só ponteiro fino, import dinâmico). Sem GSAP: `useScroll`/`useTransform` resolvem scrub, pilha e parallax. Pré-render estático no build (`scripts/prerender.mjs`): o HTML já sai com todo o conteúdo e o React hidrata.

## Pastas
```
lumivo/
  index.html                 shell (meta, preload de fonte, JSON-LD injetado no build)
  scripts/prerender.mjs      SSR -> dist/index.html, robots, sitemap, _headers
  public/                    fontes WOFF2, favicon, og.png, manifest, privacidade/
  referencias/               logo original enviado pelo Pedro
  src/
    config.ts                todo o conteúdo (única fonte de verdade)
    main.tsx / entry-server.tsx / App.tsx
    motion/                  tokens.ts, useReducedMotion, useLenis, SplitWords, Reveal, features
    components/              Header, Menu, Logo, Hero, PalavraLuz, Conceito, Vitrine, Marquee,
                             ProcessoPilha, SeletorDispositivo, Servicos (+ ilustracoes/),
                             Metodo (+ icones), CardCTA, Sobre, Rodape, ProgressoLeitura,
                             quiz/ (Quiz, perguntas, mensagem)
    styles/globals.css
```

## Animações (gatilho → efeito)
| Seção | Gatilho | Efeito | Mecanismo |
|---|---|---|---|
| Hero | fontes prontas (classe `fonts-ok`) | linhas do título sobem por máscara, cartão de provas e botão em sequência | CSS keyframes (roda antes da hidratação, LCP rápido) |
| Palavra LUMIVO | scroll (scrub) | sobe a 0.6x e um feixe de luz âmbar varre a palavra | useScroll + variável CSS |
| Conceito / Sobre | scroll (scrub) | palavras de 25% a 100% de opacidade | SplitWords |
| Vitrine | entrada na viewport | notebook rotateX 12° → 0 | motion whileInView |
| Marquee | contínuo, pausa fora da tela/toque | translateX infinito | CSS animation + IntersectionObserver |
| Processo | scroll (sticky) | cartões empilham, o anterior encolhe e escurece | sticky + useScroll |
| 3 telas | toque nos chips / auto 3s | mockup morfa de proporção | motion layout |
| Serviços | entrada | divisória desenha; micro-ilustração em loop só quando visível | CSS + IO |
| Método | scroll | linha preenche; passo acende a 60%; ícone toca uma vez | useScroll + useInView |
| CTA | scroll (sticky) | cartão cresce de 0.92 a 1, raio e texto secundário | useScroll |
| Quiz | abrir/avançar | flash claro com a marca; slide entre perguntas; barra segmentada | AnimatePresence |

Assinatura por viewport: hero (entrada) → feixe de luz na palavra → pilha → morph → CTA. O resto é sutil.

## Ordem de trabalho
Etapas 1–7 da seção 10 do briefing, validando cada seção em 390×844 com Playwright.
