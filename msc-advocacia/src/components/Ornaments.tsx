import type { ReactNode } from "react";
import { m, useScroll, useTransform, type MotionValue } from "motion/react";
import { EXPO_OUT, useReducedMotion } from "./ui";

/**
 * Linhas de relevo: curvas de nível em forma de dois picos, na mesma
 * geometria do "M" do logo, mas sem reproduzi-lo. Cada linha se desenha
 * com um pequeno atraso e o conjunto sobe devagar com a rolagem.
 */
function reliefPaths(count: number) {
  const out: string[] = [];
  for (let k = 0; k < count; k++) {
    const d = k * 26;
    const s = 1 - k * 0.035;
    // pico esquerdo mais alto, vale, pico direito, descida
    const p = [
      [0, 560],
      [250 + d * 0.15, 150 + d],
      [395, 330 + d * 0.55],
      [520 - d * 0.1, 210 + d * 0.9],
      [800, 560],
    ].map(([x, y]) => [x, 560 - (560 - y) * s]);
    out.push(`M${p.map((q) => q.join(" ")).join(" L")}`);
  }
  return out;
}
const RELIEF = reliefPaths(9);

export function Relief({
  className = "",
  progress,
  delay = 0.3,
  parallax = true,
}: {
  className?: string;
  progress?: MotionValue<number>;
  delay?: number;
  parallax?: boolean;
}) {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const src = progress ?? scrollY;
  const y = useTransform(src, progress ? [0, 1] : [0, 900], [0, -70]);
  return (
    <m.svg
      viewBox="0 0 800 560"
      preserveAspectRatio="xMidYMax meet"
      className={className}
      style={reduce || !parallax ? undefined : { y }}
      aria-hidden
      focusable="false"
    >
      {RELIEF.map((d, i) => (
        <m.path
          key={i}
          d={d}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.25}
          strokeLinejoin="round"
          initial={reduce ? false : { pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 - i * 0.085 }}
          transition={{ duration: 2.2, delay: delay + i * 0.09, ease: EXPO_OUT }}
        />
      ))}
    </m.svg>
  );
}

/** Ramo em traço fino com folhas: caminho, trajetória. */
export function Branch({ className = "", delay = 1 }: { className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  const stem = "M10 230 C 60 190, 90 150, 120 110 S 175 40, 230 12";
  const leaves = [
    "M52 196 c -14 -8 -22 -22 -20 -36 c 14 6 22 20 20 36 Z",
    "M78 168 c 16 -4 30 2 38 14 c -16 4 -30 -2 -38 -14 Z",
    "M104 134 c -12 -10 -16 -26 -10 -38 c 12 10 16 24 10 38 Z",
    "M140 92 c 16 -2 28 6 34 18 c -16 2 -28 -6 -34 -18 Z",
    "M168 62 c -10 -12 -12 -26 -4 -36 c 10 10 12 24 4 36 Z",
    "M200 32 c 14 0 24 8 28 20 c -14 0 -24 -8 -28 -20 Z",
  ];
  const t = (i: number) => ({ duration: 1.4, delay: delay + 0.35 + i * 0.12, ease: EXPO_OUT });
  return (
    <svg viewBox="0 0 240 240" className={className} aria-hidden focusable="false">
      <m.path
        d={stem}
        fill="none"
        stroke="currentColor"
        strokeWidth={1}
        strokeLinecap="round"
        initial={reduce ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, delay, ease: EXPO_OUT }}
      />
      {leaves.map((d, i) => (
        <m.path
          key={i}
          d={d}
          fill="none"
          stroke="currentColor"
          strokeWidth={1}
          initial={reduce ? false : { pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={t(i)}
        />
      ))}
    </svg>
  );
}

/** Filete em onda (o traço curvo sob o logo), usado entre seções. Revelado por recorte. */
export function Wave({ className = "" }: { className?: string }) {
  return (
    <DrawX className={className}>
      <svg viewBox="0 0 1200 24" preserveAspectRatio="none" className="h-full w-full" aria-hidden focusable="false">
        <path
          d="M0 16 C 200 4, 420 4, 600 12 S 1000 22, 1200 8"
          fill="none"
          stroke="currentColor"
          strokeWidth={1}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </DrawX>
  );
}

/**
 * Revela o conteúdo da esquerda para a direita ao entrar na tela (clip-path),
 * para traços esticados com non-scaling-stroke, onde pathLength não funciona.
 */
export function DrawX({
  children,
  className = "",
  duration = 1.8,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  duration?: number;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <m.div
      className={className}
      initial={reduce ? false : { clipPath: "inset(0 100% 0 0)" }}
      whileInView={{ clipPath: "inset(0 0% 0 0)" }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration, delay, ease: EXPO_OUT }}
    >
      {children}
    </m.div>
  );
}
