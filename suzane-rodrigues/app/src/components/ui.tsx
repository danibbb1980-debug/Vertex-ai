import type { ReactNode } from "react";
import { CONFIG, waLink } from "../config";
import { useSeen } from "../lib/hooks";

export function IconWhats({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round">
      <path d="M4.2 19.8l1.1-3.9A8.1 8.1 0 1 1 8.4 19z" />
      <path d="M9.1 8.4c.2-.4.5-.5.8-.5h.5l1 2.2-.7.9c.5 1 1.3 1.8 2.3 2.3l.9-.7 2.2 1v.5c0 .3-.1.6-.5.8-.6.4-1.5.6-2.6.1a8 8 0 0 1-4-4c-.5-1.1-.3-2 .1-2.6z" strokeWidth="1.1" />
    </svg>
  );
}

export function IconInsta({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" strokeWidth="1.4">
      <rect x="3.5" y="3.5" width="17" height="17" rx="0" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r=".6" fill="currentColor" stroke="none" />
    </svg>
  );
}

type BtnProps = {
  href: string;
  children: ReactNode;
  variant?: "solid" | "line" | "light" | "lineLight";
  external?: boolean;
  icon?: ReactNode;
  className?: string;
  label?: string;
};

export function Btn({ href, children, variant = "solid", external, icon, className = "", label }: BtnProps) {
  const ext = external ?? href.startsWith("http");
  return (
    <a
      href={href}
      className={`btn btn--${variant} ${className}`}
      {...(ext ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      aria-label={label}
    >
      {icon}
      <span>{children}</span>
      {ext && <span className="sr-only"> (abre em nova aba)</span>}
    </a>
  );
}

export function AgendarBtn({ texto, children = "Agendar avaliação", variant = "solid", className = "" }: { texto?: string; children?: ReactNode; variant?: BtnProps["variant"]; className?: string }) {
  if (!CONFIG.usarWhatsapp || !CONFIG.whatsapp) return null;
  return (
    <Btn href={waLink(texto)} variant={variant} icon={<IconWhats className="btn__icon" />} className={className}>
      {children}
    </Btn>
  );
}

/** Rótulo de seção com número que se acende ao entrar na tela. */
export function SectionMark({ n, children, tone = "light" }: { n: string; children: ReactNode; tone?: "light" | "dark" }) {
  const [ref, seen] = useSeen<HTMLParagraphElement>(0.6);
  return (
    <p ref={ref} className={`mark mark--${tone} ${seen ? "is-lit" : ""}`}>
      <span className="mark__n">{n}</span>
      <span className="mark__rule" aria-hidden="true" />
      <span className="mark__t">{children}</span>
    </p>
  );
}

/** Divisor: uma curva de nível suave que se desenha da esquerda para a direita. */
export function ContourDivider({ tone = "light" }: { tone?: "light" | "dark" }) {
  const [ref, seen] = useSeen<SVGSVGElement>(0.5);
  return (
    <svg ref={ref} className={`divider divider--${tone} ${seen ? "is-drawn" : ""}`} viewBox="0 0 1200 40" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <path pathLength={1} d="M0 26 C 140 26 190 12 330 14 C 470 16 520 32 660 30 C 800 28 850 10 990 12 C 1090 13 1140 22 1200 22" />
    </svg>
  );
}

export function Lockup({ size = 48, tone = "light", as = "div" }: { size?: number; tone?: "light" | "dark"; as?: "div" | "span" }) {
  const Tag = as;
  return (
    <Tag className={`lockup lockup--${tone}`}>
      <img src={CONFIG.logo.src} alt="" width={size} height={size} className="lockup__medal" />
      <span className="lockup__txt">
        <span className="lockup__name">{CONFIG.nome}</span>
        <span className="lockup__desc">{CONFIG.descritor}</span>
      </span>
    </Tag>
  );
}
