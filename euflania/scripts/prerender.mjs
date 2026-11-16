// Pré-renderiza o HTML da página (conteúdo acessível sem JavaScript e LCP mais rápido).
import { readFileSync, writeFileSync, rmSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, resolve } from "node:path";

const raiz = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const { render } = await import(pathToFileURL(resolve(raiz, "dist-ssr/entry-server.js")).href);
const arquivo = resolve(raiz, "dist/index.html");
const html = readFileSync(arquivo, "utf8");
if (!html.includes('<div id="root"></div>')) throw new Error("marcador #root não encontrado");
writeFileSync(arquivo, html.replace('<div id="root"></div>', `<div id="root">${render()}</div>`));
rmSync(resolve(raiz, "dist-ssr"), { recursive: true, force: true });
console.log("prerender ok");
