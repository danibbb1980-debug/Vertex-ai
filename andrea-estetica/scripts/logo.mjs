// Gera versões do logo sem alterar proporção nem cor (apenas reamostragem).
import sharp from "sharp";
const src = "referencias/logo-andrea.jpg";
for (const size of [128, 224]) {
  await sharp(src).resize(size, size, { kernel: "lanczos3" }).webp({ quality: 88 }).toFile(`public/logo-${size}.webp`);
}
await sharp(src).resize(64, 64).png().toFile("public/favicon.png");
console.log("ok");
