// Inspirado no "Marquee" (21st.dev, Magic UI): faixa contínua e lenta, só transform.
// Pausa fora da tela, ao passar o mouse e com movimento reduzido. Conteúdo duplicado é aria-hidden.
import { useEffect, useRef } from "react";
import { CONFIG } from "../config";
import { curto } from "../lib/horarios";
import { IconeGota } from "./Icones";

export function Marquee() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => el.setAttribute("data-visivel", String(e.isIntersecting)));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const itens = [
    ...CONFIG.atendimentos.map((a) => a.nome),
    ...CONFIG.horarios.map((h) => `${h.rotulo}, ${curto(h.abre)} às ${curto(h.fecha)}`),
    CONFIG.endereco.cidade,
  ];
  if (itens.length === 0) return null;
  const grupo = (oculto: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={oculto || undefined}>
      {itens.map((t, i) => (
        <li key={i} className="flex items-center whitespace-nowrap px-7 font-serif text-2xl text-ameixa/80 sm:text-3xl">
          <IconeGota className="mr-7 size-4 text-salvia" />
          <span className={i % 2 ? "italic" : ""}>{t}</span>
        </li>
      ))}
    </ul>
  );

  return (
    <div ref={ref} className="marquee overflow-hidden border-y border-linha py-6" data-visivel="false">
      <p className="sr-only">{itens.join(". ")}.</p>
      <div className="marquee-trilho" aria-hidden="true">
        {grupo(true)}
        {grupo(true)}
      </div>
    </div>
  );
}
