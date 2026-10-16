import { Reveal } from "@/components/ui/Reveal";
import { Eyebrow, WhatsAppLink } from "./ui";

const pillars = [
  {
    title: "Personalização",
    text: "Treinos construídos de acordo com seus objetivos e necessidades.",
  },
  {
    title: "Acompanhamento",
    text: "Profissionais atentos à execução dos movimentos e à sua evolução.",
  },
  {
    title: "Flexibilidade",
    text: "Horários flexíveis para facilitar a inclusão do treinamento na sua rotina, conforme a disponibilidade do estúdio.",
  },
];

/** "O treino deve se adaptar a você" — a mensagem central da marca. */
export function BenefitsSection() {
  return (
    <section
      id="diferenciais"
      className="relative isolate overflow-hidden bg-white py-24 text-vip-graphite sm:py-32"
    >
      {/* Grafismo do logo: canto curvo em linha verde */}
      <div
        className="pointer-events-none absolute -top-40 -right-40 -z-10 size-72 rounded-[0_9rem_0_9rem] border-[1.5px] border-vip-green/60 sm:size-[22rem]"
        aria-hidden="true"
      />

      <div className="mx-auto grid max-w-7xl gap-14 px-4 sm:px-8 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Reveal>
            <Eyebrow tone="dark">O método Studio VIP</Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-6 text-[clamp(2.7rem,8.5vw,4.6rem)] text-vip-900">
              O treino deve se adaptar a você.{" "}
              <span className="relative inline-block">
                Não o contrário.
                <span
                  className="vip-rule reveal absolute -bottom-1 left-0 h-2 w-full bg-vip-green"
                  aria-hidden="true"
                />
              </span>
            </h2>
          </Reveal>
        </div>

        <div>
          <Reveal delay={0.1}>
            <p className="text-lg leading-relaxed font-medium text-vip-900 sm:text-xl">
              Cada pessoa tem objetivos, necessidades e uma rotina diferente. Por isso, no Studio
              VIP, o treinamento é pensado para considerar suas metas, seu nível de experiência e
              suas limitações.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mt-5 leading-relaxed text-vip-graphite/75">
              Com acompanhamento próximo e orientação durante os exercícios, você tem mais clareza
              sobre o que está fazendo e como trabalhar em direção aos seus objetivos.
            </p>
          </Reveal>

          <ol className="mt-14 border-t border-vip-900/15">
            {pillars.map((pillar, index) => (
              <Reveal
                as="li"
                key={pillar.title}
                delay={index * 0.08}
                className={`vip-feature grid grid-cols-[auto_1fr] items-start gap-x-6 gap-y-2 border-b border-vip-900/15 py-8 sm:gap-x-10 ${
                  index === 1 ? "sm:pl-12" : index === 2 ? "sm:pl-24" : ""
                }`}
              >
                <span
                  className="vip-feature-num row-span-2 font-vip-display text-7xl leading-[0.8] font-extrabold text-transparent italic [-webkit-text-stroke:1.5px_var(--color-vip-800)] sm:text-8xl"
                  aria-hidden="true"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="pt-1 text-3xl text-vip-900 sm:text-4xl">{pillar.title}</h3>
                <p className="max-w-md text-[0.95rem] leading-relaxed text-vip-graphite/75">
                  {pillar.text}
                </p>
              </Reveal>
            ))}
          </ol>

          <Reveal delay={0.1}>
            <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
              <WhatsAppLink message="main" trackAs="diferenciais" variant="dark">
                Quero um treino pensado para mim
              </WhatsAppLink>
              <p className="text-sm text-vip-graphite/60">Converse com a equipe pelo WhatsApp.</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
