// Gera o HTML estático da página (melhor primeira pintura e SEO). Roda após o build.
import { readFileSync, writeFileSync, rmSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import { resolve } from 'node:path'

const { render } = await import(pathToFileURL(resolve('dist-ssr/entry-server.js')).href)
const arq = resolve('dist/index.html')
const html = readFileSync(arq, 'utf8')
const app = render()
if (!html.includes('<div id="root"></div>')) throw new Error('raiz não encontrada')
writeFileSync(arq, html.replace('<div id="root"></div>', `<div id="root">${app}</div>`))
rmSync('dist-ssr', { recursive: true, force: true })
console.log('prerender ok:', (app.length / 1024).toFixed(1), 'KB de HTML')
