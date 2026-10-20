/** Marca em texto, com um pequeno dente desenhado em SVG. */
export function Logo() {
  return (
    <span className="flex items-center gap-2.5">
      <svg viewBox="0 0 40 40" className="h-9 w-9 shrink-0" aria-hidden="true" focusable="false">
        <circle cx="20" cy="20" r="20" fill="var(--color-mint-50)" />
        <path
          d="M20 12.5c-1.9-1.9-5.3-2.5-7.5-.9-2.6 1.9-2.5 5.6-1.6 8.7.7 2.6 1.2 5.6 1.7 8.2.4 1.9 2.7 2 3.2.1l1.6-5c.6-1.9 4.4-1.9 5 0l1.6 5c.5 1.9 2.8 1.8 3.2-.1.5-2.6 1-5.6 1.7-8.2.9-3.1 1-6.8-1.6-8.7-2.2-1.6-5.6-1-7.5.9z"
          fill="#fff"
          stroke="var(--color-teal)"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <circle cx="29" cy="10.5" r="2.6" fill="var(--color-coral-200)" />
      </svg>
      <span className="flex flex-col leading-none">
        <span className="font-display text-[1.35rem] font-medium tracking-tight text-ink">Tia Lili</span>
        <span className="mt-1 text-[0.68rem] font-semibold tracking-[0.18em] text-teal uppercase">Odontopediatra</span>
      </span>
    </span>
  );
}
