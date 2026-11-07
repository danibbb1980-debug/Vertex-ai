import { CONFIG } from '../config'
import { enderecoCompleto, linkWhatsApp } from '../lib/utils'
import { Logo } from './ui'

export function Rodape() {
  return (
    <footer className="bg-creme pb-28 pt-16 md:pb-14">
      <div className="container-site">
        <div className="grid gap-10 border-b border-choco/10 pb-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <Logo variante="completo" className="h-36 text-ouro" />
          </div>
          <div className="md:col-span-4">
            <h2 className="rotulo">Endereço</h2>
            <p className="mt-3 text-choco/90">{enderecoCompleto()}</p>
            {CONFIG.maps && (
              <a href={CONFIG.maps} target="_blank" rel="noopener noreferrer" className="link-sublinhado mt-2 inline-flex min-h-12 items-center text-ouro-esc">
                Como chegar
              </a>
            )}
          </div>
          <div className="md:col-span-4">
            <h2 className="rotulo">Contato</h2>
            <ul className="mt-3">
              {CONFIG.whatsapp && (
                <li>
                  <a href={linkWhatsApp()} target="_blank" rel="noopener noreferrer" className="link-sublinhado inline-flex min-h-12 items-center">
                    WhatsApp {CONFIG.whatsappExibicao}
                  </a>
                </li>
              )}
              {CONFIG.instagram && (
                <li>
                  <a href={CONFIG.instagram} target="_blank" rel="noopener noreferrer" className="link-sublinhado inline-flex min-h-12 items-center">
                    Instagram {CONFIG.instagramUsuario}
                  </a>
                </li>
              )}
              <li>
                <a href="/privacidade.html" className="link-sublinhado inline-flex min-h-12 items-center">
                  Privacidade
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col gap-3 pt-8 text-sm text-choco/80 md:flex-row md:justify-between">
          <p>Conteúdo informativo. A indicação de cada atendimento depende de avaliação individual.</p>
          <p>
            {CONFIG.nome} · {CONFIG.cidade} - {CONFIG.uf}
          </p>
        </div>
      </div>
    </footer>
  )
}
