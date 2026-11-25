// Pré-render estático: gera o HTML com o conteúdo, JSON-LD e os arquivos de indexação.
import { build } from 'vite'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(raiz, 'dist')
const ssrOut = path.join(raiz, 'dist-ssr')

await build({
  root: raiz,
  logLevel: 'warn',
  build: { ssr: 'src/entry-server.tsx', outDir: ssrOut, emptyOutDir: true },
})

const { render, config } = await import(path.join(ssrOut, 'entry-server.js'))
const { site, contato, marca } = config

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: marca.nome,
  slogan: marca.tagline,
  description: site.descricao,
  url: site.url + '/',
  image: site.url + '/og.png',
  logo: site.url + '/icon-512.png',
  email: contato.email,
  telephone: '+' + contato.whatsapp,
  taxID: contato.cnpj,
  address: { '@type': 'PostalAddress', addressLocality: 'Poços de Caldas', addressRegion: 'MG', addressCountry: 'BR' },
  areaServed: { '@type': 'City', name: 'Poços de Caldas' },
  sameAs: ['https://instagram.com/' + contato.instagram.replace('@', '')],
}

let html = await fs.readFile(path.join(dist, 'index.html'), 'utf8')
html = html
  .replaceAll('%DESCRICAO%', site.descricao)
  .replace('<!--APP-->', render())
  .replace('<!--JSONLD-->', `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`)
  .replace('<!--ROBOTS-->', site.rascunho ? '<meta name="robots" content="noindex, nofollow" />' : '')
// CSS inline (≈9 KB gzip): elimina uma ida e volta que bloqueia a renderização (LCP)
const linkCss = html.match(/<link rel="stylesheet"[^>]*href="(\/assets\/[^"]+\.css)"[^>]*>/)
if (linkCss) {
  const css = await fs.readFile(path.join(dist, linkCss[1]), 'utf8')
  html = html.replace(linkCss[0], () => `<style>${css}</style>`)
}
await fs.writeFile(path.join(dist, 'index.html'), html)

// robots.txt e sitemap
const robots = site.rascunho
  ? 'User-agent: *\nDisallow: /\n'
  : `User-agent: *\nAllow: /\n\nSitemap: ${site.url}/sitemap.xml\n`
await fs.writeFile(path.join(dist, 'robots.txt'), robots)
const hoje = new Date().toISOString().slice(0, 10)
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${site.url}/</loc><lastmod>${hoje}</lastmod></url>
  <url><loc>${site.url}/privacidade/</loc><lastmod>${hoje}</lastmod></url>
</urlset>
`
await fs.writeFile(path.join(dist, 'sitemap.xml'), sitemap)

// Cloudflare Pages: cabeçalhos (cache, segurança e, em rascunho, X-Robots-Tag)
const headers = `/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  X-Frame-Options: DENY${site.rascunho ? '\n  X-Robots-Tag: noindex, nofollow' : ''}

/assets/*
  Cache-Control: public, max-age=31536000, immutable

/fonts/*
  Cache-Control: public, max-age=31536000, immutable
`
await fs.writeFile(path.join(dist, '_headers'), headers)
await fs.rm(ssrOut, { recursive: true, force: true })
console.log('prerender ok', site.rascunho ? '(RASCUNHO: noindex)' : '')
