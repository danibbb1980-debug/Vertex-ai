import { ArrowRight, Check, Info } from "lucide-react";
import { Section, SectionHeader } from "../ui/Section";
import { Reveal } from "../ui/Reveal";
import { LinkButton } from "../ui/Button";
import { BrowserFrame, PhoneFrame, SiteSkeleton } from "../ui/Mockups";
import { portfolio } from "@/lib/content";
import { site } from "@/lib/site";

export function Portfolio() {
  return (
    <Section id="projetos" className="scroll-mt-24">
      <SectionHeader
        eyebrow={portfolio.eyebrow}
        title={portfolio.title}
        sub={portfolio.sub}
        accent="padrão de site"
      />

      {/* Visible, unambiguous disclosure that these are concepts. Being caught
          implying fake clients costs far more trust than the concepts buy. */}
      <Reveal delay={0.08}>
        <p className="mx-auto mt-7 flex max-w-2xl items-center justify-center gap-2 rounded-full border border-line bg-surface/60 px-5 py-2.5 text-center text-xs text-mist">
          <Info className="size-3.5 shrink-0 text-mist-dim" aria-hidden="true" />
          {portfolio.disclaimer}
        </p>
      </Reveal>

      <div className="mt-16 space-y-20 md:space-y-28">
        {portfolio.items.map((project, index) => (
          <Reveal key={project.slug} delay={0.05}>
            <article
              className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-14 ${
                index % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
              }`}
            >
              {/* Mockups */}
              <div className="relative">
                <div
                  className={`pointer-events-none absolute -inset-8 -z-10 rounded-full bg-linear-to-br ${project.accent} blur-3xl`}
                  aria-hidden="true"
                />
                <BrowserFrame url={`${site.domain}/conceito/${project.slug}`}>
                  <SiteSkeleton />
                </BrowserFrame>
                {/* Sits inside the frame on phones, overhangs from sm: up */}
                <div className="absolute right-2 -bottom-12 w-24 sm:-right-6 sm:w-36">
                  <PhoneFrame>
                    <SiteSkeleton compact />
                  </PhoneFrame>
                </div>
              </div>

              <div className="mt-14 lg:mt-0">
                <span className="text-xs font-medium tracking-[0.14em] text-mist-dim uppercase">
                  {project.category}
                </span>
                <h3 className="mt-3 text-2xl font-semibold sm:text-3xl">{project.name}</h3>
                <p className="mt-4 text-base leading-relaxed text-mist">
                  {project.description}
                </p>

                <ul className="mt-7 space-y-3">
                  {project.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-2.5 text-[0.95rem] text-cloud/90">
                      <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-mint/15">
                        <Check className="size-3 text-mint" aria-hidden="true" />
                      </span>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      {/* CTA immediately after the proof block, while conviction is highest */}
      <Reveal delay={0.1}>
        <div className="mt-20 text-center">
          <p className="text-base text-mist">Quer um site nesse padrão para o seu negócio?</p>
          <LinkButton href="#contato" size="lg" className="mt-5" trackAs="projetos">
            Quero o meu
            <ArrowRight className="size-4" aria-hidden="true" />
          </LinkButton>
        </div>
      </Reveal>
    </Section>
  );
}
