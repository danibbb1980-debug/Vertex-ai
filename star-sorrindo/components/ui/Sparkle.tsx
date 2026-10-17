/** Brilho de quatro pontas — detalhe decorativo (não é o logotipo). */
export function Sparkle({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true" focusable="false">
      <path d="M12 0c.6 6.4 2.6 10.3 12 12-9.4 1.7-11.4 5.6-12 12-.6-6.4-2.6-10.3-12-12C9.4 10.3 11.4 6.4 12 0z" />
    </svg>
  );
}
