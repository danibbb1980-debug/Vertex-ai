import { CONFIG } from '../config'
import { BotaoWhatsApp, IconeInstagram, Logo, Revelar } from './ui'

export function CtaFinal() {
  if (!CONFIG.whatsapp && !CONFIG.instagram) return null
  return (
    <section id="cta-final" aria-labelledby="titulo-cta" className="escuro relative overflow-hidden bg-cacau py-24 text-creme md:py-36">
      {/* filete dourado */}
      <span aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-ouro to-transparent" />
      <Logo
        variante="monograma"
        decorativo
        className="pointer-events-none absolute -right-16 top-1/2 h-[120%] -translate-y-1/2 text-creme/[0.04] md:right-[4%]"
      />
      <div className="container-site relative">
        <Revelar className="max-w-3xl">
          <p className="rotulo mb-6 flex items-center gap-3">
            <span aria-hidden="true" className="inline-block h-px w-8 bg-current opacity-60" />
            Agendamento
          </p>
          <h2 id="titulo-cta" className="titulo-secao" style={{ fontSize: 'clamp(2.4rem, 1.4rem + 4.4vw, 4.8rem)' }}>
            O primeiro passo é uma <em>mensagem</em>.
          </h2>
          <p className="mt-6 max-w-xl text-[1.1rem] text-creme/85">
            Conte o que você procura e combine um horário com a Juliana pelo WhatsApp.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <span data-fim-linha className="flex sm:inline-flex">
              <BotaoWhatsApp className="w-full sm:w-auto" />
            </span>
            {CONFIG.instagram && (
              <a href={CONFIG.instagram} target="_blank" rel="noopener noreferrer" className="btn btn-secundario">
                <IconeInstagram className="size-[1.1rem]" /> Ver no Instagram
              </a>
            )}
          </div>
          {CONFIG.secoes.agendar && CONFIG.whatsapp && (
            <p className="mt-6 text-[0.98rem] text-creme/80">
              Prefere escolher dia e horário antes?{' '}
              <a href="#agendar" className="text-nude underline underline-offset-4 hover:text-creme">
                Solicite pelo formulário
              </a>
              .
            </p>
          )}
        </Revelar>
      </div>
    </section>
  )
}
