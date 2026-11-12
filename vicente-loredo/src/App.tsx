import { CONFIG, MSG_GERAL, enderecoLinha, oabTexto, temWhats, waLink } from './config'
import { Header, Wordmark } from './components/Header'
import { Hero } from './components/Hero'
import { Advogado, Areas, ComoFunciona, Contato, CtaFinal, Duvidas, Quando } from './components/Sections'
import { Agendar } from './components/Agendar'
import { WhatsIcon } from './components/ui'

function Rascunho() {
  if (!CONFIG.rascunho) return null
  return (
    <div className="fixed inset-x-0 top-0 z-50 flex h-8 items-center justify-center border-b border-ink/20 bg-[#f3e4d9] px-3 text-center text-[0.78rem] text-ink-2">
      Rascunho para avaliação. Informações sujeitas a confirmação.
    </div>
  )
}

function Rodape() {
  const ano = new Date().getFullYear()
  return (
    <footer className="dark-zone border-t border-paper/15 bg-[#0f2035] pb-28 pt-16 text-paper/85 lg:pb-16">
      <div className="wrap grid gap-10 md:grid-cols-12">
        <div className="md:col-span-5">
          <Wordmark light />
          <p className="mt-6">
            {CONFIG.nomeExibicao}, {CONFIG.titulo}
            {oabTexto && <span className="num"> · {oabTexto}</span>}
          </p>
          <address className="mt-2 not-italic text-paper/75">{enderecoLinha}</address>
        </div>
        <div className="md:col-span-3">
          <p className="label text-paper/70">Contato</p>
          <ul className="mt-3 space-y-1">
            {temWhats && (
              <li>
                <a href={waLink(MSG_GERAL)} target="_blank" rel="noopener" className="inline-flex min-h-11 items-center underline-offset-4 hover:underline">
                  WhatsApp <span className="num ml-2">{CONFIG.whatsappExibicao}</span>
                </a>
              </li>
            )}
            {CONFIG.instagram && (
              <li>
                <a href={CONFIG.instagram} target="_blank" rel="noopener" className="inline-flex min-h-11 items-center underline-offset-4 hover:underline">
                  Instagram {CONFIG.instagramUsuario}
                </a>
              </li>
            )}
            {CONFIG.maps && (
              <li>
                <a href={CONFIG.maps} target="_blank" rel="noopener" className="inline-flex min-h-11 items-center underline-offset-4 hover:underline">
                  Ver no Google Maps
                </a>
              </li>
            )}
          </ul>
        </div>
        <div className="md:col-span-4">
          <p className="label text-paper/70">Informações</p>
          <ul className="mt-3 space-y-1">
            <li>
              <a href="/privacidade.html" className="inline-flex min-h-11 items-center underline-offset-4 hover:underline">
                Política de privacidade
              </a>
            </li>
          </ul>
        </div>
        <div className="border-t border-paper/15 pt-6 text-sm text-paper/70 md:col-span-12">
          <p className="max-w-[52rem]">
            Conteúdo meramente informativo, sem finalidade de captação de clientela, em conformidade com o Provimento
            205/2021 do Conselho Federal da OAB.
          </p>
          <p className="num mt-3">© {ano} {CONFIG.nomeExibicao}</p>
        </div>
      </div>
    </footer>
  )
}

function WhatsFixo() {
  if (!temWhats) return null
  const href = waLink(MSG_GERAL)
  return (
    <>
      {/* celular: barra fixa inferior; o rodapé tem espaço reservado para não cobrir conteúdo */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-ink/15 bg-paper/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-[2px] lg:hidden">
        <a href={href} target="_blank" rel="noopener" className="btn btn-ink w-full">
          <WhatsIcon />
          Agendar pelo WhatsApp
          <span className="sr-only"> (abre em nova aba)</span>
        </a>
      </div>
      {/* desktop: botão flutuante discreto */}
      <a
        href={href}
        target="_blank"
        rel="noopener"
        aria-label="Conversar pelo WhatsApp (abre em nova aba)"
        className="fixed bottom-6 right-6 z-40 hidden h-14 w-14 items-center justify-center border border-ink bg-paper text-ink transition-colors hover:bg-ink hover:text-paper lg:flex"
      >
        <WhatsIcon className="h-6 w-6" />
      </a>
    </>
  )
}

export default function App() {
  const s = CONFIG.secoes
  return (
    <>
      <Rascunho />
      <Header />
      <main id="conteudo">
        <Hero />
        {s.advogado && <Advogado />}
        {s.areas && CONFIG.areas.length > 0 && <Areas />}
        {s.quando && <Quando />}
        {s.comoFunciona && <ComoFunciona />}
        {s.duvidas && <Duvidas />}
        {s.contato && <Contato />}
        {s.agendar && temWhats && <Agendar />}
        {s.ctaFinal && <CtaFinal />}
      </main>
      <Rodape />
      <WhatsFixo />
    </>
  )
}
