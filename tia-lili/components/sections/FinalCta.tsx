import { whatsappUrl } from "@/lib/site-data";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/BrandIcons";

export function FinalCta() {
  return (
    <section aria-labelledby="cta-title" className="pb-20 sm:pb-28">
      <div className="container-site">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-mint-50 px-6 py-14 text-center sm:px-12 sm:py-20">
          <div aria-hidden="true" className="absolute -top-10 -left-10 h-32 w-32 rounded-full bg-coral-200/70" />
          <div aria-hidden="true" className="absolute -right-8 -bottom-12 h-40 w-40 rounded-full bg-butter/80" />
          <div className="relative">
            <h2 id="cta-title" className="mx-auto max-w-2xl text-[2.15rem] sm:text-5xl">
              Vamos cuidar desse <em className="text-teal">sorriso</em> juntos?
            </h2>
            <p className="mx-auto mt-5 max-w-md text-lg text-muted">
              Envie uma mensagem e solicite o agendamento da consulta.
            </p>
            <Button href={whatsappUrl} external icon={<WhatsAppIcon className="h-5 w-5" />} className="mt-9">
              Agendar pelo WhatsApp
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
