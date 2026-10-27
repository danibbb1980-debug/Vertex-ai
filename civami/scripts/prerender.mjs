// Pré-renderiza a página no build e embute o CSS no HTML (sem requisição bloqueante).
// Roda depois de `vite build` e `vite build --ssr`.
import { readFile, writeFile, rm } from 'node:fs/promises'
import { pathToFileURL } from 'node:url'
import { resolve } from 'node:path'

const dist = resolve('dist')
const { render } = await import(pathToFileURL(resolve('dist-ssr/entry-server.js')).href)
const file = resolve(dist, 'index.html')
let html = await readFile(file, 'utf8')
if (!html.includes('<div id="root"></div>')) throw new Error('marcador #root não encontrado')
html = html.replace('<div id="root"></div>', `<div id="root">${render()}</div>`)

const link = html.match(/<link rel="stylesheet"[^>]*href="(\/assets\/[^"]+\.css)"[^>]*>/)
if (link) {
  const css = await readFile(resolve(dist, '.' + link[1]), 'utf8')
  html = html.replace(link[0], `<style>${css}</style>`)
}
// Pré-carrega as fontes usadas na primeira dobra (latin)
const { readdir } = await import('node:fs/promises')
const fontes = (await readdir(resolve(dist, 'assets'))).filter((f) =>
  /^(fraunces-(normal|italic)|manrope-latin-wght-normal)-.*\.woff2$/.test(f),
)
const preloads = fontes
  .map((f) => `<link rel="preload" as="font" type="font/woff2" href="/assets/${f}" crossorigin />`)
  .join('\n    ')
html = html.replace('</title>', `</title>\n    ${preloads}`)
await writeFile(file, html)
await rm(resolve('dist-ssr'), { recursive: true, force: true })
console.log(`prerender: dist/index.html gerado${link ? ' com CSS embutido' : ''}`)
