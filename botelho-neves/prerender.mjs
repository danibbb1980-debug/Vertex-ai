// Pré-renderiza o HTML da página (sem backend): o conteúdo já chega pronto no index.html.
import { readFileSync, writeFileSync, rmSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";

const { render } = await import(pathToFileURL(resolve("dist-ssr/entry-server.js")).href);
const file = resolve("dist/index.html");
const html = readFileSync(file, "utf8").replace('<div id="root"></div>', `<div id="root">${render()}</div>`);
writeFileSync(file, html);
rmSync("dist-ssr", { recursive: true, force: true });
console.log("prerender ok:", html.length, "bytes");
