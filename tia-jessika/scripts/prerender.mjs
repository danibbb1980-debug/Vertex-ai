// Gera o HTML estático da página (pré-renderização) para o conteúdo aparecer antes do JavaScript.
import { readFile, writeFile, rm, readdir } from 'node:fs/promises'
import { pathToFileURL } from 'node:url'
import { resolve } from 'node:path'

const dist = resolve('dist/index.html')
const ssr = resolve('.ssr/entry-server.js')
const { render } = await import(pathToFileURL(ssr).href)
const app = render()
let html = await readFile(dist, 'utf8')
if (!html.includes('<div id="root"></div>')) throw new Error('marcador #root não encontrado')
html = html.replace('<div id="root"></div>', `<div id="root">${app}</div>`)
// sem JavaScript, mostra os blocos que entram animados
html = html.replace(
  '</head>',
  '<noscript><style>#root [style*="opacity:0"]{opacity:1!important;transform:none!important}#root [style*="clip-path"]{clip-path:none!important}</style></noscript>\n  </head>',
)
// CSS embutido (evita uma requisição que bloqueia a renderização)
const cssLink = html.match(/<link rel="stylesheet"[^>]*href="(\/assets\/[^"]+\.css)"[^>]*>/)
if (cssLink) {
  const css = await readFile(resolve('dist' + cssLink[1]), 'utf8')
  html = html.replace(cssLink[0], `<style>${css}</style>`)
}
// pré-carrega as duas fontes do primeiro quadro (latin)
const assets = await readdir(resolve('dist/assets'))
const fontes = assets.filter((f) => /^(fraunces-latin-soft-normal|nunito-sans-latin-wght-normal)-.*\.woff2$/.test(f))
html = html.replace(
  '<!--FONTES-->',
  fontes.map((f) => `<link rel="preload" as="font" type="font/woff2" href="/assets/${f}" crossorigin />`).join('\n    '),
)
await writeFile(dist, html)
await rm(resolve('.ssr'), { recursive: true, force: true })
console.log(`pré-renderizado: ${(app.length / 1024).toFixed(1)} kB de HTML`)
