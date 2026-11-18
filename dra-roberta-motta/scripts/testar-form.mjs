import { createRequire } from 'module'; const require = createRequire(process.env.NODE_PATH + '/'); const { chromium } = require('playwright');
const b = await chromium.launch();
for (const [w,h] of [[375,812],[1280,800]]) {
  const ctx = await b.newContext({ viewport: { width: w, height: h } });
  const p = await ctx.newPage();
  await p.goto('http://localhost:4173/#agendar', { waitUntil: 'networkidle' });
  // envio vazio → erro no nome
  await p.click('button[type=submit]');
  console.log(w, 'erro nome:', await p.textContent('#erro-nome'), 'foco:', await p.evaluate(() => document.activeElement.id));
  await p.fill('#f-nome', 'Maria José da Silva');
  // sábado
  const sab = new Date(); sab.setDate(sab.getDate() + ((6 - sab.getDay() + 7) % 7 || 7));
  const iso = (d) => d.toISOString().slice(0, 10);
  await p.fill('#f-data', iso(sab));
  console.log(w, 'sábado:', await p.textContent('#erro-data'));
  const seg = new Date(sab); seg.setDate(sab.getDate() + 2);
  await p.fill('#f-data', iso(seg));
  const opcoes = await p.$$eval('#f-hora option', (o) => o.map((x) => x.value));
  console.log(w, 'horários:', opcoes.join(','));
  await p.selectOption('#f-atend', 'Harmonização facial');
  await p.selectOption('#f-hora', '15:00');
  await p.fill('#f-obs', 'Quero entender as opções, ação & ç.');
  const reqs = [];
  p.on('request', (r) => reqs.push(r.url()));
  const [pop] = await Promise.all([ctx.waitForEvent('page'), p.click('button[type=submit]')]);
  await pop.waitForTimeout(800);
  const url = pop.url();
  console.log(w, 'popup:', url.slice(0, 60));
  const txt = decodeURIComponent(new URL(url.includes('wa.me') ? url : 'https://x/?text=').searchParams.get('text') || '');
  const href = await p.getAttribute('[role=status] a', 'href'); console.log('link fallback:', href.slice(0,40)); console.log(decodeURIComponent(new URL(href).searchParams.get('text')));
  console.log(w, 'requisições do site durante envio:', reqs.filter((u) => u.includes('localhost')).length);
  console.log(w, 'status:', (await p.textContent('[role=status]')).slice(0, 80));
  console.log(w, 'localStorage:', await p.evaluate(() => localStorage.length), 'cookies:', (await ctx.cookies()).length);
  await ctx.close();
}
await b.close();
