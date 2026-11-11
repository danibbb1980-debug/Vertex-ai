// Gera o HTML estático da página (SSR em build) para o conteúdo aparecer sem esperar o JavaScript.
import { readFileSync, readdirSync, writeFileSync, rmSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const raiz = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const { render } = await import(pathToFileURL(resolve(raiz, 'dist-ssr/entry-server.js')).href)
const arquivo = resolve(raiz, 'dist/index.html')
const html = readFileSync(arquivo, 'utf8')
if (!html.includes('<!--APP-->')) throw new Error('Marcador <!--APP--> não encontrado em dist/index.html')
let saida = html.replace('<!--APP-->', render())

// CSS embutido no HTML (evita uma requisição que bloqueia a renderização)
saida = saida.replace(/<link rel="stylesheet"[^>]*href="(\/assets\/[^"]+\.css)"[^>]*>/, (_, href) => {
  const css = readFileSync(resolve(raiz, 'dist', href.slice(1)), 'utf8')
  return `<style>${css}</style>`
})
// Pré-carrega as fontes do primeiro quadro (subconjunto latino)
const fontes = readdirSync(resolve(raiz, 'dist/assets')).filter((f) =>
  /^(bellefair-latin-400|hanken-grotesk-latin-400)-normal-.*\.woff2$/.test(f),
)
saida = saida.replace(
  '</title>',
  '</title>\n    ' +
    fontes.map((f) => `<link rel="preload" href="/assets/${f}" as="font" type="font/woff2" crossorigin />`).join('\n    '),
)
writeFileSync(arquivo, saida)
rmSync(resolve(raiz, 'dist-ssr'), { recursive: true, force: true })
console.log('prerender: dist/index.html gerado')
