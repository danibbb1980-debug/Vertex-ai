/**
 * Geometria da hélice redesenhada a partir do logo: duas fitas que se enrolam.
 * Cada fita é desenhada pelas suas duas bordas; numa fita helicoidal vista de lado,
 * cada borda é uma senoide com pequena defasagem (±delta) em relação ao eixo da fita,
 * o que faz a fita "torcer" (estreitar e alargar) como no símbolo original.
 */

type Pt = [number, number]

const r = (n: number) => Math.round(n * 100) / 100

/** Catmull-Rom -> Bézier cúbica: curva suave passando pelos pontos. */
export function suave(pts: Pt[]): string {
  if (pts.length < 2) return ''
  let d = `M${r(pts[0][0])} ${r(pts[0][1])}`
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[i + 2] ?? p2
    const c1: Pt = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6]
    const c2: Pt = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]
    d += `C${r(c1[0])} ${r(c1[1])} ${r(c2[0])} ${r(c2[1])} ${r(p2[0])} ${r(p2[1])}`
  }
  return d
}

export type HeliceOpts = {
  largura: number
  altura: number
  /** número de voltas ao longo da altura */
  voltas: number
  /** amplitude (raio aparente) */
  amp: number
  /** largura aparente máxima da fita; 0 = fita como um fio só */
  fita?: number
  fase?: number
  /** degraus entre as fitas (como no logo) */
  degraus?: number
  passos?: number
}

export type Helice = {
  a: string[]
  b: string[]
  degraus: string[]
}

export function helice(o: HeliceOpts): Helice {
  const { largura, altura, voltas, amp, fita = 0, fase = 0, degraus = 0 } = o
  const passos = o.passos ?? Math.max(24, Math.round(voltas * 28))
  const cx = largura / 2
  const delta = fita > 0 ? Math.atan2(fita / 2, amp) : 0
  const R = fita > 0 ? Math.hypot(amp, fita / 2) : amp
  const th = (y: number) => (y / altura) * voltas * Math.PI * 2 + fase

  const curva = (desloc: number) => {
    const pts: Pt[] = []
    for (let i = 0; i <= passos; i++) {
      const y = (i / passos) * altura
      pts.push([cx + R * Math.sin(th(y) + desloc), y])
    }
    return suave(pts)
  }

  const a = fita > 0 ? [curva(-delta), curva(delta)] : [curva(0)]
  const b = fita > 0 ? [curva(Math.PI - delta), curva(Math.PI + delta)] : [curva(Math.PI)]

  const linhas: string[] = []
  if (degraus > 0) {
    const n = Math.round(voltas * degraus)
    for (let i = 1; i < n; i++) {
      const y = (i / n) * altura
      const s = Math.sin(th(y))
      if (Math.abs(s) < 0.45) continue // perto do cruzamento, sem degrau
      const xa = cx + amp * s
      const xb = cx - amp * s
      const ini = Math.min(xa, xb) + fita * 0.55
      const fim = Math.max(xa, xb) - fita * 0.55
      if (fim - ini < 8) continue
      // leve curva, como os degraus do símbolo
      const meio = (ini + fim) / 2
      const curv = (fim - ini) * 0.08 * (s > 0 ? 1 : -1)
      linhas.push(`M${r(ini)} ${r(y)}Q${r(meio)} ${r(y + curv)} ${r(fim)} ${r(y)}`)
    }
  }
  return { a, b, degraus: linhas }
}
