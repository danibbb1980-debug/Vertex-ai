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
| `mostrarExemplos` | `true`/`false`: mostra ou esconde os exemplos ilustrativos (marcas fictícias). |
| `prazoRascunho` | Texto do prazo do rascunho. Não prometa prazo exato. |
| `planos`, `inclusoEmTodos`, `naoIncluso` | Conteúdo dos cartões de planos. |

As mensagens do WhatsApp (geral, por plano e por segmento) ficam na função `waLink`, no mesmo arquivo.

Depois de editar, rode `npm run build` de novo.

## O 3D

- Um único canvas fixo atrás da página (`src/components/Stage3D.tsx` e `Scene3D.tsx`). As seções com fundo sólido cobrem o V; ele aparece no hero e no CTA final.
- O código do three.js fica num chunk separado, baixado só depois do `load`, em tempo ocioso.
- Fallback em SVG quando: `prefers-reduced-motion`, sem WebGL, renderização por software, `hardwareConcurrency <= 4`, `deviceMemory <= 4`, `saveData` ou erro.
- Para testar: `?no3d` força o fallback e `?force3d` força o 3D.

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
