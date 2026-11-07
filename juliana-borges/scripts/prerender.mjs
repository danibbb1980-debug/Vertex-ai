// Gera o HTML estático da página (conteúdo visível antes do JavaScript carregar).
import { readFileSync, writeFileSync, rmSync } from 'node:fs'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { dirname, join } from 'node:path'

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..')
const { render } = await import(pathToFileURL(join(raiz, 'dist-ssr/entry-server.js')).href)
const arquivo = join(raiz, 'dist/index.html')
const html = readFileSync(arquivo, 'utf8')
if (!html.includes('<div id="root"></div>')) throw new Error('marcador <div id="root"></div> não encontrado')
writeFileSync(arquivo, html.replace('<div id="root"></div>', `<div id="root">${render()}</div>`))
rmSync(join(raiz, 'dist-ssr'), { recursive: true, force: true })
console.log('pré-renderização ok')
