import Image from "next/image";
import { ArrowUpRight, MapPin } from "lucide-react";
import type { ReactNode } from "react";
import { photos, site, whatsappUrl } from "@/lib/site-data";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { InstagramIcon, WhatsAppIcon } from "@/components/ui/BrandIcons";

const channels: { href: string; label: string; detail: string; icon: ReactNode; tone: string }[] = [
  {
    href: whatsappUrl,
    label: "Agendar pelo WhatsApp",
    detail: site.phone.display,
    icon: <WhatsAppIcon className="h-6 w-6" />,
    tone: "bg-mint-50",
  },
  {
    href: site.links.instagram,
    label: "Seguir no Instagram",
    detail: site.links.instagramHandle,
    icon: <InstagramIcon className="h-6 w-6" />,
    tone: "bg-lilac-100",
  },
  {
    href: site.links.maps,
    label: "Como chegar",
    detail: "Abrir a localização no Google Maps",
    icon: <MapPin className="h-6 w-6" aria-hidden="true" strokeWidth={1.8} />,
    tone: "bg-sky-100",
  },
];

export function Contact() {
  return (
    <section id="contato" aria-labelledby="contato-title" className="py-20 sm:py-28">
      <div className="container-site grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <SectionHeading
            id="contato-title"
            eyebrow="Contato e localização"
            title={
              <>
                Fale com a <em className="text-teal">Tia Lili</em>
              </>
            }
            intro="Agendamentos e informações pelo WhatsApp. Para ver o caminho até o consultório, abra a localização no Google Maps."
          />

          <ul className="mt-10 space-y-3">
            {channels.map((channel) => (
              <li key={channel.href}>
                <a
                  href={channel.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group flex items-center gap-4 rounded-[1.5rem] p-4 transition-transform duration-300 ease-out-soft hover:-translate-y-0.5 sm:gap-5 sm:p-5 ${channel.tone}`}
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-paper text-teal">
                    {channel.icon}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-lg font-semibold text-ink">{channel.label}</span>
                    <span className="block break-words text-muted">{channel.detail}</span>
                  </span>
                  <ArrowUpRight
                    className="h-5 w-5 shrink-0 text-teal transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                  <span className="sr-only"> (abre em nova aba)</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative mx-auto w-full max-w-sm lg:col-span-5 lg:max-w-none">
          <div aria-hidden="true" className="absolute -right-4 -bottom-4 h-24 w-24 rounded-full bg-butter" />
          <Image
            src={photos.fachada.src}
            width={photos.fachada.width}
            height={photos.fachada.height}
            alt={photos.fachada.alt}
            sizes="(min-width: 1024px) 400px, 384px"
            className="relative aspect-[4/5] w-full rounded-[2.5rem] rounded-bl-[6rem] object-cover"
          />
        </div>
      </div>
    </section>
  );
}
