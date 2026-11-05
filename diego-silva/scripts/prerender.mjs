// Pré-renderiza o React em dist/index.html (HTML pronto no primeiro byte) e preenche metas a partir do config.
import { readFileSync, writeFileSync, readdirSync, existsSync, rmSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const root = resolve(import.meta.dirname, "..");
const dist = resolve(root, "dist");
const ssr = await import(pathToFileURL(resolve(root, "dist-ssr/entry-server.js")).href);
const { CONFIG } = ssr;

let html = readFileSync(resolve(dist, "index.html"), "utf8");
const app = ssr.render();

const site = CONFIG.siteUrl.replace(/\/$/, "");
if (/localhost|127\.0\.0\.1/.test(site)) throw new Error("CONFIG.siteUrl não pode ser localhost");

const robots = CONFIG.rascunho
  ? '<meta name="robots" content="noindex, nofollow" />\n    <meta name="googlebot" content="noindex, nofollow" />'
  : '<meta name="robots" content="index, follow" />';

const e = CONFIG.endereco;
const jsonld = {
  "@context": "https://schema.org",
  "@type": "LegalService",
  name: CONFIG.nomeEscritorio,
  url: site + "/",
  telephone: "+" + CONFIG.whatsapp,
  address: {
    "@type": "PostalAddress",
    streetAddress: e.rua,
    addressLocality: e.cidade,
    addressRegion: e.uf,
    postalCode: e.cep,
    addressCountry: "BR",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00",
    },
  ],
  areaServed: "BR",
  knowsAbout: ["Direito do Trabalho", "Direito de Família", "Direito Cível", "Direito Previdenciário"],
  sameAs: [CONFIG.instagram.url],
};

const assets = readdirSync(resolve(dist, "assets"));
const fonts = assets.filter((f) => /^(newsreader-display|inter-tight)-.*\.woff2$/.test(f));
const preload = fonts
  .map((f) => `<link rel="preload" href="/assets/${f}" as="font" type="font/woff2" crossorigin />`)
  .join("\n    ");

const og = existsSync(resolve(dist, "og.jpg"))
  ? `<meta property="og:image" content="${site}/og.jpg" />\n    <meta property="og:image:width" content="1200" />\n    <meta property="og:image:height" content="630" />\n    <meta name="twitter:card" content="summary_large_image" />`
  : "";

html = html
  .replaceAll("%SITE_URL%", site)
  .replace("<!--ROBOTS-->", robots)
  .replace("<!--PRELOAD-->", preload)
  .replace("<!--OG_IMAGE-->", og)
  .replace("<!--JSONLD-->", `<script type="application/ld+json">${JSON.stringify(jsonld)}</script>`)
  .replace("<!--APP-->", app);

// CSS crítico inline: sem requisição bloqueante de renderização
html = html.replace(/<link rel="stylesheet"[^>]*href="(\/assets\/[^"]+\.css)"[^>]*>/, (_, href) => {
  const css = readFileSync(resolve(dist, href.slice(1)), "utf8");
  return `<style>${css}</style>`;
});

writeFileSync(resolve(dist, "index.html"), html);
rmSync(resolve(root, "dist-ssr"), { recursive: true, force: true });
console.log(`prerender ok · ${(html.length / 1024).toFixed(1)} KB · fontes: ${fonts.length}`);
