import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { vipWhatsapp, type MessageKey } from "@/lib/studio-vip";

/*
  Peças visuais compartilhadas da página do Studio VIP.
  Todas são Server Components: HTML puro, sem JS no bundle.
*/

type IconProps = { className?: string };

/** Marca do WhatsApp (lucide v1 não tem ícones de marca). */
export function WhatsAppIcon({ className = "size-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.14-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.48.71.31 1.26.49 1.7.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35ZM12.05 21.5h-.01a9.46 9.46 0 0 1-4.82-1.32l-.35-.21-3.58.94.96-3.49-.23-.36a9.43 9.43 0 0 1-1.45-5.04c0-5.22 4.25-9.47 9.48-9.47 2.53 0 4.91.99 6.7 2.78a9.41 9.41 0 0 1 2.77 6.7c0 5.22-4.25 9.47-9.47 9.47Zm8.06-17.53A11.32 11.32 0 0 0 12.05.63C5.77.63.66 5.74.66 12.02c0 2.01.52 3.97 1.52 5.7L.56 23.63l6.05-1.59a11.36 11.36 0 0 0 5.44 1.39h.01c6.28 0 11.39-5.11 11.39-11.39 0-3.04-1.18-5.9-3.34-8.07Z" />
    </svg>
  );
}

export function InstagramIcon({ className = "size-5" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function StarIcon({ className = "size-4" }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" className={className} fill="currentColor" aria-hidden="true">
      <path d="M10 1.6l2.47 5.2 5.7.68-4.2 3.92 1.1 5.64L10 14.25l-5.07 2.8 1.1-5.65L1.83 7.48l5.7-.68L10 1.6Z" />
    </svg>
  );
}

export function ArrowIcon({ className = "size-4" }: IconProps) {
  return (
    <svg
      viewBox="0 0 20 20"
      className={`vip-btn-arrow ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 10h11M11 5l5 5-5 5" />
    </svg>
  );
}

export function PinIcon({ className = "size-5" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </svg>
  );
}

/** Cinco estrelas que acendem em sequência quando entram na tela. */
export function Stars({ className = "size-4" }: IconProps) {
  return (
    <span className="vip-stars reveal inline-flex gap-0.5 text-vip-green" aria-hidden="true">
      {Array.from({ length: 5 }, (_, i) => (
        <StarIcon key={i} className={className} />
      ))}
    </span>
  );
}

/** Os chevrons ">>>" das peças do Instagram. */
export function Chevrons({ className = "" }: IconProps) {
  return (
    <span className={`vip-chevrons inline-flex ${className}`} aria-hidden="true">
      {Array.from({ length: 3 }, (_, i) => (
        <svg key={i} viewBox="0 0 24 32" className="-mr-1.5 h-[1em] w-[0.75em]" fill="currentColor">
          <path d="M2 0h9l11 16-11 16H2l11-16L2 0Z" />
        </svg>
      ))}
    </span>
  );
}

/**
 * Borda de papel rasgado — o acabamento inferior das peças da marca.
 * `fill` é a cor da seção que vem DEPOIS.
 */
export function TornEdge({ fill, flip = false }: { fill: string; flip?: boolean }) {
  return (
    <svg
      className={`vip-torn ${flip ? "rotate-180" : ""}`}
      viewBox="0 0 1200 40"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        fill={fill}
        d="M0 40V20L22 22L60 11L80 27L101 21L137 11L171 16L190 12L221 23L241 17L261 27L292 11L328 13L353 28L372 28L408 22L427 17L446 27L468 19L499 14L534 13L570 19L605 15L626 28L662 16L691 13L726 12L762 11L799 16L832 27L863 20L895 28L927 21L954 17L977 17L997 28L1024 26L1057 20L1089 19L1126 12L1147 26L1178 15L1200 18V40Z"
      />
    </svg>
  );
}

/** Rótulo de seção: barra verde + texto, como "VANDO / Sócio proprietário". */
export function Eyebrow({
  children,
  tone = "light",
}: {
  children: ReactNode;
  tone?: "light" | "dark";
}) {
  return (
    <span
      className={`inline-flex items-center gap-3 text-[0.72rem] font-bold tracking-[0.22em] uppercase ${
        tone === "light" ? "text-white/80" : "text-vip-800"
      }`}
    >
      <span className="h-5 w-1 bg-vip-green" aria-hidden="true" />
      {children}
    </span>
  );
}

type Variant = "primary" | "ghost" | "dark";

type WhatsAppButtonProps = Omit<ComponentPropsWithoutRef<"a">, "href"> & {
  message?: MessageKey;
  variant?: Variant;
  /** Origem do clique, para o analytics delegado. */
  trackAs: string;
  icon?: boolean;
};

/** CTA de WhatsApp. O link é montado só a partir de lib/studio-vip.ts. */
export function WhatsAppLink({
  message = "main",
  variant = "primary",
  trackAs,
  icon = true,
  className = "",
  children,
  ...rest
}: WhatsAppButtonProps) {
  return (
    <a
      href={vipWhatsapp(message)}
      target="_blank"
      rel="noopener noreferrer"
      data-track="whatsapp"
      data-track-label={trackAs}
      className={`vip-btn vip-btn-${variant} ${className}`}
      {...rest}
    >
      {icon && <WhatsAppIcon className="size-5 shrink-0" />}
      <span>{children}</span>
      <span className="sr-only"> (abre o WhatsApp)</span>
    </a>
  );
}
