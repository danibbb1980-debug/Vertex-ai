/**
 * Captura as screenshots das demos para a seção de portfólio.
 *
 *   npx playwright install chromium      # só na primeira vez
 *   node scripts/capturar-projetos.mjs
 *
 * Salva em public/projetos/. O Portfolio.tsx detecta os arquivos em tempo de
 * build e passa a usá-los no lugar da prévia em CSS. Não é preciso converter
 * para WebP/AVIF: o next/image faz isso sob demanda (ver `images.formats` em
 * next.config.ts), servindo AVIF para quem suporta e WebP para o resto.
 *
 * Requer acesso de rede às URLs das demos — este script roda na sua máquina,
 * não no CI.
 */

import { mkdir } from "node:fs/promises";
import { chromium } from "playwright";

const PROJETOS = [
  { arquivo: "clinica-lumiere.png", url: "https://clinica-alpha-jade.vercel.app/" },
  { arquivo: "aurum-imobiliaria.png", url: "https://imobiaria.vercel.app/" },
];

/* 16:10, o mesmo aspect-ratio do container do card. 2x para telas retina. */
const LARGURA = 1440;
const ALTURA = 900;

const destino = new URL("../public/projetos/", import.meta.url);

await mkdir(destino, { recursive: true });

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: LARGURA, height: ALTURA },
  deviceScaleFactor: 2,
});

for (const { arquivo, url } of PROJETOS) {
  const page = await context.newPage();
  process.stdout.write(`Capturando ${url} ... `);

  try {
    await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });

    // Rola a página inteira para disparar lazy-loading, depois volta ao topo.
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 600) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 120));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(1200);

    await page.screenshot({ path: new URL(arquivo, destino) });
    console.log("ok");
  } catch (erro) {
    console.log(`falhou — ${erro.message}`);
  } finally {
    await page.close();
  }
}

await browser.close();
console.log("\nArquivos em public/projetos/. Rode `npm run build` para publicar.");
