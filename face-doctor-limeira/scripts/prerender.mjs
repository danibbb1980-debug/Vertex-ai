/**
 * Pré-renderização estática: injeta o HTML do React, as metas, o JSON-LD e o
 * CSS crítico (inline) no dist/index.html. O site é legível sem JavaScript.
 */
import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const raiz = path.resolve(import.meta.dirname, '..')
const dist = path.join(raiz, 'dist')
const ssr = await import(pathToFileURL(path.join(raiz, 'dist-ssr/entry-server.js')).href)
const { CONFIG } = ssr

let html = fs.readFileSync(path.join(dist, 'index.html'), 'utf8')
const app = ssr.render()
const url = CONFIG.siteUrl.replace(/\/$/, '')
const titulo = 'Face Doctor Limeira | Estética Facial e Corporal em Limeira - SP'
const descricao =
  'Estética facial e corporal com avaliação personalizada em Limeira - SP. Rua Bahia, 884, Vila Cristovam. Agende sua avaliação pelo WhatsApp.'
const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

const robots = CONFIG.rascunho
  ? `<meta name="robots" content="noindex, nofollow" />\n    <meta name="googlebot" content="noindex, nofollow" />`
  : `<meta name="robots" content="index, follow" />`

const meta = `<title>${esc(titulo)}</title>
    <meta name="description" content="${esc(descricao)}" />
    ${robots}
    <link rel="canonical" href="${url}/" />
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="pt_BR" />
    <meta property="og:site_name" content="${esc(CONFIG.nome)}" />
    <meta property="og:title" content="${esc(titulo)}" />
    <meta property="og:description" content="${esc(descricao)}" />
    <meta property="og:url" content="${url}/" />
    <meta property="og:image" content="${url}${CONFIG.logo.src}" />
    <meta property="og:image:width" content="${CONFIG.logo.largura}" />
    <meta property="og:image:height" content="${CONFIG.logo.altura}" />
    <meta property="og:image:alt" content="Logo da ${esc(CONFIG.nome)}" />
    <meta name="twitter:card" content="summary" />
    <script type="application/ld+json">${ssr.jsonLd()}</script>`

// CSS inline (pequeno): sem requisição bloqueante
html = html.replace(/<link rel="stylesheet"[^>]*href="(\/assets\/[^"]+\.css)"[^>]*>/, (_, href) => {
  const css = fs.readFileSync(path.join(dist, href), 'utf8')
  return `<style>${css}</style>`
})

// Preload só da fonte do hero (Newsreader romana)
const fontes = fs.readdirSync(path.join(dist, 'assets')).filter((f) => f.endsWith('.woff2'))
const hero = fontes.find((f) => f.startsWith('newsreader-latin-wght-normal'))
const preload = hero
  ? `<link rel="preload" href="/assets/${hero}" as="font" type="font/woff2" crossorigin />`
  : ''

html = html.replace('<!--meta-->', `${meta}\n    ${preload}`).replace('<!--app-->', app)
fs.writeFileSync(path.join(dist, 'index.html'), html)
fs.rmSync(path.join(raiz, 'dist-ssr'), { recursive: true, force: true })
console.log('prerender ok:', (html.length / 1024).toFixed(1), 'KB')
