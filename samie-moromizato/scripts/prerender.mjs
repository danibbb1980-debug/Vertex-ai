// Gera o HTML estático da página (conteúdo legível sem JavaScript),
// injeta SEO, JSON-LD e o CSS crítico inline.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const ssr = await import(pathToFileURL(path.join(root, "dist-ssr", "entry-server.js")).href);

let html = fs.readFileSync(path.join(dist, "index.html"), "utf8");
const url = ssr.siteUrl.replace(/\/$/, "");
if (/localhost|127\.0\.0\.1/.test(url)) throw new Error("siteUrl não pode ser localhost");

const robots = ssr.rascunho
  ? `<meta name="robots" content="noindex, nofollow" />\n    <meta name="googlebot" content="noindex, nofollow" />`
  : "";
const title = "Samie Moromizato | Estética e Bem-estar em Limeira - SP";
const desc =
  "Estética e bem-estar com atendimento individual e horário marcado em Limeira - SP. Limpeza de pele e massagem. Agendamento por telefone.";
const seo = [
  `<link rel="canonical" href="${url}/" />`,
  `<meta property="og:type" content="website" />`,
  `<meta property="og:locale" content="pt_BR" />`,
  `<meta property="og:site_name" content="Samie Moromizato" />`,
  `<meta property="og:title" content="${title}" />`,
  `<meta property="og:description" content="${desc}" />`,
  `<meta property="og:url" content="${url}/" />`,
  ssr.temOg ? `<meta property="og:image" content="${url}/og.jpg" />` : "",
  ssr.temOg ? `<meta property="og:image:width" content="1200" />` : "",
  ssr.temOg ? `<meta property="og:image:height" content="630" />` : "",
  `<meta name="twitter:card" content="${ssr.temOg ? "summary_large_image" : "summary"}" />`,
  `<script type="application/ld+json">${ssr.jsonLd()}</script>`,
]
  .filter(Boolean)
  .join("\n    ");

html = html.replace("<!--robots-->", robots).replace("<!--seo-->", seo);
html = html.replace("<!--app-html-->", ssr.render());

// CSS inline (arquivo pequeno): evita uma requisição bloqueante antes do LCP
html = html.replace(/<link rel="stylesheet" crossorigin href="(\/assets\/[^"]+\.css)">/, (m, href) => {
  const css = fs.readFileSync(path.join(dist, href), "utf8");
  return `<style>${css}</style>`;
});

fs.writeFileSync(path.join(dist, "index.html"), html);
fs.rmSync(path.join(root, "dist-ssr"), { recursive: true, force: true });
console.log("prerender ok:", (html.length / 1024).toFixed(1), "KB");
