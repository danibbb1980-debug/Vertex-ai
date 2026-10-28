// Gera as imagens otimizadas (AVIF + WebP) em public/img a partir de ./referencias.
// Uso: npm run imagens
import sharp from "sharp";
import { mkdirSync } from "node:fs";

const SAIDA = "public/img";
mkdirSync(SAIDA, { recursive: true });

const FACHADA = "referencias/fotos/fachada.jpg"; // 202x270, sem pessoas
const STORY = "referencias/fotos/fachada-com-dra-aline.jpg"; // 1206x2144 (story), usada só no Open Graph
const ALINE = "referencias/fotos/dra-aline.jpg"; // 3072x4096
const JOSIANE = "referencias/fotos/dra-josiane-consultorio.webp"; // 1440x1440 com bordas pretas

const tarefas = [
  // Fachada limpa (foto do Google Maps, 202x270): ampliada 3x com Lanczos + nitidez leve
  { nome: "fachada", src: FACHADA, crop: { left: 0, top: 0, width: 202, height: 236 }, larguras: [606], ampliar: 3 },
  // Só o castelo (modo individual da Dra. Aline)
  { nome: "fachada-baixinhos", src: FACHADA, crop: { left: 94, top: 14, width: 106, height: 190 }, larguras: [318], ampliar: 3 },
  // Só o consultório (modo individual da Dra. Josiane)
  { nome: "fachada-consultorio", src: FACHADA, crop: { left: 28, top: 78, width: 76, height: 126 }, larguras: [228], ampliar: 3 },
  // Retratos 4:5
  { nome: "dra-aline", src: ALINE, crop: { left: 0, top: 120, width: 3072, height: 3840 }, larguras: [320, 480, 640, 900] },
  // selfie espelhada pela câmera (o letreiro na parede aparece invertido): "flop" desfaz o espelho
  { nome: "dra-josiane", src: JOSIANE, crop: { left: 500, top: 180, width: 809, height: 1011 }, larguras: [320, 480, 640, 809], flop: true },
];

for (const t of tarefas) {
  for (const w of t.larguras) {
    let base = sharp(t.src).extract(t.crop).resize({ width: w, kernel: "lanczos3" });
    if (t.ampliar) base = base.sharpen({ sigma: 0.8 });
    if (t.flop) base = base.flop();
    await base.clone().avif({ quality: 55, effort: 6 }).toFile(`${SAIDA}/${t.nome}-${w}.avif`);
    await base.clone().webp({ quality: 78 }).toFile(`${SAIDA}/${t.nome}-${w}.webp`);
  }
  console.log("ok", t.nome);
}

// Open Graph 1200x630 (JPEG, compatível com todas as redes)
for (const [nome, src, crop] of [
  ["og-ambas", STORY, { left: 0, top: 274, width: 1206, height: 633 }],
  ["og-aline", STORY, { left: 300, top: 274, width: 906, height: 476 }],
  ["og-josiane", JOSIANE, { left: 192, top: 300, width: 1117, height: 586 }],
]) {
  await sharp(src).extract(crop).flop(nome === "og-josiane").resize(1200, 630, { fit: "cover" }).jpeg({ quality: 80, mozjpeg: true }).toFile(`${SAIDA}/${nome}.jpg`);
}

// Logos (recortes limpos, PNG com transparência) → WebP + PNG reduzido
for (const nome of ["logo-dra-josiane", "logo-odonto-baixinhos"]) {
  const src = `referencias/logos/limpos/${nome}.png`;
  await sharp(src).resize({ width: 360 }).webp({ quality: 70, alphaQuality: 60, smartSubsample: true }).toFile(`${SAIDA}/${nome}.webp`);
}
console.log("logos ok");
