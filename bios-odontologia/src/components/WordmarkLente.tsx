import { useEffect, useRef } from "react";
import { CENTROS, WORDMARK_D, WORDMARK_VIEWBOX } from "./logo-paths";
import { AroLente } from "./Regua";
import { useMenosMovimento } from "../hooks";

/* geometria do viewBox do wordmark */
const VB_X = 40;
const VB_Y = 24;
const VB_W = 834;
const VB_H = 340;
const ZOOM = 1.6;

/**
 * "A lente": o wordmark BIOS em contorno fino, e uma lente circular com aro de bronze
 * que mostra, por dentro, o mesmo wordmark ampliado (1,6×) e preenchido em grafite.
 *
 * Só transform é animado. Desktop: a lente percorre o wordmark uma vez ao carregar e
 * depois segue o ponteiro com lerp. Toque: anda na horizontal com a rolagem do hero.
 * prefers-reduced-motion: fica parada sobre o "I".
 * A lente nunca sai da faixa do wordmark, então nunca cobre o texto acima ou abaixo.
 */
export function WordmarkLente() {
  const faixaRef = useRef<HTMLDivElement>(null);
  const lenteRef = useRef<HTMLDivElement>(null);
  const copiaRef = useRef<HTMLDivElement>(null);
  const reduz = useMenosMovimento();

  useEffect(() => {
    const faixa = faixaRef.current;
    const lente = lenteRef.current;
    const copia = copiaRef.current;
    if (!faixa || !lente || !copia) return;

    let W = 0;
    let H = 0;
    let R = 0;
    let escala = 1; // px por unidade do viewBox
    let topoWm = 0; // y do topo do wordmark dentro da faixa

    const medir = () => {
      W = faixa.clientWidth;
      H = faixa.clientHeight;
      R = lente.offsetWidth / 2;
      escala = W / VB_W;
      topoWm = (H - VB_H * escala) / 2;
      copia.style.width = W + "px";
      copia.style.height = H + "px";
    };
    const xLetra = (l: keyof typeof CENTROS) => (CENTROS[l] - VB_X) * escala;
    const yCentro = () => topoWm + (175 - VB_Y) * escala; // linha do centro do "O"
    // repouso: onde o "O" encontra o corte, ao lado do "I"
    const xRepouso = () => (400 - VB_X) * escala;
    const yRepouso = () => topoWm + (240 - VB_Y) * escala;

    let x = 0;
    let y = 0;
    let alvoX = 0;
    let alvoY = 0;

    const limitar = () => {
      const minY = R;
      const maxY = H - R;
      alvoX = Math.min(Math.max(alvoX, R), W - R);
      alvoY = minY > maxY ? H / 2 : Math.min(Math.max(alvoY, minY), maxY);
    };

    const aplicar = () => {
      lente.style.transform = `translate3d(${x - R}px, ${y - R}px, 0)`;
      copia.style.transform = `translate3d(${R}px, ${R}px, 0) scale(${ZOOM}) translate3d(${-x}px, ${-y}px, 0)`;
    };

    medir();

    // ----- reduced motion: parada sobre o "I"
    if (reduz) {
      const fixa = () => {
        medir();
        x = alvoX = xLetra("I");
        y = alvoY = yCentro();
        limitar();
        x = alvoX;
        y = alvoY;
        aplicar();
      };
      fixa();
      const ro = new ResizeObserver(fixa);
      ro.observe(faixa);
      return () => ro.disconnect();
    }

    const ponteiroFino = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    let raf = 0;
    let visivel = true;
    let usandoPonteiro = false;
    let introInicio = -1;
    const INTRO = 2600;

    x = alvoX = xLetra("B");
    y = alvoY = yCentro();
    limitar();
    x = alvoX;
    y = alvoY;
    aplicar();

    // celular: a lente vai do "B" ao "S" enquanto o próprio wordmark sobe até o cabeçalho
    const progressoRolagem = () => {
      const r = faixa.getBoundingClientRect();
      const inicioDoc = r.top + window.scrollY;
      const total = Math.max(120, inicioDoc + r.height - 110);
      return Math.min(Math.max(window.scrollY / total, 0), 1);
    };

    const quadro = (t: number) => {
      raf = 0;
      if (!visivel) return;
      let continuar = false;

      if (ponteiroFino) {
        if (!usandoPonteiro) {
          if (introInicio < 0) introInicio = t;
          const p = Math.min((t - introInicio) / INTRO, 1);
          const e = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2; // easeInOutCubic
          // percorre B → S e assenta sobre o "O"
          const ida = xLetra("B") + (xLetra("S") - xLetra("B")) * Math.min(e * 1.25, 1);
          const volta = (p - 0.8) / 0.2;
          alvoX = p < 0.8 ? ida : xLetra("S") + (xRepouso() - xLetra("S")) * volta;
          alvoY = p < 0.8 ? yCentro() : yCentro() + (yRepouso() - yCentro()) * volta;
          limitar();
          x = alvoX;
          y = alvoY;
          continuar = p < 1;
        } else {
          x += (alvoX - x) * 0.14;
          y += (alvoY - y) * 0.14;
          continuar = Math.abs(alvoX - x) > 0.3 || Math.abs(alvoY - y) > 0.3;
        }
      } else {
        const p = progressoRolagem();
        alvoX = xLetra("B") + (xLetra("S") - xLetra("B")) * p;
        alvoY = yCentro();
        limitar();
        x += (alvoX - x) * 0.18;
        y = alvoY;
        continuar = Math.abs(alvoX - x) > 0.3;
      }
      aplicar();
      if (continuar) pedir();
    };
    const pedir = () => {
      if (!raf && visivel) raf = requestAnimationFrame(quadro);
    };

    // ponteiro (desktop): segue dentro do hero; ao sair, volta ao "O"
    const hero = faixa.closest("section") ?? faixa;
    const aoMover = (ev: PointerEvent) => {
      if (ev.pointerType !== "mouse") return;
      const r = faixa.getBoundingClientRect();
      usandoPonteiro = true;
      alvoX = ev.clientX - r.left;
      alvoY = ev.clientY - r.top;
      limitar();
      pedir();
    };
    const aoSair = () => {
      if (!usandoPonteiro) return;
      alvoX = xRepouso();
      alvoY = yRepouso();
      limitar();
      pedir();
    };
    const aoRolar = () => pedir();
    const aoRedimensionar = () => {
      medir();
      if (!usandoPonteiro && introInicio >= 0 && performance.now() - introInicio > INTRO) {
        x = alvoX = xRepouso();
        y = alvoY = yRepouso();
      }
      limitar();
      if (ponteiroFino && !usandoPonteiro) {
        x = alvoX;
        y = alvoY;
      }
      aplicar();
      pedir();
    };

    if (ponteiroFino) {
      hero.addEventListener("pointermove", aoMover as EventListener, { passive: true });
      hero.addEventListener("pointerleave", aoSair);
    } else {
      window.addEventListener("scroll", aoRolar, { passive: true });
    }
    const ro = new ResizeObserver(aoRedimensionar);
    ro.observe(faixa);

    // pausa fora da viewport
    const io = new IntersectionObserver(([e]) => {
      visivel = e.isIntersecting;
      if (visivel) pedir();
      else if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    });
    io.observe(faixa);

    // começa depois que as fontes/layout assentarem
    const inicio = window.setTimeout(pedir, 350);

    return () => {
      window.clearTimeout(inicio);
      if (raf) cancelAnimationFrame(raf);
      hero.removeEventListener("pointermove", aoMover as EventListener);
      hero.removeEventListener("pointerleave", aoSair);
      window.removeEventListener("scroll", aoRolar);
      ro.disconnect();
      io.disconnect();
    };
  }, [reduz]);

  return (
    <div
      ref={faixaRef}
      className="relative min-h-[166px] overflow-hidden md:min-h-0"
      style={{
        aspectRatio: `${VB_W} / ${VB_H}`,
        width: `min(100%, calc((100svh - 360px) * ${(VB_W / VB_H).toFixed(3)}))`,
      }}
      data-faixa-wordmark
    >
      {/* contorno fino */}
      <svg
        viewBox={`${VB_X} ${VB_Y} ${VB_W} ${VB_H}`}
        className="absolute inset-x-0 top-1/2 h-auto w-full -translate-y-1/2"
        aria-hidden="true"
        focusable="false"
      >
        <path
          d={WORDMARK_D}
          fill="none"
          stroke="#1F1E20"
          strokeWidth="1.15"
          vectorEffect="non-scaling-stroke"
          fillRule="evenodd"
        />
      </svg>

      {/* a lente */}
      <div
        ref={lenteRef}
        className="pointer-events-none absolute left-0 top-0 size-[150px] will-change-transform md:size-[240px]"
        aria-hidden="true"
      >
        <div className="absolute inset-[8.75%] overflow-hidden rounded-full bg-pedra" style={{ clipPath: "circle(50%)" }}>
          {/* desfaz o recuo do vidro (8,75% de D = 10,606% da largura do vidro) */}
          <div className="absolute" style={{ left: "-10.6061%", top: "-10.6061%" }}>
            <div ref={copiaRef} className="absolute left-0 top-0 origin-top-left">
              <svg
                viewBox={WORDMARK_VIEWBOX}
                className="absolute inset-x-0 top-1/2 h-auto w-full -translate-y-1/2"
                focusable="false"
              >
                <path d={WORDMARK_D} fill="#1F1E20" fillRule="evenodd" />
              </svg>
            </div>
          </div>
          {/* retícula */}
          <span className="absolute left-1/2 top-[18%] h-[64%] w-px -translate-x-1/2 bg-bronze/45" />
          <span className="absolute left-[18%] top-1/2 h-px w-[64%] -translate-y-1/2 bg-bronze/45" />
        </div>
        <AroLente className="absolute inset-0 size-full text-bronze" />
      </div>
    </div>
  );
}
