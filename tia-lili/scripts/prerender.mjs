// Pré-renderiza a página em HTML estático (SEO e primeira pintura mais rápida)
// e adiciona preload das fontes principais.
import { readFile, writeFile, readdir, rm } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const raiz = path.resolve(import.meta.dirname, "..");
const dist = path.join(raiz, "dist");
const ssr = path.join(raiz, "dist-ssr");

const { render } = await import(pathToFileURL(path.join(ssr, "entry-server.js")).href);
let html = await readFile(path.join(dist, "index.html"), "utf8");
const app = render();
if (!html.includes("<!--app-->")) throw new Error("marcador <!--app--> não encontrado");
html = html.replace("<!--app-->", app);

const assets = await readdir(path.join(dist, "assets"));
const fontes = assets.filter((f) => /^(fraunces-latin-soft-normal|nunito-sans-latin-wght-normal)-.*\.woff2$/.test(f));
const preloads = fontes
  .map((f) => `<link rel="preload" href="/assets/${f}" as="font" type="font/woff2" crossorigin />`)
  .join("\n    ");
html = html.replace("</title>", `</title>\n    ${preloads}`);

// CSS embutido no HTML (evita uma requisição que bloqueia a renderização)
html = await (async () => {
  const m = html.match(/<link rel="stylesheet"[^>]*href="(\/assets\/[^"]+\.css)"[^>]*>/);
  if (!m) return html;
  const css = await readFile(path.join(dist, m[1]), "utf8");
  return html.replace(m[0], `<style>${css}</style>`);
})();

if (/localhost|127\.0\.0\.1/.test(html)) throw new Error("O HTML final contém localhost");
await writeFile(path.join(dist, "index.html"), html);
await rm(ssr, { recursive: true, force: true });
console.log(`pré-renderizado: ${(app.length / 1024).toFixed(1)} KB de HTML, ${fontes.length} fontes com preload`);
