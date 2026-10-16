import Image from "next/image";
import acolhimento from "@/public/studio-vip/equipe-acolhimento.jpg";
import { Reveal } from "@/components/ui/Reveal";
import { Chevrons, Eyebrow, WhatsAppLink } from "./ui";

/**
 * Principal ponto de decisão da página. Sem escassez, contador ou desconto:
 * o objetivo é baixar a barreira do primeiro contato.
 */
export function ExperimentalClassCTA() {
  return (
    <section
      id="aula-experimental"
      data-hide-float
      className="relative isolate overflow-hidden bg-vip-950"
    >
      <div
        className="absolute inset-0 -z-10 bg-[radial-gradient(90%_70%_at_20%_100%,#0b5a89_0%,transparent_60%)]"
        aria-hidden="true"
      />
      <div className="mx-auto max-w-7xl">
        <div className="px-4 py-24 sm:px-8 sm:py-32 lg:w-[58%] lg:pr-12">
          <Reveal>
            <Eyebrow>Aula experimental</Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-6 text-[clamp(2.8rem,9vw,6rem)]">
              Que tal conhecer o Studio VIP <span className="text-vip-green">na prática?</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-white/90">
              Você não precisa decidir tudo agora. Converse com nossa equipe, tire suas dúvidas e
              descubra como funciona uma aula experimental.
            </p>
          </Reveal>
          <Reveal delay={0.14}>
            <p className="mt-4 max-w-xl leading-relaxed text-white/70">
              Vamos entender o que você procura e apresentar as opções de treinamento que fazem
              sentido para sua rotina.
            </p>
          </Reveal>
          <Reveal delay={0.18}>
            <div className="mt-10">
              <WhatsAppLink
                message="experimental"
                trackAs="aula-experimental"
                className="w-full px-8 text-base sm:w-auto"
              >
                Agendar minha aula experimental
              </WhatsAppLink>
              <p className="mt-4 flex items-center gap-3 text-sm text-white/70">
                <Chevrons className="text-sm text-vip-green" />
                Fale diretamente com nossa equipe pelo WhatsApp.
              </p>
            </div>
          </Reveal>
        </div>
      </div>

      {/* Foto real: abaixo do texto no celular, sangrando até a borda direita no desktop */}
      <div className="relative min-h-[26rem] lg:absolute lg:inset-y-0 lg:right-0 lg:w-[40%]">
        <div className="vip-clip reveal absolute inset-0 overflow-hidden lg:rounded-[0_0_0_9rem]">
          <Image
            src={acolhimento}
            alt="Integrante da equipe do Studio VIP sorrindo, com a camiseta do estúdio"
            placeholder="blur"
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="h-full w-full object-cover object-[50%_25%]"
          />
          <div
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,#022a46_0%,rgba(2,42,70,0)_30%),linear-gradient(to_right,rgba(2,42,70,0.55),transparent_35%)] lg:bg-[linear-gradient(to_right,#022a46_0%,rgba(2,42,70,0)_35%)]"
            aria-hidden="true"
          />
        </div>
      </div>
    </section>
  );
}
