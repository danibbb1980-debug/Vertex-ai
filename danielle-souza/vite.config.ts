import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { existsSync } from 'node:fs'
import { CONFIG } from './src/config'

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

/** Metas, canonical, Open Graph e JSON-LD gerados a partir de src/config.ts. */
function seo(): Plugin {
  const base = CONFIG.siteUrl.replace(/\/$/, '')
  if (/localhost|127\.0\.0\.1/.test(base)) throw new Error('CONFIG.siteUrl não pode ser localhost')
  const titulo = `${CONFIG.nome} | Estética Facial em ${CONFIG.endereco.cidade} - ${CONFIG.endereco.uf}`
  const procs = CONFIG.procedimentos.map((p) => p.nome.toLowerCase())
  const descricao = `Estética facial em ${CONFIG.endereco.cidade} - ${CONFIG.endereco.uf}, com avaliação individual. ${
    procs.length ? `${procs.join(' e ').replace(/^./, (c) => c.toUpperCase())}. ` : ''
  }Agendamento pelo WhatsApp.`
  const ogImg = existsSync('public/og.jpg') ? `${base}/og.jpg` : ''
  const dias = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'BeautySalon',
    name: `${CONFIG.nome} | ${CONFIG.descritor}`,
    url: `${base}/`,
    ...(CONFIG.usarWhatsapp ? { telephone: `+${CONFIG.whatsapp}` } : {}),
    ...(CONFIG.email ? { email: CONFIG.email } : {}),
    address: {
      '@type': 'PostalAddress',
      streetAddress: `${CONFIG.endereco.rua}, ${CONFIG.endereco.numero}`,
      addressLocality: CONFIG.endereco.cidade,
      addressRegion: CONFIG.endereco.uf,
      postalCode: CONFIG.endereco.cep,
      addressCountry: 'BR',
    },
    openingHoursSpecification: CONFIG.horarios
      .filter((d) => d.abre)
      .map((d) => ({ '@type': 'OpeningHoursSpecification', dayOfWeek: dias[d.dow], opens: d.abre, closes: d.fecha })),
    ...(CONFIG.instagram.url ? { sameAs: [CONFIG.instagram.url] } : {}),
  }
  const robots = CONFIG.rascunho ? 'noindex, nofollow' : 'index, follow'
  const tags = [
    `<title>${esc(titulo)}</title>`,
    `<meta name="description" content="${esc(descricao)}" />`,
    `<meta name="robots" content="${robots}" />`,
    `<meta name="googlebot" content="${robots}" />`,
    `<link rel="canonical" href="${base}/" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:locale" content="pt_BR" />`,
    `<meta property="og:site_name" content="${esc(`${CONFIG.nome} | ${CONFIG.descritor}`)}" />`,
    `<meta property="og:title" content="${esc(titulo)}" />`,
    `<meta property="og:description" content="${esc(descricao)}" />`,
    `<meta property="og:url" content="${base}/" />`,
    ogImg ? `<meta property="og:image" content="${ogImg}" />` : '',
    `<meta name="twitter:card" content="${ogImg ? 'summary_large_image' : 'summary'}" />`,
    `<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>`,
  ]
    .filter(Boolean)
    .join('\n    ')
  return {
    name: 'seo-config',
    transformIndexHtml(html) {
      return html.replace('<!--SEO-->', tags)
    },
  }
}

/** CSS crítico embutido no HTML (sem requisição bloqueante) e preload das fontes do título. */
function inlineCss(): Plugin {
  return {
    name: 'inline-css',
    apply: 'build',
    enforce: 'post',
    generateBundle(_, bundle) {
      const html = Object.values(bundle).find((f) => f.fileName === 'index.html')
      if (!html || html.type !== 'asset') return
      let src = String(html.source)
      for (const f of Object.values(bundle)) {
        if (f.type !== 'asset' || !f.fileName.endsWith('.css')) continue
        const tag = new RegExp(`<link rel="stylesheet"[^>]*href="/${f.fileName}"[^>]*>`)
        if (!tag.test(src)) continue
        src = src.replace(tag, () => `<style>${String(f.source)}</style>`)
        delete bundle[f.fileName]
      }
      const fontes = Object.values(bundle)
        .filter((f) => f.type === 'asset' && /newsreader-300-opsz-normal|hanken-grotesk-latin-400/.test(f.fileName))
        .map((f) => `<link rel="preload" as="font" type="font/woff2" crossorigin href="/${f.fileName}" />`)
        .join('\n    ')
      src = src.replace('</title>', `</title>\n    ${fontes}`)
      html.source = src
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), seo(), inlineCss()],
  build: { target: 'es2020', cssMinify: true, assetsInlineLimit: 0 },
})
