import { Reveal } from "@/components/ui/Reveal";
import { Chevrons, Eyebrow } from "./ui";

const features = [
  {
    title: "Treinamento funcional",
    text: "Exercícios orientados para trabalhar capacidades físicas e movimentos de acordo com os objetivos definidos para o seu treinamento.",
  },
  {
    title: "Condicionamento físico",
    text: "Um acompanhamento direcionado ao desenvolvimento da capacidade física e à construção de uma rotina ativa.",
  },
  {
    title: "Atenção individualizada",
    text: "Orientação próxima, correção dos movimentos e adaptação do treino às suas necessidades.",
  },
  {
    title: "Ambiente acolhedor",
    text: "Um espaço em que você pode treinar com orientação, esclarecer dúvidas e se sentir acompanhado durante o processo.",
  },
];

/**
 * "Muito além de uma academia".
 *
 * Não há fotos do espaço nas imagens fornecidas, então a seção é tipográfica:
 * nenhuma foto de banco ou equipamento que o estúdio talvez não tenha.
 */
export function TrainingSection() {
  return (
    <section id="estudio" className="relative isolate overflow-hidden bg-vip-950 py-24 sm:py-32">
      {/* "VIP" gigante vazado ao fundo */}
      <span
        className="vip-ghost parallax pointer-events-none absolute -bottom-[0.18em] -left-[0.06em] -z-10 text-[16rem] sm:text-[26rem] lg:text-[34rem]"
        style={{ "--parallax-shift": "-70px" } as React.CSSProperties}
        aria-hidden="true"
      >
        VIP
      </span>

      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-end lg:gap-16">
          <div>
            <Reveal>
              <Eyebrow>Muito além de uma academia</Eyebrow>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-6 text-[clamp(2.8rem,9vw,5.8rem)]">
                Um espaço para treinar <span className="text-vip-green">com propósito.</span>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <p className="text-base leading-relaxed text-white/75 sm:text-lg">
              O Studio VIP combina treinamento personalizado, ambiente acolhedor e atenção às
              necessidades individuais para tornar sua experiência de treino mais orientada e
              consistente.
            </p>
          </Reveal>
        </div>

        <ul className="mt-16 grid sm:mt-20 sm:grid-cols-2">
          {features.map((feature, index) => (
            <Reveal
              as="li"
              key={feature.title}
              delay={(index % 2) * 0.08}
              className={`vip-feature group relative border-t border-white/12 py-10 sm:px-8 sm:py-12 ${
                index % 2 === 1 ? "sm:border-l sm:translate-y-12" : "sm:pl-0"
              }`}
            >
              <div className="flex items-baseline gap-5">
                <span
                  className="vip-feature-num font-vip-display text-5xl font-extrabold text-transparent italic [-webkit-text-stroke:1.5px_rgba(255,255,255,0.45)]"
                  aria-hidden="true"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="text-3xl sm:text-[2.6rem]">{feature.title}</h3>
              </div>
              <p className="mt-5 max-w-md leading-relaxed text-white/70">{feature.text}</p>
              <span
                className={`absolute top-[-1px] left-0 h-[3px] w-14 bg-vip-green transition-[width] duration-700 ease-out group-hover:w-32 ${
                  index % 2 === 1 ? "sm:left-8" : ""
                }`}
                aria-hidden="true"
              />
            </Reveal>
          ))}
        </ul>

        <Reveal className="mt-10 flex justify-end sm:mt-24">
          <Chevrons className="text-4xl text-vip-green sm:text-6xl" />
        </Reveal>
      </div>
    </section>
  );
}
