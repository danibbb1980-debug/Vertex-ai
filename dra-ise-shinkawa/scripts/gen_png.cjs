// Gera favicon PNG, apple-touch-icon e og.png a partir dos SVGs do logo.
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
(async () => {
  const pub = path.resolve('public');
  const b64 = (f) => 'data:image/svg+xml;base64,' + fs.readFileSync(path.join(pub, f)).toString('base64');
  const b = await chromium.launch();
  const p = await b.newPage();
  for (const [s, out] of [[32, 'favicon-32.png'], [180, 'apple-touch-icon.png'], [512, 'icon-512.png']]) {
    await p.setViewportSize({ width: s, height: s });
    await p.setContent(`<body style="margin:0"><img src="${b64('favicon.svg')}" style="width:${s}px;height:${s}px;display:block">`);
    await p.screenshot({ path: path.join(pub, out) });
  }
  await p.setViewportSize({ width: 1200, height: 630 });
  await p.setContent(`<body style="margin:0;width:1200px;height:630px;background:#0E1626;display:flex;align-items:center;justify-content:center"><img src="${b64('logo-marinho.svg')}" style="width:900px"></body>`);
  await p.screenshot({ path: path.join(pub, 'og.png') });
  await b.close();
})();
