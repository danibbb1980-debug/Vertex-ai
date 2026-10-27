import { HeartHandshake, Layers, UsersRound } from "lucide-react";
import { Reveal } from "../ui/Reveal";
import { Eyebrow } from "../ui/WaveMark";

const pillars = [
  {
    icon: HeartHandshake,
    title: "Atendimento personalizado",
    text: "O plano de tratamento parte da sua necessidade e do seu momento, sem soluções prontas.",
  },
  {
    icon: UsersRound,
    title: "Para você e sua família",
    text: "Cuidado para diferentes fases da vida, de quem quer manter o sorriso a quem quer recuperá-lo.",
  },
  {
    icon: Layers,
    title: "Cuidado em cada etapa",
    text: "Atenção do primeiro contato ao fim do tratamento, com explicações claras sobre cada passo.",
  },
];

export function Intro() {
  return (
    <section aria-labelledby="intro-title" className="bg-paper pb-24 pt-16 sm:pb-28 sm:pt-20 lg:pb-36 lg:pt-24">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <Reveal className="grid gap-8 lg:grid-cols-12">
          <Eyebrow className="self-start lg:col-span-3 lg:pt-4">Nosso jeito de cuidar</Eyebrow>
          <h2
            id="intro-title"
            className="font-display text-[clamp(1.9rem,4.4vw,3.35rem)] font-[400] leading-[1.12] text-navy-deep lg:col-span-9"
          >
            Um consultório perto de você, com tempo para ouvir e atenção ao que{" "}
            <span className="italic text-coral-ink">o seu sorriso</span> precisa.
          </h2>
        </Reveal>

        <ul className="mt-16 grid gap-px overflow-hidden rounded-[1.75rem] border border-line bg-line sm:mt-20 md:grid-cols-3">
          {pillars.map(({ icon: Icon, title, text }, i) => (
            <Reveal as="li" key={title} delay={i * 90} className="bg-paper p-7 sm:p-9">
              <span className="inline-flex size-12 items-center justify-center rounded-full bg-sun text-navy-deep">
                <Icon className="size-[1.35rem]" strokeWidth={1.7} aria-hidden />
              </span>
              <h3 className="mt-6 text-lg font-bold tracking-[-0.01em] text-navy">{title}</h3>
              <p className="mt-2.5 leading-relaxed text-stone">{text}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
