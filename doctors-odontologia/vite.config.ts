import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { CONFIG, enderecoLinha } from './src/config.ts'

const DIAS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

function jsonLd() {
  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Dentist',
    name: CONFIG.nome,
    url: CONFIG.siteUrl + '/',
    telephone: '+' + CONFIG.whatsapp,
    address: {
      '@type': 'PostalAddress',
      streetAddress: CONFIG.endereco.rua,
      addressLocality: CONFIG.endereco.cidade,
      addressRegion: CONFIG.endereco.uf,
      postalCode: CONFIG.endereco.cep,
      addressCountry: 'BR',
    },
    hasMap: CONFIG.endereco.mapsUrl,
    sameAs: [CONFIG.instagram.url],
    openingHoursSpecification: CONFIG.horarios.map((h) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: h.dias.map((d) => DIAS[d]),
      opens: h.abre,
      closes: h.fecha,
    })),
    paymentAccepted: 'Cartão de crédito, cartão de débito, pagamento por aproximação',
    image: CONFIG.siteUrl + '/og-image.jpg',
  }
  const rt = CONFIG.responsavelTecnico
  if (rt.nome && rt.cro) {
    data.employee = { '@type': 'Person', name: rt.nome, identifier: rt.cro }
  }
  return JSON.stringify(data)
}

function htmlConfig(): Plugin {
  return {
    name: 'html-config',
    transformIndexHtml(html) {
      const robots = CONFIG.rascunho ? 'noindex, nofollow' : 'index, follow'
      return html
        .replaceAll('%SITE_URL%', CONFIG.siteUrl)
        .replaceAll('%ROBOTS%', robots)
        .replaceAll('%ENDERECO%', enderecoLinha())
        .replace('%JSONLD%', jsonLd())
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), htmlConfig()],
  build: { target: 'es2022', cssCodeSplit: false },
})
