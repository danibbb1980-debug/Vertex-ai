import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { CONFIG } from './src/config.ts'

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

// Metadados (SEO, Open Graph, JSON-LD, noindex) gerados a partir do config no build.
function metadados(): Plugin {
  const url = CONFIG.siteUrl.replace(/\/$/, '')
  const titulo = 'Odontologia Estética | Dr. André Totti e Dr. Douglas Barbosa | Pouso Alegre - MG'
  const descricao =
    'Consultório odontológico em Pouso Alegre - MG com atendimento clínico, estético, ortodôntico, cirúrgico e protético, com hora marcada e planejamento individual.'
  const dias = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const e = CONFIG.endereco
  const comCro = CONFIG.profissionais.filter((p) => p.cro)
  const jsonld = {
    '@context': 'https://schema.org',
    '@type': 'Dentist',
    name: `${CONFIG.nome} | ${CONFIG.dentistasLinha}`,
    url: `${url}/`,
    ...(CONFIG.ogImage ? { image: `${url}${CONFIG.ogImage}` } : {}),
    telephone: ['+' + CONFIG.telefone, '+' + CONFIG.whatsapp, '+' + CONFIG.whatsapp2],
    address: {
      '@type': 'PostalAddress',
      streetAddress: e.rua,
      addressLocality: e.cidade,
      addressRegion: e.uf,
      postalCode: e.cep,
      addressCountry: 'BR',
    },
    hasMap: CONFIG.mapsUrl,
    sameAs: [CONFIG.instagram.url],
    paymentAccepted: 'Cartão de crédito, cartão de débito, pagamento por aproximação',
    isAccessibleForFree: false,
    openingHoursSpecification: CONFIG.horarios
      .map((h, i) => (h ? { '@type': 'OpeningHoursSpecification', dayOfWeek: dias[i], opens: h.abre, closes: h.fecha } : null))
      .filter(Boolean),
    ...(comCro.length
      ? { employee: comCro.map((p) => ({ '@type': 'Person', name: p.nome, identifier: p.cro })) }
      : {}),
  }
  const robots = CONFIG.rascunho ? 'noindex, nofollow' : 'index, follow'
  const tags = `
    <title>${esc(titulo)}</title>
    <meta name="description" content="${esc(descricao)}" />
    <meta name="robots" content="${robots}" />
    <meta name="googlebot" content="${robots}" />
    <link rel="canonical" href="${url}/" />
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="pt_BR" />
    <meta property="og:title" content="${esc(titulo)}" />
    <meta property="og:description" content="${esc(descricao)}" />
    <meta property="og:url" content="${url}/" />
    ${CONFIG.ogImage ? `<meta property="og:image" content="${url}${CONFIG.ogImage}" />\n    <meta property="og:image:width" content="1200" />\n    <meta property="og:image:height" content="630" />\n    <meta property="og:image:alt" content="Logo da Odontologia Estética, Dr. André Totti e Dr. Douglas Barbosa" />` : ''}
    <meta name="twitter:card" content="summary_large_image" />
    <script type="application/ld+json">${JSON.stringify(jsonld)}</script>`
  return {
    name: 'metadados',
    transformIndexHtml: (html) => html.replace('<!--METADADOS-->', tags),
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), metadados()],
  build: { target: 'es2020', cssMinify: true },
})
