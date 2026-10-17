import { whatsappUrl } from "@/lib/site-data";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { ImplantIllustration } from "@/components/ui/ImplantIllustration";
import { WhatsAppIcon } from "@/components/ui/BrandIcons";

/** Os seis pontos educativos sobre implantes — reaproveitados na página interna. */
export const implantTopics = [
  {
    title: "O que são",
    text: "Peças instaladas no osso que servem de suporte para repor um ou mais dentes. Sobre elas é fixada uma coroa ou prótese.",
  },
  {
    title: "Quando podem ser indicados",
    text: "Em algumas situações de perda dentária, de um único dente a vários. A indicação depende de cada pessoa e só é feita após avaliação.",
  },
  {
    title: "Por que avaliar antes",
    text: "Saúde geral, gengiva, quantidade e qualidade do osso e hábitos influenciam o tratamento. A avaliação mostra o que é possível no seu caso.",
  },
  {
    title: "Como é o planejamento",
    text: "O profissional examina, solicita exames quando necessário e explica as etapas, os cuidados e as alternativas antes de qualquer decisão.",
  },
  {
    title: "O que influencia a duração",
    text: "Condição óssea, necessidade de tratamentos complementares e o tempo de cicatrização de cada organismo. Não existe prazo único.",
  },
  {
    title: "Acompanhamento",
    text: "Consultas de retorno e cuidados diários ajudam a manter a saúde da boca e do tratamento ao longo do tempo.",
  },
];

export function Implants() {
  return (
    <section id="implantes" aria-labelledby="implantes-title" className="relative overflow-hidden bg-sand py-24 sm:py-32">
      <div className="container-site">
        <div className="overflow-hidden rounded-[2rem] border border-line bg-ivory">
          <div className="grid lg:grid-cols-12">
            <div className="relative flex items-center justify-center bg-[linear-gradient(160deg,#ffffff,#f2ece2)] p-8 sm:p-12 lg:col-span-5">
              <span className="absolute top-6 left-6 rounded-full border border-line bg-white px-3 py-1 text-[0.7rem] font-semibold tracking-[0.18em] text-gold-ink uppercase">
                Tratamento em destaque
              </span>
              <Reveal className="w-full max-w-sm pt-8 lg:max-w-none">
                <ImplantIllustration className="h-auto w-full" />
              </Reveal>
            </div>

            <div className="p-8 sm:p-12 lg:col-span-7 lg:p-16">
              <Reveal>
                <p className="eyebrow">Implantes dentários</p>
                <h2 id="implantes-title" className="serif mt-5 text-[2.5rem] sm:text-5xl lg:text-[3.5rem]">
                  Recupere a confiança <em className="text-gold-ink">para sorrir.</em>
                </h2>
                <p className="mt-6 max-w-2xl text-lg leading-relaxed text-mineral">
                  A perda de um ou mais dentes pode afetar a mastigação, a fala e a confiança ao sorrir. Os implantes
                  dentários podem ser uma alternativa para determinados pacientes, após avaliação clínica e planejamento
                  individualizado.
                </p>
              </Reveal>

              <ol className="mt-10 grid gap-x-10 gap-y-7 sm:grid-cols-2">
                {implantTopics.map((t, i) => (
                  <Reveal as="li" key={t.title} delay={i * 60} className="border-t border-line pt-5">
                    <h3 className="flex items-baseline gap-3 text-[1.02rem] font-semibold">
                      <span className="serif text-lg text-gold-ink">0{i + 1}</span>
                      {t.title}
                    </h3>
                    <p className="mt-2 text-[0.95rem] leading-relaxed text-mineral">{t.text}</p>
                  </Reveal>
                ))}
              </ol>

              <Reveal className="mt-12 flex flex-col gap-x-8 gap-y-3 sm:flex-row sm:flex-wrap sm:items-center">
                <Button href={whatsappUrl("implants")} external icon={<WhatsAppIcon className="h-5 w-5" />}>
                  Quero saber mais sobre implantes
                </Button>
                <Button href="/implantes-dentarios/" variant="text" arrow>
                  Guia completo sobre implantes
                </Button>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
