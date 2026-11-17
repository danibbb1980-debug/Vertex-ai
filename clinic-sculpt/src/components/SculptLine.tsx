import { useEffect, useRef, useState } from "react";
import { PROFILE_D, PROFILE_VIEWBOX } from "../lib/profile";

type Props = {
  tom: "claro" | "escuro";
  className?: string;
  /** espessura em unidades do viewBox */
  espessura?: number;
  /** fator de escala do deslocamento do relevo (1 = 1px de unidade do viewBox) */
  k?: number;
  /** recorte do viewBox, para mostrar só um trecho da linha */
  viewBox?: string;
  /** "montagem" desenha ao carregar; "visivel" desenha ao entrar na tela */
  gatilho?: "montagem" | "visivel";
  preserveAspectRatio?: string;
};

/**
 * Linha do perfil do logo, "entalhada" pela luz:
 * uma cópia escura e uma clara do mesmo path, deslocadas em sentidos opostos.
 */
export default function SculptLine({
  tom,
  className = "",
  espessura = 1.6,
  k = 1,
  viewBox = PROFILE_VIEWBOX,
  gatilho = "visivel",
  preserveAspectRatio = "xMidYMid meet",
}: Props) {
  const ref = useRef<SVGSVGElement>(null);
  const [fase, setFase] = useState<0 | 1 | 2>(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setFase(2);
      return;
    }
    let t: number | undefined;
    const iniciar = () => {
      requestAnimationFrame(() => setFase(1));
      t = window.setTimeout(() => setFase(2), 2500);
    };
    if (gatilho === "montagem") {
      iniciar();
      return () => window.clearTimeout(t);
    }
    const io = new IntersectionObserver(
      (es) => {
        if (es.some((e) => e.isIntersecting)) {
          iniciar();
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -20% 0px" },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearTimeout(t);
    };
  }, [gatilho]);

  const classes = [
    "sculpt",
    `sculpt-${tom}`,
    fase >= 1 ? "desenhado" : "",
    fase >= 2 ? "relevo" : "",
    className,
  ].join(" ");

  return (
    <svg
      ref={ref}
      className={classes}
      viewBox={viewBox}
      preserveAspectRatio={preserveAspectRatio}
      aria-hidden="true"
      focusable="false"
      style={{ ["--k" as string]: k, overflow: "visible" }}
    >
      <path className="s-sombra" d={PROFILE_D} strokeWidth={espessura} />
      <path className="s-brilho" d={PROFILE_D} strokeWidth={espessura} />
      <path className="s-traco" d={PROFILE_D} strokeWidth={espessura} pathLength={1} />
    </svg>
  );
}
