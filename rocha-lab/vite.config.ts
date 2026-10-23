import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { CONFIG } from './src/config.ts'

/** Preenche metas, canonical e JSON-LD do index.html a partir de src/config.ts. */
function metasDoConfig(): Plugin {
  const url = CONFIG.siteUrl.replace(/\/$/, '')
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: CONFIG.nome,
    url: `${url}/`,
    image: `${url}/og.jpg`,
    telephone: '+55 19 99243-9085',
    address: {
      '@type': 'PostalAddress',
      streetAddress: CONFIG.endereco.rua,
      addressLocality: CONFIG.endereco.cidade,
      addressRegion: CONFIG.endereco.uf,
      postalCode: CONFIG.endereco.cep,
      addressCountry: 'BR',
    },
    openingHoursSpecification: CONFIG.horariosSchema.map((h) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: h.dias,
      opens: h.abre,
      closes: h.fecha,
    })),
    sameAs: [CONFIG.instagram],
    hasMap: CONFIG.googleMaps,
  }
  const robots = CONFIG.rascunho ? 'noindex, nofollow' : 'index, follow'
  return {
    name: 'metas-do-config',
    transformIndexHtml(html, ctx) {
      // Pré-carrega as fontes latinas usadas na primeira dobra.
      const fontes = Object.keys(ctx.bundle ?? {}).filter((f) =>
        /(fraunces-latin-opsz-(normal|italic)|manrope-latin-wght-normal)-.*\.woff2$/.test(f),
      )
      const preload = fontes
        .map((f) => `<link rel="preload" href="/${f}" as="font" type="font/woff2" crossorigin />`)
        .join('\n    ')
      return html
        .replace('</title>', `</title>\n    ${preload}`)
        .replaceAll('%SITE_URL%', url)
        .replaceAll('%ROBOTS%', robots)
        .replace('%JSON_LD%', JSON.stringify(jsonLd))
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), metasDoConfig()],
})
