// Gera o HTML estático: conteúdo renderizado + head (SEO/JSON-LD) + CSS inline.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const dist = path.resolve('dist');
const ssr = await import(pathToFileURL(path.resolve('dist-ssr/entry-server.js')).href);
let html = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');

html = html
  .replace('<!--app-->', ssr.render())
  .replace('<!--head-->', ssr.head())
  .replace('<body>', `<body>${ssr.logoDefsHtml()}`);

// CSS crítico inline (o CSS inteiro é pequeno): remove a requisição bloqueante
html = html.replace(/<link rel="stylesheet" crossorigin href="(\/assets\/[^"]+\.css)">/, (_m, href) => {
  const css = fs.readFileSync(path.join(dist, href), 'utf8');
  return `<style>${css}</style>`;
});

if (/localhost/i.test(html)) throw new Error('HTML contém "localhost"');
fs.writeFileSync(path.join(dist, 'index.html'), html);
fs.rmSync('dist-ssr', { recursive: true, force: true });
console.log('prerender ok', (html.length / 1024).toFixed(1) + ' KB');
