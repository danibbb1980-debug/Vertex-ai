import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { CONFIG } from './src/config'

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

/** Gera as tags de SEO e o JSON-LD a partir de src/config.ts. */
function seoHead(): Plugin {
  return {
    name: 'seo-head',
    transformIndexHtml(html) {
      const url = CONFIG.siteUrl.replace(/\/$/, '')
      const e = CONFIG.endereco
      const cro = CONFIG.cro.trim()
      const og = CONFIG.seo.ogImage ? `${url}${CONFIG.seo.ogImage}` : ''
      const dias = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      const ld: Record<string, unknown> = {
        '@context': 'https://schema.org',
        '@type': 'Dentist',
        name: CONFIG.consultorio,
        url: `${url}/`,
        telephone: CONFIG.telefoneSchema,
        image: `${url}/img/logo-dr-vitor.png`,
        logo: `${url}/img/logo-dr-vitor.png`,
        hasMap: CONFIG.mapsUrl,
        address: {
          '@type': 'PostalAddress',
          streetAddress: `${e.rua}, ${e.complemento}`,
          addressLocality: e.cidade,
          addressRegion: e.uf,
          postalCode: e.cep,
          addressCountry: 'BR',
        },
        areaServed: { '@type': 'City', name: e.cidade },
        openingHoursSpecification: CONFIG.horarios.map((h) => ({
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: dias[h.dia],
          opens: h.abre,
          closes: h.fecha,
        })),
        paymentAccepted: CONFIG.estrutura.pagamentos.join(', '),
        employee: {
          '@type': 'Person',
          name: CONFIG.nome,
          jobTitle: CONFIG.profissao,
          alumniOf: CONFIG.formacao.map((f) => ({ '@type': 'CollegeOrUniversity', name: f.instituicao })),
          ...(cro ? { identifier: cro } : {}),
        },
      }
      const robots = CONFIG.rascunho ? 'noindex, nofollow' : 'index, follow'
      const tags = [
        `<title>${esc(CONFIG.seo.titulo)}</title>`,
        `<meta name="description" content="${esc(CONFIG.seo.descricao)}" />`,
        `<meta name="robots" content="${robots}" />`,
        `<meta name="googlebot" content="${robots}" />`,
        `<link rel="canonical" href="${url}/" />`,
        `<meta property="og:type" content="website" />`,
        `<meta property="og:locale" content="pt_BR" />`,
        `<meta property="og:site_name" content="${esc(CONFIG.consultorio)}" />`,
        `<meta property="og:title" content="${esc(CONFIG.seo.titulo)}" />`,
        `<meta property="og:description" content="${esc(CONFIG.seo.descricao)}" />`,
        `<meta property="og:url" content="${url}/" />`,
        og && `<meta property="og:image" content="${og}" />`,
        og && `<meta property="og:image:width" content="1200" />`,
        og && `<meta property="og:image:height" content="630" />`,
        og && `<meta property="og:image:alt" content="${esc(CONFIG.nome)}, ${esc(CONFIG.profissao)} em ${esc(e.cidade)} - ${e.uf}" />`,
        `<meta name="twitter:card" content="${og ? 'summary_large_image' : 'summary'}" />`,
        `<link rel="preload" as="image" href="/img/logo-dr-vitor.png" />`,
        `<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>`,
      ].filter(Boolean)
      return html.replace('<!--head-->', tags.join('\n    '))
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), seoHead()],
  build: { target: 'es2020', cssCodeSplit: false },
})
