// Pré-renderiza o HTML da página no build (conteúdo visível antes do JavaScript).
import { readFileSync, writeFileSync, rmSync } from "node:fs";
import { render } from "./dist-ssr/entry-server.js";

const file = "dist/index.html";
const html = readFileSync(file, "utf8");
if (!html.includes('<div id="root"></div>')) throw new Error("root não encontrado");
let out = html.replace('<div id="root"></div>', `<div id="root">${render()}</div>`);
// CSS embutido no HTML: evita uma requisição que bloqueia a primeira pintura
out = out.replace(/<link rel="stylesheet"[^>]*href="(\/assets\/[^"]+\.css)"[^>]*>/, (_, href) => `<style>${readFileSync("dist" + href, "utf8")}</style>`);
writeFileSync(file, out);
rmSync("dist-ssr", { recursive: true, force: true });
console.log("prerender ok");
