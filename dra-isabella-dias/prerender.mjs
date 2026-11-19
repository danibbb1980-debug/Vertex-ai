// Gera o HTML estático da página (melhor primeira pintura e SEO) a partir do bundle SSR.
import { readFileSync, writeFileSync, rmSync, readdirSync } from "node:fs";
const { render } = await import("./dist-ssr/entry-server.js");
const file = "dist/index.html";
const html = readFileSync(file, "utf8");
const font = readdirSync("dist/assets").filter((f) => /^newsreader-normal-.*\.woff2$/.test(f)).map((f) => ["/assets/" + f]).at(0);
let out = html.replace('<div id="root"></div>', `<div id="root">${render()}</div>`);
if (font) out = out.replace("</title>", `</title>\n    <link rel="preload" href="${font[0]}" as="font" type="font/woff2" crossorigin />`);
// CSS pequeno (~7 kB gzip): inline para não bloquear a primeira pintura
out = out.replace(/<link rel="stylesheet" crossorigin href="(\/assets\/[^"]+\.css)">/, (_, href) => `<style>${readFileSync("dist" + href, "utf8")}</style>`);
writeFileSync(file, out);
rmSync("dist-ssr", { recursive: true, force: true });
console.log("prerender ok", out.length, "bytes", font ? "(fonte pré-carregada)" : "");
