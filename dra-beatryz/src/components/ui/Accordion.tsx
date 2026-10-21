/**
 * Acordeão de dúvidas. Inspirado no "FAQ Accordion Reveal" (21st.dev): cada pergunta
 * é um cartão que sobe em sequência e ganha um tom suave quando aberto.
 * Escrito do zero (o código do catálogo não estava disponível), com botões nativos,
 * aria-expanded/aria-controls e região rotulada.
 */
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useId, useState, type ReactNode } from "react";
import { cn } from "../../lib/utils";
import { Mais } from "../icons";
import { Reveal } from "./Reveal";

export type Item = { pergunta: string; resposta: ReactNode };

export function Accordion({ itens }: { itens: Item[] }) {
  const [aberto, setAberto] = useState<number | null>(0);
  const reduce = useReducedMotion();
  const uid = useId();

  return (
    <ul className="space-y-3">
      {itens.map((item, i) => {
        const open = aberto === i;
        const btnId = `${uid}-b${i}`;
        const panelId = `${uid}-p${i}`;
        return (
          <Reveal as="li" index={i % 4} key={item.pergunta}>
            <div
              className={cn(
                "rounded-3xl border transition-colors duration-300",
                open ? "border-rosa-100 bg-white shadow-[0_18px_40px_-28px_rgba(111,40,67,0.35)]" : "border-tinta/10 bg-white/50 hover:bg-white/80",
              )}
            >
              <h3 className="m-0 font-sans text-base font-semibold tracking-normal md:text-[1.06rem]">
                <button
                  id={btnId}
                  type="button"
                  aria-expanded={open}
                  aria-controls={panelId}
                  onClick={() => setAberto(open ? null : i)}
                  className="flex w-full cursor-pointer items-center justify-between gap-5 rounded-3xl px-5 py-5 text-left text-tinta md:px-7"
                >
                  <span>{item.pergunta}</span>
                  <span
                    className={cn(
                      "grid h-9 w-9 shrink-0 place-items-center rounded-full border transition-all duration-500 ease-[var(--ease-suave)]",
                      open ? "rotate-45 border-rosa-escuro bg-rosa-escuro text-white" : "border-tinta/15 text-rosa-escuro",
                    )}
                  >
                    <Mais className="h-4 w-4" />
                  </span>
                </button>
              </h3>
              <AnimatePresence initial={false}>
                {open && (
                  <motion.div
                    id={panelId}
                    role="region"
                    aria-labelledby={btnId}
                    initial={reduce ? false : { height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                    transition={{ duration: 0.45, ease: [0.19, 1, 0.22, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-6 text-[0.98rem] leading-relaxed text-suave md:px-7 md:pr-20">
                      {item.resposta}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Reveal>
        );
      })}
    </ul>
  );
}
