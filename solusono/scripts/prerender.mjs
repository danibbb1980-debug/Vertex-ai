// Pré-renderiza o HTML da página e embute o CSS, para a primeira pintura não depender do JS.
import { readFileSync, writeFileSync, readdirSync, rmSync } from "node:fs";
import { resolve } from "node:path";
import { build } from "vite";

const raiz = resolve(import.meta.dirname, "..");
const ssrDir = resolve(raiz, "node_modules/.prerender");

await build({
  root: raiz,
  logLevel: "warn",
  build: { ssr: "src/entry-server.tsx", outDir: ssrDir, emptyOutDir: true },
});
const { render } = await import(resolve(ssrDir, "entry-server.js"));
const htmlApp = render();

const indexPath = resolve(raiz, "dist/index.html");
let html = readFileSync(indexPath, "utf8");
html = html.replace('<div id="root"></div>', `<div id="root">${htmlApp}</div>`);

// CSS embutido (≈9 kB gzip) em vez de arquivo bloqueante
const css = readdirSync(resolve(raiz, "dist/assets")).find((f) => f.endsWith(".css"));
if (css) {
  const conteudo = readFileSync(resolve(raiz, "dist/assets", css), "utf8");
  html = html.replace(new RegExp(`<link rel="stylesheet"[^>]*${css}">`), `<style>${conteudo}</style>`);
}
writeFileSync(indexPath, html);
rmSync(ssrDir, { recursive: true, force: true });
console.log("pré-renderizado:", Math.round(html.length / 1024), "kB");
