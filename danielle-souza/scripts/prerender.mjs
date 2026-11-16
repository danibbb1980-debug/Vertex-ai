// Injeta o HTML pré-renderizado em dist/index.html (executado depois do build).
import { readFileSync, writeFileSync, rmSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import { resolve } from 'node:path'

const ssr = resolve('dist-ssr/entry-server.js')
const { render } = await import(pathToFileURL(ssr).href)
const html = readFileSync('dist/index.html', 'utf8')
const app = render()
if (!html.includes('<div id="root"></div>')) throw new Error('marcador #root não encontrado')
writeFileSync('dist/index.html', html.replace('<div id="root"></div>', `<div id="root">${app}</div>`))
rmSync('dist-ssr', { recursive: true, force: true })
console.log(`pré-renderizado: ${(app.length / 1024).toFixed(1)} kB de HTML`)
