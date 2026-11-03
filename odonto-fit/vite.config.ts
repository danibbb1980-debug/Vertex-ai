import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { CONFIG } from './src/config.ts'

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

/** Monta o <head> (SEO, Open Graph, noindex e JSON-LD) a partir de src/config.ts. */
function head(): Plugin {
  return {
    name: 'odonto-fit-head',
    transformIndexHtml(html) {
      const url = `${CONFIG.siteUrl}/`
      const titulo = `${CONFIG.nome} | Dentista em ${CONFIG.cidade} - ${CONFIG.uf}`
      const desc = `Clínica odontológica em ${CONFIG.cidade} - ${CONFIG.uf} com atendimento em implantes, ortodontia, próteses, harmonização facial, periodontia e endodontia, com hora marcada.`
      const e = CONFIG.endereco
      const dias = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      const horarios = Object.entries(CONFIG.horarios).flatMap(([d, h]) => {
        if (!h) return []
        const faixas = h.almoco ? [[h.abre, h.almoco.inicio], [h.almoco.fim, h.fecha]] : [[h.abre, h.fecha]]
        return faixas.map(([opens, closes]) => ({ '@type': 'OpeningHoursSpecification', dayOfWeek: dias[Number(d)], opens, closes }))
      })
      const rt = CONFIG.responsavelTecnico
      const ld: Record<string, unknown> = {
        '@context': 'https://schema.org',
        '@type': 'Dentist',
        name: CONFIG.nome,
        url,
        telephone: `+55 ${CONFIG.telefone}`,
        address: {
          '@type': 'PostalAddress',
          streetAddress: e.rua,
          addressLocality: e.cidade,
          addressRegion: e.uf,
          postalCode: e.cep,
          addressCountry: 'BR',
        },
        areaServed: e.cidade,
        hasMap: CONFIG.mapsUrl,
        sameAs: [CONFIG.instagram],
        openingHoursSpecification: horarios,
        paymentAccepted: CONFIG.pagamentos.join(', '),
        logo: `${CONFIG.siteUrl}/logo-odonto-fit.jpg`,
      }
      if (rt.nome && rt.cro) ld.employee = { '@type': 'Person', name: rt.nome, identifier: `CRO ${rt.cro}` }
      const robots = CONFIG.rascunho
        ? `<meta name="robots" content="noindex, nofollow" />\n    <meta name="googlebot" content="noindex, nofollow" />`
        : `<meta name="robots" content="index, follow" />`
      const tags = `<title>${esc(titulo)}</title>
    <meta name="description" content="${esc(desc)}" />
    ${robots}
    <link rel="canonical" href="${url}" />
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="pt_BR" />
    <meta property="og:site_name" content="${esc(CONFIG.nome)}" />
    <meta property="og:title" content="${esc(titulo)}" />
    <meta property="og:description" content="${esc(desc)}" />
    <meta property="og:url" content="${url}" />
    <meta name="twitter:card" content="summary" />
    <script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>`
      return html.replace('<!--head-->', tags)
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), head()],
  build: { target: 'es2022', cssCodeSplit: false },
})
