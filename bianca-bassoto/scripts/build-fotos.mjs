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
// Recorte com fundo transparente (hero). Gerado com rembg, modelo birefnet-portrait:
//   rembg i -m birefnet-portrait <foto> referencias/fotos/bianca-verde-recorte.png
{
  const src = sharp('referencias/fotos/bianca-verde-recorte.png');
  const { info } = await src.clone().trim({ threshold: 1 }).toBuffer({ resolveWithObject: true });
  // margem de 24 px em cima e nas laterais; a base continua reta (corte da foto)
  const base = sharp(await src.clone().trim({ threshold: 1 }).extend({ top: 24, left: 24, right: 24, background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer());
  for (const w of [400, 640, 900]) {
    await base.clone().resize(w).webp({ quality: 80, alphaQuality: 90, effort: 6 }).toFile(`public/fotos/bianca-verde-recorte-${w}.webp`);
  }
  const m = await base.metadata();
  console.log('recorte', info.width, info.height, '→', m.width, m.height);
}
// Fundo do hero: a foto inteira, já desfocada (o desfoque vai no arquivo, não em CSS:
// arquivo minúsculo e nada de filtro caro no navegador)
for (const w of [480, 960, 1600]) {
  await sharp('referencias/fotos/bianca-verde-print.png')
    .extract({ left: 0, top: 292, width: 1170, height: 1733 })
    .resize(Math.round(w / 6))
    .blur(2.2)
    .resize(w, null, { kernel: 'cubic' })
    .blur(Math.max(4, w / 120))
    .modulate({ saturation: 0.85 })
    .webp({ quality: 62 })
    .toFile(`public/fotos/bianca-verde-desfoque-${w}.webp`);
}
console.log(fs.readdirSync('public/fotos').map((f) => `${f} ${(fs.statSync('public/fotos/' + f).size / 1024).toFixed(0)}KB`).join('\n'));
