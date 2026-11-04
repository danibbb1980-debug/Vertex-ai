import { useRef } from "react";
import { m, useScroll, useTransform, type MotionValue } from "motion/react";
import { CONFIG } from "../config";
import { waEscritorio } from "../lib/whatsapp";
import { italico } from "../lib/text";
import { MagneticLink } from "./ui";

/* ---------------- Moldura do retrato ---------------- */

export function Portrait({
  parallax,
  caption,
  draw = false,
  className = "",
}: {
  parallax?: MotionValue<number>;
  caption: string;
  draw?: boolean;
  className?: string;
}) {
  const lineClass = draw ? "portrait-draw" : "";
  return (
    <figure className={className}>
      <div className="relative aspect-[3/4] overflow-hidden border border-rule bg-paper-2">
        {CONFIG.foto ? (
          <img
            src={CONFIG.foto}
            alt={`Retrato da equipe do ${CONFIG.escritorio.nome}`}
            width={900}
            height={1200}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 size-full object-cover"
          />
        ) : (
          <>
            <svg
              aria-hidden="true"
              viewBox="0 0 300 400"
              preserveAspectRatio="xMidYMid slice"
              className="absolute inset-0 size-full text-ink"
              fill="none"
              stroke="currentColor"
            >
              <g strokeWidth="0.6" opacity="0.5">
                <rect className={lineClass} pathLength={1} x="14" y="14" width="272" height="372" />
                <path className={lineClass} pathLength={1} d="M58 386V176a92 92 0 0 1 184 0v210" />
                <path className={lineClass} pathLength={1} d="M78 386V180a72 72 0 0 1 144 0v206" />
              </g>
              <g strokeWidth="0.5" opacity="0.28">
                <path d="M14 330h272M14 352h272M14 372h272" />
                <path d="M150 14v70M150 320v66" />
                <circle cx="150" cy="176" r="3" />
              </g>
            </svg>
            <m.div style={{ y: parallax }} className="absolute inset-0 grid place-items-center">
              <span
                className="font-serif text-[clamp(4.5rem,11vw,8.5rem)] leading-none tracking-[-0.04em] text-ink"
                style={{ fontVariationSettings: '"opsz" 144', fontWeight: 300 }}
                aria-hidden="true"
              >
                L<em className="px-[0.04em] text-accent">&amp;</em>C
              </span>
            </m.div>
          </>
        )}
      </div>
      <figcaption className="label mt-3 flex justify-between gap-4 text-[0.68rem] text-ink-soft">
        <span>{caption}</span>
        <span aria-hidden="true">3 : 4</span>
      </figcaption>
    </figure>
  );
}

/* ---------------- Hero ---------------- */

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const mono = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const frame = useTransform(scrollYProgress, [0, 1], [0, 40]);

  return (
    <section
      id="inicio"
      ref={ref}
      aria-labelledby="hero-titulo"
      className="relative mx-auto max-w-[1440px] px-5 pt-32 pb-20 md:px-10 md:pt-40 md:pb-28"
    >
      <div className="flex items-center gap-4 text-ink-soft">
        <span className="label fade-up text-accent">00</span>
        <span aria-hidden="true" className="draw-x h-px flex-1 bg-current opacity-40 [animation-delay:.2s] md:max-w-48" />
        <p className="label fade-up [animation-delay:.35s]">{CONFIG.hero.eyebrow}</p>
      </div>

      <div className="mt-10 grid gap-14 md:mt-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-8">
          <h1 id="hero-titulo" className="font-display text-[clamp(3.6rem,min(13.5vw,15vh),9.75rem)]">
            {CONFIG.hero.titulo.map((linha, i) => (
              <span key={i} className="hero-line">
                <span style={{ animationDelay: `${0.25 + i * 0.12}s` }}>{italico(linha)}</span>
              </span>
            ))}
          </h1>

          <div className="mt-10 grid gap-10 md:mt-12 md:grid-cols-8">
            <p
              className="fade-up text-[1.2rem] leading-[1.5] text-ink-soft md:col-span-5 md:text-[1.35rem]"
              style={{ animationDelay: "0.75s" }}
            >
              {CONFIG.hero.subtitulo}
            </p>
          </div>

          <div className="fade-up mt-10 flex flex-col gap-3 sm:flex-row sm:items-center" style={{ animationDelay: "0.9s" }}>
            <MagneticLink href={waEscritorio()} external icon="chat">
              Falar pelo WhatsApp
            </MagneticLink>
            <MagneticLink href="#areas" variant="ghost">
              Conhecer as áreas
            </MagneticLink>
          </div>
        </div>

        <m.div style={{ y: frame }} className="lg:col-span-4 lg:pt-6">
          <div className="fade-up" style={{ animationDelay: "0.5s" }}>
            <Portrait
              parallax={mono}
              draw
              caption={CONFIG.modelo ? "Retrato · espaço para a foto do escritório" : CONFIG.escritorio.nome}
              className="mx-auto max-w-[22rem] lg:max-w-none"
            />
          </div>
        </m.div>
      </div>

      <div className="mt-20 hidden items-end justify-between border-t border-rule pt-5 text-ink-soft md:flex">
        <p className="label">Família · Trabalho · Previdenciário · Civil</p>
        <p className="label flex items-center gap-3">
          Role para ler
          <span aria-hidden="true" className="relative block h-8 w-px overflow-hidden bg-rule">
            <span className="scroll-hint absolute inset-x-0 top-0 h-3 bg-current" />
          </span>
        </p>
      </div>
    </section>
  );
}

/* ---------------- Manifesto: acende palavra por palavra ---------------- */

function Word({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) {
  // Mínimo de 0,5 mantém contraste 3:1 para texto grande mesmo antes de acender.
  const opacity = useTransform(progress, range, [0.5, 1]);
  return (
    <m.span style={{ opacity }} className="inline-block">
      {children}
    </m.span>
  );
}

export function Manifesto() {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.5"] });
  const words = CONFIG.manifesto.split(" ");
  return (
    <section aria-label="Manifesto" className="mx-auto max-w-[1440px] px-5 py-24 md:px-10 md:py-40">
      <div className="grid gap-8 lg:grid-cols-12">
        <p className="label text-ink-soft lg:col-span-3 lg:pt-4">
          <span className="text-accent">—</span> Manifesto
        </p>
        <p ref={ref} className="serif text-[clamp(1.9rem,4.6vw,4rem)] leading-[1.12] font-[330] tracking-[-0.02em] lg:col-span-9" style={{ fontVariationSettings: '"opsz" 96' }}>
          {words.map((w, i) => {
            const start = i / words.length;
            return (
              <span key={i}>
                <Word progress={scrollYProgress} range={[start, start + 1 / words.length]}>
                  {w}
                </Word>{" "}
              </span>
            );
          })}
        </p>
      </div>
    </section>
  );
}
