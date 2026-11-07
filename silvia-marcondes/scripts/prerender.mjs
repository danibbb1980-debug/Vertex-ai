// Injeta o HTML pré-renderizado em dist/index.html e remove a pasta temporária do SSR.
import fs from "node:fs";
import { pathToFileURL } from "node:url";

const entrada = pathToFileURL("dist-ssr/entry-server.js").href;
const { render } = await import(entrada);
const html = render();
const p = "dist/index.html";
const pagina = fs.readFileSync(p, "utf8").replace('<div id="root"></div>', `<div id="root">${html}</div>`);
fs.writeFileSync(p, pagina);
fs.rmSync("dist-ssr", { recursive: true, force: true });
console.log(`pré-renderizado: ${(html.length / 1024).toFixed(1)} KB`);
