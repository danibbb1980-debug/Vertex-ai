import { useEffect, useMemo, useRef, useState } from "react";
import { buildField, easeInOutCubic, lerpPts, toPath, type FieldOpts } from "../lib/contours";
import { usePrefersReducedMotion } from "../lib/hooks";

type Props = FieldOpts & {
  width: number;
  height: number;
  /** índice da única curva em cereja (-1 = nenhuma) */
  accent?: number;
  /** anima do agitado ao calmo ao montar */
  settle?: boolean;
  duration?: number;
  tone?: "light" | "dark";
  className?: string;
};

export default function ContourField({
  width,
  height,
  accent = -1,
  settle = false,
  duration = 3000,
  tone = "light",
  className = "",
  ...opts
}: Props) {
  const reduced = usePrefersReducedMotion();
  const field = useMemo(() => buildField(opts), [opts.count, opts.cx, opts.cy, opts.r0, opts.gap, opts.sx, opts.sy]); // eslint-disable-line react-hooks/exhaustive-deps
  const refs = useRef<(SVGPathElement | null)[]>([]);
  const svgRef = useRef<SVGSVGElement>(null);

  const animate = settle && !reduced;
  const [ready, setReady] = useState(!settle);

  useEffect(() => {
    if (!settle) return;
    // desenho inicial: agitado (com movimento) ou já calmo (movimento reduzido)
    const first = animate ? field.wild : field.calm;
    first.forEach((pts, i) => refs.current[i]?.setAttribute("d", toPath(pts)));
    setReady(true);
    if (!animate) return;
    let raf = 0;
    let start = 0;
    let visible = true;
    let elapsed = 0;
    let last = 0;
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && elapsed < duration) {
        last = 0;
        raf = requestAnimationFrame(tick);
      }
    });
    if (svgRef.current) io.observe(svgRef.current);

    function tick(now: number) {
      if (!start) start = now;
      if (last) elapsed += now - last;
      last = now;
      const t = Math.min(1, elapsed / duration);
      const e = easeInOutCubic(t);
      field.calm.forEach((c, i) => {
        const el = refs.current[i];
        if (el) el.setAttribute("d", toPath(lerpPts(field.wild[i], c, e)));
      });
      if (t < 1 && visible) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [animate, settle, field, duration]);

  const initial = field.calm;
  const base = tone === "light" ? "var(--musgo)" : "var(--porcelana)";
  const accentColor = tone === "light" ? "var(--cereja)" : "var(--cereja-clara)";

  return (
    <svg
      ref={svgRef}
      className={className}
      style={settle ? { opacity: ready ? 1 : 0, transition: "opacity .6s ease" } : undefined}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      focusable="false"
    >
      {initial.map((pts, i) => (
        <path
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          d={toPath(pts)}
          fill="none"
          stroke={i === accent ? accentColor : base}
          strokeOpacity={i === accent ? 0.9 : tone === "light" ? 0.2 + (i % 3 === 0 ? 0.06 : 0) : 0.16}
          strokeWidth={i === accent ? 1.4 : 1}
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  );
}
