import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { CONFIG, enderecoCompleto } from './src/config'
import { paginaPrivacidade, pagina404 } from './src/static-pages'

const TITLE = `${CONFIG.nome} | Advogado Criminalista em ${CONFIG.endereco.cidade} - ${CONFIG.endereco.uf}`
const DESCRIPTION = `${CONFIG.nome}, advogado criminalista (${CONFIG.oab}) em ${CONFIG.endereco.cidade} - ${CONFIG.endereco.uf}. Direito Penal e Processo Penal: inquéritos, ações penais, Tribunal do Júri, recursos, habeas corpus e execução penal.`
const areas = CONFIG.areas.filter((a) => a.confirmado).map((a) => a.titulo)

function esc(s: string) {
  return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
}

/** Injeta metas, canonical, Open Graph e JSON-LD a partir de src/config.ts. */
function siteMeta(): Plugin {
  const url = CONFIG.siteUrl.replace(/\/$/, '')
  if (/localhost|127\.0\.0\.1/.test(url)) throw new Error('CONFIG.siteUrl não pode ser localhost')

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': ['Attorney', 'LegalService'],
    name: CONFIG.nome,
    description: `Advogado criminalista. Atuação em Direito Penal e Processo Penal, da investigação policial à execução da pena.`,
    jobTitle: 'Advogado criminalista',
    identifier: { '@type': 'PropertyValue', propertyID: CONFIG.oabSeccional, value: CONFIG.oabNumero },
    knowsAbout: ['Direito Penal', 'Direito Processual Penal', ...areas],
    url: url + '/',
    telephone: CONFIG.telefoneFixoLink,
    logo: url + CONFIG.logo.completa,
    ...(CONFIG.foto.base ? { image: `${url}${CONFIG.foto.base}-800.webp` } : {}),
    address: {
      '@type': 'PostalAddress',
      streetAddress: CONFIG.endereco.rua,
      addressLocality: CONFIG.endereco.cidade,
      addressRegion: CONFIG.endereco.uf,
      postalCode: CONFIG.endereco.cep,
      addressCountry: 'BR',
    },
    openingHours: CONFIG.horariosSchema,
    areaServed: `${CONFIG.endereco.cidade} - ${CONFIG.endereco.uf}`,
  }

  const robots = CONFIG.rascunho ? 'noindex, nofollow' : 'index, follow'

  return {
    name: 'site-meta',
    transformIndexHtml(html) {
      return html
        .replace('<html lang="pt-BR">', `<html lang="pt-BR" style="--banner-h:${CONFIG.rascunho ? '2rem' : '0px'}">`)
        .replace(/%TITLE%/g, esc(TITLE))
        .replace(/%DESCRIPTION%/g, esc(DESCRIPTION))
        .replace(/%ROBOTS%/g, robots)
        .replace(/%URL%/g, url + '/')
        .replace('%OG_IMAGE%', CONFIG.ogImage ? `<meta property="og:image" content="${url}${CONFIG.ogImage}" />\n    <meta property="og:image:width" content="1200" />\n    <meta property="og:image:height" content="630" />\n    <meta property="og:image:alt" content="${esc(CONFIG.nome + ' · ' + CONFIG.profissao)}" />` : '')
        .replace('%JSONLD%', JSON.stringify(jsonLd))
        .replace('%ENDERECO%', esc(enderecoCompleto))
    },
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'privacidade.html', source: paginaPrivacidade(robots) })
      this.emitFile({ type: 'asset', fileName: '404.html', source: pagina404(robots) })
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), siteMeta()],
})
