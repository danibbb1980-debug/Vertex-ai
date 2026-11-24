// Gera o HTML estático da página (o conteúdo existe sem JavaScript).
import { readFileSync, writeFileSync, rmSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const ssrDir = resolve(root, 'dist-ssr')
const entry = readdirSync(ssrDir).find((f) => f.startsWith('entry-server'))
const { render } = await import(resolve(ssrDir, entry))
const { html, jsonLd, siteUrl } = render()
if (/localhost/.test(siteUrl)) throw new Error('siteUrl não pode ser localhost')

const file = resolve(root, 'dist/index.html')
let page = readFileSync(file, 'utf8')
page = page
  .replace('<!--APP-->', html)
  .replace('<!--JSONLD-->', `<script type="application/ld+json">${jsonLd.replace(/</g, '\\u003c')}</script>`)
  .replaceAll('%SITE_URL%', siteUrl.replace(/\/$/, ''))

// Pré-carrega só a fonte do título do hero.
const fonte = readdirSync(resolve(root, 'dist/assets')).find((f) => /brygada-1918-latin-400-normal.*\.woff2$/.test(f))
if (fonte) page = page.replace('</title>', `</title>\n    <link rel="preload" href="/assets/${fonte}" as="font" type="font/woff2" crossorigin />`)

// CSS inline (pequeno): sem bloqueio de renderização.
const css = page.match(/<link rel="stylesheet" crossorigin href="(\/assets\/[^"]+\.css)">/)
if (css) {
  const conteudo = readFileSync(resolve(root, 'dist' + css[1]), 'utf8')
  page = page.replace(css[0], `<style>${conteudo}</style>`)
}

writeFileSync(file, page)
rmSync(ssrDir, { recursive: true, force: true })
console.log('prerender ok:', html.length, 'chars')
