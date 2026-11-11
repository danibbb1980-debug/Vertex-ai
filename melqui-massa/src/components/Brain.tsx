import { useEffect, useId, useRef, useState } from "react";
import { BRAIN_OUTLINE, BRAIN_STROKES, BRAIN_TOTAL, BRAIN_VIEWBOX } from "../brain";

/** Ponto de saída do traço (base do tronco do cérebro), em % do viewBox. */
export const BRAIN_EXIT = { x: 318 / 418, y: 358 / 364 };

type Props = {
  className?: string;
  /** Desenha o traço (stroke-dashoffset) uma única vez. */
  draw?: boolean;
  /** Duração total do desenho, em segundos. Lento de propósito. */
  duration?: number;
  delay?: number;
  title?: string;
  onDone?: () => void;
};

function prefersReduced() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Cérebro do logo, vetorizado a partir do arquivo original.
 * Em repouso: contorno exato (preenchido). Ao desenhar: uma linha central larga,
 * recortada pela máscara do contorno, percorre o labirinto a partir do centro
 * até a saída no tronco. Ao final, troca para o contorno exato.
 */
export function Brain({ className, draw = false, duration = 6, delay = 0.4, title, onDone }: Props) {
  const id = useId().replace(/:/g, "");
  const [phase, setPhase] = useState<"idle" | "drawing" | "done">(draw ? "idle" : "done");
  const ref = useRef<SVGSVGElement>(null);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    if (!draw) return;
    if (prefersReduced()) {
      setPhase("done");
      doneRef.current?.();
      return;
    }
    const el = ref.current;
    let timer = 0;
    // só começa quando o desenho está visível (pausa fora da viewport)
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          io.disconnect();
          setPhase("drawing");
          timer = window.setTimeout(() => {
            setPhase("done");
            doneRef.current?.();
          }, (delay + duration) * 1000 + 100);
        }
      },
      { threshold: 0.2 },
    );
    if (el) io.observe(el);
    return () => {
      io.disconnect();
      window.clearTimeout(timer);
    };
  }, [draw, delay, duration]);

  return (
    <svg
      ref={ref}
      viewBox={BRAIN_VIEWBOX}
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {draw && phase !== "done" && (
        <>
          <defs>
            <mask id={`m${id}`} maskUnits="userSpaceOnUse" x="0" y="0" width="418" height="364">
              <path d={BRAIN_OUTLINE} fill="#fff" fillRule="evenodd" />
            </mask>
          </defs>
          <g mask={`url(#m${id})`}>
            {BRAIN_STROKES.map((s, i) => (
              <path
                key={i}
                d={s.d}
                pathLength={1}
                className="brain-stroke"
                strokeWidth={36}
                style={{
                  strokeDasharray: 1.02,
                  strokeDashoffset: phase === "drawing" ? 0 : 1.02,
                  transition:
                    phase === "drawing"
                      ? `stroke-dashoffset ${((s.len / BRAIN_TOTAL) * duration).toFixed(2)}s linear ${(
                          delay +
                          (s.delay / BRAIN_TOTAL) * duration
                        ).toFixed(2)}s`
                      : "none",
                }}
              />
            ))}
          </g>
        </>
      )}
      <path
        d={BRAIN_OUTLINE}
        fill="currentColor"
        fillRule="evenodd"
        style={{ opacity: phase === "done" ? 1 : 0 }}
      />
    </svg>
  );
}
