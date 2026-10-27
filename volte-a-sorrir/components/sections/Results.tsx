import { site } from "@/lib/site";
import { InstagramIcon } from "../ui/BrandIcons";
import { Reveal } from "../ui/Reveal";
import { Eyebrow } from "../ui/WaveMark";
import { CaseViewer } from "./CaseViewer";

export function Results() {
  return (
    <section
      id="resultados"
      aria-labelledby="resultados-title"
      className="on-dark relative overflow-hidden bg-navy-deep py-24 text-white sm:py-28 lg:py-36"
    >
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <Reveal className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Eyebrow tone="sun">Resultados</Eyebrow>
            <h2
              id="resultados-title"
              className="font-display mt-6 text-[clamp(2.2rem,4.6vw,3.4rem)] font-[420] leading-[1.04]"
            >
              Sorrisos que voltaram <span className="italic text-sun">a aparecer.</span>
            </h2>
          </div>
          <p className="max-w-md leading-relaxed text-white/75 lg:col-span-5 lg:justify-self-end">
            Casos atendidos na clínica e publicados no nosso Instagram. Cada tratamento começa por uma avaliação, e os
            resultados variam de pessoa para pessoa.
          </p>
        </Reveal>

        <Reveal delay={100} className="mt-14 sm:mt-16">
          <CaseViewer />
        </Reveal>

        <a
          href={site.instagram.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-12 inline-flex min-h-11 items-center gap-2.5 rounded-full text-sm font-semibold text-sun underline-offset-4 hover:underline"
        >
          <InstagramIcon className="size-5" />
          Veja mais casos em {site.instagram.handle}
        </a>
      </div>
    </section>
  );
}
