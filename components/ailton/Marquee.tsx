const words = ["Orientação", "Consistência", "Confiança", "Evolução", "Atenção aos detalhes"];

/**
 * Faixa de palavras em movimento lento entre seções. Puramente decorativa
 * (aria-hidden): o conteúdo é duplicado para o loop ser contínuo, e a
 * animação some com prefers-reduced-motion.
 */
export function Marquee() {
  const row = (
    <div className="flex shrink-0 items-center">
      {words.map((word) => (
        <span key={word} className="flex items-center">
          <span className="ad-outline px-6 font-ad-display text-5xl whitespace-nowrap uppercase md:px-10 md:text-7xl">
            {word}
          </span>
          <span className="size-2 shrink-0 rotate-45 bg-ad-lime" />
        </span>
      ))}
    </div>
  );

  return (
    <div className="overflow-hidden border-y border-ad-line py-8 md:py-10" aria-hidden="true">
      <div className="ad-marquee flex w-max">
        {row}
        {row}
      </div>
    </div>
  );
}
