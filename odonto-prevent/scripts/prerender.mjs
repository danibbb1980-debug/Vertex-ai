// Gera o HTML estático da página (pré-renderização) dentro de dist/index.html.
import { readFileSync, writeFileSync, rmSync } from 'node:fs'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { dirname, join } from 'node:path'

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..')
const { render } = await import(pathToFileURL(join(raiz, 'dist-ssr/entry-server.js')).href)
const arquivo = join(raiz, 'dist/index.html')
const html = readFileSync(arquivo, 'utf8')
if (!html.includes('<!--APP-->')) throw new Error('Marcador <!--APP--> não encontrado')
let saida = html.replace('<!--APP-->', render())

// Embute o CSS no HTML (evita uma requisição que bloqueia a renderização)
saida = saida.replace(/<link rel="stylesheet"[^>]*href="(\/assets\/[^"]+\.css)"[^>]*>/, (_, href) => {
  const css = readFileSync(join(raiz, 'dist', href), 'utf8')
  // Pré-carrega as fontes latinas usadas no primeiro quadro
  const fontes = [...css.matchAll(/url\((\/assets\/(?:outfit|inter-tight)-latin-wght-normal-[^)]+\.woff2)\)/g)].map((m) => m[1])
  const preloads = [...new Set(fontes)].map((f) => `<link rel="preload" href="${f}" as="font" type="font/woff2" crossorigin />`).join('')
  return `${preloads}<style>${css}</style>`
})
writeFileSync(arquivo, saida)
rmSync(join(raiz, 'dist-ssr'), { recursive: true, force: true })
console.log('Pré-renderização concluída: dist/index.html')
