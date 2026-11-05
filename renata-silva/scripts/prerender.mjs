// Gera o HTML estático da página (melhor primeira pintura e SEO) e o injeta em dist/index.html.
import { build } from "vite";
import { readFileSync, rmSync, writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";

await build({
  logLevel: "warn",
  build: { ssr: "src/entry-server.tsx", outDir: "dist-ssr", emptyOutDir: true, copyPublicDir: false },
});
const { render } = await import(pathToFileURL(resolve("dist-ssr/entry-server.js")).href);
const html = readFileSync("dist/index.html", "utf8");
if (!html.includes('<div id="root"></div>')) throw new Error("marcador #root não encontrado");
writeFileSync("dist/index.html", html.replace('<div id="root"></div>', `<div id="root">${render()}</div>`));
rmSync("dist-ssr", { recursive: true, force: true });
console.log("prerender ok");
