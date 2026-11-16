import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { CONFIG } from './src/config.ts'

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

function head(): Plugin {
  return {
    name: 'head-from-config',
    transformIndexHtml(html) {
      const url = CONFIG.siteUrl.replace(/\/$/, '') + '/'
      if (/localhost|127\.0\.0\.1/.test(url)) throw new Error('CONFIG.siteUrl não pode ser localhost')
      const titulo = `${CONFIG.nome} | Estética em ${CONFIG.cidade} - ${CONFIG.uf}`
      const descricao = `Estética facial e corporal, sobrancelhas e nail designer no Centro de ${CONFIG.cidade} - ${CONFIG.uf}. Agende seu horário pelo WhatsApp.`
      const foto = CONFIG.profissional.foto
      const ogImage = foto ? `${url}fotos/${foto.arquivo}-1100.webp` : ''
      const dias = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      const jsonld = {
        '@context': 'https://schema.org',
        '@type': 'BeautySalon',
        name: `${CONFIG.nome} | ${CONFIG.descritor}`,
        url,
        telephone: '+' + CONFIG.whatsapp,
        ...(CONFIG.email ? { email: CONFIG.email } : {}),
        ...(ogImage ? { image: ogImage } : {}),
        address: {
          '@type': 'PostalAddress',
          streetAddress: CONFIG.endereco.logradouro,
          addressLocality: CONFIG.endereco.cidade,
          addressRegion: CONFIG.endereco.uf,
          postalCode: CONFIG.endereco.cep,
          addressCountry: 'BR',
        },
        openingHoursSpecification: CONFIG.horarios
          .filter((h) => h.abre && h.fecha)
          .map((h) => ({ '@type': 'OpeningHoursSpecification', dayOfWeek: dias[h.diaSemana], opens: h.abre, closes: h.fecha })),
        sameAs: [CONFIG.instagram.url],
      }
      const tags = [
        `<title>${esc(titulo)}</title>`,
        `<meta name="description" content="${esc(descricao)}" />`,
        CONFIG.rascunho ? `<meta name="robots" content="noindex, nofollow" />\n    <meta name="googlebot" content="noindex, nofollow" />` : '',
        `<link rel="canonical" href="${url}" />`,
        `<meta property="og:type" content="website" />`,
        `<meta property="og:locale" content="pt_BR" />`,
        `<meta property="og:title" content="${esc(titulo)}" />`,
        `<meta property="og:description" content="${esc(descricao)}" />`,
        `<meta property="og:url" content="${url}" />`,
        ogImage ? `<meta property="og:image" content="${ogImage}" />` : '',
        `<script type="application/ld+json">${JSON.stringify(jsonld)}</script>`,
      ].filter(Boolean)
      return html.replace('<!--HEAD-->', tags.join('\n    '))
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), head()],
  build: { target: 'es2020', cssCodeSplit: false },
})
