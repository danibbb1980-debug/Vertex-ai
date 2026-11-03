// Pós-build: pré-renderiza o HTML da página, embute o CSS (menos uma ida à rede antes da
// primeira pintura) e pré-carrega as duas fontes usadas acima da dobra.
import { readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import { resolve } from 'node:path'

const { render } = await import(pathToFileURL(resolve('.ssr/entry-server.js')).href)
const arquivo = resolve('dist/index.html')
let html = readFileSync(arquivo, 'utf8')

if (!html.includes('<div id="root"></div>')) throw new Error('Marcador #root não encontrado')
html = html.replace('<div id="root"></div>', () => `<div id="root">${render()}</div>`)

const css = html.match(/<link rel="stylesheet"[^>]*href="(\/assets\/[^"]+\.css)"[^>]*>/)
if (css) {
  const conteudo = readFileSync(resolve('dist' + css[1]), 'utf8')
  html = html.replace(css[0], () => `<style>${conteudo}</style>`)
}

const fontes = readdirSync(resolve('dist/assets')).filter((f) =>
  /^(bricolage-grotesque-latin-opsz|dm-sans-latin-wght)-normal-.*\.woff2$/.test(f),
)
const preloads = fontes
  .map((f) => `<link rel="preload" href="/assets/${f}" as="font" type="font/woff2" crossorigin />`)
  .join('\n    ')
html = html.replace('<meta name="theme-color"', () => `${preloads}\n    <meta name="theme-color"`)

writeFileSync(arquivo, html)
rmSync(resolve('.ssr'), { recursive: true, force: true })
console.log(`Pré-render concluído: dist/index.html (CSS embutido: ${!!css}, fontes pré-carregadas: ${fontes.length})`)
