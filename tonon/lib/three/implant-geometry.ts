import * as THREE from "three";
import { smoothstep, valueNoise3 } from "./noise";

/**
 * Pilar protético e implante, gerados proceduralmente na mesma escala da
 * coroa (largura mesiodistal da coroa ≈ 1,0; margem cervical em y = 0).
 *
 *   y  0,30 → 0,00   munhão do pilar (fica dentro da coroa)
 *   y  0,00 → -0,30  cinta do pilar, polida, com perfil de emergência
 *   y -0,30 → -0,50  plataforma/pescoço do implante, com microrroscas
 *   y -0,46 → -1,95  corpo do implante, rosca helicoidal e ápice com canais de corte
 */

const v = (r: number, y: number) => new THREE.Vector2(r, y);

/** Perfil (raio, altura) de baixo para cima, para LatheGeometry. */
const ABUTMENT_PROFILE: THREE.Vector2[] = [
  v(0.0, -0.3),
  v(0.262, -0.3),
  v(0.281, -0.296),
  v(0.29, -0.286),
  v(0.291, -0.266),
  v(0.284, -0.254),
  v(0.266, -0.24),
  v(0.257, -0.222),
  v(0.255, -0.19),
  v(0.259, -0.15),
  // Anel de referência usinado.
  v(0.262, -0.128),
  v(0.255, -0.12),
  v(0.255, -0.112),
  v(0.266, -0.104),
  v(0.28, -0.07),
  v(0.297, -0.038),
  v(0.308, -0.016),
  v(0.311, -0.007),
  v(0.306, 0.0),
  // Ombro onde a coroa assenta.
  v(0.286, 0.004),
  v(0.236, 0.008),
  v(0.224, 0.016),
  // Munhão cônico.
  v(0.216, 0.05),
  v(0.2, 0.17),
  v(0.186, 0.268),
  v(0.179, 0.284),
  v(0.168, 0.295),
  v(0.15, 0.3),
  // Acesso do parafuso.
  v(0.07, 0.3),
  v(0.062, 0.296),
  v(0.06, 0.232),
  v(0.0, 0.23),
];

function neckProfile(): THREE.Vector2[] {
  const pts: THREE.Vector2[] = [v(0.0, -0.52), v(0.2, -0.52), v(0.232, -0.5), v(0.256, -0.478), v(0.27, -0.452)];
  // Microrroscas: quatro anéis rasos no pescoço do implante.
  const top = -0.338;
  const bottom = -0.442;
  const steps = 48;
  for (let i = 0; i <= steps; i++) {
    const y = bottom + ((top - bottom) * i) / steps;
    const phase = ((y - bottom) / (top - bottom)) * 4;
    const r = 0.274 - 0.0075 * (0.5 - 0.5 * Math.cos(phase * Math.PI * 2));
    pts.push(v(r, y));
  }
  pts.push(v(0.278, -0.326), v(0.283, -0.314), v(0.284, -0.306), v(0.278, -0.301), v(0.25, -0.3), v(0.0, -0.3));
  return pts;
}

export function createAbutmentGeometry(segments = 128): THREE.BufferGeometry {
  const g = new THREE.LatheGeometry(ABUTMENT_PROFILE, segments);
  g.computeVertexNormals();
  return g;
}

export function createNeckGeometry(segments = 128): THREE.BufferGeometry {
  const g = new THREE.LatheGeometry(neckProfile(), segments);
  g.computeVertexNormals();
  return g;
}

/**
 * Corpo rosqueado: superfície paramétrica em (θ, y). O raio combina um
 * núcleo levemente cônico com o perfil de rosca (crista e raiz
 * arredondadas) deslocado ao longo de uma hélice de passo constante.
 */
export function createThreadedBodyGeometry({
  radialSegments = 160,
  heightSegments = 460,
}: { radialSegments?: number; heightSegments?: number } = {}): THREE.BufferGeometry {
  const yTop = -0.46;
  const yApex = -1.95;
  const pitch = 0.118;
  const threadDepth = 0.062;
  const fluteStart = -1.42;

  const radiusAt = (theta: number, y: number) => {
    const t = (yTop - y) / (yTop - yApex); // 0 no topo, 1 no ápice
    let core = THREE.MathUtils.lerp(0.222, 0.178, t);

    // Ápice arredondado.
    const apexZone = -1.7;
    if (y < apexZone) {
      const k = (apexZone - y) / (apexZone - yApex);
      core *= Math.sqrt(Math.max(0, 1 - k * k * 0.92));
    }

    // Perfil da rosca: "V" com crista e raiz suavizadas.
    const turns = theta / (Math.PI * 2) + (yTop - y) / pitch;
    const f = turns - Math.floor(turns);
    const vee = 1 - Math.abs(2 * f - 1);
    // Crista larga e raiz estreita: lê como rosca usinada, não como mola.
    const thread = smoothstep(0.12, 0.62, vee);
    const depth =
      threadDepth * smoothstep(yTop - 0.005, yTop - 0.09, y) * (1 - smoothstep(-1.62, yApex + 0.06, y));
    let r = core + depth * thread;

    // Três canais de corte helicoidais perto do ápice.
    if (y < fluteStart) {
      const w = smoothstep(fluteStart, fluteStart - 0.18, y);
      const twist = (fluteStart - y) * 1.1;
      let best = Math.PI;
      for (let k = 0; k < 3; k++) {
        const c = (k * Math.PI * 2) / 3 + twist;
        let d = Math.abs(((theta - c) % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
        d = Math.min(d, Math.PI * 2 - d);
        best = Math.min(best, d);
      }
      r -= 0.085 * w * Math.exp(-(best * best) / (2 * 0.22 * 0.22));
    }

    // Textura de usinagem: microestrias muito sutis.
    r += 0.0012 * valueNoise3(Math.cos(theta) * 6, y * 160, Math.sin(theta) * 6);
    return Math.max(0, r);
  };

  const positions: number[] = [];
  const uvs: number[] = [];

  for (let i = 0; i <= heightSegments; i++) {
    const y = THREE.MathUtils.lerp(yTop, yApex, i / heightSegments);
    for (let j = 0; j < radialSegments; j++) {
      const theta = (j / radialSegments) * Math.PI * 2;
      const r = i === heightSegments ? 0 : radiusAt(theta, y);
      positions.push(Math.cos(theta) * r, y, Math.sin(theta) * r);
      uvs.push(j / radialSegments, i / heightSegments);
    }
  }

  const indices: number[] = [];
  const idx = (i: number, j: number) => i * radialSegments + (j % radialSegments);
  for (let i = 0; i < heightSegments; i++) {
    for (let j = 0; j < radialSegments; j++) {
      const a = idx(i, j);
      const b = idx(i, j + 1);
      const c = idx(i + 1, j);
      const d = idx(i + 1, j + 1);
      indices.push(a, c, d, a, d, b);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();
  return geometry;
}
