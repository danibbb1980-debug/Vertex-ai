import { useEffect, useRef } from "react";
import { modoAtual } from "../config";
import { Brilho } from "./Ornamentos";

const ITENS = {
  ambas: ["Bebês", "Crianças", "Pessoas com deficiência", "Gestantes", "Adultos", "Hora marcada", "Acessibilidade para cadeirantes", "Centro de Alfenas"],
  aline: ["Bebês", "Crianças", "Pessoas com deficiência", "Gestantes", "Hora marcada", "Acessibilidade para cadeirantes", "Centro de Alfenas"],
  josiane: ["Adultos", "Atendimento individualizado", "Hora marcada", "Acessibilidade para cadeirantes", "Centro de Alfenas"],
};

export function Marquee() {
  const ref = useRef<HTMLDivElement>(null);
  const itens = ITENS[modoAtual()];

  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([e]) => el.setAttribute("data-pausado", String(!e.isIntersecting)));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const grupo = (oculto: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={oculto || undefined}>
      {itens.map((t) => (
        <li key={t} className="flex items-center gap-8 pr-8 font-display text-[1.35rem] italic text-tinta md:text-[1.7rem]">
          {t}
          <Brilho className="h-3.5 w-3.5 text-ouro" />
        </li>
      ))}
    </ul>
  );

  return (
    <div ref={ref} className="marquee relative overflow-hidden border-y border-linha bg-marfim-2 py-5" role="region" aria-label="Quem atendemos">
      <div className="marquee-trilho">
        {grupo(false)}
        <div aria-hidden="true" className="flex shrink-0">{grupo(true)}</div>
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-marfim-2 to-transparent" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-marfim-2 to-transparent" aria-hidden="true" />
    </div>
  );
}
