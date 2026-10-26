import { hoursSummary, navLinks, site, whatsappUrl } from "@/lib/site-data";
import { Wordmark } from "@/components/ui/Wordmark";

const external = { target: "_blank", rel: "noopener noreferrer" } as const;

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="on-dark border-t border-paper/10 bg-graphite text-paper">
      <div className="container-site py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Wordmark tone="light" />
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-mineral">
              {site.person} · {site.role}. {site.focus}.
            </p>
          </div>

          <nav aria-label="Rodapé" className="lg:col-span-2">
            <h2 className="text-[0.66rem] font-semibold tracking-[0.22em] text-champagne uppercase">Navegação</h2>
            <ul className="mt-5 space-y-1">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="inline-block py-1.5 text-sm text-mineral transition-colors hover:text-paper">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-3">
            <h2 className="text-[0.66rem] font-semibold tracking-[0.22em] text-champagne uppercase">Contato</h2>
            <address className="mt-5 space-y-3 text-sm text-mineral not-italic">
              <a href={site.links.maps} {...external} className="block transition-colors hover:text-paper">
                {site.address.street}
                <br />
                {site.address.district}
                <br />
                {site.address.city} — {site.address.state}, CEP {site.address.postalCode}
                <span className="sr-only"> (abre o Google Maps em nova aba)</span>
              </a>
              <a href={whatsappUrl("default")} {...external} className="block py-1 transition-colors hover:text-paper">
                WhatsApp {site.phone.display}
                <span className="sr-only"> (abre em nova aba)</span>
              </a>
              <a href={site.links.instagram} {...external} className="block py-1 transition-colors hover:text-paper">
                Instagram {site.links.instagramHandle}
                <span className="sr-only"> (abre em nova aba)</span>
              </a>
            </address>
          </div>

          <div className="lg:col-span-3">
            <h2 className="text-[0.66rem] font-semibold tracking-[0.22em] text-champagne uppercase">Horário</h2>
            <dl className="mt-5 space-y-3 text-sm">
              {hoursSummary.map((h) => (
                <div key={h.label} className="flex justify-between gap-4 border-b border-paper/10 pb-3">
                  <dt className="text-mineral">{h.label}</dt>
                  <dd className="text-paper">{h.value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-xs text-mineral">Atendimento mediante agendamento recomendado.</p>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-paper/10 pt-8 text-xs text-mineral sm:flex-row sm:items-center sm:justify-between">
          <p>
            © <span data-year>{year}</span> {site.name}. Todos os direitos reservados.
          </p>
          <a href="#inicio" className="inline-block py-1 transition-colors hover:text-paper">
            Voltar ao topo ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
