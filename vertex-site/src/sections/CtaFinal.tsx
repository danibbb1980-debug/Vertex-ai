import { CONFIG, waLink } from "../config";
import { IconInstagram, IconWhatsApp } from "../components/Icons";
import { MagneticLink } from "../components/Magnetic";
import { Ring } from "../components/Ring";
import { VMark } from "../components/VMark";

export function CtaFinal() {
  return (
    <section id="contato" aria-labelledby="cta-title" data-stage="cta" className="relative isolate overflow-hidden py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_45%,rgba(201,162,75,0.10),transparent_70%)]" aria-hidden="true" />
      <div className="container-v flex flex-col items-center text-center">
        <div className="relative aspect-square w-[min(56vw,240px)] sm:w-[280px]">
          <Ring className="absolute inset-0 size-full" />
          <div id="v-anchor-cta" className="absolute inset-[22%_20%_24%]">
            <VMark className="vfallback size-full" glow />
          </div>
        </div>
        <p data-reveal className="eyebrow mt-10">Vamos começar</p>
        <h2 id="cta-title" data-reveal style={{ ["--d" as string]: "80ms" }} className="mt-5 max-w-3xl text-[clamp(2.2rem,6.5vw,4.25rem)]">
          Vamos ver como o seu site <em className="serif-accent text-[1.08em]">ficaria?</em>
        </h2>
        <p data-reveal style={{ ["--d" as string]: "160ms" }} className="mt-6 max-w-xl text-[1.08rem] text-mist">
          Mande uma mensagem contando sobre o seu negócio. O clique só abre a conversa: nada é contratado.
        </p>
        <div data-reveal style={{ ["--d" as string]: "240ms" }} className="mt-10 flex w-full flex-col items-stretch justify-center gap-3 sm:w-auto sm:flex-row sm:items-center">
          <MagneticLink href={waLink()} target="_blank" rel="noopener" className="btn btn-gold">
            <IconWhatsApp />
            Pedir meu rascunho pelo WhatsApp
          </MagneticLink>
          {CONFIG.instagram && (
            <a href={CONFIG.instagram} target="_blank" rel="noopener" className="btn btn-ghost">
              <IconInstagram />
              Ver no Instagram
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
