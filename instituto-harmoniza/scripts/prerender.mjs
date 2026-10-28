// Pré-renderiza a página no build: o HTML já sai com todo o conteúdo
// (melhor para SEO, para o primeiro carregamento e para quem está sem JS).
import { readFile, writeFile, rm } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";

const { render } = await import(pathToFileURL(resolve(".ssr/entry-server.js")).href);
const caminho = resolve("dist/index.html");
let html = await readFile(caminho, "utf8");
if (!html.includes("<!--app-html-->")) throw new Error("marcador <!--app-html--> não encontrado em dist/index.html");
html = html.replace("<!--app-html-->", render());
await writeFile(caminho, html);
await rm(".ssr", { recursive: true, force: true });
console.log("pré-render ok:", (html.length / 1024).toFixed(1), "KB");
