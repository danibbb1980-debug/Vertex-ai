/**
 * Adaptado de "Text Reveal (Mask)" (21st.dev, @soralabs).
 * Mudanças: só modos linha/palavra, ênfase em <em> vira palavra manuscrita,
 * curva e duração mais calmas, sem dependências externas além de motion.
 */
import { motion, useInView, useReducedMotion } from "motion/react";
import {
  type ElementType,
  isValidElement,
  type ReactNode,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { cn } from "../../lib/utils";

type Token = { text: string; em: boolean };
const EASE = [0.19, 1, 0.22, 1] as const;

function collect(node: ReactNode, em = false): Token[] {
  if (typeof node === "string") {
    return node.split(/\s+/).filter(Boolean).map((text) => ({ text, em }));
  }
  if (Array.isArray(node)) return node.flatMap((c) => collect(c, em));
  if (isValidElement(node)) {
    return collect((node.props as { children?: ReactNode }).children, em || node.type === "em");
  }
  return [];
}

function Word({ t, last }: { t: Token; last: boolean }) {
  return (
    <span className={cn("inline-block", !last && "me-[0.25em]", t.em && "manuscrita")}>{t.text}</span>
  );
}

export function MaskedTextReveal({
  children,
  as: Tag = "p",
  className,
  splitBy = "lines",
  delay = 0,
}: {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  splitBy?: "lines" | "words";
  delay?: number;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const inView = useInView(rootRef, { once: true, margin: "0px 0px -15% 0px" });
  const words = useMemo(() => collect(children), [children]);
  const [lines, setLines] = useState<number[][] | null>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const m = measureRef.current;
    if (!root || !m) return;
    const measure = () => {
      if (root.clientWidth > 0) m.style.width = `${root.clientWidth}px`;
      const nodes = m.querySelectorAll("[data-w]");
      const groups: number[][] = [];
      let cur: number[] = [];
      let top = -1;
      nodes.forEach((n, i) => {
        const t = (n as HTMLElement).offsetTop;
        if (top !== -1 && t > top + 1) {
          groups.push(cur);
          cur = [];
        }
        cur.push(i);
        top = t;
      });
      if (cur.length) groups.push(cur);
      setLines(groups.length ? groups : [[0]]);
    };
    measure();
    document.fonts?.ready.then(measure);
    const ro = new ResizeObserver(measure);
    ro.observe(root);
    return () => ro.disconnect();
  }, [words, className]);

  if (reduce) {
    return (
      <div ref={rootRef}>
        <Tag className={className}>{children}</Tag>
      </div>
    );
  }

  const label = words.map((w) => w.text).join(" ");
  const ready = lines !== null;
  const show = inView && ready;
  let order = 0;

  return (
    <div className="relative w-full" ref={rootRef}>
      <div
        aria-hidden
        ref={measureRef}
        className={cn("pointer-events-none invisible fixed top-0 left-[-9999px]", className)}
      >
        {words.map((t, i) => (
          <span data-w key={i} className={cn("inline-block", i < words.length - 1 && "me-[0.25em]", t.em && "manuscrita")}>
            {t.text}
          </span>
        ))}
      </div>
      <Tag aria-label={label} className={cn(!ready && "invisible", className)}>
        {ready &&
          lines.map((group, li) => (
            <span key={li} aria-hidden className="block overflow-hidden pb-[0.12em] -mb-[0.12em]">
              {splitBy === "lines" ? (
                <motion.span
                  className="block"
                  initial={{ y: "110%" }}
                  animate={show ? { y: "0%" } : { y: "110%" }}
                  transition={{ duration: 0.9, delay: delay + li * 0.09, ease: EASE }}
                >
                  {group.map((wi) => (
                    <Word key={wi} t={words[wi]} last={wi === words.length - 1} />
                  ))}
                </motion.span>
              ) : (
                group.map((wi) => {
                  const d = delay + order++ * 0.05;
                  return (
                    <motion.span
                      key={wi}
                      className="inline-block"
                      initial={{ y: "110%" }}
                      animate={show ? { y: "0%" } : { y: "110%" }}
                      transition={{ duration: 0.7, delay: d, ease: EASE }}
                    >
                      <Word t={words[wi]} last={wi === words.length - 1} />
                    </motion.span>
                  );
                })
              )}
            </span>
          ))}
      </Tag>
    </div>
  );
}
