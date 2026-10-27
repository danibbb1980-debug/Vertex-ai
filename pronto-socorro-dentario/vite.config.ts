import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { CONFIG } from './src/config'

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

/** Injeta SEO, noindex e JSON-LD a partir do src/config.ts. */
function seo(): Plugin {
  const url = CONFIG.siteUrl.replace(/\/$/, '')
  if (/localhost|127\.0\.0\.1/.test(url)) throw new Error('CONFIG.siteUrl não pode ser localhost')
  const title = `${CONFIG.nome} | Urgência Odontológica 24h em ${CONFIG.cidade} - ${CONFIG.uf}`
  const description = `Urgência odontológica 24 horas em ${CONFIG.cidade} - ${CONFIG.uf}. Atendimento para todas as idades, incluindo crianças, odontologia estética e sedação conforme avaliação. Fale pelo WhatsApp.`
  const robots = CONFIG.rascunho ? 'noindex, nofollow' : 'index, follow'

  // JSON-LD só com dados de origem verificável (ficha do Google). Sem nota nem avaliações.
  // O horário fica de fora até a clínica confirmar todos os dias.
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'Dentist',
    name: CONFIG.nome,
    url: url + '/',
    telephone: CONFIG.telefone,
    image: [url + '/og.jpg', url + '/logo.webp'],
    paymentAccepted: 'Cartão de crédito, cartão de débito, pagamento por aproximação (NFC)',
    address: {
      '@type': 'PostalAddress',
      streetAddress: CONFIG.endereco.rua,
      addressLocality: CONFIG.endereco.cidade,
      addressRegion: CONFIG.endereco.uf,
      postalCode: CONFIG.endereco.cep,
      addressCountry: 'BR',
    },
    hasMap: CONFIG.mapsUrl,
    sameAs: [CONFIG.instagram.url],
  }

  const head = `
    <title>${esc(title)}</title>
    <meta name="description" content="${esc(description)}" />
    <meta name="robots" content="${robots}" />
    <meta name="googlebot" content="${robots}" />
    <link rel="canonical" href="${url}/" />
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="pt_BR" />
    <meta property="og:site_name" content="${esc(CONFIG.nome)}" />
    <meta property="og:title" content="${esc(title)}" />
    <meta property="og:description" content="${esc(description)}" />
    <meta property="og:url" content="${url}/" />
    <meta property="og:image" content="${url}/og.jpg" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="Fachada da clínica, no número 268" />
    <meta name="twitter:card" content="summary_large_image" />
    <script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>`

  return {
    name: 'psd-seo',
    transformIndexHtml(html) {
      return html.replace('<!--SEO-->', head)
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), seo()],
  build: { target: 'es2020', cssCodeSplit: true },
})
