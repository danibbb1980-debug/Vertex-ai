import { waLink } from '../lib/whatsapp'
import { CONFIG } from '../config'
import { MagneticLink } from '../components/MagneticButton'
import { IconWhatsApp } from '../components/Icons'
import { Reveal } from '../components/Reveal'
import { scrollToHash } from '../lib/scroll'

export function CtaFinal() {
  return (
    <section aria-labelledby="titulo-cta" className="on-dark relative overflow-hidden bg-night py-28 text-paper lg:py-40">
      <div aria-hidden="true" className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(60%_70%_at_80%_50%,black,transparent)]" />
      <div aria-hidden="true" className="absolute -right-10 top-1/2 hidden -translate-y-1/2 grid-cols-4 gap-1.5 opacity-90 md:grid md:w-[300px] lg:right-16 lg:w-[360px]">
        {['bg-sage/80', 'bg-mint/30', '', 'bg-teal/40', '', 'bg-teal', 'bg-teal', 'bg-sage/30', 'bg-mint/20', 'bg-teal', 'bg-teal', '', '', 'bg-sage/40', 'bg-mint/50', 'bg-sage/70'].map((c, i) => (
          <span key={i} className={`block aspect-square ${c}`} />
        ))}
      </div>
      <div className="container-x relative">
        <Reveal className="max-w-2xl">
          <p className="eyebrow flex items-center gap-3 text-teal">
            <span aria-hidden="true" className="block size-2 bg-teal" />
            {CONFIG.consultorio}
          </p>
          <h2 id="titulo-cta" className="mt-6 text-[2.5rem] text-paper sm:text-6xl lg:text-[4.2rem]">
            Seu próximo passo começa com uma <em className="text-sage">avaliação</em>.
          </h2>
          <p className="mt-7 max-w-lg text-lg text-paper/75">
            Envie uma mensagem e combine dia e horário com a equipe.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <MagneticLink href={waLink()} external className="btn-light">
              <IconWhatsApp className="size-5" />
              Agendar pelo WhatsApp
            </MagneticLink>
            {CONFIG.secoes.agendamento && (
              <a
                href="#agendar"
                onClick={(e) => {
                  e.preventDefault()
                  scrollToHash('#agendar')
                }}
                className="btn border border-paper/30 text-paper hover:border-paper hover:bg-paper/5"
              >
                Solicitar agendamento pelo formulário
              </a>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
