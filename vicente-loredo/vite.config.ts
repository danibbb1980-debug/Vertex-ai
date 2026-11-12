import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { CONFIG, oabTexto } from './src/config'

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

function headFromConfig(): Plugin {
  return {
    name: 'head-from-config',
    transformIndexHtml(html) {
      const url = CONFIG.siteUrl.replace(/\/$/, '') + '/'
      const title = 'Vicente Loredo | Advogado em Varginha - MG | Direito Tributário, Empresarial e do Trabalho'
      const desc =
        'Atuação em Direito Tributário, Direito Empresarial e Direito do Trabalho, com atendimento direto pelo advogado, em Varginha - MG.'
      const dias = CONFIG.horarios.filter((h) => h.abre)
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      const ld = {
        '@context': 'https://schema.org',
        '@type': 'Attorney',
        name: CONFIG.nomeExibicao + ' - Advogado',
        ...(CONFIG.nomeCompleto ? { alternateName: CONFIG.nomeCompleto } : {}),
        url,
        ...(CONFIG.fotos.advogado ? { image: url + CONFIG.fotos.advogado.replace(/^\//, '') } : {}),
        ...(CONFIG.whatsapp ? { telephone: '+' + CONFIG.whatsapp } : {}),
        address: {
          '@type': 'PostalAddress',
          streetAddress: `${CONFIG.endereco.logradouro}, ${CONFIG.endereco.complemento}`,
          addressLocality: CONFIG.endereco.cidade,
          addressRegion: CONFIG.endereco.uf,
          postalCode: CONFIG.endereco.cep,
          addressCountry: 'BR',
        },
        areaServed: 'Varginha - MG',
        knowsAbout: CONFIG.areas.map((a) => a.titulo),
        openingHoursSpecification: dias.map((h) => ({
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: dayNames[h.dia],
          opens: h.abre,
          closes: h.fecha,
        })),
        ...(CONFIG.instagram ? { sameAs: [CONFIG.instagram] } : {}),
      }
      const tags: string[] = [
        `<title>${esc(title)}</title>`,
        `<meta name="description" content="${esc(desc)}">`,
        `<link rel="canonical" href="${url}">`,
        `<meta property="og:type" content="website">`,
        `<meta property="og:locale" content="pt_BR">`,
        `<meta property="og:title" content="${esc(title)}">`,
        `<meta property="og:description" content="${esc(desc)}">`,
        `<meta property="og:url" content="${url}">`,
        `<meta name="author" content="${esc(CONFIG.nomeExibicao + (oabTexto ? ' - ' + oabTexto : ''))}">`,
        `<script type="application/ld+json">${JSON.stringify(ld)}</script>`,
      ]
      if (CONFIG.fotos.advogado)
        tags.push(`<meta property="og:image" content="${url}${CONFIG.fotos.advogado.replace(/^\//, '')}">`)
      if (CONFIG.rascunho)
        tags.push(
          `<meta name="robots" content="noindex, nofollow">`,
          `<meta name="googlebot" content="noindex, nofollow">`,
        )
      return html.replace('<!--HEAD-->', tags.join('\n    '))
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), headFromConfig()],
})
