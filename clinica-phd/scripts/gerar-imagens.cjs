// Gera PNGs da marca (favicon, apple-touch-icon, logo, og-image) a partir dos SVGs em public/.
// Uso: node scripts/gerar-imagens.cjs  (requer Playwright com Chromium instalado)
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");
const pub = path.resolve(__dirname, "../public");
const svg = (f) => fs.readFileSync(path.join(pub, f), "utf8");
const fraunces = fs.readFileSync(path.resolve(__dirname, "../node_modules/@fontsource-variable/fraunces/files/fraunces-latin-wght-normal.woff2")).toString("base64");
const figtree = fs.readFileSync(path.resolve(__dirname, "../node_modules/@fontsource-variable/figtree/files/figtree-latin-wght-normal.woff2")).toString("base64");

(async () => {
  const b = await chromium.launch();
  const shot = async (html, w, h, out) => {
    const p = await b.newPage({ viewport: { width: w, height: h } });
    await p.setContent(`<style>html,body{margin:0}</style>${html}`);
    await p.evaluate(() => document.fonts.ready);
    await p.screenshot({ path: path.join(pub, out), omitBackground: true });
    await p.close();
  };
  const fav = svg("favicon.svg").replace("<svg ", '<svg width="100%" height="100%" ');
  await shot(`<div style="width:32px;height:32px">${fav}</div>`, 32, 32, "favicon-32.png");
  const quad = svg("marca/logo-quadrado.svg").replace("<svg ", '<svg width="100%" height="100%" ');
  await shot(`<div style="width:180px;height:180px">${quad}</div>`, 180, 180, "apple-touch-icon.png");
  await shot(`<div style="width:512px;height:512px">${quad}</div>`, 512, 512, "logo-phd.png");
  const mono = svg("marca/monograma-fundo-escuro.svg").replace("<svg ", '<svg height="300" ');
  await shot(
    `<style>@font-face{font-family:F;src:url(data:font/woff2;base64,${fraunces})}@font-face{font-family:S;src:url(data:font/woff2;base64,${figtree})}</style>
    <div style="width:1200px;height:630px;background:#4F4F4B;display:flex;align-items:center;gap:80px;padding:0 110px;box-sizing:border-box;position:relative">
      <div style="position:absolute;left:0;right:0;bottom:56px;height:7px;border-top:2px solid #C49A6C;border-bottom:2px solid #C49A6C;opacity:.8"></div>
      ${mono}
      <div style="color:#F7F3EC">
        <div style="font-family:F;font-size:88px;font-weight:380;letter-spacing:-1.5px;line-height:1">Clínica PHD</div>
        <div style="font-family:S;font-size:26px;margin-top:26px;color:#E2C9A6;letter-spacing:5px;text-transform:uppercase;font-weight:600">Clínica médica</div>
        <div style="font-family:S;font-size:28px;margin-top:10px;color:#F7F3EC;opacity:.9">Poços de Caldas - MG</div>
      </div>
    </div>`,
    1200, 630, "og-image.png",
  );
  await b.close();
  console.log("Imagens geradas em public/");
})();
