import { HeartHandshake, MapPin, MessagesSquare, Star } from "lucide-react";
import { site } from "@/lib/site-data";
import { Reveal } from "@/components/ui/Reveal";

/** Faixa discreta de credibilidade. Só dados fornecidos — sem números inventados. */
export function TrustBar() {
  const items = [
    {
      icon: Star,
      title: `Nota ${site.rating.value} no Google`,
      text: `${site.rating.count} avaliações · ref. ${site.rating.reference}`,
      href: site.links.maps,
    },
    { icon: MapPin, title: "No Centro da cidade", text: "Av. Francisco Salles, 615", href: "/#localizacao" },
    { icon: HeartHandshake, title: "Atendimento individualizado", text: "Cada caso avaliado com atenção" },
    { icon: MessagesSquare, title: "Clareza e acolhimento", text: "Etapas explicadas com calma" },
  ];

  return (
    <section aria-label="Por que confiar na Star Sorrindo" className="border-y border-line bg-white/60">
      <ul className="container-site grid grid-cols-1 divide-y divide-line sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x">
        {items.map((item, i) => {
          const Icon = item.icon;
          const content = (
            <>
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line bg-ivory text-gold-ink">
                <Icon className="h-[1.1rem] w-[1.1rem]" aria-hidden="true" />
              </span>
              <span>
                <span className="block text-[0.95rem] font-semibold">{item.title}</span>
                <span className="block text-sm text-mineral">{item.text}</span>
              </span>
            </>
          );
          return (
            <Reveal as="li" key={item.title} delay={i * 70} className="py-6 lg:px-7 lg:first:pl-0">
              {item.href ? (
                <a
                  href={item.href}
                  {...(item.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="group flex items-center gap-4"
                >
                  {content}
                  {item.href.startsWith("http") && <span className="sr-only"> (abre o Google Maps em nova aba)</span>}
                </a>
              ) : (
                <div className="flex items-center gap-4">{content}</div>
              )}
            </Reveal>
          );
        })}
      </ul>
    </section>
  );
}
