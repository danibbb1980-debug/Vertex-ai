/**
 * Prepara as fotos do site a partir do material original enviado pelo
 * laboratório (imagens publicadas no Instagram de Matheus Tonon).
 *
 *   node scripts/prepare-images.mjs <pasta-com-os-originais>
 *
 * Cada foto de caso é uma composição "antes/depois" (empilhada ou lado a
 * lado). O script separa as duas metades, descarta a faixa de emenda e
 * gera dois JPGs com exatamente o mesmo tamanho, para o comparador
 * arrastável. O next/image converte para AVIF/WebP na entrega.
 *
 * As coordenadas foram medidas nos arquivos originais (detecção da emenda
 * por diferença entre linhas/colunas). Se trocar um original, confira-as.
 */
import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const src = process.argv[2];
if (!src) {
  console.error("Uso: node scripts/prepare-images.mjs <pasta-com-os-originais>");
  process.exit(1);
}

const out = path.resolve(import.meta.dirname, "../public/images");
const OUT_WIDTH = 1400;

/** Busca um original pelo trecho único do nome do arquivo. */
async function findSource(fragment) {
  const { readdir } = await import("node:fs/promises");
  const files = await readdir(src);
  const match = files.find((f) => f.includes(fragment));
  if (!match) throw new Error(`Original não encontrado: ${fragment}`);
  return path.join(src, match);
}

/** Regiões { left, top, width, height } em pixels do original. */
const cases = [
  {
    id: "caso-01",
    file: "imgi_11_",
    // Composição com três painéis: usamos os dois da esquerda (antes em cima, depois embaixo).
    before: { left: 10, top: 116, width: 656, height: 534 },
    after: { left: 10, top: 700, width: 656, height: 534 },
  },
  {
    id: "caso-02",
    file: "imgi_19_",
    before: { left: 0, top: 0, width: 3000, height: 1990 },
    after: { left: 0, top: 2010, width: 3000, height: 1990 },
  },
  {
    id: "caso-03",
    file: "imgi_23_",
    // Lado a lado: antes à esquerda, depois à direita.
    before: { left: 0, top: 80, width: 536, height: 1270 },
    after: { left: 544, top: 80, width: 536, height: 1270 },
  },
  {
    id: "caso-04",
    file: "imgi_29_",
    before: { left: 0, top: 0, width: 3072, height: 2040 },
    after: { left: 0, top: 2056, width: 3072, height: 2040 },
  },
  {
    id: "caso-05",
    file: "imgi_32_",
    before: { left: 0, top: 0, width: 2340, height: 1486 },
    after: { left: 0, top: 1500, width: 2340, height: 1486 },
  },
  {
    id: "caso-06",
    file: "imgi_55_",
    before: { left: 0, top: 0, width: 3000, height: 1870 },
    after: { left: 0, top: 1882, width: 3000, height: 1868 },
  },
];

async function exportRegion(input, region, size, target) {
  await sharp(input)
    .rotate()
    .extract(region)
    .resize(size.width, size.height, { fit: "cover", position: "centre" })
    .jpeg({ quality: 84, mozjpeg: true, chromaSubsampling: "4:4:4" })
    .toFile(target);
}

await mkdir(path.join(out, "casos"), { recursive: true });

const manifest = [];
for (const c of cases) {
  const input = await findSource(c.file);
  const width = Math.min(OUT_WIDTH, c.before.width);
  const height = Math.round((c.before.height / c.before.width) * width);
  const size = { width, height };
  await exportRegion(input, c.before, size, path.join(out, "casos", `${c.id}-antes.jpg`));
  await exportRegion(input, c.after, size, path.join(out, "casos", `${c.id}-depois.jpg`));
  manifest.push({ id: c.id, ...size });
}

// Retrato de Matheus Tonon na recepção do laboratório (3:4).
const portrait = await findSource("imgi_33_");
await sharp(portrait)
  .rotate()
  .extract({ left: 0, top: 150, width: 1080, height: 1440 })
  .jpeg({ quality: 86, mozjpeg: true })
  .toFile(path.join(out, "matheus-tonon.jpg"));

console.table(manifest);
console.log("Imagens geradas em", out);
