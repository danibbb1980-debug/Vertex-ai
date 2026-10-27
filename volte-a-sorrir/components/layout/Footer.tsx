import { defaultMessage, navLinks, site, whatsappUrl } from "@/lib/site";
import { InstagramIcon, WhatsAppIcon } from "../ui/BrandIcons";
import { Logo } from "../ui/Logo";

export function Footer() {
  return (
    <footer className="on-dark bg-navy-deep pb-28 pt-16 text-white/75 sm:pb-12 lg:pt-20">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            {/* Placa amarela: as raízes brancas do símbolo somem sobre o azul. */}
            <a href="#inicio" aria-label="Voltar ao início" className="inline-block rounded-2xl bg-sun px-6 py-5">
              <Logo className="h-11 w-auto" />
            </a>
            <p className="mt-6 max-w-xs leading-relaxed">{site.description}</p>
          </div>

          <nav aria-label="Rodapé" className="md:col-span-3">
            <p className="eyebrow text-sun">Navegação</p>
            <ul className="mt-5 space-y-1">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="inline-flex min-h-10 items-center hover:text-white">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-4">
            <p className="eyebrow text-sun">Contato</p>
            <ul className="mt-5 space-y-1">
              <li>
                <a href={whatsappUrl(defaultMessage)} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center gap-2.5 hover:text-white">
                  <WhatsAppIcon className="size-[1.1rem]" /> WhatsApp
                </a>
              </li>
              <li>
                <a href={`tel:${site.phoneE164}`} className="inline-flex min-h-10 items-center hover:text-white">
                  {site.phoneDisplay}
                </a>
              </li>
              <li>
                <a href={site.instagram.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center gap-2.5 hover:text-white">
                  <InstagramIcon className="size-[1.1rem]" /> {site.instagram.handle}
                </a>
              </li>
              <li className="pt-1">{site.streetAddress ? `${site.streetAddress} — ` : ""}{site.city} — {site.stateName}</li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-white/10 pt-8 text-sm text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © <span data-year>2026</span> {site.name}. {site.city} — {site.state}.
          </p>
          {site.technicalLead && (
            <p>
              Responsável técnico: {site.technicalLead.name} · {site.technicalLead.cro}
            </p>
          )}
        </div>
      </div>
    </footer>
  );
}
