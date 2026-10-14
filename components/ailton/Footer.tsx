import { ailton, nav } from "@/lib/ailton";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      data-hide-float
      className="overflow-hidden border-t border-ad-line px-4 pt-14 pb-10 sm:px-8"
    >
      <div className="mx-auto w-full max-w-7xl">
        <p
          className="font-ad-display text-[17.5vw] leading-[0.8] text-ad-paper uppercase lg:text-[13.5rem]"
          aria-hidden="true"
        >
          Ailton <span className="text-ad-lime">D’Avila</span>
        </p>

        <div className="mt-12 flex flex-col gap-8 border-t border-ad-line pt-8 text-xs text-ad-mute md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {ailton.name} · {ailton.role} · {ailton.city} — {ailton.state}
          </p>
          <nav aria-label="Rodapé">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {nav.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="inline-flex min-h-11 items-center hover:text-ad-paper md:min-h-0"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="#inicio"
                  className="inline-flex min-h-11 items-center hover:text-ad-paper md:min-h-0"
                >
                  Voltar ao topo ↑
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
