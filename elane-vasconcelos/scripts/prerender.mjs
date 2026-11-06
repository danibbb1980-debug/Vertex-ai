// Gera o HTML final com o conteúdo já renderizado (SEO e primeira pintura).
import { readFileSync, writeFileSync, readdirSync, rmSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const dist = resolve("dist");
const { render } = await import(pathToFileURL(resolve("dist-ssr/entry-server.js")).href);
let html = readFileSync(resolve(dist, "index.html"), "utf8");
html = html.replace("<!--app-->", render());

// pré-carrega as fontes latinas usadas acima da dobra
const fontes = readdirSync(resolve(dist, "assets")).filter((f) =>
  /^(cormorant-garamond-latin-wght-normal|cormorant-garamond-latin-wght-italic|dm-sans-latin-wght-normal)-.*\.woff2$/.test(f),
);
const links = fontes.map((f) => `<link rel="preload" href="/assets/${f}" as="font" type="font/woff2" crossorigin />`);

// pré-carrega a foto do hero, se houver (a <picture> com fetchpriority alto)
const m = html.match(/<source type="image\/avif" srcSet="([^"]+)" sizes="([^"]+)"\/?>(?:(?!<\/picture>).)*?fetchpriority="high"/s);
if (m) links.push(`<link rel="preload" as="image" type="image/avif" imagesrcset="${m[1]}" imagesizes="${m[2]}" fetchpriority="high" />`);

html = html.replace("</title>", `</title>\n    ${links.join("\n    ")}`);
writeFileSync(resolve(dist, "index.html"), html);
rmSync(resolve("dist-ssr"), { recursive: true, force: true });
console.log("prerender ok; preloads:", links.length);
