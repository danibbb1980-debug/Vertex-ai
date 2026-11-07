// Linha do tempo com progresso ao rolar (inspirada no "Animated Progress Stepper" do 21st.dev):
// a linha cresce com scaleY conforme a seção passa pela tela, e cada etapa acende ao ser alcançada.
import { motion, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";
import { Cabecalho } from "./Revelar";
import { ComEnfase } from "./TextReveal";

const etapas = [
  { t: "Contato e agendamento", d: "Você chama no WhatsApp ou envia a solicitação pelo site e combina o dia e o horário." },
  { t: "Avaliação", d: "Antes do procedimento, uma conversa para entender o que você procura e avaliar a sua pele." },
  { t: "Atendimento", d: "O procedimento é feito conforme o que foi combinado na avaliação, com explicações ao longo do caminho." },
  { t: "Orientações", d: "Ao final, você recebe as orientações sobre os cuidados após o atendimento." },
];

function Etapa({ i, progresso, t, d }: { i: number; progresso: MotionValue<number>; t: string; d: string }) {
  const limite = (i + 0.35) / etapas.length;
  const ativo = useTransform(progresso, (v): number => (v >= limite ? 1 : 0.25));
  const escala = useTransform(progresso, (v): number => (v >= limite ? 1 : 0.6));
  const texto = useTransform(progresso, (v): number => (v >= limite ? 1 : 0.78));
  return (
    <li className="relative grid grid-cols-[3rem_1fr] gap-5 pb-12 last:pb-0 sm:grid-cols-[4rem_1fr]">
      <div className="relative flex justify-center">
        <span className="relative z-10 grid size-12 place-items-center rounded-full border border-ameixa/20 bg-porcelana font-serif text-lg text-ameixa sm:size-14">
          <motion.span aria-hidden="true" className="absolute inset-1.5 rounded-full bg-nevoa" style={{ opacity: ativo, scale: escala }} />
          <span className="relative">{i + 1}</span>
        </span>
      </div>
      <motion.div style={{ opacity: texto }} className="pt-2 transition-opacity duration-500">
        <h3 className="font-serif text-2xl text-grafite sm:text-[1.7rem]">{t}</h3>
        <p className="mt-2 max-w-lg text-tinta-suave">{d}</p>
      </motion.div>
    </li>
  );
}

export function ComoFunciona() {
  const ref = useRef<HTMLOListElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] });
  const suave = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });
  const progresso = reduced ? scrollYProgress : suave;
  const fixo = useTransform(scrollYProgress, () => 1);

  return (
    <section id="como-funciona" aria-labelledby="titulo-como" className="relative py-20 sm:py-28">
      <div className="mx-auto grid max-w-7xl gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:px-10">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <Cabecalho
            id="titulo-como"
            rotulo="Como funciona"
            titulo={<ComEnfase text="Do primeiro *contato* às orientações." />}
            texto="Quatro etapas simples, sempre com espaço para as suas perguntas."
          />
        </div>
        <ol ref={ref} className="relative">
          <span aria-hidden="true" className="absolute bottom-6 left-6 top-6 w-px -translate-x-1/2 bg-ameixa/12 sm:left-8" />
          <motion.span
            aria-hidden="true"
            className="absolute bottom-6 left-6 top-6 w-0.5 origin-top -translate-x-1/2 rounded-full bg-gradient-to-b from-ameixa to-salvia sm:left-8"
            style={{ scaleY: reduced ? fixo : progresso }}
          />
          {etapas.map((e, i) => (
            <Etapa key={e.t} i={i} progresso={reduced ? fixo : progresso} {...e} />
          ))}
        </ol>
      </div>
    </section>
  );
}
