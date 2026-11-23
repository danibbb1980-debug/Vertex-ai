/**
 * Curvas de nível: cada curva tem dois estados com o mesmo número de pontos.
 * "agitado" = irregular e apertado; "calmo" = suave e regularmente espaçado.
 */
export type Pt = [number, number];

const N = 56;

// pseudo-aleatório determinístico (mesmo desenho em todo carregamento)
function rand(seed: number) {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

export type FieldOpts = {
  count: number;
  cx: number;
  cy: number;
  r0: number;
  gap: number;
  /** achatamento vertical/horizontal */
  sx?: number;
  sy?: number;
};

export function buildField(o: FieldOpts): { calm: Pt[][]; wild: Pt[][] } {
  const sx = o.sx ?? 1;
  const sy = o.sy ?? 1.08;
  const calm: Pt[][] = [];
  const wild: Pt[][] = [];
  for (let i = 0; i < o.count; i++) {
    const t = i / Math.max(1, o.count - 1);
    const R = o.r0 + i * o.gap;
    // o "cume" fica levemente acima e à esquerda: anéis internos deslocados
    const ox = o.cx - (1 - t) * o.gap * 1.1;
    const oy = o.cy - (1 - t) * o.gap * 1.4;
    const p1 = rand(i + 1) * Math.PI * 2;
    const p2 = rand(i + 11) * Math.PI * 2;
    const p3 = rand(i + 23) * Math.PI * 2;
    const squeeze = 0.62 + 0.38 * Math.pow(t, 0.7) + (rand(i + 37) - 0.5) * 0.12;
    const c: Pt[] = [];
    const w: Pt[] = [];
    for (let k = 0; k < N; k++) {
      const a = (k / N) * Math.PI * 2;
      const soft = 1 + 0.055 * Math.sin(2 * a + 0.6) + 0.03 * Math.sin(3 * a + 1.9);
      const rc = R * soft;
      c.push([ox + Math.cos(a) * rc * sx, oy + Math.sin(a) * rc * sy]);
      const rough =
        1 +
        0.11 * Math.sin(5 * a + p1) +
        0.07 * Math.sin(8 * a + p2) +
        0.045 * Math.sin(13 * a + p3) +
        0.06 * Math.sin(2 * a + 0.6);
      const rw = R * squeeze * rough;
      w.push([o.cx + Math.cos(a) * rw * sx, o.cy + Math.sin(a) * rw * sy]);
    }
    calm.push(c);
    wild.push(w);
  }
  return { calm, wild };
}

export function lerpPts(a: Pt[], b: Pt[], t: number): Pt[] {
  const out: Pt[] = new Array(a.length);
  for (let i = 0; i < a.length; i++) out[i] = [a[i][0] + (b[i][0] - a[i][0]) * t, a[i][1] + (b[i][1] - a[i][1]) * t];
  return out;
}

/** Catmull-Rom fechado convertido em Bézier cúbica. */
export function toPath(p: Pt[]): string {
  const n = p.length;
  const f = (v: number) => Math.round(v * 10) / 10;
  let d = `M${f(p[0][0])} ${f(p[0][1])}`;
  for (let i = 0; i < n; i++) {
    const p0 = p[(i - 1 + n) % n];
    const p1 = p[i];
    const p2 = p[(i + 1) % n];
    const p3 = p[(i + 2) % n];
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += `C${f(c1x)} ${f(c1y)} ${f(c2x)} ${f(c2y)} ${f(p2[0])} ${f(p2[1])}`;
  }
  return d + "Z";
}

/** easing lento: começa firme, termina muito devagar */
export const easeOutQuint = (t: number) => 1 - Math.pow(1 - t, 5);
export const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
