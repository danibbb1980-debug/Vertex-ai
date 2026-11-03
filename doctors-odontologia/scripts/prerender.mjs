// Gera o HTML estático da página (melhora o primeiro carregamento e o SEO).
import { readFileSync, writeFileSync, rmSync } from 'node:fs'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const dist = resolve('dist')
const { render } = await import(pathToFileURL(resolve('dist-ssr/entry-server.js')).href)
const html = readFileSync(resolve(dist, 'index.html'), 'utf8')
const app = render()
writeFileSync(resolve(dist, 'index.html'), html.replace('<div id="root"></div>', `<div id="root">${app}</div>`))
rmSync(resolve('dist-ssr'), { recursive: true, force: true })
console.log('prerender ok:', Math.round(app.length / 1024) + ' KB de HTML')
