import type { CSSProperties, ReactNode } from 'react'
import { CONFIG, MSG_GERAL, oabTexto, temWhats, waLink } from '../config'
import { WhatsIcon } from './ui'

/**
 * Momento de assinatura: a régua do livro-razão.
 * Adaptado do "Text Reveal" (21st.dev, per="line"): cada linha é um lançamento
 * com atraso escalonado. Aqui as linhas de régua se traçam da esquerda para a direita
 * e cada entrada "se lança" sobre a sua linha. Só transform e opacity.
 */
function Row({
  i,
  n,
  children,
  aside,
  className = '',
  as: Tag = 'div',
}: {
  i: number
  n?: string
  children: ReactNode
  aside?: ReactNode
  className?: string
  as?: 'div' | 'span'
}) {
  const style = { '--i': i } as CSSProperties
  return (
    <Tag className={`relative grid grid-cols-[2.25rem_1fr] sm:grid-cols-[3.5rem_1fr_auto] ${className}`} style={style}>
      <span className="ledger-line" aria-hidden="true" />
      <span className="num ledger-entry self-end pb-[0.55em] font-sans text-[0.75rem] font-normal tracking-[0.08em] text-brick" aria-hidden="true" style={style}>
        {n}
      </span>
      <span className="ledger-entry block min-w-0" style={style}>
        {children}
      </span>
      {aside ? (
        <span className="ledger-entry hidden self-end pb-2 text-right sm:block" style={style}>
          {aside}
        </span>
      ) : (
        <span className="hidden sm:block" />
      )}
    </Tag>
  )
}

function Aside({ n, t }: { n: string; t?: string }) {
  if (!t) return null
  return (
    <span className="hidden items-baseline justify-end gap-3 font-sans text-[0.8rem] font-normal tracking-normal text-slate lg:flex">
      {t}
      <span className="num w-6 text-left text-brick">{n}</span>
    </span>
  )
}

export function Hero() {
  const abertos = CONFIG.horarios.filter((h) => h.abre)
  const faixa =
    abertos.length === 5 && abertos.every((h) => h.abre === abertos[0].abre && h.fecha === abertos[0].fecha)
      ? `Seg. a sex. · ${abertos[0].abre.replace(':', 'h')} às ${abertos[0].fecha.replace(':', 'h')}`
      : ''

  return (
    <section id="topo" aria-labelledby="titulo-hero" className="relative pt-[8.5rem] pb-16 sm:pt-40 sm:pb-24">
      {/* margem dupla do livro-razão */}
      <div className="pointer-events-none absolute inset-y-0 left-0 right-0" aria-hidden="true">
        <div className="wrap relative h-full">
          <span className="margin-line absolute bottom-0 top-28 left-[calc(1rem+2.25rem-0.6rem)] w-px bg-brick/45 sm:left-[calc(2rem+3.5rem-0.75rem)] lg:left-[calc(3rem+3.5rem-0.75rem)]" />
          <span className="margin-line absolute bottom-0 top-28 left-[calc(1rem+2.25rem-0.35rem)] w-px bg-brick/25 sm:left-[calc(2rem+3.5rem-0.5rem)] lg:left-[calc(3rem+3.5rem-0.5rem)]" />
        </div>
      </div>

      <div className="wrap relative">
        <Row i={0} n="01" aside={<span className="label text-slate">{faixa}</span>}>
          <p className="label pb-3 text-slate">
            Advocacia · {CONFIG.endereco.cidade} - {CONFIG.endereco.uf}
          </p>
        </Row>

        <h1 id="titulo-hero" className="text-[clamp(2.05rem,8.4vw,6.4rem)] leading-[1.02] tracking-[-0.035em]">
          <span className="sr-only">Direito tributário e empresarial, com clareza. Advogado em Varginha - MG.</span>
          <span aria-hidden="true">
            <Row as="span" i={1} n="02" aside={<Aside n="I" t={CONFIG.areas[0]?.titulo} />}>
              <span className="block pt-4 pb-2">Direito tributário</span>
            </Row>
            <Row as="span" i={2} n="03" aside={<Aside n="II" t={CONFIG.areas[1]?.titulo} />}>
              <span className="block pt-2 pb-2">e empresarial,</span>
            </Row>
            <Row as="span" i={3} n="04" aside={<Aside n="III" t={CONFIG.areas[2]?.titulo} />}>
              <span className="block pt-2 pb-3">
                com <em>clareza</em>.
              </span>
            </Row>
          </span>
        </h1>

        <Row i={4} n="05">
          <p className="max-w-[40rem] py-5 text-[1.075rem] text-ink-2 sm:text-[1.2rem]">
            Atuação em Direito Tributário, Direito Empresarial e Direito do Trabalho, com atendimento direto pelo
            advogado.
          </p>
        </Row>

        <Row i={5} n="06">
          <div className="flex flex-col gap-3 py-6 sm:flex-row sm:flex-wrap">
            {temWhats && (
              <a href={waLink(MSG_GERAL)} target="_blank" rel="noopener" className="btn btn-ink">
                <WhatsIcon />
                Agendar pelo WhatsApp
                <span className="sr-only"> (abre em nova aba)</span>
              </a>
            )}
            <a href="#areas" className="btn btn-line">
              Conhecer as áreas de atuação
            </a>
          </div>
        </Row>

        <Row i={6} n="07">
          <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1 py-4 text-[0.95rem]">
            <span className="font-serif text-lg text-ink">{CONFIG.nomeExibicao}</span>
            <span className="text-slate">· {CONFIG.titulo}</span>
            {oabTexto && <span className="num label basis-full text-ink sm:basis-auto">{oabTexto}</span>}
          </p>
        </Row>
      </div>
    </section>
  )
}
