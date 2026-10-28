# Site Dr. Gustavo Borges Andrade (rascunho)

Página única do consultório odontológico em Alfenas - MG, com páginas de
privacidade e 404. Vite + React + TypeScript + Tailwind 4. Estático, sem
backend, sem formulário, sem analytics.

> Esta pasta é um app separado dentro do repositório (como `vip-shape/`).
> Ela fica fora do `tsconfig.json` e das fontes do Tailwind do site principal.

```bash
cd dr-gustavo
npm install
npm run dev      # http://localhost:5173
npm run build    # gera dist/ já pré-renderizado (index, privacidade, 404)
npm run preview  # serve o dist/
```

## Onde editar

| O quê | Onde |
|---|---|
| Nome, CRO, WhatsApp, telefone, e-mail, Instagram, endereço, horários, acessibilidade, pagamentos, atendimentos, URL do site | `src/config.ts` |
| Textos (pilares, "para quem", etapas, FAQ, menu) | `src/content.ts` |
| Title, description, Open Graph, JSON-LD | `src/seo.ts` (lê o `config.ts`) |
| Cores, fontes, botões | `src/index.css` (bloco `@theme`) |

### Ligar e desligar seções
Em `src/config.ts`, `CONFIG.secoes`: `true` mostra, `false` esconde. Para uma
versão curta, desligue por exemplo `areas`, `paraQuem` e `estrutura`.
Cada atendimento também tem `mostrar: true/false`.

### Fotos e logo
- Foto do doutor: `referencias/foto-dr-gustavo-consultorio.png` (print do
  Instagram da clínica), em dois recortes em `public/fotos/`:
  `dr-gustavo-consultorio` (hero) e `dr-gustavo-retrato` (bloco "O
  profissional"), em AVIF e WebP. Para trocar, substitua os arquivos e
  ajuste `largura`/`altura` em `CONFIG.fotos`. Uma foto original (não print)
  deixaria tudo ainda mais nítido.
- Foto do consultório: coloque em `public/fotos/` e preencha
  `CONFIG.fotos.consultorio` (`{ src, alt }`). Sem foto, aparece um bloco
  reservado "Foto do consultório (substituir)".
- Logo: só o símbolo (dente + "GB" + traço), sem a assinatura,
  vetorizado a partir de `referencias/logo-dr-gustavo-alta.png`.
  `public/marca/logo.svg` (escuro) e `logo-claro.svg` (fundo escuro).
  Favicon, ícone do celular e `og.jpg` foram gerados a partir dele.
- Imagem de compartilhamento: `public/og.jpg` (1200×630). Se o CRO ou a
  foto mudarem, gere de novo.

### Tirar do modo rascunho
1. `src/config.ts`: `rascunho: false` (some a faixa e as metas `noindex`).
2. Apague `public/robots.txt` (ou troque por `Allow: /`).
3. Remova a linha `X-Robots-Tag` de `public/_headers` e de `vercel.json`.
4. Ajuste `siteUrl` para o domínio final.

## O que a clínica precisa confirmar
As marcações "a confirmar" estão desligadas na tela. Para revê-las,
use `marcarPendencias: true` em `src/config.ts`.

- Nome oficial do consultório ("Clínica Dr. Gustavo Odontologia" veio do
  Instagram; uma peça antiga usa "Clínica Odontológica RT Dr. Gustavo
  Borges Andrade").
- Número do CRO (CRO-MG 22797) e registro do estabelecimento
  (EPAO-M-4825, visto na peça antiga).
- Horários, inclusive a segunda-feira (a ficha do Google mostrou o rótulo de
  feriado) e o horário de quinta.
- Endereço e CEP.
- Especialidades registradas no CRO (`mostrarEspecialidades` está `false`;
  enquanto isso o texto fala em "atuação em ortodontia, implantes e clínica
  geral").
- Se oferece procedimentos estéticos orofaciais e em que termos.
- Acessibilidade (entrada, banheiro e estacionamento para cadeirantes).
- Formas de pagamento (crédito, débito, aproximação).
- Fotos do consultório e, se possível, as fotos originais (não prints).
- Se pode mostrar a nota do Google (`mostrarNotaGoogle`, desligado).

## Como foi feito
- HTML pré-renderizado no build (`scripts/prerender.mjs`): o conteúdo já
  chega pronto, e o React só "hidrata" a página. CSS embutido no HTML e
  fonte do título pré-carregada.
- Fontes self-hosted (Fraunces, Manrope e Pinyon Script, só na assinatura),
  com fontes de fallback de métricas ajustadas para não deslocar o layout.
- Movimento só com transform e opacity, pausado fora da tela, desligado com
  `prefers-reduced-motion`. Rolagem suave com Lenis.
- Mapa do Google só carrega quando a pessoa clica (sem cookies de terceiros
  antes disso).
- Componentes de referência do 21st.dev: "Stacking Cards" (código adaptado em
  `src/components/StackingCards.tsx`); "Vertical Cut Reveal", "Ghost
  Accordion", "Magnetic Button" e "Logo Marquee" serviram de referência e
  foram reimplementados sem dependências.

## Deploy
- Vercel: projeto com *Root Directory* `dr-gustavo` (o `vercel.json` desta
  pasta define build e cabeçalhos).
- Netlify Drop (plano B): `npm run build`, depois
  `cd dist && zip -r ../site-dr-gustavo-borges.zip . -x "*.DS_Store"` e
  arraste o zip. O `_headers` já vai junto.
