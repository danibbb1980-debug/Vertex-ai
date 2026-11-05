import { m, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { CONFIG } from "../config";
import { Emblem } from "../components/Emblem";
import { MagneticLink } from "../components/Magnetic";
import { waLink } from "../lib/whatsapp";
import { useMotionOk } from "../lib/useMotionOk";

const LINHAS: { t: string; em?: boolean }[] = [{ t: "Cada caso" }, { t: "começa por" }, { t: "ouvir.", em: true }];

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const ok = useMotionOk();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, ok ? 140 : 0]);
  const rot = useTransform(scrollYProgress, [0, 1], [0, ok ? -4 : 0]);

  return (
    <section
      id="inicio"
      ref={ref}
      className={`relative overflow-hidden ${CONFIG.rascunho ? "pt-[8.5rem] md:pt-40" : "pt-28 md:pt-32"}`}
      aria-labelledby="hero-titulo"
    >
      {/* Emblema em linhas finas, com parallax leve */}
      <m.div
        aria-hidden
        style={{ y, rotate: rot }}
        className="pointer-events-none absolute -right-28 top-24 w-[17rem] text-gold/30 sm:-right-16 sm:top-32 sm:w-[24rem] sm:text-gold/40 lg:right-[3%] lg:top-36 lg:w-[25rem] lg:text-gold/60 xl:right-[5%] xl:w-[28rem]"
      >
        <div className="fade-up" style={{ animationDelay: "0.35s", animationDuration: "1.6s" }}>
          <Emblem variant="linha" className="h-auto w-full" />
        </div>
      </m.div>

      <div className="wrap relative">
        <p className="eyebrow fade-up max-w-[22rem] text-ink-soft sm:max-w-none" style={{ animationDelay: "0.05s" }}>
          Advocacia · Trabalhista · Família · Cível · Previdenciário
        </p>

        <h1
          id="hero-titulo"
          className="mt-7 text-[clamp(3.4rem,13vw,8.75rem)] leading-[0.94] tracking-[-0.035em] md:mt-9"
        >
          {LINHAS.map((l, i) => (
            <span key={l.t} className="line-mask">
              <span style={{ animationDelay: `${0.12 + i * 0.11}s` }}>
                {l.em ? <em>{l.t}</em> : l.t}
              </span>
            </span>
          ))}
        </h1>

        <div className="mt-10 grid gap-10 md:mt-14 md:grid-cols-12">
          <div className="md:col-span-7 lg:col-span-6">
            <div className="rule draw-x w-24" aria-hidden />
            <p className="fade-up mt-7 max-w-[34rem] text-[1.125rem] leading-[1.6] text-ink-soft md:text-[1.2rem]" style={{ animationDelay: "0.55s" }}>
              Orientação jurídica com escuta, clareza e acompanhamento do início ao fim. Atendimento on-line em todo o Brasil.
            </p>
            <div className="fade-up mt-9 flex flex-col gap-3 sm:flex-row sm:items-center" style={{ animationDelay: "0.7s" }}>
              <MagneticLink href={waLink()} external size="lg">
                Falar pelo WhatsApp
              </MagneticLink>
              <MagneticLink href="#areas" variant="outline" size="lg">
                Conhecer as áreas
              </MagneticLink>
            </div>
          </div>
        </div>
      </div>

      {/* Faixa de informações práticas */}
      <div className="wrap relative mt-20 md:mt-28">
        <dl className="fade-up grid border-t border-line text-[0.95rem] sm:grid-cols-3" style={{ animationDelay: "0.9s" }}>
          {[
            ["Presencial", `${CONFIG.endereco.cidade}, ${CONFIG.endereco.uf}`],
            ["On-line", "Em todo o Brasil"],
            ["Horário", "Seg. a sex., 09h às 18h"],
          ].map(([k, v], i) => (
            <div key={k} className={`flex items-baseline justify-between gap-4 border-b border-line py-5 sm:block sm:border-b-0 sm:py-7 ${i > 0 ? "sm:border-l sm:pl-6" : ""}`}>
              <dt className="eyebrow text-ink-soft">{k}</dt>
              <dd className="font-serif text-[1.3rem] leading-tight sm:mt-2">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
