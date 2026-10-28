import { useEffect, useRef } from "react";

/**
 * Momento de assinatura: uma curva fina que nasce no hero, é desenhada pela
 * rolagem e oscila cada vez menos até terminar em equilíbrio, com o ponto
 * pousado sobre uma linha reta (metáfora de harmonia).
 *
 * Desempenho: o SVG é fixo e do tamanho da tela (repinta só a área visível),
 * a curva é traduzida pela rolagem e o desenho é feito com stroke-dashoffset.
 * O laço de quadros só roda enquanto há rolagem e a área da curva está na tela.
 * Com prefers-reduced-motion a curva aparece inteira, sem animação de desenho.
 */
export default function CurvaAssinatura({ area }: { area: React.RefObject<HTMLElement | null> }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const grupoRef = useRef<SVGGElement>(null);
  const caminhoRef = useRef<SVGPathElement>(null);
  const pontoRef = useRef<SVGGElement>(null);
  const baseRef = useRef<SVGLineElement>(null);

  useEffect(() => {
    const wrap = area.current;
    const svg = svgRef.current;
    const grupo = grupoRef.current;
    const caminho = caminhoRef.current;
    const ponto = pontoRef.current;
    const base = baseRef.current;
    if (!wrap || !svg || !grupo || !caminho || !ponto || !base) return;

    const reduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Tabela de amostras ao longo da curva (calculada em JS, sem getPointAtLength):
    // fração do comprimento (0..1) → ponto (x, y). A curva é monótona em y.
    let fr: Float32Array = new Float32Array(0);
    let xs: Float32Array = new Float32Array(0);
    let ys: Float32Array = new Float32Array(0);
    let topoDoc = 0;
    let atual = 0; // fração desenhada (0..1)
    let alvo = 0;
    let quadro = 0;
    let visivel = true;
    let ultimoTam = "";

    function montar() {
      const r = wrap!.getBoundingClientRect();
      topoDoc = r.top + window.scrollY;
      const W = wrap!.clientWidth;
      const H = wrap!.scrollHeight;
      const vh = window.innerHeight;
      const tam = `${W}x${H}x${vh}`;
      if (tam === ultimoTam) return agendar(true);
      ultimoTam = tam;
      const largo = W >= 1024;

      const ini = wrap!.querySelector<HTMLElement>("[data-curva-inicio]");
      const fimEl = wrap!.querySelector<HTMLElement>("[data-curva-fim]");
      const ri = ini?.getBoundingClientRect();
      const rf = fimEl?.getBoundingClientRect();
      const x0 = ri ? ri.left + ri.width / 2 - r.left : W * 0.7;
      const y0 = ri ? ri.bottom - r.top : vh * 0.8;
      const yf = rf ? rf.top + rf.height / 2 - r.top : H - 200;
      const xf = W / 2;

      // ondas: uma a cada ~1,1 tela; amplitude decai até zero (equilíbrio)
      const alturaOnda = Math.max(vh * (largo ? 1.15 : 1.05), 620);
      const n = Math.max(3, Math.round((yf - y0) / alturaOnda));
      const margem = largo ? Math.max(48, (W - 1240) / 2 + 24) : 14;
      const amp = W / 2 - margem;
      const pts: Array<[number, number]> = [[x0, y0]];
      for (let i = 1; i <= n; i++) {
        const t = i / n;
        const decai = Math.pow(1 - t, 1.25);
        const lado = i % 2 === 1 ? -1 : 1;
        pts.push([i === n ? xf : xf + lado * amp * decai, y0 + (yf - y0) * t]);
      }

      const PASSOS = 48; // amostras por segmento
      const total = n * PASSOS + 1;
      xs = new Float32Array(total);
      ys = new Float32Array(total);
      fr = new Float32Array(total);
      let d = `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
      let k = 0;
      xs[0] = pts[0][0];
      ys[0] = pts[0][1];
      for (let i = 1; i < pts.length; i++) {
        const [ax, ay] = pts[i - 1];
        const [bx, by] = pts[i];
        const c = (by - ay) * 0.56;
        // controles verticais: (ax, ay+c) e (bx, by-c)
        d += ` C ${ax.toFixed(1)} ${(ay + c).toFixed(1)}, ${bx.toFixed(1)} ${(by - c).toFixed(1)}, ${bx.toFixed(1)} ${by.toFixed(1)}`;
        for (let j = 1; j <= PASSOS; j++) {
          const t = j / PASSOS;
          const u = 1 - t;
          const b0 = u * u * u, b1 = 3 * u * u * t, b2 = 3 * u * t * t, b3 = t * t * t;
          k++;
          xs[k] = b0 * ax + b1 * ax + b2 * bx + b3 * bx;
          ys[k] = b0 * ay + b1 * (ay + c) + b2 * (by - c) + b3 * by;
          fr[k] = fr[k - 1] + Math.hypot(xs[k] - xs[k - 1], ys[k] - ys[k - 1]);
        }
      }
      const comp = fr[k] || 1;
      for (let i = 0; i <= k; i++) fr[i] /= comp;
      caminho!.setAttribute("d", d);

      base!.setAttribute("x1", String(xf - 70));
      base!.setAttribute("x2", String(xf + 70));
      base!.setAttribute("y1", String(yf));
      base!.setAttribute("y2", String(yf));
      if (reduzido) atual = alvo = 1;
      agendar(true);
    }

    /** índice da amostra cujo y alcança `y` (busca binária). */
    function indiceParaY(y: number): number {
      let lo = 0;
      let hi = ys.length - 1;
      if (hi < 0 || y <= ys[0]) return 0;
      if (y >= ys[hi]) return hi;
      while (lo < hi) {
        const mid = (lo + hi) >> 1;
        if (ys[mid] < y) lo = mid + 1;
        else hi = mid;
      }
      return lo;
    }

    /** índice da amostra para uma fração do comprimento. */
    function indiceParaFracao(f: number): number {
      let lo = 0;
      let hi = fr.length - 1;
      while (lo < hi) {
        const mid = (lo + hi) >> 1;
        if (fr[mid] < f) lo = mid + 1;
        else hi = mid;
      }
      return lo;
    }

    function desenhar() {
      quadro = 0;
      if (!fr.length) return;
      const sy = window.scrollY;
      const vh = window.innerHeight;
      grupo!.setAttribute("transform", `translate(0 ${(topoDoc - sy).toFixed(1)})`);
      if (!reduzido) {
        alvo = fr[indiceParaY(sy + vh * 0.62 - topoDoc)];
        atual += (alvo - atual) * 0.14;
        if (Math.abs(alvo - atual) < 0.0004) atual = alvo;
      }
      caminho!.style.strokeDashoffset = `${1 - atual}`;
      if (atual > 0) {
        const i = indiceParaFracao(atual);
        ponto!.setAttribute("transform", `translate(${xs[i].toFixed(1)} ${ys[i].toFixed(1)})`);
        ponto!.style.opacity = "1";
      } else {
        ponto!.style.opacity = "0";
      }
      base!.style.opacity = atual >= 0.999 ? "0.8" : "0";
      if (atual !== alvo && visivel) agendar();
    }

    function agendar(forcar = false) {
      if ((!visivel && !forcar) || quadro) return;
      quadro = requestAnimationFrame(desenhar);
    }

    const aoRolar = () => agendar();
    let espera = 0;
    const remontar = () => {
      clearTimeout(espera);
      espera = window.setTimeout(montar, 120);
    };
    const ro = new ResizeObserver(remontar);
    ro.observe(wrap);
    const io = new IntersectionObserver(([e]) => {
      visivel = e.isIntersecting;
      svg!.style.visibility = visivel ? "visible" : "hidden";
      if (visivel) agendar();
    });
    io.observe(wrap);
    window.addEventListener("scroll", aoRolar, { passive: true });
    window.addEventListener("resize", remontar);
    document.fonts?.ready.then(remontar);
    remontar();

    return () => {
      cancelAnimationFrame(quadro);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("scroll", aoRolar);
      window.removeEventListener("resize", remontar);
      clearTimeout(espera);
    };
  }, [area]);

  return (
    <svg
      ref={svgRef}
      aria-hidden="true"
      focusable="false"
      className="curva-svg pointer-events-none fixed inset-0 z-0 h-[100vh] w-full"
    >
      <g ref={grupoRef}>
        <path
          ref={caminhoRef}
          fill="none"
          stroke="var(--color-ouro)"
          strokeWidth={1.1}
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray="1"
          strokeDashoffset="1"
          opacity={0.75}
        />
        <line ref={baseRef} stroke="var(--color-ouro)" strokeWidth={1} style={{ opacity: 0, transition: "opacity .8s" }} />
        <g ref={pontoRef} style={{ opacity: 0, transition: "opacity .4s" }}>
          <circle r={11} fill="none" stroke="var(--color-ouro)" strokeOpacity={0.35} />
          <circle r={3.6} fill="var(--color-bronze)" />
        </g>
      </g>
    </svg>
  );
}
