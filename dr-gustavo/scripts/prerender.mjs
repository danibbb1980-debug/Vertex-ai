// Pré-renderiza a página inicial, a de privacidade e a 404 no dist/.
// Roda depois de `vite build` (cliente) e `vite build --ssr`.
import { readFile, writeFile, rm, readdir } from 'node:fs/promises'
import { fileURLToPath, pathToFileURL } from 'node:url'
import path from 'node:path'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')
const ssr = await import(pathToFileURL(path.join(root, 'dist-ssr', 'entry-server.js')).href)
const { render, headTags, CONFIG } = ssr

let template = await readFile(path.join(dist, 'index.html'), 'utf8')

// CSS embutido no HTML (evita uma requisição que bloqueia a primeira pintura)
// e preload da fonte do título.
const cssHref = template.match(/<link rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/)
if (cssHref) {
  const css = await readFile(path.join(dist, cssHref[1]), 'utf8')
  template = template.replace(cssHref[0], `<style>${css}</style>`)
}
const assets = await readdir(path.join(dist, 'assets'))
const titleFont = assets.find((f) => f.startsWith('fraunces-latin-wght-normal') && f.endsWith('.woff2'))
if (titleFont) {
  template = template.replace(
    '<link rel="icon"',
    `<link rel="preload" href="/assets/${titleFont}" as="font" type="font/woff2" crossorigin />\n    <link rel="icon"`,
  )
}

// Página inicial: HTML completo + hidratação.
const home = template.replace('<!--app-html-->', render('home'))
await writeFile(path.join(dist, 'index.html'), home)

// Páginas secundárias: mesmo CSS, sem JS.
const semJs = (html) => html.replace(/<script type="module"[^>]*><\/script>\s*/g, '').replace(/<link rel="modulepreload"[^>]*>\s*/g, '')
const comHead = (html, tags) => html.replace(/<title>[\s\S]*<\/script>\s*(?=<\/head>)|<title>[\s\S]*?(?=<\/head>)/, tags + '\n  ')

const priv = comHead(
  template,
  headTags({
    path: '/privacidade.html',
    title: `Privacidade | ${CONFIG.profissional.nome}`,
    description: 'Como o site do consultório do Dr. Gustavo Borges Andrade trata as informações de quem o visita.',
    jsonLd: false,
  }),
).replace('<!--app-html-->', render('privacidade'))
await writeFile(path.join(dist, 'privacidade.html'), semJs(priv))

const nf = comHead(
  template,
  headTags({ path: '/404.html', title: `Página não encontrada | ${CONFIG.profissional.nome}`, jsonLd: false }),
)
  .replace('<!--app-html-->', render('404'))
  .replace(/<link rel="canonical"[^>]*>\s*/, '')
await writeFile(path.join(dist, '404.html'), semJs(nf.replace('<meta name="robots"', '<meta name="robots"')))

await rm(path.join(root, 'dist-ssr'), { recursive: true, force: true })
console.log('prerender ok: index.html, privacidade.html, 404.html')
