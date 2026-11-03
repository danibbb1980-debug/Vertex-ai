// Gera o HTML da página no build (texto visível antes do JavaScript carregar).
import { readFile, writeFile, rm } from 'node:fs/promises'
import { pathToFileURL } from 'node:url'
import { resolve } from 'node:path'

const dist = resolve('dist')
const ssr = resolve('dist-ssr/entry-server.js')
const { render } = await import(pathToFileURL(ssr).href)
const html = await readFile(`${dist}/index.html`, 'utf8')
const app = render()
if (!html.includes('<div id="root"></div>')) throw new Error('marcador #root não encontrado')
await writeFile(`${dist}/index.html`, html.replace('<div id="root"></div>', `<div id="root">${app}</div>`))
await rm(resolve('dist-ssr'), { recursive: true, force: true })
console.log(`prerender ok: ${(app.length / 1024).toFixed(1)} kB de HTML`)
