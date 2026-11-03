import { useRef } from 'react'
import { m, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react'
import { Phone } from 'lucide-react'
import { CONFIG } from '../config'
import { telLink, waLink, enderecoLinha } from '../lib/contato'
import { horariosAgrupados } from '../lib/horarios'
import { BotaoWhatsApp } from './ui'
import { DenteSimples, IconInstagram, IconWhatsApp } from './icons'

/**
 * Momento de assinatura: a curva verde-água do logo se desenha conforme a rolagem
 * e termina num "encaixe" — um dente simples que se acomoda no fim da linha.
 */
export function CtaFinal() {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'center 55%'] })
  const p = useSpring(scrollYProgress, { stiffness: 90, damping: 24, restDelta: 0.001 })
  const molduraX = useTransform(p, [0, 0.85], ['-100%', '0%'])
  const desenhoX = useTransform(p, [0, 0.85], ['100%', '0%'])
  const denteY = useTransform(p, [0.7, 1], [-28, 0])
  const denteO = useTransform(p, [0.7, 0.9], [0, 1])
  const denteR = useTransform(p, [0.7, 1], [-14, 0])

  return (
    <section ref={ref} aria-labelledby="t-final" className="on-dark relative overflow-hidden bg-navy-deep py-24 text-white sm:py-32">
      <div className="wrap relative">
        {/* Wipe: moldura e desenho se movem em sentidos opostos, guiados pela rolagem (só transform). */}
        <m.div
          aria-hidden="true"
          className="anim absolute inset-x-4 -top-6 h-40 overflow-hidden sm:-top-10 sm:h-56"
          style={reduce ? undefined : { x: molduraX }}
        >
          <m.div className="anim h-full w-full" style={reduce ? undefined : { x: desenhoX }}>
            <svg viewBox="0 0 1200 260" preserveAspectRatio="none" className="h-full w-full">
              <path
                d="M-10 70C240 30 420 230 700 200C900 178 1010 120 1110 150"
                fill="none"
                stroke="var(--color-aqua)"
                strokeWidth="5"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </m.div>
        </m.div>
        <m.div
          aria-hidden="true"
          className="anim absolute right-3 top-[3.2rem] text-aqua sm:right-[calc(7.5%-1.6rem)] sm:top-[4.6rem]"
          style={reduce ? undefined : { y: denteY, opacity: denteO, rotate: denteR }}
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-navy-deep ring-2 ring-aqua sm:h-16 sm:w-16">
            <DenteSimples size={30} />
          </span>
        </m.div>

        <div className="relative max-w-[44rem] pt-36 sm:pt-44">
          <p className="eyebrow !text-aqua">Odonto Fit · {CONFIG.cidade}</p>
          <h2 id="t-final" className="mt-5 text-[2.5rem] !text-white sm:text-6xl">
            Sua avaliação é o <span className="text-aqua">primeiro passo</span>.
          </h2>
          <p className="mt-6 max-w-[34rem] text-lg text-white/80">
            Converse com a equipe, tire suas dúvidas e escolha um horário. O plano vem depois de ouvir você.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <BotaoWhatsApp className="btn-light">Agendar pelo WhatsApp</BotaoWhatsApp>
            <a href={CONFIG.instagram} target="_blank" rel="noopener noreferrer" className="btn btn-outline-light">
              <IconInstagram size={19} /> Ver no Instagram
              <span className="sr-only"> (abre em nova aba)</span>
            </a>
            {CONFIG.secoes.agendar && (
              <a href="#agendar" className="btn text-white underline-offset-4 hover:underline">
                Solicitar agendamento
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export function Rodape() {
  const rt = CONFIG.responsavelTecnico
  const semana = horariosAgrupados().find((h) => h.aberto)
  const ano = new Date().getFullYear()
  return (
    <footer className="on-dark bg-navy pb-28 pt-16 text-white/75 lg:pb-12">
      <div className="wrap grid gap-10 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <span className="inline-flex rounded-2xl bg-white px-4 py-3">
            <img src="/logo-odonto-fit.png" alt="Odonto Fit" width={145} height={42} loading="lazy" decoding="async" />
          </span>
          <p className="mt-5 max-w-[22rem] text-[0.95rem]">
            Conteúdo informativo; a indicação de cada tratamento depende de avaliação individual.
          </p>
          {rt.nome && rt.cro && (
            <p className="mt-4 text-[0.95rem] text-white">
              Responsável técnico: {rt.nome} · CRO {rt.cro}
            </p>
          )}
        </div>
        <div>
          <h2 className="font-sans text-[0.78rem] font-semibold uppercase tracking-[0.18em] !text-aqua">Endereço</h2>
          <address className="mt-4 text-[0.98rem] not-italic">{enderecoLinha()}</address>
          {semana && (
            <p className="mt-3 text-[0.98rem]">
              {semana.dias}, {semana.texto}
            </p>
          )}
        </div>
        <div>
          <h2 className="font-sans text-[0.78rem] font-semibold uppercase tracking-[0.18em] !text-aqua">Contato</h2>
          <ul className="mt-2 text-[0.98rem]">
            <li>
              <a href={waLink()} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-2 hover:text-white">
                <IconWhatsApp size={18} /> WhatsApp<span className="sr-only"> (nova aba)</span>
              </a>
            </li>
            <li>
              <a href={telLink()} className="inline-flex min-h-12 items-center gap-2 hover:text-white">
                <Phone size={18} aria-hidden="true" /> {CONFIG.telefone}
              </a>
            </li>
            <li>
              <a href={CONFIG.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-2 hover:text-white">
                <IconInstagram size={18} /> {CONFIG.instagramUsuario}<span className="sr-only"> (nova aba)</span>
              </a>
            </li>
            <li>
              <a href="/privacidade.html" className="inline-flex min-h-12 items-center hover:text-white">
                Privacidade
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="wrap mt-10">
        <p className="border-t border-white/15 pt-6 text-[0.85rem] text-white/65">
          © {ano} {CONFIG.nome} · {CONFIG.cidade} - {CONFIG.uf}
        </p>
      </div>
    </footer>
  )
}

/** Celular: barra fixa inferior (o rodapé tem espaço extra para não cobrir conteúdo). Desktop: botão flutuante. */
export function AcoesFixas() {
  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-[1fr_auto] gap-2 border-t border-line bg-ice/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md lg:hidden">
        <BotaoWhatsApp className="btn-aqua">Agendar pelo WhatsApp</BotaoWhatsApp>
        <a href={telLink()} className="btn btn-ghost !px-4" aria-label={`Ligar para ${CONFIG.telefone}`}>
          <Phone size={20} aria-hidden="true" />
        </a>
      </div>
      <a
        href={waLink()}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 hidden h-14 w-14 items-center justify-center rounded-full bg-aqua-ink text-white shadow-lift transition-transform duration-200 hover:scale-105 lg:flex"
      >
        <IconWhatsApp size={26} />
        <span className="sr-only">Conversar pelo WhatsApp (abre em nova aba)</span>
      </a>
    </>
  )
}
