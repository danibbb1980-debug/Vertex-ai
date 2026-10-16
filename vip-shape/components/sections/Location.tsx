import { Clock3, MapPin, Navigation, Phone } from "lucide-react";
import { formatRange, openingHours, site, whatsappUrl } from "@/lib/site-data";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/BrandIcons";
import { OpenStatus } from "@/components/ui/OpenStatus";

/*
  Mapa incorporado pelo endpoint público de incorporação do Google Maps, que
  não exige chave de API. A busca é feita pelo endereço oficial — nenhuma
  coordenada é inventada. Se o iframe for bloqueado, o botão "Abrir no
  Google Maps" continua levando ao link oficial da academia.
*/
const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(
  `VIP Shape Academia, ${site.address.street}, ${site.address.district}, ${site.address.city} - ${site.address.state}, ${site.address.postalCode}`,
)}&z=16&hl=pt-BR&output=embed`;

export function Location() {
  return (
    <section id="localizacao" aria-labelledby="localizacao-title" className="relative py-24 sm:py-32">
      <div className="container-site">
        <Reveal className="max-w-4xl">
          <p className="eyebrow">Localização e horários</p>
          <h2 id="localizacao-title" className="display mt-5 text-[2.4rem] sm:text-6xl lg:text-[4.5rem]">
            Estamos mais perto do que <span className="text-orange">você imagina.</span>
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-5 lg:grid-cols-12">
          {/* Mapa */}
          <Reveal variant="scale" className="relative min-h-[22rem] overflow-hidden border border-white/10 bg-graphite lg:col-span-7 lg:min-h-[34rem]">
            {/* Fica sob o iframe: só aparece se o mapa não carregar. */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-8 text-center text-mist">
              <MapPin className="h-8 w-8 text-orange" aria-hidden="true" />
              <p className="max-w-xs text-sm">
                {site.address.street} – {site.address.district}, {site.address.city}
              </p>
            </div>
            <iframe
              title={`Mapa com a localização da ${site.name}`}
              src={mapSrc}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 h-full w-full border-0 [filter:invert(0.9)_hue-rotate(180deg)_saturate(0.55)_contrast(0.95)]"
            />
            <a
              href={site.links.maps}
              target="_blank"
              rel="noopener noreferrer"
              className="chamfer-sm absolute bottom-4 left-4 inline-flex min-h-11 items-center gap-2 bg-orange px-4 text-xs font-bold tracking-[0.1em] text-ink uppercase shadow-lg"
            >
              <Navigation className="h-4 w-4" aria-hidden="true" />
              Como chegar
              <span className="sr-only"> (abre o Google Maps em nova aba)</span>
            </a>
          </Reveal>

          {/* Informações */}
          <Reveal delay={120} className="flex flex-col gap-5 lg:col-span-5">
            <div className="border border-white/10 bg-graphite p-7 sm:p-8">
              <address className="not-italic">
                <p className="flex items-start gap-4">
                  <MapPin className="mt-1 h-5 w-5 shrink-0 text-orange" aria-hidden="true" />
                  <span>
                    <span className="block text-[0.68rem] font-semibold tracking-[0.2em] text-mist uppercase">Endereço</span>
                    <span className="mt-1 block text-white">
                      {site.address.street}
                      <br />
                      {site.address.district}, {site.address.city} – {site.address.state}
                      <br />
                      CEP {site.address.postalCode}
                    </span>
                  </span>
                </p>
                <p className="mt-6 flex items-start gap-4">
                  <Phone className="mt-1 h-5 w-5 shrink-0 text-orange" aria-hidden="true" />
                  <span>
                    <span className="block text-[0.68rem] font-semibold tracking-[0.2em] text-mist uppercase">
                      Telefone e WhatsApp
                    </span>
                    <a href={`tel:${site.phone.e164}`} className="mt-1 inline-block py-1 text-white hover:text-orange">
                      {site.phone.display}
                    </a>
                  </span>
                </p>
              </address>
              <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                <Button href={site.links.maps} external variant="outline" className="w-full px-4">
                  Abrir no Google Maps
                </Button>
                <Button href={whatsappUrl("visit")} external icon={<WhatsAppIcon className="h-5 w-5" />} className="w-full px-4">
                  Chamar no WhatsApp
                </Button>
              </div>
            </div>

            <div className="flex-1 border border-white/10 bg-graphite p-7 sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="flex items-center gap-3 font-display text-lg font-bold text-white uppercase">
                  <Clock3 className="h-5 w-5 text-orange" aria-hidden="true" />
                  Funcionamento
                </h3>
                <OpenStatus />
              </div>
              <dl className="mt-5">
                {openingHours.map((day) => (
                  <div
                    key={day.weekday}
                    data-weekday={day.weekday}
                    className="group flex items-center justify-between border-b border-white/8 py-2.5 text-sm last:border-0 data-[today=true]:text-white"
                  >
                    <dt className="flex items-center gap-2 text-mist group-data-[today=true]:font-semibold group-data-[today=true]:text-white">
                      {day.label}
                      <span className="hidden bg-orange px-1.5 py-0.5 text-[0.6rem] font-bold tracking-wider text-ink uppercase group-data-[today=true]:inline">
                        Hoje
                      </span>
                    </dt>
                    <dd className={`font-display font-bold ${day.opens ? "text-white" : "text-mist"}`}>{formatRange(day)}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
