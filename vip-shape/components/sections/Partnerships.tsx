import { BadgeCheck } from "lucide-react";
import { whatsappUrl } from "@/lib/site-data";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/BrandIcons";

/*
  Os nomes aparecem como texto, não como logotipos: o uso das marcas oficiais
  depende de autorização das plataformas. Planos e condições aceitos não são
  detalhados aqui até serem confirmados pela academia.
*/
const partners = [
  { name: "Wellhub", note: "Consulte as condições com a equipe pelo WhatsApp." },
  { name: "TotalPass", note: "Consulte as condições com a equipe pelo WhatsApp." },
];

export function Partnerships() {
  return (
    <section id="convenios" aria-labelledby="convenios-title" className="relative py-24 sm:py-28">
      <div className="container-site">
        <div className="chamfer relative grid gap-10 overflow-hidden bg-linear-to-br from-graphite-2 to-graphite p-8 sm:p-12 lg:grid-cols-12 lg:items-center lg:gap-12 lg:p-16">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full bg-[radial-gradient(closest-side,rgb(255_90_31/0.18),transparent)]"
          />
          <Reveal className="relative lg:col-span-6">
            <p className="eyebrow">Convênios</p>
            <h2 id="convenios-title" className="display mt-5 text-4xl sm:text-5xl">
              Wellhub e <span className="text-orange">TotalPass</span>
            </h2>
            <p className="mt-5 max-w-md text-lg text-white/85">
              Mais possibilidades para incluir a VIP Shape na sua rotina.
            </p>
            <p className="mt-3 max-w-md text-sm text-mist">
              Wellhub e TotalPass: consulte as condições com a equipe pelo WhatsApp.
            </p>
            <Button
              href={whatsappUrl("partnerships")}
              external
              variant="outline"
              icon={<WhatsAppIcon className="h-5 w-5" />}
              className="mt-8"
            >
              Confirmar meu plano
            </Button>
          </Reveal>

          <ul className="relative grid gap-4 sm:grid-cols-2 lg:col-span-6">
            {partners.map((p, i) => (
              <Reveal
                as="li"
                key={p.name}
                delay={100 + i * 90}
                className="flex min-h-44 flex-col justify-between border border-white/12 bg-ink/60 p-7"
              >
                <BadgeCheck className="h-6 w-6 text-orange" strokeWidth={1.75} aria-hidden="true" />
                <div>
                  <p className="font-display text-3xl font-bold tracking-tight text-white">{p.name}</p>
                  <p className="mt-2 text-sm text-mist">{p.note}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
