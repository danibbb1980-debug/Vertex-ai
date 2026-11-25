// Pré-renderiza o HTML (conteúdo existe sem JavaScript), injeta JSON-LD, CSS crítico inline e preload da fonte do hero.
import fs from 'node:fs';
import path from 'node:path';
const dist = path.resolve('dist');
const { render, jsonLd, siteUrl } = await import(path.resolve('dist-ssr/entry-server.js'));
if (/localhost/.test(siteUrl)) throw new Error('siteUrl não pode ser localhost');
let html = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
html = html.replace('<!--APP-->', render());
html = html.replace('<!--JSONLD-->', `<script type="application/ld+json">${JSON.stringify(jsonLd())}</script>`);
html = html.replaceAll('%SITE_URL%', siteUrl);
// CSS inline (arquivo único, pequeno)
const cssLink = html.match(/<link rel="stylesheet" crossorigin href="(\/assets\/[^"]+\.css)">/);
if (cssLink) {
  let css = fs.readFileSync(path.join(dist, cssLink[1]), 'utf8');
  html = html.replace(cssLink[0], `<style>${css}</style>`);
}
const font = fs.readdirSync(path.join(dist, 'assets')).find((f) => /^italiana-latin-400-normal.*\.woff2$/.test(f));
if (font) html = html.replace('</title>', `</title>\n<link rel="preload" href="/assets/${font}" as="font" type="font/woff2" crossorigin>`);
fs.writeFileSync(path.join(dist, 'index.html'), html);
fs.rmSync(path.resolve('dist-ssr'), { recursive: true, force: true });
// arquivos que não devem ir para o ar
for (const f of ['referencias']) fs.rmSync(path.join(dist, f), { recursive: true, force: true });
console.log('prerender ok', Math.round(html.length / 1024) + 'KB');
