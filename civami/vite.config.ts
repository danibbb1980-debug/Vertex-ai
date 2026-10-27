import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { CONFIG } from './src/config.ts'

const TITLE = 'CIVAMI Clínica de Saúde | Odontologia e Medicina em Alfenas - MG'
const DESCRIPTION =
  'Odontologia e medicina integradas no Centro de Alfenas - MG. Atendimento acolhedor e orientação clara. Agende sua avaliação pelo WhatsApp.'
const OG_IMAGE = '/og-civami.jpg'

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

function jsonLd() {
  const url = CONFIG.siteUrl
  // Só dados da ficha do Google e do Instagram da clínica.
  const dias: Record<string, string[]> = {
    'Segunda a sexta': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    'Sábado': ['Saturday'],
  }
  const opening = CONFIG.horarios
    .filter((h) => h.abre.length && dias[h.dia])
    .flatMap((h) =>
      h.abre.map((abre, i) => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: dias[h.dia],
        opens: abre,
        closes: h.fecha[i],
      })),
    )
  const data = {
    '@context': 'https://schema.org',
    '@type': 'MedicalClinic',
    name: CONFIG.nome,
    url: `${url}/`,
    image: `${url}${OG_IMAGE}`,
    logo: `${url}/brand/logo-civami.png`,
    telephone: CONFIG.telefoneSchema,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Rua Bias Fortes, 722 - Centro',
      addressLocality: CONFIG.endereco.cidade,
      addressRegion: CONFIG.endereco.uf,
      postalCode: CONFIG.endereco.cep,
      addressCountry: 'BR',
    },
    hasMap: CONFIG.mapsUrl,
    sameAs: [CONFIG.instagram],
    paymentAccepted: 'Cartão de crédito, cartão de débito, pagamento por aproximação',
    medicalSpecialty: ['Dentistry', 'Dermatology'],
    employee: CONFIG.profissionais.map((p) => ({ '@type': 'Person', name: p.nome, jobTitle: p.categoria })),
    openingHoursSpecification: opening,
  }
  return JSON.stringify(data).replace(/</g, '\\u003c')
}

function seo(): Plugin {
  return {
    name: 'civami-seo',
    transformIndexHtml(html) {
      const url = CONFIG.siteUrl
      if (/localhost|127\.0\.0\.1/.test(url)) throw new Error('CONFIG.siteUrl não pode apontar para localhost')
      const f = CONFIG.fotos.equipe
      const srcset = (ext: string) => f.larguras.map((w) => `${f.base}-${w}.${ext} ${w}w`).join(', ')
      const robots = CONFIG.rascunho
        ? `<meta name="robots" content="noindex, nofollow" />\n    <meta name="googlebot" content="noindex, nofollow" />`
        : `<meta name="robots" content="index, follow" />`
      const head = `
    <title>${esc(TITLE)}</title>
    <meta name="description" content="${esc(DESCRIPTION)}" />
    ${robots}
    <link rel="canonical" href="${url}/" />
    <meta name="theme-color" content="#F7F3EC" />
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="pt_BR" />
    <meta property="og:site_name" content="${esc(CONFIG.nome)}" />
    <meta property="og:title" content="${esc(TITLE)}" />
    <meta property="og:description" content="${esc(DESCRIPTION)}" />
    <meta property="og:url" content="${url}/" />
    <meta property="og:image" content="${url}${OG_IMAGE}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="CIVAMI Clínica de Saúde, odontologia e medicina integradas em Alfenas - MG" />
    <meta name="twitter:card" content="summary_large_image" />
    <link rel="icon" href="/favicon.ico" sizes="any" />
    <link rel="icon" type="image/png" sizes="48x48" href="/favicon-48.png" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    <link rel="preload" as="image" type="image/avif" imagesrcset="${srcset('avif')}" imagesizes="(min-width: 1024px) 40vw, 88vw" fetchpriority="high" />
    <script type="application/ld+json">${jsonLd()}</script>`
      return html.replace('<!--SEO-->', head)
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), seo()],
  build: { target: 'es2020', cssCodeSplit: false },
})
