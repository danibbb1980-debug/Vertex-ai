import { CONFIG } from '../config'
import { enderecoLinha1, enderecoLinha2, horarioCurto, linkWhatsApp } from '../lib/dados'
import { LogoCompleto } from '../brand/Marca'

export function Rodape() {
  const zap = linkWhatsApp()
  return (
    <footer className="bg-creme pb-28 pt-16 lg:pb-14">
      <div className="mx-auto max-w-[84rem] px-4 sm:px-6 lg:px-10">
        <div className="grid gap-12 border-b border-fio pb-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <LogoCompleto className="h-auto w-40" />
            {CONFIG.fraseMarca && (
              <p className="mt-8 max-w-[18rem] font-display text-[1.6rem] leading-snug text-terracota-texto">
                {CONFIG.fraseMarca}
              </p>
            )}
          </div>
          <div className="lg:col-span-3 lg:col-start-5">
            <h2 className="rotulo mb-4 font-sans text-tinta-suave">Endereço</h2>
            <address className="not-italic">
              {enderecoLinha1()}
              <br />
              {enderecoLinha2()}
            </address>
            {horarioCurto() && <p className="mt-3 text-tinta-suave">{horarioCurto()}</p>}
          </div>
          <div className="lg:col-span-3">
            <h2 className="rotulo mb-4 font-sans text-tinta-suave">Contato</h2>
            <ul className="space-y-1">
              {zap && (
                <li>
                  <a href={zap} target="_blank" rel="noopener noreferrer" className="link-fio inline-flex min-h-11 items-center">
                    WhatsApp {CONFIG.whatsappExibicao}
                  </a>
                </li>
              )}
              {CONFIG.instagram.url && (
                <li>
                  <a href={CONFIG.instagram.url} target="_blank" rel="noopener noreferrer" className="link-fio inline-flex min-h-11 items-center">
                    Instagram {CONFIG.instagram.usuario}
                  </a>
                </li>
              )}
              {CONFIG.maps.url && (
                <li>
                  <a href={CONFIG.maps.url} target="_blank" rel="noopener noreferrer" className="link-fio inline-flex min-h-11 items-center">
                    Ver no Google Maps
                  </a>
                </li>
              )}
            </ul>
          </div>
          <div className="lg:col-span-2">
            <h2 className="rotulo mb-4 font-sans text-tinta-suave">Site</h2>
            <a href="/privacidade.html" className="link-fio inline-flex min-h-11 items-center">
              Privacidade
            </a>
          </div>
        </div>
        <div className="flex flex-col gap-3 pt-8 text-[0.85rem] text-tinta-suave sm:flex-row sm:justify-between">
          <p className="max-w-[40rem]">
            Conteúdo informativo, sem finalidade de diagnóstico. A indicação de cada atendimento depende de avaliação
            individual.
          </p>
          <p>{CONFIG.nome} · {CONFIG.cidade} - {CONFIG.uf}</p>
        </div>
      </div>
    </footer>
  )
}
