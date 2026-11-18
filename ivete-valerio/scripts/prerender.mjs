// Pré-renderiza o HTML da página no build, para o conteúdo aparecer antes do JavaScript.
import { readFileSync, writeFileSync, rmSync } from 'node:fs'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { dirname, resolve } from 'node:path'

const raiz = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const { render } = await import(pathToFileURL(resolve(raiz, 'dist-ssr/entry-server.js')).href)
const arquivo = resolve(raiz, 'dist/index.html')
const html = readFileSync(arquivo, 'utf8')
if (!html.includes('<div id="root"></div>')) throw new Error('raiz não encontrada em dist/index.html')
let saida = html.replace('<div id="root"></div>', `<div id="root">${render()}</div>`)
// CSS embutido no HTML: evita uma requisição que bloqueia a primeira pintura
saida = saida.replace(/<link rel="stylesheet"[^>]*href="(\/assets\/[^"]+\.css)"[^>]*>/, (_, href) => {
  const css = readFileSync(resolve(raiz, 'dist' + href), 'utf8')
  return `<style>${css}</style>`
})
writeFileSync(arquivo, saida)
rmSync(resolve(raiz, 'dist-ssr'), { recursive: true, force: true })
console.log('pré-renderizado: dist/index.html')
