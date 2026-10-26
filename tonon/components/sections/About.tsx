import Image from "next/image";
import { portrait, site, whatsappUrl } from "@/lib/site-data";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { InstagramIcon, WhatsAppIcon } from "@/components/ui/BrandIcons";

/*
  Apresentação de Matheus Tonon apenas com o que foi informado: nome,
  posicionamento, cargo e área de atuação. Sem diplomas, títulos, tempo de
  experiência ou números.
*/
export function About() {
  return (
    <section
      id="sobre"
      aria-labelledby="sobre-title"
      className="on-dark grain relative overflow-hidden bg-graphite py-24 text-paper sm:py-32 lg:py-40"
    >
      <div className="container-site relative grid gap-14 lg:grid-cols-12 lg:gap-10">
        <Reveal variant="mask" className="relative lg:col-span-5">
          <figure className="relative aspect-[3/4] overflow-hidden bg-graphite-2">
            <Image
              src={portrait.src}
              alt={portrait.alt}
              width={portrait.width}
              height={portrait.height}
              sizes="(min-width: 1024px) 36vw, 92vw"
              className="h-full w-full object-cover object-[50%_20%]"
            />
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-graphite/50 via-transparent to-transparent" />
          </figure>
          <p className="mt-4 text-xs tracking-[0.08em] text-mineral">Matheus Tonon na recepção do laboratório.</p>
        </Reveal>

        <div className="flex flex-col justify-center lg:col-span-6 lg:col-start-7">
          <Reveal>
            <SectionLabel index="02" tone="dark">
              Quem conduz
            </SectionLabel>
            <h2 id="sobre-title" className="display h-section mt-8 text-paper">
              Matheus <em>Tonon</em>
            </h2>
          </Reveal>

          <Reveal delay={120}>
            <p className="lead mt-8 max-w-[34rem] text-mineral">
              À frente do Laboratório Tonon, Matheus dedica seu trabalho à reabilitação estética: devolver
              harmonia ao sorriso com precisão técnica, cuidado com os detalhes e um atendimento próximo, em que
              cada pessoa é recebida com atenção.
            </p>
          </Reveal>

          <Reveal delay={200}>
            <dl className="mt-12 border-t border-paper/12">
              {[
                ["Especialidade", site.role],
                ["Cargo", site.title],
                ["Atuação", site.focus],
                ["Cidade", `${site.city} — ${site.state}`],
              ].map(([term, value]) => (
                <div key={term} className="grid grid-cols-[8.5rem_1fr] gap-4 border-b border-paper/12 py-4 sm:grid-cols-[11rem_1fr]">
                  <dt className="pt-0.5 text-[0.68rem] font-semibold tracking-[0.2em] text-champagne uppercase">{term}</dt>
                  <dd className="text-paper">{value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal delay={260} className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-7">
            <Button href={whatsappUrl("default")} external variant="solid-light" icon={<WhatsAppIcon className="h-[1.1rem] w-[1.1rem]" />}>
              Conversar com Matheus
            </Button>
            <a
              href={site.links.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="link-line inline-flex min-h-11 items-center gap-2.5 self-start text-[0.8rem] font-semibold tracking-[0.08em] text-paper uppercase sm:self-center"
            >
              <InstagramIcon className="h-4 w-4" />
              {site.links.instagramHandle}
              <span className="sr-only"> (abre em nova aba)</span>
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
