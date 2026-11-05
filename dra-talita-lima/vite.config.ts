import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { CONFIG } from './src/config.ts'

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

/** Gera title, metas, Open Graph, canonical e JSON-LD a partir do src/config.ts. */
function seo(): Plugin {
  const url = CONFIG.siteUrl.replace(/\/$/, '')
  const titulo = `${CONFIG.nome} | Cirurgia Vascular em ${CONFIG.cidade} - ${CONFIG.uf}`
  const descricao = `${CONFIG.nome}, cirurgiã vascular em ${CONFIG.cidade} - ${CONFIG.uf}. Cirurgia vascular, fleboestética (varizes e vasinhos) e endolaser, com avaliação individual e hora marcada.`
  const ogImagem = '/og-image.jpg'
  const dias = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const e = CONFIG.endereco
  const jsonld = {
    '@context': 'https://schema.org',
    '@type': 'Physician',
    '@id': `${url}/#medica`,
    name: CONFIG.nome,
    description: descricao,
    url: `${url}/`,
    image: `${url}${ogImagem}`,
    telephone: '+55-35-3114-5756',
    identifier: { '@type': 'PropertyValue', propertyID: 'CRM-MG', value: CONFIG.crmNumero },
    address: {
      '@type': 'PostalAddress',
      streetAddress: `${e.logradouro}, ${e.complemento}, ${e.predio}`,
      addressLocality: e.cidade,
      addressRegion: e.uf,
      addressCountry: e.pais,
    },
    openingHoursSpecification: CONFIG.horarios.flatMap((h) =>
      h.periodos.map((p) => ({ '@type': 'OpeningHoursSpecification', dayOfWeek: dias[h.dia], opens: p.inicio, closes: p.fim })),
    ),
    hasMap: CONFIG.mapsUrl,
    sameAs: [CONFIG.instagram.url],
    ...(CONFIG.mostrarEspecialidadesAdicionais && CONFIG.especialidadesAdicionais.some((x) => x.rqe)
      ? { knowsAbout: CONFIG.especialidadesAdicionais.filter((x) => x.rqe).map((x) => x.nome) }
      : {}),
  }
  const robots = CONFIG.rascunho
    ? `<meta name="robots" content="noindex, nofollow" />\n    <meta name="googlebot" content="noindex, nofollow" />`
    : `<meta name="robots" content="index, follow" />`
  const head = `<title>${esc(titulo)}</title>
    <meta name="description" content="${esc(descricao)}" />
    ${robots}
    <link rel="canonical" href="${url}/" />
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="pt_BR" />
    <meta property="og:site_name" content="${esc(CONFIG.nome)}" />
    <meta property="og:title" content="${esc(titulo)}" />
    <meta property="og:description" content="${esc(descricao)}" />
    <meta property="og:url" content="${url}/" />
    <meta property="og:image" content="${url}${ogImagem}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${esc(`${CONFIG.nome}, cirurgia vascular e endolaser`)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <script type="application/ld+json">${JSON.stringify(jsonld).replace(/</g, '\\u003c')}</script>`
  return {
    name: 'seo-config',
    transformIndexHtml: (html) => html.replace('<!--HEAD-->', head),
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), seo()],
  build: { target: 'es2020', cssCodeSplit: false, assetsInlineLimit: 0 },
})
