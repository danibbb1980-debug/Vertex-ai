import { useEffect, useRef, useState, type ReactNode } from 'react';
import { m, useReducedMotion, useScroll, useSpring } from 'motion/react';

/**
 * Assinatura visual: "o traço de quem cuida".
 * Uma linha dourada contínua corre pela margem, toca o filete de cada seção marcada
 * (data-thread) e termina num círculo que envolve o botão final de agendamento
 * (data-thread="end"). Desenha conforme a rolagem; com movimento reduzido, aparece pronta.
 */
export function GoldThread({ children }: { children: ReactNode }) {
  const wrap = useRef<HTMLDivElement>(null);
  const [geo, setGeo] = useState<{ d: string; w: number; h: number } | null>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: wrap, offset: ['start start', 'end end'] });
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 28, restDelta: 0.0005 });

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    let raf = 0;
    const medir = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const base = el.getBoundingClientRect();
        const rel = (n: Element) => {
          const r = n.getBoundingClientRect();
          return { x: r.left - base.left, y: r.top - base.top, w: r.width, h: r.height };
        };
        const start = el.querySelector('[data-thread="start"]');
        const end = el.querySelector('[data-thread="end"]');
        const mids = Array.from(el.querySelectorAll('[data-thread]')).filter(
          (n) => n !== start && n !== end && (n as HTMLElement).offsetParent !== null,
        );
        if (!start || !end) return setGeo(null);
        const s = rel(start);
        const firstMid = mids[0] ? rel(mids[0]) : null;
        const g = Math.max(10, (firstMid ? firstMid.x : s.x) / 2);
        const sy = s.y + s.h / 2;
        let d = `M ${s.x} ${sy} C ${s.x - 30} ${sy + 10} ${g} ${sy + 20} ${g} ${sy + 90}`;
        for (const n of mids) {
          const r = rel(n);
          const mx = r.x;
          const my = r.y + r.h / 2;
          d += ` L ${g} ${my - 70} C ${g} ${my - 22} ${mx - 6} ${my - 12} ${mx} ${my} C ${mx - 6} ${my + 12} ${g} ${my + 22} ${g} ${my + 70}`;
        }
        const b = rel(end);
        const rx = b.w / 2 + 22;
        const ry = b.h / 2 + 18;
        const cx = b.x + b.w / 2;
        const cy = b.y + b.h / 2;
        const lx = cx - rx;
        d += ` L ${g} ${cy - 220} C ${g} ${cy - 90} ${lx} ${cy - 110} ${lx} ${cy}`;
        d += ` A ${rx} ${ry} 0 1 0 ${cx + rx} ${cy} A ${rx} ${ry} 0 1 0 ${lx} ${cy}`;
        setGeo({ d, w: base.width, h: base.height });
      });
    };
    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(el);
    window.addEventListener('resize', medir);
    document.fonts?.ready.then(medir).catch(() => {});
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', medir);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={wrap} className="relative">
      {children}
      {geo && (
        <svg
          aria-hidden="true"
          focusable="false"
          className="pointer-events-none absolute left-0 top-0 z-[5]"
          width={geo.w}
          height={geo.h}
          viewBox={`0 0 ${geo.w} ${geo.h}`}
          fill="none"
        >
          <path d={geo.d} stroke="#D9AE3F" strokeOpacity="0.18" strokeWidth="1" />
          <m.path
            d={geo.d}
            stroke="#D9AE3F"
            strokeWidth="1.6"
            strokeLinecap="round"
            style={{ pathLength: reduce ? 1 : progress }}
          />
        </svg>
      )}
    </div>
  );
}
