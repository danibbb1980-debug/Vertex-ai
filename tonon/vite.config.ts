import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { CONFIG } from './src/config'

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

/** Injeta SEO, robots e JSON-LD no index.html a partir de src/config.ts. */
function seo(): Plugin {
  const url = CONFIG.siteUrl.replace(/\/$/, '') + '/'
  const title = `${CONFIG.marca} | Reabilitação oral em ${CONFIG.cidade} - ${CONFIG.uf}`
  const description = `${CONFIG.marca}, em ${CONFIG.cidade}: reabilitação oral e estética do sorriso. Agende sua avaliação pelo WhatsApp.`

  // Apenas nome, endereço, telefone e horário. Sem avaliações nem especialidades.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Dentist',
    name: CONFIG.marca,
    url,
    telephone: '+' + CONFIG.whatsapp,
    address: {
      '@type': 'PostalAddress',
      streetAddress: CONFIG.endereco.rua,
      addressLocality: CONFIG.cidade,
      addressRegion: CONFIG.uf,
      postalCode: CONFIG.endereco.cep,
      addressCountry: 'BR',
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '08:00',
        closes: '18:00',
      },
    ],
  }

  return {
    name: 'tonon-seo',
    transformIndexHtml(html) {
      const robots = CONFIG.rascunho
        ? `<meta name="robots" content="noindex, nofollow" />\n    <meta name="googlebot" content="noindex, nofollow" />`
        : `<meta name="robots" content="index, follow" />`
      const head = `
    <title>${esc(title)}</title>
    <meta name="description" content="${esc(description)}" />
    ${robots}
    <link rel="canonical" href="${url}" />
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="pt_BR" />
    <meta property="og:site_name" content="${esc(CONFIG.marca)}" />
    <meta property="og:title" content="${esc(title)}" />
    <meta property="og:description" content="${esc(description)}" />
    <meta property="og:url" content="${url}" />
    <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`
      return html.replace('<!--SEO-->', head)
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), seo()],
})
