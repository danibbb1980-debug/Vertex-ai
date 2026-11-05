import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "../lib/motion";

/**
 * Momento de assinatura: uma linha rosê contínua que nasce na ponta da gota do
 * glifo (hero), percorre as margens das seções marcadas com data-line="left|right"
 * e termina num círculo que envolve o botão marcado com data-line-end.
 * A ponta da linha acompanha a rolagem. Com movimento reduzido, aparece inteira.
 *
 * Desenho via stroke-dashoffset em um único path (só pintura, sem layout).
 */
export function SpiralLine() {
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const dotRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const svg = svgRef.current!;
    const path = pathRef.current!;
    const dot = dotRef.current!;
    const host = svg.parentElement!;
    const reduce = prefersReducedMotion();

    let total = 0;
    let lut: { len: number; maxY: number }[] = [];
    let current = 0;
    let target = 0;
    let raf = 0;
    let visible = true;

    const build = () => {
      const hostRect = host.getBoundingClientRect();
      const ox = hostRect.left;
      const oy = hostRect.top;
      const W = hostRect.width;
      const H = host.scrollHeight;
      svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
      svg.style.height = `${H}px`;

      const start = document.querySelector<HTMLElement>("[data-line-start]");
      const end = document.querySelector<HTMLElement>("[data-line-end]");
      if (!start || !end) return;

      // Ponta inferior da gota: coordenadas relativas ao viewBox do glifo (110 x 170)
      const s = start.getBoundingClientRect();
      const sx = s.left - ox + (s.width * 42) / 110;
      const sy = s.top - oy + (s.height * 168) / 170;

      const container = Math.min(W, 1180);
      const pad = W >= 768 ? 40 : 20;
      const contentLeft = (W - container) / 2 + pad;
      const gutter = Math.max(8, Math.min(contentLeft - 20, 56));
      const xFor = (side: string) => (side === "left" ? gutter : W - gutter);

      const pts: [number, number][] = [[sx, sy]];
      const sections = document.querySelectorAll<HTMLElement>("[data-line]");
      // Sai da gota e vai logo para a margem, sem cruzar o texto do hero
      if (sections[0]) {
        const firstTop = sections[0].getBoundingClientRect().top - oy;
        pts.push([xFor(sections[0].dataset.line!), Math.min(sy + 110, firstTop - 20)]);
      }
      sections.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (!r.height) return;
        const x = xFor(el.dataset.line!);
        const top = r.top - oy;
        const inset = Math.min(110, r.height * 0.18);
        pts.push([x, top + inset], [x, top + r.height - inset]);
      });

      const e = end.getBoundingClientRect();
      const cx = e.left - ox + e.width / 2;
      const cy = e.top - oy + e.height / 2;
      const rx = e.width / 2 + 26;
      const ry = e.height / 2 + 22;

      let d = `M${sx.toFixed(1)} ${sy.toFixed(1)}`;
      const curve = (a: [number, number], b: [number, number]) => {
        const my = (a[1] + b[1]) / 2;
        return ` C${a[0].toFixed(1)} ${my.toFixed(1)} ${b[0].toFixed(1)} ${my.toFixed(1)} ${b[0].toFixed(1)} ${b[1].toFixed(1)}`;
      };
      for (let i = 1; i < pts.length; i++) {
        const a = pts[i - 1];
        const b = pts[i];
        d += Math.abs(a[0] - b[0]) < 1 ? ` L${b[0].toFixed(1)} ${b[1].toFixed(1)}` : curve(a, b);
      }
      // Chega ao topo do círculo e o percorre por completo
      d += curve(pts[pts.length - 1], [cx, cy - ry]);
      const fromLeft = pts[pts.length - 1][0] < cx ? 1 : 0;
      d += ` A${rx.toFixed(1)} ${ry.toFixed(1)} 0 1 ${fromLeft} ${cx.toFixed(1)} ${(cy + ry).toFixed(1)}`;
      d += ` A${rx.toFixed(1)} ${ry.toFixed(1)} 0 1 ${fromLeft} ${cx.toFixed(1)} ${(cy - ry).toFixed(1)}`;
      path.setAttribute("d", d);

      total = path.getTotalLength();
      path.style.strokeDasharray = `${total} ${total}`;

      // Tabela comprimento -> maior y já alcançado, para seguir a rolagem
      lut = [];
      let maxY = 0;
      const N = Math.min(320, Math.max(120, Math.round(total / 40)));
      for (let i = 0; i <= N; i++) {
        const len = (total * i) / N;
        const p = path.getPointAtLength(len);
        maxY = Math.max(maxY, p.y);
        lut.push({ len, maxY });
      }
      if (reduce) current = total;
      update(true);
    };

    const targetFromScroll = () => {
      const hostTop = host.getBoundingClientRect().top;
      const y = -hostTop + window.innerHeight * 0.62;
      // O círculo final se fecha quando o botão chega à área visível
      let lo = 0;
      let hi = lut.length - 1;
      if (!lut.length) return 0;
      if (y >= lut[hi].maxY) return total;
      while (lo < hi) {
        const mid = (lo + hi + 1) >> 1;
        if (lut[mid].maxY <= y) lo = mid;
        else hi = mid - 1;
      }
      return lut[lo].len;
    };

    const render = () => {
      path.style.strokeDashoffset = `${total - current}`;
      if (current > 2 && current < total - 2) {
        const p = path.getPointAtLength(current);
        dot.style.transform = `translate(${p.x}px, ${p.y}px)`;
        dot.style.opacity = "1";
      } else {
        dot.style.opacity = "0";
      }
    };

    const tick = () => {
      const diff = target - current;
      current += diff * 0.12;
      if (Math.abs(diff) < 0.5) current = target;
      render();
      raf = current !== target && visible ? requestAnimationFrame(tick) : 0;
    };

    const update = (immediate = false) => {
      target = reduce ? total : targetFromScroll();
      if (immediate && reduce) {
        current = target;
        render();
        return;
      }
      if (!raf && visible) raf = requestAnimationFrame(tick);
    };

    const onScroll = () => update();
    // Reconstrói no máximo uma vez por pausa (imagens e fontes mudam a altura)
    let timer = 0;
    const schedule = () => {
      clearTimeout(timer);
      timer = window.setTimeout(build, 180);
    };
    const ro = new ResizeObserver(schedule);
    ro.observe(host);
    const onVis = () => {
      visible = document.visibilityState === "visible";
      if (visible) update();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", schedule);
    document.addEventListener("visibilitychange", onVis);
    // Primeira montagem fora do caminho crítico
    const idle = (cb: () => void) =>
      typeof window.requestIdleCallback === "function" ? window.requestIdleCallback(cb, { timeout: 1200 }) : setTimeout(cb, 300);
    document.fonts?.ready.then(() => idle(build));

    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", schedule);
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <svg ref={svgRef} aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 z-[1] w-full" preserveAspectRatio="none">
      <defs>
        <filter id="tip-glow" x="-200%" y="-200%" width="500%" height="500%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>
      <path
        ref={pathRef}
        fill="none"
        stroke="#E48D9D"
        strokeOpacity="0.8"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      <g ref={dotRef} style={{ opacity: 0, transition: "opacity .4s" }}>
        <circle r="6" fill="#EFB1B6" opacity="0.45" filter="url(#tip-glow)" />
        <circle r="2.2" fill="#F4CDD0" />
      </g>
    </svg>
  );
}
