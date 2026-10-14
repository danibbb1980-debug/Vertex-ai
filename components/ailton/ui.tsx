import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { waLink, type MessageKey } from "@/lib/ailton";

/**
 * Primitivas visuais da landing do Ailton. Todas são Server Components:
 * os botões são links puros e o rastreamento vem do listener delegado do
 * ClientEnhancements (atributos data-track).
 */

type IconProps = { className?: string };

export function WhatsAppIcon({ className = "size-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.06 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.48.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35M12.04 21.5h-.01a9.47 9.47 0 0 1-4.83-1.32l-.35-.21-3.59.94.96-3.5-.23-.36a9.45 9.45 0 0 1-1.45-5.05c0-5.23 4.26-9.49 9.5-9.49a9.43 9.43 0 0 1 6.71 2.78 9.43 9.43 0 0 1 2.78 6.72c0 5.23-4.26 9.49-9.49 9.49m8.08-17.57A11.35 11.35 0 0 0 12.04.58C5.74.58.62 5.7.62 12c0 2.01.53 3.98 1.53 5.71L.52 23.6l6.04-1.58a11.4 11.4 0 0 0 5.47 1.39h.01c6.3 0 11.42-5.12 11.42-11.42 0-3.05-1.19-5.92-3.34-8.07" />
    </svg>
  );
}

export function ArrowIcon({ className = "size-4" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="square"
      aria-hidden="true"
    >
      <path d="M4 12h15M13 6l6 6-6 6" />
    </svg>
  );
}

export function ArrowUpRightIcon({ className = "size-4" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="square"
      aria-hidden="true"
    >
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}

/** Cinco estrelas. Decorativas — o texto ao lado sempre diz a nota. */
export function Stars({ className = "size-3.5" }: IconProps) {
  return (
    <span className="inline-flex gap-0.5 text-ad-lime" aria-hidden="true">
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} viewBox="0 0 20 20" className={className} fill="currentColor">
          <path d="M10 1.5l2.6 5.5 6 .7-4.5 4.1 1.2 5.9L10 14.8l-5.3 2.9 1.2-5.9L1.4 7.7l6-.7z" />
        </svg>
      ))}
    </span>
  );
}

/** Rótulo de seção: traço curto + texto espaçado. */
export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p
      className={`flex items-center gap-3 text-[0.7rem] font-medium tracking-[0.28em] text-ad-mute uppercase ${className}`}
    >
      <span className="h-px w-8 bg-ad-lime" aria-hidden="true" />
      {children}
    </p>
  );
}

const btnBase =
  "group inline-flex min-h-14 items-center justify-center gap-3 px-6 text-[0.78rem] font-semibold " +
  "text-center tracking-[0.12em] min-[360px]:whitespace-nowrap sm:px-7 sm:tracking-[0.16em] uppercase transition-[background-color,border-color,color,transform] duration-300 " +
  "active:scale-[0.98] select-none";

type WhatsAppButtonProps = {
  message: MessageKey;
  children: ReactNode;
  /** Seção reportada ao analytics. */
  trackAs: string;
  className?: string;
};

/** CTA principal: abre o WhatsApp com a mensagem do contexto. */
export function WhatsAppCta({ message, children, trackAs, className = "" }: WhatsAppButtonProps) {
  return (
    <a
      href={waLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      data-track={`ailton_${trackAs}`}
      data-track-label={typeof children === "string" ? children : undefined}
      className={`${btnBase} ad-btn-primary bg-ad-lime text-ad-black hover:bg-[#d4f78a] ${className}`}
    >
      <WhatsAppIcon className="size-5 shrink-0" />
      <span>{children}</span>
      <ArrowIcon className="ad-btn-arrow size-4 shrink-0" />
    </a>
  );
}

/** Botão de contorno, para ações secundárias (âncoras e links externos). */
export function OutlineButton({
  children,
  className = "",
  external = false,
  icon = "arrow",
  ...props
}: ComponentPropsWithoutRef<"a"> & { external?: boolean; icon?: "arrow" | "out" | "down" }) {
  return (
    <a
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`${btnBase} ad-btn-secondary border border-ad-paper/25 text-ad-paper hover:border-ad-paper hover:bg-ad-paper hover:text-ad-black ${className}`}
      {...props}
    >
      <span>{children}</span>
      {icon === "out" ? (
        <ArrowUpRightIcon className="ad-btn-arrow size-4 shrink-0" />
      ) : icon === "down" ? (
        <ArrowIcon className="size-4 shrink-0 rotate-90 transition-transform duration-300 group-hover:translate-y-0.5" />
      ) : (
        <ArrowIcon className="ad-btn-arrow size-4 shrink-0" />
      )}
    </a>
  );
}
