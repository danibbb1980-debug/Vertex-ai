import { useRef } from "react";
import { useScroll } from "motion/react";
import { CONFIG, waLink } from "../config";
import { ArrowIcon, WhatsIcon } from "./Icons";
import { ModularCross } from "./ModularCross";
import { TextReveal } from "./Reveal";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  return (
    <section id="inicio" ref={ref} className={`relative overflow-hidden ${CONFIG.rascunho ? "pt-[6.75rem]" : "pt-[4.75rem]"}`}>
      <div className="grid-mod pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_70%_40%,#000_10%,transparent_70%)]" aria-hidden />
      <div className="wrap relative grid items-center gap-6 pb-16 pt-8 sm:pt-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10 lg:pb-24 lg:pt-16">
        <div>
          <p className="eyebrow">Centro de saúde · Pouso Alegre - MG</p>
          <h1 className="mt-5 font-display text-[2.45rem] font-semibold leading-[1.04] text-night sm:text-6xl lg:text-[4.1rem]">
            <TextReveal text="Várias áreas da saúde, em um só endereço." emphasis="endereço" />
          </h1>
          <p className="lead mt-6 max-w-xl">
            Atendimento com hora marcada em odontologia, medicina, nutrição, saúde mental, fisioterapia e estética.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href={waLink(CONFIG.mensagens.geral)} target="_blank" rel="noopener noreferrer" className="btn-primary">
              <WhatsIcon /> Agendar atendimento
            </a>
            <a href="#areas" className="btn-ghost">
              Ver áreas <ArrowIcon />
            </a>
          </div>
          <p className="mt-8 text-sm text-graphite-soft">
            {CONFIG.endereco.rua} · {CONFIG.endereco.bairro} · Seg. a sex., 07h00 às 19h30
          </p>
        </div>
        <div className="relative mx-auto w-[min(62vw,300px)] sm:w-[min(60vw,380px)] lg:w-full lg:max-w-[460px]">
          <div className="absolute inset-[8%] rounded-[2.5rem] bg-brand-soft/70" aria-hidden />
          <ModularCross progress={scrollYProgress} className="relative h-auto w-full" />
        </div>
      </div>
    </section>
  );
}
