import {
  Children,
  isValidElement,
  useLayoutEffect,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type ElementType,
} from "react";
import { m, useInView, useSpring } from "motion/react";
import { useReducedMotion } from "../lib/useClient";

const EXPO = [0.19, 1, 0.22, 1] as const;
const useIsoLayout = typeof window === "undefined" ? useEffect : useLayoutEffect;

/* ---------------- Ícones (SVG próprios, sem logos de terceiros) ---------------- */

export function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M1 8h13M9 3l5 5-5 5" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

export function ChatIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M10 2.5c4.4 0 7.5 2.9 7.5 6.6s-3.1 6.6-7.5 6.6c-.9 0-1.8-.1-2.6-.4L3.5 17l1-3.3C3.3 12.5 2.5 10.9 2.5 9.1 2.5 5.4 5.6 2.5 10 2.5Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path d="M6.8 9.1h.01M10 9.1h.01M13.2 9.1h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

/* ---------------- Botão magnético ----------------
 * Adaptado de "Magnetic Button" (21st.dev · Hirael, MIT): mola mais lenta,
 * força menor, só com mouse, e seta que desliza no hover.
 */

const SPRING = { stiffness: 160, damping: 18, mass: 0.2 };

interface MagneticProps {
  href: string;
  children: ReactNode;
  variant?: "solid" | "ghost";
  external?: boolean;
  icon?: "arrow" | "chat";
  className?: string;
  strength?: number;
  onClick?: () => void;
}

export function MagneticLink({
  href,
  children,
  variant = "solid",
  external,
  icon = "arrow",
  className = "",
  strength = 0.22,
  onClick,
}: MagneticProps) {
  const reduced = useReducedMotion();
  const x = useSpring(0, SPRING);
  const y = useSpring(0, SPRING);

  return (
    <m.a
      href={href}
      onClick={onClick}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      style={{ x, y }}
      onPointerMove={(e) => {
        if (reduced || e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
      className={`btn btn-${variant} ${className}`}
    >
      {icon === "chat" && <ChatIcon />}
      <span>{children}</span>
      <span className="arrow" aria-hidden="true">
        <span>
          <Arrow />
          <Arrow />
        </span>
      </span>
      {external && <span className="sr-only"> (abre o WhatsApp em nova aba)</span>}
    </m.a>
  );
}

/* ---------------- Revelação de texto com máscara ----------------
 * Adaptado de "Text Reveal (Mask)" (21st.dev · soralabs): mantido o modo
 * linha a linha com easing expo, trocado <strong> por <em> (itálico do
 * conceito) e leitura de reduced-motion compatível com HTML pré-renderizado.
 */

type Part = { text: string; em: boolean };
type Word = Part[];

function segments(node: ReactNode, em = false): Part[] {
  if (typeof node === "string" || typeof node === "number") return [{ text: String(node), em }];
  if (Array.isArray(node)) return node.flatMap((n) => segments(n, em));
  if (isValidElement(node)) {
    const props = node.props as { children?: ReactNode };
    return Children.toArray(props.children).flatMap((n) => segments(n, em || node.type === "em"));
  }
  return [];
}

/** Junta segmentos em palavras, mantendo a pontuação colada ao itálico. */
function collect(node: ReactNode): Word[] {
  const words: Word[] = [];
  let cur: Word | null = null;
  for (const seg of segments(node)) {
    for (const piece of seg.text.split(/(\s+)/)) {
      if (!piece) continue;
      if (/^\s+$/.test(piece)) {
        cur = null;
        continue;
      }
      if (!cur) {
        cur = [];
        words.push(cur);
      }
      cur.push({ text: piece, em: seg.em });
    }
  }
  return words;
}

const renderWord = (w: Word) => w.map((p, i) => (p.em ? <em key={i}>{p.text}</em> : <span key={i}>{p.text}</span>));

export function TextReveal({
  children,
  as = "h2",
  id,
  className = "",
  delay = 0,
  stagger = 0.09,
}: {
  children: ReactNode;
  id?: string;
  as?: ElementType;
  className?: string;
  delay?: number;
  stagger?: number;
}) {
  const Tag = as;
  const root = useRef<HTMLDivElement>(null);
  const measure = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(root, { once: true, margin: "0px 0px -18% 0px" });
  const words = useMemo(() => collect(children), [children]);
  const [lines, setLines] = useState<number[][] | null>(null);

  useIsoLayout(() => {
    const el = root.current;
    const m = measure.current;
    if (!el || !m) return;
    const run = () => {
      m.style.width = `${el.clientWidth}px`;
      const nodes = m.querySelectorAll<HTMLElement>("[data-w]");
      const groups: number[][] = [];
      let top = -1;
      nodes.forEach((n, i) => {
        if (top === -1 || n.offsetTop > top + 2) groups.push([]);
        top = n.offsetTop;
        groups[groups.length - 1].push(i);
      });
      setLines(groups.length ? groups : [[0]]);
    };
    run();
    document.fonts?.ready.then(run);
    const ro = new ResizeObserver(run);
    ro.observe(el);
    return () => ro.disconnect();
  }, [words]);

  if (reduced) {
    return (
      <div ref={root}>
        <Tag id={id} className={className}>{children}</Tag>
      </div>
    );
  }

  return (
    <div ref={root} className="relative">
      <div ref={measure} aria-hidden="true" className={`pointer-events-none invisible absolute top-0 left-0 ${className}`}>
        {words.map((w, i) => (
          <span key={i} data-w className="inline-block" style={{ marginRight: i < words.length - 1 ? "0.25em" : 0 }}>
            {renderWord(w)}
          </span>
        ))}
      </div>
      <Tag id={id} aria-label={lines ? words.map((w) => w.map((p) => p.text).join("")).join(" ") : undefined} className={`${className} ${lines ? "" : "invisible"}`}>
        {lines
          ? lines.map((g, li) => (
              <span key={li} className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
                <m.span
                  className="block"
                  initial={{ y: "110%" }}
                  animate={{ y: inView ? "0%" : "110%" }}
                  transition={{ duration: 1.1, delay: delay + li * stagger, ease: EXPO }}
                >
                  {g.map((wi) => (
                    <span key={wi} className="inline-block" style={{ marginRight: wi < words.length - 1 ? "0.25em" : 0 }}>
                      {renderWord(words[wi])}
                    </span>
                  ))}
                </m.span>
              </span>
            ))
          : children}
      </Tag>
    </div>
  );
}

/* ---------------- Cabeçalho de seção com numeração e filete ---------------- */

export function SectionHead({
  num,
  label,
  id,
  children,
  className = "",
}: {
  id?: string;
  num: string;
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <header className={className}>
      <div className="mb-8 flex items-center gap-4 text-ink-soft md:mb-12">
        <span className="label text-accent">{num}</span>
        <m.span
          aria-hidden="true"
          className="h-px w-12 origin-left bg-current md:w-20"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: "0px 0px -10% 0px" }}
          transition={{ duration: 1.2, ease: EXPO }}
        />
        <span className="label">{label}</span>
      </div>
      <TextReveal id={id} className="font-display text-[clamp(2.6rem,7vw,6rem)]">{children}</TextReveal>
    </header>
  );
}

/* ---------------- Conteúdo que sobe com easing longo ---------------- */

export function Rise({
  children,
  delay = 0,
  className = "",
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li" | "article" | "p";
}) {
  const M = m[as];
  return (
    <M
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 1.1, delay, ease: EXPO }}
    >
      {children}
    </M>
  );
}
