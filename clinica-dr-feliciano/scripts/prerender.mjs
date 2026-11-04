// Injeta o HTML renderizado no dist/index.html (melhora LCP e SEO).
import { readFileSync, writeFileSync, rmSync } from "node:fs";
const { render } = await import(new URL("../dist-ssr/entry-server.js", import.meta.url));
const arquivo = new URL("../dist/index.html", import.meta.url);
let html = readFileSync(arquivo, "utf8");
// CSS embutido: elimina a requisição que bloqueia a renderização
html = html.replace(/<link rel="stylesheet" crossorigin href="\/(assets\/[^"]+\.css)">/, (_, caminho) => {
  const css = readFileSync(new URL(`../dist/${caminho}`, import.meta.url), "utf8");
  return `<style>${css}</style>`;
});
if (!html.includes('<div id="root"></div>')) throw new Error("marcador #root não encontrado");
writeFileSync(arquivo, html.replace('<div id="root"></div>', `<div id="root">${render()}</div>`));
rmSync(new URL("../dist-ssr", import.meta.url), { recursive: true, force: true });
console.log("pré-renderização ok");
