// Pré-renderiza o React no dist/index.html: conteúdo real no HTML estático, sem tela em branco antes do JS
import { readFileSync, writeFileSync, rmSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import { resolve } from 'node:path'

const dist = resolve('dist')
const { render } = await import(pathToFileURL(resolve('dist-ssr/entry-server.js')).href)
const html = readFileSync(`${dist}/index.html`, 'utf8')
const out = html.replace('<div id="root"></div>', `<div id="root">${render()}</div>`)
if (out === html) throw new Error('marcador #root não encontrado')
writeFileSync(`${dist}/index.html`, out)
rmSync('dist-ssr', { recursive: true, force: true })
console.log('pré-renderizado:', Math.round(out.length / 1024), 'KB')
