import type { ReactNode } from "react";

export const WRAP = "relative mx-auto max-w-[1280px] px-5 md:px-10 lg:px-14";

/** Nó do fio (só em telas grandes): pequeno losango na margem, à altura do rótulo. */
export function Node({ className = "" }: { className?: string }) {
  return (
    <span
      data-fio
      aria-hidden="true"
      className={`absolute -left-[31px] top-1/2 z-[6] hidden h-[7px] w-[7px] -translate-y-1/2 rotate-45 border border-emerald bg-paper lg:block ${className}`}
    />
  );
}

/** Rótulo de seção com o nó do fio alinhado. */
export function Rotulo({ children, tone = "dark" }: { children: ReactNode; tone?: "dark" | "light" }) {
  return (
    <p className={`label relative flex items-center gap-3 ${tone === "dark" ? "text-emerald-deep" : "text-leaf"}`}>
      {tone === "dark" && <Node />}
      <span aria-hidden="true" className="inline-block h-px w-6 bg-current" />
      {children}
    </p>
  );
}

/** Título com uma palavra em ênfase: passe a palavra entre * no texto. */
export function Enfase({ text, className = "text-emerald" }: { text: string; className?: string }) {
  const parts = text.split("*");
  return (
    <>
      {parts.map((p, i) =>
        i % 2 ? (
          <span key={i} className={className}>
            {p}
          </span>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  );
}
