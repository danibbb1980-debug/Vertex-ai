// Injeta o HTML pré-renderizado da página em dist/index.html.
import { readFile, writeFile, rm } from 'node:fs/promises'
import { pathToFileURL } from 'node:url'
import { resolve } from 'node:path'

const dist = resolve('dist')
const ssrDir = resolve('dist-ssr')
const { render } = await import(pathToFileURL(resolve(ssrDir, 'entry-server.js')).href)

const file = resolve(dist, 'index.html')
const html = await readFile(file, 'utf8')
const marker = '<div id="root"></div>'
if (!html.includes(marker)) throw new Error('Marcador <div id="root"></div> não encontrado em dist/index.html')

await writeFile(file, html.replace(marker, `<div id="root">${render()}</div>`))
await rm(ssrDir, { recursive: true, force: true })
console.log('Pré-renderização concluída: dist/index.html')
