// Pré-renderiza a página no build: o conteúdo aparece antes do JavaScript carregar.
import { readFileSync, writeFileSync, readdirSync, rmSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const raiz = resolve(import.meta.dirname, '..')
const dist = join(raiz, 'dist')
const ssr = join(raiz, 'dist-ssr')

const { render } = await import(pathToFileURL(join(ssr, 'entry-server.js')).href)
let html = readFileSync(join(dist, 'index.html'), 'utf8')

// 1) conteúdo
html = html.replace('<div id="root"></div>', `<div id="root">${render()}</div>`)

// 2) CSS crítico inline (evita uma ida ao servidor antes do primeiro paint)
html = html.replace(/<link rel="stylesheet"[^>]*href="(\/assets\/[^"]+\.css)"[^>]*>/, (_, href) => {
  const css = readFileSync(join(dist, href), 'utf8')
  return `<style>${css}</style>`
})

// 3) classe .js antes do primeiro paint (liga as animações de entrada) + preload das fontes principais
const fontes = readdirSync(join(dist, 'assets')).filter((f) =>
  /^(fraunces-latin-opsz-normal|manrope-latin-wght-normal)-.*\.woff2$/.test(f),
)
const preload = fontes
  .map((f) => `<link rel="preload" href="/assets/${f}" as="font" type="font/woff2" crossorigin />`)
  .join('\n    ')
html = html.replace(
  '<meta charset="UTF-8" />',
  `<meta charset="UTF-8" />\n    <script>document.documentElement.classList.add('js')</script>\n    ${preload}`,
)

writeFileSync(join(dist, 'index.html'), html)
rmSync(ssr, { recursive: true, force: true })
console.log(`prerender ok: ${Math.round(html.length / 1024)} KB, fontes pré-carregadas: ${fontes.length}`)
