import { ailton, nav, waLink } from "@/lib/ailton";
import { WhatsAppIcon } from "./ui";

/**
 * Header fixo. Transparente sobre o hero e sólido depois de ~160px de
 * rolagem — o fundo é animado por scroll-timeline em CSS (ver ailton.css),
 * sem listener de scroll. Sem suporte, fica um degradê escuro legível.
 *
 * No mobile não há menu: a página é uma rolagem única e a ação que importa
 * (WhatsApp) está sempre a um toque, no próprio header.
 */
export function Header() {
  return (
    <header className="ad-header fixed inset-x-0 top-0 z-40 border-b border-transparent">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-6 px-4 sm:px-8 md:h-20">
        <a
          href="#inicio"
          className="group flex flex-col leading-none"
          aria-label={`${ailton.name} — início`}
        >
          <span className="font-ad-display text-xl tracking-[0.04em] text-ad-paper uppercase md:text-2xl">
            Ailton D’Avila
          </span>
          <span className="mt-1 text-[0.6rem] font-medium tracking-[0.34em] text-ad-mute uppercase">
            Personal Trainer
          </span>
        </a>

        <nav aria-label="Seções da página" className="hidden lg:block">
          <ul className="flex items-center gap-9">
            {nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="relative py-2 text-[0.72rem] font-medium tracking-[0.2em] text-ad-mute uppercase transition-colors duration-300 after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:scale-x-0 after:bg-ad-lime after:transition-transform after:duration-300 hover:text-ad-paper hover:after:scale-x-100"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <a
          href={waLink("hero")}
          target="_blank"
          rel="noopener noreferrer"
          data-track="ailton_header"
          data-track-label="WhatsApp"
          className="inline-flex min-h-11 items-center gap-2 border border-ad-lime/60 px-4 text-[0.68rem] font-semibold tracking-[0.18em] text-ad-lime uppercase transition-colors duration-300 hover:bg-ad-lime hover:text-ad-black"
        >
          <WhatsAppIcon className="size-4" />
          <span>
            <span className="sm:hidden">Conversar</span>
            <span className="hidden sm:inline">Falar no WhatsApp</span>
          </span>
        </a>
      </div>
    </header>
  );
}
