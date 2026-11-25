// Pré-renderiza o HTML (conteúdo legível sem JS), injeta CSS inline e a URL do site.
import fs from 'node:fs'
import path from 'node:path'
const dist = path.resolve('dist')
const { render } = await import(path.resolve('dist-ssr/entry-server.js'))

let html = fs.readFileSync(path.join(dist, 'index.html'), 'utf8')
const url = (process.env.SITE_URL || 'https://dra-ana-clara-grimberg-rascunho.vercel.app').replace(/\/$/, '')
html = html.replaceAll('__SITE_URL__', url)
html = html.replace('<!--app-->', render())
// CSS crítico inline (o CSS inteiro é pequeno)
html = html.replace(/<link rel="stylesheet" crossorigin href="(\/assets\/[^"]+\.css)">/, (_, href) => {
  const css = fs.readFileSync(path.join(dist, href), 'utf8')
  return `<style>${css}</style>`
})
// pré-carrega a foto do hero (LCP)
const hero = html.match(/<img[^>]+fetchpriority="high"[^>]*>/)
if (hero) {
  const srcset = hero[0].match(/srcSet="([^"]+)"|srcset="([^"]+)"/i)
  const src = hero[0].match(/ src="([^"]+)"/)
  if (src) html = html.replace('</title>', `</title>\n    <link rel="preload" as="image" href="${src[1]}"${srcset ? ` imagesrcset="${srcset[1] || srcset[2]}" imagesizes="(min-width: 1024px) 30vw, calc(100vw - 2rem)"` : ''} fetchpriority="high" />`)
}
fs.writeFileSync(path.join(dist, 'index.html'), html)
for (const f of ['privacidade.html', '404.html']) {
  const p = path.join(dist, f)
  if (fs.existsSync(p)) fs.writeFileSync(p, fs.readFileSync(p, 'utf8').replaceAll('__SITE_URL__', url))
}
console.log('prerender ok', url)
