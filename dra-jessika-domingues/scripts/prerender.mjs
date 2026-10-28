// Pré-renderiza a página: injeta o HTML do React e as tags do <head> em dist/index.html.
import { existsSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(raiz, "dist");
const { render, head } = await import(pathToFileURL(join(raiz, "dist-ssr", "entry-server.js")).href);

const og = existsSync(join(dist, "og.jpg")) ? "/og.jpg" : null;
const modelo = readFileSync(join(dist, "index.html"), "utf8");
let html = modelo.replace("<!--head-->", head(og)).replace("<!--app-->", render());
// CSS inline (≈9 KB gzip): evita uma requisição que bloqueia a primeira pintura
html = html.replace(/<link rel="stylesheet"[^>]*href="(\/assets\/[^"]+\.css)"[^>]*>/, (_, href) => {
  const css = readFileSync(join(dist, href), "utf8");
  return `<style>${css}</style>`;
});
if (html.includes("localhost")) throw new Error("O HTML final contém 'localhost'.");
writeFileSync(join(dist, "index.html"), html);
rmSync(join(raiz, "dist-ssr"), { recursive: true, force: true });
console.log(`Pré-renderizado: dist/index.html (${(html.length / 1024).toFixed(1)} KB, og:image ${og ?? "omitida"})`);
