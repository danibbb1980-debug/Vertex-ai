import { useEffect, useRef, useState } from 'react'
import { CONFIG } from '../config'
import { PlanNode, Reveal, SectionHead } from './Base'
import { IconCalendar, IconPlan, IconWheelchair } from './Icons'

export function Marquee() {
  const ref = useRef<HTMLDivElement>(null)
  const [paused, setPaused] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setPaused(!e.isIntersecting))
    io.observe(el)
    return () => io.disconnect()
  }, [])
  const itens = [
    ...CONFIG.atendimentos.map((a) => a.nome),
    'Avaliação individual',
    'Hora marcada',
    'Acessibilidade',
    `${CONFIG.endereco.cidade} - ${CONFIG.endereco.uf}`,
  ]
  const linha = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {itens.map((t, i) => (
        <li key={i} className="flex items-center whitespace-nowrap font-serif text-xl italic text-ivory/90 md:text-2xl">
          <span className="px-6 md:px-9">{t}</span>
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" className="text-sage">
            <circle cx="7" cy="7" r="3" fill="currentColor" />
            <circle cx="7" cy="7" r="6.3" fill="none" stroke="currentColor" strokeWidth="1" opacity=".6" />
          </svg>
        </li>
      ))}
    </ul>
  )
  return (
    <div ref={ref} className="marquee relative overflow-hidden bg-ink py-5 md:py-6" data-paused={paused}>
      <p className="sr-only">Atendimentos e diferenciais: {itens.join(', ')}.</p>
      <div className="marquee-track flex w-max" aria-hidden="true">
        {linha(true)}
        {linha(true)}
      </div>
    </div>
  )
}

const PILARES = [
  {
    icon: IconPlan,
    titulo: 'Planejamento caso a caso',
    texto: 'Cada plano parte da sua avaliação. As opções são explicadas com calma, sem receita pronta.',
  },
  {
    icon: IconCalendar,
    titulo: 'Hora marcada',
    texto: 'Atendimento com horário marcado, de segunda a sexta, para você organizar a sua rotina.',
  },
  {
    icon: IconWheelchair,
    titulo: 'Acessibilidade',
    texto: 'Entrada, banheiro e estacionamento acessíveis, e aro de indução magnética.',
  },
]

export function Clinica() {
  if (!CONFIG.secoes.clinica) return null
  const [principal, secundaria] = CONFIG.fotos.equipe
  const temFotos = !!principal
  return (
    <section id="clinica" aria-labelledby="t-clinica" className="sec">
      <div className={`wrap grid gap-14 ${temFotos ? 'lg:grid-cols-12 lg:gap-10' : ''}`}>
        <div className={temFotos ? 'lg:col-span-7' : ''}>
          <SectionHead
            id="t-clinica"
            numero="01"
            rotulo="A clínica"
            titulo={
              <>
                Cuidado que começa pela <em>escuta</em>.
              </>
            }
            intro="Na CIOM Odontologia, cada atendimento parte de uma avaliação individual. Antes de qualquer indicação, a equipe conversa, examina e explica as possibilidades, para que você entenda cada etapa antes de decidir."
          />
          <ul className="mt-12 grid gap-px overflow-hidden rounded-[22px] border border-line bg-line sm:grid-cols-3">
            {PILARES.map((p, i) => (
              <Reveal as="li" key={p.titulo} delay={i * 0.08} className="bg-paper p-6">
                <p.icon size={26} className="text-sage-deep" />
                <h3 className="mt-5 font-serif text-[1.35rem] leading-tight text-ink">{p.titulo}</h3>
                <p className="mt-2 text-[0.97rem] text-muted">{p.texto}</p>
              </Reveal>
            ))}
          </ul>
        </div>

        {temFotos && (
          <Reveal className="relative mx-auto w-full max-w-[420px] lg:col-span-5 lg:mt-10">
            <figure className="relative ml-auto w-[78%]">
              <span className="crosshair -left-5 -top-5 text-sage-deep" />
              <span className="crosshair -right-5 -top-5 text-sage-deep" />
              <span className="crosshair -bottom-5 -right-5 text-sage-deep" />
              <img
                src={principal.src}
                alt={principal.alt}
                width={principal.largura}
                height={principal.altura}
                loading="lazy"
                decoding="async"
                className="aspect-[3/4] w-full rounded-[22px] object-cover shadow-[0_30px_60px_-36px_rgb(15_45_40/0.6)]"
              />
            </figure>
            {secundaria && (
              <figure className="absolute -bottom-10 left-0 w-[52%] rounded-[18px] bg-paper p-2 shadow-[0_24px_50px_-26px_rgb(15_45_40/0.55)] ring-1 ring-line">
                <img
                  src={secundaria.src}
                  alt={secundaria.alt}
                  width={secundaria.largura}
                  height={secundaria.altura}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[3/2] w-full rounded-[12px] object-cover"
                />
              </figure>
            )}
            <div aria-hidden="true" className="h-14" />
          </Reveal>
        )}
      </div>

      {CONFIG.secoes.espaco && CONFIG.fotos.espaco.length > 0 && (
        <div className="wrap mt-24 md:mt-32">
          <div className="relative flex flex-wrap items-end justify-between gap-4">
            <PlanNode className="top-[6px]" />
            <h3 className="font-serif text-[clamp(1.7rem,3vw,2.4rem)] text-ink">
              O <em className="text-sage-deep">espaço</em>
            </h3>
            <p className="max-w-sm text-muted">Ambientes pensados para receber você com conforto, da recepção à sala de atendimento.</p>
          </div>
          <ul className={`mt-8 grid grid-cols-2 gap-3 md:gap-4 ${CONFIG.fotos.espaco.length >= 4 ? 'md:grid-cols-4' : 'md:grid-cols-3'}`}>
            {CONFIG.fotos.espaco.map((f, i) => (
              <Reveal as="li" key={f.src} delay={i * 0.07} className={i % 2 === 1 ? 'md:mt-10' : ''}>
                <figure className="group">
                  <div className="overflow-hidden rounded-[20px] ring-1 ring-line">
                    <img
                      src={f.src}
                      alt={f.alt}
                      width={f.largura}
                      height={f.altura}
                      loading="lazy"
                      decoding="async"
                      className="aspect-[4/6] w-full object-cover transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.04]"
                    />
                  </div>
                  {f.legenda && (
                    <figcaption className="mt-3 flex items-center gap-2 text-sm font-medium text-ink">
                      <span className="tabular-nums text-sage-deep">{String(i + 1).padStart(2, '0')}</span>
                      {f.legenda}
                    </figcaption>
                  )}
                </figure>
              </Reveal>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}
