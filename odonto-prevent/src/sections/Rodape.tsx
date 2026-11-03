import { CONFIG } from '../config'
import { enderecoCompleto, linkTelefone, linkWhatsapp } from '../lib/whatsapp'

export function Rodape() {
  const rt = CONFIG.responsavelTecnico
  const ano = new Date().getFullYear()
  const link = 'inline-flex min-h-12 items-center text-grafite-200 transition-colors hover:text-menta'
  return (
    <footer className="border-t border-white/8 bg-grafite-950 pb-28 pt-16 text-sm text-grafite-300 lg:pb-12">
      <div className="container-site grid gap-10 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <img src="/brand/logo-prevent.webp" alt={CONFIG.nome} width={583} height={253} loading="lazy" className="h-16 w-auto" />
          <p className="mt-5 max-w-xs leading-relaxed">{enderecoCompleto()}</p>
          {rt.nome && rt.cro && (
            <p className="mt-4 text-grafite-200">
              Responsável técnico: {rt.nome} · {rt.cro}
            </p>
          )}
        </div>
        <div>
          <h2 className="rotulo text-[0.68rem] text-grafite-300">Contato</h2>
          <ul className="mt-3">
            <li>
              <a href={linkWhatsapp()} target="_blank" rel="noopener noreferrer" className={link}>
                WhatsApp
              </a>
            </li>
            <li>
              <a href={linkTelefone()} className={link}>
                {CONFIG.telefone}
              </a>
            </li>
            <li>
              <a href={CONFIG.instagram} target="_blank" rel="noopener noreferrer" className={link}>
                Instagram {CONFIG.instagramHandle}
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h2 className="rotulo text-[0.68rem] text-grafite-300">Site</h2>
          <ul className="mt-3">
            <li>
              <a href="/privacidade.html" className={link}>
                Privacidade
              </a>
            </li>
            <li>
              <a href={CONFIG.mapsUrl} target="_blank" rel="noopener noreferrer" className={link}>
                Ver no Google Maps
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="container-site mt-12 flex flex-col gap-3 border-t border-white/8 pt-8 text-xs leading-relaxed sm:flex-row sm:justify-between">
        <p>Conteúdo informativo; a indicação de cada tratamento depende de avaliação individual.</p>
        <p>
          © {ano} {CONFIG.nome}
        </p>
      </div>
    </footer>
  )
}
