// Pré-renderiza o HTML (conteúdo legível sem JavaScript), injeta o CSS inline e o JSON-LD.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const dist = path.resolve('dist');
const { render, CONFIG } = await import(pathToFileURL(path.resolve('dist-ssr/entry-server.js')).href);
let html = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');

// CSS inline (pequeno; evita requisição bloqueante)
html = html.replace(/<link rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/, (_, href) => {
  const css = fs.readFileSync(path.join(dist, href), 'utf8');
  return `<style>${css}</style>`;
});
// preload apenas da fonte do hero
const assets = fs.readdirSync(path.join(dist, 'assets'));
const gloock = assets.find((f) => /^gloock-latin-400-normal.*\.woff2$/.test(f));
const hanken = assets.find((f) => /^hanken-grotesk-latin-400-normal.*\.woff2$/.test(f));
for (const f of [gloock, hanken].filter(Boolean))
  html = html.replace('</title>', `</title>\n    <link rel="preload" href="/assets/${f}" as="font" type="font/woff2" crossorigin />`);
// remove fontes latin-ext não usadas? mantidas pelo unicode-range (só baixam se necessário)

html = html.replace('</title>', '</title>\n    <link rel="preload" as="image" href="/media/hero-carro-escuro-1000.webp" imagesrcset="/media/hero-carro-escuro-1000.webp 1000w, /media/hero-carro-escuro-1800.webp 1800w" imagesizes="(min-width: 900px) 70vw, 160vw" fetchpriority="high" />');
const e = CONFIG.endereco;
const dias = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const ld = {
  '@context': 'https://schema.org',
  '@type': 'AutoWash',
  name: CONFIG.nome,
  url: CONFIG.siteUrl + '/',
  image: CONFIG.siteUrl + '/og.jpg',
  logo: CONFIG.siteUrl + '/logo-the-details.svg',
  telephone: '+' + CONFIG.whatsapp,
  address: {
    '@type': 'PostalAddress',
    streetAddress: e.rua,
    addressLocality: e.cidade,
    addressRegion: e.uf,
    postalCode: e.cep,
    addressCountry: 'BR',
  },
  areaServed: e.cidade,
  openingHoursSpecification: CONFIG.horarios
    .filter((h) => h.abre)
    .map((h) => ({ '@type': 'OpeningHoursSpecification', dayOfWeek: 'https://schema.org/' + dias[h.idx], opens: h.abre, closes: h.fecha })),
  sameAs: [CONFIG.instagram.url],
};
html = html
  .replace('<!--jsonld-->', `<script type="application/ld+json">${JSON.stringify(ld)}</script>`)
  .replace('<!--app-->', render())
  .replaceAll('__SITE_URL__', CONFIG.siteUrl);
if (!CONFIG.rascunho) html = html.replace(/\s*<meta name="(robots|googlebot)"[^>]*>/g, '');
fs.writeFileSync(path.join(dist, 'index.html'), html);
fs.rmSync('dist-ssr', { recursive: true, force: true });
console.log('prerender ok', (html.length / 1024).toFixed(1) + ' KB');
