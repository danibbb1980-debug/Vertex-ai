import { createRequire } from 'module'; const require = createRequire(process.env.NODE_PATH + '/'); const { chromium } = require('playwright');
const base = process.argv[2] || 'http://localhost:4173/';
const out = process.argv[3] || '/tmp/claude-0/shots';
const reduce = process.argv[4] === 'reduce';
import fs from 'fs'; fs.mkdirSync(out, { recursive: true });
const b = await chromium.launch();
for (const [nome, w, h] of [['m', 390, 844], ['d', 1280, 800]]) {
  const p = await b.newPage({ viewport: { width: w, height: h }, reducedMotion: reduce ? 'reduce' : 'no-preference' });
  const erros = [];
  p.on('console', (m) => m.type() === 'error' && erros.push(m.text()));
  p.on('pageerror', (e) => erros.push(e.message));
  await p.goto(base, { waitUntil: 'networkidle' });
  await p.waitForTimeout(3600);
  await p.screenshot({ path: `${out}/${nome}-0-dobra.png` });
  const sw = await p.evaluate(() => document.documentElement.scrollWidth);
  console.log(nome, 'scrollWidth', sw, 'erros', erros);
  for (const id of ['avaliacao', 'atendimento', 'profissional', 'como-funciona', 'duvidas', 'local', 'agendar']) {
    await p.evaluate((i) => document.getElementById(i).scrollIntoView({ behavior: 'instant' }), id);
    await p.waitForTimeout(700);
    await p.screenshot({ path: `${out}/${nome}-${id}.png` });
  }
  await p.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await p.waitForTimeout(500);
  await p.screenshot({ path: `${out}/${nome}-z-fim.png` });
  await p.close();
}
await b.close();
