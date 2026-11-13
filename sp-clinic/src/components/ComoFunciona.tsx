import { useRef } from 'react'
import { motion, useInView, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { CONFIG } from '../config'

/*
 * Seção café que se abre em arco na entrada (clip-path inset com raio) e linha do tempo
 * vertical com progresso ao rolar (inspirada em "Scroll Reveal Content A" do 21st.dev,
 * reescrita: números grandes, fio de progresso em caramelo).
 */
export function ComoFunciona() {
  const reduz = useReducedMotion() ?? false
  const secaoRef = useRef<HTMLElement>(null)
  const listaRef = useRef<HTMLOListElement>(null)

  const { scrollYProgress: entrada } = useScroll({ target: secaoRef, offset: ['start end', 'start 0.15'] })
  const inset = useTransform(entrada, [0, 1], [16, 0])
  const raio = useTransform(entrada, [0, 0.85, 1], [50, 50, 0])
  const clipPath = useTransform([inset, raio], ([i, r]: number[]) =>
    `inset(${i * 0.5}% ${i}% 0% ${i}% round ${r}vw ${r}vw 0 0)`,
  )

  const { scrollYProgress: avanco } = useScroll({ target: listaRef, offset: ['start 0.7', 'end 0.6'] })

  if (!CONFIG.etapas.length) return null

  return (
    <section id="como-funciona" ref={secaoRef} aria-labelledby="titulo-como" className="bg-marfim">
      <motion.div
        style={reduz ? undefined : { clipPath }}
        className="no-escuro bg-cafe-fundo text-creme"
      >
        <div className="mx-auto grid max-w-[1320px] gap-14 px-5 pb-24 pt-28 sm:px-8 lg:grid-cols-12 lg:gap-8 lg:pb-36 lg:pt-40">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-32">
              <p className="rotulo text-caramelo">Como funciona</p>
              <h2 id="titulo-como" className="mt-5 text-[clamp(2.4rem,6vw,4.4rem)]">
                {extenso(CONFIG.etapas.length)} etapas, <em className="not-italic text-caramelo">sem pressa</em>.
              </h2>
              <p className="mt-6 max-w-[24rem] text-creme-suave">
                Do primeiro contato ao acompanhamento, cada passo é combinado com você.
              </p>
            </div>
          </div>
          <ol ref={listaRef} className="relative lg:col-span-6 lg:col-start-7">
            <span aria-hidden="true" className="absolute bottom-3 left-[1.15rem] top-3 w-px bg-fio-claro sm:left-[1.6rem]" />
            <motion.span
              aria-hidden="true"
              style={reduz ? undefined : { scaleY: avanco }}
              className="absolute bottom-3 left-[1.15rem] top-3 w-px origin-top bg-caramelo sm:left-[1.6rem]"
            />
            {CONFIG.etapas.map((e, i) => (
              <Etapa key={e.titulo} n={i + 1} titulo={e.titulo} texto={e.texto} reduz={reduz} />
            ))}
          </ol>
        </div>
      </motion.div>
    </section>
  )
}

const extenso = (n: number) => ['Uma', 'Duas', 'Três', 'Quatro', 'Cinco', 'Seis', 'Sete'][n - 1] ?? String(n)

function Etapa({ n, titulo, texto, reduz }: { n: number; titulo: string; texto: string; reduz: boolean }) {
  const ref = useRef<HTMLLIElement>(null)
  const passou = useInView(ref, { margin: '0px 0px -45% 0px', once: true })
  const ativo = reduz || passou
  return (
    <li ref={ref} className="relative grid grid-cols-[2.3rem_1fr] gap-x-5 pb-14 last:pb-0 sm:grid-cols-[3.2rem_1fr] sm:gap-x-8 sm:pb-20">
      <span
        aria-hidden="true"
        className={`relative z-10 mt-2 size-[2.3rem] rounded-full border transition-colors duration-500 sm:size-[3.2rem] ${
          ativo ? 'border-caramelo bg-caramelo' : 'border-creme/30 bg-cafe-fundo'
        }`}
      />
      <div>
        <p
          className={`num font-display text-[clamp(3.6rem,10vw,6rem)] leading-[0.8] transition-colors duration-700 ${
            ativo ? 'text-caramelo' : 'text-creme/45'
          }`}
          aria-hidden="true"
        >
          {String(n).padStart(2, '0')}
        </p>
        <h3 className="mt-4 text-[clamp(1.7rem,3.6vw,2.4rem)] leading-tight">
          <span className="sr-only">Etapa {n}: </span>
          {titulo}
        </h3>
        <p className="mt-3 max-w-[28rem] text-creme-suave">{texto}</p>
      </div>
    </li>
  )
}
