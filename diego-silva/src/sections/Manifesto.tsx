import { m, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";
import { useMotionOk } from "../lib/useMotionOk";

const FRASE =
  "Uma questão jurídica fica mais leve quando é ouvida com atenção, explicada com clareza e acompanhada com responsabilidade.";
const DESTAQUES = new Set(["atenção,", "clareza", "responsabilidade."]);

function Word({ w, i, total, p }: { w: string; i: number; total: number; p: MotionValue<number> }) {
  const start = i / total;
  const hi = DESTAQUES.has(w);
  // mínimo calibrado para manter contraste AA de texto grande (3:1) mesmo "apagado"
  const opacity = useTransform(p, [start, start + 1 / total], [hi ? 0.64 : 0.5, 1]);
  return (
    <m.span style={{ opacity }} className={hi ? "italic text-wine" : undefined}>
      {w}{" "}
    </m.span>
  );
}

export function Manifesto() {
  const ref = useRef<HTMLParagraphElement>(null);
  const ok = useMotionOk();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 45%"] });
  const words = FRASE.split(" ");

  return (
    <section aria-label="Manifesto" className="py-28 md:py-44">
      <div className="wrap grid md:grid-cols-12">
        <p className="eyebrow mb-8 text-ink-soft md:col-span-3 md:mb-0 md:pt-4">Nosso compromisso</p>
        <p
          ref={ref}
          className="font-serif text-[clamp(2rem,5.4vw,4.6rem)] font-[350] leading-[1.08] tracking-[-0.025em] md:col-span-9"
        >
          {ok ? (
            <>
              <span className="sr-only">{FRASE}</span>
              <span aria-hidden>
                {words.map((w, i) => (
                  <Word key={i} w={w} i={i} total={words.length} p={scrollYProgress} />
                ))}
              </span>
            </>
          ) : (
            words.map((w, i) => (
              <span key={i} className={DESTAQUES.has(w) ? "italic text-wine" : undefined}>
                {w}{" "}
              </span>
            ))
          )}
        </p>
      </div>
    </section>
  );
}
