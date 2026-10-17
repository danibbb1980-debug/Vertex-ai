/**
 * Representação tipográfica TEMPORÁRIA da marca "Star Sorrindo Implantes".
 * O logotipo oficial (dente com implante) só foi recebido em 150 px
 * (public/brand/logo-original-150.jpg), resolução baixa demais para o site.
 * Quando a clínica enviar o arquivo vetorial (SVG/PDF) ou PNG em alta, salve
 * em public/brand/ e troque este componente por um <img>. Não redesenhamos o
 * símbolo para não alterar a identidade da marca.
 */
export function Logo({ tone = "navy", className = "" }: { tone?: "navy" | "ivory"; className?: string }) {
  const main = tone === "navy" ? "text-navy" : "text-ivory";
  const sub = tone === "navy" ? "text-gold-ink" : "text-gold";
  return (
    <span className={`inline-flex flex-col leading-none ${className}`}>
      <span className={`font-serif text-[1.6rem] font-semibold tracking-[-0.01em] ${main}`}>Star Sorrindo</span>
      <span className={`mt-1 text-[0.58rem] font-semibold tracking-[0.26em] uppercase ${sub}`}>Implantes · Poços de Caldas</span>
    </span>
  );
}
