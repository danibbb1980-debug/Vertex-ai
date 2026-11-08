import { m, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { CONFIG } from "../config";
import { DarkSection } from "../components/DarkSection";
import { SectionHead } from "../components/SectionHead";
import { Reveal, Rule } from "../components/Reveal";
import { Emblem } from "../components/Emblem";
import { useMotionOk } from "../lib/useMotionOk";

function capitalizar(t: string) {
  return t.charAt(0).toUpperCase() + t.slice(1);
}

/** Bloco "Sobre o escritório" + advogado. Só aparece com a OAB preenchida (ver App.tsx). */
export function Lawyer({ num }: { num: string }) {
  const frame = useRef<HTMLDivElement>(null);
  const ok = useMotionOk();
  const { scrollYProgress } = useScroll({ target: frame, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ok ? ["-6%", "6%"] : ["0%", "0%"]);
  const { advogado, foto, sobre } = CONFIG;
  const abertura = CONFIG.mostrarTempoEscritorio && CONFIG.tempoEscritorio
    ? `${CONFIG.tempoEscritorio}, ${sobre.abertura}`
    : capitalizar(sobre.abertura);

  return (
    <DarkSection id="sobre" labelledBy="sobre-titulo" className="py-28 md:py-40">
      <div className="wrap">
        <SectionHead num={num} label="Sobre o escritório" dark />

        <div className="grid gap-14 md:grid-cols-12 md:gap-10">
          {/* Retrato */}
          <div className="md:col-span-5">
            <div className="md:sticky md:top-32">
              <Reveal>
                <figure className="relative">
                  <div className="relative">
                    <div aria-hidden className="absolute -inset-3 border border-gold-light/40 md:-inset-4" />
                    <div ref={frame} className="relative aspect-[4/5] overflow-hidden bg-ink-2">
                      {foto ? (
                        <m.picture style={{ y, scale: 1.14 }} className="absolute inset-0 block">
                          <source type="image/webp" srcSet={`${foto.webp480} 480w, ${foto.webp800} 800w`} sizes="(min-width: 768px) 40vw, 90vw" />
                          <img
                            src={foto.src}
                            alt={foto.alt}
                            width={foto.largura}
                            height={foto.altura}
                            loading="lazy"
                            decoding="async"
                            className="h-full w-full object-cover object-[50%_30%]"
                          />
                        </m.picture>
                      ) : (
                        <div className="flex h-full items-center justify-center p-12 text-gold-light/70">
                          <Emblem variant="linha" className="h-full w-auto" />
                        </div>
                      )}
                    </div>
                  </div>
                  <figcaption className="mt-10 flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4 md:flex-col md:gap-2 lg:flex-row lg:gap-4">
                    <span className="font-serif text-xl text-paper">{advogado.nome}</span>
                    <span className="eyebrow text-gold-light lg:text-right">Advogado · {advogado.oab}</span>
                  </figcaption>
                </figure>
              </Reveal>
            </div>
          </div>

          {/* Texto do escritório */}
          <div className="md:col-span-6 md:col-start-7 md:pt-4">
            <Reveal>
              <h2 id="sobre-titulo" className="text-[clamp(2.4rem,5.2vw,4.4rem)]">
                {sobre.titulo.antes} <em>{sobre.titulo.destaque}</em>.
              </h2>
            </Reveal>

            <Reveal delay={0.08}>
              <p className="mt-10 font-serif text-[1.45rem] font-[360] leading-[1.35] tracking-[-0.01em] text-paper md:text-[1.7rem]">
                {abertura}
              </p>
            </Reveal>

            <div className="mt-8 space-y-5 text-[1.0625rem] leading-relaxed text-paper/78">
              {sobre.paragrafos.map((p, i) => (
                <Reveal as="p" key={i} delay={0.04 * i}>
                  {p}
                </Reveal>
              ))}
            </div>

            <Reveal>
              <blockquote className="mt-12 border-l border-gold-light/60 pl-6 md:pl-8">
                <p className="font-serif text-[1.85rem] italic leading-[1.15] text-wine-light md:text-[2.3rem]">{sobre.fecho}</p>
              </blockquote>
            </Reveal>

            {advogado.formacao.length > 0 ? (
              <div className="mt-16">
                <p className="eyebrow text-gold-light">Formação</p>
                <Rule className="mt-4 opacity-50" />
                <ul>
                  {advogado.formacao.map((f, i) => {
                    const [curso, inst] = f.split(/,\s(?=[^,]+$)/);
                    return (
                      <Reveal as="li" key={f} delay={i * 0.06} className="flex flex-col gap-1 border-b border-paper/12 py-5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                        <span className="font-serif text-[1.3rem] leading-snug md:text-[1.4rem]">{curso}</span>
                        {inst ? <span className="eyebrow shrink-0 text-paper/65">{inst}</span> : null}
                      </Reveal>
                    );
                  })}
                </ul>
              </div>
            ) : null}
          </div>
        </div>

        {/* Valores */}
        {sobre.valores.length > 0 ? (
          <div className="mt-24 md:mt-32">
            <p className="eyebrow text-gold-light">Nossos valores</p>
            <Rule className="mt-4 opacity-50" />
            <ul className="grid sm:grid-cols-2 lg:grid-cols-5">
              {sobre.valores.map((v, i) => (
                <Reveal
                  as="li"
                  key={v}
                  delay={i * 0.06}
                  className="flex items-baseline gap-4 border-b border-paper/12 py-6 sm:pr-6 lg:flex-col lg:gap-5 lg:border-b-0 lg:border-l lg:py-8 lg:pl-6 lg:first:border-l-0 lg:first:pl-0"
                >
                  <span className="font-serif text-lg italic text-gold-light">{String(i + 1).padStart(2, "0")}</span>
                  <span className="font-serif text-[1.45rem] leading-[1.15] text-paper md:text-[1.6rem]">{v}</span>
                </Reveal>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </DarkSection>
  );
}
