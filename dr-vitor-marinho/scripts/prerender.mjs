// Pré-renderiza a página no build: o HTML já chega com o conteúdo (melhor para SEO e desempenho).
import { readFileSync, writeFileSync, rmSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import { resolve } from 'node:path'

const dist = resolve('dist')
const { render } = await import(pathToFileURL(resolve('dist-ssr/entry-server.js')).href)
const html = readFileSync(`${dist}/index.html`, 'utf8')
const app = render()
// CSS embutido no HTML: elimina uma ida e volta na rede antes da primeira pintura.
const out = html.replace(/<link rel="stylesheet" crossorigin href="(\/assets\/[^"]+\.css)">/, (_, href) => {
  const css = readFileSync(`${dist}${href}`, 'utf8')
  return `<style>${css}</style>`
})
// O HTML já chega completo; o JS (interações e animações ao rolar) carrega quando o navegador fica livre.
const final = out.replace(/<script type="module" crossorigin src="(\/assets\/[^"]+\.js)"><\/script>/, (_, src) =>
  `<script type="module">const go=()=>import('${src}');'requestIdleCallback' in window?requestIdleCallback(go,{timeout:1200}):setTimeout(go,300)</script>`,
)
if (final === out) throw new Error('script de entrada não encontrado')
writeFileSync(`${dist}/index.html`, final.replace('<!--app-->', app))
rmSync('dist-ssr', { recursive: true, force: true })
console.log(`prerender: ${(app.length / 1024).toFixed(1)} KB de HTML`)
