/**
 * Gera public/models/tooth-volte-a-sorrir.glb — o molar 3D do hero.
 *
 *   npm run model:tooth
 *
 * O dente é descrito por uma função de distância (SDF): coroa com cinco
 * cúspides, sulcos oclusais, colo e duas raízes (mesial e distal) com leve
 * curvatura distal, como um molar inferior estilizado. A superfície é extraída
 * com "surface nets", projetada de volta na SDF para ficar exata, simplificada
 * com meshoptimizer e exportada com quantização + compressão meshopt.
 *
 * As normais vêm do gradiente da SDF (sem facetado), e as cores por vértice
 * guardam a variação de tom: esmalte branco na coroa, marfim nas raízes,
 * transição suave na junção amelocementária e sombreamento leve nos sulcos.
 *
 * Unidades: o dente tem ~2,4 de altura, coroa para cima (+Y), mesial em -X,
 * vestibular em +Z.
 */
import { Document, NodeIO } from "@gltf-transform/core";
import { EXTMeshoptCompression, KHRMeshQuantization } from "@gltf-transform/extensions";
import { meshopt, quantize } from "@gltf-transform/functions";
import { MeshoptEncoder, MeshoptSimplifier } from "meshoptimizer";
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = resolve(dirname(fileURLToPath(import.meta.url)), "../public/models/tooth-volte-a-sorrir.glb");
const STEP = Number(process.env.TOOTH_STEP ?? 0.0075); // resolução da grade
const TARGET_TRIANGLES = 64_000;

// ---------------------------------------------------------------- utilidades
const clamp = (x, a, b) => Math.min(Math.max(x, a), b);
const mix = (a, b, t) => a + (b - a) * t;
const smoothstep = (a, b, x) => {
  const t = clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};
/** União suave (polinomial). */
const smin = (a, b, k) => {
  const h = Math.max(k - Math.abs(a - b), 0) / k;
  return Math.min(a, b) - h * h * k * 0.25;
};
/** Subtração suave: remove b de a. */
const ssub = (a, b, k) => -smin(-a, b, k);

function sdEllipsoid(x, y, z, rx, ry, rz) {
  const k0 = Math.hypot(x / rx, y / ry, z / rz);
  const k1 = Math.hypot(x / (rx * rx), y / (ry * ry), z / (rz * rz));
  return k1 === 0 ? -Math.min(rx, ry, rz) : (k0 * (k0 - 1)) / k1;
}

function sdCapsule(x, y, z, ax, ay, az, bx, by, bz, r) {
  const pax = x - ax, pay = y - ay, paz = z - az;
  const bax = bx - ax, bay = by - ay, baz = bz - az;
  const h = clamp((pax * bax + pay * bay + paz * baz) / (bax * bax + bay * bay + baz * baz), 0, 1);
  return Math.hypot(pax - bax * h, pay - bay * h, paz - baz * h) - r;
}

// ---------------------------------------------------------------- anatomia
const CEJ_Y = 0.12; // junção amelocementária (onde o esmalte termina)

/** Spline Catmull-Rom em pontos [y, valor] (C1: sem trechos retos). */
function profile(points, y) {
  const n = points.length;
  if (y <= points[0][0]) return points[0][1];
  if (y >= points[n - 1][0]) return points[n - 1][1];
  let i = 0;
  while (y > points[i + 1][0]) i++;
  const p0 = points[Math.max(i - 1, 0)][1];
  const p1 = points[i][1];
  const p2 = points[i + 1][1];
  const p3 = points[Math.min(i + 2, n - 1)][1];
  const t = (y - points[i][0]) / (points[i + 1][0] - points[i][0]);
  return 0.5 * (2 * p1 + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t * t + (-p0 + 3 * p1 - 3 * p2 + p3) * t * t * t);
}

// Meia-largura mésio-distal (x) e vestíbulo-lingual (z) do corpo do dente ao
// longo da altura: tronco radicular → colo (junção amelocementária) → altura
// do contorno → mesa oclusal. Perfil contínuo, sem emenda entre coroa e raiz.
const WIDTH_X = [[-0.36, 0.41], [-0.15, 0.42], [0.12, 0.45], [0.33, 0.52], [0.55, 0.565], [0.8, 0.54]];
const WIDTH_Z = [[-0.36, 0.375], [-0.15, 0.385], [0.12, 0.405], [0.3, 0.47], [0.48, 0.5], [0.8, 0.46]];
const BODY_TOP = 0.9;
const BODY_BOTTOM = -0.36;

function body(x, y, z) {
  // Topo em cúpula: a seção encolhe como uma elipse nos últimos 0,24.
  const s = clamp((y - (BODY_TOP - 0.24)) / 0.24, 0, 1);
  // Base também arredondada, para o corpo se fundir às raízes.
  const b = clamp((BODY_BOTTOM + 0.32 - y) / 0.32, 0, 1);
  const dome = Math.sqrt(Math.max(1 - s * s, 1e-4)) * Math.sqrt(Math.max(1 - b * b, 1e-4));
  const a = profile(WIDTH_X, y) * dome;
  const c = profile(WIDTH_Z, y) * dome;
  const n = 2.6; // seção de quadrado arredondado
  const r = Math.pow(Math.pow(Math.abs(x) / a, n) + Math.pow(Math.abs(z) / c, n), 1 / n);
  let d = (r - 1) * Math.min(a, c) * 0.85;
  d = Math.max(d, y - BODY_TOP, (BODY_BOTTOM - y) * 0.5);
  return d;
}

function crown(x, y, z) {
  let d = body(x, y, z);

  // Cúspides: linguais (z-) mais altas e pontudas, vestibulares (z+) mais baixas.
  const cusps = [
    [-0.29, 0.85, -0.23, 0.25, 0.22, 0.24], // mesiolingual
    [0.27, 0.84, -0.23, 0.24, 0.21, 0.24], // distolingual
    [-0.31, 0.81, 0.25, 0.26, 0.18, 0.25], // mesiovestibular
    [0.13, 0.8, 0.27, 0.22, 0.17, 0.23], // distovestibular
    [0.43, 0.76, 0.12, 0.15, 0.13, 0.17], // distal
  ];
  for (const [cx, cy, cz, rx, ry, rz] of cusps) {
    d = smin(d, sdEllipsoid(x - cx, y - cy, z - cz, rx, ry, rz), 0.14);
  }

  // Sulcos: central (mésio-distal), vestibular e lingual. Rasos e suaves.
  const grooves = [
    sdCapsule(x, y, z, -0.42, 0.99, 0.0, 0.44, 0.98, 0.0, 0.045),
    sdCapsule(x, y, z, -0.06, 0.98, 0.0, -0.08, 0.82, 0.6, 0.035),
    sdCapsule(x, y, z, 0.31, 0.97, 0.02, 0.36, 0.8, 0.5, 0.03),
    sdCapsule(x, y, z, -0.02, 0.99, 0.0, 0.0, 0.86, -0.6, 0.035),
  ];
  for (const g of grooves) d = ssub(d, g, 0.07);

  // Fossa central: concavidade leve no meio da face oclusal.
  d = ssub(d, sdEllipsoid(x - 0.02, y - 1.08, z, 0.34, 0.14, 0.2), 0.1);
  return d;
}

function root(x, y, z, cx, top, length, rTop, splay, bend) {
  // Eixo da raiz: abre para fora (splay) e curva levemente para distal (+X)
  // em direção ao ápice.
  const t = clamp((top - y) / length, 0, 1);
  const offset = (k) => splay * k + bend * k * k;
  const bx = x - cx - offset(t);
  // Seção elíptica: estreita no sentido mésio-distal (x), larga no
  // vestíbulo-lingual (z), afinando mais devagar em z — ápice arredondado.
  const rx = rTop * (1 - 0.64 * Math.pow(t, 1.8));
  const rz = rTop * 1.75 * (1 - 0.62 * Math.pow(t, 1.6));
  const side = (Math.hypot(bx / rx, z / rz) - 1) * Math.min(rx, rz);
  const apexY = top - length;
  const apexR = rTop * 0.36;
  const apex = Math.hypot((x - cx - offset(1)) / apexR, (y - apexY) / apexR, z / (apexR * (rz / rx))) - 1;
  if (y < apexY) return apex * apexR;
  // Topo fechado e arredondado, bem dentro do corpo do dente.
  return -smin(-side, top - y, 0.1);
}

function tooth(x, y, z) {
  const mesial = root(x, y, z, -0.215, -0.02, 1.26, 0.225, -0.15, 0.1);
  const distal = root(x, y, z, 0.215, -0.02, 1.14, 0.21, 0.1, 0.05);
  const roots = smin(mesial, distal, 0.04);
  // Raízes fundidas ao corpo com raio grande: a bifurcação fica arredondada.
  let d = smin(crown(x, y, z), roots, 0.07);
  // Colo: constrição muito leve logo abaixo da junção amelocementária.
  d += 0.004 * Math.exp(-((y - (CEJ_Y - 0.03)) ** 2) / 0.012);
  return d;
}

// ---------------------------------------------------------------- malha
const BOUNDS = { min: [-0.85, -1.45, -0.75], max: [0.85, 1.2, 0.75] };

function gradient(x, y, z) {
  const e = 0.0015;
  // Tetraedro: 4 avaliações.
  const a = tooth(x + e, y - e, z - e);
  const b = tooth(x - e, y - e, z + e);
  const c = tooth(x - e, y + e, z - e);
  const d = tooth(x + e, y + e, z + e);
  const gx = a - b - c + d;
  const gy = -a - b + c + d;
  const gz = -a + b - c + d;
  const l = Math.hypot(gx, gy, gz) || 1;
  return [gx / l, gy / l, gz / l];
}

function surfaceNets() {
  const [x0, y0, z0] = BOUNDS.min;
  const nx = Math.ceil((BOUNDS.max[0] - x0) / STEP) + 1;
  const ny = Math.ceil((BOUNDS.max[1] - y0) / STEP) + 1;
  const nz = Math.ceil((BOUNDS.max[2] - z0) / STEP) + 1;
  const idx = (i, j, k) => i + nx * (j + ny * k);

  console.time("amostragem");
  const field = new Float32Array(nx * ny * nz);
  for (let k = 0; k < nz; k++)
    for (let j = 0; j < ny; j++)
      for (let i = 0; i < nx; i++) field[idx(i, j, k)] = tooth(x0 + i * STEP, y0 + j * STEP, z0 + k * STEP);
  console.timeEnd("amostragem");

  const cellVertex = new Int32Array(nx * ny * nz).fill(-1);
  const positions = [];
  const corners = [
    [0, 0, 0], [1, 0, 0], [0, 1, 0], [1, 1, 0],
    [0, 0, 1], [1, 0, 1], [0, 1, 1], [1, 1, 1],
  ];
  const edges = [
    [0, 1], [2, 3], [4, 5], [6, 7],
    [0, 2], [1, 3], [4, 6], [5, 7],
    [0, 4], [1, 5], [2, 6], [3, 7],
  ];

  for (let k = 0; k < nz - 1; k++)
    for (let j = 0; j < ny - 1; j++)
      for (let i = 0; i < nx - 1; i++) {
        const v = corners.map(([a, b, c]) => field[idx(i + a, j + b, k + c)]);
        let inside = 0;
        for (const s of v) if (s < 0) inside++;
        if (inside === 0 || inside === 8) continue;
        let sx = 0, sy = 0, sz = 0, n = 0;
        for (const [a, b] of edges) {
          if (v[a] < 0 === v[b] < 0) continue;
          const t = v[a] / (v[a] - v[b]);
          sx += corners[a][0] + (corners[b][0] - corners[a][0]) * t;
          sy += corners[a][1] + (corners[b][1] - corners[a][1]) * t;
          sz += corners[a][2] + (corners[b][2] - corners[a][2]) * t;
          n++;
        }
        cellVertex[idx(i, j, k)] = positions.length / 3;
        positions.push(x0 + (i + sx / n) * STEP, y0 + (j + sy / n) * STEP, z0 + (k + sz / n) * STEP);
      }

  // Um quad para cada aresta da grade que cruza a superfície.
  const indices = [];
  const quad = (a, b, c, d, flip) => {
    if (a < 0 || b < 0 || c < 0 || d < 0) return;
    if (flip) indices.push(a, c, b, a, d, c);
    else indices.push(a, b, c, a, c, d);
  };
  for (let k = 1; k < nz - 1; k++)
    for (let j = 1; j < ny - 1; j++)
      for (let i = 1; i < nx - 1; i++) {
        const s = field[idx(i, j, k)] < 0;
        if (s !== field[idx(i + 1, j, k)] < 0)
          quad(cellVertex[idx(i, j - 1, k - 1)], cellVertex[idx(i, j, k - 1)], cellVertex[idx(i, j, k)], cellVertex[idx(i, j - 1, k)], !s);
        if (s !== field[idx(i, j + 1, k)] < 0)
          quad(cellVertex[idx(i - 1, j, k - 1)], cellVertex[idx(i - 1, j, k)], cellVertex[idx(i, j, k)], cellVertex[idx(i, j, k - 1)], !s);
        if (s !== field[idx(i, j, k + 1)] < 0)
          quad(cellVertex[idx(i - 1, j - 1, k)], cellVertex[idx(i, j - 1, k)], cellVertex[idx(i, j, k)], cellVertex[idx(i - 1, j, k)], !s);
      }
  return { positions: new Float32Array(positions), indices: new Uint32Array(indices) };
}

function project(positions) {
  for (let v = 0; v < positions.length; v += 3) {
    let x = positions[v], y = positions[v + 1], z = positions[v + 2];
    for (let it = 0; it < 4; it++) {
      const d = tooth(x, y, z);
      if (Math.abs(d) < 1e-6) break;
      const [gx, gy, gz] = gradient(x, y, z);
      x -= gx * d;
      y -= gy * d;
      z -= gz * d;
    }
    positions[v] = x;
    positions[v + 1] = y;
    positions[v + 2] = z;
  }
}

/** Oclusão ambiente aproximada pela SDF: escurece sulcos e a bifurcação. */
function occlusion(x, y, z, nx, ny, nz) {
  let occ = 0;
  let w = 1;
  for (let i = 1; i <= 5; i++) {
    const h = 0.025 * i;
    occ += w * (h - tooth(x + nx * h, y + ny * h, z + nz * h));
    w *= 0.6;
  }
  return clamp(1 - 2.6 * occ, 0, 1);
}

function shade(x, y, z, nx, ny, nz) {
  // Junção amelocementária ondulada (mais alta nas faces proximais).
  const cej = CEJ_Y + 0.05 * Math.cos(Math.atan2(z, x) * 2);
  const enamel = smoothstep(cej - 0.14, cej + 0.12, y);
  // Esmalte: branco natural, levemente mais translúcido/frio nas cúspides.
  const tip = smoothstep(0.75, 1.05, y);
  const enamelRGB = [mix(0.97, 0.975, tip), mix(0.965, 0.975, tip), mix(0.95, 0.975, tip)];
  // Raiz: marfim, um pouco mais quente perto do ápice.
  const apex = smoothstep(-0.2, -1.2, y);
  const rootRGB = [mix(0.95, 0.93, apex), mix(0.925, 0.885, apex), mix(0.86, 0.79, apex)];
  const ao = mix(0.55, 1, occlusion(x, y, z, nx, ny, nz));
  return [0, 1, 2].map((c) => clamp(mix(rootRGB[c], enamelRGB[c], enamel) * ao, 0, 1));
}

// ---------------------------------------------------------------- execução
console.time("total");
const raw = surfaceNets();
console.log(`surface nets: ${raw.positions.length / 3} vértices, ${raw.indices.length / 3} triângulos`);
project(raw.positions);

await MeshoptSimplifier.ready;
const [simplified, error] = MeshoptSimplifier.simplify(
  raw.indices,
  raw.positions,
  3,
  TARGET_TRIANGLES * 3,
  0.002,
  [],
);
// Compacta: só os vértices usados.
const remap = new Int32Array(raw.positions.length / 3).fill(-1);
const pos = [];
const ind = new Uint32Array(simplified.length);
for (let i = 0; i < simplified.length; i++) {
  const old = simplified[i];
  if (remap[old] < 0) {
    remap[old] = pos.length / 3;
    pos.push(raw.positions[old * 3], raw.positions[old * 3 + 1], raw.positions[old * 3 + 2]);
  }
  ind[i] = remap[old];
}
const positions = new Float32Array(pos);
project(positions);
console.log(`simplificado: ${positions.length / 3} vértices, ${ind.length / 3} triângulos (erro ${error.toFixed(5)})`);

// Centraliza na altura (o dente gira em torno do próprio centro).
let minY = Infinity, maxY = -Infinity;
for (let v = 1; v < positions.length; v += 3) {
  minY = Math.min(minY, positions[v]);
  maxY = Math.max(maxY, positions[v]);
}
const offsetY = (minY + maxY) / 2;

const normals = new Float32Array(positions.length);
const colors = new Float32Array(positions.length);
for (let v = 0; v < positions.length; v += 3) {
  const [x, y, z] = [positions[v], positions[v + 1], positions[v + 2]];
  const n = gradient(x, y, z);
  normals.set(n, v);
  colors.set(shade(x, y, z, ...n), v);
  positions[v + 1] = y - offsetY;
}

const doc = new Document();
const buffer = doc.createBuffer();
const prim = doc
  .createPrimitive()
  .setAttribute("POSITION", doc.createAccessor().setType("VEC3").setArray(positions).setBuffer(buffer))
  .setAttribute("NORMAL", doc.createAccessor().setType("VEC3").setArray(normals).setBuffer(buffer))
  .setAttribute("COLOR_0", doc.createAccessor().setType("VEC3").setArray(colors).setBuffer(buffer))
  .setIndices(doc.createAccessor().setType("SCALAR").setArray(ind).setBuffer(buffer))
  .setMaterial(
    doc
      .createMaterial("Esmalte")
      .setBaseColorFactor([1, 1, 1, 1])
      .setRoughnessFactor(0.32)
      .setMetallicFactor(0),
  );
const mesh = doc.createMesh("Dente").addPrimitive(prim);
doc.createScene("Cena").addChild(doc.createNode("Dente").setMesh(mesh));
doc.getRoot().getAsset().generator = "Volte a Sorrir — scripts/generate-tooth.mjs";

await MeshoptEncoder.ready;
doc.createExtension(KHRMeshQuantization).setRequired(true);
await doc.transform(
  quantize({ quantizePosition: 14, quantizeNormal: 16, quantizeColor: 8 }),
  meshopt({ encoder: MeshoptEncoder, level: "high" }),
);

mkdirSync(dirname(OUT), { recursive: true });
const io = new NodeIO().registerExtensions([EXTMeshoptCompression, KHRMeshQuantization]).registerDependencies({
  "meshopt.encoder": MeshoptEncoder,
});
await io.write(OUT, doc);
const { statSync } = await import("node:fs");
console.log(`gravado ${OUT} (${(statSync(OUT).size / 1024).toFixed(0)} KB)`);
console.timeEnd("total");
