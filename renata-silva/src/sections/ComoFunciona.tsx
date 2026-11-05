import { useRef } from "react";
import { useReduced } from "../lib/motion";
import {m, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import { ClipboardList, Ear, MessageCircle, Repeat } from "lucide-react";
import { CONFIG } from "../config";
import { RevealTitle } from "../components/Reveal";

const ETAPAS = [
  {
    icon: MessageCircle,
    t: "Contato e agendamento",
    d: "Você fala com a clínica pelo WhatsApp ou pelo formulário deste site e combina dia e horário para a avaliação.",
  },
  {
    icon: Ear,
    t: "Avaliação e escuta",
    d: "Conversamos sobre o que você procura, o seu histórico de saúde e a sua rotina de cuidados. É o momento de tirar dúvidas.",
  },
  {
    icon: ClipboardList,
    t: "Plano explicado com clareza",
    d: "Se houver indicação, você recebe a explicação de cada etapa: como funciona, cuidados antes e depois e possíveis contraindicações.",
  },
  {
    icon: Repeat,
    t: "Acompanhamento",
    d: "Ao longo dos atendimentos, a equipe acompanha cada retorno e ajusta o plano quando for preciso.",
  },
];

function Etapa({ e, i, n, progress }: { e: (typeof ETAPAS)[number]; i: number; n: number; progress: MotionValue<number> }) {
  const at = i / (n - 1 || 1);
  const reduce = useReduced();
  const on = useTransform(progress, [Math.max(0, at - 0.08), at], [0.35, 1]);
  const Icon = e.icon;
  return (
    <li className="relative grid grid-cols-[3.5rem_1fr] gap-5 pb-14 last:pb-0 md:grid-cols-[5rem_1fr] md:gap-8">
      <m.div style={reduce ? undefined : { opacity: on }} className="relative z-[1] grid size-14 place-items-center rounded-full border border-rose-700/30 bg-ivory text-rose-700 md:size-20">
        <Icon size={22} strokeWidth={1.3} aria-hidden="true" />
      </m.div>
      <m.div style={reduce ? undefined : { opacity: on }} className="pt-2 md:pt-4">
        <p className="eyebrow text-rose-700">Etapa {String(i + 1).padStart(2, "0")}</p>
        <h3 className="title mt-2 text-[1.9rem] text-ink md:text-[2.3rem]">{e.t}</h3>
        <p className="mt-3 max-w-[34rem] text-ink-soft">{e.d}</p>
      </m.div>
    </li>
  );
}

/** Linha do tempo com progresso ao rolar (adaptada do "Animated Progress Stepper" do 21st.dev). */
export function ComoFunciona() {
  const ref = useRef<HTMLOListElement>(null);
  const reduce = useReduced();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 55%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.3 });
  if (!CONFIG.secoes.comoFunciona) return null;

  return (
    <section id="como-funciona" data-line="left" aria-labelledby="como-titulo" className="on-light relative bg-blush py-24 md:py-36">
      <div className="container-site relative z-[2] grid gap-14 md:grid-cols-[0.8fr_1.2fr] md:gap-20">
        <div className="md:sticky md:top-[calc(var(--banner-h)+var(--header-h)+48px)] md:self-start">
          <p className="eyebrow mb-6 text-rose-700">Como funciona</p>
          <RevealTitle id="como-titulo" text="Um caminho em quatro *etapas*." className="text-[2.6rem] text-ink md:text-[3.6rem]" />
          <p className="mt-6 max-w-[26rem] text-ink-soft">
            Do primeiro contato ao acompanhamento, você sabe o que acontece em cada momento.
          </p>
        </div>

        <ol ref={ref} className="relative">
          <div aria-hidden="true" className="absolute bottom-10 left-7 top-10 w-px bg-rose-700/15 md:left-10" />
          <m.div
            aria-hidden="true"
            className="absolute bottom-10 left-7 top-10 w-px origin-top bg-gradient-to-b from-rose-300 via-rose-400 to-rose-700 md:left-10"
            style={{ scaleY: reduce ? 1 : progress }}
          />
          {ETAPAS.map((e, i) => (
            <Etapa key={e.t} e={e} i={i} n={ETAPAS.length} progress={progress} />
          ))}
        </ol>
      </div>
    </section>
  );
}
