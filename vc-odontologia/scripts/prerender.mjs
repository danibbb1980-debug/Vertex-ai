// Pré-renderiza a página no build: o HTML já sai pronto (melhor LCP e SEO).
import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const raiz = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..')
const dist = path.join(raiz, 'dist')
const { render } = await import(pathToFileURL(path.join(raiz, '.ssr', 'entry-server.js')).href)

let html = fs.readFileSync(path.join(dist, 'index.html'), 'utf8')
const app = render()
if (!html.includes('<!--app-->')) throw new Error('Marcador <!--app--> não encontrado')
html = html.replace('<!--app-->', app)

// Pré-carrega as fontes usadas acima da dobra
const assets = fs.readdirSync(path.join(dist, 'assets'))
const fontes = assets.filter((f) =>
  /^(cormorant-garamond-latin-500-normal|manrope-latin-wght-normal)-.*\.woff2$/.test(f),
)
const preloads = fontes
  .map((f) => `<link rel="preload" href="/assets/${f}" as="font" type="font/woff2" crossorigin />`)
  .join('\n    ')
html = html.replace('</title>', `</title>\n    ${preloads}`)

// CSS embutido no HTML (≈10 KB gzip): elimina uma ida ao servidor antes da 1ª pintura
const css = html.match(/<link rel="stylesheet"[^>]*href="(\/assets\/[^"]+\.css)"[^>]*>/)
if (css) {
  const conteudo = fs.readFileSync(path.join(dist, css[1]), 'utf8')
  html = html.replace(css[0], () => `<style>${conteudo}</style>`)
}

if (/localhost/.test(html)) throw new Error('O HTML final contém "localhost"')
fs.writeFileSync(path.join(dist, 'index.html'), html)
fs.rmSync(path.join(raiz, '.ssr'), { recursive: true, force: true })
console.log(`Pré-renderizado: ${(app.length / 1024).toFixed(1)} KB de HTML · fontes pré-carregadas: ${fontes.length}`)
