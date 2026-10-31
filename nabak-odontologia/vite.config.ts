import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { CONFIG } from './src/config'
import { headTags, noscriptHtml, pagina404, paginaPrivacidade } from './src/seo'

/** Injeta metas/JSON-LD e gera privacidade.html e 404.html a partir de src/config.ts. */
function nabakHead(): Plugin {
  return {
    name: 'nabak-head',
    transformIndexHtml(html) {
      return html
        .replace('<html lang="pt-BR">', `<html lang="pt-BR" data-rascunho="${CONFIG.rascunho}">`)
        .replace('<!--HEAD-->', headTags())
        .replace('<!--NOSCRIPT-->', noscriptHtml())
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === '/privacidade.html') {
          res.setHeader('Content-Type', 'text/html; charset=utf-8')
          return res.end(paginaPrivacidade())
        }
        next()
      })
    },
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'privacidade.html', source: paginaPrivacidade() })
      this.emitFile({ type: 'asset', fileName: '404.html', source: pagina404() })
    },
  }
}

/** Pré-carrega as duas fontes usadas acima da dobra (somente no build). */
function fontPreload(): Plugin {
  return {
    name: 'nabak-font-preload',
    transformIndexHtml: {
      order: 'post',
      handler(html, ctx) {
        if (!ctx.bundle) return html
        const links = Object.keys(ctx.bundle)
          .filter((f) => /(cormorant-garamond-latin-400-normal|manrope-latin-wght-normal).*\.woff2$/.test(f))
          .map((f) => `<link rel="preload" href="/${f}" as="font" type="font/woff2" crossorigin />`)
          .join('\n    ')
        return html.replace('</title>', `</title>\n    ${links}`)
      },
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), nabakHead(), fontPreload()],
  build: { target: 'es2020', cssCodeSplit: false },
})
