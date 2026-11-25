// Gera o HTML estático da página (conteúdo visível sem JavaScript) e embute o CSS.
import { readFileSync, writeFileSync, rmSync } from 'node:fs'
import { resolve } from 'node:path'

const raiz = resolve(import.meta.dirname, '..')
const dist = resolve(raiz, 'dist')
const { render, jsonLd } = await import(resolve(raiz, 'dist-ssr/entry-server.js'))
let html = readFileSync(resolve(dist, 'index.html'), 'utf8')
const siteUrl = process.env.SITE_URL || 'https://refugio-vita-spa-rascunho.vercel.app'
const rascunho = process.env.RASCUNHO !== 'false'

html = html.replaceAll('%SITE_URL%', siteUrl)
html = html.replace(
  '<!--robots-->',
  rascunho
    ? '<meta name="robots" content="noindex, nofollow" />\n    <meta name="googlebot" content="noindex, nofollow" />'
    : '',
)
html = html.replace('<!--jsonld-->', `<script type="application/ld+json">${jsonLd()}</script>`)
html = html.replace('<!--app-->', render())

// CSS embutido (é pequeno): sem requisição bloqueante
html = html.replace(/<link rel="stylesheet" crossorigin href="(\/assets\/[^"]+\.css)">/, (_, href) => {
  const css = readFileSync(resolve(dist, '.' + href), 'utf8')
  return `<style>${css}</style>`
})
writeFileSync(resolve(dist, 'index.html'), html)
rmSync(resolve(raiz, 'dist-ssr'), { recursive: true, force: true })
console.log('prerender ok', Math.round(html.length / 1024) + 'KB')
