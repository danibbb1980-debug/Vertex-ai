import type { RefObject } from "react";
import { LazyMotion, domAnimation, m, useReducedMotion, useScroll, useSpring } from "motion/react";

/** Linha dourada que acompanha a rolagem (motion). Carregada sob demanda. */
export default function LinhaProgresso({ alvo }: { alvo: RefObject<HTMLElement | null> }) {
  const reduzir = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: alvo, offset: ["start 80%", "end 55%"] });
  const progresso = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });
  return (
    <LazyMotion features={domAnimation} strict>
      <m.span
        className="absolute bottom-6 left-[1.4rem] top-6 w-px origin-top bg-ouro"
        style={{ scaleY: reduzir ? 1 : progresso }}
        aria-hidden="true"
      />
    </LazyMotion>
  );
}
