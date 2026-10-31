// Renderiza o App em HTML estático dentro de dist/index.html (melhor SEO e LCP).
import { readFileSync, writeFileSync, rmSync, readdirSync, unlinkSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const root = resolve(import.meta.dirname, '..');
const { render } = await import(pathToFileURL(resolve(root, 'dist-ssr/entry-server.js')).href);
const file = resolve(root, 'dist/index.html');
const html = readFileSync(file, 'utf8');
const app = render();
if (!html.includes('<div id="root"></div>')) throw new Error('root não encontrado');
let out = html.replace('<div id="root"></div>', `<div id="root">${app}</div>`);

// CSS embutido (evita bloqueio de renderização) e pré-carga das duas fontes principais
const css = out.match(/<link rel="stylesheet"[^>]*href="(\/assets\/[^"]+\.css)"[^>]*>/);
if (css) {
  const path = resolve(root, 'dist' + css[1]);
  out = out.replace(css[0], `<style>${readFileSync(path, 'utf8')}</style>`);
  unlinkSync(path);
}
const assets = readdirSync(resolve(root, 'dist/assets'));
const pre = ['fraunces-latin-opsz-normal', 'manrope-latin-wght-normal']
  .map((n) => assets.find((f) => f.startsWith(n) && f.endsWith('.woff2')))
  .filter(Boolean)
  .map((f) => `<link rel="preload" href="/assets/${f}" as="font" type="font/woff2" crossorigin />`)
  .join('');
out = out.replace('</title>', `</title>${pre}`);
writeFileSync(file, out);
rmSync(resolve(root, 'dist-ssr'), { recursive: true, force: true });
console.log(`prerender ok (${(app.length / 1024).toFixed(1)} KB de HTML)`);
