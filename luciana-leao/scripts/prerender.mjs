// Injeta o HTML pré-renderizado (React no servidor) em dist/index.html.
// Assim o conteúdo aparece antes do JavaScript carregar (melhor para LCP e SEO).
import { readFileSync, writeFileSync, rmSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import { resolve } from 'node:path'

const raiz = resolve(import.meta.dirname, '..')
const { render } = await import(pathToFileURL(resolve(raiz, 'dist-ssr/entry-server.js')).href)
const arquivo = resolve(raiz, 'dist/index.html')
const html = readFileSync(arquivo, 'utf8')
if (!html.includes('<div id="root"></div>')) throw new Error('marcador #root não encontrado')
let saida = html.replace('<div id="root"></div>', `<div id="root">${render()}</div>`)

// CSS embutido no HTML (evita uma requisição que bloqueia a renderização)
const link = saida.match(/<link rel="stylesheet"[^>]*href="(\/assets\/[^"]+\.css)"[^>]*>/)
if (link) {
  const css = readFileSync(resolve(raiz, 'dist' + link[1]), 'utf8')
  saida = saida.replace(link[0], `<style>${css}</style>`)
  // pré-carrega as fontes usadas na primeira dobra
  const fontes = ['fraunces-latin-wght-normal', 'fraunces-latin-wght-italic', 'figtree-latin-wght-normal']
    .map((n) => css.match(new RegExp(`/assets/${n}-[^)"']+\\.woff2`))?.[0])
    .filter(Boolean)
    .map((u) => `<link rel="preload" href="${u}" as="font" type="font/woff2" crossorigin>`)
    .join('')
  saida = saida.replace('</title>', `</title>${fontes}`)
}
writeFileSync(arquivo, saida)
rmSync(resolve(raiz, 'dist-ssr'), { recursive: true, force: true })
console.log('pré-renderização concluída')
