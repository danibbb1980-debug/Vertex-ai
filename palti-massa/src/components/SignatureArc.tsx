/**
 * Momento de assinatura: um fio fino em degradê petróleo → verde-água, tirado do símbolo do logo.
 * Passa por âncoras marcadas com data-arc (hero → atendimentos → contato → botão do CTA final),
 * se desenha conforme a rolagem e leva um ponto de luz na ponta. Só em telas grandes.
 * Animação: comprimento do traço + transform do ponto. Desligado com prefers-reduced-motion
 * (o traço aparece inteiro, sem ponto).
 */
import { m as motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { useEffect, useRef, useState, type RefObject } from "react";

type Pt = { x: number; y: number };

const CONTENT_MAX = 1200;
const PAD = 32;

function catmullRom(pts: Pt[]): string {
  if (pts.length < 2) return "";
  const last = pts[pts.length - 1];
  // ponto fantasma: a chegada ao anel do CTA acontece na horizontal
  const ext = [...pts, { x: last.x + 80, y: last.y }];
  const clamp = (v: Pt, max: number): Pt => {
    const len = Math.hypot(v.x, v.y);
    return len > max ? { x: (v.x / len) * max, y: (v.y / len) * max } : v;
  };
  let d = `M${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = ext[i - 1] ?? ext[i];
    const p1 = ext[i];
    const p2 = ext[i + 1];
    const p3 = ext[i + 2] ?? p2;
    const chord = Math.hypot(p2.x - p1.x, p2.y - p1.y);
    // tangentes limitadas ao tamanho do trecho: sem "passar do ponto"
    const t1 = clamp({ x: (p2.x - p0.x) / 6, y: (p2.y - p0.y) / 6 }, chord * 0.42);
    const t2 = clamp({ x: (p3.x - p1.x) / 6, y: (p3.y - p1.y) / 6 }, chord * 0.42);
    const c1 = { x: p1.x + t1.x, y: p1.y + t1.y };
    const c2 = { x: p2.x - t2.x, y: p2.y - t2.y };
    d += ` C${c1.x.toFixed(1)} ${c1.y.toFixed(1)} ${c2.x.toFixed(1)} ${c2.y.toFixed(1)} ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return d;
}

export function SignatureArc({ containerRef }: { containerRef: RefObject<HTMLElement | null> }) {
  const reduce = useReducedMotion();
  const [geo, setGeo] = useState<{ d: string; w: number; h: number } | null>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const dotRef = useRef<SVGGElement>(null);
  const lut = useRef<{ y: number; l: number }[]>([]);
  const total = useRef(1);
  const drawn = useMotionValue(0);
  const drawnSmooth = useSpring(drawn, { stiffness: 90, damping: 22, mass: 0.6 });

  // Geometria: recalcula com o tamanho do conteúdo
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const mq = window.matchMedia("(min-width: 1024px)");
    let raf = 0;
    const measure = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (!mq.matches) return setGeo(null);
        const box = el.getBoundingClientRect();
        const W = box.width;
        const left = Math.max(PAD, (W - CONTENT_MAX) / 2 + PAD) - 16;
        const right = W - left;
        const anchors = Array.from(el.querySelectorAll<HTMLElement>("[data-arc]"))
          .sort((a, b) => Number(a.dataset.arc) - Number(b.dataset.arc));
        const pts = anchors
          .map((a) => {
            const r = a.getBoundingClientRect();
            if (!r.width && !r.height) return null;
            const pos = a.dataset.arcX ?? "self";
            const y = r.top - box.top + (a.dataset.arcY === "top" ? 0 : r.height / 2);
            const x = pos === "left" ? left : pos === "right" ? right : pos === "edge-left" ? r.left - box.left : r.left - box.left + r.width / 2;
            return { x, y };
          })
          .filter(Boolean) as Pt[];
        setGeo({ d: catmullRom(pts), w: W, h: box.height });
      });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    mq.addEventListener("change", measure);
    document.fonts?.ready.then(measure);
    return () => {
      ro.disconnect();
      mq.removeEventListener("change", measure);
      cancelAnimationFrame(raf);
    };
  }, [containerRef]);

  // Tabela comprimento ↔ altura para a ponta acompanhar o centro da tela
  useEffect(() => {
    const p = pathRef.current;
    if (!p || !geo) return;
    const L = p.getTotalLength();
    total.current = L || 1;
    const N = 240;
    const arr: { y: number; l: number }[] = [];
    let maxY = -Infinity;
    for (let i = 0; i <= N; i++) {
      const l = (L * i) / N;
      const y = p.getPointAtLength(l).y;
      maxY = Math.max(maxY, y);
      arr.push({ y: maxY, l });
    }
    lut.current = arr;
  }, [geo]);

  // Rolagem → quanto do fio está desenhado
  useEffect(() => {
    if (!geo || reduce) return;
    const el = containerRef.current;
    let ticking = false;
    const update = () => {
      ticking = false;
      if (!el) return;
      const top = el.getBoundingClientRect().top;
      const target = -top + window.innerHeight * 0.62;
      const t = lut.current;
      if (!t.length) return;
      let l = 0;
      if (target >= t[t.length - 1].y) l = total.current;
      else
        for (const s of t) {
          if (s.y >= target) break;
          l = s.l;
        }
      drawn.set(l / total.current);
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [geo, reduce, containerRef, drawn]);

  // Ponto de luz segue a ponta (só transform)
  useEffect(() => {
    if (reduce) return;
    return drawnSmooth.on("change", (v) => {
      const p = pathRef.current;
      const dot = dotRef.current;
      if (!p || !dot) return;
      const pt = p.getPointAtLength(Math.max(0, Math.min(1, v)) * total.current);
      dot.setAttribute("transform", `translate(${pt.x.toFixed(1)} ${pt.y.toFixed(1)})`);
      dot.style.opacity = v > 0.002 && v < 0.998 ? "1" : "0";
    });
  }, [drawnSmooth, reduce]);

  if (!geo) return null;

  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute left-0 top-0 z-[5] hidden lg:block"
      width={geo.w}
      height={geo.h}
      viewBox={`0 0 ${geo.w} ${geo.h}`}
    >
      <defs>
        <linearGradient id="arc-grad" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2={geo.h}>
          <stop offset="0" stopColor="#578C9C" />
          <stop offset="0.5" stopColor="#89BEB4" />
          <stop offset="1" stopColor="#578C9C" />
        </linearGradient>
        <radialGradient id="arc-glow">
          <stop offset="0" stopColor="#d9f1ec" stopOpacity="1" />
          <stop offset="0.35" stopColor="#89BEB4" stopOpacity="0.55" />
          <stop offset="1" stopColor="#89BEB4" stopOpacity="0" />
        </radialGradient>
      </defs>
      <path d={geo.d} fill="none" stroke="#89BEB4" strokeOpacity="0.16" strokeWidth="1" />
      {reduce ? (
        <path ref={pathRef} d={geo.d} fill="none" stroke="url(#arc-grad)" strokeWidth="1.6" strokeOpacity="0.7" />
      ) : (
        <motion.path
          ref={pathRef}
          d={geo.d}
          fill="none"
          stroke="url(#arc-grad)"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeOpacity="0.8"
          style={{ pathLength: drawnSmooth }}
        />
      )}
      {!reduce && (
        <g ref={dotRef} style={{ opacity: 0, transition: "opacity .3s" }}>
          <circle r="16" fill="url(#arc-glow)" />
          <circle r="3.2" fill="#ffffff" stroke="#3f8a80" strokeWidth="1.4" />
        </g>
      )}
    </svg>
  );
}

/** Círculo que se fecha ao redor do botão de agendar no CTA final. */
export function ClosingRing({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 400 120" preserveAspectRatio="none" className={`pointer-events-none absolute inset-0 h-full w-full overflow-visible ${className}`}>
      <defs>
        <linearGradient id="ring-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#a9d3dd" />
          <stop offset="1" stopColor="#89BEB4" />
        </linearGradient>
      </defs>
      <motion.rect
        x="2" y="2" width="396" height="116" rx="58"
        fill="none" stroke="url(#ring-grad)" strokeWidth="1.5" vectorEffect="non-scaling-stroke"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 1.6, ease: [0.65, 0, 0.35, 1], delay: 0.2 }}
      />
    </svg>
  );
}
