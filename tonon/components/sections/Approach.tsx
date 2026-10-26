import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/BrandIcons";
import { whatsappUrl } from "@/lib/site-data";

/* Três passos honestos, baseados no atendimento informado: contato → agendamento → visita. */
const steps = [
  {
    title: "Envie uma mensagem",
    text: "Fale pelo WhatsApp e conte o que você procura. A conversa começa direto com o laboratório.",
  },
  {
    title: "Agende um horário",
    text: "O atendimento é feito mediante agendamento, para que você seja recebido com tempo e atenção.",
  },
  {
    title: "Visite o laboratório",
    text: "De segunda a sábado, das 08h às 18h, no Jardim São Nicolau, com estacionamento gratuito e acesso para cadeira de rodas.",
  },
];

export function Approach() {
  return (
    <section
      id="agendamento"
      aria-labelledby="agendamento-title"
      className="on-dark grain relative overflow-hidden bg-graphite py-24 text-paper sm:py-32 lg:py-36"
    >
      <div className="container-site relative">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <Reveal className="lg:col-span-7">
            <SectionLabel index="04" tone="dark">
              Como começar
            </SectionLabel>
            <h2 id="agendamento-title" className="display h-section mt-8 text-paper">
              Do primeiro contato <em>à visita</em>.
            </h2>
          </Reveal>
          <Reveal delay={120} className="lg:col-span-4 lg:col-start-9 lg:justify-self-end">
            <Button href={whatsappUrl("schedule")} external variant="solid-light" icon={<WhatsAppIcon className="h-[1.1rem] w-[1.1rem]" />}>
              Agendar pelo WhatsApp
            </Button>
          </Reveal>
        </div>

        <ol className="mt-16 grid gap-px bg-paper/12 lg:mt-24 lg:grid-cols-3">
          {steps.map((step, i) => (
            <Reveal as="li" key={step.title} delay={i * 110} className="bg-graphite py-10 lg:px-10 lg:py-4 lg:first:pl-0">
              <span className="display block text-[4.5rem] leading-none text-champagne/80 tabular-nums lg:text-[5.5rem]">
                0{i + 1}
              </span>
              <h3 className="mt-8 text-xl font-semibold tracking-[-0.01em] text-paper">{step.title}</h3>
              <p className="mt-3 max-w-[22rem] leading-relaxed text-mineral">{step.text}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
