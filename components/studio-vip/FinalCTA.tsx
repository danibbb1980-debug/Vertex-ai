import { Reveal } from "@/components/ui/Reveal";
import { Chevrons, TornEdge, WhatsAppLink } from "./ui";

/** Último convite, em verde — a cor de ação da marca. */
export function FinalCTA() {
  return (
    <section
      data-hide-float
      className="relative isolate overflow-hidden bg-vip-green text-vip-graphite"
    >
      <TornEdge fill="#04375a" flip />
      <div className="mx-auto flex max-w-7xl flex-col items-start gap-10 px-4 py-20 sm:px-8 sm:py-24 lg:flex-row lg:items-center lg:justify-between">
        <Reveal>
          <h2 className="text-[clamp(2.8rem,9vw,6.4rem)] text-vip-900">
            Seu treino. Sua rotina.{" "}
            <br />
            Sua evolução.
          </h2>
          <p className="mt-5 max-w-lg text-lg font-medium text-vip-graphite/85">
            Dê o primeiro passo: fale com a equipe e saiba como agendar sua aula experimental.
          </p>
        </Reveal>
        <Reveal delay={0.1} className="flex flex-col items-start gap-5">
          <WhatsAppLink
            message="final"
            trackAs="cta-final"
            variant="dark"
            className="px-8 text-base"
          >
            Quero agendar minha aula
          </WhatsAppLink>
          <Chevrons className="text-5xl text-vip-900" />
        </Reveal>
      </div>
    </section>
  );
}
