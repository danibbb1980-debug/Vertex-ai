import { CONFIG, enderecoCompleto } from '../config'
import { waLink } from '../lib/whatsapp'
import { IconInstagram, IconWhatsApp } from '../components/Icons'
import { Logo } from '../components/Chrome'
import { Magnetic, OvalFrame, Reveal, TextReveal } from '../components/motion'

export function CtaFinal() {
  const wa = waLink()
  return (
    <section aria-labelledby="cta-titulo" className="on-dark relative overflow-hidden bg-espresso py-28 text-cream md:py-40">
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-copper to-transparent" />
      <OvalFrame
        id="cta-oval"
        draw={false}
        className="pointer-events-none absolute left-1/2 top-1/2 h-[150%] w-[min(46rem,120vw)] -translate-x-1/2 -translate-y-1/2 opacity-40"
      />
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(196,154,108,0.16),transparent)]" />

      <div className="container-n relative text-center">
        <Reveal>
          <p className="eyebrow mb-7 flex items-center justify-center gap-4 text-copper-light">
            <span className="inline-block h-px w-8 bg-copper" aria-hidden />
            {CONFIG.nome}
            <span className="inline-block h-px w-8 bg-copper" aria-hidden />
          </p>
        </Reveal>
        <TextReveal as="h2" id="cta-titulo" className="display mx-auto max-w-4xl text-[clamp(2.6rem,7vw,5.25rem)]" text="Sua avaliação é o *primeiro* passo." />
        <Reveal delay={0.2}>
          <p className="mx-auto mt-7 max-w-xl text-[1.0625rem] leading-relaxed text-cream/80">
            Converse com a equipe, tire suas dúvidas e combine um horário com calma.
          </p>
          <div className="mt-11 flex flex-col items-center justify-center gap-3 sm:flex-row">
            {wa && (
              <Magnetic>
                <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-light w-full sm:w-auto">
                  <IconWhatsApp size={18} /> Agendar pelo WhatsApp
                </a>
              </Magnetic>
            )}
            {CONFIG.instagram && (
              <a href={CONFIG.instagram} target="_blank" rel="noopener noreferrer" className="btn btn-outline-light w-full sm:w-auto">
                <IconInstagram size={18} /> Ver no Instagram
              </a>
            )}
          </div>
          {CONFIG.secoes.agendar && wa && (
            <a href="#agendar" className="mt-7 inline-flex min-h-12 items-center text-sm text-cream/80 underline decoration-copper underline-offset-4 hover:text-cream">
              Prefere escolher dia e horário? Use o formulário de solicitação
            </a>
          )}
        </Reveal>
      </div>
    </section>
  )
}

export function Footer() {
  const rt = CONFIG.responsavelTecnico
  const wa = waLink()
  return (
    <footer className="bg-taupe text-espresso">
      <div className="container-n grid gap-12 py-16 md:grid-cols-[auto_1fr_1fr] md:gap-16 md:py-20">
        <div>
          <Logo width={110} />
        </div>
        <div className="space-y-2 text-[0.9375rem]">
          <p className="eyebrow mb-3 text-[0.6875rem] text-espresso">Endereço</p>
          <address className="not-italic leading-relaxed">{enderecoCompleto()}</address>
          {CONFIG.mapsUrl && (
            <a href={CONFIG.mapsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center underline decoration-espresso/40 underline-offset-4 hover:decoration-espresso">
              Abrir no Google Maps
            </a>
          )}
        </div>
        <div className="space-y-1 text-[0.9375rem]">
          <p className="eyebrow mb-3 text-[0.6875rem] text-espresso">Contato</p>
          <ul>
            {wa && (
              <li>
                <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-2 hover:underline">
                  <IconWhatsApp size={16} /> WhatsApp {CONFIG.telefoneExibicao}
                </a>
              </li>
            )}
            {CONFIG.instagram && (
              <li>
                <a href={CONFIG.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-2 hover:underline">
                  <IconInstagram size={16} /> Instagram {CONFIG.instagramUsuario}
                </a>
              </li>
            )}
            <li>
              <a href="/privacidade.html" className="inline-flex min-h-12 items-center hover:underline">
                Privacidade
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-espresso/15">
        <div className="container-n flex flex-col gap-3 py-7 text-[0.8125rem] leading-relaxed text-espresso/85 md:flex-row md:items-center md:justify-between">
          <p>Conteúdo informativo; a indicação de cada tratamento depende de avaliação individual.</p>
          {rt.nome && rt.cro && (
            <p>
              Responsável técnico: {rt.nome} · {rt.cro}
            </p>
          )}
          <p>© {new Date().getFullYear()} {CONFIG.nome}</p>
        </div>
      </div>
    </footer>
  )
}
