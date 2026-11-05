import { CONFIG, CONTEUDOS, FAQ, METODO, mostraFundadora } from "../config";
import { Relief, Wave } from "./Ornaments";
import { useRef, useState } from "react";
import { m, useScroll, useTransform } from "motion/react";
import { IconPlus, Reveal, Rich, SectionLabel, useReducedMotion } from "./ui";

export function Sobre() {
  return (
    <section id="sobre" data-tone="dark" tabIndex={-1} aria-labelledby="sobre-titulo" className="py-24 md:py-40">
      <div className="wrap">
        <div className="grid gap-14 md:grid-cols-12 md:gap-8">
          <Reveal className="md:col-span-7">
            <SectionLabel n="04">Sobre o escritório</SectionLabel>
            <h2 id="sobre-titulo" className="h2 mt-8">
              <Rich text="Um escritório que *escuta* antes de orientar." />
            </h2>
            <div className="lead mt-8 max-w-[48ch] space-y-5">
              <p>
                A {CONFIG.nome} atua com direito previdenciário em {CONFIG.endereco.cidade}, nas esferas administrativa e
                judicial, com atendimento presencial{CONFIG.atendeOnline && " e consultoria jurídica à distância"}.
              </p>
              <p>
                O trabalho parte de um princípio simples: entender a pessoa antes de analisar o processo. Cada caso recebe
                tempo, atenção e uma explicação clara sobre os caminhos possíveis.
              </p>
            </div>
          </Reveal>

          {/* Moldura tipográfica */}
          <Reveal className="md:col-span-4 md:col-start-9" delay={0.12}>
            <figure className="relative flex aspect-[4/5] flex-col justify-between overflow-hidden border border-[var(--line-strong)] p-7 md:p-8">
              {["top-0 left-0 border-t border-l", "top-0 right-0 border-t border-r", "bottom-0 left-0 border-b border-l", "bottom-0 right-0 border-b border-r"].map((c) => (
                <span key={c} aria-hidden className={`absolute h-4 w-4 border-[var(--accent)] ${c} -m-px`} />
              ))}
              <span className="eyebrow">{CONFIG.endereco.cidade} · {CONFIG.endereco.uf}</span>
              <blockquote className="font-serif text-[clamp(1.6rem,1.2rem+1.4vw,2.35rem)] leading-[1.12] font-light">
                Clareza para quem está em um <em className="text-[var(--accent)]">momento</em> delicado.
              </blockquote>
              <Relief className="pointer-events-none absolute inset-x-0 -bottom-6 -z-0 w-full text-[var(--line)] opacity-80" delay={0} parallax={false} />
              <figcaption className="relative eyebrow">Escuta · Clareza · Sigilo</figcaption>
            </figure>
          </Reveal>
        </div>

        <FotoEscritorio />

        <ul className="mt-20 grid border-t border-[var(--line)] md:mt-28 md:grid-cols-2 lg:grid-cols-4">
          {METODO.map((m, i) => (
            <Reveal
              as="li"
              key={m.titulo}
              delay={i * 0.06}
              className={`border-b border-[var(--line)] py-8 md:py-10 lg:border-b-0 ${
                i % 2 === 0 ? "md:pr-8" : "md:pl-8 md:border-l"
              } lg:px-8 ${i > 0 ? "lg:border-l" : "lg:pl-0"}`}
            >
              <span className="num">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="h3 mt-4 text-[1.6rem]">{m.titulo}</h3>
              <p className="muted mt-3 text-pretty">{m.texto}</p>
            </Reveal>
          ))}
        </ul>

        {mostraFundadora && (
          <Reveal className="mt-20 grid gap-6 border-t border-[var(--line)] pt-10 md:grid-cols-12">
            <p className="eyebrow md:col-span-3">Advogada responsável</p>
            <div className="md:col-span-8">
              <p className="h3 text-[clamp(1.6rem,1.2rem+1.4vw,2.4rem)]">{CONFIG.fundadora.nome}</p>
              <p className="muted mt-2">OAB {CONFIG.fundadora.oab}</p>
              {CONFIG.fundadora.formacao && <p className="mt-4 max-w-[60ch]">{CONFIG.fundadora.formacao}</p>}
            </div>
          </Reveal>
        )}

        {CONFIG.mostrarTrajetoria && (
          <Reveal className="mt-12 grid gap-6 border-t border-[var(--line)] pt-10 md:grid-cols-12">
            <p className="eyebrow md:col-span-3">Trajetória</p>
            <ul className="space-y-3 md:col-span-8">
              {CONFIG.trajetoria.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </Reveal>
        )}
      </div>
    </section>
  );
}

export function Conteudo() {
  return (
    <section id="conteudo" data-tone="light" tabIndex={-1} aria-labelledby="cont-titulo" className="pt-24 pb-12 md:pt-40 md:pb-16">
      <div className="wrap">
        <div className="grid gap-8 md:grid-cols-12">
          <Reveal className="md:col-span-7">
            <SectionLabel n="05">Conteúdo útil</SectionLabel>
            <h2 id="cont-titulo" className="h2 mt-8">
              <Rich text="Informação para ler com *calma*." />
            </h2>
          </Reveal>
        </div>
        <ul className="mt-14 grid gap-px overflow-hidden rounded-[20px] border border-[var(--line)] bg-[var(--line)] md:mt-20 md:grid-cols-3">
          {CONTEUDOS.map((c, i) => (
            <li key={c.n} className="bg-[var(--bg)] p-7 transition-colors duration-700 md:p-9">
              <Reveal delay={i * 0.08}>
                <span className="num">{c.n}</span>
                <h3 className="h3 mt-10 text-[clamp(1.4rem,1.2rem+0.8vw,1.85rem)] md:mt-16">{c.titulo}</h3>
                <p className="muted mt-4 text-[0.98rem] text-pretty">{c.texto}</p>
              </Reveal>
            </li>
          ))}
        </ul>
        <p className="muted mt-6 text-[0.875rem]">Conteúdo informativo, não substitui a análise do seu caso.</p>
        <Wave className="mt-20 h-6 w-full text-[var(--line-strong)] md:mt-28" />
      </div>
    </section>
  );
}

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="duvidas" data-tone="light" tabIndex={-1} aria-labelledby="faq-titulo" className="pt-12 pb-24 md:pt-20 md:pb-40">
      <div className="wrap grid gap-12 md:grid-cols-12 md:gap-8">
        <Reveal className="md:col-span-4">
          <SectionLabel n="06">Dúvidas frequentes</SectionLabel>
          <h2 id="faq-titulo" className="h2 mt-8">
            <Rich text="Perguntas que *chegam* até nós." />
          </h2>
          <p className="lead mt-6 max-w-[32ch]">
            Não encontrou a sua?{" "}
            <a href="#contato" className="link link-static text-[var(--fg)]">
              Fale com o escritório
            </a>
            .
          </p>
        </Reveal>
        <div className="md:col-span-7 md:col-start-6">
          <ul className="border-b border-[var(--line)]">
            {FAQ.map((f, i) => {
              const isOpen = open === i;
              return (
                <li key={f.p} className="border-t border-[var(--line)]">
                  <h3>
                    <button
                      type="button"
                      id={`faq-btn-${i}`}
                      aria-expanded={isOpen}
                      aria-controls={`faq-${i}`}
                      onClick={() => setOpen(isOpen ? null : i)}
                      className="flex min-h-[72px] w-full items-center justify-between gap-6 py-5 text-left font-serif text-[clamp(1.2rem,1.05rem+0.6vw,1.5rem)] leading-snug"
                    >
                      <span>{f.p}</span>
                      <span
                        aria-hidden
                        className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[var(--line-strong)] transition-transform duration-500 ${
                          isOpen ? "rotate-45" : ""
                        }`}
                      >
                        <IconPlus className="h-4 w-4" />
                      </span>
                    </button>
                  </h3>
                  <div id={`faq-${i}`} role="region" aria-labelledby={`faq-btn-${i}`} className="acc" data-open={isOpen} inert={!isOpen}>
                    <div>
                      <p className="muted max-w-[60ch] pb-7 text-pretty">{f.r}</p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}

/** Foto do escritório: entra com leve zoom de saída conforme a rolagem (só transform). */
function FotoEscritorio() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 0.6], [1.12, 1]);
  const y = useTransform(scrollYProgress, [0, 1], ["-4%", "4%"]);
  return (
    <figure ref={ref} className="mt-20 md:mt-28">
      <div className="relative aspect-[4/3] overflow-hidden rounded-[6px] md:aspect-[16/9]">
        <m.img
          src="/escritorio-1200.webp"
          srcSet="/escritorio-768.webp 768w, /escritorio-1200.webp 1200w, /escritorio-1600.webp 1600w"
          sizes="(min-width: 1320px) 1192px, (min-width: 768px) calc(100vw - 80px), calc(100vw - 40px)"
          width={1600}
          height={1200}
          loading="lazy"
          decoding="async"
          alt="Escritório da MSC Advocacia visto entre as folhas da parede verde: balcão da copa, mesas de trabalho, luminárias pendentes e janelas amplas com vista para a cidade de Poços de Caldas."
          className="absolute inset-0 h-full w-full object-cover"
          style={reduce ? undefined : { scale, y }}
        />
      </div>
      <figcaption className="mt-4 flex flex-wrap items-baseline justify-between gap-2 text-[0.875rem]">
        <span className="muted">O escritório, no Centro de {CONFIG.endereco.cidade}.</span>
        <span className="eyebrow !text-[0.6875rem]">Atendimento presencial</span>
      </figcaption>
    </figure>
  );
}
