// Pós-build: pré-renderiza o HTML da página (conteúdo visível sem JS, melhor SEO e LCP),
// embute o CSS no <head> (sem requisição bloqueante) e pré-carrega as fontes principais.
import { readFileSync, writeFileSync, rmSync, readdirSync, unlinkSync } from 'node:fs'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { dirname, resolve } from 'node:path'

const raiz = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const dist = resolve(raiz, 'dist')
const { render } = await import(pathToFileURL(resolve(raiz, 'dist-ssr/entry-server.js')).href)
const arquivo = resolve(dist, 'index.html')
let html = readFileSync(arquivo, 'utf8')
if (!html.includes('<!--app-->')) throw new Error('Marcador <!--app--> não encontrado em dist/index.html')
html = html.replace('<!--app-->', render())

// CSS embutido
html = html.replace(/<link rel="stylesheet"[^>]*href="\/assets\/([^"]+\.css)"[^>]*>/, (_, nome) => {
  const css = readFileSync(resolve(dist, 'assets', nome), 'utf8')
  unlinkSync(resolve(dist, 'assets', nome))
  return `<style>${css}</style>`
})

// Pré-carregamento das fontes usadas acima da dobra (subconjunto latino)
const fontes = readdirSync(resolve(dist, 'assets')).filter((f) =>
  /^(fraunces-latin-opsz-(normal|italic)|dm-sans-latin-wght-normal)-.*\.woff2$/.test(f),
)
const preloads = fontes
  .map((f) => `<link rel="preload" href="/assets/${f}" as="font" type="font/woff2" crossorigin />`)
  .join('\n    ')
html = html.replace('</title>', `</title>\n    ${preloads}`)

writeFileSync(arquivo, html)
rmSync(resolve(raiz, 'dist-ssr'), { recursive: true, force: true })
console.log(`Pré-renderização concluída: dist/index.html (${fontes.length} fontes pré-carregadas, CSS embutido)`)
