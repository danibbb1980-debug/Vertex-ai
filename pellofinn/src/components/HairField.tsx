import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform, useSpring, type MotionValue } from "motion/react";
import { Hair, rand } from "./hair";

const N = 26;
const W = 620;
const BASE = 680;

type F = { x: number; h: number; w: number; curva: number; tilt: number; delay: number; vermelho: boolean };

const FIOS: F[] = (() => {
  const out: F[] = [];
  let x = 24;
  let t = 0.2;
  for (let i = 0; i < N; i++) {
    const r = rand(i + 3);
    const r2 = rand(i + 71);
    x += 12 + r * 24;
    t += 0.06 + r2 * 0.22 + (r > 0.85 ? 0.25 : 0); // ritmo irregular
    out.push({
      x,
      h: 200 + Math.pow(r2, 0.8) * 460 * (0.55 + 0.45 * Math.sin((i / N) * Math.PI)),
      w: 6 + r * 6,
      curva: -10 + r2 * 34,
      tilt: -9 + r * 18,
      delay: t,
      vermelho: i === 7 || i === 16 || i === 22,
    });
  }
  return out;
})();

function Fio({ f, p, reduz }: { f: F; p: MotionValue<number>; reduz: boolean }) {
  // Ao rolar, cada fio sai da própria inclinação e converge para a mesma: a página "penteia" o campo.
  const rot = useTransform(p, [0, 1], [f.tilt, 13]);
  return (
    <g transform={`translate(${f.x} ${BASE})`}>
      <motion.g style={{ rotate: reduz ? 13 : rot, originX: 0.5, originY: 1 }}>
        <motion.g
          initial={reduz ? false : { scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1.25, delay: f.delay, ease: [0.16, 0.8, 0.25, 1] }}
          style={{ originX: 0.5, originY: 1 }}
        >
          <Hair h={f.h} w={f.w} curva={f.curva} cor={f.vermelho ? "var(--color-vermelho)" : "var(--color-fio)"} />
        </motion.g>
      </motion.g>
    </g>
  );
}

export default function HairField({ className = "" }: { className?: string }) {
  const ref = useRef<SVGSVGElement>(null);
  const reduz = !!useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref as unknown as React.RefObject<HTMLElement>, offset: ["start start", "end start"] });
  const p = useSpring(useTransform(scrollYProgress, [0, 0.6], [0, 1]), { stiffness: 80, damping: 22 });
  return (
    <svg ref={ref} viewBox={`0 0 ${W} ${BASE + 8}`} className={className} aria-hidden="true" focusable="false" preserveAspectRatio="xMinYMax meet">
      <line x1="0" x2={W} y1={BASE + 1} y2={BASE + 1} stroke="var(--color-grafite)" strokeOpacity=".35" strokeWidth="1" />
      {FIOS.map((f, i) => (
        <Fio key={i} f={f} p={p} reduz={reduz} />
      ))}
    </svg>
  );
}
