import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { CONFIG } from './src/config'

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

const DIAS_SCHEMA: Record<number, string> = {
  0: 'Sunday', 1: 'Monday', 2: 'Tuesday', 3: 'Wednesday', 4: 'Thursday', 5: 'Friday', 6: 'Saturday',
}

function seo(): Plugin {
  return {
    name: 'biomasto-seo',
    transformIndexHtml(html, ctx) {
      const preloads = Object.keys(ctx.bundle ?? {})
        .filter((f) => /(fraunces-latin-soft-(normal|italic)|figtree-latin-wght-normal).*\.woff2$/.test(f))
        .map((f) => `<link rel="preload" href="/${f}" as="font" type="font/woff2" crossorigin />`)
        .join('\n    ')
      const url = CONFIG.siteUrl.replace(/\/$/, '') + '/'
      const e = CONFIG.endereco
      const jsonld = {
        '@context': 'https://schema.org',
        '@type': 'MedicalClinic',
        name: CONFIG.nome,
        url,
        telephone: CONFIG.telefoneE164,
        address: {
          '@type': 'PostalAddress',
          streetAddress: `${e.rua}, ${e.complemento}`,
          addressLocality: e.cidade,
          addressRegion: e.uf,
          postalCode: e.cep,
          addressCountry: 'BR',
        },
        openingHoursSpecification: CONFIG.horarios.flatMap((d) =>
          d.periodos.map((p) => ({
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: `https://schema.org/${DIAS_SCHEMA[d.semana]}`,
            opens: p.inicio,
            closes: p.fim,
          })),
        ),
        sameAs: [CONFIG.instagram.url],
        hasMap: CONFIG.maps.url,
      }
      const og = CONFIG.seo.ogImage
        ? `<meta property="og:image" content="${esc(new URL(CONFIG.seo.ogImage, url).href)}" />`
        : ''
      const robots = CONFIG.rascunho
        ? `<meta name="robots" content="noindex, nofollow" />\n    <meta name="googlebot" content="noindex, nofollow" />`
        : ''
      const head = `
    <title>${esc(CONFIG.seo.titulo)}</title>
    <meta name="description" content="${esc(CONFIG.seo.descricao)}" />
    ${robots}
    <link rel="canonical" href="${url}" />
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="pt_BR" />
    <meta property="og:site_name" content="${esc(CONFIG.nome)}" />
    <meta property="og:title" content="${esc(CONFIG.seo.titulo)}" />
    <meta property="og:description" content="${esc(CONFIG.seo.descricao)}" />
    <meta property="og:url" content="${url}" />
    ${og}
    ${preloads}
    <script type="application/ld+json">${JSON.stringify(jsonld)}</script>`
      return html.replace('<!--SEO-->', head)
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), seo()],
  build: { target: 'es2020', cssCodeSplit: false },
})
