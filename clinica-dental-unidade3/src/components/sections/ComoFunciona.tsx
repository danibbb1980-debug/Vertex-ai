/*
  Linha do tempo com progresso ao rolar. Inspirada em "Animated Progress Stepper"
  e "Scroll Progress" (21st.dev); implementação própria com scaleY (só transform).
*/
import { m, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { useRef } from "react";
import { IconeCiclo, IconeConversa, IconePrancheta, IconeCalendario } from "../ui/Icones";
import { Revelar } from "../ui/Revelar";
import { TituloSecao } from "../ui/TituloSecao";

const ETAPAS = [
  {
    icone: IconeCalendario,
    titulo: "Contato e agendamento",
    texto: "Você fala com a clínica pelo WhatsApp ou envia uma solicitação pelo site. A equipe confirma o dia e o horário disponíveis.",
  },
  {
    icone: IconeConversa,
    titulo: "Avaliação e escuta",
    texto: "Na consulta, entendemos o que você procura, fazemos o exame com cuidado e respondemos às suas dúvidas.",
  },
  {
    icone: IconePrancheta,
    titulo: "Plano explicado com clareza",
    texto: "As possibilidades são apresentadas em linguagem simples, com etapas e cuidados, para você decidir com tranquilidade.",
  },
  {
    icone: IconeCiclo,
    titulo: "Acompanhamento",
    texto: "Seguimos juntos nas etapas combinadas e nos retornos, ajustando o plano sempre que for preciso.",
  },
];

export function ComoFunciona() {
  const lista = useRef<HTMLOListElement>(null);
  const reduzido = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: lista, offset: ["start 75%", "end 55%"] });
  const suave = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });
  const escala = useTransform(suave, (v) => (reduzido ? 1 : v));

  return (
    <section id="como-funciona" aria-labelledby="titulo-como" className="relative py-24 sm:py-32">
      <div className="container-site grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <Revelar className="lg:sticky lg:top-40 lg:self-start">
          <TituloSecao
            id="titulo-como"
            rotulo="Como funciona"
            titulo="Do primeiro contato ao *acompanhamento*."
            texto="Um caminho simples e previsível, para você saber o que esperar em cada etapa."
          />
        </Revelar>

        <ol ref={lista} className="relative">
          <span aria-hidden="true" className="absolute bottom-6 left-[1.6rem] top-6 w-px bg-line" />
          <m.span
            aria-hidden="true"
            className="absolute bottom-6 left-[calc(1.6rem-0.5px)] top-6 w-0.5 origin-top bg-gradient-to-b from-teal-600 via-teal-400 to-gold-400"
            style={{ scaleY: escala }}
          />
          {ETAPAS.map((e, i) => (
            <li key={e.titulo} className="relative pb-12 pl-20 last:pb-0">
              <Revelar atraso={0.05}>
                <span className="absolute left-0 top-0 grid size-[3.25rem] place-items-center rounded-full border border-line bg-white text-teal-700 shadow-[0_8px_24px_-14px_rgb(2_24_38/0.5)]">
                  <e.icone tamanho={22} />
                </span>
                <p className="rotulo pt-1 text-[0.68rem] text-gold-700">Etapa {i + 1}</p>
                <h3 className="mt-2 text-2xl text-navy-900 sm:text-[1.75rem]">{e.titulo}</h3>
                <p className="mt-3 max-w-lg text-ink-soft">{e.texto}</p>
              </Revelar>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
