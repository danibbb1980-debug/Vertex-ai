import { waLink } from "../config";
import { IconArrowDown, IconWhatsApp } from "../components/Icons";
import { MagneticLink } from "../components/Magnetic";
import { Ring } from "../components/Ring";
import { VMark } from "../components/VMark";

const before = ["Seu", "site", "pronto"];
const after = ["de", "você", "decidir."];

export function Hero() {
  let i = 0;
  return (
    <section id="topo" aria-labelledby="hero-title" className="relative isolate overflow-hidden" data-stage="hero">
      <div className="grid-lines pointer-events-none absolute inset-0 -z-10" aria-hidden="true" />
      <div className="container-v grid min-h-[100svh] grid-cols-1 items-center gap-6 pt-24 pb-14 lg:grid-cols-12 lg:gap-8 lg:pt-28 lg:pb-20">
        {/* Palco do V: o espaço é reservado aqui, o canvas 3D se alinha a ele */}
        <div className="order-1 flex justify-center lg:order-2 lg:col-span-5">
          <div className="relative aspect-square w-[min(62vw,250px)] sm:w-[300px] lg:w-full lg:max-w-[460px]">
            <Ring className="absolute inset-0 size-full fade-up" />
            <div id="v-anchor-hero" className="absolute inset-[22%_20%_24%]">
              <VMark className="vfallback size-full" glow title="V da Vertex Web Studios" />
            </div>
          </div>
        </div>

        <div className="order-2 lg:order-1 lg:col-span-7">
          <p className="eyebrow fade-up" style={{ ["--d" as string]: "0ms" }}>
            Vertex Web Studios <span className="mx-2 text-gold/60">·</span> Poços de Caldas
          </p>
          <h1
            id="hero-title"
            className="mt-6 text-[clamp(2.6rem,9.5vw,5.6rem)] leading-[1.02] tracking-[-0.035em] text-pearl"
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
      </div>
    </section>
  );
}
