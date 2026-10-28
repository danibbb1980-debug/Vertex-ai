import { CONFIG, descritor } from "../config";

/** Traço gráfico original: um broto curvo com uma estrela no alto ("crescer com cuidado"). */
export function Marca({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden focusable={false}>
      <circle cx="20" cy="20" r="19" fill="var(--color-sage-100)" />
      <path
        d="M14 31c4.5-2.5 6.2-6.8 6.2-12.2"
        fill="none"
        stroke="var(--color-sage-deep)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M20.2 22.5c.4-3.6 2.9-5.6 6.6-5.4-.2 3.4-2.9 5.5-6.6 5.4Z"
        fill="var(--color-sage-500)"
      />
      <path
        d="M20.3 7.5c.3 2.4 1.5 3.6 4.9 4.9-3.4 1.3-4.6 2.5-4.9 4.9-.3-2.4-1.5-3.6-4.9-4.9 3.4-1.3 4.6-2.5 4.9-4.9Z"
        fill="var(--color-coral)"
      />
    </svg>
  );
}

/** Assinatura tipográfica. Substitua pelo logo oficial quando houver. */
export function Assinatura({ claro = false }: { claro?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <Marca className="h-10 w-10 shrink-0" />
      <span className="flex flex-col leading-none">
        <span
          className={`font-display text-[1.28rem] font-medium tracking-tight whitespace-nowrap ${claro ? "text-cream" : "text-ink"}`}
          style={{ fontVariationSettings: '"SOFT" 100' }}
        >
          <span className="text-[0.85em] italic">Dra.</span> {CONFIG.nomeCurto}
        </span>
        <span
          className={`mt-1 text-[0.66rem] font-extrabold uppercase tracking-[0.2em] ${claro ? "text-sage" : "text-sage-deep"}`}
        >
          {descritor}
        </span>
      </span>
    </span>
  );
}
