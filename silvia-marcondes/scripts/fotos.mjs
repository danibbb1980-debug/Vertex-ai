// Gera as versões responsivas da foto da profissional a partir de referencias/fotos.
import sharp from "sharp";
const src = "referencias/fotos/silvia-original.webp";
const base = sharp(src).extract({ left: 150, top: 40, width: 960, height: 1200 })
  .modulate({ saturation: 0.9, brightness: 1.04, hue: -4 })
;
for (const w of [480, 720, 960]) {
  const img = base.clone().resize({ width: w });
  await img.clone().webp({ quality: 78 }).toFile(`public/img/silvia-${w}.webp`);
  await img.clone().avif({ quality: 55 }).toFile(`public/img/silvia-${w}.avif`);
}
console.log("ok");
