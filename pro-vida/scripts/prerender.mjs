// Gera o HTML estático da página no build, para o texto aparecer antes do JS.
import { readFileSync, writeFileSync, rmSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))
const { render } = await import(root + 'dist-ssr/entry-server.js')
const file = root + 'dist/index.html'
const html = readFileSync(file, 'utf8')
if (!html.includes('<div id="root"></div>')) throw new Error('marcador #root não encontrado')
writeFileSync(file, html.replace('<div id="root"></div>', `<div id="root">${render()}</div>`))
rmSync(root + 'dist-ssr', { recursive: true, force: true })
console.log('prerender ok')
