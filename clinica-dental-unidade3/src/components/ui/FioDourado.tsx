/*
  Momento de assinatura: um fio dourado que se desenha conforme a rolagem,
  conduzindo da primeira seção até o contato. Fica na margem lateral, atrás do
  conteúdo, para não competir com o texto. Com reduced motion, aparece completo.
*/
import { m, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import type { RefObject } from "react";

const CAMINHO =
  "M20 0 C 20 60, 34 90, 34 150 S 6 260, 6 330 S 34 440, 34 520 S 8 640, 10 720 S 32 860, 30 920 S 20 980, 20 1000";

export function FioDourado({ alvo }: { alvo: RefObject<HTMLElement | null> }) {
  const reduzido = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: alvo, offset: ["start 70%", "end 85%"] });
  const suave = useSpring(scrollYProgress, { stiffness: 90, damping: 28, restDelta: 0.001 });
  const progresso = useTransform(suave, (v) => (reduzido ? 1 : v));

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 left-0 z-[1] w-4 sm:w-8 lg:w-14 xl:left-[max(0px,calc(50%-672px))]"
    >
      <svg className="h-full w-full" viewBox="0 0 40 1000" preserveAspectRatio="none" fill="none">
        <path d={CAMINHO} stroke="var(--color-gold-400)" strokeOpacity="0.28" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        <m.path
          d={CAMINHO}
          stroke="var(--color-gold-400)"
          strokeWidth="2"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          style={{ pathLength: progresso }}
        />
      </svg>
    </div>
  );
}
