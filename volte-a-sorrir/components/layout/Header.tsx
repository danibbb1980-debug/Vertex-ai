import { defaultMessage, navLinks, whatsappUrl } from "@/lib/site";
import { WhatsAppIcon } from "../ui/BrandIcons";
import { Logo } from "../ui/Logo";
import { MobileMenu } from "./MobileMenu";

/**
 * Cabeçalho sempre amarelo: é a cor de fundo original do logo, e as raízes
 * brancas do símbolo precisam dela para aparecer. Fundo sólido, sem
 * backdrop-filter: ele prenderia o painel fixo do menu mobile no cabeçalho.
 */
export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-sun-line/70 bg-sun">
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-full focus:bg-navy focus:px-4 focus:py-2 focus:text-white"
      >
        Pular para o conteúdo
      </a>
      <div className="mx-auto flex h-[4.25rem] max-w-[1240px] items-center justify-between gap-6 px-5 sm:px-8 lg:h-[4.75rem]">
        <a href="#inicio" className="shrink-0 rounded-md" aria-label="Dentista Volte a Sorrir — início">
          <Logo eager className="h-10 w-auto sm:h-11 lg:h-12" />
        </a>

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="rounded-full px-4 py-2 text-[0.92rem] font-semibold text-navy/80 transition-colors duration-200 hover:bg-navy/[0.06] hover:text-navy"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={whatsappUrl(defaultMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden min-h-11 items-center gap-2 rounded-full bg-navy px-5 text-[0.92rem] font-semibold text-white transition-colors duration-200 hover:bg-navy-deep sm:inline-flex"
          >
            <WhatsAppIcon className="size-[1.1rem]" />
            Agendar
          </a>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
