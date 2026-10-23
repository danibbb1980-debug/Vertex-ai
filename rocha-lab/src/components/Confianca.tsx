import { useRef } from 'react'
import { m, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { CONFIG } from '../config'
import { IconEstrela } from './ui'

export function Confianca() {
  const { nota, avaliacoes } = CONFIG.google
  const temNota = nota !== null && avaliacoes !== null

  const itens = [
    {
      // CONFIRMAR COM O LABORATÓRIO: informado pelo responsável no Instagram
      destaque: `${CONFIG.anosExperiencia}+ anos`,
      texto: 'de dedicação à prótese dentária, segundo o responsável',
    },
    { destaque: 'Para dentistas', texto: 'Atendimento a cirurgiões-dentistas e clínicas' },
    { destaque: CONFIG.endereco.bairro, texto: `${CONFIG.cidade} - ${CONFIG.uf}` },
    { destaque: 'WhatsApp', texto: 'Conversa direta para enviar casos e tirar dúvidas' },
  ]

  return (
    <section aria-label="Sobre o atendimento do laboratório" className="border-y border-linha bg-marfim">
      <div className="container-site">
        <ul className={`grid divide-y divide-linha sm:-mx-8 sm:divide-x sm:divide-y-0 lg:-mx-8 ${temNota ? 'sm:grid-cols-2 lg:grid-cols-5' : 'sm:grid-cols-2 lg:grid-cols-4'}`}>
          {itens.map((it) => (
            <li key={it.texto} className="flex flex-col gap-1.5 py-6 sm:px-8 sm:py-8 sm:[&:nth-child(n+3)]:border-t sm:[&:nth-child(n+3)]:border-linha lg:[&:nth-child(n+3)]:border-t-0">
              <span className="font-serif text-[1.375rem] leading-tight font-light text-petroleo-800 lg:text-[1.5rem]">
                {it.destaque}
              </span>
              <span className="text-[0.9375rem] leading-snug text-cinza">
                {it.texto}
              </span>
            </li>
          ))}
          {temNota && (
            <li className="flex flex-col gap-1.5 py-6 sm:px-8 sm:py-8">
              <span className="flex items-center gap-1.5 font-serif text-[1.375rem] leading-tight font-light text-petroleo-800 lg:text-[1.5rem]">
                {nota!.toLocaleString('pt-BR', { minimumFractionDigits: 1 })}
                <IconEstrela size={18} className="text-terracota" />
              </span>
              <span className="text-[0.875rem] leading-snug text-cinza">{avaliacoes} avaliações no Google</span>
            </li>
          )}
        </ul>
      </div>
    </section>
  )
}

/**
 * Faixa discreta com os tipos de trabalho. Desliza só acompanhando a rolagem da
 * página (nunca sozinha), então não precisa de botão de pausa (WCAG 2.2.2).
 * Com reduced-motion fica parada.
 */
export function FaixaTrabalhos() {
  const nomes = [
    'Cerômero',
    'Metalocerâmica',
    'Enceramento diagnóstico',
    'Prótese parcial removível',
    'Prótese total',
    'Dissilicato de lítio',
    'Protocolo sobre implantes',
    'Estratificação',
    'Glaze',
  ]
  const grupo = (oculto: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={oculto || undefined}>
      {nomes.map((n) => (
        <li key={n} className="flex items-center whitespace-nowrap">
          <span className="px-7 font-serif text-[1.375rem] font-light text-petroleo-800/75 italic sm:text-[1.625rem]">{n}</span>
          <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true" className="text-pessego">
            <path d="M5 0v10M0 5h10" stroke="currentColor" strokeWidth="1" />
          </svg>
        </li>
      ))}
    </ul>
  )
  const ref = useRef<HTMLDivElement>(null)
  const reduzir = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-22%'])

  return (
    <div ref={ref} className="overflow-hidden border-b border-linha py-6" aria-label="Tipos de trabalho" role="region">
      <m.div className="flex w-max will-change-transform" style={{ x: reduzir ? 0 : x }}>
        {grupo(false)}
        {grupo(true)}
      </m.div>
    </div>
  )
}
