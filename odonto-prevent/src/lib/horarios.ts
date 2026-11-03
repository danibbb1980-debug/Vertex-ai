import { CONFIG, type DiaSemana, type Horario } from '../config'

export function paraMinutos(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

export function deMinutos(min: number): string {
  const h = Math.floor(min / 60)
  const m = min % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

/** "08:00" -> "08h", "08:30" -> "08h30" */
export function formatarHora(hhmm: string): string {
  const [h, m] = hhmm.split(':')
  return m === '00' ? `${h}h` : `${h}h${m}`
}

export function textoHorario(h: Horario): string {
  return `${formatarHora(h.abre)} às ${formatarHora(h.fecha)}`
}

export function horarioDoDia(dia: number): Horario | undefined {
  return CONFIG.horarios.find((h) => h.dias.includes(dia as DiaSemana))
}

/**
 * Horários de início em blocos de 1 hora para um dia da semana.
 * Exclui o intervalo de almoço e qualquer bloco que termine depois do fechamento.
 */
export function blocosDoDia(dia: number): string[] {
  const h = horarioDoDia(dia)
  if (!h) return []
  const abre = paraMinutos(h.abre)
  const fecha = paraMinutos(h.fecha)
  const almoco = h.almoco ? [paraMinutos(h.almoco.inicio), paraMinutos(h.almoco.fim)] : null
  const blocos: string[] = []
  for (let t = abre; t + 60 <= fecha; t += 60) {
    if (almoco && t < almoco[1] && t + 60 > almoco[0]) continue
    blocos.push(deMinutos(t))
  }
  return blocos
}

/** Data local "AAAA-MM-DD" -> dia da semana (sem problema de fuso). */
export function diaDaSemana(iso: string): number {
  const [a, m, d] = iso.split('-').map(Number)
  return new Date(a, m - 1, d).getDay()
}

export function hojeIso(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function isoParaBr(iso: string): string {
  const [a, m, d] = iso.split('-')
  return `${d}/${m}/${a}`
}

/** Frase única com todos os dias informados, para textos corridos. */
export function resumoHorarios(): string {
  return CONFIG.horarios
    .map((h) => `${h.rotulo.toLowerCase()}, das ${textoHorario(h)}`)
    .join('; ')
}
