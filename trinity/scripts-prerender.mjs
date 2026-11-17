// Pré-renderiza o HTML da página no build (o conteúdo aparece antes do JavaScript carregar).
import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const dist = path.resolve('dist')
const { render } = await import(pathToFileURL(path.resolve('dist-ssr/entry-server.js')).href)
let html = fs.readFileSync(path.join(dist, 'index.html'), 'utf8')
html = html.replace('<div id="root"></div>', `<div id="root">${render()}</div>`)
const font = fs.readdirSync(path.join(dist, 'assets')).find((f) => /brygada-1918-latin-400-normal.*\.woff2$/.test(f))
if (font) html = html.replace('</title>', `</title>\n    <link rel="preload" href="/assets/${font}" as="font" type="font/woff2" crossorigin />`)
fs.writeFileSync(path.join(dist, 'index.html'), html)
fs.rmSync(path.resolve('dist-ssr'), { recursive: true, force: true })
console.log('prerender ok', Math.round(html.length / 1024) + 'KB')
