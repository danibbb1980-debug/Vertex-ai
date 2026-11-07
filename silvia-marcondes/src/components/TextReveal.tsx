// Adaptado de "Text Reveal" (21st.dev, @ddoemonn): revelação palavra a palavra
// com leve subida. Sem desfoque (só opacidade e transform). Ajustado para aceitar uma palavra em ênfase (itálico)
// e para respeitar prefers-reduced-motion.
import { Fragment, useMemo, useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";

const EASE = [0.23, 1, 0.32, 1] as const;
const HIDDEN = { opacity: 0, y: "0.45em" };
const SHOWN = { opacity: 1, y: "0em" };

type Props = {
  /** Texto com a palavra de ênfase entre asteriscos: "no *seu* horário" */
  text: string;
  className?: string;
  stagger?: number;
  delay?: number;
  onView?: boolean;
};

export function TextReveal({ text, className = "", stagger = 0.06, delay = 0, onView = true }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const reduced = useReducedMotion();
  const started = !onView || inView;

  const words = useMemo(
    () =>
      text
        .trim()
        .split(/\s+/)
        .map((w) => ({ txt: w.replace(/\*/g, ""), enfase: w.startsWith("*") })),
    [text],
  );
  const plano = text.replace(/\*/g, "");

  return (
    <span ref={ref} className={className}>
      <span className="sr-only">{plano}</span>
      <span aria-hidden="true">
        {words.map((w, i) => {
          const pontuacao = w.enfase ? w.txt.match(/[.,!?]+$/)?.[0] ?? "" : "";
          const palavra = pontuacao ? w.txt.slice(0, -pontuacao.length) : w.txt;
          return (
            <Fragment key={i}>
              {i > 0 ? " " : null}
              <motion.span
                className="inline-block"
                initial={reduced ? false : HIDDEN}
                animate={started ? SHOWN : HIDDEN}
                transition={reduced ? { duration: 0 } : { duration: 0.7, ease: EASE, delay: delay + i * stagger }}
              >
                {w.enfase ? (
                  <>
                    <em className="enfase">{palavra}</em>
                    {pontuacao}
                  </>
                ) : (
                  w.txt
                )}
              </motion.span>
            </Fragment>
          );
        })}
      </span>
    </span>
  );
}

/** Título estático com ênfase (sem animação), para usos simples. */
export function ComEnfase({ text }: { text: string }) {
  const partes = text.split(/(\*[^*]+\*)/g);
  return (
    <>
      {partes.map((p, i) =>
        p.startsWith("*") ? (
          <em key={i} className="enfase">
            {p.slice(1, -1)}
          </em>
        ) : (
          <Fragment key={i}>{p}</Fragment>
        ),
      )}
    </>
  );
}
