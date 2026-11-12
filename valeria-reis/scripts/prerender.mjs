// Gera o HTML estático da página (conteúdo legível sem JavaScript) e o injeta em dist/index.html.
import { readFileSync, writeFileSync, rmSync } from 'node:fs'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const raiz = resolve(import.meta.dirname, '..')
const { render } = await import(pathToFileURL(resolve(raiz, '.ssr/entry-server.js')).href)
const arquivo = resolve(raiz, 'dist/index.html')
const html = readFileSync(arquivo, 'utf8')
if (!html.includes('<div id="root"></div>')) throw new Error('marcador #root não encontrado')
writeFileSync(arquivo, html.replace('<div id="root"></div>', `<div id="root">${render()}</div>`))
rmSync(resolve(raiz, '.ssr'), { recursive: true, force: true })
console.log('pré-renderização ok')
