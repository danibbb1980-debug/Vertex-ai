"use client";

import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { trackCta } from "@/lib/analytics";

type Variant = "primary" | "secondary" | "ghost" | "whatsapp";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium " +
  "cursor-pointer select-none whitespace-nowrap " +
  "transition-[transform,background-color,box-shadow,border-color] duration-200 ease-out " +
  "active:scale-[0.985] disabled:pointer-events-none disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary:
    "bg-linear-to-r from-brand-deep via-brand to-brand-bright text-white " +
    "shadow-[0_8px_30px_-8px_rgba(124,108,246,0.7)] " +
    "hover:shadow-[0_12px_40px_-8px_rgba(124,108,246,0.9)] hover:-translate-y-0.5",
  secondary:
    "border border-line bg-white/[0.03] text-cloud backdrop-blur-sm " +
    "hover:bg-white/[0.07] hover:border-white/25 hover:-translate-y-0.5",
  ghost: "text-mist hover:text-cloud",
  whatsapp:
    "border border-mint/30 bg-mint/10 text-mint " +
    "hover:bg-mint/15 hover:border-mint/50 hover:-translate-y-0.5",
};

/* min-h-12 keeps every control at or above the 44px touch target minimum. */
const sizes: Record<Size, string> = {
  md: "min-h-12 px-6 text-[0.95rem]",
  lg: "min-h-14 px-8 text-base sm:text-[1.05rem]",
};

type ButtonProps = {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  /** Section name reported to analytics on click. */
  trackAs?: string;
};

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  trackAs,
  onClick,
  ...props
}: ButtonProps & ComponentPropsWithoutRef<"button">) {
  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={(event) => {
        if (trackAs) trackCta(trackAs, String(children));
        onClick?.(event);
      }}
      {...props}
    >
      {children}
    </button>
  );
}

export function LinkButton({
  variant = "primary",
  size = "md",
  className = "",
  children,
  trackAs,
  onClick,
  ...props
}: ButtonProps & ComponentPropsWithoutRef<"a">) {
  return (
    <a
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={(event) => {
        if (trackAs) trackCta(trackAs, String(children));
        onClick?.(event);
      }}
      {...props}
    >
      {children}
    </a>
  );
}
