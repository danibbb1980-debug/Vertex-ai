// Gera o HTML estático da página (o conteúdo existe antes do JavaScript).
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')
const ssr = await import(pathToFileURL(path.join(root, 'dist-ssr', 'entry-server.js')).href)
let html = fs.readFileSync(path.join(dist, 'index.html'), 'utf8')
const h = ssr.head()

// CSS crítico inline: o CSS inteiro é pequeno, então vai inline e a folha externa sai.
html = html.replace(/<link rel="stylesheet"[^>]*href="(\/assets\/[^"]+\.css)"[^>]*>/, (_m, href) => {
  const css = fs.readFileSync(path.join(dist, href), 'utf8')
  return `<style>${css}</style>`
})

html = html
  .replaceAll('%SITE_URL%', h.siteUrl)
  .replace('<!--robots-->', h.rascunho ? '<meta name="robots" content="noindex, nofollow" />\n    <meta name="googlebot" content="noindex, nofollow" />' : '')
  .replace('<!--og-image-->', h.og ? `<meta property="og:image" content="${h.siteUrl}/og.jpg" />\n    <meta property="og:image:width" content="1200" />\n    <meta property="og:image:height" content="630" />\n    <meta property="og:image:alt" content="Consultório do nutricionista Matheus Quinteiro em Poços de Caldas" />` : '')
  .replace('<!--jsonld-->', `<script type="application/ld+json">${h.jsonld}</script>`)
  .replace('<!--app-->', ssr.render())
if (!h.rascunho) html = html.replace(' has-draft', '')

if (/localhost/.test(html)) throw new Error('HTML contém "localhost"')
fs.writeFileSync(path.join(dist, 'index.html'), html)
fs.rmSync(path.join(root, 'dist-ssr'), { recursive: true, force: true })
console.log('prerender ok', (html.length / 1024).toFixed(1) + ' KB')
