// Gera o logotipo vetorial (SVG) a partir da Lobster e da Hanken Grotesk.
import opentype from 'opentype.js';
import fs from 'node:fs';
const lob = opentype.loadSync('node_modules/@fontsource/lobster/files/lobster-latin-400-normal.woff');
const han = opentype.loadSync('node_modules/@fontsource/hanken-grotesk/files/hanken-grotesk-latin-600-normal.woff');
const word = lob.getPath('The Details', 0, 0, 200, { features: { liga: true } });
const wb = word.getBoundingBox();
// rótulo espaçado
function spaced(font, text, size, track) {
  let x = 0; const parts = [];
  for (const ch of text) {
    const g = font.charToGlyph(ch);
    parts.push(g.getPath(x, 0, size).toPathData(2));
    x += g.advanceWidth * size / font.unitsPerEm + track;
  }
  return { d: parts.join(''), w: x - track };
}
const pad = 22;
const ww = wb.x2 - wb.x1, wh = wb.y2 - wb.y1;
const tagSize = 34, track = 15.5;
const tag = spaced(han, 'ESTÉTICA AUTOMOTIVA', tagSize, track);
const scale = Math.min(1, (ww * 0.92) / tag.w);
const W = Math.ceil(ww + pad * 2), tagY = wh + pad + 62;
const H = Math.ceil(tagY + 12 + pad);
const wd = word.toPathData(2);
const tx = (W - tag.w * scale) / 2;
const wordT = `translate(${(pad - wb.x1).toFixed(1)} ${(pad - wb.y1).toFixed(1)})`;
const full = (ink, line, tagFill) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="The Details Estética Automotiva">
<g transform="${wordT}" stroke-linejoin="round" stroke-linecap="round">
<path d="${wd}" fill="${line}" stroke="${line}" stroke-width="22"/>
<path d="${wd}" fill="${ink}" stroke="${ink}" stroke-width="2"/>
</g>
<path transform="translate(${tx.toFixed(1)} ${tagY}) scale(${scale.toFixed(4)})" d="${tag.d}" fill="${tagFill}"/>
</svg>`;
fs.mkdirSync('src/assets', { recursive: true });
fs.writeFileSync('public/logo-the-details.svg', full('#0E0F11', '#ECEAE4', '#ECEAE4'));
fs.writeFileSync('src/assets/logo.svg', full('#0E0F11', '#ECEAE4', '#ECEAE4'));
fs.writeFileSync('src/assets/logo-claro.svg', full('#ECEAE4', '#0E0F11', '#0E0F11'));
// selo circular (favicon / ícone)
const th = lob.getPath('Th', 0, 0, 200, { features: { liga: true } });
const tb = th.getBoundingBox();
const tw = tb.x2 - tb.x1, thh = tb.y2 - tb.y1, R = 256, s = 300 / Math.max(tw, thh);
const seal = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
<circle cx="256" cy="256" r="256" fill="#1B1C1E"/><circle cx="256" cy="256" r="238" fill="none" stroke="#ECEAE4" stroke-opacity=".4" stroke-width="6"/>
<g transform="translate(${(R - tw * s / 2 - tb.x1 * s).toFixed(1)} ${(R - thh * s / 2 - tb.y1 * s).toFixed(1)}) scale(${s.toFixed(3)})" stroke-linejoin="round">
<path d="${th.toPathData(2)}" fill="#ECEAE4"/></g></svg>`;
fs.writeFileSync('public/favicon.svg', seal);
console.log('logo', W, H, 'tag', tag.w * scale);
