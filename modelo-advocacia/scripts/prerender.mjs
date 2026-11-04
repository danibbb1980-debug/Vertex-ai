// Pré-renderiza o HTML da página (React no servidor) para o conteúdo aparecer antes do JavaScript.
import { readFileSync, writeFileSync, rmSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const dist = resolve("dist");
const ssr = resolve("dist-ssr/entry-server.js");
const { render } = await import(pathToFileURL(ssr).href);
const file = resolve(dist, "index.html");
let html = readFileSync(file, "utf8").replace("<!--app-->", render());
// CSS embutido: um pedido a menos bloqueando a primeira pintura.
html = html.replace(/<link rel="stylesheet"[^>]*href="(\/assets\/[^"]+\.css)"[^>]*>/, (_, href) => {
  const css = readFileSync(resolve(dist, href.slice(1)), "utf8");
  return `<style>${css}</style>`;
});
if (html.includes("localhost")) throw new Error("HTML final contém 'localhost'");
writeFileSync(file, html);
rmSync(resolve("dist-ssr"), { recursive: true, force: true });
console.log("Pré-renderizado: dist/index.html");
