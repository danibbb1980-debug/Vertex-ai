import { useEffect, useState } from 'react'
import { CONFIG } from '../config'
import { aberto, agoraSP, faixaDia, horaCurta } from '../lib/dados'
import { IconeRelogio } from './Icones'

/** Escala do gráfico: da primeira abertura ao último fechamento da semana. */
function escala() {
  const mins = CONFIG.horarios.filter(aberto).flatMap((d) => [d.abre!, d.fecha!].map((h) => Number(h.split(':')[0])))
  return { ini: Math.min(...mins), fim: Math.max(...mins) }
}

export function useHoje() {
  const [hoje, setHoje] = useState<number | null>(null)
  useEffect(() => setHoje(agoraSP().dow), [])
  return hoje
}

export function TabelaHorarios({ compacta = false, tom = 'claro' }: { compacta?: boolean; tom?: 'claro' | 'escuro' }) {
  const hoje = useHoje()
  const { ini, fim } = escala()
  const span = fim - ini
  const marcas = [ini, ini + Math.round(span / 3), ini + Math.round((2 * span) / 3), fim]
  const escuro = tom === 'escuro'

  return (
    <table className="w-full table-fixed border-separate border-spacing-y-1.5 text-left">
      <caption className="sr-only">Horários de atendimento por dia da semana</caption>
      <thead className={compacta ? 'sr-only' : ''}>
        <tr>
          <th scope="col" className={compacta ? 'w-[52%]' : 'w-[50%] md:w-[30%]'}>
            <span className="sr-only">Dia</span>
          </th>
          <th scope="col" className={compacta ? '' : 'md:w-[30%]'}>
            <span className="sr-only">Horário</span>
          </th>
          <th scope="col" className={compacta ? 'hidden' : 'hidden md:table-cell md:pr-5'}>
            <span className="sr-only">Faixa do dia</span>
            <span aria-hidden="true" className="relative block h-5 text-[0.72rem] font-semibold tracking-wide text-suave">
              {marcas.map((m) => (
                <span key={m} className="absolute -translate-x-1/2" style={{ left: `${((m - ini) / span) * 100}%` }}>
                  {m}h
                </span>
              ))}
            </span>
          </th>
        </tr>
      </thead>
      <tbody>
        {CONFIG.horarios.map((d) => {
          const ab = aberto(d)
          const ehHoje = hoje === d.dow && ab
          const destaque = CONFIG.destaquesHorario[d.dow]
          const a = ab ? Number(d.abre!.split(':')[0]) + Number(d.abre!.split(':')[1]) / 60 : 0
          const f = ab ? Number(d.fecha!.split(':')[0]) + Number(d.fecha!.split(':')[1]) / 60 : 0
          const linha = escuro
            ? ehHoje
              ? 'bg-aveia/12'
              : ''
            : ehHoje
              ? 'bg-aveia-2 shadow-[inset_0_0_0_1.5px_var(--color-mel)]'
              : 'bg-aveia-2/70'
          return (
            <tr key={d.dow} className={`${linha} ${escuro ? '' : ''}`} aria-current={ehHoje ? 'date' : undefined}>
              <th
                scope="row"
                className={`rounded-l-2xl py-3 pl-4 pr-3 align-middle font-semibold ${
                  escuro ? 'text-aveia' : 'text-grafite'
                } ${ab ? '' : 'opacity-80'}`}
              >
                <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span>{compacta ? d.nome.replace('-feira', '') : d.nome}</span>
                  {ehHoje && (
                    <span className={`rounded-full px-2 py-0.5 text-[0.68rem] font-bold uppercase tracking-[0.14em] ${escuro ? 'bg-mel text-grafite' : 'bg-oliva text-aveia'}`}>
                      Hoje
                    </span>
                  )}
                </span>
              </th>
              <td
                className={`py-3 pr-4 align-middle tabular-nums ${compacta ? 'rounded-r-2xl text-right' : 'rounded-r-2xl md:rounded-none'} ${
                  escuro ? 'text-sobre-oliva' : 'text-grafite'
                }`}
              >
                {ab && compacta ? (
                  <span className="font-medium">
                    {horaCurta(d.abre!)} <span className={escuro ? 'text-sobre-oliva' : 'text-suave'}>às</span> {horaCurta(d.fecha!)}
                  </span>
                ) : ab ? (
                  <span className="flex flex-col items-start gap-0.5 lg:flex-row lg:items-baseline lg:gap-2">
                    <span className="font-medium">
                      {horaCurta(d.abre!)} <span className={escuro ? 'text-sobre-oliva' : 'text-suave'}>às</span> {horaCurta(d.fecha!)}
                    </span>
                    {destaque && !compacta && (
                      <span className={`text-[0.8rem] font-semibold ${escuro ? 'text-mel-claro' : 'text-mel-texto'}`}>{destaque}</span>
                    )}
                  </span>
                ) : (
                  <span className={escuro ? 'text-sobre-oliva' : 'text-suave'}>{faixaDia(d)}</span>
                )}
              </td>
              {!compacta && (
                <td className="hidden rounded-r-2xl py-3 pr-5 align-middle md:table-cell" aria-hidden="true">
                  <span className="relative block h-2.5 rounded-full bg-areia">
                    {ab && (
                      <span
                        className={`absolute inset-y-0 rounded-full ${destaque ? 'bg-mel' : 'bg-oliva/75'}`}
                        style={{ left: `${((a - ini) / span) * 100}%`, width: `${((f - a) / span) * 100}%` }}
                      />
                    )}
                  </span>
                </td>
              )}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

export function HorariosDestaque() {
  if (!CONFIG.secoes.horariosDestaque || CONFIG.horarios.length === 0) return null
  const sab = CONFIG.horarios.find((d) => d.dow === 6)
  return (
    <section id="horarios" aria-labelledby="titulo-horarios" className="relative pb-20 md:pb-28">
      <div data-fio="margem" className="container-site">
        <div className="revela grid gap-8 rounded-[var(--radius-card)] bg-areia-2 p-5 shadow-[var(--shadow-macia)] sm:p-8 md:p-10 lg:grid-cols-[0.8fr_1.6fr] lg:gap-12">
          <div className="flex flex-col">
            <p className="rotulo flex items-center gap-2">
              <IconeRelogio tamanho={16} /> Horários
            </p>
            <h2 id="titulo-horarios" className="mt-4 text-[clamp(1.9rem,4.4vw,2.6rem)]">
              Horários ao longo da <em>semana</em>.
            </h2>
            <p className="mt-4 text-suave">
              Atendimento com hora marcada, de segunda a sábado. Na quarta, a partir das 6h; na quinta, até as 21h
              {sab && aberto(sab) ? `; e no sábado, das ${horaCurta(sab.abre!)} às ${horaCurta(sab.fecha!)}` : ''}.
            </p>
            {CONFIG.avisoHorarios && <p className="mt-auto pt-6 text-[0.9rem] font-medium text-suave">{CONFIG.avisoHorarios}</p>}
          </div>
          <TabelaHorarios />
        </div>
      </div>
    </section>
  )
}
