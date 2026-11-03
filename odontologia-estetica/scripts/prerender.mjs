// Pré-renderiza a página no build: o HTML chega pronto (melhor LCP e funciona sem JS).
import { readFileSync, writeFileSync, rmSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const raiz = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const { render } = await import(resolve(raiz, 'dist-ssr/entry-server.js'))
const arquivo = resolve(raiz, 'dist/index.html')
const html = readFileSync(arquivo, 'utf8')
if (!html.includes('<!--app-->')) throw new Error('marcador <!--app--> não encontrado')
writeFileSync(arquivo, html.replace('<!--app-->', render()))
rmSync(resolve(raiz, 'dist-ssr'), { recursive: true, force: true })
console.log('pré-renderizado: dist/index.html')
