import { Check } from "lucide-react";
import { whatsappUrl } from "@/lib/site-data";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/BrandIcons";

export const prosthesisPoints = [
  { title: "Avaliação individual", text: "Entender as condições da boca e o que cada paciente espera do tratamento." },
  { title: "Planejamento funcional e estético", text: "Considerar mastigação, fala, conforto e aparência de forma integrada." },
  { title: "Adaptação às necessidades", text: "Indicar a solução compatível com a saúde bucal e a rotina de cada pessoa." },
  { title: "Acompanhamento profissional", text: "Orientar sobre adaptação, higiene e retornos ao longo do uso." },
];

export function Prosthesis() {
  return (
    <section id="proteses" aria-labelledby="proteses-title" className="py-24 sm:py-32">
      <div className="container-site grid gap-14 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-5">
          <p className="eyebrow">Próteses dentárias</p>
          <h2 id="proteses-title" className="serif mt-5 text-[2.5rem] sm:text-5xl lg:text-[3.3rem]">
            Mais possibilidades para recuperar a <em className="text-gold-ink">função e o conforto.</em>
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-mineral">
            As próteses dentárias podem ajudar a restaurar dentes ausentes ou comprometidos. A indicação depende das
            condições de saúde bucal, das necessidades de cada paciente e da avaliação do profissional responsável.
          </p>
          <div className="mt-10 flex flex-col gap-x-8 gap-y-3 sm:flex-row sm:flex-wrap sm:items-center">
            <Button href={whatsappUrl("prosthesis")} external icon={<WhatsAppIcon className="h-5 w-5" />}>
              Conversar sobre próteses dentárias
            </Button>
            <Button href="/proteses-dentarias/" variant="text" arrow>
              Saiba mais
            </Button>
          </div>
        </Reveal>

        <ul className="grid gap-px overflow-hidden rounded-[1.75rem] border border-line bg-line sm:grid-cols-2 lg:col-span-7">
          {prosthesisPoints.map((p, i) => (
            <Reveal as="li" key={p.title} delay={i * 80} className="bg-white p-8 sm:p-10">
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/60 text-gold-ink">
                <Check className="h-4 w-4" aria-hidden="true" />
              </span>
              <h3 className="serif mt-6 text-[1.65rem]">{p.title}</h3>
              <p className="mt-3 text-mineral">{p.text}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
