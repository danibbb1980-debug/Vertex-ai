// Abre a página, expande os acordeões e procura termos proibidos no texto visível.
import { createRequire } from 'module';
const require = createRequire(process.env.NODE_PATH + '/');
const { chromium } = require('playwright');

const url = process.argv[2] || 'http://localhost:4173/';
const b = await chromium.launch();
const p = await b.newPage();
await p.goto(url, { waitUntil: 'networkidle' });
for (const btn of await p.$$('button[aria-expanded=false]')) {
  try {
    await btn.click({ timeout: 500 });
  } catch {}
}
await p.waitForTimeout(800);
const proib = ['confirmar', 'substituir', 'lorem', 'transformando', 'sofistic', 'elegân', 'natural', 'k-beauty', 'exclusiv', 'autoestima', 'milhão', '20 anos', 'trajetória', 'garant', 'harvard', 'ciosp', 'palestr', 'professora', 'melhor', 'resultado', 'transforma', 'definitiv', 'indolor', 'especialista', 'gratuit', 'seguidores', 'tel:', 'localhost', 'em breve', 'vitalize'];
const txt = await p.evaluate(() => document.body.innerText.toLowerCase());
const html = (await p.content()).toLowerCase();
for (const w of proib) {
  const i = txt.indexOf(w);
  if (i >= 0) console.log('ACHOU', w, '→', txt.slice(Math.max(0, i - 60), i + 40).replace(/\n/g, ' '));
  if (html.includes(w) && i < 0) console.log('só no HTML:', w);
}
console.log('colchetes no texto visível:', (txt.match(/\[/g) || []).length);
console.log('CRO no hero:', await p.$eval('#inicio', (e) => e.innerText.includes('CRO 33126')));
console.log('CRO no rodapé:', await p.$eval('footer', (e) => e.innerText.includes('CRO 33126')));
await b.close();
