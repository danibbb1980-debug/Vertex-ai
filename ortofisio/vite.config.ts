import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { CONFIG } from './src/config.ts'

// Injeta metas, canonical, Open Graph e JSON-LD a partir de src/config.ts
function headFromConfig(): Plugin {
  return {
    name: 'head-from-config',
    transformIndexHtml(html) {
      const url = CONFIG.siteUrl.replace(/\/$/, '') + '/'
      const robots = CONFIG.rascunho
        ? '<meta name="robots" content="noindex, nofollow" />\n    <meta name="googlebot" content="noindex, nofollow" />'
        : ''
      const og = [
        `<meta property="og:type" content="website" />`,
        `<meta property="og:locale" content="pt_BR" />`,
        `<meta property="og:site_name" content="${CONFIG.nome}" />`,
        `<meta property="og:title" content="${CONFIG.seo.titulo}" />`,
        `<meta property="og:description" content="${CONFIG.seo.descricao}" />`,
        `<meta property="og:url" content="${url}" />`,
        CONFIG.seo.ogImage ? `<meta property="og:image" content="${new URL(CONFIG.seo.ogImage, url).href}" />` : '',
        `<meta name="twitter:card" content="${CONFIG.seo.ogImage ? 'summary_large_image' : 'summary'}" />`,
      ].filter(Boolean).join('\n    ')
      const dayMap = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      const jsonld = {
        '@context': 'https://schema.org',
        '@type': 'MedicalBusiness',
        name: `${CONFIG.nome} | ${CONFIG.descritor}`,
        description: CONFIG.seo.descricao,
        url,
        image: new URL(CONFIG.logo.src.replace('.webp', '.png'), url).href,
        telephone: CONFIG.telefone || undefined,
        email: CONFIG.email || undefined,
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
          dayOfWeek: h.dias.map((d) => dayMap[d]),
          opens: h.abre,
          closes: h.fecha,
        })),
        sameAs: [CONFIG.instagram.url].filter(Boolean),
        medicalSpecialty: 'PhysicalTherapy',
      }
      return html
        .replace('<!--TITLE-->', CONFIG.seo.titulo)
        .replace('<!--DESCRIPTION-->', CONFIG.seo.descricao)
        .replace('<!--ROBOTS-->', robots)
        .replace('<!--CANONICAL-->', url)
        .replace('<!--OG-->', og)
        .replace('<!--JSONLD-->', JSON.stringify(jsonld).replace(/</g, '\\u003c'))
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), headFromConfig()],
  build: { target: 'es2020', cssCodeSplit: false },
})
