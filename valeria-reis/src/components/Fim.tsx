import { useEffect, useState } from 'react'
import { CONFIG, crmTexto, enderecoLinha, identificacao, temWhatsapp, waLink } from '../config'
import { Monograma } from './Monograma'
import { Assinatura, IconeInstagram, IconeWhatsapp, LinkExterno, Titulo } from './ui'

export function CtaFinal() {
  return (
    <section id="cta-final" aria-labelledby="titulo-cta" className="sobre-escuro relative overflow-hidden bg-cafe py-24 text-creme md:py-36">
      {/* o traço em ouro atravessa a seção */}
      <svg aria-hidden="true" focusable="false" viewBox="0 0 1440 200" preserveAspectRatio="none" className="pointer-events-none absolute inset-x-0 top-10 h-32 w-full md:top-14 md:h-40">
        <path d="M-10 150C220 150 340 40 560 60C760 78 820 170 1040 150C1200 136 1320 70 1450 60" fill="none" stroke="#B48E57" strokeWidth="1" vectorEffect="non-scaling-stroke" opacity=".7" />
      </svg>
      <div className="wrap relative grid gap-12 md:grid-cols-12 md:items-end">
        <div className="md:col-span-8">
          <h2 id="titulo-cta" className="display mt-16 text-[clamp(2.6rem,7vw,5.2rem)]">
            <Titulo texto="Sua consulta é o primeiro *passo*." />
          </h2>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {temWhatsapp() && (
              <LinkExterno href={waLink()} className="botao botao-claro">
                <IconeWhatsapp /> Agendar pelo WhatsApp
              </LinkExterno>
            )}
            {CONFIG.instagram && (
              <LinkExterno href={CONFIG.instagram} className="botao botao-linha-claro">
                <IconeInstagram /> Ver no Instagram
              </LinkExterno>
            )}
          </div>
          {CONFIG.secoes.agendar && temWhatsapp() && (
            <p className="mt-6 text-[0.98rem] text-taupe-claro">
              Prefere escolher dia e horário antes?{' '}
              <a href="#agendar" className="link-sutil text-creme">
                Use o formulário de solicitação
              </a>
              .
            </p>
          )}
        </div>
        <Monograma claro className="hidden h-auto w-full max-w-[17rem] justify-self-end md:col-span-4 md:block" peso={1.1} />
      </div>
    </section>
  )
}

export function Rodape() {
  const e = CONFIG.endereco
  const crm = crmTexto()
  return (
    <footer className="sobre-escuro border-t border-white/10 bg-cafe pb-28 pt-16 text-taupe-claro md:pb-16">
      <div className="wrap grid gap-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <a href="#topo" className="inline-flex items-center gap-4">
            <Monograma claro className="h-14 w-auto" peso={1.5} />
            <Assinatura claro />
          </a>
          <p className="mt-8 text-[0.95rem] text-creme">{identificacao()}</p>
          {crm && (
            <p className="mt-2 text-[0.9rem]">
              Responsável técnica: {CONFIG.nomeCompleto.trim() || CONFIG.nome}, {crm}
            </p>
          )}
        </div>

        <div className="text-[0.95rem] md:col-span-4">
          <h2 className="rotulo text-champagne">Endereço</h2>
          <address className="mt-3 not-italic leading-relaxed">
            {e.logradouro}
            <br />
            {e.complemento}
            <br />
            {e.bairro}, {e.cidade} - {e.uf}
            <br />
            <span className="num">CEP {e.cep}</span>
          </address>
          {CONFIG.horarios.length > 0 && (
            <p className="num mt-4">
              {CONFIG.horarios.map((h) => `${h.rotulo}, ${h.abre.replace(':', 'h')} às ${h.fecha.replace(':', 'h')}`).join(' · ')}
            </p>
          )}
        </div>

        <div className="text-[0.95rem] md:col-span-3">
          <h2 className="rotulo text-champagne">Contato</h2>
          <ul className="mt-2">
            {temWhatsapp() && (
              <li>
                <LinkExterno href={waLink()} className="inline-flex min-h-12 items-center gap-2 text-creme">
                  <IconeWhatsapp className="size-[1.1rem]" /> <span className="link-sutil">WhatsApp {CONFIG.whatsappExibicao}</span>
                </LinkExterno>
              </li>
            )}
            {CONFIG.telefone && (
              <li>
                <a href={`tel:${CONFIG.telefone.replace(/\D/g, '')}`} className="link-sutil inline-flex min-h-12 items-center text-creme">
                  {CONFIG.telefone}
                </a>
              </li>
            )}
            {CONFIG.email && (
              <li>
                <a href={`mailto:${CONFIG.email}`} className="link-sutil inline-flex min-h-12 items-center text-creme">
                  {CONFIG.email}
                </a>
              </li>
            )}
            {CONFIG.instagram && (
              <li>
                <LinkExterno href={CONFIG.instagram} className="inline-flex min-h-12 items-center gap-2 text-creme">
                  <IconeInstagram className="size-[1.1rem]" /> <span className="link-sutil">{CONFIG.instagramUsuario}</span>
                </LinkExterno>
              </li>
            )}
            {CONFIG.mapsUrl && (
              <li>
                <LinkExterno href={CONFIG.mapsUrl} className="link-sutil inline-flex min-h-12 items-center text-creme" rotuloAcessivel={`Ver no Google Maps: ${enderecoLinha()}`}>
                  Ver no Google Maps
                </LinkExterno>
              </li>
            )}
            <li>
              <a href="/privacidade.html" className="link-sutil inline-flex min-h-12 items-center text-creme">
                Privacidade
              </a>
            </li>
          </ul>
        </div>

        <div className="border-t border-white/10 pt-8 text-[0.85rem] leading-relaxed md:col-span-12 md:flex md:justify-between md:gap-10">
          <p className="max-w-[44rem]">
            Conteúdo informativo, sem finalidade de diagnóstico. A indicação de cada tratamento depende de avaliação médica
            individual.
          </p>
          <p className="mt-4 shrink-0 md:mt-0" suppressHydrationWarning>
            © {new Date().getFullYear()} {CONFIG.consultorio}
          </p>
        </div>
      </div>
    </footer>
  )
}

/**
 * Botão flutuante discreto (desktop) e barra fixa (celular).
 * Aparecem depois do topo e somem sobre o formulário e o CTA final, para não cobrir conteúdo nem repetir botões.
 */
export function AcessoWhatsapp() {
  const [visivel, setVisivel] = useState(false)
  useEffect(() => {
    const alvos = ['agendar', 'cta-final'].map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[]
    const sobre = new Set<Element>()
    let passouTopo = false
    const atualizar = () => setVisivel(passouTopo && sobre.size === 0)
    const io = new IntersectionObserver((entradas) => {
      entradas.forEach((en) => (en.isIntersecting ? sobre.add(en.target) : sobre.delete(en.target)))
      atualizar()
    })
    alvos.forEach((a) => io.observe(a))
    const rolar = () => {
      passouTopo = window.scrollY > window.innerHeight * 0.8
      atualizar()
    }
    rolar()
    window.addEventListener('scroll', rolar, { passive: true })
    return () => {
      io.disconnect()
      window.removeEventListener('scroll', rolar)
    }
  }, [])

  if (!temWhatsapp()) return null
  return (
    <>
      <div
        className={`fixed inset-x-0 bottom-0 z-40 border-t border-linha bg-creme/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 transition-transform duration-500 md:hidden ${
          visivel ? 'translate-y-0' : 'translate-y-full'
        }`}
        inert={!visivel}
      >
        <LinkExterno href={waLink()} className="botao botao-cheio w-full">
          <IconeWhatsapp /> Agendar pelo WhatsApp
        </LinkExterno>
      </div>
      <div
        className={`fixed bottom-6 right-6 z-40 hidden transition-[opacity,transform] duration-500 md:block ${
          visivel ? 'opacity-100' : 'pointer-events-none translate-y-3 opacity-0'
        }`}
        inert={!visivel}
      >
        <LinkExterno href={waLink()} className="botao botao-cheio !min-h-14 shadow-[0_6px_24px_-12px_rgba(45,33,26,0.55)]">
          <IconeWhatsapp /> Agendar pelo WhatsApp
        </LinkExterno>
      </div>
    </>
  )
}
