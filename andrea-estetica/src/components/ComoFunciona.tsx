import { useEffect, useRef } from "react";
import { Arco, Hora } from "./ui";

const ETAPAS = [
  {
    t: "Contato e agendamento",
    d: "Você chama no WhatsApp ou envia o pedido pelo formulário aqui do site. A Andrea responde com os horários livres.",
  },
  {
    t: "Conversa e avaliação",
    d: "Antes de começar, uma conversa sobre o que você procura e uma avaliação individual para ver o que faz sentido.",
  },
  {
    t: "Atendimento",
    d: "No horário marcado, o atendimento é individual, com o tempo reservado para você.",
  },
  {
    t: "Acompanhamento",
    d: "Depois, vocês combinam se e quando vale marcar o próximo horário.",
  },
];

/** Linha do tempo vertical com progresso ligado à rolagem (só transform). */
export default function ComoFunciona({ hora }: { hora: string }) {
  const ref = useRef<HTMLOListElement>(null);
  const barra = useRef<HTMLSpanElement>(null);

  // Progresso ligado à rolagem; só calcula enquanto a lista está na tela.
  useEffect(() => {
    const ol = ref.current;
    const el = barra.current;
    if (!ol || !el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.transform = "scaleY(1)";
      return;
    }
    let raf = 0;
    let ativo = false;
    const calc = () => {
      raf = 0;
      const r = ol.getBoundingClientRect();
      const vh = window.innerHeight;
      const ini = vh * 0.75 - r.top;
      const p = Math.min(1, Math.max(0, ini / (r.height + vh * 0.2)));
      el.style.transform = `scaleY(${p})`;
    };
    const on = () => {
      if (ativo && !raf) raf = requestAnimationFrame(calc);
    };
    const io = new IntersectionObserver(([e]) => {
      ativo = e.isIntersecting;
      on();
    });
    io.observe(ol);
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    calc();
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
    };
  }, []);

  return (
    <section id="como-funciona" aria-labelledby="t-como" className="relative">
      <Arco className="mx-auto max-w-[1240px] px-5 sm:px-8" />
      <div className="mx-auto grid max-w-[1240px] gap-y-14 px-5 pb-24 pt-16 sm:px-8 sm:pb-32 lg:grid-cols-12 lg:gap-x-10">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-40">
            <Hora hora={hora} />
            <h2 id="t-como" className="titulo mt-6 text-[clamp(2.6rem,5.4vw,4.2rem)]">
              Como funciona o <span className="enfase">primeiro</span> horário
            </h2>
            <p className="mt-6 max-w-[24rem] text-grafite/85">
              Do primeiro contato ao atendimento, em quatro passos.
            </p>
          </div>
        </div>

        <ol ref={ref} className="relative lg:col-span-6 lg:col-start-7">
          <span aria-hidden="true" className="absolute bottom-3 left-[1.15rem] top-3 w-px bg-grafite/20" />
          <span
            ref={barra}
            aria-hidden="true"
            className="absolute bottom-3 left-[1.15rem] top-3 w-[2px] -translate-x-[0.5px] origin-top bg-ocre transition-transform duration-300 ease-out"
            style={{ transform: "scaleY(0)" }}
          />
          {ETAPAS.map((e, i) => (
            <li key={e.t} className="relative grid grid-cols-[2.3rem_1fr] gap-x-6 pb-14 last:pb-0">
              <span
                aria-hidden="true"
                className="titulo relative z-10 flex size-[2.3rem] items-center justify-center border border-grafite/40 bg-linho text-lg tab"
              >
                {i + 1}
              </span>
              <div className="pt-0.5">
                <h3 className="titulo text-[1.85rem] leading-tight">
                  <span className="sr-only">Etapa {i + 1}: </span>
                  {e.t}
                </h3>
                <p className="mt-3 max-w-[28rem] text-grafite/85">{e.d}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
