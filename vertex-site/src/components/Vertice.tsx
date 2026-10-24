/**
 * O detalhe gráfico da marca: duas linhas finas que se encontram num ponto,
 * como os braços do V da logo, com a mesma fresta entre eles.
 */
export function Vertice({ className = "h-3 w-auto text-gold" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 18 15" fill="none" aria-hidden="true">
      <path d="M1 1 L8.2 14" stroke="currentColor" strokeWidth="1.25" strokeLinecap="square" />
      <path d="M17 1 L9.8 14" stroke="currentColor" strokeWidth="1.25" strokeLinecap="square" />
    </svg>
  );
}
