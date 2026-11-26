// Recria o logo em SVG a partir do recorte de referência.
// Pera e folhas: vetorizadas (potrace) do recorte ampliado.
// Lettering: Comfortaa Light convertida em curvas, medida para coincidir com o recorte.
import fs from 'node:fs';
import sharp from 'sharp';
import potrace from 'potrace';
import ot from 'opentype.js';

const REF = 'referencias/logo-bianca-bassoto-referencia.png';
const S = 4; // fator de ampliação para o traçado
const PEAR = { x: 50, y: 60, w: 300, h: 325 };

// apaga o lettering (x >= 255, y >= 200) antes de vetorizar a pera
const masked = await sharp(REF).composite([{ input: { create: { width: 1080 - 255, height: 435 - 200, channels: 3, background: '#f4efe6' } }, left: 255, top: 200 }]).png().toBuffer();
const up = await sharp(masked)
  .extract({ left: PEAR.x, top: PEAR.y, width: PEAR.w, height: PEAR.h })
  .resize(PEAR.w * S, PEAR.h * S, { kernel: 'lanczos3' })
  .greyscale().blur(2.2).threshold(118).png().toBuffer();

const pearSvg = await new Promise((res, rej) =>
  potrace.trace(up, { turdSize: 60, optTolerance: 0.4, alphaMax: 1.1, threshold: 128 }, (e, s) => (e ? rej(e) : res(s))));
const d = [...pearSvg.matchAll(/ d="([^"]+)"/g)].map((m) => m[1]).join(' ');

// reescala as coordenadas do traçado para o sistema do recorte original
const pearPath = d.replace(/-?\d+(\.\d+)?/g, (n, _a, off, str) => n); // mantém, transform faz a escala

const font = (w) => ot.parse(fs.readFileSync(`node_modules/@fontsource/comfortaa/files/comfortaa-latin-${w}-normal.woff`).buffer.slice(0));
const light = font(300);

function line(text, x, baseline, capPx, targetWidth) {
  const size = capPx / 0.781; // altura da maiúscula = 0.781 em
  const glyphs = light.stringToGlyphs(text);
  const natural = light.getAdvanceWidth(text, size) ;
  const bb = light.getPath(text, 0, 0, size).getBoundingBox();
  const inkW = bb.x2 - bb.x1;
  const track = (targetWidth - inkW) / (glyphs.length - 1);
  let cx = x - bb.x1, out = '';
  glyphs.forEach((g, i) => {
    let pd = font(300).charToGlyph(text[i]).getPath(Math.round(cx * 100) / 100, baseline, size).toPathData(2);
    if (pd.includes("NaN")) throw new Error("NaN em " + text[i]);
    if (pd && !/Z\s*$/.test(pd)) pd += 'Z';
    out += pd;
    cx += (g.advanceWidth / light.unitsPerEm) * size + track;
    if (i < glyphs.length - 1) cx += (light.getKerningValue(g, glyphs[i + 1]) / light.unitsPerEm) * size;
  });
  return out;
}

// medidas do recorte (px): linha 1 x 262–992, maiúscula 206–274; linha 2 x 351–888, maiúscula 292–337
const l1 = line('BiancaBassoto', 262, 274, 68, 730);
const l2 = line('Nutricionista', 351, 337, 45, 537);

const pearG = `<g transform="translate(${PEAR.x} ${PEAR.y}) scale(${1 / S})"><path d="${pearPath}"/></g>`;
const VB = '56 62 942 316';
const mk = (fill, body, vb = VB, extra = '') =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" fill="${fill}"${extra}>${body}</svg>\n`;

fs.mkdirSync('src/assets', { recursive: true });
fs.mkdirSync('public', { recursive: true });
const full = `${pearG}<path d="${l1}"/><path d="${l2}"/>`;
fs.writeFileSync('src/assets/logo.svg', mk('currentColor', full, VB, ' role="img" aria-label="Bianca Bassoto Nutricionista"'));
fs.writeFileSync('src/assets/logo-claro.svg', mk('#F5F0E8', full));
fs.writeFileSync('src/assets/logo-escuro.svg', mk('#17140F', full));
fs.writeFileSync('src/assets/simbolo.svg', mk('currentColor', pearG, '30 58 340 340'));
fs.writeFileSync('src/assets/logo-data.json', JSON.stringify({ viewBox: VB, pear: pearG, l1, l2, symbolViewBox: '30 58 340 340' }));

// favicon: símbolo em tinta sobre creme, quadrado
const fav = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="30 58 340 340"><rect x="30" y="58" width="340" height="340" rx="64" fill="#F5F0E8"/><g fill="#17140F">${pearG}</g></svg>\n`;
fs.writeFileSync('public/favicon.svg', fav);
await sharp(Buffer.from(fav)).resize(180, 180).png().toFile('public/apple-touch-icon.png');
await sharp(Buffer.from(fav)).resize(32, 32).png().toFile('public/favicon-32.png');
await sharp(Buffer.from(fav)).resize(512, 512).png().toFile('public/icon-512.png');
console.log('logo ok', pearPath.length, l1.length, l2.length);
