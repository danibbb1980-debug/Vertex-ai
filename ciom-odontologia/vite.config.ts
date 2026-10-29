import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { CONFIG, enderecoTexto } from './src/config'

/** Injeta no index.html as metas que dependem do config (URL, rascunho, JSON-LD). */
function seoDoConfig(): Plugin {
  return {
    name: 'seo-do-config',
    transformIndexHtml(html) {
      const url = CONFIG.siteUrl.replace(/\/$/, '')
      if (/localhost|127\.0\.0\.1/.test(url)) throw new Error('CONFIG.siteUrl não pode ser localhost')
      const e = CONFIG.endereco
      const dias = CONFIG.horarios.filter((h) => h.abre && h.fecha)
      const nomesEn = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      const ld: Record<string, unknown> = {
        '@context': 'https://schema.org',
        '@type': 'Dentist',
        name: CONFIG.nome,
        url: url + '/',
        telephone: '+' + CONFIG.whatsapp,
        address: {
          '@type': 'PostalAddress',
          streetAddress: e.numero ? `${e.rua}, ${e.numero}` : e.rua,
          addressLocality: e.cidade,
          addressRegion: e.uf,
          postalCode: e.cep,
          addressCountry: 'BR',
        },
        hasMap: CONFIG.mapsUrl,
        sameAs: [CONFIG.instagram.url],
        paymentAccepted: CONFIG.pagamentos.join(', '),
        openingHoursSpecification: dias.map((h) => ({
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: nomesEn[h.dia],
          opens: h.abre,
          closes: h.fecha,
        })),
        availableService: CONFIG.atendimentos.map((a) => ({ '@type': 'MedicalProcedure', name: a.nome })),
      }
      if (CONFIG.fotos.fachada) ld.image = url + CONFIG.fotos.fachada.src
      if (CONFIG.responsavelTecnico.nome && CONFIG.responsavelTecnico.cro) {
        ld.employee = {
          '@type': 'Person',
          name: CONFIG.responsavelTecnico.nome,
          identifier: CONFIG.responsavelTecnico.cro,
        }
      }
      const robots = CONFIG.rascunho
        ? '<meta name="robots" content="noindex, nofollow" />\n    <meta name="googlebot" content="noindex, nofollow" />'
        : ''
      return html
        .replaceAll('%SITE_URL%', url)
        .replace('<!--ROBOTS-->', robots)
        .replace('<!--ENDERECO-->', enderecoTexto())
        .replace(
          '<!--JSONLD-->',
          `<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>`,
        )
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), seoDoConfig()],
  build: { target: 'es2020', cssMinify: true },
})
