/**
 * Gera as curvas de contorno (como curvas de nível) com semente fixa:
 * o desenho é sempre o mesmo a cada carregamento.
 * São anéis fechados, levemente deslocados como num terreno, que lembram uma silhueta,
 * mais três arcos abertos no alto que lembram o traço de uma sobrancelha.
 */

function mulberry32(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

type P = [number, number]
const f = (n: number) => Math.round(n * 10) / 10

/** Catmull-Rom -> Bézier cúbica. Poucos nós por curva. */
function caminho(pts: P[], fechado: boolean) {
  const n = pts.length
  const get = (i: number) => (fechado ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))])
  let d = `M${f(pts[0][0])} ${f(pts[0][1])}`
  const segs = fechado ? n : n - 1
  for (let i = 0; i < segs; i++) {
    const p0 = get(i - 1), p1 = get(i), p2 = get(i + 1), p3 = get(i + 2)
    const t = 0.18
    const c1: P = [p1[0] + (p2[0] - p0[0]) * t, p1[1] + (p2[1] - p0[1]) * t]
    const c2: P = [p2[0] - (p3[0] - p1[0]) * t, p2[1] - (p3[1] - p1[1]) * t]
    d += `C${f(c1[0])} ${f(c1[1])} ${f(c2[0])} ${f(c2[1])} ${f(p2[0])} ${f(p2[1])}`
  }
  return fechado ? d + 'Z' : d
}

export const VIEWBOX = { w: 1000, h: 1500 }

function gerar(seed = 20) {
  const rnd = mulberry32(seed)
  const harm = [2, 3, 5].map((h) => ({ h, amp: 0.035 + rnd() * 0.05, fase: rnd() * Math.PI * 2 }))
  const aneis: string[] = []
  const N = 14
  const K = 11
  for (let i = 0; i < N; i++) {
    const k = i / (N - 1)
    // centro que "escorrega" como num terreno inclinado
    const cx = 520 - k * 70 + Math.sin(i * 0.7) * 8
    const cy = 760 + k * 110
    const rx = 64 + i * 28 + k * k * 50
    const ry = rx * (1.55 - k * 0.25)
    const pts: P[] = []
    for (let j = 0; j < K; j++) {
      const th = (j / K) * Math.PI * 2 + i * 0.045
      let r = 1
      for (const { h, amp, fase } of harm) r += amp * (0.6 + k) * Math.sin(h * th + fase + i * 0.12)
      // ombro: alarga a parte de baixo, como uma silhueta
      const ombro = 1 + 0.22 * Math.max(0, Math.sin(th)) ** 3 * k
      pts.push([cx + Math.cos(th) * rx * r * ombro, cy + Math.sin(th) * ry * r])
    }
    aneis.push(caminho(pts, true))
  }
  // arcos abertos: o "traço" da sobrancelha, acima e à esquerda do contorno
  const arcos: string[] = []
  for (let a = 0; a < 3; a++) {
    const y0 = 92 + a * 22
    const pts: P[] = [
      [150 + a * 14, y0 + 70],
      [260 + a * 6, y0 + 8],
      [400, y0 - 22 + a * 4],
      [520 - a * 10, y0 + 4],
      [585 - a * 18, y0 + 46 + a * 6],
    ]
    arcos.push(caminho(pts, false))
  }
  return [...arcos, ...aneis]
}

export const CONTORNOS = gerar()
