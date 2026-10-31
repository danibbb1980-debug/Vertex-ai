import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { CONFIG, enderecoLinha, especialidadesVisiveis } from './src/config.ts'

const DIAS_SCHEMA = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

/** Gera <head> (SEO, Open Graph, noindex e JSON-LD) a partir do src/config.ts. */
function headDoConfig(): Plugin {
  const titulo = `${CONFIG.nome} | Dentista em ${CONFIG.cidade} - ${CONFIG.uf}`
  const descricao = `${CONFIG.titulo} em ${CONFIG.cidade} - ${CONFIG.uf}: implantes, ortodontia, harmonização orofacial e estética do sorriso, com hora marcada.`
  const url = `${CONFIG.siteUrl}/`
  const foto = CONFIG.fotos.dentista
  const ogImage = foto ? `${CONFIG.siteUrl}${foto.jpg}` : ''

  const grupos = new Map<string, string[]>()
  for (const h of CONFIG.horarios) {
    const k = `${h.abre}-${h.fecha}`
    grupos.set(k, [...(grupos.get(k) ?? []), DIAS_SCHEMA[h.dia]])
  }
  const especialidades = especialidadesVisiveis()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Dentist',
    name: CONFIG.nome,
    description: descricao,
    url,
    telephone: `+${CONFIG.whatsapp}`,
    identifier: CONFIG.cro,
    ...(ogImage ? { image: ogImage } : {}),
    address: {
      '@type': 'PostalAddress',
      streetAddress: CONFIG.endereco.rua,
      addressLocality: CONFIG.endereco.cidade,
      addressRegion: CONFIG.endereco.uf,
      postalCode: CONFIG.endereco.cep,
      addressCountry: 'BR',
    },
    hasMap: CONFIG.mapsUrl,
    sameAs: [CONFIG.instagram],
    paymentAccepted: 'Cartão de crédito, cartão de débito, pagamento por aproximação',
    openingHoursSpecification: [...grupos.entries()].map(([k, dias]) => {
      const [opens, closes] = k.split('-')
      return { '@type': 'OpeningHoursSpecification', dayOfWeek: dias, opens, closes }
    }),
    ...(especialidades.length ? { medicalSpecialty: especialidades.map((e) => e.nome) } : {}),
  }

  const robots = CONFIG.rascunho ? 'noindex, nofollow' : 'index, follow'
  const tags = [
    `<title>${esc(titulo)}</title>`,
    `<meta name="description" content="${esc(descricao)}" />`,
    `<meta name="robots" content="${robots}" />`,
    `<meta name="googlebot" content="${robots}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:locale" content="pt_BR" />`,
    `<meta property="og:title" content="${esc(titulo)}" />`,
    `<meta property="og:description" content="${esc(descricao)}" />`,
    `<meta property="og:url" content="${url}" />`,
    ogImage ? `<meta property="og:image" content="${ogImage}" />` : '',
    ogImage && foto ? `<meta property="og:image:alt" content="${esc(foto.alt)}" />` : '',
    `<meta name="twitter:card" content="${ogImage ? 'summary_large_image' : 'summary'}" />`,
    `<meta name="geo.placename" content="${esc(enderecoLinha())}" />`,
    `<script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, '\\u003c')}</script>`,
  ].filter(Boolean)

  return {
    name: 'head-do-config',
    transformIndexHtml(html) {
      return html.replace('<!--HEAD-->', tags.join('\n    '))
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), headDoConfig()],
  build: { target: 'es2020', cssMinify: true },
})
