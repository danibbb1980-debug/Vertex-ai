import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { CONFIG } from './src/config.ts'

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

/** Injeta SEO, Open Graph, noindex e JSON-LD no index.html a partir do src/config.ts */
function seo(): Plugin {
  const url = CONFIG.siteUrl.replace(/\/$/, '')
  const title = `${CONFIG.nome} | Massoterapeuta e Depiladora em ${CONFIG.cidade} - ${CONFIG.uf}`
  const description = `Massoterapia, depilação e estética facial e corporal com hora marcada, em ${CONFIG.cidade} - ${CONFIG.uf}. Atendimento individual, com avaliação antes de cada procedimento.`
  const ogImage = `${url}/og-image.jpg`
  const e = CONFIG.endereco
  const dias = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BeautySalon',
    name: CONFIG.nome,
    description,
    url: `${url}/`,
    image: ogImage,
    logo: `${url}/brand/logo-juliana-borges-dourado.svg`,
    telephone: `+${CONFIG.whatsapp}`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: e.rua,
      addressLocality: e.cidade,
      addressRegion: e.uf,
      postalCode: e.cep,
      addressCountry: 'BR',
    },
    hasMap: CONFIG.maps,
    sameAs: [CONFIG.instagram],
    openingHoursSpecification: CONFIG.horarios
      .filter((h) => h.abre && h.fecha)
      .map((h) => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: `https://schema.org/${dias[h.dia]}`,
        opens: h.abre,
        closes: h.fecha,
      })),
  }

  const robots = CONFIG.rascunho
    ? `<meta name="robots" content="noindex, nofollow" />\n    <meta name="googlebot" content="noindex, nofollow" />`
    : `<meta name="robots" content="index, follow" />`

  const head = `
    <title>${esc(title)}</title>
    <meta name="description" content="${esc(description)}" />
    ${robots}
    <link rel="canonical" href="${url}/" />
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="pt_BR" />
    <meta property="og:site_name" content="${esc(CONFIG.nome)}" />
    <meta property="og:title" content="${esc(title)}" />
    <meta property="og:description" content="${esc(description)}" />
    <meta property="og:url" content="${url}/" />
    <meta property="og:image" content="${ogImage}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="Logo de Juliana Borges, massoterapeuta e depiladora, e foto dela sorrindo" />
    <meta name="twitter:card" content="summary_large_image" />
    <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`

  return {
    name: 'seo-config',
    transformIndexHtml(html) {
      return html.replace('<!--SEO-->', head)
    },
  }
}

/** Embute o CSS no HTML (sem requisição bloqueante) e pré-carrega as fontes do primeiro quadro. */
function cssEmbutido(): Plugin {
  return {
    name: 'css-embutido',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(html, ctx) {
        if (!ctx.bundle) return html
        let out = html
        for (const [nome, item] of Object.entries(ctx.bundle)) {
          if (item.type === 'asset' && nome.endsWith('.css')) {
            const re = new RegExp(`<link[^>]+href="/${nome.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[^>]*>`)
            out = out.replace(re, () => `<style>${String(item.source)}</style>`)
            delete ctx.bundle[nome]
          }
        }
        const fontes = Object.keys(ctx.bundle).filter((n) =>
          /(bodoni-moda-latin-opsz-normal|jost-latin-wght-normal)-.*\.woff2$/.test(n),
        )
        const preloads = fontes
          .map((f) => `<link rel="preload" href="/${f}" as="font" type="font/woff2" crossorigin />`)
          .join('\n    ')
        const semJs = '<noscript><style>.revelar,.hero-entra,.revela-palavra>span{opacity:1!important;transform:none!important;animation:none!important}</style></noscript>'
        return out.replace('</title>', `</title>\n    ${preloads}\n    ${semJs}`)
      },
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), seo(), cssEmbutido()],
  build: { target: 'es2020', cssCodeSplit: false },
})
