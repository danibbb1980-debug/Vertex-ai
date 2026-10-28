// Gera as imagens otimizadas do site a partir de ./referencias.
// Uso: npm run imagens
//
// - referencias/fotos/*.{png,jpg,jpeg,webp}  -> public/fotos/<nome>-<largura>.{avif,webp}
// - referencias/logo-transparente.png        -> public/marca/logo-<largura>.{webp,png}
// - símbolo do logo (árvore)                  -> favicons em public/
// - imagem de compartilhamento                -> public/og.jpg
// Também escreve src/imagens.json com largura e altura de cada foto (evita salto de layout).
import sharp from "sharp";
import { readdir, mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const raiz = path.resolve(import.meta.dirname, "..");
const ref = path.join(raiz, "referencias");
const pub = path.join(raiz, "public");
const LARGURAS = [480, 800, 1200];

await mkdir(path.join(pub, "fotos"), { recursive: true });
await mkdir(path.join(pub, "marca"), { recursive: true });

const manifesto = {};
const pastaFotos = path.join(ref, "fotos");
const arquivos = existsSync(pastaFotos)
  ? (await readdir(pastaFotos)).filter((f) => /\.(png|jpe?g|webp)$/i.test(f))
  : [];

for (const arquivo of arquivos) {
  const nome = arquivo.replace(/\.[^.]+$/, "");
  const origem = path.join(pastaFotos, arquivo);
  const meta = await sharp(origem).metadata();
  const larguras = LARGURAS.filter((w) => w <= meta.width);
  if (!larguras.length || meta.width > larguras.at(-1) + 150) larguras.push(meta.width);
  for (const w of larguras) {
    const base = sharp(origem).resize({ width: w }).modulate({ saturation: 0.96 });
    await base.clone().avif({ quality: 52, effort: 6 }).toFile(path.join(pub, "fotos", `${nome}-${w}.avif`));
    await base.clone().webp({ quality: 74, effort: 6 }).toFile(path.join(pub, "fotos", `${nome}-${w}.webp`));
  }
  manifesto[nome] = { largura: meta.width, altura: meta.height, larguras };
  console.log("foto", nome, larguras.join(","));
}

// Logo (usado como está, apenas com o fundo branco removido)
const logo = path.join(ref, "logo-transparente.png");
if (existsSync(logo)) {
  const meta = await sharp(logo).metadata();
  for (const w of [100, 200, 400]) {
    await sharp(logo).resize({ width: w }).webp({ quality: 90, alphaQuality: 90 }).toFile(path.join(pub, "marca", `logo-${w}.webp`));
    await sharp(logo).resize({ width: w }).png({ compressionLevel: 9, palette: true }).toFile(path.join(pub, "marca", `logo-${w}.png`));
  }
  manifesto.logo = { largura: meta.width, altura: meta.height, larguras: [100, 200, 400] };

  // Símbolo (árvore) para favicon: recorte da parte de cima do próprio logo
  const simbolo = await sharp(logo)
    .extract({ left: 170, top: 0, width: 490, height: 505 })
    .resize(512, 512, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  const fundo = { r: 251, g: 247, b: 241, alpha: 1 };
  const comFundo = (px, pad) =>
    sharp(simbolo)
      .resize(px - pad * 2, px - pad * 2)
      .extend({ top: pad, bottom: pad, left: pad, right: pad, background: fundo })
      .flatten({ background: fundo })
      .png();
  await sharp(simbolo).resize(48, 48).png().toFile(path.join(pub, "favicon-48.png"));
  await (await comFundo(180, 18)).toFile(path.join(pub, "apple-touch-icon.png"));
  await (await comFundo(512, 56)).toFile(path.join(pub, "icon-512.png"));
  console.log("logo e favicons");

  // Imagem de compartilhamento 1200x630: fundo creme, logo e foto real do consultório
  const fotoOg = ["consultorio", "recepcao", "fachada"].find((n) => manifesto[n]);
  const camadas = [
    { input: await sharp(logo).resize({ height: 430 }).png().toBuffer(), left: 90, top: 100 },
  ];
  if (fotoOg) {
    const origem = path.join(pastaFotos, arquivos.find((a) => a.startsWith(fotoOg)));
    const mascara = Buffer.from(
      `<svg width="560" height="530"><rect width="560" height="530" rx="56" ry="56"/></svg>`,
    );
    const foto = await sharp(origem)
      .resize(560, 530, { fit: "cover" })
      .composite([{ input: mascara, blend: "dest-in" }])
      .png()
      .toBuffer();
    camadas.push({ input: foto, left: 590, top: 50 });
  }
  await sharp({ create: { width: 1200, height: 630, channels: 3, background: fundo } })
    .composite(camadas)
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(path.join(pub, "og.jpg"));
  console.log("og.jpg");
}

await writeFile(path.join(raiz, "src", "imagens.json"), JSON.stringify(manifesto, null, 2) + "\n");
console.log("src/imagens.json atualizado");
