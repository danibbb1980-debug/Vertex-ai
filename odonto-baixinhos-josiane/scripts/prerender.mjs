// Pós-build: injeta o HTML pré-renderizado, embute o CSS (evita bloqueio de renderização)
// e pré-carrega as fontes usadas na primeira dobra.
import { readFileSync, writeFileSync, rmSync, readdirSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";

const { render } = await import(pathToFileURL(resolve("dist-ssr/entry-server.js")).href);
let html = readFileSync("dist/index.html", "utf8");
if (!html.includes('<div id="root"></div>')) throw new Error("marcador #root não encontrado");
html = html.replace('<div id="root"></div>', `<div id="root">${render()}</div>`);

// CSS embutido
html = html.replace(/<link rel="stylesheet"[^>]*href="(\/assets\/[^"]+\.css)"[^>]*>/, (_, href) => {
  const css = readFileSync(`dist${href}`, "utf8");
  return `<style>${css}</style>`;
});

// preload das fontes da primeira dobra
const fontes = readdirSync("dist/assets").filter((f) =>
  /^(fraunces-latin-soft-normal|manrope-latin-wght-normal)-.*\.woff2$/.test(f),
);
const preloads = fontes
  .map((f) => `<link rel="preload" href="/assets/${f}" as="font" type="font/woff2" crossorigin>`)
  .join("\n    ");
html = html.replace("</title>", `</title>\n    ${preloads}`);

writeFileSync("dist/index.html", html);
rmSync("dist-ssr", { recursive: true, force: true });
console.log(`pré-renderização ok (${fontes.length} fontes pré-carregadas)`);
