import { useEffect, useRef } from 'react'
import { CONFIG } from '../config'
import { Arco, CabecalhoSecao, Foto, Losango, SeloConfirmar } from '../components/base'

export function Clinica() {
  return (
    <section id="clinica" aria-labelledby="titulo-clinica" className="relative overflow-hidden bg-ivory py-24 sm:py-32">
      <div className="container-vc grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <figure className="revela relative mx-auto w-full max-w-md lg:max-w-none">
          {/* Moldura deslocada com filete dourado */}
          <span aria-hidden="true" className="absolute -bottom-4 -right-4 left-4 top-4 rounded-t-[999px] border border-ouro/40" />
          <div className="relative overflow-hidden rounded-t-[999px] bg-linho">
            <Foto
              nome="dupla-recepcao"
              larguras={[480, 760, 1100]}
              sizes="(min-width: 1024px) 40vw, (min-width: 640px) 28rem, 90vw"
              alt="Dr. Tales Vilhena e Dr. Otávio Carvalho trocando um aperto de mãos na recepção da clínica, diante do logo Vilhena Carvalho Odontologia"
              largura={1100}
              altura={1372}
              className="aspect-[4/5] h-auto w-full object-cover object-[50%_30%]"
            />
          </div>
          <figcaption className="mt-8 text-sm text-tinta-suave">
            Dr. Tales Vilhena e Dr. Otávio Carvalho, na recepção da clínica.{' '}
            <SeloConfirmar className="mt-2 text-ouro">Autorização de imagem a confirmar</SeloConfirmar>
          </figcaption>
        </figure>

        <div>
          <CabecalhoSecao
            id="titulo-clinica"
            rotulo="A clínica"
            titulo={
              <>
                Um novo <em>capítulo</em> em Alfenas.
              </>
            }
            selo={<SeloConfirmar>História a confirmar com a clínica</SeloConfirmar>}
          />
          <div className="revela mt-8 space-y-5 text-lg leading-relaxed text-tinta-suave" style={{ ['--d' as string]: '0.1s' }}>
            <p>
              A {CONFIG.nome} nasce do encontro de dois cirurgiões-dentistas que voltaram à região para começar um novo capítulo, agora em
              uma clínica própria, em Alfenas.
            </p>
            <p>
              O Dr. Otávio Carvalho atua em implantes dentários, diagnóstico e planejamento. O Dr. Tales Vilhena, em reabilitação oral e
              função mastigatória. São trajetórias que se complementam e se encontram em um só lugar.
            </p>
            <p className="font-display text-2xl italic leading-snug text-tinta sm:text-[1.75rem]">
              O propósito é o mesmo: cuidar da pessoa por trás do sorriso, com tempo para ouvir, examinar e explicar.
            </p>
          </div>
          <p className="revela mt-10 flex items-center gap-4 text-sm text-tinta-suave" style={{ ['--d' as string]: '0.2s' }}>
            <Arco className="h-10 w-10 text-ouro" />
            <span>
              <span className="block font-display text-xl text-tinta">Vilhena &amp; Carvalho</span>
              Dois profissionais, um só cuidado.
            </span>
          </p>
        </div>
      </div>
    </section>
  )
}

const ITENS_MARQUEE = [
  'Implantes dentários',
  'Próteses sobre implante',
  'Reabilitação oral',
  'Diagnóstico',
  'Planejamento individualizado',
  'Alfenas - MG',
]

/** Faixa discreta com os atendimentos. Decorativa: pausa fora da tela e no hover. */
export function Marquee() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => el.setAttribute('data-pausado', String(!e.isIntersecting)))
    io.observe(el)
    return () => io.disconnect()
  }, [])
  const grupo = (
    <ul className="flex shrink-0 items-center">
      {ITENS_MARQUEE.map((t) => (
        <li key={t} className="flex items-center whitespace-nowrap">
          <span className="px-8 font-display text-2xl italic text-ivory/85 sm:text-3xl">{t}</span>
          <Losango className="h-2.5 w-2.5 text-champagne/70" />
        </li>
      ))}
    </ul>
  )
  return (
    <div ref={ref} aria-hidden="true" data-pausado="true" className="marquee overflow-hidden border-y border-champagne/15 bg-navy-900 py-6">
      <div className="marquee-trilho">
        {grupo}
        {grupo}
      </div>
    </div>
  )
}
