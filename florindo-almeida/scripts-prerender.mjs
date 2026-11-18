// Gera o HTML estático da página a partir do App (SSG simples) e o injeta em dist/index.html
import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const dist = path.resolve('dist')
const { render } = await import(pathToFileURL(path.resolve('dist-ssr/entry-server.js')).href)
const html = fs.readFileSync(path.join(dist, 'index.html'), 'utf8')
const out = html.replace('<div id="root"></div>', `<div id="root">${render()}</div>`)
fs.writeFileSync(path.join(dist, 'index.html'), out)
fs.rmSync('dist-ssr', { recursive: true, force: true })
console.log('prerender ok:', out.length, 'bytes')
