import { ArrowUpRight, Clock, MapPin, Phone } from "lucide-react";
import { defaultMessage, site, whatsappUrl } from "@/lib/site";
import { InstagramIcon, WhatsAppIcon } from "../ui/BrandIcons";
import { ButtonLink } from "../ui/Button";
import { Logo } from "../ui/Logo";
import { Reveal } from "../ui/Reveal";
import { Eyebrow } from "../ui/WaveMark";

export function Contact() {
  const rows = [
    {
      icon: MapPin,
      label: "Onde estamos",
      value: site.streetAddress ? `${site.streetAddress} — ${site.city}, ${site.state}` : `${site.city} — ${site.stateName}`,
      href: site.mapsUrl,
      cta: "Como chegar",
    },
    {
      icon: Phone,
      label: "Telefone",
      value: site.phoneDisplay,
      href: `tel:${site.phoneE164}`,
      cta: "Ligar",
    },
    {
      icon: InstagramIcon,
      label: "Instagram",
      value: site.instagram.handle,
      href: site.instagram.url,
      cta: "Seguir",
    },
    {
      icon: Clock,
      label: "Horário",
      value: site.openingHours ?? "Consulte os horários disponíveis pelo WhatsApp",
      href: whatsappUrl("Olá! Quais são os horários de atendimento?"),
      cta: "Perguntar",
    },
  ];

  return (
    <section id="contato" aria-labelledby="contato-title" className="bg-sun-soft py-24 sm:py-28 lg:py-36">
      <div className="mx-auto grid max-w-[1240px] gap-12 px-5 sm:px-8 lg:grid-cols-12 lg:gap-10">
        <Reveal className="lg:col-span-7">
          <Eyebrow>Contato</Eyebrow>
          <h2
            id="contato-title"
            className="font-display mt-6 text-[clamp(2.2rem,4.6vw,3.4rem)] font-[420] leading-[1.04] text-navy-deep"
          >
            Estamos em Alfenas, prontos para receber você.
          </h2>

          <ul className="mt-12 divide-y divide-navy/12 border-y border-navy/12">
            {rows.map(({ icon: Icon, label, value, href, cta }) => (
              <li key={label}>
                <a
                  href={href}
                  {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="group grid grid-cols-[2.75rem_1fr_auto] items-center gap-4 py-5"
                >
                  <span className="inline-flex size-11 items-center justify-center rounded-full bg-paper text-navy">
                    <Icon className="size-5" strokeWidth={1.8} aria-hidden />
                  </span>
                  <span>
                    <span className="block text-xs font-bold uppercase tracking-[0.14em] text-navy/70">{label}</span>
                    <span className="mt-1 block font-semibold text-navy">{value}</span>
                  </span>
                  <span className="hidden items-center gap-1 text-sm font-semibold text-coral-ink sm:inline-flex">
                    {cta}
                    <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
                  </span>
                </a>
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={whatsappUrl(defaultMessage)} external icon={<WhatsAppIcon className="size-5" />}>
              Agende pelo WhatsApp
            </ButtonLink>
            <ButtonLink href={site.mapsUrl} external variant="secondary" icon={<MapPin className="size-4" aria-hidden />}>
              Ver no mapa
            </ButtonLink>
          </div>
        </Reveal>

        {/* Bloco de marca: o logo completo, no amarelo original. */}
        <Reveal delay={120} className="lg:col-span-5">
          <div className="relative flex h-full min-h-[22rem] flex-col items-center justify-center gap-10 overflow-hidden rounded-[2rem] bg-sun px-8 py-12 sm:p-12">
            <svg aria-hidden viewBox="0 0 400 400" className="absolute -right-16 -top-16 w-72 opacity-80" fill="none">
              <path d="M40 200C90 110 210 80 290 120c40 20 64 40 100 30" stroke="#f4c62d" strokeWidth="10" strokeLinecap="round" />
            </svg>
            <Logo variant="vertical" className="relative h-auto w-[72%] max-w-[17rem]" />
            <p className="font-display relative max-w-xs text-center text-xl italic leading-snug text-navy-deep sm:text-[1.35rem]">
              “{site.description}”
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
