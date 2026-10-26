// Gera o HTML estático da página (melhor primeira pintura e SEO) a partir do build SSR.
import { readFileSync, writeFileSync, rmSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const root = resolve(import.meta.dirname, "..");
const { render } = await import(pathToFileURL(resolve(root, ".ssr/entry-server.js")).href);
const file = resolve(root, "dist/index.html");
const html = readFileSync(file, "utf8");
if (!html.includes("<!--app-->")) throw new Error("Marcador <!--app--> não encontrado em dist/index.html");
writeFileSync(file, html.replace("<!--app-->", render()));
rmSync(resolve(root, ".ssr"), { recursive: true, force: true });
console.log("Pré-renderização concluída: dist/index.html");
