// Pré-renderiza o App no dist/index.html (conteúdo no HTML, hidratado no navegador).
import { readFileSync, writeFileSync, rmSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";

const { render } = await import(pathToFileURL(resolve("dist-ssr/entry-server.js")).href);
const arquivo = resolve("dist/index.html");
const html = readFileSync(arquivo, "utf8");
if (!html.includes('<div id="root"></div>')) throw new Error("index.html sem #root vazio");
writeFileSync(arquivo, html.replace('<div id="root"></div>', `<div id="root">${render()}</div>`));
rmSync("dist-ssr", { recursive: true, force: true });
console.log("prerender ok");
