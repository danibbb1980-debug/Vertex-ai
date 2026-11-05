import { m, useInView, useScroll, useTransform, type MotionValue } from "motion/react";
import { Fragment, useRef, type ElementType } from "react";
import { EXPO_OUT, Rich, useReducedMotion } from "./ui";

/**
 * Adaptado de "Text Reveal (Mask)" (21st.dev, soralabs): cada linha fica
 * dentro de uma máscara e sobe a partir de 110% com easing expo.
 * Diferença: as linhas são definidas no texto (não medidas no navegador),
 * o que elimina o reflow inicial e qualquer salto de layout no hero.
 */
export function MaskedLines({
  lines,
  as: Tag = "h1",
  className = "",
  delay = 0.15,
  stagger = 0.11,
  inView = false,
  css = false,
}: {
  lines: string[];
  as?: ElementType;
  className?: string;
  delay?: number;
  stagger?: number;
  /** false = anima ao carregar; true = anima ao entrar na tela */
  inView?: boolean;
  /** true = animação em CSS puro (hero): o texto já vem no HTML e anima sem esperar o JS */
  css?: boolean;
}) {
  const reduce = useReducedMotion();
  // Observa o contêiner: o texto em si fica escondido pela máscara e nunca "entra" na tela.
  const box = useRef<HTMLElement>(null);
  const seen = useInView(box, { once: true, margin: "0px 0px -15% 0px" });
  if (css) {
    return (
      <Tag className={className}>
        {lines.map((line, i) => (
          <span key={i} className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
            <span className="hero-line block" style={{ animationDelay: `${delay + i * stagger}s` }}>
              <Rich text={line} />
            </span>
          </span>
        ))}
      </Tag>
    );
  }
  const show = !inView || seen;
  return (
    <Tag ref={box} className={className}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
          <m.span
            className="block will-change-transform"
            initial={reduce ? false : { y: "110%" }}
            animate={{ y: show ? "0%" : "110%" }}
            transition={{ duration: 1.1, delay: delay + i * stagger, ease: EXPO_OUT }}
          >
            <Rich text={line} />
          </m.span>
        </span>
      ))}
    </Tag>
  );
}

/**
 * Adaptado de "Scroll word reveal" (21st.dev, catálogo oficial do Motion):
 * cada palavra acende de 15% para 100% de opacidade conforme a seção é
 * rolada. Aqui o alvo é a própria janela (não um contêiner) e a frase fica
 * presa no centro da tela enquanto acende.
 */
const REST = 0.42;
const SPAN = 0.78;
const WINDOW = 0.16;

function Word({ children, progress, i, n }: { children: string; progress: MotionValue<number>; i: number; n: number }) {
  const start = (i / Math.max(1, n - 1)) * SPAN;
  const end = Math.min(1, start + WINDOW);
  const opacity = useTransform(progress, [start, end], [REST, 1]);
  return <m.span style={{ opacity }}>{children}</m.span>;
}

export function ScrollWords({ text, className = "" }: { text: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const words = text.split(" ");

  if (reduce) {
    return (
      <div className="wrap py-28 md:py-40">
        <p className={className}>{text}</p>
      </div>
    );
  }

  return (
    <div ref={ref} className="relative h-[200svh] md:h-[230svh]">
      <div className="sticky top-0 flex h-svh items-center">
        <div className="wrap">
          <p className={className}>
            <span className="sr-only">{text}</span>
            {words.map((w, i) => (
              <Fragment key={i}>
                <span aria-hidden>
                  <Word progress={scrollYProgress} i={i} n={words.length}>
                    {w}
                  </Word>
                </span>
                {i < words.length - 1 ? " " : null}
              </Fragment>
            ))}
          </p>
          <div className="mt-12 h-px w-full max-w-[220px] overflow-hidden bg-[var(--line)]" aria-hidden>
            <m.div className="h-full origin-left bg-[var(--accent)]" style={{ scaleX: scrollYProgress }} />
          </div>
        </div>
      </div>
    </div>
  );
}
