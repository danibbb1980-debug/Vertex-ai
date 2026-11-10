// Gera o HTML inicial da página (pré-renderização) para a primeira pintura não depender do JavaScript.
import { readFileSync, writeFileSync, rmSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";

const { render } = await import(pathToFileURL(resolve("dist-ssr/entry-server.js")).href);
const html = readFileSync("dist/index.html", "utf8");
const app = render();
if (!html.includes('<div id="root"></div>')) throw new Error("root não encontrado");
let out = html.replace('<div id="root"></div>', `<div id="root">${app}</div>`);
// CSS embutido no HTML: evita uma requisição que bloqueia a primeira pintura
out = out.replace(/<link rel="stylesheet"[^>]*href="(\/assets\/[^"]+\.css)"[^>]*>/, (_, href) => `<style>${readFileSync("dist" + href, "utf8")}</style>`);
writeFileSync("dist/index.html", out);
rmSync("dist-ssr", { recursive: true, force: true });
console.log("prerender ok:", Math.round(app.length / 1024), "KB de HTML");
