import { useEffect, useState } from 'react'
import { CONFIG } from '../config'
import { enderecoLinha, linkWhatsapp, temWhatsapp } from '../lib/dados'
import { Botao } from './Botao'
import { IconeInstagram, IconeWhatsapp } from './Icones'
import { Favo, Logo } from './Marca'

export function CtaFinal() {
  if (!CONFIG.secoes.ctaFinal) return null
  return (
    <section aria-labelledby="titulo-cta" className="no-escuro relative overflow-hidden bg-oliva py-24 text-aveia md:py-32">
      {/* filete de mel */}
      <span aria-hidden="true" className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-mel to-transparent" />
      <svg aria-hidden="true" className="absolute left-1/2 top-0 h-24 w-8 -translate-x-1/2" viewBox="0 0 32 96">
        <path d="M16 0 V70" stroke="#D9A441" strokeWidth="2" strokeLinecap="round" />
        <path d="M16 64 C18.5 70 22 74 22 79 a6 6 0 0 1 -12 0 c0 -5 3.5 -9 6 -15Z" fill="#D9A441" />
      </svg>
      <Favo className="pointer-events-none absolute -left-20 top-1/3 w-72 text-aveia/[0.06]" />
      <Favo className="pointer-events-none absolute -right-16 bottom-6 w-56 text-mel/15" />
      <div className="container-site relative text-center">
        <p className="rotulo revela mt-6">Agende</p>
        <h2 id="titulo-cta" className="revela mx-auto mt-5 max-w-[46rem] text-[clamp(2.3rem,6vw,4.2rem)] text-aveia" style={{ ['--atraso' as string]: '80ms' }}>
          O primeiro passo é uma <em>mensagem</em>.
        </h2>
        <p className="revela mx-auto mt-6 max-w-[32rem] text-[1.1rem] text-sobre-oliva" style={{ ['--atraso' as string]: '160ms' }}>
          Conte o que você procura e o melhor dia para você. A equipe responde com os horários disponíveis.
        </p>
        <div className="revela mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row" style={{ ['--atraso' as string]: '240ms' }}>
          {temWhatsapp && (
            <Botao href={linkWhatsapp()} externo variante="mel">
              <IconeWhatsapp /> Agendar pelo WhatsApp
            </Botao>
          )}
          {CONFIG.instagram.url && (
            <Botao href={CONFIG.instagram.url} externo variante="contorno-claro">
              <IconeInstagram /> Ver no Instagram
            </Botao>
          )}
        </div>
        {temWhatsapp && CONFIG.secoes.agendamento && (
          <p className="revela mt-6">
            <a href="#agendar" className="inline-flex min-h-12 items-center font-semibold text-mel-claro underline decoration-mel/60 underline-offset-[6px] hover:decoration-mel-claro">
              Prefere escolher dia e horário? Solicite pelo formulário
            </a>
          </p>
        )}
      </div>
    </section>
  )
}

export function Rodape() {
  const { endereco, instagram } = CONFIG
  return (
    <footer className="no-escuro bg-oliva-noite pb-10 pt-16 text-sobre-oliva">
      <div className="container-site grid gap-10 md:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <Logo tom="escuro" className="text-[17px]" />
          <p className="mt-6 max-w-[22rem] text-[0.95rem]">
            Massagens, terapias faciais e corporais e depilação com cera, com hora marcada, em {endereco.cidade}.
          </p>
        </div>
        <div>
          <h2 className="font-sans text-[0.78rem] font-bold uppercase tracking-[0.2em] text-mel-claro">Endereço</h2>
          <address className="mt-4 not-italic leading-relaxed text-aveia/90">
            {endereco.rua}
            <br />
            {endereco.bairro}, {endereco.cidade} - {endereco.uf}
            <br />
            CEP {endereco.cep}
          </address>
          {CONFIG.maps.url && (
            <a href={CONFIG.maps.url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex min-h-12 items-center font-semibold text-aveia underline decoration-mel underline-offset-4">
              Como chegar<span className="sr-only"> (abre o Google Maps em nova aba)</span>
            </a>
          )}
        </div>
        <div>
          <h2 className="font-sans text-[0.78rem] font-bold uppercase tracking-[0.2em] text-mel-claro">Contato</h2>
          <ul className="mt-3">
            {temWhatsapp && (
              <li>
                <a href={linkWhatsapp()} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-2 text-aveia/90 hover:text-aveia">
                  <IconeWhatsapp tamanho={18} /> {CONFIG.whatsappExibicao}
                  <span className="sr-only"> (WhatsApp, abre em nova aba)</span>
                </a>
              </li>
            )}
            {instagram.url && (
              <li>
                <a href={instagram.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-2 text-aveia/90 hover:text-aveia">
                  <IconeInstagram tamanho={18} /> {instagram.usuario}
                  <span className="sr-only"> (abre em nova aba)</span>
                </a>
              </li>
            )}
            <li>
              <a href="/privacidade.html" className="inline-flex min-h-12 items-center text-aveia/90 underline underline-offset-4 hover:text-aveia">
                Privacidade
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="container-site mt-12 flex flex-col gap-3 border-t border-aveia/12 pt-6 text-[0.85rem] md:flex-row md:items-center md:justify-between">
        <p>Conteúdo informativo. A indicação de cada atendimento depende de avaliação individual.</p>
        <p>
          © {CONFIG.marca.nomeCompleto} · {enderecoLinha.split(', ').slice(-1)[0]}
        </p>
      </div>
    </footer>
  )
}

/** Botão flutuante (desktop) e barra fixa (celular). */
export function AtalhosWhatsapp() {
  const [visivel, setVisivel] = useState(false)
  useEffect(() => {
    document.body.classList.add('tem-barra')
    const on = () => setVisivel(window.scrollY > window.innerHeight * 0.7)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => {
      window.removeEventListener('scroll', on)
      document.body.classList.remove('tem-barra')
    }
  }, [])
  if (!temWhatsapp || !CONFIG.secoes.whatsappFlutuante) return null
  const temForm = CONFIG.secoes.agendamento
  return (
    <>
      <a
        href={linkWhatsapp()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Agendar pelo WhatsApp (abre em nova aba)"
        className={`fixed bottom-6 right-6 z-40 hidden h-14 items-center gap-2 rounded-full bg-oliva pl-4 pr-5 font-semibold text-aveia shadow-[0_12px_30px_-10px_rgb(30_36_31/0.5)] transition-[transform,opacity] duration-500 ease-[var(--ease-mel)] hover:-translate-y-0.5 md:inline-flex ${
          visivel ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
        }`}
        tabIndex={visivel ? 0 : -1}
      >
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-mel text-grafite">
          <IconeWhatsapp tamanho={18} />
        </span>
        WhatsApp
      </a>
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-oliva/12 bg-aveia/95 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 backdrop-blur-md md:hidden">
        <div className={`grid gap-2 ${temForm ? 'grid-cols-[1.2fr_1fr]' : 'grid-cols-1'}`}>
          <a href={linkWhatsapp()} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-mel px-4 text-[0.95rem] font-semibold text-grafite">
            <IconeWhatsapp tamanho={18} /> WhatsApp<span className="sr-only"> (abre em nova aba)</span>
          </a>
          {temForm && (
            <a href="#agendar" className="inline-flex min-h-12 items-center justify-center rounded-full bg-oliva px-4 text-[0.95rem] font-semibold text-aveia">
              Pedir horário
            </a>
          )}
        </div>
      </div>
    </>
  )
}
