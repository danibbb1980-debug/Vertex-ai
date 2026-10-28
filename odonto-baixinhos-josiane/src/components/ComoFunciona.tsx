import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { modoAtual } from "../config";
import { Cabecalho } from "./Texto";

function etapas() {
  const modo = modoAtual();
  const criancas = modo !== "josiane";
  return [
    {
      titulo: "Contato pelo WhatsApp e agendamento",
      texto:
        modo === "ambas"
          ? "Você fala direto com a profissional escolhida e combina o melhor dia e horário."
          : "Você manda uma mensagem e combina o melhor dia e horário.",
    },
    {
      titulo: "Conversa e conhecimento do espaço",
      texto: criancas
        ? "Na chegada, uma conversa sem pressa. A criança pode conhecer a cadeira e os instrumentos antes de qualquer etapa."
        : "Na chegada, uma conversa sem pressa sobre o que você sente, o que espera e o que te preocupa.",
    },
    {
      titulo: "Avaliação no ritmo do paciente",
      texto: "A avaliação acontece no tempo de cada pessoa, com cada passo explicado antes de acontecer.",
    },
    {
      titulo: "Orientação clara",
      texto: "Ao final, você recebe as orientações e entende quais são os próximos passos, se houver.",
    },
  ];
}

const LinhaProgresso = lazy(() => import("./LinhaProgresso"));

export function ComoFunciona() {
  const lista = useRef<HTMLOListElement>(null);
  const [perto, setPerto] = useState(false);

  // carrega a animação (motion) só quando a seção se aproxima da tela
  useEffect(() => {
    const el = lista.current;
    if (!el || !("IntersectionObserver" in window)) return setPerto(true);
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setPerto(true), io.disconnect()), { rootMargin: "600px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section id="como-funciona" className="relative bg-marfim-2/60 py-20 md:py-28" aria-labelledby="titulo-como">
      <div className="container-site grid gap-12 md:grid-cols-[0.9fr_1.1fr] md:gap-20">
        <div className="md:sticky md:top-36 md:self-start">
          <Cabecalho
            id="titulo-como"
            eyebrow="Como funciona"
            titulo="Do primeiro contato à *orientação*."
            texto={
              modoAtual() === "ambas"
                ? "Quatro passos simples, iguais para crianças e adultos, sempre com tempo para perguntas."
                : "Quatro passos simples, sempre com tempo para perguntas."
            }
          />
        </div>
        <ol ref={lista} className="relative">
            <span className="absolute bottom-6 left-[1.4rem] top-6 w-px bg-linha" aria-hidden="true" />
            {perto ? (
              <Suspense fallback={null}>
                <LinhaProgresso alvo={lista} />
              </Suspense>
            ) : null}
            {etapas().map((e, i) => (
              <li key={e.titulo} className="revela etapa relative grid grid-cols-[2.8rem_1fr] gap-5 pb-12 last:pb-0">
                <span className="etapa-marca relative z-10 flex h-[2.8rem] w-[2.8rem] items-center justify-center rounded-full border border-ouro bg-marfim font-display text-lg italic text-ouro-texto">
                  {i + 1}
                </span>
                <div className="pt-1.5">
                  <h3 className="text-[1.55rem] leading-tight md:text-[1.8rem]">{e.titulo}</h3>
                  <p className="mt-2 max-w-md leading-relaxed text-tinta-2">{e.texto}</p>
                </div>
              </li>
            ))}
          </ol>
      </div>
    </section>
  );
}
