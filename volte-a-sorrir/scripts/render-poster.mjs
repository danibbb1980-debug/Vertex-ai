/**
 * Renderiza o pôster do hero a partir da cena 3D real, para o enquadramento
 * do pôster e do 3D serem idênticos.
 *
 *   npm run dev                      # em outro terminal
 *   node scripts/render-poster.mjs   # usa http://localhost:3000
 *
 * Abre /?poster (modo de captura: pose de repouso, fundo transparente),
 * espera o primeiro quadro e salva public/images/tooth-poster.png (usado pela
 * imagem de compartilhamento). A versão .webp é gerada a partir dele.
 *
 * Requer o Playwright com Chromium (não é dependência do site):
 *   npm i -g playwright && npx playwright install chromium
 */
import { createRequire } from "node:module";
import { writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");

const base = process.argv[2] ?? "http://localhost:3000";
const out = resolve(dirname(fileURLToPath(import.meta.url)), "../public/images/tooth-poster.png");

const browser = await chromium.launch({
  args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
});
// Viewport largo: o palco do hero fica com ~540 px de largura (4:5).
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 2 });
page.on("pageerror", (e) => console.error("pageerror:", e.message));
await page.goto(`${base}/?poster`, { waitUntil: "networkidle" });
await page.waitForFunction(() => document.title === "poster-ready", null, { timeout: 120_000 });
await page.waitForTimeout(500);

const dataUrl = await page.evaluate(() => document.querySelector("[data-capture] canvas").toDataURL("image/png"));
writeFileSync(out, Buffer.from(dataUrl.split(",")[1], "base64"));
console.log(`gravado ${out}`);
await browser.close();
