import * as THREE from "three";
import { clamp, fbm3, smoothstep } from "./noise";

/**
 * Coroa cerâmica de um molar, gerada proceduralmente.
 *
 * A forma é uma superfície fechada descrita por um perfil (do centro da
 * cavidade interna, passando pela margem cervical e pela parede externa,
 * até o centro da face oclusal) varrido ao redor de uma planta superelíptica
 * — mais larga no sentido mesiodistal (x) do que no vestibulolingual (z).
 * Sobre a face oclusal são esculpidas quatro cúspides de alturas diferentes,
 * fossa central, sulcos principais, fossetas e cristas marginais. Um ruído
 * fractal de baixa amplitude evita a aparência de plástico.
 *
 * Unidades: largura mesiodistal ≈ 1,0; margem cervical em y = 0; topo das
 * cúspides em y ≈ 0,8. A face vestibular aponta para +z.
 */

type ProfilePoint = [rho: number, height: number, occlusalWeight: number];

/** Perfil de dentro para fora: cavidade interna → margem → parede → face oclusal. */
const PROFILE: ProfilePoint[] = [
  [0.0, 0.34, 0],
  [0.22, 0.335, 0],
  [0.38, 0.29, 0],
  [0.45, 0.17, 0],
  [0.49, 0.05, 0],
  [0.53, 0.008, 0],
  [0.6, 0.0, 0],
  [0.645, 0.012, 0],
  [0.74, 0.07, 0],
  [0.9, 0.17, 0],
  [0.985, 0.29, 0],
  [1.0, 0.38, 0.04],
  [0.975, 0.47, 0.16],
  [0.93, 0.545, 0.42],
  [0.86, 0.6, 0.75],
  [0.76, 0.63, 1],
  [0.62, 0.635, 1],
  [0.44, 0.61, 1],
  [0.26, 0.575, 1],
  [0.11, 0.56, 1],
  [0.0, 0.555, 1],
];

/** Semi-eixos da planta (x = mesiodistal, z = vestibulolingual). */
const HALF_X = 0.52;
const HALF_Z = 0.47;
const SUPER_N = 2.7;

function footprintRadius(theta: number): number {
  const c = Math.abs(Math.cos(theta)) / HALF_X;
  const s = Math.abs(Math.sin(theta)) / HALF_Z;
  let r = Math.pow(Math.pow(c, SUPER_N) + Math.pow(s, SUPER_N), -1 / SUPER_N);
  // Face vestibular um pouco mais convexa que a lingual.
  r *= 1 + 0.035 * Math.max(0, Math.sin(theta));
  return r;
}

type Cusp = { x: number; z: number; h: number; sx: number; sz: number };

/** Mesiovestibular, distovestibular, mesiolingual, distolingual. */
const CUSPS: Cusp[] = [
  { x: 0.205, z: 0.205, h: 0.2, sx: 0.135, sz: 0.125 },
  { x: -0.215, z: 0.195, h: 0.175, sx: 0.13, sz: 0.12 },
  { x: 0.2, z: -0.195, h: 0.225, sx: 0.145, sz: 0.13 },
  { x: -0.22, z: -0.18, h: 0.15, sx: 0.125, sz: 0.12 },
];

const gauss = (d2: number) => Math.exp(-d2 / 2);

/** Relevo oclusal: retorna a altura adicional e a profundidade de sulco (para a cor). */
function occlusalRelief(x: number, z: number, rho: number): { lift: number; groove: number; cusp: number } {
  let cusp = 0;
  let ridges = 0;
  for (const c of CUSPS) {
    const d2 = ((x - c.x) / c.sx) ** 2 + ((z - c.z) / c.sz) ** 2;
    // Expoente pouco abaixo de 1: ponta definida, mas arredondada como esmalte.
    cusp += c.h * Math.exp(-Math.pow(d2 / 2, 0.93));

    // Crista triangular: desce da ponta da cúspide em direção à fossa central.
    const len = Math.hypot(c.x, c.z);
    const ux = -c.x / len;
    const uz = -c.z / len;
    const px = x - c.x;
    const pz = z - c.z;
    const along = px * ux + pz * uz;
    const across = px * uz - pz * ux;
    if (along > 0 && along < len) {
      const fadeIn = smoothstep(0.02, 0.09, along);
      ridges += 0.026 * fadeIn * (1 - along / len) * gauss((across / 0.038) ** 2);
    }
  }

  // Cristas marginais mesial e distal ligando as cúspides.
  const marginal = 0.05 * gauss(((Math.abs(x) - 0.36) / 0.04) ** 2) * gauss((z / 0.2) ** 2);

  // Os sulcos perdem força ao chegar na borda: não descem pela parede como trincas.
  const edgeFade = 1 - smoothstep(0.7, 0.93, rho);

  // Sulco central mesiodistal, sinuoso, terminando nas fossetas.
  const zc = z - 0.028 * Math.sin(x * 11 + 0.6) - 0.012;
  const central = 0.085 * gauss((zc / 0.019) ** 2) * (1 - smoothstep(0.22, 0.31, Math.abs(x)));

  // Sulcos vestibular e lingual, levemente curvos, separando as cúspides.
  const xb = x + 0.015 - 0.035 * Math.sin(z * 9);
  const buccal = 0.07 * gauss((xb / 0.017) ** 2) * smoothstep(-0.02, 0.06, z) * edgeFade;
  const xl = x - 0.03 + 0.07 * z + 0.02 * Math.sin(z * 13);
  const lingual = 0.065 * gauss((xl / 0.017) ** 2) * smoothstep(0.02, -0.06, z) * edgeFade;

  // Fossa central e fossetas triangulares mesial e distal.
  const fossa = 0.055 * gauss(((x - 0.01) ** 2 + (z - 0.012) ** 2) / 0.06 ** 2);
  const pits =
    0.034 * gauss(((x - 0.285) ** 2 + (z - 0.02) ** 2) / 0.034 ** 2) +
    0.034 * gauss(((x + 0.3) ** 2 + (z + 0.005) ** 2) / 0.034 ** 2);

  // Sulcos suplementares finos, partindo das fossetas.
  const supplemental =
    0.018 * gauss(((z - 0.9 * (x - 0.285)) / 0.012) ** 2) * gauss(((x - 0.285) / 0.07) ** 2) +
    0.018 * gauss(((z + 0.9 * (x - 0.285)) / 0.012) ** 2) * gauss(((x - 0.285) / 0.07) ** 2) +
    0.016 * gauss(((z - 0.9 * (x + 0.3)) / 0.012) ** 2) * gauss(((x + 0.3) / 0.07) ** 2) +
    0.016 * gauss(((z + 0.9 * (x + 0.3)) / 0.012) ** 2) * gauss(((x + 0.3) / 0.07) ** 2);

  const groove = central + buccal + lingual + fossa + pits + supplemental * edgeFade;
  return { lift: cusp + ridges + marginal - groove, groove, cusp };
}

export function createCrownGeometry({
  radialSegments = 192,
  profileSegments = 150,
}: { radialSegments?: number; profileSegments?: number } = {}): THREE.BufferGeometry {
  const curve = new THREE.CatmullRomCurve3(
    PROFILE.map(([r, h, w]) => new THREE.Vector3(r, h, w)),
    false,
    "centripetal",
  );
  const samples = curve.getSpacedPoints(profileSegments);

  const positions: number[] = [];
  const colors: number[] = [];

  const base = new THREE.Color("#f4f1ea");
  const cervical = new THREE.Color("#e6d9c2");
  const stain = new THREE.Color("#a89372");
  const enamel = new THREE.Color("#f3f6f8");
  const inner = new THREE.Color("#ddd6ca");
  const tmp = new THREE.Color();

  const pushVertex = (rho: number, h: number, w: number, theta: number, isInner: boolean) => {
    const R = footprintRadius(theta);
    let z = Math.sin(theta) * R * rho;
    // Planta levemente romboide, como a de um molar superior.
    let x = Math.cos(theta) * R * rho + 0.07 * z;
    let y = h;

    let groove = 0;
    let cuspH = 0;
    if (w > 0) {
      const relief = occlusalRelief(x - 0.07 * z, z, rho);
      y += w * relief.lift;
      groove = w * relief.groove;
      cuspH = w * relief.cusp;
    }

    // Microvariação da superfície (radial nas paredes, vertical na oclusal).
    if (!isInner) {
      const n = fbm3(x * 9, y * 9, z * 9, 4) * 0.004 + fbm3(x * 26, y * 26, z * 26, 2) * 0.0006;
      const k = 1 + n / Math.max(0.2, rho);
      x *= k;
      z *= k;
      y += n * w;
    }

    positions.push(x, y, z);

    // Cor por vértice: cervical mais quente, cúspides mais frias e
    // translúcidas, leve caracterização nos sulcos, interior fosco.
    if (isInner) {
      tmp.copy(inner);
    } else {
      tmp.copy(base);
      tmp.lerp(cervical, (1 - smoothstep(0.02, 0.36, y)) * 0.75);
      tmp.lerp(enamel, clamp(cuspH / 0.2, 0, 1) * smoothstep(0.55, 0.78, y) * 0.65);
      tmp.lerp(stain, clamp(groove / 0.07, 0, 1) * 0.6);
    }
    colors.push(tmp.r, tmp.g, tmp.b);
  };

  // Índice da amostra a partir da qual estamos na superfície externa (margem).
  const marginIndex = samples.findIndex((p) => p.x >= 0.6 - 1e-3);

  // Polo inferior (centro da cavidade interna).
  const first = samples[0];
  pushVertex(0, first.y, 0, 0, true);

  const rings = samples.length - 2;
  for (let i = 1; i <= rings; i++) {
    const p = samples[i];
    const isInner = i < marginIndex;
    for (let j = 0; j < radialSegments; j++) {
      const theta = (j / radialSegments) * Math.PI * 2;
      pushVertex(p.x, p.y, p.z, theta, isInner);
    }
  }

  // Polo superior (centro da face oclusal).
  const last = samples[samples.length - 1];
  pushVertex(0, last.y, last.z, 0, false);

  const indices: number[] = [];
  const ring = (i: number, j: number) => 1 + (i - 1) * radialSegments + (j % radialSegments);
  const topPole = positions.length / 3 - 1;

  for (let j = 0; j < radialSegments; j++) indices.push(0, ring(1, j), ring(1, j + 1));
  for (let i = 1; i < rings; i++) {
    for (let j = 0; j < radialSegments; j++) {
      const a = ring(i, j);
      const b = ring(i, j + 1);
      const c = ring(i + 1, j);
      const d = ring(i + 1, j + 1);
      indices.push(a, d, b, a, c, d);
    }
  }
  for (let j = 0; j < radialSegments; j++) indices.push(ring(rings, j + 1), ring(rings, j), topPole);

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();
  return geometry;
}
