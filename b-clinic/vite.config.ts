import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { CONFIG } from './src/config'
import { jsonLd } from './src/lib/seo'

const base = CONFIG.siteUrl.replace(/\/$/, '') + '/'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'b-clinic-head',
      transformIndexHtml(html, ctx) {
        const fonte = Object.keys(ctx.bundle ?? {}).find((f) => /jost-latin-wght/.test(f))
        const preload = fonte
          ? `<link rel="preload" href="/${fonte}" as="font" type="font/woff2" crossorigin />`
          : ''
        const robots = CONFIG.rascunho
          ? '<meta name="robots" content="noindex, nofollow" />\n    <meta name="googlebot" content="noindex, nofollow" />'
          : ''
        return html
          .replace('<!--ROBOTS-->', robots + preload)
          .replaceAll('%SITE_URL%', base)
          .replace('<!--JSONLD-->', `<script type="application/ld+json">${jsonLd()}</script>`)
      },
    },
  ],
})
