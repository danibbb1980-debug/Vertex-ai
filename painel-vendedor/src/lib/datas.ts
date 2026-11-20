import { TZDate } from '@date-fns/tz'
import { addDays, format, parseISO, subDays } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export const FUSO = 'America/Sao_Paulo'

const isoDia = new Intl.DateTimeFormat('en-CA', {
  timeZone: FUSO, year: 'numeric', month: '2-digit', day: '2-digit',
})

/** Data de hoje (yyyy-MM-dd) no fuso de São Paulo. */
export function hojeSP(agora: Date = new Date()): string {
  return isoDia.format(agora)
}

/** Converte um timestamp ISO para o dia (yyyy-MM-dd) em São Paulo. */
export function diaSP(timestamp: string | Date): string {
  return isoDia.format(typeof timestamp === 'string' ? new Date(timestamp) : timestamp)
}

/** Soma dias a uma data yyyy-MM-dd. */
export function somarDias(dia: string, n: number): string {
  return format(addDays(parseISO(dia), n), 'yyyy-MM-dd')
}

export function subtrairDias(dia: string, n: number): string {
  return format(subDays(parseISO(dia), n), 'yyyy-MM-dd')
}

/** Próximo dia útil (seg–sex) depois de `dia`. */
export function proximoDiaUtil(dia: string, n = 1): string {
  let d = parseISO(dia)
  let restantes = n
  while (restantes > 0) {
    d = addDays(d, 1)
    const semana = d.getDay()
    if (semana !== 0 && semana !== 6) restantes--
  }
  return format(d, 'yyyy-MM-dd')
}

/** dd/mm/aaaa a partir de yyyy-MM-dd. */
export function fmtData(dia: string | null | undefined): string {
  if (!dia) return '—'
  return format(parseISO(dia.slice(0, 10)), 'dd/MM/yyyy')
}

/** dd/mm a partir de yyyy-MM-dd. */
export function fmtDataCurta(dia: string | null | undefined): string {
  if (!dia) return '—'
  return format(parseISO(dia.slice(0, 10)), 'dd/MM')
}

/** dd/mm/aaaa HH:mm de um timestamp, no fuso de SP. */
export function fmtDataHora(ts: string | null | undefined): string {
  if (!ts) return '—'
  return format(new TZDate(ts, FUSO), 'dd/MM/yyyy HH:mm')
}

export function fmtHora(ts: string | null | undefined): string {
  if (!ts) return '—'
  return format(new TZDate(ts, FUSO), 'HH:mm')
}

/** "qui, 27/11" */
export function fmtDiaSemana(dia: string): string {
  return format(parseISO(dia), "EEE, dd/MM", { locale: ptBR })
}

/** "quinta-feira, 27 de novembro" */
export function fmtDiaExtenso(dia: string): string {
  return format(parseISO(dia), "EEEE, d 'de' MMMM", { locale: ptBR })
}

export function fmtMes(mes: string): string {
  // mes = yyyy-MM
  return format(parseISO(`${mes}-01`), "MMMM 'de' yyyy", { locale: ptBR })
}

/** Valor de <input type="datetime-local"> interpretado como horário de SP → ISO UTC. */
export function localSPparaISO(valor: string): string {
  const [d, t] = valor.split('T')
  const [y, m, dd] = d.split('-').map(Number)
  const [hh, mm] = t.split(':').map(Number)
  return new Date(new TZDate(y, m - 1, dd, hh, mm, FUSO).getTime()).toISOString()
}

/** ISO UTC → valor de <input type="datetime-local"> no horário de SP. */
export function isoParaLocalSP(iso: string | null): string {
  if (!iso) return ''
  return format(new TZDate(iso, FUSO), "yyyy-MM-dd'T'HH:mm")
}
