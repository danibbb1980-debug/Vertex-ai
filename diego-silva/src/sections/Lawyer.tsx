import { m, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { CONFIG, temAdvogado } from "../config";
import { DarkSection } from "../components/DarkSection";
import { SectionHead } from "../components/SectionHead";
import { Reveal, Rule } from "../components/Reveal";
import { Emblem } from "../components/Emblem";
import { useMotionOk } from "../lib/useMotionOk";

function capitalizar(t: string) {
  return t.charAt(0).toUpperCase() + t.slice(1);
}

/** Retrato com moldura editorial e leve parallax. */
function Retrato() {
  const frame = useRef<HTMLDivElement>(null);
  const ok = useMotionOk();
  const { scrollYProgress } = useScroll({ target: frame, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ok ? ["-6%", "6%"] : ["0%", "0%"]);
  const { foto } = CONFIG;
  return (
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
  );
}

/** Seção "O escritório" (menu: Sobre) + subbloco "O advogado" (só com OAB preenchida). */
export function Lawyer({ num }: { num: string }) {
  const { advogado, sobre } = CONFIG;
  const abertura =
    CONFIG.mostrarTempoEscritorio && CONFIG.tempoEscritorio ? `${CONFIG.tempoEscritorio}, ${sobre.abertura}` : capitalizar(sobre.abertura);
  const ultimo = sobre.paragrafos.length - 1;

  return (
    <DarkSection id="sobre" labelledBy="sobre-titulo" className="py-28 md:py-40">
      <div className="wrap">
        <SectionHead num={num} label="Sobre" dark />

        {/* ===== O escritório ===== */}
        <div className="grid gap-12 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-5">
            <Reveal>
              <hgroup>
                <h2 id="sobre-titulo" className="text-[clamp(2.8rem,6.4vw,5.4rem)]">
                  O <em>escritório</em>.
                </h2>
                <p className="mt-6 max-w-sm font-serif text-[1.3rem] leading-snug text-gold-light md:text-[1.45rem]">{CONFIG.nomeEscritorio}</p>
              </hgroup>
            </Reveal>
          </div>

          <div className="md:col-span-6 md:col-start-7 md:pt-3">
            <Reveal delay={0.08}>
              <p className="font-serif text-[1.5rem] font-[360] leading-[1.32] tracking-[-0.01em] text-paper md:text-[1.8rem]">{abertura}</p>
            </Reveal>
            <div className="mt-8 space-y-5 text-[1.0625rem] leading-relaxed text-paper/78">
              {sobre.paragrafos.map((p, i) => (
                <Reveal as="p" key={i} delay={0.04 * i}>
                  {p}
                  {i === ultimo && sobre.fecho ? (
                    <>
                      {" "}
                      <em className="font-serif text-[1.15em] text-wine-light">{sobre.fecho}</em>
                    </>
                  ) : null}
                </Reveal>
              ))}
            </div>
          </div>
        </div>

        {sobre.valores.length > 0 ? (
          <div className="mt-20 md:mt-28">
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

        {/* ===== O advogado (ligado ao escritório por um fio dourado) ===== */}
        {temAdvogado ? (
          <section aria-labelledby="advogado-titulo" className="relative mt-24 md:mt-32">
            <div aria-hidden className="mx-auto mb-12 flex flex-col items-center md:mb-16">
              <span className="h-16 w-px bg-gradient-to-b from-transparent to-gold-light/70 md:h-24" />
              <span className="h-2.5 w-2.5 rotate-45 border border-gold-light" />
            </div>

            <div className="grid gap-14 md:grid-cols-12 md:gap-10">
              <div className="md:col-span-5">
                <Reveal>
                  <figure aria-label={`${advogado.tratamento} ${advogado.nome}`}>
                    <Retrato />
                  </figure>
                </Reveal>
              </div>

              <div className="md:col-span-6 md:col-start-7 md:pt-3">
                <Reveal>
                  <p className="eyebrow text-gold-light">O advogado</p>
                  <h3 id="advogado-titulo" className="mt-5 text-[clamp(2.2rem,4.6vw,3.6rem)]">
                    {advogado.tratamento} {advogado.nome}, <span className="whitespace-nowrap">{advogado.oab}</span>
                  </h3>
                </Reveal>
                {advogado.texto ? (
                  <Reveal delay={0.08}>
                    <p className="mt-8 text-[1.0625rem] leading-relaxed text-paper/78 md:text-[1.125rem]">{advogado.texto}</p>
                  </Reveal>
                ) : null}

                {advogado.formacao.length > 0 ? (
                  <div className="mt-14">
                    <p className="eyebrow text-gold-light">Formação</p>
                    <Rule className="mt-4 opacity-50" />
                    <ul>
                      {advogado.formacao.map((f, i) => {
                        const [curso, inst] = f.split(/,\s(?=[^,]+$)/);
                        return (
                          <Reveal
                            as="li"
                            key={f}
                            delay={i * 0.06}
                            className="flex flex-col gap-1 border-b border-paper/12 py-5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
                          >
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
          </section>
        ) : null}
      </div>
    </DarkSection>
  );
}
