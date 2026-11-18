import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { CONFIG, diasAbertos } from './src/config'

const TITLE = 'Ivete Valério Estética | Massagens, Depilação e Sobrancelha em Varginha - MG'
const DESC =
  'Massagens, depilação, design de sobrancelha e estética facial com hora marcada, no Centro de Varginha - MG. Agendamento pelo WhatsApp.'

function headSeo(): Plugin {
  return {
    name: 'head-seo',
    transformIndexHtml() {
      const url = CONFIG.siteUrl.replace(/\/$/, '') + '/'
      const e = CONFIG.endereco
      const og = CONFIG.fotos.retrato ? `${url}img/og.jpg` : ''
      const jsonld = {
        '@context': 'https://schema.org',
        '@type': 'BeautySalon',
        name: CONFIG.nome,
        url,
        ...(og ? { image: og } : {}),
        telephone: '+' + CONFIG.whatsapp,
        email: CONFIG.email,
        address: {
          '@type': 'PostalAddress',
          streetAddress: e.logradouro,
          addressLocality: e.cidade,
          addressRegion: e.uf,
          postalCode: e.cep,
          addressCountry: 'BR',
        },
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: diasAbertos().map((d) => `https://schema.org/${d.schema}`),
          },
        ],
        sameAs: [CONFIG.instagram.url],
      }
      const robots = CONFIG.rascunho ? 'noindex, nofollow' : 'index, follow'
      const tags: Array<{ tag: string; attrs?: Record<string, string>; children?: string; injectTo?: 'head' }> = [
        { tag: 'title', children: TITLE },
        { tag: 'meta', attrs: { name: 'description', content: DESC } },
        { tag: 'meta', attrs: { name: 'robots', content: robots } },
        { tag: 'meta', attrs: { name: 'googlebot', content: robots } },
        { tag: 'link', attrs: { rel: 'canonical', href: url } },
        { tag: 'meta', attrs: { property: 'og:type', content: 'website' } },
        { tag: 'meta', attrs: { property: 'og:locale', content: 'pt_BR' } },
        { tag: 'meta', attrs: { property: 'og:title', content: TITLE } },
        { tag: 'meta', attrs: { property: 'og:description', content: DESC } },
        { tag: 'meta', attrs: { property: 'og:url', content: url } },
        ...(og
          ? [
              { tag: 'meta', attrs: { property: 'og:image', content: og } },
              { tag: 'meta', attrs: { property: 'og:image:width', content: '1200' } },
              { tag: 'meta', attrs: { property: 'og:image:height', content: '630' } },
            ]
          : []),
        { tag: 'meta', attrs: { name: 'twitter:card', content: og ? 'summary_large_image' : 'summary' } },
        {
          tag: 'script',
          attrs: { type: 'application/ld+json' },
          children: JSON.stringify(jsonld),
        },
      ]
      return tags.map((t) => ({ ...t, injectTo: 'head' as const }))
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), headSeo()],
  build: { cssCodeSplit: false, assetsInlineLimit: 0 },
})
