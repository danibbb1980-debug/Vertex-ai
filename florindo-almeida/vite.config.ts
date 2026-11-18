import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { CONFIG, local, temOab, oabTexto } from './src/config'

/** Injeta metas, canonical, Open Graph e JSON-LD a partir de src/config.ts */
function headFromConfig(): Plugin {
  return {
    name: 'head-from-config',
    transformIndexHtml(html) {
      const url = CONFIG.siteUrl.replace(/\/$/, '')
      const foto = CONFIG.fotos[0]
      const ogImage = foto ? `${url}${foto.fallback ?? foto.src}` : ''
      const nome = CONFIG.advogado.nome
      const jsonLd: Record<string, unknown> = {
        '@context': 'https://schema.org',
        '@type': 'Attorney',
        name: nome,
        description: `Advogado em ${local}. Atuação em ${CONFIG.areas.map((a) => a.nome).join(', ')}.`,
        url: `${url}/`,
        address: {
          '@type': 'PostalAddress',
          addressLocality: CONFIG.cidade,
          addressRegion: CONFIG.uf,
          addressCountry: 'BR',
        },
        areaServed: { '@type': 'City', name: CONFIG.cidade },
        knowsAbout: CONFIG.areas.map((a) => a.nome),
        sameAs: [CONFIG.instagram.url],
      }
      if (CONFIG.usarWhatsapp && CONFIG.whatsapp) jsonLd.telephone = `+${CONFIG.whatsapp}`
      if (ogImage) jsonLd.image = ogImage
      if (temOab) jsonLd.identifier = oabTexto
      const robots = CONFIG.rascunho
        ? '<meta name="robots" content="noindex, nofollow" />\n    <meta name="googlebot" content="noindex, nofollow" />'
        : '<meta name="robots" content="index, follow" />'
      const og = [
        `<link rel="canonical" href="${url}/" />`,
        `<meta property="og:type" content="website" />`,
        `<meta property="og:locale" content="pt_BR" />`,
        `<meta property="og:site_name" content="${nome}" />`,
        `<meta property="og:title" content="${nome} | Advogado em ${local}" />`,
        `<meta property="og:description" content="Advogado em ${local}, com atuação em Direito Civil, Criminal e Trabalhista. Atendimento mediante agendamento pelo WhatsApp." />`,
        `<meta property="og:url" content="${url}/" />`,
        ogImage ? `<meta property="og:image" content="${ogImage}" />` : '',
        ogImage ? `<meta property="og:image:alt" content="${foto!.alt}" />` : '',
        `<meta name="twitter:card" content="${ogImage ? 'summary_large_image' : 'summary'}" />`,
      ]
        .filter(Boolean)
        .join('\n    ')
      return html
        .replace('<!--ROBOTS-->', robots)
        .replace('<!--OG-->', og)
        .replace('<!--JSONLD-->', `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`)
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), headFromConfig()],
  build: { target: 'es2020', cssCodeSplit: false },
})
