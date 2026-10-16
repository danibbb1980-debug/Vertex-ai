const words = ["Força", "Disciplina", "Movimento", "Evolução", "Superação"];

/** Faixa de identidade: cada palavra aparece uma única vez, sem animação. */
export function IdentityStrip() {
  return (
    <section aria-label="Valores da VIP Shape" className="relative -ml-[2%] w-[104%] -rotate-1 bg-orange py-4 sm:py-5">
      <ul className="container-site flex flex-wrap items-center justify-center gap-x-5 gap-y-1 sm:gap-x-8 lg:justify-between">
        {words.map((word, i) => (
          <li key={word} className="flex items-center gap-5 sm:gap-8">
            <span className="display text-xl text-ink sm:text-3xl lg:text-4xl">{word}</span>
            {i < words.length - 1 && (
              <svg viewBox="0 0 120 130" className="hidden h-5 w-5 sm:block sm:h-6 sm:w-6" aria-hidden="true">
                <path d="M110 36 60 7 10 36v58l50 29 50-29" fill="none" stroke="#090909" strokeWidth="14" />
              </svg>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
