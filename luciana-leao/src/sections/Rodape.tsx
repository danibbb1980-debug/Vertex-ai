import { CONFIG } from '../config'
import { Logo } from '../brand/Logo'
import { EnderecoTexto } from '../components/Comum'
import { linkWhatsApp, registro, temWhatsApp } from '../lib/dados'

export function Rodape() {
  const ano = 2026
  return (
    <footer className="bg-grafite-800 text-pedra/85 em-escuro">
      <div className="container-site grid gap-12 py-16 md:grid-cols-12 lg:py-20">
        <div className="md:col-span-5">
          <Logo variante="empilhado" tom="claro" className="h-auto w-64" />
          <p className="mt-8 text-[0.95rem] leading-relaxed text-pedra/80">
            {CONFIG.nome} · {CONFIG.descritor} · {registro()}
          </p>
        </div>
        <div className="md:col-span-4">
          <h2 className="font-sans text-[0.75rem] font-semibold uppercase tracking-[0.2em] !text-[#d9c5e0]">Endereço</h2>
          <address className="mt-4 not-italic leading-relaxed">
            <EnderecoTexto />
            {CONFIG.endereco.referencia && (
              <>
                <br />
                <span className="italic text-pedra/75">{CONFIG.endereco.referencia}</span>
              </>
            )}
          </address>
        </div>
        <div className="md:col-span-3">
          <h2 className="font-sans text-[0.75rem] font-semibold uppercase tracking-[0.2em] !text-[#d9c5e0]">Contato</h2>
          <ul className="mt-3">
            {temWhatsApp && (
              <li>
                <a href={linkWhatsApp()} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center hover:text-pedra">
                  WhatsApp {CONFIG.whatsappExibicao}
                </a>
              </li>
            )}
            {CONFIG.instagram.url && (
              <li>
                <a href={CONFIG.instagram.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center break-all hover:text-pedra">
                  Instagram
                </a>
              </li>
            )}
            <li>
              <a href="/privacidade.html" className="inline-flex min-h-12 items-center hover:text-pedra">
                Privacidade
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-pedra/10">
        <div className="container-site flex flex-col gap-3 py-7 text-[0.88rem] text-pedra/70 md:flex-row md:items-center md:justify-between">
          <p>Conteúdo informativo. A indicação de cada atendimento depende de avaliação médica individual.</p>
          <p className="shrink-0">© {ano} {CONFIG.nome}</p>
        </div>
      </div>
    </footer>
  )
}
