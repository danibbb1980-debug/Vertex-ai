import Link from "next/link";
import { LogoBadge } from "@/components/ui/Logo";
import { NewsletterForm } from "@/components/ui/forms";
import { Arrow } from "@/components/ui/primitives";
import { centralWhatsappHref, nav, site, unit } from "@/lib/site";

export function Footer() {
  return (
    <footer className="grain relative overflow-hidden bg-ink text-bone">
      {/* Encerramento: uma última frase e o convite, antes das informações. */}
      <div className="container-x border-b border-bone/10 pb-16 pt-24 md:pb-24 md:pt-32">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="eyebrow text-green">Liberdade é se sentir bem</p>
            <p className="mt-6 font-display text-[clamp(2.6rem,6vw,5.75rem)] leading-[0.95] tracking-[-0.02em]">
              Sua próxima sessão <em className="text-green">começa aqui.</em>
            </p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row lg:col-span-5 lg:justify-end">
            <a href={centralWhatsappHref} target="_blank" rel="noopener noreferrer" className="btn btn-green">
              <span>Agendar pelo WhatsApp</span>
              <Arrow />
            </a>
            <a href={unit.mapsHref} target="_blank" rel="noopener noreferrer" className="btn btn-outline-light">
              <span>Como chegar</span>
            </a>
          </div>
        </div>
      </div>

      <div className="container-x grid gap-14 py-16 md:grid-cols-2 md:py-20 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4">
          <LogoBadge className="w-24" />
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
          </ul>
        </nav>

        <div className="lg:col-span-3">
          <p className="eyebrow mb-6 text-mist">{unit.name}</p>
          <address className="space-y-4 text-[0.9375rem] not-italic">
            <a href={unit.mapsHref} target="_blank" rel="noopener noreferrer" className="link-line block">
              {unit.street}
              <br />
              {unit.district}, {unit.city} - {unit.state}, {unit.postalCode}
            </a>
            <a href={centralWhatsappHref} target="_blank" rel="noopener noreferrer" className="link-line block tabular-nums">
              WhatsApp {unit.whatsappDisplay}
            </a>
            <a href={unit.instagramHref} target="_blank" rel="noopener noreferrer" className="link-line block">
              @{unit.instagram}
            </a>
          </address>
        </div>

        <div className="lg:col-span-2">
          <p className="eyebrow mb-6 text-mist">Horários</p>
          <ul className="space-y-2 text-[0.9375rem]">
            <li>Seg a sex · 08:00 – 18:00</li>
            <li>Sábado · 08:00 – 12:00</li>
            <li className="text-mist">Domingo · Fechado</li>
          </ul>
          <p className="eyebrow mb-4 mt-10 text-mist">A marca</p>
          <ul className="space-y-2 text-[0.9375rem]">
            <li>
              <a href={site.external.brand} target="_blank" rel="noopener noreferrer" className="link-line">
                naomaispelo.com.br
              </a>
            </li>
            <li>
              <a href={site.external.franchise} target="_blank" rel="noopener noreferrer" className="link-line">
                Seja um franqueado
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="container-x flex flex-col gap-4 border-t border-bone/10 py-8 text-xs leading-relaxed text-mist md:flex-row md:items-center md:justify-between">
        <p>{unit.name} · unidade da rede Não+Pelo</p>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <a href={site.external.privacy} target="_blank" rel="noopener noreferrer" className="link-line">
            Política de privacidade
          </a>
          <p>
            {unit.name} © <span data-year>2026</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
