// Injeta o HTML renderizado da página em dist/index.html (executado no fim do `npm run build`).
import { readFile, rm, writeFile } from 'node:fs/promises'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { dirname, join } from 'node:path'

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..')
const { render } = await import(pathToFileURL(join(raiz, 'dist-ssr/entry-server.js')).href)
const arquivo = join(raiz, 'dist/index.html')
const html = await readFile(arquivo, 'utf8')
if (!html.includes('<div id="root"></div>')) throw new Error('Marcador <div id="root"></div> não encontrado')
await writeFile(arquivo, html.replace('<div id="root"></div>', `<div id="root">${render()}</div>`))
await rm(join(raiz, 'dist-ssr'), { recursive: true, force: true })
console.log('✓ dist/index.html pré-renderizado')
