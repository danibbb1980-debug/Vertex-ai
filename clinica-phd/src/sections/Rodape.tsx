import { CONFIG, preenchido } from "../config";
import { Logo } from "../components/Logo";
import { enderecoLinha1, enderecoLinha2, enderecoLinha3, telHref, temTelefone, temWhatsapp, waHref } from "../lib/contato";

export function Rodape() {
  return (
    <footer className="escuro bg-grafite pb-28 pt-16 text-creme/85 md:pb-12">
      <div className="container-phd grid gap-10 md:grid-cols-12">
        <div className="md:col-span-5">
          <Logo tom="escuro" />
          <address className="mt-6 not-italic leading-relaxed">
            {enderecoLinha1}
            <br />
            {enderecoLinha2}
            <br />
            {enderecoLinha3}
          </address>
        </div>
        <nav aria-label="Contatos" className="md:col-span-4">
          <p className="text-[0.75rem] font-semibold uppercase tracking-[0.2em] text-bronze-claro">Contato</p>
          <ul className="mt-3">
            {temTelefone ? (
              <li>
                <a href={telHref} className="inline-flex min-h-12 items-center hover:text-creme">
                  {CONFIG.telefoneExibicao}
                </a>
              </li>
            ) : null}
            {temWhatsapp ? (
              <li>
                <a href={waHref()} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center hover:text-creme">
                  WhatsApp<span className="sr-only"> (abre em nova aba)</span>
                </a>
              </li>
            ) : null}
            {preenchido(CONFIG.email) ? (
              <li>
                <a href={`mailto:${CONFIG.email}`} className="inline-flex min-h-12 items-center break-all hover:text-creme">
                  {CONFIG.email}
                </a>
              </li>
            ) : null}
            {preenchido(CONFIG.instagram.url) ? (
              <li>
                <a href={CONFIG.instagram.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center hover:text-creme">
                  Instagram {CONFIG.instagram.usuario}
                  <span className="sr-only"> (abre em nova aba)</span>
                </a>
              </li>
            ) : null}
          </ul>
        </nav>
        <div className="md:col-span-3">
          <p className="text-[0.75rem] font-semibold uppercase tracking-[0.2em] text-bronze-claro">Informações</p>
          <ul className="mt-3">
            <li>
              <a href="/privacidade.html" className="inline-flex min-h-12 items-center hover:text-creme">
                Privacidade
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="container-phd mt-12">
        <div className="h-[7px] border-y border-bronze/45" aria-hidden="true" />
        <div className="mt-6 flex flex-col gap-3 text-[0.9rem] text-creme/75 md:flex-row md:justify-between">
          <p>Conteúdo informativo. A indicação de cada atendimento depende de avaliação médica individual.</p>
          <p suppressHydrationWarning>© {new Date().getFullYear()} {CONFIG.nome}</p>
        </div>
      </div>
    </footer>
  );
}
