import { m, useReducedMotion } from 'motion/react'
import { useRef, type PointerEvent } from 'react'
import { CONFIG } from '../config'
import { waLink } from '../lib/whatsapp'
import { formatHora, horarioDoDia } from '../lib/horarios'
import { IconArrow, IconWhatsApp, IllArco } from '../components/Icons'
import { Magnetic, OvalFrame, TextReveal } from '../components/motion'
import { Picture } from '../components/Picture'

export function Hero() {
  const foto = CONFIG.fotos[0]
  const wa = waLink()
  const reduce = useReducedMotion()
  const glowRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const raf = useRef(0)
  const semana = horarioDoDia(1)

  // brilho rosé muito sutil que acompanha o cursor dentro do palco do oval
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType !== 'mouse') return
    const stage = stageRef.current
    const glow = glowRef.current
    if (!stage || !glow) return
    cancelAnimationFrame(raf.current)
    raf.current = requestAnimationFrame(() => {
      const r = stage.getBoundingClientRect()
      const x = e.clientX - r.left - r.width / 2
      const y = e.clientY - r.top - r.height / 2
      glow.style.transform = `translate3d(${x * 0.35}px, ${y * 0.35}px, 0)`
      glow.style.opacity = '1'
    })
  }
  const onLeave = () => {
    if (glowRef.current) {
      glowRef.current.style.transform = 'translate3d(0,0,0)'
      glowRef.current.style.opacity = '0.55'
    }
  }

  return (
    <section id="topo" className="relative overflow-hidden" style={{ paddingTop: 'calc(var(--draft-h) + 6.5rem)' }}>
      {/* formas orgânicas muito suaves */}
      <div aria-hidden className="pointer-events-none absolute -right-40 -top-40 h-[42rem] w-[42rem] rounded-full bg-[radial-gradient(closest-side,rgba(200,187,173,0.45),transparent)]" />
      <div aria-hidden className="pointer-events-none absolute -left-52 bottom-0 h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(closest-side,rgba(231,224,211,0.9),transparent)]" />

      <div className="container-n relative grid items-center gap-14 pb-16 md:pb-24 lg:grid-cols-[1.08fr_0.92fr] lg:gap-10">
        <div className="relative z-10 max-w-2xl">
          <m.p
            className="eyebrow mb-7 flex items-center gap-4 tracking-[0.2em] sm:tracking-[0.28em]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.1 }}
          >
            <span className="hidden h-px w-10 bg-copper sm:inline-block" aria-hidden />
            Odontologia · {CONFIG.cidade} - {CONFIG.uf}
          </m.p>

          <TextReveal
            as="h1"
            onView={false}
            delay={0.15}
            className="display text-[clamp(2.75rem,8.4vw,5.6rem)]"
            text="Cuidado com *planejamento*, do primeiro ao último passo."
          />

          <m.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.75, ease: [0.22, 1, 0.36, 1] }}>
            <p className="lead mt-8 max-w-xl">Avaliação individual, explicações claras e atendimento com hora marcada.</p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
              {wa && (
                <Magnetic>
                  <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-primary w-full sm:w-auto">
                    <IconWhatsApp size={18} />
                    Agendar minha avaliação
                  </a>
                </Magnetic>
              )}
              {CONFIG.atendimentos.length > 0 && (
                <a href="#atendimentos" className="btn btn-ghost">
                  Ver atendimentos <IconArrow />
                </a>
              )}
            </div>

            <dl className="mt-12 grid max-w-lg gap-4 border-t border-line pt-6 text-sm sm:grid-cols-2 sm:gap-6">
              {semana && (
                <div>
                  <dt className="eyebrow mb-1.5 text-[0.6875rem]">Horário</dt>
                  <dd className="text-espresso">
                    Seg. a sex. · {formatHora(semana.abre)} às {formatHora(semana.fecha)}
                  </dd>
                </div>
              )}
              <div>
                <dt className="eyebrow mb-1.5 text-[0.6875rem]">Endereço</dt>
                <dd className="text-espresso">
                  {CONFIG.endereco.rua} · {CONFIG.endereco.bairro}
                </dd>
              </div>
            </dl>
          </m.div>
        </div>

        {/* Palco do oval: momento de assinatura */}
        <div
          ref={stageRef}
          onPointerMove={onMove}
          onPointerLeave={onLeave}
          className="relative mx-auto w-full max-w-[25rem] lg:max-w-[28rem]"
        >
          <div className="relative aspect-[200/260]">
            <div
              ref={glowRef}
              aria-hidden
              className="pointer-events-none absolute inset-[12%] rounded-full bg-[radial-gradient(closest-side,rgba(226,196,158,0.55),rgba(226,196,158,0)_70%)] opacity-55 blur-2xl transition-[transform,opacity] duration-700 ease-out"
            />
            {foto ? (
              <div className="fade-photo absolute inset-[5.5%] overflow-hidden rounded-[50%] bg-sand">
                <Picture foto={foto} sizes="(min-width: 1024px) 26rem, (min-width: 640px) 22rem, 72vw" priority className="h-full w-full object-cover object-[50%_30%]" />
                <div aria-hidden className="absolute inset-0 rounded-[50%] shadow-[inset_0_0_60px_rgba(43,33,28,0.18)]" />
              </div>
            ) : (
              <div className="fade-photo absolute inset-[5.5%] flex items-center justify-center rounded-[50%] bg-cream">
                <IllArco className="w-2/3 text-copper" />
              </div>
            )}
            <OvalFrame id="hero-oval" className="absolute inset-0 h-full w-full" strokeWidth={1.2} />
            <OvalFrame
              id="hero-oval-2"
              late
              className="absolute inset-0 h-full w-full"
              style={{ transform: 'rotate(-9deg) scale(1.04, 1.01)' }}
              strokeWidth={0.8}
            />
          </div>
          <p className="mt-6 text-center text-[0.6875rem] font-semibold uppercase tracking-[0.3em] text-muted">
            Hora marcada · Ambiente acessível
          </p>
        </div>
      </div>
    </section>
  )
}
