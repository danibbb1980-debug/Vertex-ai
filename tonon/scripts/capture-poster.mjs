/**
 * Gera public/hero/poster.webp: uma foto da própria cena 3D, com fundo
 * transparente, usada enquanto o WebGL carrega (ou quando ele não existe).
 *
 *   npm run build && npm start          # em outro terminal
 *   npm run poster [-- http://localhost:3000]
 *
 * Usa o Playwright com Chromium. Se não estiver instalado:
 *   npm i -D playwright && npx playwright install chromium
 *
 * A captura usa "reduced motion", que coloca o objeto na pose inicial da
 * animação.
 */
import { createRequire } from "node:module";
import path from "node:path";
import sharp from "sharp";

const require = createRequire(import.meta.url);
let chromium;
try {
  ({ chromium } = require("playwright"));
} catch {
  console.error("Playwright não encontrado. Instale com: npm i -D playwright && npx playwright install chromium");
  process.exit(1);
}

const url = process.argv[2] ?? "http://localhost:3000";
const out = path.resolve(import.meta.dirname, "../public/hero/poster.webp");

const browser = await chromium.launch({
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"],
});
const page = await browser.newPage({
  viewport: { width: 1440, height: 1075 },
  deviceScaleFactor: 1.25,
  reducedMotion: "reduce",
});
await page.goto(url, { waitUntil: "networkidle" });
await page.waitForSelector("#inicio canvas", { timeout: 30000 });
await page.waitForTimeout(4000);

// Deixa só o canvas visível e o fundo transparente.
await page.addStyleTag({
  content: `
    html, body, #inicio, .hero-bg { background: transparent !important; }
    #inicio *, header, .floating-cta { visibility: hidden !important; }
    #inicio canvas { visibility: visible !important; }
    .grain::after, .hero-fade { display: none !important; }
  `,
});
await page.waitForTimeout(500);

const box = await page.locator("#inicio canvas").boundingBox();
if (!box) throw new Error("Canvas não encontrado");
const png = await page.screenshot({ clip: box, omitBackground: true });
await browser.close();

// Mantém a proporção do canvas: o pôster é exibido com a mesma altura dele,
// então o objeto fica exatamente onde o 3D vai aparecer.
const height = 1200;
const width = Math.round((height * box.width) / box.height);
await sharp(png).resize(width, height).webp({ quality: 82, alphaQuality: 90, effort: 6 }).toFile(out);
// Versão PNG menor para a imagem de compartilhamento (next/og não lê WebP).
await sharp(png).resize(Math.round(width / 2), height / 2).png({ compressionLevel: 9 }).toFile(out.replace(/\.webp$/, "-og.png"));
console.log(`Pôster gerado em ${out} (${width}×${height}). Atualize width/height em components/hero/HeroVisual.tsx se mudarem.`);
