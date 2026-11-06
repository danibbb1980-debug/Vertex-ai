/**
 * Adaptado de "Vertical Cut Reveal" (21st.dev, @cnippet-dev).
 * Mudanças: usa `m` (LazyMotion), divide por palavras, aceita uma palavra em
 * ênfase, respeita prefers-reduced-motion e mantém o texto acessível (sr-only).
 */
import { m, useReducedMotion } from "motion/react";

export function VerticalCutReveal({ texto, enfase, atraso = 0.15, stagger = 0.07 }: {
  texto: string; enfase?: string; atraso?: number; stagger?: number;
}) {
  const reduzido = useReducedMotion();
  const palavras = texto.split(" ");
  const limpa = (p: string) => p.replace(/[.,;:!?]/g, "");
  return (
    <>
      <span className="sr-only">{texto}</span>
      <span aria-hidden="true" className="flex flex-wrap">
        {palavras.map((p, i) => {
          const enf = enfase && limpa(p) === enfase;
          const conteudo = enf ? (
            <>
              <em className="enfase">{limpa(p)}</em>
              {p.slice(limpa(p).length)}
            </>
          ) : p;
          return (
            <span key={i} className="inline-flex overflow-hidden pb-[0.12em] -mb-[0.12em]">
              {reduzido ? (
                <span className="inline-block">{conteudo}</span>
              ) : (
                <m.span
                  className="inline-block will-change-transform"
                  initial={{ y: "105%" }}
                  animate={{ y: 0 }}
                  transition={{ type: "spring", stiffness: 170, damping: 24, delay: atraso + i * stagger }}
                >
                  {conteudo}
                </m.span>
              )}
              {i < palavras.length - 1 && <span>&nbsp;</span>}
            </span>
          );
        })}
      </span>
    </>
  );
}
