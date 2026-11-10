import { m as motion, useMotionValue, useReducedMotion, useScroll, useSpring } from "motion/react";
import { useRef } from "react";
import { SectionTitle } from "../components/Reveal";

const ETAPAS = [
  { t: "Contato e agendamento", d: "Você fala com a clínica pelo WhatsApp ou pelo formulário deste site e combina o dia e o horário." },
  { t: "Consulta e avaliação", d: "Uma conversa sobre objetivos, histórico, rotina e hábitos, com avaliação clínica. Se tiver exames anteriores, leve." },
  { t: "Plano explicado com clareza", d: "O médico explica os caminhos indicados para o seu caso, o porquê de cada escolha, e responde às suas dúvidas." },
  { t: "Acompanhamento", d: "Consultas de retorno para acompanhar a evolução e ajustar o plano sempre que a avaliação indicar." },
];

/** Linha do tempo com progresso ao rolar (inspirada no "Animated Progress Stepper" do 21st.dev). */
export function ComoFunciona() {
  const ref = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 55%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 28 });
  const cheio = useMotionValue(1);
  return (
    <section id="como-funciona" aria-labelledby="titulo-como" className="relative bg-white py-20 sm:py-28">
      <div className="container-site relative z-10 grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        <div className="lg:sticky lg:top-36 lg:self-start">
          <SectionTitle
            id="titulo-como"
            rotulo="Como funciona"
            titulo="Do primeiro contato ao acompanhamento."
            enfase="acompanhamento"
            intro={<p>Quatro etapas simples. O ritmo de cada uma é combinado com você.</p>}
          />
        </div>
        <ol ref={ref} className="relative">
          <div aria-hidden="true" className="absolute bottom-6 left-[1.4rem] top-6 w-px bg-linha" />
          <motion.div
            aria-hidden="true"
            className="absolute bottom-6 left-[1.4rem] top-6 w-px origin-top bg-gradient-to-b from-petroleo-500 to-agua-400"
            style={{ scaleY: reduce ? cheio : scaleY }}
          />
          {ETAPAS.map((e, i) => (
            <Step key={e.t} n={i + 1} {...e} />
          ))}
        </ol>
      </div>
    </section>
  );
}

function Step({ n, t, d }: { n: number; t: string; d: string }) {
  return (
    <motion.li
      className="relative grid grid-cols-[2.8rem_1fr] gap-5 pb-12 last:pb-0"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ margin: "0px 0px -15% 0px", once: true }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <span className="relative z-10 flex size-[2.8rem] items-center justify-center overflow-hidden rounded-full border border-linha bg-white font-display text-xl font-semibold text-petroleo-800 shadow-suave">
        <motion.span
          aria-hidden="true"
          className="absolute inset-0 rounded-full bg-gradient-to-b from-agua-300/70 to-agua-300/30"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ margin: "0px 0px -50% 0px", once: true }}
          transition={{ type: "spring", stiffness: 180, damping: 20 }}
        />
        <span className="relative">{String(n).padStart(2, "0")}</span>
      </span>
      <div className="pt-1.5">
        <h3 className="text-[1.75rem] font-semibold">{t}</h3>
        <p className="mt-2 max-w-lg text-cinza">{d}</p>
      </div>
    </motion.li>
  );
}
