import { CONFIG } from '../config'
import { waLink } from '../lib/links'
import { IconArrow, IconInstagram, IconWhatsApp } from './Icons'
import { Logo } from './Logo'
import { Magnetic } from './Magnetic'

export function CtaFinal() {
  return (
    <section aria-labelledby="cta-titulo" className="on-night relative overflow-hidden bg-night py-24 text-on-night md:py-36">
      <svg aria-hidden="true" viewBox="0 0 1200 600" preserveAspectRatio="none" className="pointer-events-none absolute inset-x-0 bottom-0 h-[70%] w-full text-accent-night/20" fill="none">
        {[0, 1, 2, 3].map((i) => (
          <path key={i} d={`M ${-50 + i * 60} 600 C ${200 + i * 40} ${120 + i * 50}, ${1000 - i * 40} ${120 + i * 50}, ${1250 - i * 60} 600`} stroke="currentColor" vectorEffect="non-scaling-stroke" />
        ))}
      </svg>
      <div className="shell relative flex flex-col items-center text-center">
        <Logo tone="light" lazy className="w-28 opacity-90" />
        <h2 id="cta-titulo" className="mt-10 max-w-[18ch] text-balance text-[clamp(2.4rem,1.5rem+4vw,4.75rem)] text-on-night" data-reveal>
          Seu próximo passo começa com uma <em className="font-[330] text-accent-night">avaliação</em>.
        </h2>
        <p className="mt-6 max-w-[40ch] text-[1.08rem] text-on-night-mute" data-reveal style={{ ['--d' as string]: '100ms' }}>
          Chame no WhatsApp e combine um horário com o consultório. {CONFIG.observacaoHorario.split('.')[0]}.
        </p>
        <div className="mt-10 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row" data-reveal style={{ ['--d' as string]: '180ms' }}>
          <Magnetic>
            <a href={waLink()} target="_blank" rel="noopener" className="btn btn-light w-full sm:w-auto">
              <IconWhatsApp size={19} />
              Agendar pelo WhatsApp
              <IconArrow size={16} />
            </a>
          </Magnetic>
          <a href={CONFIG.instagram.url} target="_blank" rel="noopener" className="btn btn-ghost-night w-full sm:w-auto">
            <IconInstagram size={18} />
            Ver no Instagram
          </a>
        </div>
      </div>
    </section>
  )
}
