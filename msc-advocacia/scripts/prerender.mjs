// Injeta o HTML renderizado no servidor dentro de dist/index.html.
import { readFileSync, writeFileSync, rmSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const { render } = await import(pathToFileURL(resolve(root, "dist-ssr/entry-server.js")).href);
const file = resolve(root, "dist/index.html");
const html = readFileSync(file, "utf8");
if (!html.includes('<div id="root"></div>')) throw new Error("marcador #root não encontrado");
writeFileSync(file, html.replace('<div id="root"></div>', `<div id="root">${render()}</div>`));
rmSync(resolve(root, "dist-ssr"), { recursive: true, force: true });
console.log("prerender ok");
