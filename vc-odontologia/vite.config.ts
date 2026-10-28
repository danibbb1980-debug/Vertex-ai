import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { CONFIG } from './src/config'
import { jsonLd } from './src/lib/schema'

/** Preenche o <head> do index.html com os dados do CONFIG (SEO e rascunho). */
function headDoConfig(): Plugin {
  const esc = (s: string) =>
    s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  return {
    name: 'vc-head-do-config',
    transformIndexHtml(html) {
      const url = CONFIG.siteUrl.replace(/\/$/, '')
      const robots = CONFIG.rascunho ? 'noindex, nofollow' : 'index, follow'
      const tags = [
        `<title>${esc(CONFIG.titulo)}</title>`,
        `<meta name="description" content="${esc(CONFIG.descricao)}" />`,
        `<meta name="robots" content="${robots}" />`,
        `<meta name="googlebot" content="${robots}" />`,
        `<link rel="canonical" href="${url}/" />`,
        `<meta property="og:type" content="website" />`,
        `<meta property="og:locale" content="pt_BR" />`,
        `<meta property="og:site_name" content="${esc(CONFIG.nome)}" />`,
        `<meta property="og:title" content="${esc(CONFIG.titulo)}" />`,
        `<meta property="og:description" content="${esc(CONFIG.descricao)}" />`,
        `<meta property="og:url" content="${url}/" />`,
        `<meta property="og:image" content="${url}/og-image.jpg" />`,
        `<meta property="og:image:width" content="1200" />`,
        `<meta property="og:image:height" content="630" />`,
        `<meta property="og:image:alt" content="${esc(`Dr. Tales Vilhena e Dr. Otávio Carvalho na recepção da ${CONFIG.nome}, em Alfenas - MG`)}" />`,
        `<meta name="twitter:card" content="summary_large_image" />`,
        `<meta name="geo.placename" content="${esc(`${CONFIG.endereco.cidade} - ${CONFIG.endereco.uf}`)}" />`,
        `<script type="application/ld+json">${JSON.stringify(jsonLd()).replace(/</g, '\\u003c')}</script>`,
      ]
      return html.replace('<!--head-->', tags.join('\n    '))
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), headDoConfig()],
  build: {
    target: 'es2020',
    cssCodeSplit: false,
    assetsInlineLimit: 0,
  },
})
