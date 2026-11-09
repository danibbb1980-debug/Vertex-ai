import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { CONFIG } from './src/config'
import { enderecoCompleto, registro } from './src/lib/dados'

const DIAS_SCHEMA = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

function jsonLd() {
  const url = CONFIG.siteUrl.replace(/\/$/, '')
  const e = CONFIG.endereco
  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Physician',
    name: CONFIG.nome,
    description: `${CONFIG.descritor} em ${e.cidade} - ${e.uf}. ${registro()}.`,
    medicalSpecialty: 'https://schema.org/Dermatology',
    url: `${url}/`,
    image: `${url}/og.png`,
    logo: `${url}/marca/logo-vinho.svg`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: [`${e.rua}, ${e.numero}`, e.complemento].filter(Boolean).join(', '),
      addressLocality: e.cidade,
      addressRegion: e.uf,
      postalCode: e.cep,
      addressCountry: 'BR',
    },
    hasMap: CONFIG.mapsUrl,
    sameAs: [CONFIG.instagram.url].filter(Boolean),
    openingHoursSpecification: CONFIG.horarios
      .filter((h) => !h.fechado && h.abre && h.fecha)
      .map((h) => ({ '@type': 'OpeningHoursSpecification', dayOfWeek: DIAS_SCHEMA[h.dia], opens: h.abre, closes: h.fecha })),
  }
  if (CONFIG.whatsapp) data.telephone = `+${CONFIG.whatsapp}`
  return JSON.stringify(data).replace(/</g, '\\u003c')
}

function htmlConfig(): Plugin {
  const url = CONFIG.siteUrl.replace(/\/$/, '')
  const descricao = `Dermatologia, estética e laser com hora marcada em Poços de Caldas - MG. ${CONFIG.nome}, ${CONFIG.descritor}, ${registro()}.`
  return {
    name: 'html-config',
    transformIndexHtml(html) {
      return html
        .replaceAll('%SITE_URL%', url)
        .replaceAll('%DESCRICAO%', descricao)
        .replace('%ROBOTS%', CONFIG.rascunho ? 'noindex, nofollow' : 'index, follow')
        .replace('%ROBOTS_G%', CONFIG.rascunho ? 'noindex, nofollow' : 'index, follow')
        .replace('%JSON_LD%', jsonLd())
        .replace('%ENDERECO%', enderecoCompleto())
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), htmlConfig()],
  build: { target: 'es2020', cssMinify: true, assetsInlineLimit: 0 },
})
