// Pré-renderiza a página no build: o HTML final já sai com todo o conteúdo
// (melhor para SEO, leitores e velocidade). O React só "hidrata" no navegador.
import { readFileSync, writeFileSync, rmSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const dist = resolve("dist");
const { render } = await import(pathToFileURL(resolve("dist-ssr/entry-server.js")).href);
const html = readFileSync(resolve(dist, "index.html"), "utf8");
const app = render();
if (!html.includes("<!--app-->")) throw new Error("Marcador <!--app--> não encontrado em dist/index.html");
// Pré-carrega as fontes usadas no título principal (evita troca de fonte visível)
const fontes = readdirSync(resolve(dist, "assets")).filter((f) => /^(fraunces-latin-wght-(normal|italic)|figtree-latin-wght-normal)-.*\.woff2$/.test(f));
const preloads = fontes.map((f) => `<link rel="preload" href="/assets/${f}" as="font" type="font/woff2" crossorigin />`).join("\n    ");
const final = html.replace("<!--app-->", app).replace("</title>", `</title>\n    ${preloads}`);
writeFileSync(resolve(dist, "index.html"), final);
rmSync(resolve("dist-ssr"), { recursive: true, force: true });
console.log(`Pré-renderizado: ${(app.length / 1024).toFixed(1)} kB de HTML`);
