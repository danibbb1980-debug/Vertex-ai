import { Reveal } from "@/components/ui/Reveal";
import { ailton } from "@/lib/ailton";
import { WhatsAppCta } from "./ui";

/**
 * O momento da decisão. Tipografia grande sobre preto, com a palavra-chave
 * em destaque e uma linha de reasseguramento: a primeira conversa não exige
 * decisão. Sem escassez, sem urgência artificial.
 *
 * `data-hide-float` esconde o botão flutuante enquanto esta seção está na
 * tela — aqui o CTA já é o protagonista.
 */
export function ConversionCta() {
  return (
    <section
      id="comece"
      data-hide-float
      aria-labelledby="comece-title"
      className="relative isolate scroll-mt-16 overflow-hidden border-t border-ad-line px-4 py-28 sm:px-8 md:py-44"
    >
      {/* Tipografia gigante ao fundo */}
      <p
        className="ad-outline pointer-events-none absolute -bottom-[0.18em] left-1/2 -z-10 -translate-x-1/2 font-ad-display text-[34vw] leading-none whitespace-nowrap uppercase opacity-40 select-none"
        aria-hidden="true"
      >
        D’Avila
      </p>
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_55%_at_50%_45%,rgb(198_243_107/0.08),transparent_70%)]"
        aria-hidden="true"
      />

      <div className="mx-auto w-full max-w-5xl text-center">
        <Reveal>
          <p className="text-[0.7rem] font-medium tracking-[0.3em] text-ad-mute uppercase">
            O primeiro passo
          </p>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 id="comece-title" className="mt-8 text-[clamp(2.4rem,13vw,3rem)] sm:text-7xl lg:text-[7.5rem]">
            Vamos tirar seus objetivos <span className="text-ad-lime">do papel?</span>
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mx-auto mt-9 max-w-2xl text-[1.05rem] leading-relaxed text-ad-paper/85 md:text-xl">
            O primeiro passo é simples: converse com o Ailton, explique o que você busca e descubra
            como funciona o acompanhamento.
          </p>
        </Reveal>
        <Reveal delay={0.14}>
          <p className="ad-serif mx-auto mt-4 max-w-xl text-xl text-ad-mute md:text-2xl">
            Você não precisa decidir nada agora — é só uma conversa para conhecer as opções.
          </p>
        </Reveal>
        <Reveal delay={0.18}>
          <div className="mt-12 flex flex-col items-center gap-4">
            <WhatsAppCta
              message="conversion"
              trackAs="conversao"
              className="w-full sm:w-auto md:min-h-16 md:px-10"
            >
              Falar com o Ailton no WhatsApp
            </WhatsAppCta>
            <p className="text-xs tracking-[0.08em] text-ad-mute">
              Abre o WhatsApp com uma mensagem pronta · {ailton.phone.display}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
