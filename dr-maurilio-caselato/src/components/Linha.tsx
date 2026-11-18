import { useRef, useState } from "react";
import { LazyMotion, domAnimation, m, useMotionValueEvent, useReducedMotion, useScroll, useSpring } from "motion/react";

type Etapa = { titulo: string; texto: string };

/** Linha do tempo vertical com progresso ligado à rolagem; os números acendem ao serem alcançados. */
export function Linha({ etapas }: { etapas: Etapa[] }) {
  const ref = useRef<HTMLOListElement>(null);
  const reduz = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] });
  const escala = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });
  const [ativa, setAtiva] = useState(reduz ? etapas.length : 0);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (reduz) return;
    const n = Math.min(etapas.length, Math.floor(v * etapas.length + 0.35));
    setAtiva((a) => (a === n ? a : n));
  });

  return (
    <div className="linha-wrap">
      <span className="linha-trilho" aria-hidden="true">
        <LazyMotion features={domAnimation} strict>
          <m.span className="linha-progresso" style={{ scaleY: reduz ? 1 : escala }} />
        </LazyMotion>
      </span>
      <ol ref={ref} className="linha">
      {etapas.map((e, i) => (
        <li key={e.titulo} className={`linha-etapa ${i < ativa ? "is-ativa" : ""}`}>
          <span className="linha-num" aria-hidden="true">
            {String(i + 1).padStart(2, "0")}
          </span>
          <div className="linha-corpo">
            <h3>
              <span className="sr-only">Etapa {i + 1}: </span>
              {e.titulo}
            </h3>
            <p>{e.texto}</p>
          </div>
        </li>
      ))}
      </ol>
    </div>
  );
}
