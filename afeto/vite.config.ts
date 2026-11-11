import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { CONFIG } from './src/config'

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

/** Gera <head> (SEO, noindex, Open Graph, JSON-LD) a partir de src/config.ts. */
function cabecalho(): Plugin {
  return {
    name: 'afeto-head',
    transformIndexHtml(html) {
      const url = CONFIG.siteUrl.replace(/\/$/, '')
      const absoluta = /^https?:\/\//.test(url) && !/localhost|127\.0\.0\.1/.test(url)
      const tags: string[] = [
        `<title>${esc(CONFIG.seo.title)}</title>`,
        `<meta name="description" content="${esc(CONFIG.seo.description)}" />`,
      ]
      if (CONFIG.rascunho) {
        tags.push(
          '<meta name="robots" content="noindex, nofollow" />',
          '<meta name="googlebot" content="noindex, nofollow" />',
        )
      }
      tags.push(
        '<meta property="og:type" content="website" />',
        '<meta property="og:locale" content="pt_BR" />',
        `<meta property="og:site_name" content="${esc(CONFIG.nome)}" />`,
        `<meta property="og:title" content="${esc(CONFIG.seo.title)}" />`,
        `<meta property="og:description" content="${esc(CONFIG.seo.description)}" />`,
        '<meta name="twitter:card" content="summary_large_image" />',
      )
      if (absoluta) {
        tags.push(`<link rel="canonical" href="${url}/" />`, `<meta property="og:url" content="${url}/" />`)
        if (CONFIG.seo.imagem) {
          tags.push(
            `<meta property="og:image" content="${url}${CONFIG.seo.imagem}" />`,
            '<meta property="og:image:width" content="1200" />',
            '<meta property="og:image:height" content="630" />',
            `<meta property="og:image:alt" content="Logo do ${esc(CONFIG.nome)}" />`,
          )
        }
      }
      const dias = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      const ld: Record<string, unknown> = {
        '@context': 'https://schema.org',
        '@type': 'MedicalBusiness',
        name: CONFIG.nome,
        description: CONFIG.seo.description,
        address: {
          '@type': 'PostalAddress',
          streetAddress: CONFIG.endereco.rua,
          addressLocality: CONFIG.endereco.cidade,
          addressRegion: CONFIG.endereco.uf,
          postalCode: CONFIG.endereco.cep,
          addressCountry: 'BR',
        },
        openingHoursSpecification: CONFIG.horarios.map((h) => ({
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: `https://schema.org/${dias[h.dia]}`,
          opens: h.abre,
          closes: h.fecha,
        })),
        hasMap: CONFIG.maps.url,
        sameAs: [CONFIG.instagram.url].filter(Boolean),
        availableService: CONFIG.especialidades.map((e) => ({ '@type': 'MedicalTherapy', name: e.nome })),
      }
      if (CONFIG.whatsapp) ld.telephone = `+${CONFIG.whatsapp}`
      if (absoluta) {
        ld.url = `${url}/`
        ld.logo = `${url}/logo-afeto.png`
        ld.image = `${url}/logo-afeto.png`
      }
      tags.push(`<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>`)
      return html.replace('<!--HEAD-->', tags.join('\n    '))
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), cabecalho()],
  build: { target: 'es2020', cssMinify: true },
})
