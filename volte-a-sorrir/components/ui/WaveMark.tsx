type WaveMarkProps = { className?: string };

/**
 * As três ondas que a clínica usa nos posts do Instagram (coral → laranja),
 * redesenhadas como um detalhe pequeno ao lado dos rótulos de seção.
 */
export function WaveMark({ className = "h-3.5 w-7" }: WaveMarkProps) {
  return (
    <svg viewBox="0 0 28 14" fill="none" aria-hidden className={className}>
      <path d="M1 2.5c3.25 0 3.25 2 6.5 2s3.25-2 6.5-2 3.25 2 6.5 2 3.25-2 6.5-2" stroke="#d85e4e" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M1 7c3.25 0 3.25 2 6.5 2s3.25-2 6.5-2 3.25 2 6.5 2S23.75 7 27 7" stroke="#e57a4a" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M1 11.5c3.25 0 3.25 2 6.5 2s3.25-2 6.5-2 3.25 2 6.5 2 3.25-2 6.5-2" stroke="#f09a55" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

type EyebrowProps = { children: React.ReactNode; className?: string; tone?: "navy" | "coral" | "sun" };

export function Eyebrow({ children, className = "", tone = "coral" }: EyebrowProps) {
  const color = { navy: "text-navy", coral: "text-coral-ink", sun: "text-sun" }[tone];
  return (
    <p className={`eyebrow flex items-center gap-3 ${color} ${className}`}>
      <WaveMark />
      <span>{children}</span>
    </p>
  );
}
