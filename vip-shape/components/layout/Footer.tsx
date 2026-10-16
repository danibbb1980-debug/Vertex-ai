import { MapPin, Phone } from "lucide-react";
import { hoursSummary, navLinks, site, whatsappUrl } from "@/lib/site-data";
import { Logo } from "@/components/ui/Logo";
import { InstagramIcon, WhatsAppIcon } from "@/components/ui/BrandIcons";

const external = { target: "_blank", rel: "noopener noreferrer" } as const;

export function Footer() {
  // O HTML estático sai com o ano do build; o ClientEnhancements atualiza
  // [data-year] no navegador, então o ano vira sozinho mesmo sem novo deploy.
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-white/8 bg-ink pt-20 pb-28 sm:pb-12">
      <p
        aria-hidden="true"
        className="text-outline pointer-events-none absolute -bottom-10 opacity-50 left-1/2 -translate-x-1/2 font-display text-[22vw] leading-none font-bold whitespace-nowrap select-none lg:text-[16rem]"
      >
        VIP SHAPE
      </p>

      <div className="container-site relative">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-12">
          <div className="sm:col-span-2 lg:col-span-4">
            <a href="#inicio" className="inline-block" aria-label={`${site.name} — voltar ao início`}>
              <Logo />
            </a>
            <p className="mt-6 max-w-xs text-sm text-mist">
              Academia de musculação e aulas coletivas em {site.city} – {site.state}. {site.tagline}
            </p>
            <div className="mt-6 flex gap-3">
              <a
                href={site.links.instagram}
                {...external}
                aria-label={`Instagram ${site.links.instagramHandle} (abre em nova aba)`}
                className="flex h-11 w-11 items-center justify-center border border-white/15 text-white transition-colors hover:border-orange hover:text-orange"
              >
                <InstagramIcon />
              </a>
              <a
                href={whatsappUrl("default")}
                {...external}
                aria-label="WhatsApp da VIP Shape (abre em nova aba)"
                className="flex h-11 w-11 items-center justify-center border border-white/15 text-white transition-colors hover:border-orange hover:text-orange"
              >
                <WhatsAppIcon />
              </a>
              <a
                href={site.links.maps}
                {...external}
                aria-label="Localização no Google Maps (abre em nova aba)"
                className="flex h-11 w-11 items-center justify-center border border-white/15 text-white transition-colors hover:border-orange hover:text-orange"
              >
                <MapPin className="h-5 w-5" aria-hidden="true" />
              </a>
            </div>
          </div>

          <nav aria-label="Rodapé" className="lg:col-span-2">
            <h2 className="text-[0.7rem] font-semibold tracking-[0.2em] text-orange uppercase">Navegação</h2>
            <ul className="mt-5 space-y-1">
              {[...navLinks, { label: "Dúvidas", href: "#faq" }].map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="inline-block py-1.5 text-sm text-mist transition-colors hover:text-white">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-3">
            <h2 className="text-[0.7rem] font-semibold tracking-[0.2em] text-orange uppercase">Contato</h2>
            <address className="mt-5 space-y-4 text-sm text-mist not-italic">
              <a href={site.links.maps} {...external} className="flex gap-3 transition-colors hover:text-white">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-orange" aria-hidden="true" />
                <span>
                  {site.address.street}
                  <br />
                  {site.address.district}
                  <br />
                  {site.address.city} – {site.address.state}, {site.address.postalCode}
                </span>
              </a>
              <a href={`tel:${site.phone.e164}`} className="flex items-center gap-3 py-1 transition-colors hover:text-white">
                <Phone className="h-4 w-4 shrink-0 text-orange" aria-hidden="true" />
                {site.phone.display}
              </a>
              <a href={site.links.instagram} {...external} className="flex items-center gap-3 py-1 transition-colors hover:text-white">
                <InstagramIcon className="h-4 w-4 shrink-0 text-orange" />
                {site.links.instagramHandle}
              </a>
            </address>
          </div>

          <div className="lg:col-span-3">
            <h2 className="text-[0.7rem] font-semibold tracking-[0.2em] text-orange uppercase">Horários</h2>
            <dl className="mt-5 space-y-3 text-sm">
              {hoursSummary.map((h) => (
                <div key={h.label} className="flex justify-between gap-4 border-b border-white/8 pb-3">
                  <dt className="text-mist">{h.label}</dt>
                  <dd className="font-semibold text-white">{h.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-white/8 pt-8 text-xs text-mist sm:flex-row sm:items-center sm:justify-between">
          <p>
            © <span data-year>{year}</span> {site.name}. Todos os direitos reservados.
          </p>
          <a href="#inicio" className="inline-block py-1 transition-colors hover:text-white">
            Voltar ao topo ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
