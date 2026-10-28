import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { headTags } from './src/seo'
import { CONFIG } from './src/config'

/** Injeta title, description, canonical, Open Graph, robots e JSON-LD a partir de src/config.ts. */
function seoHead(): Plugin {
  return {
    name: 'seo-head',
    transformIndexHtml: (html) =>
      html
        .replace('<!--seo-head-->', headTags())
        .replace('<html lang="pt-BR">', `<html lang="pt-BR" data-rascunho="${CONFIG.rascunho}">`)
        .replace('</head>', `  <script>document.documentElement.classList.add('js')</script>\n  </head>`),
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), seoHead()],
  build: { target: 'es2022', cssCodeSplit: false },
})
