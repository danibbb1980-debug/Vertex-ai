import { useEffect, useState } from 'react'
import { CONFIG } from '../config'
import { agoraSP, estaFechado, faixaHorario, horariosOrdenados } from '../lib/utils'
import { IconeRelogio } from './ui'

const abrev = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

/** Dia atual em São Paulo; calculado só no navegador */
function useHoje() {
  const [hoje, setHoje] = useState<number | null>(null)
  useEffect(() => setHoje(agoraSP().dia), [])
  return hoje
}

/** Faixa logo abaixo do hero */
export function HorariosDestaque() {
  const hoje = useHoje()
  const lista = horariosOrdenados()
  if (!lista.length) return null
  return (
    <section id="horarios" aria-labelledby="titulo-horarios" className="relative border-y border-choco/10 bg-creme">
      <div className="container-site py-10 md:py-12">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-12">
          <div className="lg:w-56 lg:shrink-0">
            <h2 id="titulo-horarios" className="flex items-center gap-2.5 font-serif text-[1.6rem] leading-tight text-choco">
              <IconeRelogio className="size-5 text-ouro" />
              Horários
            </h2>
            <p className="mt-1.5 text-sm text-choco/80">Com hora marcada. {CONFIG.avisoHorarios}</p>
          </div>
          <ul className="grid flex-1 grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
            {lista.map((h) => {
              const atual = hoje === h.dia
              const fechado = estaFechado(h)
              return (
                <li
                  key={h.dia}
                  className={`relative rounded-2xl border px-3.5 py-3 transition-colors ${
                    atual ? 'border-choco bg-choco text-creme' : 'border-choco/12 bg-nude-claro/40 text-choco'
                  } ${h.dia === 0 ? 'col-span-2 sm:col-span-1' : ''}`}
                >
                  <span className="flex items-center justify-between text-[0.72rem] font-medium uppercase tracking-[0.18em]">
                    <abbr title={h.nome} className="no-underline">
                      {abrev[h.dia]}
                    </abbr>
                    {atual && <span className="rounded-full bg-nude px-2 py-0.5 text-[0.62rem] tracking-[0.12em] text-cacau">Hoje</span>}
                  </span>
                  <span className={`mt-1 block font-serif text-[1.08rem] ${fechado && !atual ? 'text-choco/75' : ''}`}>
                    {faixaHorario(h)}
                  </span>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}

/** Tabela completa (usada na Estrutura e no Contato) */
export function TabelaHorarios({ escuro = false, legenda = 'Horário de atendimento' }: { escuro?: boolean; legenda?: string }) {
  const hoje = useHoje()
  return (
    <table className="w-full border-collapse text-left">
      <caption className="sr-only">{legenda}</caption>
      <thead className="sr-only">
        <tr>
          <th scope="col">Dia</th>
          <th scope="col">Horário</th>
        </tr>
      </thead>
      <tbody>
        {horariosOrdenados().map((h) => {
          const atual = hoje === h.dia
          return (
            <tr
              key={h.dia}
              className={`border-b ${escuro ? 'border-creme/15' : 'border-choco/10'} ${atual ? (escuro ? 'bg-creme/10' : 'bg-nude/35') : ''}`}
              aria-current={atual ? 'date' : undefined}
            >
              <th scope="row" className="py-2.5 pl-3 pr-4 font-normal">
                {h.nome}
                {atual && <span className={`ml-2 text-[0.7rem] font-medium uppercase tracking-[0.16em] ${escuro ? 'text-nude' : 'text-ouro-esc'}`}>hoje</span>}
              </th>
              <td className="py-2.5 pr-3 text-right font-serif tabular-nums">{faixaHorario(h)}</td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
