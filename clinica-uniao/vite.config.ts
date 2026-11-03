import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { CONFIG } from './src/config'
import { openingHoursSpecification } from './src/lib/horarios'

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const TITULO = 'Clínica União | Dentista em Pouso Alegre - MG'
const DESCRICAO =
  'Estética do sorriso, implantes, reabilitação oral, endodontia, ortodontia, odontopediatria e harmonização facial, com hora marcada, no centro de Pouso Alegre - MG.'

/** Gera <head> (SEO, Open Graph, noindex do rascunho e JSON-LD) a partir do config. */
function headDoConfig(): Plugin {
  return {
    name: 'head-do-config',
    transformIndexHtml(html) {
      const url = CONFIG.siteUrl.replace(/\/$/, '')
      const og = `${url}/img/og-clinica-uniao.jpg`
      const e = CONFIG.endereco
      const jsonld: Record<string, unknown> = {
        '@context': 'https://schema.org',
        '@type': 'Dentist',
        name: CONFIG.nome,
        url: `${url}/`,
        image: og,
        logo: `${url}/img/logo-uniao.jpg`,
        telephone: CONFIG.telefoneE164,
        address: {
          '@type': 'PostalAddress',
          streetAddress: e.logradouro,
          addressLocality: e.cidade,
          addressRegion: e.uf,
          postalCode: e.cep,
          addressCountry: 'BR',
        },
        areaServed: { '@type': 'City', name: e.cidade },
        openingHoursSpecification: openingHoursSpecification(),
        paymentAccepted: CONFIG.pagamentos.join(', '),
        sameAs: [CONFIG.instagram.url, CONFIG.mapsUrl].filter(Boolean),
        availableService: CONFIG.atendimentos.map((a) => ({ '@type': 'MedicalProcedure', name: a.nome })),
      }
      if (CONFIG.responsavelTecnico) {
        jsonld.employee = {
          '@type': 'Person',
          name: CONFIG.responsavelTecnico.nome,
          identifier: CONFIG.responsavelTecnico.cro,
        }
      }
      const robots = CONFIG.rascunho ? 'noindex, nofollow' : 'index, follow'
      const tags = [
        `<title>${esc(TITULO)}</title>`,
        `<meta name="description" content="${esc(DESCRICAO)}" />`,
        `<meta name="robots" content="${robots}" />`,
        `<meta name="googlebot" content="${robots}" />`,
        `<link rel="canonical" href="${url}/" />`,
        `<meta property="og:type" content="website" />`,
        `<meta property="og:locale" content="pt_BR" />`,
        `<meta property="og:site_name" content="${esc(CONFIG.nome)}" />`,
        `<meta property="og:title" content="${esc(TITULO)}" />`,
        `<meta property="og:description" content="${esc(DESCRICAO)}" />`,
        `<meta property="og:url" content="${url}/" />`,
        `<meta property="og:image" content="${og}" />`,
        `<meta property="og:image:width" content="1200" />`,
        `<meta property="og:image:height" content="630" />`,
        `<meta property="og:image:alt" content="Logo da Clínica União, Pouso Alegre" />`,
        `<meta name="twitter:card" content="summary_large_image" />`,
        `<script type="application/ld+json">${JSON.stringify(jsonld).replace(/</g, '\\u003c')}</script>`,
      ].join('\n    ')
      const noscript = `<noscript><p style="padding:24px;font-family:sans-serif">${esc(CONFIG.nome)}: ${esc(e.logradouro)} - ${esc(e.bairro)}, ${esc(e.cidade)} - ${e.uf}. Telefone ${esc(CONFIG.telefone)}.</p></noscript>`
      return html.replace('<!--HEAD-->', tags).replace('<!--NOSCRIPT-->', noscript).replace('__BANNER__', CONFIG.rascunho ? '32px' : '0px')
    },
  }
}

/** Pré-carrega as fontes latinas usadas na primeira dobra (evita salto de layout). */
function preloadFontes(): Plugin {
  return {
    name: 'preload-fontes',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(_html, ctx) {
        const alvo = /(fraunces-latin-wght-(normal|italic)|dm-sans-latin-wght-normal)-.*\.woff2$/
        return Object.keys(ctx.bundle ?? {})
          .filter((f) => alvo.test(f))
          .map((f) => ({
            tag: 'link',
            attrs: { rel: 'preload', as: 'font', type: 'font/woff2', href: `/${f}`, crossorigin: '' },
            injectTo: 'head' as const,
          }))
      },
    },
  }
}

export default defineConfig({
  plugins: [react(), headDoConfig(), preloadFontes()],
  build: { target: 'es2020', cssCodeSplit: false, assetsInlineLimit: 0 },
})
