import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { NewsletterForm } from "@/components/ui/forms";
import { Arrow } from "@/components/ui/primitives";
import { centralWhatsappHref, nav, site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="grain relative overflow-hidden bg-ink text-bone">
      {/* Encerramento: uma última frase e o convite, antes das informações. */}
      <div className="container-x border-b border-bone/10 pb-16 pt-24 md:pb-24 md:pt-32">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="eyebrow text-gold">Liberdade é se sentir bem</p>
            <p className="mt-6 font-display text-[clamp(2.6rem,6vw,5.75rem)] leading-[0.95] tracking-[-0.02em]">
              Sua próxima sessão <em className="text-gold">começa aqui.</em>
            </p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row lg:col-span-5 lg:justify-end">
            <a href={centralWhatsappHref} target="_blank" rel="noopener noreferrer" className="btn btn-solid-light">
              <span>Agendar pelo WhatsApp</span>
              <Arrow />
            </a>
            <Link href="/unidades" className="btn btn-outline-light">
              <span>Ver unidades</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="container-x grid gap-14 py-16 md:grid-cols-2 md:py-20 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4">
          <Logo className="h-8 w-auto" />
          <p className="mt-8 max-w-xs text-sm leading-relaxed text-mist">
            Fique por dentro das novidades: promoções exclusivas, dicas de cuidados com a pele e novidades da Não+Pelo.
          </p>
          <div className="mt-6 max-w-sm">
            <NewsletterForm />
          </div>
        </div>

        <nav aria-label="Rodapé" className="lg:col-span-2 lg:col-start-6">
          <p className="eyebrow mb-6 text-mist">Navegação</p>
          <ul className="space-y-3 text-[0.9375rem]">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="link-line">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <a href={site.external.blog} className="link-line" target="_blank" rel="noopener noreferrer">
                Blog
              </a>
            </li>
          </ul>
        </nav>

        <div className="lg:col-span-3">
          <p className="eyebrow mb-6 text-mist">Contato</p>
          <div className="space-y-8 text-[0.9375rem]">
            {site.contacts.map((c) => (
              <div key={c.label}>
                <p className="text-bone/60">{c.label}</p>
                <ul className="mt-2 space-y-1">
                  {c.phones.map((p) => (
                    <li key={p}>
                      <a href={`tel:+55${p.replace(/\D/g, "")}`} className="link-line tabular-nums">
                        {p}
                      </a>
                    </li>
                  ))}
                  <li>
                    <a href={`mailto:${c.email}`} className="link-line break-all">
                      {c.email}
                    </a>
                  </li>
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2">
          <p className="eyebrow mb-6 text-mist">Redes sociais</p>
          <ul className="space-y-3 text-[0.9375rem]">
            {site.social.map((s) => (
              <li key={s.href}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" className="link-line">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
          <p className="eyebrow mb-6 mt-12 text-mist">Franquias</p>
          <Link href="/franquias" className="link-line text-[0.9375rem]">
            Seja um franqueado
          </Link>
        </div>
      </div>

      <div className="container-x flex flex-col gap-4 border-t border-bone/10 py-8 text-xs leading-relaxed text-mist md:flex-row md:items-center md:justify-between">
        <p>
          {site.legalName} · CNPJ {site.cnpj}
        </p>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <a href={site.external.privacy} target="_blank" rel="noopener noreferrer" className="link-line">
            Política de privacidade
          </a>
          <p>
            Não+Pelo © <span data-year>2026</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
