import { photos, site, whatsappUrl } from "@/lib/site-data";
import { Photo } from "@/components/ui/Photo";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/BrandIcons";
import { InterestForm } from "@/components/ui/InterestForm";

export function FinalCta() {
  return (
    <section id="contato" aria-labelledby="contato-title" className="relative isolate overflow-hidden bg-ink py-24 sm:py-32">
      <div className="absolute inset-0 -z-10">
        <Photo photo={photos.pesosLivres} sizes="100vw" className="h-full w-full" imgClassName="object-[50%_60%] opacity-55" />
        <div className="absolute inset-0 bg-linear-to-r from-ink via-ink/85 to-ink/50" />
        <div className="absolute inset-0 bg-linear-to-t from-ink via-transparent to-ink" />
      </div>
      <div aria-hidden="true" className="absolute inset-y-0 left-0 -z-10 w-1.5 bg-orange sm:w-2" />

      <div className="container-site grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-16">
        <Reveal variant="left" className="lg:col-span-7">
          <p className="eyebrow">Comece hoje</p>
          <h2 id="contato-title" className="display mt-5 text-[2.8rem] sm:text-7xl lg:text-[6rem]">
            Chegou a sua vez de <span className="text-orange">evoluir.</span>
          </h2>
          <p className="mt-6 max-w-lg text-lg text-white/85">
            Dê o primeiro passo. Conheça a VIP Shape e descubra como incluir o treino na sua rotina.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button href={whatsappUrl("default")} external icon={<WhatsAppIcon className="h-5 w-5" />}>
              Falar com a VIP Shape
            </Button>
            <a href={`tel:${site.phone.e164}`} className="inline-flex min-h-12 items-center px-1 text-sm font-semibold text-white underline-offset-8 hover:text-orange hover:underline">
              ou ligue {site.phone.display}
            </a>
          </div>
        </Reveal>
        <Reveal delay={150} className="lg:col-span-5">
          <InterestForm />
        </Reveal>
      </div>
    </section>
  );
}
