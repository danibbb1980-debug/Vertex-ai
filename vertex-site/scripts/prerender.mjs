// Gera o HTML estático da página (pré-renderização), para o título e o CTA
// aparecerem antes do JavaScript carregar.
import { readFileSync, writeFileSync, rmSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";

const { render } = await import(pathToFileURL(resolve("dist-ssr/entry-server.js")).href);
const file = resolve("dist/index.html");
const html = readFileSync(file, "utf8");
if (!html.includes("<!--app-->")) throw new Error("marcador <!--app--> não encontrado");
writeFileSync(file, html.replace("<!--app-->", render()).replace('<html lang="pt-BR">', '<html lang="pt-BR" class="no-js">'));
rmSync("dist-ssr", { recursive: true, force: true });
console.log("prerender ok");
