import { waLink } from "../config";
import { IconArrow, IconWhatsApp } from "../components/Icons";
import { HeroScene } from "../components/HeroScene";
import { Vertice } from "../components/Vertice";

export function Hero() {
  return (
    <section id="topo" aria-labelledby="hero-title" className="relative isolate overflow-hidden">
      <div className="container-v grid grid-cols-1 items-center gap-12 pt-28 pb-14 sm:pt-32 lg:min-h-[min(100svh,960px)] lg:grid-cols-12 lg:gap-6 lg:pt-28 lg:pb-16">
        <div className="lg:col-span-6">
          <p className="fade-up flex items-center gap-3 eyebrow">
            <Vertice className="h-[11px] w-auto text-gold" />
            Estúdio de sites em Poços de Caldas
          </p>
          <h1
            id="hero-title"
            className="fade-up mt-7 text-[clamp(3.1rem,11vw,6.4rem)] leading-[0.96] tracking-[-0.018em] text-pearl"
            style={{ ["--d" as string]: "80ms" }}
          >
            Seu site pronto <span className="serif-accent">antes</span> de você decidir.
          </h1>
          <p
            className="fade-up mt-8 max-w-[31rem] text-[1.1rem] leading-relaxed text-mist sm:text-[1.15rem]"
            style={{ ["--d" as string]: "200ms" }}
          >
            Criamos o rascunho do site da sua empresa, sem custo e sem compromisso. Você vê, pede ajustes e só então decide.
          </p>

          <div className="fade-up mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-4" style={{ ["--d" as string]: "320ms" }}>
            <a href={waLink()} target="_blank" rel="noopener" className="btn btn-gold">
              <IconWhatsApp />
              Quero ver o meu rascunho
            </a>
            <a href="#como-funciona" className="btn btn-ghost">
              Como funciona
              <IconArrow className="arr size-4 rotate-90" />
            </a>
          </div>

          <ul className="fade-up mt-12 flex flex-wrap gap-x-6 gap-y-2 border-t border-pearl/10 pt-5 meta" style={{ ["--d" as string]: "420ms" }}>
            <li>Rascunho sem custo</li>
            <li>Sem taxa de criação</li>
            <li>Sem fidelidade</li>
          </ul>
        </div>

        <div className="mx-auto w-full max-w-[36rem] sm:max-w-[42rem] lg:col-span-6 lg:max-w-none">
          <HeroScene />
        </div>
      </div>
    </section>
  );
}
