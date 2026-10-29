import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { CONFIG } from './src/config'
import { jsonLd } from './src/lib/seo'

/** Injeta no index.html os dados de SEO vindos de src/config.ts. */
function seoDoConfig(): Plugin {
  const titulo = `${CONFIG.nome} Unidade ${CONFIG.unidades[0].nome} | Dentista em ${CONFIG.cidade} - ${CONFIG.uf}`
  const descricao = `${CONFIG.posicionamento} em ${CONFIG.cidade} - ${CONFIG.uf}. Avaliação individual, explicações claras e atendimento com hora marcada. Agende pelo WhatsApp.`
  const url = CONFIG.siteUrl.replace(/\/$/, '')
  const ogImage = `${url}/og.png`
  const robots = CONFIG.rascunho
    ? `<meta name="robots" content="noindex, nofollow" />\n    <meta name="googlebot" content="noindex, nofollow" />`
    : `<meta name="robots" content="index, follow" />`
  const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
  return {
    name: 'seo-do-config',
    transformIndexHtml(html) {
      return html
        .replace(/%TITULO%/g, esc(titulo))
        .replace(/%DESCRICAO%/g, esc(descricao))
        .replace(/%URL%/g, url)
        .replace(/%OG_IMAGE%/g, ogImage)
        .replace('<!--ROBOTS-->', robots)
        .replace(
          '<!--JSONLD-->',
          `<script type="application/ld+json">${JSON.stringify(jsonLd(CONFIG)).replace(/</g, '\\u003c')}</script>`,
        )
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), seoDoConfig()],
  // O código é React; no bundle, o Preact (compatível com a API do React) entra no lugar
  // para um JavaScript cerca de 3x menor. Para voltar ao React puro, remova este alias.
  resolve: {
    alias: {
      'react-dom/server': 'preact-render-to-string',
      'react-dom/client': 'preact/compat/client',
      'react/jsx-runtime': 'preact/jsx-runtime',
      'react/jsx-dev-runtime': 'preact/jsx-dev-runtime',
      react: 'preact/compat',
      'react-dom': 'preact/compat',
    },
    dedupe: ['preact'],
  },
  ssr: { noExternal: ['lucide-react'] },
  build: { target: 'es2020', cssCodeSplit: true },
})
