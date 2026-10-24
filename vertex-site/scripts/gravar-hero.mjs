// Grava a cena 3D do hero em vídeo, para aparelhos sem aceleração de GPU.
//
// Uso (com o site servido em http://localhost:4173 via `npm run preview`):
//   PLAYWRIGHT_CORE=/caminho/para/playwright-core CHROME=/caminho/do/chrome \
//     node scripts/gravar-hero.mjs
// Depois, converta os quadros com ffmpeg (comandos no README).
//
// A cena roda em ?capture3d: o tempo é controlado quadro a quadro, então o
// resultado é fluido mesmo numa máquina lenta. Grava uma volta completa do
// giro (18 s, de t=3 a t=21), que fecha o loop sem emenda.
import { mkdirSync, rmSync } from "node:fs";

const { chromium } = await import(process.env.PLAYWRIGHT_CORE || "playwright-core");
const OUT = process.env.OUT || "gravacao-hero";
const W = Number(process.env.W || 1600);
const H = Number(process.env.H || 900);
const FPS = 24;
const T0 = 3;
const T1 = 21;

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({
  executablePath: process.env.CHROME,
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"],
});
const page = await browser.newPage({ viewport: { width: W, height: H } });
await page.goto("http://localhost:4173/?force3d&capture3d", { waitUntil: "networkidle" });

// Só a cena: esconde texto, véu, cabeçalho e o resto da página
await page.addStyleTag({
  content: `
    header, footer, main > :not(#topo), #topo > :not(.hero-backdrop), .hero-veil, .fixed { visibility: hidden !important; }
    #topo { height: 100vh !important; min-height: 0 !important; }
    .hero-backdrop { opacity: 1 !important; transition: none !important; }
    html, body { overflow: hidden !important; background: #090a0d !important; }
  `,
});

await page.waitForFunction(() => typeof window.__vertexStep === "function", null, { timeout: 30000 });
// Espera as texturas e o primeiro quadro
for (let i = 0; i < 200; i++) {
  await page.evaluate(() => window.__vertexStep(0));
  if (await page.evaluate(() => window.__vertexReady)) break;
  await page.waitForTimeout(100);
}

const total = Math.min(Number(process.env.MAX || Infinity), Math.round((T1 - T0) * FPS));
for (let f = 0; f < total; f++) {
  const t = T0 + f / FPS;
  await page.evaluate((t) => window.__vertexStep(t), t);
  await page.screenshot({ path: `${OUT}/f${String(f).padStart(4, "0")}.png` });
  if (f % 48 === 0) console.log(`quadro ${f}/${total}`);
}
// Capa (imagem parada)
await page.evaluate(() => window.__vertexStep(7.5));
await page.screenshot({ path: `${OUT}/poster.png` });
console.log("pronto");
await browser.close();
