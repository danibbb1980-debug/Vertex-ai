import { whatsappUrl } from "@/lib/site-data";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { Sparkle } from "@/components/ui/Sparkle";
import { WhatsAppIcon } from "@/components/ui/BrandIcons";

export function FinalCta({ locationHref = "/#localizacao" }: { locationHref?: string }) {
  return (
    <section aria-labelledby="cta-final-title" className="on-navy relative overflow-hidden bg-navy py-24 text-ivory sm:py-32">
      {/* Arcos concêntricos em dourado, ecoando a moldura do hero. */}
      <svg aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 mx-auto h-full w-full max-w-5xl" viewBox="0 0 1000 500" preserveAspectRatio="xMidYMax meet" fill="none">
        {[0, 1, 2, 3].map((i) => (
          <path key={i} d={`M ${120 + i * 70} 500 a ${380 - i * 70} ${380 - i * 70} 0 0 1 ${760 - i * 140} 0`} stroke="rgb(197 165 114 / 0.16)" />
        ))}
      </svg>
      <div className="container-site relative text-center">
        <Reveal className="mx-auto max-w-3xl">
          <Sparkle className="mx-auto h-6 w-6 text-gold" />
          <h2 id="cta-final-title" className="serif mt-8 text-[2.7rem] sm:text-6xl lg:text-[4.2rem]">
            Seu próximo passo começa com <em className="text-gold">uma conversa.</em>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-mist">
            Descubra as possibilidades para cuidar do seu sorriso com uma avaliação individualizada na Star Sorrindo.
          </p>
          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href={whatsappUrl("default")} external variant="gold" icon={<WhatsAppIcon className="h-5 w-5" />} className="sm:min-h-14 sm:px-8">
              Agendar avaliação pelo WhatsApp
            </Button>
            <Button href={locationHref} variant="outline-light" className="sm:min-h-14">
              Ver localização
            </Button>
          </div>
          <p className="mt-6 text-sm text-mist">O contato inicia uma conversa. O horário é confirmado pela equipe da clínica.</p>
        </Reveal>
      </div>
    </section>
  );
}
