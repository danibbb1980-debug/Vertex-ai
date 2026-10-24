# Site da Vertex Web Studios

Site institucional com o V da logo em 3D. Vite + React + TypeScript + Tailwind + motion + three / @react-three/fiber. Estático, sem backend, sem cookies e sem analytics.

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # gera dist/ (com o HTML pré-renderizado)
npm run preview   # serve o dist/ em http://localhost:4173
```

## Editar dados: `src/config.ts`

Tudo que muda de um estúdio para outro está nesse arquivo:

| Campo | O que é |
|---|---|
| `whatsapp` | Número no formato `55DDNÚMERO`, só dígitos. Todos os botões usam este número. |
| `instagram` | URL completa do perfil. Vazio = os botões do Instagram somem. |
| `email` | Opcional. Vazio = oculto. |
| `siteUrl` | URL pública, sem barra no final. Vai para canonical, og:url, sitemap, robots e JSON-LD. Troque quando conectar o domínio próprio. |
| `razaoSocial` | Aparece no rodapé, ao lado do CNPJ. Vazio = oculto. |
| `fotoResponsavel`, `nomeResponsavel` | Foto opcional na seção "Sobre". Coloque a imagem em `public/` (ex.: `/responsavel.webp`). |
| `mostrarPrecos` | `true`/`false`: mostra ou esconde a seção de planos. |
| `mostrarExemplos` | `true`/`false`: mostra ou esconde a seção de projetos. |
| `prazoRascunho` | Texto do prazo do rascunho. Não prometa prazo exato. |
| `planos`, `inclusoEmTodos`, `naoIncluso` | Conteúdo dos cartões de planos. |

As mensagens do WhatsApp (geral, por plano e por segmento) ficam na função `waLink`, no mesmo arquivo.

## Projetos: `src/projetos.ts`

Nome, segmento, cidade, status, objetivo, decisão de design e link de cada projeto da seção "Projetos".
Só use links abertos ao público (rascunhos protegidos por login na Vercel ficam sem link) e não invente resultados.
As capturas ficam em `public/exemplos/` (em 640, 960 e 1200 px).
Os arquivos originais, em alta resolução, ficam em `referencias/projetos/`.

Depois de editar, rode `npm run build` de novo.

## O 3D

- Um único canvas fixo atrás da página (`src/components/Stage3D.tsx` e `Scene3D.tsx`). As seções com fundo sólido cobrem o V; ele aparece no hero e no CTA final.
- O código do three.js fica num chunk separado, baixado só depois do `load`, em tempo ocioso.
- Fallback em SVG quando: `prefers-reduced-motion`, sem WebGL, renderização por software, `hardwareConcurrency <= 4`, `deviceMemory <= 4`, `saveData` ou erro.
- Para testar: `?no3d` força o fallback e `?force3d` força o 3D.

## Hero 3D e vídeo para aparelhos sem GPU

O fundo do hero é uma cena WebGL (`src/components/HeroGL.tsx`): o V em vidro cercado pelas capturas reais.
A decisão de quem recebe o quê fica em `heroPlan()` (`src/lib/webgl.ts`):

- desktop com GPU: cena completa; celular ou aparelho modesto: versão leve;
- movimento reduzido: cena parada;
- sem GPU (ex.: Windows com "Microsoft Basic Render Driver"): vídeo gravado da cena (`public/hero/`).

Testes na URL: `?debug3d` (mostra o caminho e o motivo), `?force3d`, `?video3d`, `?no3d`.

**Regravar o vídeo** (depois de trocar capturas ou a composição):

```bash
npm run build && npm run preview   # em outro terminal
npm i --no-save playwright-core
CHROME=/caminho/do/chrome OUT=gravacao-hero node scripts/gravar-hero.mjs
ffmpeg -y -framerate 24 -i gravacao-hero/f%04d.png -c:v libvpx-vp9 -b:v 0 -crf 42 -row-mt 1 -pix_fmt yuv420p -an public/hero/hero-loop.webm
ffmpeg -y -framerate 24 -i gravacao-hero/f%04d.png -c:v libx264 -crf 28 -preset slow -pix_fmt yuv420p -movflags +faststart -an public/hero/hero-loop.mp4
node -e 'require("sharp")("gravacao-hero/poster.png").webp({quality:80}).toFile("public/hero/hero-poster.webp")'
```

## Publicar

**Vercel** (já configurado em `vercel.json`): importe o repositório, defina **Root Directory = `vertex-site`**. Framework Vite, build `npm run build`, saída `dist`.

**Netlify**: base directory `vertex-site`, build command `npm run build`, publish directory `vertex-site/dist`. Ou arraste o ZIP gerado abaixo para o painel do Netlify Drop.

**ZIP do site pronto** (com `index.html` na raiz do zip):

```bash
npm run build
cd dist && zip -r ../site-vertex-web-studios.zip . -x "*.DS_Store"
```

## Assets

`referencias/logo-vertex.png` é a logo oficial. `node scripts/assets.mjs` regenera `public/og.png` (1200x630) e os ícones a partir dela (requer `sharp`, já nas devDependencies).
