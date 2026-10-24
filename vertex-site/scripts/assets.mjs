// Gera og.png, favicons e a versão webp da logo a partir de referencias/logo-vertex.png
import sharp from "sharp";
const src = "referencias/logo-vertex.png";
const { data } = await sharp(src).extract({ left: 4, top: 4, width: 1, height: 1 }).raw().toBuffer({ resolveWithObject: true });
const bg = { r: data[0], g: data[1], b: data[2], alpha: 1 };
console.log("bg", bg);

// OG 1200x630: logo inteira centralizada
const logo = await sharp(src).resize(600, 600).toBuffer();
await sharp({ create: { width: 1200, height: 630, channels: 4, background: bg } })
  .composite([{ input: logo, top: 15, left: 300 }])
  .png({ compressionLevel: 9 }).toFile("public/og.png");

// Ícones: só o V, num quadrado escuro
const v = await sharp(src).extract({ left: 277, top: 195, width: 470, height: 410 }).toBuffer();
const square = async (size, pad) => {
  const inner = Math.round(size * (1 - pad * 2));
  const vv = await sharp(v).resize(inner, inner, { fit: "contain", background: bg }).toBuffer();
  return sharp({ create: { width: size, height: size, channels: 4, background: bg } })
    .composite([{ input: vv, gravity: "center" }]).png();
};
await (await square(180, 0.14)).toFile("public/apple-touch-icon.png");
await (await square(512, 0.14)).toFile("public/icon-512.png");
await (await square(48, 0.08)).toFile("public/favicon-48.png");
await sharp(src).resize(640, 640).webp({ quality: 82 }).toFile("public/logo-vertex.webp");
console.log("ok");
