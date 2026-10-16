import { Reveal } from "@/components/ui/Reveal";
import { studio } from "@/lib/studio-vip";
import { Eyebrow, InstagramIcon, PinIcon, WhatsAppIcon, WhatsAppLink } from "./ui";

/**
 * Localização e contato. O mapa é um iframe com loading="lazy": fica abaixo
 * da dobra, então não pesa no carregamento inicial. Sem horário de
 * funcionamento — não foi informado.
 */
export function LocationSection() {
  const { address } = studio;

  return (
    <section id="contato" data-hide-float className="relative bg-vip-900 py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl gap-14 px-4 sm:px-8 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-20">
        <div>
          <Reveal>
            <Eyebrow>Localização e contato</Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-6 text-[clamp(2.6rem,8vw,5rem)]">
              Seu próximo treino pode <span className="text-vip-green">começar aqui.</span>
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <address className="mt-10 not-italic">
              <p className="font-vip-display text-3xl leading-none font-extrabold uppercase italic">
                {studio.fullName}
              </p>
              <dl className="mt-6 grid gap-5 text-white/85">
                <div className="flex gap-4">
                  <dt className="pt-0.5 text-vip-green">
                    <PinIcon />
                    <span className="sr-only">Endereço</span>
                  </dt>
                  <dd className="leading-relaxed">
                    {address.street}
                    <br />
                    {address.district} — {address.city}, {address.state}
                    <br />
                    CEP: {address.postalCode}
                  </dd>
                </div>
                <div className="flex gap-4">
                  <dt className="pt-0.5 text-vip-green">
                    <WhatsAppIcon />
                    <span className="sr-only">WhatsApp</span>
                  </dt>
                  <dd>
                    <a
                      href={`tel:+${studio.phone.e164}`}
                      className="underline-offset-4 hover:underline"
                      data-track="telefone"
                      data-track-label="contato"
                    >
                      {studio.phone.display}
                    </a>
                  </dd>
                </div>
                <div className="flex gap-4">
                  <dt className="pt-0.5 text-vip-green">
                    <InstagramIcon />
                    <span className="sr-only">Instagram</span>
                  </dt>
                  <dd>
                    <a
                      href={studio.links.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline-offset-4 hover:underline"
                      data-track="instagram"
                      data-track-label="contato"
                    >
                      {studio.links.instagramHandle}
                    </a>
                  </dd>
                </div>
              </dl>
            </address>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <WhatsAppLink message="main" trackAs="contato">
                Conversar pelo WhatsApp
              </WhatsAppLink>
              <a
                href={studio.links.maps}
                target="_blank"
                rel="noopener noreferrer"
                className="vip-btn vip-btn-ghost"
                data-track="maps"
                data-track-label="contato"
              >
                <PinIcon className="size-5" />
                Abrir no Google Maps
              </a>
              <a
                href={studio.links.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="vip-btn vip-btn-ghost"
                data-track="instagram"
                data-track-label="contato-botao"
              >
                <InstagramIcon className="size-5" />
                Visitar o Instagram
              </a>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <div
            className="vip-shape-line"
            style={
              {
                "--vip-r": "clamp(3rem, 8vw, 6rem)",
                "--vip-line-gap": "12px",
              } as React.CSSProperties
            }
          >
            <div className="vip-shape relative aspect-[4/3] overflow-hidden bg-vip-800 lg:aspect-square">
              {/* Visível enquanto o mapa carrega ou se ele for bloqueado (extensão, rede) */}
              <a
                href={studio.links.maps}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-8 text-center"
                tabIndex={-1}
              >
                <PinIcon className="size-10 text-vip-green" />
                <span className="font-vip-display text-3xl leading-none font-extrabold uppercase italic">
                  {address.city}
                </span>
                <span className="text-sm text-white/75">{address.street}</span>
              </a>
              <iframe
                src={studio.links.mapsEmbed}
                title={`Mapa: ${studio.fullName}, ${address.street}, ${address.city}`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 h-full w-full border-0 grayscale-[0.25]"
              />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
