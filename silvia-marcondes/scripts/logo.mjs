// Gera o logo provisório (SVG com texto em curvas), o favicon e as variantes clara/escura.
import fs from "node:fs";
import opentype from "opentype.js";

const mono = fs.readFileSync("src/lib/monograma.ts", "utf8").match(/"(M[^"]+)"/)[1];
const fontDir = "node_modules/@fontsource/fraunces/files/";
const load = (f) => { const b = fs.readFileSync(fontDir + f); return opentype.parse(b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength)); };
const serif = load("fraunces-latin-400-normal.woff");
const sansB = fs.readFileSync("node_modules/@fontsource/figtree/files/figtree-latin-600-normal.woff"); const sans = opentype.parse(sansB.buffer.slice(sansB.byteOffset, sansB.byteOffset + sansB.byteLength));

const n = (v) => +v.toFixed(2);
const toD = (cmds) => cmds.map((c) => c.type === "Z" ? "Z" : c.type === "Q" ? `Q${n(c.x1)} ${n(c.y1)} ${n(c.x)} ${n(c.y)}` : c.type === "C" ? `C${n(c.x1)} ${n(c.y1)} ${n(c.x2)} ${n(c.y2)} ${n(c.x)} ${n(c.y)}` : `${c.type}${n(c.x)} ${n(c.y)}`).join("");
function textPath(font, text, x, y, size, tracking = 0) {
  let cx = x; const parts = [];
  for (const ch of text) {
    const g = font.charToGlyph(ch);
    parts.push(toD(g.getPath(cx, y, size).commands));
    cx += (g.advanceWidth / font.unitsPerEm) * size + tracking;
  }
  return { d: parts.join(""), width: cx - x - tracking };
}

const palettes = {
  claro: { ink: "#4A3459", sub: "#5E6E5A" },
  escuro: { ink: "#F4EEF6", sub: "#C9D3C6" },
};
fs.mkdirSync("public/marca", { recursive: true });
for (const [nome, c] of Object.entries(palettes)) {
  const word = textPath(serif, "Silvia Marcondes", 92, 52, 40, 0.2);
  const desc = textPath(sans, "ESTÉTICA", 94, 80, 13, 5.2);
  const W = Math.ceil(92 + word.width + 8);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} 96" width="${W * 2}" height="192" role="img" aria-label="Silvia Marcondes Estética">
  <path d="${mono}" transform="translate(4 8) scale(1.25)" fill="none" stroke="${c.ink}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="${word.d}" fill="${c.ink}"/>
  <path d="${desc.d}" fill="${c.sub}"/>
</svg>`;
  fs.writeFileSync(`public/marca/logo-${nome}.svg`, svg);
  const monoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="256" height="256" role="img" aria-label="SM"><path d="${mono}" fill="none" stroke="${c.ink}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  fs.writeFileSync(`public/marca/monograma-${nome}.svg`, monoSvg);
}
const fav = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="16" fill="#4A3459"/><path d="${mono}" transform="translate(3.5 2) scale(0.9)" fill="none" stroke="#FAF7F4" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
fs.writeFileSync("public/favicon.svg", fav);
console.log("logo ok");
