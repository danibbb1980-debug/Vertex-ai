// Recorta as fotos (prints do Instagram enviados pelo vendedor) e gera WebP/JPG otimizados.
import sharp from 'sharp';
import fs from 'node:fs';
fs.mkdirSync('public/fotos', { recursive: true });
// área da foto dentro do print (px do print 1170×2532), sem barra do celular nem botões do Instagram
const fotos = {
  'bianca-verde': { src: 'referencias/fotos/bianca-verde-print.png', left: 0, top: 292 + 110, width: 1170, height: 1462 },
  'bianca-rosa': { src: 'referencias/fotos/bianca-rosa-print.png', left: 11, top: 390 + 190, width: 1148, height: 1435 },
};
for (const [nome, f] of Object.entries(fotos)) {
  const base = sharp(f.src).extract({ left: f.left, top: f.top, width: f.width, height: f.height });
  for (const w of [480, 800, 1120]) {
    await base.clone().resize(w).webp({ quality: 74, effort: 6 }).toFile(`public/fotos/${nome}-${w}.webp`);
  }
  await base.clone().resize(1080).jpeg({ quality: 78, mozjpeg: true }).toFile(`public/fotos/${nome}.jpg`);
}
console.log(fs.readdirSync('public/fotos').map((f) => `${f} ${(fs.statSync('public/fotos/' + f).size / 1024).toFixed(0)}KB`).join('\n'));
