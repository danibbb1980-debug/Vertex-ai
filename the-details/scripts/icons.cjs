// Gera favicon-32, apple-touch-icon e og.jpg a partir dos SVGs do logo e de uma foto real.
const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage();
  const fav = fs.readFileSync('public/favicon.svg', 'utf8');
  for (const [s, out] of [[32, 'public/favicon-32.png'], [180, 'public/apple-touch-icon.png']]) {
    await p.setViewportSize({ width: s, height: s });
    await p.setContent(`<body style="margin:0;background:${s === 180 ? '#0c0d0f' : 'transparent'}">${fav.replace('<svg', `<svg width="${s}" height="${s}"`)}</body>`);
    await p.screenshot({ path: out, omitBackground: s === 32 });
  }
  const logo = fs.readFileSync('public/logo-the-details.svg', 'utf8');
  const img = 'data:image/webp;base64,' + fs.readFileSync('public/media/suv-branco-frente-1100.webp').toString('base64');
  await p.setViewportSize({ width: 1200, height: 630 });
  await p.setContent(`<body style="margin:0;width:1200px;height:630px;background:#0c0d0f;display:grid;grid-template-columns:1fr 420px;overflow:hidden">
  <div style="display:flex;flex-direction:column;justify-content:center;padding:0 64px;gap:28px"><div style="width:560px">${logo}</div>
  <div style="font:400 22px/1.4 Arial;color:#8b8f96;letter-spacing:.18em;text-transform:uppercase">Poços de Caldas · MG</div></div>
  <div style="background:url(${img}) center 40%/cover"></div></body>`);
  await p.screenshot({ path: 'public/og.jpg', type: 'jpeg', quality: 82 });
  await b.close();
})();
