import { Navigation, Phone } from "lucide-react";
import { formatRange, fullAddress, openingHours, site, whatsappUrl } from "@/lib/site-data";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { MapEmbed } from "@/components/ui/MapEmbed";
import { OpenStatus } from "@/components/ui/OpenStatus";
import { InstagramIcon, WhatsAppIcon } from "@/components/ui/BrandIcons";

export function Location({ headingLevel = "h2" }: { headingLevel?: "h1" | "h2" }) {
  const Heading = headingLevel;
  return (
    <section id="localizacao" aria-labelledby="localizacao-title" className="bg-sand py-24 sm:py-32">
      <div className="container-site grid gap-12 lg:grid-cols-12 lg:gap-14">
        <Reveal className="lg:col-span-5">
          <p className="eyebrow">Localização e contato</p>
          <Heading id="localizacao-title" className="serif mt-5 text-[2.5rem] sm:text-5xl">
            Estamos no coração de <em className="text-gold-ink">Poços de Caldas.</em>
          </Heading>

          <address className="mt-8 not-italic">
            <p className="text-lg">{fullAddress}</p>
            <p className="mt-1 text-sm text-mineral">Esquina da Av. Francisco Salles, no Centro.</p>
          </address>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href={site.links.directions} external icon={<Navigation className="h-4 w-4" aria-hidden="true" />}>
              Como chegar
            </Button>
            <Button href={whatsappUrl("default")} external variant="outline" icon={<WhatsAppIcon className="h-5 w-5" />}>
              Solicitar agendamento
            </Button>
          </div>

          <ul className="mt-10 space-y-1 border-t border-line pt-6 text-[0.95rem]">
            <li>
              <a href={`tel:${site.phone.e164}`} className="flex min-h-11 items-center gap-3 hover:text-gold-ink">
                <Phone className="h-4 w-4 text-gold-ink" aria-hidden="true" />
                Telefone e WhatsApp: <strong className="font-semibold">{site.phone.display}</strong>
              </a>
            </li>
            <li>
              <a href={site.links.instagram} target="_blank" rel="noopener noreferrer" className="flex min-h-11 items-center gap-3 hover:text-gold-ink">
                <InstagramIcon className="h-4 w-4 text-gold-ink" />
                Instagram {site.links.instagramHandle}
                <span className="sr-only"> (abre em nova aba)</span>
              </a>
            </li>
            <li>
              <a href={site.links.maps} target="_blank" rel="noopener noreferrer" className="flex min-h-11 items-center gap-3 hover:text-gold-ink">
                <Navigation className="h-4 w-4 text-gold-ink" aria-hidden="true" />
                Abrir perfil no Google Maps
                <span className="sr-only"> (abre em nova aba)</span>
              </a>
            </li>
          </ul>
        </Reveal>

        <Reveal delay={100} className="grid gap-5 lg:col-span-7">
          <MapEmbed className="aspect-[4/3] w-full sm:aspect-[16/10]" />
          <div className="rounded-2xl border border-line bg-white p-7">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="serif text-[1.7rem]">Horário de atendimento</h3>
              <OpenStatus />
            </div>
            <dl className="mt-5 grid gap-x-10 sm:grid-cols-2">
              {openingHours.map((d) => (
                <div
                  key={d.weekday}
                  data-weekday={d.weekday}
                  className="flex justify-between gap-4 border-b border-line py-2.5 text-[0.95rem] data-[today=true]:font-semibold data-[today=true]:text-gold-ink"
                >
                  <dt>{d.label}</dt>
                  <dd className={d.opens ? "" : "text-mineral"}>{formatRange(d)}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-xs text-mineral">Horários sujeitos a alteração em feriados. Confirme pelo WhatsApp.</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
