import { useEffect, useRef, useState } from "react";
import { Sparkle } from "./Decor";

const ITENS = [
  "Bebês",
  "Crianças",
  "Adolescentes",
  "Acolhimento",
  "Explicações claras para a família",
  "No tempo de cada criança",
  "Alfenas - MG",
];

/**
 * Faixa de texto que desliza devagar (adaptada do padrão "marquee").
 * Pausa fora da tela, ao passar o mouse e com preferência por menos movimento.
 */
export function Marquee() {
  const ref = useRef<HTMLDivElement>(null);
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisivel(e.isIntersecting), { rootMargin: "80px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const grupo = (copia: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={copia || undefined}>
      {ITENS.map((t) => (
        <li key={t} className="flex items-center">
          <span className="px-6 font-display text-2xl whitespace-nowrap text-ink italic md:px-9 md:text-[2rem]">{t}</span>
          <Sparkle filled className="h-4 w-4 shrink-0 text-coral" />
        </li>
      ))}
    </ul>
  );

  return (
    <div
      ref={ref}
      className={`group relative overflow-hidden border-y border-line bg-butter-50 py-6 md:py-8 ${visivel ? "" : "pausado"}`}
      style={{
        maskImage: "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)",
        WebkitMaskImage: "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)",
      }}
    >
      <p className="sr-only">{ITENS.join(", ")}</p>
      <div className="marquee-track flex w-max group-hover:[animation-play-state:paused]" aria-hidden>
        {grupo(false)}
        {grupo(true)}
      </div>
    </div>
  );
}
