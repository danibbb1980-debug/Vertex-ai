import { useEffect, useRef, useState } from "react";
import { CONFIG } from "../config";

/** Marquee discreto (inspirado no "Infinite Marquee" do 21st.dev): só transform, pausa fora da tela e no hover. */
export function Marquee() {
  const ref = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(true);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setPaused(!e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const itens = ["Avaliação individual", "Plano explicado com clareza", "Acompanhamento médico", "Hora marcada", `${CONFIG.cidade} - ${CONFIG.uf}`];
  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {itens.map((t) => (
        <li key={t} className="flex items-center whitespace-nowrap px-6 font-display text-2xl font-medium text-petroleo-800/80 sm:text-[1.75rem]">
          {t}
          <span aria-hidden="true" className="ml-12 inline-block size-2 rounded-full bg-gradient-to-b from-petroleo-500 to-agua-400" />
        </li>
      ))}
    </ul>
  );
  return (
    <div ref={ref} className="marquee relative overflow-hidden border-y border-linha/80 bg-white/60 py-5 [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
      <p className="sr-only">{itens.join(", ")}.</p>
      <div className="marquee-track flex w-max" data-paused={paused} aria-hidden="true">
        {row(true)}
        {row(true)}
      </div>
    </div>
  );
}
