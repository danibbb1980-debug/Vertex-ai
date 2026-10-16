const words = ["Força", "Disciplina", "Movimento", "Evolução", "Superação"];

/**
 * Faixa de identidade. O texto é decorativo (as palavras se repetem para o
 * loop), então o leitor de tela recebe uma única versão em lista.
 * Com movimento reduzido, a faixa fica parada.
 */
export function IdentityStrip() {
  const sequence = [...words, ...words];
  return (
    <section aria-label="Valores da VIP Shape" className="relative -ml-[2%] w-[104%] -rotate-1 bg-orange py-4 sm:py-5">
      <ul className="sr-only">
        {words.map((w) => (
          <li key={w}>{w}</li>
        ))}
      </ul>
      <div aria-hidden="true" className="overflow-hidden">
        <div className="flex w-max animate-marquee motion-reduce:animate-none">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0 items-center">
              {sequence.map((word, i) => (
                <span key={`${copy}-${i}`} className="flex items-center">
                  <span className="display px-6 text-2xl text-ink sm:px-9 sm:text-4xl">{word}</span>
                  <svg viewBox="0 0 120 130" className="h-5 w-5 sm:h-6 sm:w-6">
                    <path d="M110 36 60 7 10 36v58l50 29 50-29" fill="none" stroke="#090909" strokeWidth="14" />
                  </svg>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
