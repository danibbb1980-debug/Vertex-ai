// Gera a assinatura de marca provisória (logo + favicon) com as fontes do site
// convertidas em curvas. Rodar: npm run logo
import opentype from "opentype.js";
import { readFileSync, writeFileSync } from "node:fs";

const fonte = (p) => {
  const b = readFileSync(new URL(`../node_modules/@fontsource/${p}`, import.meta.url));
  return opentype.parse(b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength));
};
const serif = fonte("fraunces/files/fraunces-latin-500-normal.woff");
const sans = fonte("dm-sans/files/dm-sans-latin-500-normal.woff");

const cores = {
  claro: { texto: "#0F3A40", apoio: "#4E6B66", arco: "#C98A3B" },
  escuro: { texto: "#F4EEE4", apoio: "#B9C8C0", arco: "#E0A458" },
};

// Texto em curvas, com espaçamento entre letras opcional (em unidades de px)
function curvas(font, texto, x, y, size, tracking = 0) {
  let cx = x;
  let d = "";
  const glyphs = [...texto].map((ch) => font.charToGlyph(ch));
  glyphs.forEach((g, i) => {
    d += g.getPath(cx, y, size).toPathData(2);
    let adv = (g.advanceWidth / font.unitsPerEm) * size;
    if (i < glyphs.length - 1) adv += (font.getKerningValue(g, glyphs[i + 1]) / font.unitsPerEm) * size;
    cx += adv + tracking;
  });
  return { d, largura: cx - x - tracking };
}

// Símbolo: um anel aberto (o "arco" da marca) envolvendo um F de canto suave.
// A abertura do anel fica à direita, para onde aponta a barra superior do F.
export const SIMBOLO = {
  anel: "M44.28 29.44A21 21 0 1 1 41.2 11.95",
  f: "M17 35V18.5Q17 13.5 22 13.5H31M17 23.5H27.5",
};

function simbolo(c, tx = 0, ty = 0) {
  return `<g transform="translate(${tx} ${ty})" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <path d="${SIMBOLO.anel}" stroke="${c.arco}" stroke-width="2.6"/>
    <path d="${SIMBOLO.f}" stroke="${c.texto}" stroke-width="3.2"/>
  </g>`;
}

const nome = curvas(serif, "Dr. Feliciano", 62, 29, 29);
const desc = curvas(sans, "ODONTOLOGIA", 63, 45, 9.2, 2.9);
const largura = Math.ceil(Math.max(nome.largura + 62, desc.largura + 63) + 2);

for (const [modo, c] of Object.entries(cores)) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${largura} 50" role="img" aria-labelledby="t">
  <title id="t">Clínica Dr. Feliciano · Odontologia</title>
  ${simbolo(c, 0, 1)}
  <path d="${nome.d}" fill="${c.texto}"/>
  <path d="${desc.d}" fill="${c.apoio}"/>
</svg>\n`;
  writeFileSync(new URL(`../public/${modo === "claro" ? "logo.svg" : "logo-escuro.svg"}`, import.meta.url), svg);
}

writeFileSync(
  new URL("../public/favicon.svg", import.meta.url),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
  <rect width="48" height="48" rx="11" fill="#0F3A40"/>
  <g transform="translate(4.8 4.8) scale(.8)" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <path d="${SIMBOLO.anel}" stroke="#E0A458" stroke-width="3.4"/>
    <path d="${SIMBOLO.f}" stroke="#F4EEE4" stroke-width="4"/>
  </g>
</svg>\n`,
);

// Paths para o React (logo inline, sem requisição extra)
writeFileSync(
  new URL("../src/brand/logo-paths.ts", import.meta.url),
  `// Gerado por scripts/gerar-logo.mjs. Não editar à mão.
export const LOGO = {
  largura: ${largura},
  altura: 50,
  anel: ${JSON.stringify(SIMBOLO.anel)},
  f: ${JSON.stringify(SIMBOLO.f)},
  nome: ${JSON.stringify(nome.d)},
  descritor: ${JSON.stringify(desc.d)},
} as const;
`,
);
console.log("logo gerado", largura);
