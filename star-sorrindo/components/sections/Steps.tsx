import { whatsappUrl } from "@/lib/site-data";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/BrandIcons";

const steps = [
  { title: "Entre em contato", text: "Converse com a equipe e conte o que você gostaria de avaliar." },
  { title: "Agende uma avaliação", text: "A clínica orienta sobre a disponibilidade e as condições do atendimento." },
  { title: "Conheça as possibilidades", text: "O profissional realiza a avaliação necessária e explica as opções adequadas para o seu caso." },
];

export function Steps() {
  return (
    <section aria-labelledby="passos-title" className="border-y border-line bg-white/60 py-24 sm:py-28">
      <div className="container-site">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow justify-center">Como começar</p>
          <h2 id="passos-title" className="serif mt-5 text-[2.5rem] sm:text-5xl">
            Três passos para <em className="text-gold-ink">começar seu tratamento.</em>
          </h2>
        </Reveal>

        <ol className="relative mt-16 grid gap-10 md:grid-cols-3 md:gap-8">
          {/* Fio que liga as etapas: vertical no celular, horizontal no desktop. */}
          <span aria-hidden="true" className="absolute top-0 bottom-0 left-7 w-px bg-line md:top-7 md:right-[16%] md:bottom-auto md:left-[16%] md:h-px md:w-auto" />
          {steps.map((s, i) => (
            <Reveal as="li" key={s.title} delay={i * 120} className="relative flex gap-6 md:flex-col md:items-center md:text-center">
              <span className="serif relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-gold bg-ivory text-xl text-gold-ink">
                0{i + 1}
              </span>
              <div>
                <h3 className="serif text-[1.75rem] md:mt-6">{s.title}</h3>
                <p className="mt-2 text-mineral md:mx-auto md:max-w-xs">{s.text}</p>
              </div>
            </Reveal>
          ))}
        </ol>

        <Reveal className="mt-14 flex justify-center">
          <Button href={whatsappUrl("default")} external icon={<WhatsAppIcon className="h-5 w-5" />}>
            Dar o primeiro passo
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
