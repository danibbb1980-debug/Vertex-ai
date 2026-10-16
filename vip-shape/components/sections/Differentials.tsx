import { Dumbbell, HeartHandshake, Music4, Sparkles, UserRoundCheck, UsersRound } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Photo } from "@/components/ui/Photo";
import { photos } from "@/lib/site-data";

const items = [
  {
    icon: Dumbbell,
    title: "Equipamentos modernos",
    text: "Máquinas novas e modernas, para treinar com conforto e variedade.",
  },
  {
    icon: Sparkles,
    title: "Ambiente limpo e organizado",
    text: "Um espaço cuidado, que dá vontade de voltar no dia seguinte.",
  },
  {
    icon: HeartHandshake,
    title: "Equipe atenciosa",
    text: "Atendimento atencioso, de quem recebe bem e está por perto.",
  },
  {
    icon: UserRoundCheck,
    title: "Orientação durante os treinos",
    text: "Professores e personal trainers que auxiliam na execução dos exercícios.",
  },
  {
    icon: UsersRound,
    title: "Modalidades para diferentes estilos",
    text: "Musculação e aulas coletivas de Hit Dance, Dança e Jump.",
  },
  {
    icon: Music4,
    title: "Atmosfera acolhedora e motivadora",
    text: "Música agradável e energia boa do começo ao fim do treino.",
  },
];

export function Differentials() {
  return (
    <section id="diferenciais" aria-labelledby="diferenciais-title" className="relative py-24 sm:py-32">
      <div className="container-site">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Coluna editorial: título + foto vertical */}
          <div className="lg:col-span-5">
            <Reveal>
              <SectionHeading
                id="diferenciais-title"
                eyebrow="Por que a VIP Shape"
                title={
                  <>
                    Mais que treinar.
                    <br />
                    <span className="text-orange">É evoluir.</span>
                  </>
                }
                description="Um ambiente feito para você cuidar de si, ganhar disposição e construir uma rotina de treino."
              />
            </Reveal>
            <Reveal variant="scale" delay={120} className="relative mt-12 hidden lg:block">
              <Photo
                photo={photos.estacoes}
                sizes="(min-width: 1024px) 36vw, 0px"
                className="chamfer aspect-[4/5] w-full"
              />
              <span className="absolute -bottom-5 left-6 bg-ink px-3 py-1.5 text-[0.7rem] font-semibold tracking-[0.2em] text-mist uppercase">
                Estações de musculação
              </span>
            </Reveal>
          </div>

          {/* Lista numerada, não cards: ritmo editorial */}
          <ol className="lg:col-span-7 lg:pt-4">
            {items.map(({ icon: Icon, title, text }, i) => (
              <Reveal
                as="li"
                key={title}
                delay={i * 60}
                className="group grid grid-cols-[auto_1fr] gap-x-5 border-t border-white/10 py-7 last:border-b sm:grid-cols-[4.5rem_auto_1fr] sm:gap-x-7 sm:py-8"
              >
                <span
                  aria-hidden="true"
                  className="text-outline hidden font-display text-5xl font-bold transition-colors duration-300 group-hover:[-webkit-text-stroke-color:var(--color-orange)] sm:block"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="flex h-12 w-12 items-center justify-center border border-white/15 text-orange transition-colors duration-300 group-hover:border-orange group-hover:bg-orange group-hover:text-ink">
                  <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-xl font-bold tracking-tight text-white uppercase sm:text-2xl">{title}</h3>
                  <p className="mt-2 max-w-md text-mist">{text}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
