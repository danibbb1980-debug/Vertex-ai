import { CONFIG, waLink } from "../config";
import { IconInstagram, IconWhatsApp } from "../components/Icons";
import { Ring } from "../components/Ring";
import { VMark } from "../components/VMark";

export function CtaFinal() {
  return (
    <section id="contato" aria-labelledby="cta-title" data-stage="cta" className="relative isolate overflow-hidden py-24 sm:py-32">
            <div className="container-v flex flex-col items-center text-center">
        <div className="relative aspect-square w-[min(56vw,240px)] sm:w-[280px]">
          <Ring className="absolute inset-0 size-full" />
          <div id="v-anchor-cta" className="absolute inset-[22%_20%_24%]">
            <VMark className="vfallback size-full" glow />
          </div>
        </div>
        <p className="eyebrow mt-10">Vamos começar</p>
        <h2 id="cta-title" className="mt-5 max-w-3xl text-[clamp(2.5rem,7vw,4.8rem)]">
          Vamos ver como o seu site <em className="serif-accent text-[1.08em]">ficaria?</em>
        </h2>
        <p className="mt-6 max-w-xl text-[1.08rem] text-mist">
          Mande uma mensagem contando sobre o seu negócio. O clique só abre a conversa: nada é contratado.
        </p>
        <div className="mt-10 flex w-full flex-col items-stretch justify-center gap-3 sm:w-auto sm:flex-row sm:items-center">
          <a href={waLink()} target="_blank" rel="noopener" className="btn btn-gold">
            <IconWhatsApp />
            Pedir meu rascunho pelo WhatsApp
          </a>
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
