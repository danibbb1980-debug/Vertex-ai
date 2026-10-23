// Converte as capturas dos exemplos em WebP (duas larguras) para public/exemplos
import sharp from "sharp";
const [, , ...pairs] = process.argv;
for (let i = 0; i < pairs.length; i += 2) {
  const src = pairs[i], name = pairs[i + 1];
  const meta = await sharp(src).metadata();
  console.log(name, meta.width, meta.height);
  for (const w of [640, 1200]) {
    await sharp(src).resize({ width: w }).webp({ quality: 78 }).toFile(`public/exemplos/${name}-${w}.webp`);
  }
}
