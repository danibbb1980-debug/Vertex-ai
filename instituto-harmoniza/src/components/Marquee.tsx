import { useEffect, useRef } from "react";

/**
 * Faixa lenta com as áreas de atendimento. Não é carrossel: é só texto
 * decorativo (a lista real está nos cartões). Pausa fora da tela e no hover;
 * com prefers-reduced-motion fica parada.
 */
export function Marquee({ itens }: { itens: string[] }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      el.dataset.pausado = e.isIntersecting ? "false" : "true";
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const grupo = (oculto: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={oculto || undefined}>
      {itens.map((t) => (
        <li key={t} className="flex items-center">
          <span className="px-6 font-display text-[clamp(2.4rem,6vw,5.2rem)] leading-none font-normal text-tinta/80 italic md:px-10">
            {t}
          </span>
          <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true" className="shrink-0 text-ouro">
            <path d="M2 14c6 0 6-8 12-8s6 8 12 8" fill="none" stroke="currentColor" strokeWidth="1" />
            <circle cx="14" cy="6" r="2" fill="currentColor" />
          </svg>
        </li>
      ))}
    </ul>
  );

  return (
    <div ref={ref} className="marquee relative z-10 overflow-hidden border-y border-linha py-8 md:py-12" data-pausado="true">
      <p className="sr-only">Áreas de atendimento: {itens.join(", ")}.</p>
      <div className="marquee-trilho" aria-hidden="true">
        {grupo(false)}
        {grupo(true)}
      </div>
    </div>
  );
}
