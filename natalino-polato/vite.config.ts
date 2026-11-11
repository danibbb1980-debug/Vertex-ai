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
    description: `${CONFIG.profissao}. ${CONFIG.oab}.`,
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


  return {
    name: 'site-meta',
    apply: (_, env) => !env.isSsrBuild,
    transformIndexHtml(html) {
      return html
        .replace(/%TITLE%/g, esc(TITLE))
        .replace(/%DESCRIPTION%/g, esc(DESCRIPTION))
        .replace(/%URL%/g, url + '/')
        .replace('%OG_IMAGE%', CONFIG.ogImage ? `<meta property="og:image" content="${url}${CONFIG.ogImage}" />\n    <meta property="og:image:width" content="1200" />\n    <meta property="og:image:height" content="630" />\n    <meta property="og:image:alt" content="${esc(CONFIG.nome + ' · ' + CONFIG.profissao)}" />` : '')
        .replace('%TW_IMAGE%', CONFIG.ogImage ? `<meta name="twitter:image" content="${url}${CONFIG.ogImage}" />` : '')
        .replace('%JSONLD%', JSON.stringify(jsonLd))
        .replace('%ENDERECO%', esc(enderecoCompleto))
    },
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'privacidade.html', source: paginaPrivacidade() })
      this.emitFile({ type: 'asset', fileName: '404.html', source: pagina404() })
    },
  }
}

/**
 * Embute o CSS no HTML para eliminar a requisição que bloqueia a renderização.
 * As URLs relativas do CSS (fontes) passam a ser absolutas a partir da raiz.
 */
function inlineCss(): Plugin {
  return {
    name: 'inline-css',
    apply: (_, env) => env.command === 'build' && !env.isSsrBuild,
    enforce: 'post',
    generateBundle(_, bundle) {
      const html = bundle['index.html']
      if (!html || html.type !== 'asset') return
      let out = String(html.source)
      for (const [name, file] of Object.entries(bundle)) {
        if (file.type !== 'asset' || !name.endsWith('.css')) continue
        const tag = new RegExp(`<link rel="stylesheet"[^>]*href="/${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[^>]*>`)
        if (!tag.test(out)) continue
        const css = String(file.source).replace(/url\(\/?assets\//g, 'url(/assets/')
        out = out.replace(tag, `<style>${css}</style>`)
        delete bundle[name]
      }
      html.source = out
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), siteMeta(), inlineCss()],
})
