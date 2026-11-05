import { CONFIG, MSG, NAV, enderecoCurto, waLink } from "../config";
import { Logo } from "./Header";

export function Footer() {
  const ano = new Date().getFullYear();
  return (
    <footer data-tone="dark" className="border-t border-[var(--line)] pt-16 pb-10 md:pt-24">
      <div className="wrap">
        <div className="grid gap-12 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-4">
            <Logo className="w-[170px]" forceLight sizes="170px" lazy />
            <p className="sr-only">{CONFIG.nome}</p>
            <p className="muted mt-8 max-w-[30ch] text-[0.9375rem]">
              {CONFIG.nome}. {CONFIG.endereco.logradouro}, {enderecoCurto}.
            </p>
          </div>

          <nav aria-label="Rodapé" className="md:col-span-2 md:col-start-6">
            <p className="eyebrow">Navegação</p>
            <ul className="mt-5 space-y-1 text-[0.9375rem]">
              {NAV.map((n) => (
                <li key={n.href}>
                  <a href={n.href} className="link inline-flex min-h-10 items-center">
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-3">
            <p className="eyebrow">Contato</p>
            <ul className="mt-5 space-y-1 text-[0.9375rem]">
              <li>
                <a href={waLink(MSG.geral)} target="_blank" rel="noopener noreferrer" className="link inline-flex min-h-10 items-center">
                  WhatsApp {CONFIG.whatsappExibicao}
                </a>
              </li>
              <li>
                <a href={`mailto:${CONFIG.email}`} className="link inline-flex min-h-10 items-center break-all">
                  {CONFIG.email}
                </a>
              </li>
              <li>
                <a href={CONFIG.instagram.url} target="_blank" rel="noopener noreferrer" className="link inline-flex min-h-10 items-center">
                  Instagram {CONFIG.instagram.usuario}
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <p className="eyebrow">Horário</p>
            <p className="mt-5 text-[0.9375rem]">
              {CONFIG.horario.dias}
              <span className="block">{CONFIG.horario.periodos.join(" e ")}</span>
              <span className="muted block">{CONFIG.horario.fechado}</span>
            </p>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-[var(--line)] pt-8 text-[0.8125rem] md:mt-24 md:flex-row md:items-center md:justify-between">
          <p className="muted">
            © {ano} {CONFIG.nome}. Conteúdo informativo, sem caráter de captação de clientela.
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <a href="/privacidade.html" className="link inline-flex min-h-10 items-center">
              Privacidade
            </a>
            <span className="muted inline-flex min-h-10 items-center">Site criado pela {CONFIG.creditos.nome}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
