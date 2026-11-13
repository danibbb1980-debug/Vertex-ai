import { CONFIG, enderecoLinha, temWhatsapp, waLink } from '../config'
import { LogoCompleto } from './Logo'

export function Rodape() {
  const rt = CONFIG.responsavelTecnico
  return (
    <footer className="no-escuro border-t border-fio-claro bg-[#1d130c] text-creme">
      <div className="mx-auto grid max-w-[1320px] gap-12 px-5 pb-32 pt-16 sm:px-8 lg:grid-cols-12 lg:pb-16">
        <div className="lg:col-span-4">
          <LogoCompleto className="h-28 w-auto" tom="claro" />
          <p className="mt-6 font-display text-xl">
            {CONFIG.nome} · {CONFIG.assinatura}
          </p>
        </div>
        <div className="grid gap-8 text-[0.95rem] text-creme-suave sm:grid-cols-2 lg:col-span-7 lg:col-start-6">
          <div>
            <p className="rotulo text-creme">Endereço</p>
            <address className="mt-3 not-italic leading-relaxed">{enderecoLinha}</address>
          </div>
          <div>
            <p className="rotulo text-creme">Contato</p>
            <ul className="mt-3 space-y-1">
              {temWhatsapp && (
                <li>
                  <a className="inline-flex min-h-11 items-center hover:text-creme" href={waLink()} target="_blank" rel="noopener noreferrer">
                    WhatsApp {CONFIG.whatsappExibicao}
                  </a>
                </li>
              )}
              {CONFIG.telefone.tel && (
                <li>
                  <a className="num inline-flex min-h-11 items-center hover:text-creme" href={`tel:${CONFIG.telefone.tel}`}>
                    Telefone {CONFIG.telefone.exibicao}
                  </a>
                </li>
              )}
              {CONFIG.email && (
                <li>
                  <a className="inline-flex min-h-11 items-center hover:text-creme" href={`mailto:${CONFIG.email}`}>
                    {CONFIG.email}
                  </a>
                </li>
              )}
              {CONFIG.instagram.url && (
                <li>
                  <a className="inline-flex min-h-11 items-center hover:text-creme" href={CONFIG.instagram.url} target="_blank" rel="noopener noreferrer">
                    Instagram {CONFIG.instagram.usuario}
                  </a>
                </li>
              )}
            </ul>
          </div>
          {rt.nome && rt.registro && (
            <div className="sm:col-span-2">
              <p className="rotulo text-creme">Responsável técnico</p>
              <p className="mt-3">
                {rt.nome} · <span className="num">{rt.registro}</span>
              </p>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-4 border-t border-fio-claro pt-8 text-[0.85rem] leading-relaxed text-creme-suave lg:col-span-12 lg:flex-row lg:justify-between">
          <p className="max-w-[46rem]">
            Conteúdo informativo, sem finalidade de diagnóstico. A indicação de cada procedimento depende de avaliação
            individual por profissional habilitado.
          </p>
          <p className="flex shrink-0 gap-5">
            <a href="/privacidade.html" className="inline-flex min-h-11 items-center link-sublinhado hover:text-creme">
              Privacidade
            </a>
            <span className="inline-flex min-h-11 items-center num">© {new Date().getFullYear()} {CONFIG.nome}</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
