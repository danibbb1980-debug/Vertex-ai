import { useEffect, useRef } from "react";
import { scroll } from "motion";

const ETAPAS = [
  {
    titulo: "Contato e agendamento",
    texto: "Você chama pelo WhatsApp ou envia uma solicitação pelo site. A equipe confirma o melhor dia e horário.",
  },
  {
    titulo: "Avaliação",
    texto: "Uma conversa sobre o seu sono, a sua rotina e o que trouxe você até aqui, com os exames que forem necessários.",
  },
  {
    titulo: "Plano explicado com clareza",
    texto: "Você entende o que foi observado, quais são as opções e por que cada passo foi sugerido.",
  },
  {
    titulo: "Acompanhamento",
    texto: "Retornos para ver como está o uso do tratamento indicado e ajustar o que for preciso.",
  },
];

/** Linha do tempo vertical com progresso ao rolar (adaptada do "Scroll animated timeline" do 21st.dev). */
export function ComoFunciona() {
  const ref = useRef<HTMLOListElement>(null);
  const linha = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const alvo = ref.current;
    const el = linha.current;
    if (!alvo || !el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.transform = "scaleY(1)";
      return;
    }
    // só transform: a linha cresce conforme a leitura avança
    return scroll((p: number) => (el.style.transform = `scaleY(${p.toFixed(4)})`), {
      target: alvo,
      offset: ["start 70%", "end 60%"],
    });
  }, []);

  return (
    <section id="como-funciona" aria-labelledby="como-titulo" className="escuro bg-ink py-24 text-white/85 md:py-36">
      <div className="container-site grid gap-y-14 md:grid-cols-12 md:gap-x-8">
        <div className="md:col-span-4">
          <div className="md:sticky md:top-32">
            <p className="rotulo">Como funciona</p>
            <h2 id="como-titulo" className="titulo mt-5 text-[clamp(2.4rem,5vw,4rem)]">
              Quatro etapas, sem <em>pressa</em>.
            </h2>
            <p className="mt-6 max-w-[30ch] text-white/75">As etapas variam conforme cada caso.</p>
          </div>
        </div>

        <ol ref={ref} className="relative md:col-span-7 md:col-start-6">
          <span aria-hidden="true" className="absolute bottom-6 left-[1.4rem] top-6 w-px bg-white/15 md:left-[2.4rem]" />
          <span
            ref={linha}
            aria-hidden="true"
            className="absolute bottom-6 left-[1.4rem] top-6 w-px origin-top bg-sky md:left-[2.4rem]"
            style={{ transform: "scaleY(0)" }}
          />
          {ETAPAS.map((e, i) => (
            <li key={e.titulo} className="relative grid grid-cols-[2.8rem_1fr] gap-x-6 pb-16 last:pb-0 md:grid-cols-[4.8rem_1fr] md:gap-x-10 md:pb-24">
              <span className="relative z-10 flex h-[2.8rem] w-[2.8rem] items-center justify-center rounded-full border border-white/25 bg-ink text-sm font-semibold text-white md:h-[4.8rem] md:w-[4.8rem]">
                <span className="num text-[1.3rem] md:text-[2.2rem]">{i + 1}</span>
              </span>
              {i === ETAPAS.length - 1 && (
                <span aria-hidden="true" className="absolute bottom-0 left-0 top-[1.4rem] w-[2.8rem] bg-ink md:top-[2.4rem] md:w-[4.8rem]" />
              )}
              <div className="pt-1.5 md:pt-4">
                <h3 className="titulo text-[1.9rem] md:text-[2.6rem]">{e.titulo}</h3>
                <p className="mt-3 max-w-[48ch]">{e.texto}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
