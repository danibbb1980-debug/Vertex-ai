import { useRef } from 'react'
import { CONFIG } from './config'
import { Logo } from './components/base'
import { LinhaAssinatura } from './components/LinhaAssinatura'
import { ComoAgendar, Contato, CtaFinal, Duvidas, HoraMarcada, Hero, Servicos, Sobre } from './components/Secoes'
import { Solicitar } from './components/Solicitar'
import { AcessoFixo, FaixaRascunho, Topo } from './components/Topo'

function Rodape() {
  const e = CONFIG.endereco
  return (
    <footer className="relative border-t fio bg-cru pb-28 pt-16 md:pb-16">
      <div className="mx-auto grid w-full max-w-[1200px] gap-10 px-5 text-[15px] md:grid-cols-12 md:px-8">
        <div className="md:col-span-4">
          <Logo className="h-[46px] w-auto" />
        </div>
        <address className="not-italic md:col-span-4">
          {e.logradouro}
          <br />
          {e.bairro}, {e.cidade} - {e.uf}, <span className="num">{e.cep}</span>
        </address>
        <ul className="space-y-1 md:col-span-4">
          {CONFIG.usarWhatsapp && (
            <li>
              WhatsApp{' '}
              <a className="link num inline-block py-2" href={`https://wa.me/${CONFIG.whatsapp}`} target="_blank" rel="noopener noreferrer">
                {CONFIG.whatsappExibicao}
              </a>
            </li>
          )}
          {CONFIG.email && (
            <li>
              <a className="link inline-block py-2" href={`mailto:${CONFIG.email}`}>
                {CONFIG.email}
              </a>
            </li>
          )}
          {CONFIG.instagram.url && (
            <li>
              <a className="link inline-block py-2" href={CONFIG.instagram.url} target="_blank" rel="noopener noreferrer">
                Instagram {CONFIG.instagram.usuario}
              </a>
            </li>
          )}
        </ul>
        <div className="flex flex-col gap-2 border-t fio pt-6 text-[14px] md:col-span-12 md:flex-row md:justify-between">
          <p>Conteúdo informativo, sem finalidade de diagnóstico.</p>
          <a className="link inline-block py-2 md:py-0" href="/privacidade.html">
            Privacidade
          </a>
        </div>
      </div>
    </footer>
  )
}

export default function App() {
  const raiz = useRef<HTMLDivElement>(null)
  const s = CONFIG.secoes
  return (
    <>
      <FaixaRascunho />
      <Topo />
      <div ref={raiz} className="relative">
        <LinhaAssinatura raiz={raiz} />
        <main id="conteudo">
          <Hero />
          {s.servicos && <Servicos />}
          {s.horaMarcada && <HoraMarcada />}
          {s.sobre && <Sobre />}
          {s.comoAgendar && <ComoAgendar />}
          {s.duvidas && <Duvidas />}
          {s.contato && <Contato />}
          {s.solicitar && <Solicitar />}
          {s.ctaFinal && <CtaFinal />}
        </main>
        <Rodape />
      </div>
      <AcessoFixo />
    </>
  )
}
