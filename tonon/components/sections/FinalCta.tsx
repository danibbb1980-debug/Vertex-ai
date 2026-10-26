import { site, whatsappUrl } from "@/lib/site-data";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { InstagramIcon, WhatsAppIcon } from "@/components/ui/BrandIcons";

export function FinalCta() {
  return (
    <section
      id="contato"
      aria-labelledby="contato-title"
      className="on-dark grain relative overflow-hidden bg-graphite py-28 text-paper sm:py-36 lg:py-44"
    >
      <p
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-[0.2em] left-1/2 -translate-x-1/2 font-serif text-[34vw] leading-none tracking-[-0.04em] whitespace-nowrap text-paper/[0.035] select-none"
      >
        Tonon
      </p>
      <div className="container-site relative text-center">
        <Reveal>
          <p className="label justify-center text-champagne">Contato</p>
          <h2 id="contato-title" className="display h-section mx-auto mt-8 max-w-[16ch] text-paper">
            Vamos conversar sobre o <em>seu sorriso</em>?
          </h2>
          <p className="lead mx-auto mt-8 max-w-[34rem] text-mineral">
            Envie uma mensagem e agende seu horário no Laboratório Tonon. Atendimento de segunda a sábado, das 08h
            às 18h.
          </p>
        </Reveal>
        <Reveal delay={140} className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
          <Button href={whatsappUrl("default")} external variant="solid-light" icon={<WhatsAppIcon className="h-[1.1rem] w-[1.1rem]" />}>
            Falar pelo WhatsApp
          </Button>
          <Button href={site.links.instagram} external variant="outline-light" icon={<InstagramIcon className="h-4 w-4" />}>
            {site.links.instagramHandle}
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
