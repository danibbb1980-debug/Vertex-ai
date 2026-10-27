import { Reveal } from "../ui/Reveal";
import { Eyebrow } from "../ui/WaveMark";

const steps = [
  {
    title: "Você chama no WhatsApp",
    text: "Conte o que está sentindo ou o que gostaria de mudar no sorriso, e escolha um horário.",
  },
  {
    title: "Avaliação",
    text: "No consultório, o dentista examina, ouve suas dúvidas e entende a sua necessidade.",
  },
  {
    title: "Plano de tratamento",
    text: "Você recebe a proposta explicada com clareza: o que será feito, em quantas etapas e por quê.",
  },
  {
    title: "Tratamento e acompanhamento",
    text: "Cada etapa no seu ritmo, com atenção ao seu conforto do começo ao fim.",
  },
];

export function Journey() {
  return (
    <section id="como-funciona" aria-labelledby="como-funciona-title" className="bg-paper py-24 sm:py-28 lg:py-36">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <Reveal className="max-w-2xl">
          <Eyebrow>Como funciona</Eyebrow>
          <h2
            id="como-funciona-title"
            className="font-display mt-6 text-[clamp(2.2rem,4.6vw,3.4rem)] font-[420] leading-[1.04] text-navy-deep"
          >
            Do primeiro contato ao sorriso de volta.
          </h2>
        </Reveal>

        <ol className="mt-16 grid gap-y-12 sm:mt-20 md:grid-cols-2 md:gap-x-10 lg:grid-cols-4 lg:gap-x-8">
          {steps.map((step, i) => (
            <Reveal as="li" key={step.title} delay={i * 90} className="relative">
              <div className="flex items-center gap-4">
                <span className="font-display text-[2.6rem] font-[380] italic leading-none text-coral-ink tabular-nums">
                  0{i + 1}
                </span>
                <span aria-hidden className="h-px flex-1 bg-navy/15" />
              </div>
              <h3 className="mt-6 text-lg font-bold tracking-[-0.01em] text-navy">{step.title}</h3>
              <p className="mt-2.5 leading-relaxed text-stone">{step.text}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
