// Pré-renderiza a página no build: o HTML chega pronto (texto visível antes do JS).
import { readFile, writeFile, rm } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..");
const { render } = await import(pathToFileURL(join(raiz, "dist-ssr/entry-server.js")).href);
const arquivo = join(raiz, "dist/index.html");
const html = await readFile(arquivo, "utf8");
if (!html.includes('<div id="root"></div>')) throw new Error("index.html sem <div id=\"root\"></div>");
await writeFile(arquivo, html.replace('<div id="root"></div>', `<div id="root">${render()}</div>`));
await rm(join(raiz, "dist-ssr"), { recursive: true, force: true });
console.log("pré-renderização ok");
