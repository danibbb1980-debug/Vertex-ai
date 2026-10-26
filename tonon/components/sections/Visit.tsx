import { Accessibility, Car, Clock3, HeartHandshake, MapPin, Phone } from "lucide-react";
import { amenities, formatRange, fullAddress, openingHours, site, whatsappUrl } from "@/lib/site-data";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { OpenStatus } from "@/components/ui/OpenStatus";
import { WhatsAppIcon } from "@/components/ui/BrandIcons";

/*
  Mapa incorporado pelo endpoint público do Google Maps (sem chave de API),
  buscando pelo endereço oficial — nenhuma coordenada é inventada. Se o
  iframe for bloqueado, o endereço aparece no lugar e o botão "Como chegar"
  continua levando ao link oficial.
*/
const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(
  `${site.address.street}, ${site.address.district}, ${site.address.city} - ${site.address.state}, ${site.address.postalCode}`,
)}&z=16&hl=pt-BR&output=embed`;

const amenityIcons = { Estacionamento: Car, Acessibilidade: Accessibility, Atendimento: HeartHandshake } as const;

export function Visit() {
  return (
    <section id="visita" aria-labelledby="visita-title" className="relative bg-paper py-24 sm:py-32 lg:py-40">
      <div className="container-site">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <Reveal className="lg:col-span-7">
            <SectionLabel index="05">Visita</SectionLabel>
            <h2 id="visita-title" className="display h-section mt-8 text-graphite">
              Visite o <em>laboratório</em>.
            </h2>
          </Reveal>
          <Reveal delay={120} className="lg:col-span-4 lg:col-start-9">
            <p className="text-[0.95rem] leading-relaxed text-ink">
              No Jardim São Nicolau, em São João da Boa Vista. Recomendamos agendar antes da visita.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-12 lg:mt-20 lg:grid-cols-12 lg:gap-10">
          {/* Mapa */}
          <Reveal variant="mask" className="relative min-h-[22rem] overflow-hidden bg-paper-2 lg:col-span-7 lg:min-h-[38rem]">
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-8 text-center text-ink">
              <MapPin className="h-7 w-7 text-sage" aria-hidden="true" />
              <p className="max-w-xs text-sm">{fullAddress}</p>
            </div>
            <iframe
              title={`Mapa com a localização do ${site.name}`}
              src={mapSrc}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 h-full w-full border-0 [filter:grayscale(0.85)_contrast(1.02)_brightness(1.02)]"
            />
            <a
              href={site.links.maps}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-4 left-4 inline-flex min-h-11 items-center gap-2 rounded-[2px] bg-graphite px-4 text-[0.72rem] font-semibold tracking-[0.12em] text-paper uppercase shadow-lg transition-colors hover:bg-sage"
            >
              <MapPin className="h-4 w-4" aria-hidden="true" />
              Como chegar
              <span className="sr-only"> (abre o Google Maps em nova aba)</span>
            </a>
          </Reveal>

          {/* Informações */}
          <div className="flex flex-col gap-12 lg:col-span-5">
            <Reveal>
              <address className="not-italic">
                <p className="flex gap-4">
                  <MapPin className="mt-1 h-5 w-5 shrink-0 text-sage" aria-hidden="true" />
                  <span>
                    <span className="block text-[0.68rem] font-semibold tracking-[0.2em] text-ink uppercase">Endereço</span>
                    <span className="mt-1.5 block text-graphite">
                      {site.address.street}
                      <br />
                      {site.address.district} · {site.address.city} — {site.address.state}
                      <br />
                      CEP {site.address.postalCode}
                    </span>
                  </span>
                </p>
                <p className="mt-6 flex gap-4">
                  <Phone className="mt-1 h-5 w-5 shrink-0 text-sage" aria-hidden="true" />
                  <span>
                    <span className="block text-[0.68rem] font-semibold tracking-[0.2em] text-ink uppercase">WhatsApp</span>
                    <a href={whatsappUrl("schedule")} target="_blank" rel="noopener noreferrer" className="link-line mt-1.5 inline-block text-graphite">
                      +55 {site.phone.display}
                      <span className="sr-only"> (abre o WhatsApp em nova aba)</span>
                    </a>
                  </span>
                </p>
              </address>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button href={whatsappUrl("schedule")} external icon={<WhatsAppIcon className="h-[1.1rem] w-[1.1rem]" />} className="sm:flex-1">
                  Agendar visita
                </Button>
                <Button href={site.links.maps} external variant="outline" className="sm:flex-1">
                  Abrir no Maps
                </Button>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-graphite/15 pb-4">
                <h3 className="flex items-center gap-3 text-[0.68rem] font-semibold tracking-[0.2em] text-ink uppercase">
                  <Clock3 className="h-4 w-4 text-sage" aria-hidden="true" />
                  Horário de atendimento
                </h3>
                <OpenStatus />
              </div>
              <dl>
                {openingHours.map((day) => (
                  <div
                    key={day.weekday}
                    data-weekday={day.weekday}
                    className="group flex items-center justify-between border-b border-graphite/8 py-2.5 text-sm"
                  >
                    <dt className="flex items-center gap-2 text-ink group-data-[today=true]:font-semibold group-data-[today=true]:text-graphite">
                      {day.label}
                      <span className="hidden bg-sage px-1.5 py-0.5 text-[0.58rem] font-semibold tracking-[0.14em] text-paper uppercase group-data-[today=true]:inline">
                        Hoje
                      </span>
                    </dt>
                    <dd className={`tabular-nums ${day.opens ? "text-graphite" : "text-ink"}`}>{formatRange(day)}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </div>

        {/* Comodidades */}
        <div className="mt-20 grid gap-10 border-t border-graphite/15 pt-12 sm:grid-cols-3 lg:mt-28">
          {amenities.map((group, i) => {
            const Icon = amenityIcons[group.title as keyof typeof amenityIcons];
            return (
              <Reveal key={group.title} delay={i * 90}>
                <h3 className="flex items-center gap-3 text-[0.68rem] font-semibold tracking-[0.2em] text-graphite uppercase">
                  {Icon && <Icon className="h-4 w-4 text-sage" aria-hidden="true" />}
                  {group.title}
                </h3>
                <ul className="mt-5 space-y-2.5">
                  {group.items.map((item) => (
                    <li key={item} className="flex gap-3 text-[0.95rem] leading-snug text-ink">
                      <span aria-hidden="true" className="mt-[0.6em] h-px w-3 shrink-0 bg-sage" />
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
