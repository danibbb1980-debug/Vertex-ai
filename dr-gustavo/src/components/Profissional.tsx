import { CONFIG } from '../config'
import { Confirmar } from './Confirmar'
import { IconArrow, IconInstagram } from './Icons'

export function Profissional() {
  const p = CONFIG.profissional
  const foto = CONFIG.fotos.doutor
  return (
    <section id="dr-gustavo" aria-labelledby="pro-titulo" className="py-24 md:py-32">
      <div className="shell">
        <div className="on-night relative overflow-hidden rounded-[1.75rem] bg-night px-6 py-14 text-on-night md:px-16 md:py-20">
          <svg aria-hidden="true" viewBox="0 0 400 400" className="pointer-events-none absolute -right-24 -top-24 size-[28rem] text-accent-night/15" fill="none">
            <circle cx="200" cy="200" r="199" stroke="currentColor" />
            <circle cx="200" cy="200" r="150" stroke="currentColor" />
            <circle cx="200" cy="200" r="100" stroke="currentColor" />
          </svg>
          <div className="relative grid items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <div className="relative mx-auto aspect-[3/4] w-52 overflow-hidden rounded-t-[999px] rounded-b-2xl border border-on-night/15 bg-night-2 md:w-60 lg:w-full lg:max-w-[17rem]" data-reveal>
                {foto ? (
                  <picture>
                    <source srcSet={foto.avif} type="image/avif" />
                    <img
                      src={foto.webp}
                      width={foto.largura}
                      height={foto.altura}
                      alt={foto.alt}
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 size-full object-cover object-top"
                    />
                  </picture>
                ) : (
                  <span className="absolute inset-0 grid place-items-center font-display text-6xl italic text-on-night">{p.iniciais}</span>
                )}
              </div>
            </div>
            <div className="lg:col-span-8">
              <p className="eyebrow" data-reveal>
                O profissional
              </p>
              <h2 id="pro-titulo" className="mt-5 text-[clamp(2.2rem,1.6rem+2.6vw,3.6rem)] text-on-night" data-reveal>
                {p.nome}
              </h2>
              <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-on-night-mute" data-reveal>
                <span>{p.titulo}</span>
                <span aria-hidden="true" className="h-px w-6 bg-on-night/30" />
                <Confirmar>{p.cro}</Confirmar>
              </p>
              {CONFIG.mostrarEspecialidades ? (
                <p className="mt-3 text-on-night-mute">
                  <Confirmar>{CONFIG.especialidades.join(' · ')}</Confirmar>
                </p>
              ) : null}
              <div className="mt-8 max-w-[38rem] space-y-4 text-[1.05rem] leading-relaxed text-on-night/85" data-reveal>
                <p>
                  Responsável técnico pelo consultório em Alfenas, o Dr. Gustavo atende com hora marcada, com atuação em
                  ortodontia, implantes e clínica geral.
                </p>
                <p>
                  A consulta começa pela conversa: entender o que incomoda, explicar o que foi observado e planejar o
                  tratamento junto com o paciente.
                </p>
              </div>
              <div className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                <p className="font-script text-[2.6rem] leading-none text-on-night/90" aria-hidden="true">
                  {p.assinatura}
                </p>
                <a href={CONFIG.instagram.url} target="_blank" rel="noopener" className="btn btn-ghost-night self-start sm:self-auto">
                  <IconInstagram size={18} />
                  Ver no Instagram
                  <IconArrow size={16} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
