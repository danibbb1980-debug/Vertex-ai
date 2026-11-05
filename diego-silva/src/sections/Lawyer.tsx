import { m, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { CONFIG } from "../config";
import { DarkSection } from "../components/DarkSection";
import { SectionHead } from "../components/SectionHead";
import { Reveal, Rule } from "../components/Reveal";
import { Emblem } from "../components/Emblem";
import { useMotionOk } from "../lib/useMotionOk";

export function Lawyer({ num }: { num: string }) {
  const frame = useRef<HTMLDivElement>(null);
  const ok = useMotionOk();
  const { scrollYProgress } = useScroll({ target: frame, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ok ? ["-6%", "6%"] : ["0%", "0%"]);
  const { advogado, foto } = CONFIG;

  return (
    <DarkSection id="sobre" labelledBy="sobre-titulo" className="py-28 md:py-40">
      <div className="wrap">
        <SectionHead num={num} label="O advogado" dark />
        <div className="grid gap-14 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-5">
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
                <figcaption className="mt-10 flex items-baseline justify-between gap-4 text-sm text-paper/75">
                  <span className="font-serif text-xl text-paper">{advogado.nome}</span>
                  <span className="eyebrow text-gold-light">{advogado.oab}</span>
                </figcaption>
              </figure>
            </Reveal>
          </div>

          <div className="md:col-span-6 md:col-start-7 md:pt-6">
            <Reveal>
              <h2 id="sobre-titulo" className="text-[clamp(2.4rem,5.2vw,4.4rem)]">
                Quem <em>conduz</em> o seu atendimento.
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-8 text-[1.15rem] leading-relaxed text-paper/85">
                {advogado.nome}, advogado, {advogado.oab}. Atua com Direito do Trabalho, de Família, Cível e Previdenciário, com atendimento
                presencial em {CONFIG.endereco.cidade} e on-line em todo o Brasil.
              </p>
              <p className="mt-5 leading-relaxed text-paper/75">
                O método é simples e exigente ao mesmo tempo: ouvir antes de orientar, estudar cada documento com cuidado e explicar cada etapa em linguagem clara, para que você
                participe das decisões do seu caso.
              </p>
              {advogado.trajetoria ? <p className="mt-5 leading-relaxed text-paper/75">{advogado.trajetoria}</p> : null}
            </Reveal>

            {advogado.formacao.length > 0 ? (
              <div className="mt-14">
                <p className="eyebrow text-gold-light">Formação</p>
                <Rule className="mt-4 opacity-50" />
                <ul>
                  {advogado.formacao.map((f, i) => (
                    <Reveal as="li" key={f} delay={i * 0.06} className="border-b border-paper/12 py-5 font-serif text-[1.3rem] leading-snug md:text-[1.45rem]">
                      {f}
                    </Reveal>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </DarkSection>
  );
}
