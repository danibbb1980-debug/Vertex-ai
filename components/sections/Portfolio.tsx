import { existsSync } from "node:fs";
import { join } from "node:path";
import Image from "next/image";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { Reveal } from "../ui/Reveal";
import { LinkButton } from "../ui/Button";
import { BrowserFrame, SiteSkeleton } from "../ui/Mockups";
import { portfolio } from "@/lib/content";
import { whatsappUrl } from "@/lib/site";

/**
 * Portfólio — Server Component, sem JS próprio.
 *
 * A prévia usa a screenshot real da demo quando o arquivo existe em
 * public/projetos/. A checagem roda em tempo de build (a página é
 * pré-renderizada), então nunca existe uma <img> apontando para arquivo
 * ausente: sem o arquivo, o card cai na prévia em CSS, nítida em qualquer DPI
 * e sem nenhuma requisição.
 *
 * Para publicar as screenshots reais: `node scripts/capturar-projetos.mjs`.
 */
function hasImage(src: string): boolean {
  try {
    return existsSync(join(process.cwd(), "public", src));
  } catch {
    return false;
  }
}

export function Portfolio() {
  return (
    <section
      id="projetos"
      className="relative scroll-mt-24 overflow-x-clip px-5 py-28 sm:px-8 md:py-40"
    >
      <div className="mx-auto w-full max-w-6xl">
        {/* ── Cabeçalho ── */}
        <div className="max-w-3xl">
          <Reveal>
            <span className="text-xs font-medium tracking-[0.2em] text-mist-dim uppercase">
              {portfolio.eyebrow}
            </span>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-6 text-3xl font-semibold sm:text-5xl md:text-[3.4rem] md:leading-[1.05]">
              Projetos que transformam presença digital em{" "}
              <span className="text-gradient">percepção de valor.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-7 max-w-2xl text-base leading-relaxed text-mist sm:text-lg">
              {portfolio.sub}
            </p>
          </Reveal>
          <Reveal delay={0.14}>
            <p className="mt-3 text-sm text-mist-dim">{portfolio.support}</p>
          </Reveal>
        </div>

        {/* ── Grid de projetos ── */}
        <ul className="mt-20 grid gap-14 md:mt-24 lg:grid-cols-2 lg:gap-10">
          {portfolio.items.map((project, index) => {
            const showImage = hasImage(project.image);

            return (
              <Reveal as="li" key={project.slug} delay={index * 0.08}>
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-track="portfolio"
                  data-track-label={project.name}
                  className="project-card group block"
                >
                  {/* Prévia */}
                  <div className="relative overflow-hidden rounded-2xl border border-line bg-ink-2">
                    <div
                      className="pointer-events-none absolute -inset-10 -z-10 glow-soft opacity-70"
                      style={{ "--glow": project.glow } as React.CSSProperties}
                      aria-hidden="true"
                    />

                    {showImage ? (
                      /*
                       * As capturas são do site no celular, em retrato. A moldura
                       * de aparelho dá contexto ao formato e reforça a experiência
                       * mobile — que é justamente uma das características listadas.
                       */
                      <div className="project-media relative flex aspect-square w-full items-center justify-center overflow-hidden p-6">
                        <div className="w-[62%] max-w-[310px] overflow-hidden rounded-[1.6rem] border-[5px] border-surface-2 shadow-[0_30px_70px_-25px_rgba(0,0,0,0.9)] ring-1 ring-line">
                          <Image
                            src={project.image}
                            alt={`Prévia do site ${project.name} no celular`}
                            width={900}
                            height={1301}
                            sizes="(max-width: 640px) 62vw, (max-width: 1024px) 40vw, 310px"
                            quality={86}
                            /* Abaixo da primeira tela: carrega sob demanda. */
                            loading="lazy"
                            className="h-auto w-full"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="project-media relative aspect-16/10 w-full overflow-hidden">
                        <div className="absolute inset-0">
                          <BrowserFrame
                            url={project.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                            className="h-full w-full rounded-none border-0 shadow-none"
                          >
                            <SiteSkeleton />
                          </BrowserFrame>
                        </div>
                      </div>
                    )}

                    {/* Camada de hover — Tailwind v4 já limita hover: a ponteiros finos */}
                    <div
                      className="pointer-events-none absolute inset-0 flex items-end justify-center bg-linear-to-t from-ink/90 via-ink/25 to-transparent p-6 opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100"
                      aria-hidden="true"
                    >
                      <span className="inline-flex items-center gap-2 rounded-full bg-white/95 px-5 py-2.5 text-sm font-medium text-ink">
                        {portfolio.cta}
                        <ArrowUpRight className="size-4" />
                      </span>
                    </div>
                  </div>

                  {/* Texto */}
                  <div className="mt-7">
                    <span className="text-[0.7rem] font-medium tracking-[0.18em] text-brand-bright uppercase">
                      {project.category}
                    </span>

                    <h3 className="mt-3 font-display text-2xl font-semibold transition-colors duration-300 group-hover:text-brand-bright sm:text-[1.75rem]">
                      {project.name}
                    </h3>

                    <p className="mt-4 max-w-xl text-[0.95rem] leading-relaxed text-mist">
                      {project.description}
                    </p>

                    {/* Características em texto corrido: sem chips nem bordas */}
                    <ul className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm text-mist-dim">
                      {project.features.map((feature, featureIndex) => (
                        <li key={feature} className="flex items-center gap-3">
                          {featureIndex > 0 && (
                            <span
                              className="size-0.5 rounded-full bg-mist-dim"
                              aria-hidden="true"
                            />
                          )}
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-7 flex items-center justify-between gap-4">
                      <span className="inline-flex items-center gap-2 text-[0.95rem] font-medium text-cloud">
                        {portfolio.cta}
                        <ArrowUpRight className="project-arrow size-4 transition-transform duration-300" />
                      </span>

                      {/* Identificação discreta e obrigatória */}
                      <span className="flex items-center gap-1.5 text-xs text-mist-dim">
                        <span className="size-1 rounded-full bg-mist-dim" aria-hidden="true" />
                        {portfolio.demoLabel}
                      </span>
                    </div>
                  </div>
                </a>
              </Reveal>
            );
          })}
        </ul>

        {/* ── CTA de fechamento ── */}
        <Reveal delay={0.06}>
          <div className="mt-24 flex flex-col items-start gap-8 border-t border-line pt-14 md:mt-28 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
            <div className="max-w-xl">
              <h3 className="font-display text-2xl font-semibold sm:text-3xl">
                {portfolio.closing.title}
              </h3>
              <p className="mt-3 text-base leading-relaxed text-mist">
                {portfolio.closing.body}
              </p>
            </div>

            <LinkButton
              href={whatsappUrl("portfolio")}
              target="_blank"
              rel="noopener noreferrer"
              size="lg"
              className="shrink-0"
              trackAs="portfolio-cta"
            >
              <MessageCircle className="size-4" aria-hidden="true" />
              {portfolio.closing.cta}
            </LinkButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
