// Pré-renderiza o HTML estático (melhor LCP e conteúdo sem JS).
import { readFileSync, writeFileSync, rmSync } from 'node:fs'
import { resolve } from 'node:path'

const dist = resolve('dist')
const { render } = await import(resolve('dist-ssr/entry-server.js'))
const html = readFileSync(resolve(dist, 'index.html'), 'utf8')
const out = html.replace('<div id="root"></div>', `<div id="root">${render()}</div>`)
writeFileSync(resolve(dist, 'index.html'), out)
rmSync(resolve('dist-ssr'), { recursive: true, force: true })
console.log('prerender ok')
