// Pré-renderiza o HTML da página (conteúdo visível sem esperar o JS; melhor para LCP e SEO).
import { readFileSync, writeFileSync, rmSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const raiz = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const { render } = await import(resolve(raiz, 'dist-ssr/entry-server.js'))
const arquivo = resolve(raiz, 'dist/index.html')
const html = readFileSync(arquivo, 'utf8')
if (!html.includes('<div id="root"></div>')) throw new Error('marcador #root não encontrado')
let saida = html.replace('<div id="root"></div>', `<div id="root">${render()}</div>`)
// CSS embutido: elimina a requisição que bloqueia a renderização (o arquivo ~10 KB gzip)
saida = saida.replace(/<link rel="stylesheet"[^>]*href="(\/assets\/[^"]+\.css)"[^>]*>/, (_, href) => {
  const css = readFileSync(resolve(raiz, 'dist' + href), 'utf8')
  return `<style>${css}</style>`
})
// JS carregado depois do load: o HTML pré-renderizado já é a página completa; o React só adiciona interações
saida = saida.replace(/<script type="module" crossorigin src="(\/assets\/[^"]+\.js)"><\/script>/, (_, src) =>
  `<script>addEventListener('load',function(){var s=document.createElement('script');s.type='module';s.src='${src}';document.head.appendChild(s)})</script>`,
)
if (!saida.includes("addEventListener('load'")) throw new Error('script principal não encontrado')
writeFileSync(arquivo, saida)
rmSync(resolve(raiz, 'dist-ssr'), { recursive: true, force: true })
console.log('✓ index.html pré-renderizado')
