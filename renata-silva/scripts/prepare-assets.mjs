// Gera os recortes do logo, favicons, imagem de compartilhamento e as fotos
// tratadas a partir de ./referencias. Rode com: npm run assets
import sharp from "sharp";
import { existsSync, mkdirSync, readdirSync } from "node:fs";
import { join, parse } from "node:path";

const REF = "referencias";
const OUT = "public/img";
const LOGO = join(REF, "logo-renata-silva.jpg");
const NAVY = [30, 39, 46]; // fundo do logo (#1E272E), amostrado do arquivo
const SCALE = 4;

mkdirSync(OUT, { recursive: true });

// Remove o fundo azul-marinho do logo sem redesenhar nada: cada pixel vira
// cor + transparência, de modo que, sobre o mesmo azul, o resultado é idêntico.
async function cutLogo(box, scale = SCALE) {
  const { data, info } = await sharp(LOGO)
    .extract(box)
    .resize(box.width * scale, box.height * scale, { kernel: "lanczos3" })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const out = Buffer.alloc(info.width * info.height * 4);
  for (let i = 0, j = 0; i < data.length; i += 3, j += 4) {
    const d = [0, 1, 2].map((c) => data[i + c] - NAVY[c]);
    let a = Math.max(...d.map((v, c) => v / (255 - NAVY[c])));
    a = Math.min(1, Math.max(0, (a - 0.05) / 0.95));
    for (let c = 0; c < 3; c++) {
      out[j + c] = a > 0 ? Math.min(255, Math.max(0, Math.round(NAVY[c] + d[c] / a))) : 0;
    }
    out[j + 3] = Math.round(a * 255);
  }
  return sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } }).sharpen({ sigma: 0.6 });
}

const GLYPH = { left: 84, top: 62, width: 35, height: 50 };
const WORD = { left: 41, top: 115, width: 121, height: 25 };
const LOCKUP = { left: 41, top: 62, width: 121, height: 78 };

await (await cutLogo(GLYPH)).png().toFile(join(OUT, "logo-glifo.png"));
await (await cutLogo(WORD)).png().toFile(join(OUT, "logo-nome.png"));
await (await cutLogo(LOCKUP)).png().toFile(join(OUT, "logo-completo.png"));
// Versões leves para header e rodapé (2x o tamanho exibido)
await (await cutLogo(GLYPH)).resize({ height: 112 }).webp({ quality: 90, alphaQuality: 100 }).toFile(join(OUT, "logo-glifo.webp"));
await (await cutLogo(WORD)).resize({ height: 84 }).webp({ quality: 90, alphaQuality: 100 }).toFile(join(OUT, "logo-nome.webp"));

// Favicons: o glifo sozinho
const glyphBuf = await (await cutLogo(GLYPH)).png().toBuffer();
const square = async (size, pad, bg) =>
  sharp({ create: { width: size, height: size, channels: 4, background: bg } })
    .composite([
      {
        input: await sharp(glyphBuf)
          .resize(size - pad * 2, size - pad * 2, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
          .toBuffer(),
        gravity: "center",
      },
    ])
    .png();
await (await square(48, 2, { r: 0, g: 0, b: 0, alpha: 0 })).toFile("public/favicon.png");
await (await square(180, 28, { r: NAVY[0], g: NAVY[1], b: NAVY[2], alpha: 1 })).toFile("public/apple-touch-icon.png");

// Imagem de compartilhamento (Open Graph): o logo completo sobre o azul do logo
const lockup = await (await cutLogo(LOCKUP)).resize({ height: 300 }).png().toBuffer();
await sharp({ create: { width: 1200, height: 630, channels: 3, background: { r: NAVY[0], g: NAVY[1], b: NAVY[2] } } })
  .composite([{ input: lockup, gravity: "center" }])
  .jpeg({ quality: 88 })
  .toFile(join(OUT, "og-renata-silva.jpg"));

// Fotos do consultório: tom azul-marinho/rosê discreto, AVIF + WebP no tamanho
// nativo (os arquivos de origem são pequenos; não vale ampliar).
const FOTOS = join(REF, "fotos");
if (existsSync(FOTOS)) {
  for (const file of readdirSync(FOTOS).filter((f) => /\.(jpe?g|png|webp)$/i.test(f))) {
    const { name } = parse(file);
    const src = sharp(join(FOTOS, file));
    const { width, height } = await src.metadata();
    const tone = Buffer.from(
      `<svg width="${width}" height="${height}"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1">` +
        `<stop offset="0" stop-color="#E9A3AE" stop-opacity="0.35"/><stop offset="1" stop-color="#1E272E" stop-opacity="0.55"/>` +
        `</linearGradient></defs><rect width="100%" height="100%" fill="url(#g)"/></svg>`,
    );
    const base = src.clone().modulate({ saturation: 0.85, brightness: 0.98 }).composite([{ input: tone, blend: "soft-light" }]);
    await base.clone().avif({ quality: 60 }).toFile(join(OUT, `${name}.avif`));
    await base.clone().webp({ quality: 80 }).toFile(join(OUT, `${name}.webp`));
    console.log(`foto ${name}: ${width}x${height}`);
  }
}
console.log("ok");
