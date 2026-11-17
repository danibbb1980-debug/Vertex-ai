// Gera o HTML estático da página (SSR em build) e os arquivos de indexação.
import { readFileSync, writeFileSync, rmSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const dist = resolve("dist");
const ssr = await import(pathToFileURL(resolve("dist-ssr/entry-server.js")).href);

const tpl = readFileSync(resolve(dist, "index.html"), "utf8");
let html = tpl.replace("<!--app-head-->", ssr.head()).replace("<!--app-html-->", ssr.render());
if (!ssr.rascunho) html = html.replace('<body>', '<body class="sem-rascunho">');
writeFileSync(resolve(dist, "index.html"), html);

if (ssr.rascunho) {
  writeFileSync(resolve(dist, "robots.txt"), "User-agent: *\nDisallow: /\n");
  writeFileSync(resolve(dist, "_headers"), "/*\n  X-Robots-Tag: noindex, nofollow\n");
} else {
  const url = ssr.siteUrl.replace(/\/$/, "");
  writeFileSync(resolve(dist, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${url}/sitemap.xml\n`);
  writeFileSync(resolve(dist, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${url}/</loc></url></urlset>\n`);
  writeFileSync(resolve(dist, "_headers"), "/*\n  X-Content-Type-Options: nosniff\n");
}

// configuração da Vercel para publicar o dist pronto (sem build)
const headers = [{ source: "/fotos/(.*)", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] }, { source: "/assets/(.*)", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] }];
if (ssr.rascunho) headers.unshift({ source: "/(.*)", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] });
writeFileSync(resolve(dist, "vercel.json"), JSON.stringify({ cleanUrls: true, headers }, null, 2) + "\n");

rmSync(resolve("dist-ssr"), { recursive: true, force: true });
console.log("prerender ok");
