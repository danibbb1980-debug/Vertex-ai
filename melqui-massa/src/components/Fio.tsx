import { useEffect, useRef, useState } from "react";

/**
 * O fio: uma linha fina que sai do tronco do cérebro e liga as seções até o
 * botão de agendar, só com trechos retos e diagonais a 45° (como o logo).
 * Âncoras: elementos com [data-fio], em ordem no documento.
 * Desenhado por stroke-dashoffset conforme a rolagem.
 */
export function Fio({ visible }: { visible: boolean }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [geo, setGeo] = useState<{ d: string; w: number; h: number; nodes: { x: number; y: number; h?: boolean }[] }>({
    d: "",
    w: 0,
    h: 0,
    nodes: [],
  });
  const table = useRef<{ len: number; y: number }[]>([]);
  const total = useRef(0);

  // geometria
  useEffect(() => {
    const host = svgRef.current?.parentElement;
    if (!host) return;
    const build = () => {
      const hr = host.getBoundingClientRect();
      const pts = Array.from(document.querySelectorAll<HTMLElement>("[data-fio]"))
        .filter((el) => el.offsetParent !== null)
        .map((el) => {
          const r = el.getBoundingClientRect();
          return {
            x: Math.round(r.left + r.width / 2 - hr.left),
            y: Math.round(r.top + r.height / 2 - hr.top),
            h: el.dataset.fio === "h",
          };
        });
      if (pts.length < 2) return;
      let d = `M${pts[0].x} ${pts[0].y}`;
      for (let i = 1; i < pts.length; i++) {
        const a = pts[i - 1];
        const b = pts[i];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const adx = Math.abs(dx);
        if (b.h && dy > 40) {
          // entrada horizontal: desce pela margem, quina a 45° e segue reto até o alvo
          const dir = Math.sign(dx) || 1;
          d += ` V${b.y - 24} L${a.x + dir * 24} ${b.y} H${b.x}`;
        } else if (dy >= adx + 24) {
          // desce reto e chega em diagonal
          d += ` V${b.y - adx} L${b.x} ${b.y}`;
        } else {
          // pouco espaço vertical: desce, corta a 45° e entra na horizontal
          const v = Math.max(8, Math.min(32, dy * 0.25));
          const diag = Math.max(0, dy - v);
          const dir = Math.sign(dx) || 1;
          d += ` V${a.y + v} L${a.x + dir * Math.min(diag, adx)} ${b.y} H${b.x}`;
        }
      }
      setGeo({ d, w: hr.width, h: hr.height, nodes: pts.slice(1, -1) });
    };
    build();
    const ro = new ResizeObserver(() => build());
    ro.observe(host);
    window.addEventListener("load", build);
    return () => {
      ro.disconnect();
      window.removeEventListener("load", build);
    };
  }, []);

  // tabela comprimento → y (o fio nunca sobe)
  useEffect(() => {
    const p = pathRef.current;
    if (!p || !geo.d) return;
    const L = p.getTotalLength();
    total.current = L;
    const n = 240;
    const t: { len: number; y: number }[] = [];
    for (let i = 0; i <= n; i++) {
      const len = (L * i) / n;
      t.push({ len, y: p.getPointAtLength(len).y });
    }
    table.current = t;
    p.style.strokeDasharray = `${L} ${L}`;
    update();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geo.d]);

  const update = () => {
    const p = pathRef.current;
    const host = svgRef.current?.parentElement;
    if (!p || !host || !table.current.length) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      p.style.strokeDashoffset = "0";
      return;
    }
    const top = host.getBoundingClientRect().top;
    const target = window.innerHeight * 0.72 - top;
    const t = table.current;
    let len = 0;
    if (target >= t[t.length - 1].y) len = total.current;
    else
      for (let i = 1; i < t.length; i++) {
        if (t[i].y >= target) {
          const a = t[i - 1];
          const b = t[i];
          const f = b.y === a.y ? 1 : (target - a.y) / (b.y - a.y);
          len = a.len + (b.len - a.len) * Math.max(0, Math.min(1, f));
          break;
        }
      }
    p.style.strokeDashoffset = String(total.current - len);
  };

  useEffect(() => {
    let raf = 0;
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
      cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <svg
      ref={svgRef}
      aria-hidden="true"
      focusable="false"
      className="pointer-events-none absolute inset-0 z-[5] hidden h-full w-full lg:block"
      width={geo.w}
      height={geo.h}
      style={{ opacity: visible ? 1 : 0, transition: "opacity 1.6s ease" }}
    >
      <path
        ref={pathRef}
        d={geo.d}
        fill="none"
        stroke="var(--color-emerald)"
        strokeWidth={1.25}
        strokeLinejoin="miter"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
