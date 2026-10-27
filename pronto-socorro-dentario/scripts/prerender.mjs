// Pré-renderiza a página no build: o HTML do hero e dos botões chega pronto, antes do JS.
// Também embute o CSS (evita uma requisição que bloqueia a renderização) e pré-carrega as fontes.
import { readFile, writeFile, rm, readdir } from 'node:fs/promises'
import { fileURLToPath, pathToFileURL } from 'node:url'
import path from 'node:path'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')
const { render } = await import(pathToFileURL(path.join(root, 'dist-ssr/entry-server.js')).href)
const file = path.join(dist, 'index.html')
let html = await readFile(file, 'utf8')

const app = render()
if (!html.includes('<div id="root"></div>')) throw new Error('marcador #root não encontrado')
html = html.replace('<div id="root"></div>', `<div id="root">${app}</div>`)

// CSS embutido
html = await replaceAsync(html, /<link rel="stylesheet" crossorigin href="([^"]+)">/g, async (_, href) => {
  const css = await readFile(path.join(dist, href), 'utf8')
  return `<style>${css}</style>`
})

// Preload das duas fontes (latinas)
const assets = await readdir(path.join(dist, 'assets'))
const fonts = assets.filter((f) => f.endsWith('.woff2'))
const preload = fonts.map((f) => `<link rel="preload" href="/assets/${f}" as="font" type="font/woff2" crossorigin>`).join('\n    ')
html = html.replace('<meta name="theme-color"', `${preload}\n    <meta name="theme-color"`)

if (/localhost|127\.0\.0\.1/.test(html)) throw new Error('HTML contém localhost')
await writeFile(file, html)
await rm(path.join(root, 'dist-ssr'), { recursive: true, force: true })
console.log('pré-renderizado:', (html.length / 1024).toFixed(1), 'KB;', 'fontes:', fonts.join(', '))

async function replaceAsync(str, re, fn) {
  const parts = []
  let last = 0
  for (const m of str.matchAll(re)) {
    parts.push(str.slice(last, m.index), await fn(...m))
    last = m.index + m[0].length
  }
  parts.push(str.slice(last))
  return parts.join('')
}
