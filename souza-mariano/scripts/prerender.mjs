// Pré-renderiza o HTML da página e embute o CSS (sem requisição bloqueante).
import { readFileSync, writeFileSync, readdirSync, rmSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const dist = "dist";
const { render } = await import(pathToFileURL(join("dist-ssr", "entry-server.js")).href);
let html = readFileSync(join(dist, "index.html"), "utf8");
html = html.replace('<div id="root"></div>', `<div id="root">${render()}</div>`);

const assets = readdirSync(join(dist, "assets"));
html = html.replace(/<link rel="stylesheet"[^>]*href="\/assets\/([^"]+\.css)"[^>]*>/, (_, f) => {
  const css = readFileSync(join(dist, "assets", f), "utf8");
  rmSync(join(dist, "assets", f));
  return `<style>${css}</style>`;
});
const preloads = assets
  .filter((f) => /^(newsreader-opsz-normal|familjen-grotesk-latin-400-normal).*\.woff2$/.test(f))
  .map((f) => `<link rel="preload" href="/assets/${f}" as="font" type="font/woff2" crossorigin />`)
  .join("\n    ");
html = html.replace("</title>", `</title>\n    ${preloads}`);
writeFileSync(join(dist, "index.html"), html);
rmSync("dist-ssr", { recursive: true, force: true });
console.log("prerender ok");
