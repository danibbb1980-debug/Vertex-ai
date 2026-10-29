import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { CONFIG, enderecoCompleto } from './src/config'

const DIAS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

function seo(): Plugin {
  const url = CONFIG.siteUrl.replace(/\/$/, '')
  const title = `${CONFIG.marca} | ${CONFIG.nome}, ${CONFIG.descritor} em ${CONFIG.endereco.cidade} - ${CONFIG.endereco.uf}`
  const description =
    'Odontopediatria em Alfenas - MG: atendimento odontológico para bebês, crianças e adolescentes, com acolhimento e explicações claras para a família.'
  const og = CONFIG.ogImage ? `${url}${CONFIG.ogImage}` : ''
  const abertos = CONFIG.horarios.filter((h) => h.abre && h.fecha)
  const jsonld = {
    '@context': 'https://schema.org',
    '@type': 'Dentist',
    name: `${CONFIG.marca} | ${CONFIG.nome}`,
    alternateName: CONFIG.marca,
    description,
    url: `${url}/`,
    ...(og ? { image: og } : {}),
    telephone: CONFIG.telefone,
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
    paymentAccepted: CONFIG.estrutura.pagamento.join(', '),
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: abertos.map((h) => DIAS[h.dia]),
        opens: abertos[0]?.abre,
        closes: abertos[0]?.fecha,
      },
    ],
    contactPoint: [
      { '@type': 'ContactPoint', telephone: `+${CONFIG.whatsapp}`, contactType: 'reservations', availableLanguage: 'pt-BR' },
    ],
    employee: {
      '@type': 'Person',
      name: CONFIG.nome,
      jobTitle: `${CONFIG.titulo}, ${CONFIG.descritor}`,
      identifier: { '@type': 'PropertyValue', propertyID: 'CRO', value: CONFIG.cro },
    },
    areaServed: { '@type': 'City', name: `${CONFIG.endereco.cidade} - ${CONFIG.endereco.uf}` },
    knowsAbout: ['Odontopediatria', 'Ortopedia Funcional dos Maxilares'],
  }
  const robots = CONFIG.rascunho ? 'noindex, nofollow' : 'index, follow'
  const head = [
    `<title>${title}</title>`,
    `<meta name="description" content="${description}" />`,
    `<meta name="robots" content="${robots}" />`,
    `<meta name="googlebot" content="${robots}" />`,
    `<link rel="canonical" href="${url}/" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:locale" content="pt_BR" />`,
    `<meta property="og:site_name" content="${CONFIG.marca}" />`,
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:description" content="${description}" />`,
    `<meta property="og:url" content="${url}/" />`,
    og ? `<meta property="og:image" content="${og}" />` : '',
    og ? `<meta property="og:image:width" content="1200" /><meta property="og:image:height" content="630" />` : '',
    og ? `<meta property="og:image:alt" content="Logotipo Tia Jessika, Odontopediatra" />` : '',
    `<meta name="twitter:card" content="${og ? 'summary_large_image' : 'summary'}" />`,
    `<meta name="geo.placename" content="${enderecoCompleto}" />`,
    `<script type="application/ld+json">${JSON.stringify(jsonld)}</script>`,
  ]
    .filter(Boolean)
    .join('\n    ')
  return {
    name: 'tia-jessika-seo',
    transformIndexHtml(html) {
      return html.replace('<!--SEO-->', head)
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), seo()],
  build: { target: 'es2020', cssMinify: true },
})
