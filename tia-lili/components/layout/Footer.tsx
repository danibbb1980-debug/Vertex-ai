import { navLinks, site, whatsappUrl } from "@/lib/site-data";
import { Logo } from "@/components/ui/Logo";

const external = { target: "_blank", rel: "noopener noreferrer" } as const;
const linkClass = "inline-flex min-h-11 items-center text-muted transition-colors hover:text-teal";

export function Footer() {
  return (
    <footer className="border-t border-line bg-cream pt-14 pb-28 sm:pb-14">
      <div className="container-site grid gap-10 sm:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-muted">{site.tagline}</p>
        </div>

        <nav aria-label="Rodapé">
          <h2 className="font-sans text-sm font-semibold tracking-[0.14em] text-ink uppercase">Navegação</h2>
          <ul className="mt-3">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href} className={linkClass}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="font-sans text-sm font-semibold tracking-[0.14em] text-ink uppercase">Contato</h2>
          <ul className="mt-3">
            <li>
              <a href={whatsappUrl} {...external} className={linkClass}>
                WhatsApp {site.phone.display}
                <span className="sr-only"> (abre em nova aba)</span>
              </a>
            </li>
            <li>
              <a href={site.links.instagram} {...external} className={linkClass}>
                Instagram {site.links.instagramHandle}
                <span className="sr-only"> (abre em nova aba)</span>
              </a>
            </li>
            <li>
              <a href={site.links.maps} {...external} className={linkClass}>
                Como chegar (Google Maps)
                <span className="sr-only"> (abre em nova aba)</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="container-site mt-12">
        <p className="border-t border-line pt-6 text-sm text-muted">
          © {new Date().getFullYear()} {site.name}. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
