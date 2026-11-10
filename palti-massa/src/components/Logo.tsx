import { NAME_DR_PATH, NAME_MASSA_PATH, NAME_VIEWBOX, SYMBOL_PATH, SYMBOL_VIEWBOX } from "../assets/logoPaths";

/** Desenha o logo uma única vez; os usos abaixo referenciam com <use>. */
export function LogoSprite() {
  return (
    <svg aria-hidden="true" width="0" height="0" style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}>
      <defs>
        <linearGradient id="pm-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#578C9C" />
          <stop offset="1" stopColor="#89BEB4" />
        </linearGradient>
        <symbol id="pm-symbol" viewBox={SYMBOL_VIEWBOX}>
          <path fill="url(#pm-grad)" fillRule="evenodd" d={SYMBOL_PATH} />
        </symbol>
        <symbol id="pm-name" viewBox={NAME_VIEWBOX}>
          <path style={{ fill: "var(--pm-dr, #737373)" }} fillRule="evenodd" d={NAME_DR_PATH} />
          <path style={{ fill: "var(--pm-massa, #5f6366)" }} fillRule="evenodd" d={NAME_MASSA_PATH} />
        </symbol>
      </defs>
    </svg>
  );
}

export function LogoSymbol({ className = "", title }: { className?: string; title?: string }) {
  return (
    <svg viewBox="0 0 182 182" className={className} role={title ? "img" : undefined} aria-hidden={title ? undefined : true} aria-label={title}>
      <use href="#pm-symbol" width="182" height="182" />
    </svg>
  );
}

/** Símbolo + "Dr.Palti Massa" vetorizados do logo original, sem a legenda de especialidades. */
export function Logo({ dark = false, className = "" }: { dark?: boolean; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoSymbol className="h-full w-auto shrink-0" />
      <svg
        viewBox="0 0 204 131"
        className="h-[86%] w-auto"
        aria-hidden="true"
        style={dark ? ({ "--pm-dr": "#d7e4e6", "--pm-massa": "#ffffff" } as React.CSSProperties) : undefined}
      >
        <use href="#pm-name" width="204" height="131" />
      </svg>
      <span className="sr-only">Dr. Palti Massa</span>
    </span>
  );
}
