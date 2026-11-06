import { m, useReducedMotion, useScroll, useSpring } from "motion/react";
import { useRef } from "react";
import { CONFIG } from "../config";
import { Revelar, TituloSecao } from "../components/Revelar";

const ETAPAS = [
  ["Contato e agendamento", "Você fala pelo WhatsApp ou envia uma solicitação pelo formulário. A equipe confirma a disponibilidade."],
  ["Atendimento e conversa", "Começamos ouvindo o que você procura e respondendo às suas dúvidas, sem pressa."],
  ["Orientações claras", "Você recebe explicações sobre o que é possível no seu caso e sobre os cuidados combinados."],
  ["Acompanhamento", "Se surgir alguma dúvida depois, o contato continua aberto pelo WhatsApp."],
];

export function ComoFunciona() {
  const ref = useRef<HTMLOListElement>(null);
  const reduzido = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] });
  const progresso = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  if (!CONFIG.secoes.comoFunciona) return null;
  return (
    <section id="como-funciona" aria-labelledby="titulo-como" className="escuro bg-cacau py-24 text-marfim sm:py-32">
      <div className="container-site relative z-[1] grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div className="lg:sticky lg:top-40 lg:self-start">
          <TituloSecao id="titulo-como" rotulo="Como funciona" antes="Do primeiro contato ao" enfase="acompanhamento." escuro />
          <Revelar atraso={0.1}>
            <p className="mt-6 max-w-md text-marfim/80">Quatro passos simples, sempre com hora marcada e com espaço para as suas perguntas.</p>
          </Revelar>
        </div>
        <ol ref={ref} className="relative space-y-14 pl-14 sm:pl-20 lg:pt-4">
          <span aria-hidden="true" className="absolute bottom-2 left-[1.1rem] top-2 w-px bg-marfim/15 sm:left-[1.6rem]" />
          <m.span
            aria-hidden="true"
            style={reduzido ? undefined : { scaleY: progresso }}
            className="absolute bottom-2 left-[1.1rem] top-2 w-px origin-top bg-ouro-claro sm:left-[1.6rem]"
          />
          {ETAPAS.map(([t, d], i) => (
            <Revelar as="li" key={t} atraso={0.05 * i} className="relative">
              <span aria-hidden="true" className="absolute -left-14 top-0 grid h-9 w-9 place-items-center rounded-full border border-ouro-claro bg-cacau font-serif text-lg text-ouro-claro sm:-left-20 sm:h-[3.25rem] sm:w-[3.25rem] sm:text-xl">
                {i + 1}
              </span>
              <h3 className="text-3xl text-marfim sm:text-4xl">{t}</h3>
              <p className="mt-3 max-w-xl text-marfim/80">{d}</p>
            </Revelar>
          ))}
        </ol>
      </div>
    </section>
  );
}
