import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'node:url'
import { CONFIG } from './src/config.ts'

const TITLE = `${CONFIG.nome} | ${CONFIG.assinatura} em ${CONFIG.endereco.cidade} - ${CONFIG.endereco.uf}`
const DESCRIPTION = `Clínica de estética em ${CONFIG.endereco.cidade} - ${CONFIG.endereco.uf}. Protocolos personalizados e avaliação individual. Agende pelo WhatsApp.`
const base = CONFIG.siteUrl.replace(/\/$/, '')

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

function jsonLd() {
  const dias = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'BeautySalon',
    name: CONFIG.nome,
    description: DESCRIPTION,
    url: base + '/',
    telephone: CONFIG.telefone.tel,
    address: {
      '@type': 'PostalAddress',
      streetAddress: CONFIG.endereco.rua,
      addressLocality: CONFIG.endereco.cidade,
      addressRegion: CONFIG.endereco.uf,
      postalCode: CONFIG.endereco.cep,
      addressCountry: 'BR',
    },
    openingHoursSpecification: CONFIG.horarios
      .filter((h) => h.abre && h.fecha)
      .map((h) => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: `https://schema.org/${dias[h.diaSemana]}`,
        opens: h.abre,
        closes: h.fecha,
      })),
    ...(CONFIG.instagram.url ? { sameAs: [CONFIG.instagram.url] } : {}),
  }
  return JSON.stringify(data).replace(/</g, '\\u003c')
}

/** Injeta SEO, robots e JSON-LD a partir do config (robots.txt e _headers ficam em public/). */
function siteMeta(): Plugin {
  return {
    name: 'sp-site-meta',
    transformIndexHtml(html, ctx) {
      const page = ctx.path.replace(/^\//, '') || 'index.html'
      const path = page === 'index.html' ? '/' : '/' + page
      const isHome = path === '/'
      const robots = CONFIG.rascunho ? 'noindex, nofollow' : isHome || path === '/privacidade.html' ? 'index, follow' : 'noindex'
      const og = [
        `<meta name="robots" content="${robots}" />`,
        `<meta name="googlebot" content="${robots}" />`,
        `<link rel="canonical" href="${base}${path}" />`,
        `<meta property="og:url" content="${base}${path}" />`,
        `<meta property="og:locale" content="pt_BR" />`,
        `<meta property="og:site_name" content="${esc(CONFIG.nome)}" />`,
      ]
      if (isHome) {
        og.push(
          `<meta property="og:type" content="website" />`,
          `<meta property="og:title" content="${esc(TITLE)}" />`,
          `<meta property="og:description" content="${esc(DESCRIPTION)}" />`,
          `<meta name="twitter:card" content="summary_large_image" />`,
          `<meta property="og:image" content="${base}/og.jpg" />`,
          `<meta property="og:image:width" content="1200" />`,
          `<meta property="og:image:height" content="630" />`,
          `<script type="application/ld+json">${jsonLd()}</script>`,
        )
      }
      return html
        .replace(/%TITLE%/g, esc(TITLE))
        .replace(/%DESCRIPTION%/g, esc(DESCRIPTION))
        .replace('<!--META-->', og.join('\n    '))
        .replace(
          '<!--FAIXA-->',
          CONFIG.rascunho
            ? '<p class="bg-cafe px-4 py-1.5 text-center text-[0.78rem] text-creme">Rascunho para avaliação. Informações sujeitas a confirmação.</p>'
            : '',
        )
        .replace(/%WHATSAPP%/g, CONFIG.whatsappExibicao)
    }
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), siteMeta()],
  build: {
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
        privacidade: fileURLToPath(new URL('./privacidade.html', import.meta.url)),
        notfound: fileURLToPath(new URL('./404.html', import.meta.url)),
      },
    },
  },
})
