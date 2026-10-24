import { waLink } from "../config";
import { IconArrowDown, IconWhatsApp } from "../components/Icons";
import { MagneticLink } from "../components/Magnetic";
import { HeroScene } from "../components/HeroScene";

const before = ["Seu", "site", "pronto"];
const after = ["de", "você", "decidir."];

export function Hero() {
  let i = 0;
  return (
    <section id="topo" aria-labelledby="hero-title" className="relative isolate overflow-hidden">
      <div className="grid-lines pointer-events-none absolute inset-0 -z-10" aria-hidden="true" />
      <div className="container-v grid grid-cols-1 items-center gap-10 pt-28 pb-16 sm:gap-14 lg:min-h-[100svh] lg:grid-cols-12 lg:gap-6 lg:pt-28 lg:pb-20">
        <div className="lg:col-span-6 xl:col-span-6">
          <p className="eyebrow fade-up" style={{ ["--d" as string]: "0ms" }}>
            Vertex Web Studios <span className="mx-2 text-gold/60">·</span> Poços de Caldas
          </p>
          <h1
            id="hero-title"
            className="mt-6 text-[clamp(2.6rem,9.5vw,5.25rem)] leading-[1.02] tracking-[-0.035em] text-pearl"
          >
            {before.map((w) => (
              <span key={w}>
                <span className="word" style={{ ["--i" as string]: i++ }}>{w}</span>{" "}
              </span>
            ))}
            <span className="word serif-accent text-[1.08em]" style={{ ["--i" as string]: i++ }}>
              antes
            </span>{" "}
            {after.map((w) => (
              <span key={w}>
                <span className="word" style={{ ["--i" as string]: i++ }}>{w}</span>{" "}
              </span>
            ))}
          </h1>
          <p className="fade-up mt-6 max-w-[34rem] text-[1.08rem] leading-relaxed text-mist sm:text-[1.15rem]" style={{ ["--d" as string]: "450ms" }}>
            Criamos o rascunho do site da sua empresa, sem custo e sem compromisso. Você vê, pede ajustes e só então decide.
          </p>

          <div className="fade-up mt-9 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-5" style={{ ["--d" as string]: "600ms" }}>
            <MagneticLink href={waLink()} target="_blank" rel="noopener" className="btn btn-gold">
              <IconWhatsApp />
              Quero ver o meu rascunho
            </MagneticLink>
            <a href="#como-funciona" className="btn btn-ghost">
              Como funciona
              <IconArrowDown />
            </a>
          </div>
          <p className="fade-up mt-5 font-display text-[0.82rem] tracking-[0.08em] text-dim" style={{ ["--d" as string]: "750ms" }}>
            Sem taxa de criação. Sem fidelidade.
          </p>
        </div>

        {/* Composição 3D: navegador com o rascunho de um site, em camadas */}
        <div className="mx-auto w-full max-w-[34rem] sm:max-w-[40rem] lg:col-span-6 lg:-mr-[6%] lg:max-w-none lg:w-[112%] lg:translate-x-[2%]">
          <HeroScene />
        </div>
      </div>
    </section>
  );
}
