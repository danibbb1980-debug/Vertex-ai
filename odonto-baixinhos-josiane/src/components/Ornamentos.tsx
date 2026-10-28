/** Ornamentos SVG discretos: ameias (Odonto Baixinhos) e brilho dourado (Dra. Josiane). */

export function Ameias({ className = "", cor = "currentColor" }: { className?: string; cor?: string }) {
  // 7 merlões, base contínua
  return (
    <svg viewBox="0 0 140 22" className={className} aria-hidden="true" focusable="false" preserveAspectRatio="none">
      <path
        fill={cor}
        d="M0 22V6h12v6h8V6h12v6h8V6h12v6h8V6h12v6h8V6h12v6h8V6h12v6h8V6h12v16Z"
      />
    </svg>
  );
}

export function Brilho({ className = "", cor = "currentColor" }: { className?: string; cor?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
      <path fill={cor} d="M12 1.5c.5 4.9 2.6 7.6 7.5 8.5-4.9.9-7 3.6-7.5 8.5-.5-4.9-2.6-7.6-7.5-8.5 4.9-.9 7-3.6 7.5-8.5Z" />
    </svg>
  );
}

export function Torre({ className = "" }: { className?: string }) {
  // pequena torre estilizada, para fundos e divisórias
  return (
    <svg viewBox="0 0 40 56" className={className} aria-hidden="true" focusable="false">
      <path d="M6 56V18h4v-6h5v6h10v-6h5v6h4v38Z" fill="currentColor" />
      <path d="M17 56V44a3 3 0 0 1 6 0v12Z" fill="var(--color-marfim)" opacity=".85" />
    </svg>
  );
}

/** Divisória com ameias na borda superior de uma seção. */
export function BordaAmeias({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none select-none ${className}`} aria-hidden="true">
      <svg viewBox="0 0 1200 24" preserveAspectRatio="none" className="block h-4 w-full md:h-6" focusable="false">
        <path
          fill="currentColor"
          d={
            "M0 24V10" +
            Array.from({ length: 30 }, (_, i) => {
              const x = i * 40;
              return `H${x + 20}V0H${x + 40}V10`;
            }).join("") +
            "V24Z"
          }
        />
      </svg>
    </div>
  );
}
