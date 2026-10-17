import { MapPin, Phone } from "lucide-react";
import { fullAddress, hoursSummary, site, treatments, whatsappUrl } from "@/lib/site-data";
import { Logo } from "@/components/ui/Logo";
import { InstagramIcon, WhatsAppIcon } from "@/components/ui/BrandIcons";

export function Footer() {
  const rt = site.technicalResponsible;
  return (
    <footer className="on-navy bg-navy pb-28 text-mist md:pb-0">
      <div className="container-site grid gap-12 py-16 sm:py-20 md:grid-cols-2 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Logo tone="ivory" />
          <p className="mt-6 max-w-xs text-sm leading-relaxed">
            Clínica odontológica no Centro de Poços de Caldas. Implantes dentários, próteses e clínica geral com atenção
            individualizada.
          </p>
          <div className="mt-6 flex gap-3">
            <a
              href={site.links.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-ivory/15 text-ivory transition-colors hover:border-gold hover:text-gold"
              aria-label={`Instagram ${site.links.instagramHandle} (abre em nova aba)`}
            >
              <InstagramIcon className="h-5 w-5" />
            </a>
            <a
              href={whatsappUrl("default")}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-ivory/15 text-ivory transition-colors hover:border-gold hover:text-gold"
              aria-label="WhatsApp da Star Sorrindo (abre em nova aba)"
            >
              <WhatsAppIcon className="h-5 w-5" />
            </a>
            <a
              href={site.links.maps}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-ivory/15 text-ivory transition-colors hover:border-gold hover:text-gold"
              aria-label="Abrir no Google Maps (abre em nova aba)"
            >
              <MapPin className="h-5 w-5" aria-hidden="true" />
            </a>
          </div>
        </div>

        <nav aria-label="Tratamentos" className="lg:col-span-2">
          <p className="text-xs font-semibold tracking-[0.2em] text-gold uppercase">Tratamentos</p>
          <ul className="mt-5 space-y-3 text-sm">
            {treatments.map((t) => (
              <li key={t.id}>
                <a href={t.href ?? "/#tratamentos"} className="link-line text-ivory/85 hover:text-ivory">
                  {t.name}
                </a>
              </li>
            ))}
            <li>
              <a href="/contato/" className="link-line text-ivory/85 hover:text-ivory">
                Agendar avaliação
              </a>
            </li>
          </ul>
        </nav>

        <div className="lg:col-span-3">
          <p className="text-xs font-semibold tracking-[0.2em] text-gold uppercase">Contato</p>
          <address className="mt-5 space-y-4 text-sm not-italic">
            <a href={site.links.maps} target="_blank" rel="noopener noreferrer" className="flex gap-3 hover:text-ivory">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
              <span>
                {fullAddress}
                <span className="sr-only"> (abre o Google Maps em nova aba)</span>
              </span>
            </a>
            <a href={`tel:${site.phone.e164}`} className="flex gap-3 hover:text-ivory">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
              {site.phone.display}
            </a>
          </address>
        </div>

        <div className="lg:col-span-3">
          <p className="text-xs font-semibold tracking-[0.2em] text-gold uppercase">Horários</p>
          <dl className="mt-5 space-y-2.5 text-sm">
            {hoursSummary.map((h) => (
              <div key={h.label} className="flex justify-between gap-4 border-b border-ivory/10 pb-2.5">
                <dt>{h.label}</dt>
                <dd className="text-ivory">{h.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="border-t border-ivory/10">
        <div className="container-site flex flex-col gap-4 py-7 text-xs leading-relaxed sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p>
              © <span data-year>{new Date().getFullYear()}</span> {site.name}. Todos os direitos reservados.
            </p>
            <p>
              {rt
                ? `Responsável técnico: ${rt.name} — ${rt.cro}.`
                : "Informações de responsabilidade técnica disponíveis na clínica."}{" "}
              As informações deste site são educativas e não substituem a avaliação profissional.
            </p>
          </div>
          <a href="/politica-de-privacidade/" className="link-line shrink-0 text-ivory/85 hover:text-ivory">
            Política de privacidade
          </a>
        </div>
      </div>
    </footer>
  );
}
