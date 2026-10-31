import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import { Reveal } from "./Reveal";

const ETAPAS = [
  { t: "Escolha a área e fale com a recepção", d: "Veja as áreas de atendimento e chame a recepção pelo WhatsApp ou pelo telefone fixo." },
  { t: "Agendamento com hora marcada", d: "A recepção confirma a disponibilidade de dia e horário com o profissional." },
  { t: "Atendimento com escuta e explicações claras", d: "No dia marcado, você é recebido no centro e conversa com o profissional sobre o que precisa." },
  { t: "Acompanhamento", d: "Quando houver retorno ou continuidade, o próximo passo é combinado com você." },
];

export function ComoFunciona() {
  const ref = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.4 });

  return (
    <section id="como-funciona" aria-labelledby="como-titulo" className="on-dark relative overflow-hidden bg-night py-20 text-white sm:py-28">
      <div className="grid-mod-dark pointer-events-none absolute inset-0 opacity-70" aria-hidden />
      <div className="wrap relative grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <Reveal className="lg:sticky lg:top-32 lg:self-start">
          <p className="eyebrow">Como funciona</p>
          <h2 id="como-titulo" className="h2 mt-4">
            Do primeiro contato ao <em className="enfase">acompanhamento</em>.
          </h2>
          <p className="lead mt-5">Quatro passos simples, organizados pela recepção.</p>
        </Reveal>

        <ol ref={ref} className="relative grid gap-6 pl-14 sm:pl-16">
          <span className="absolute bottom-6 left-[1.35rem] top-6 w-[3px] rounded-full bg-white/10 sm:left-[1.6rem]" aria-hidden />
          <motion.span
            className="absolute bottom-6 left-[1.35rem] top-6 w-[3px] origin-top rounded-full bg-[#5DB3E8] sm:left-[1.6rem]"
            style={reduce ? { scaleY: 1 } : { scaleY }}
            aria-hidden
          />
          {ETAPAS.map((e, i) => (
            <Reveal as="li" key={e.t} delay={i * 0.05} className="relative rounded-mod border border-white/10 bg-white/[0.04] p-6">
              <span className="absolute -left-14 top-5 grid h-11 w-11 place-items-center rounded-xl bg-[#5DB3E8] font-display text-lg font-semibold text-night sm:-left-16 sm:h-12 sm:w-12">
                {i + 1}
              </span>
              <h3 className="font-display text-xl font-semibold text-white">{e.t}</h3>
              <p className="mt-2 leading-relaxed text-[#C7D6E6]">{e.d}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
