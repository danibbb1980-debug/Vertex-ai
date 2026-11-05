import { m, useSpring } from "motion/react";
import { useSyncExternalStore, type ReactNode, type PointerEvent, type AnchorHTMLAttributes } from "react";

export const EXPO_OUT = [0.19, 1, 0.22, 1] as const;

/** Media query segura para hidratação: no servidor (e no 1º render) vale false. */
function useMedia(query: string) {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/** true em desktop com mouse (hover + ponteiro fino). */
export const useFinePointer = () => useMedia("(hover: hover) and (pointer: fine)");

/** true quando a pessoa pediu menos movimento no sistema. */
export const useReducedMotion = () => useMedia("(prefers-reduced-motion: reduce)");

/* ---------------- Ícones (traço fino, 1.5px) ---------------- */
type IconProps = { className?: string };
const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  focusable: false,
};

export const IconArrow = ({ className }: IconProps) => (
  <svg viewBox="0 0 20 20" className={className} {...base}>
    <path d="M3 10h13M11 4.5 16.5 10 11 15.5" />
  </svg>
);
export const IconWhats = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M4.5 19.5 5.6 16A8 8 0 1 1 8.3 18.6Z" />
    <path d="M9.2 8.6c.2-.5.5-.6.8-.6h.5c.2 0 .4.1.5.4l.6 1.5c.1.2 0 .5-.1.6l-.5.6c.5 1 1.3 1.8 2.3 2.3l.6-.5c.2-.1.4-.2.6-.1l1.5.6c.3.1.4.3.4.5v.5c0 .3-.1.6-.6.8-.6.3-1.6.4-2.9-.2a8 8 0 0 1-3.3-3.3c-.6-1.3-.5-2.3-.2-2.9Z" />
  </svg>
);
export const IconInsta = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
    <circle cx="12" cy="12" r="3.8" />
    <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" />
  </svg>
);
export const IconMail = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <rect x="3" y="5.5" width="18" height="13" rx="2" />
    <path d="m3.5 7 8.5 6 8.5-6" />
  </svg>
);
export const IconPin = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z" />
    <circle cx="12" cy="10" r="2.3" />
  </svg>
);
export const IconClock = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </svg>
);
export const IconPlus = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

/** Seta que desliza: uma sai pela direita enquanto a outra entra. */
export const Arrow = () => (
  <span className="arrow" aria-hidden>
    <IconArrow />
    <IconArrow />
  </span>
);

/* ---------------- Botão magnético ---------------- */
type BtnProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: "primary" | "ghost";
  children: ReactNode;
  icon?: ReactNode;
  external?: boolean;
};

/**
 * Inspirado no "Magnetic Button" do 21st.dev: o botão é puxado de leve na
 * direção do cursor e volta com mola. Desligado em toque e com reduced-motion.
 */
export function Btn({ variant = "primary", children, icon, external, className = "", ...rest }: BtnProps) {
  const reduce = useReducedMotion();
  const fine = useFinePointer();
  const x = useSpring(0, { stiffness: 220, damping: 18, mass: 0.4 });
  const y = useSpring(0, { stiffness: 220, damping: 18, mass: 0.4 });
  const active = fine && !reduce;

  const move = (e: PointerEvent<HTMLAnchorElement>) => {
    if (!active) return;
    const r = e.currentTarget.getBoundingClientRect();
    x.set(((e.clientX - r.left) / r.width - 0.5) * 14);
    y.set(((e.clientY - r.top) / r.height - 0.5) * 10);
  };
  const leave = () => {
    x.set(0);
    y.set(0);
  };

  const ext = external ? { target: "_blank", rel: "noopener noreferrer" } : {};

  return (
    <m.a
      {...(rest as object)}
      {...ext}
      onPointerMove={move}
      onPointerLeave={leave}
      style={active ? { x, y } : undefined}
      className={`btn ${variant === "primary" ? "btn-primary" : "btn-ghost"} ${className}`}
      data-cursor="link"
    >
      {icon}
      <span>{children}</span>
      <Arrow />
    </m.a>
  );
}

/* ---------------- Revelação simples ao entrar na tela ---------------- */
export function Reveal({
  children,
  delay = 0,
  className = "",
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li" | "p" | "header";
}) {
  const C = m[as];
  return (
    <C
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.9, delay, ease: EXPO_OUT }}
    >
      {children}
    </C>
  );
}

/** Cabeçalho de seção: número + rótulo + filete. */
export function SectionLabel({ n, children }: { n: string; children: ReactNode }) {
  return (
    <div className="flex items-center gap-4">
      <span className="num">{n}</span>
      <span className="h-px w-10 bg-[var(--line-strong)]" aria-hidden />
      <span className="eyebrow">{children}</span>
    </div>
  );
}

/** Título com UMA palavra em itálico: "Seus benefícios, com *clareza*." */
export function Rich({ text }: { text: string }) {
  const parts = text.split(/\*(.+?)\*/);
  return (
    <>
      {parts.map((p, i) => (i % 2 ? <em key={i}>{p}</em> : <span key={i}>{p}</span>))}
    </>
  );
}
