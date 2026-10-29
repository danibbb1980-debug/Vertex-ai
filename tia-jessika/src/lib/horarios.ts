import { CONFIG, type Horario } from '../config'

const NOMES = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']

const min = (h: string) => {
  const [a, b] = h.split(':').map(Number)
  return a * 60 + b
}
const fmt = (m: number) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`

export function horarioDoDia(dia: number): Horario | undefined {
  return CONFIG.horarios.find((h) => h.dia === dia)
}

export function abertoNoDia(dia: number) {
  const h = horarioDoDia(dia)
  return Boolean(h && h.abre && h.fecha)
}

/** Blocos de 1 hora entre abertura e fechamento, sem almoço e sem o horário de fechamento. */
export function blocosDoDia(dia: number): string[] {
  const h = horarioDoDia(dia)
  if (!h || !h.abre || !h.fecha) return []
  const out: string[] = []
  const almI = h.almocoInicio ? min(h.almocoInicio) : -1
  const almF = h.almocoFim ? min(h.almocoFim) : -1
  for (let t = min(h.abre); t + 60 <= min(h.fecha); t += 60) {
    if (almI >= 0 && t < almF && t + 60 > almI) continue
    out.push(fmt(t))
  }
  return out
}

/** Linhas agrupadas para exibição ("Segunda a sexta: 08h00 às 18h00"). */
export function linhasHorario(): { dias: string; horas: string }[] {
  const ordem = [1, 2, 3, 4, 5, 6, 0]
  const desc = (d: number) => {
    const h = horarioDoDia(d)
    if (!h || !h.abre) return 'fechado'
    const hh = (s: string) => s.replace(':', 'h')
    let txt = `${hh(h.abre)} às ${hh(h.fecha)}`
    if (h.almocoInicio && h.almocoFim) txt = `${hh(h.abre)} às ${hh(h.almocoInicio)} e ${hh(h.almocoFim)} às ${hh(h.fecha)}`
    return txt
  }
  const grupos: { de: number; ate: number; horas: string }[] = []
  for (const d of ordem) {
    const horas = desc(d)
    const ult = grupos[grupos.length - 1]
    if (ult && ult.horas === horas) ult.ate = d
    else grupos.push({ de: d, ate: d, horas })
  }
  return grupos.map((g) => ({
    dias:
      g.de === g.ate
        ? NOMES[g.de]
        : `${NOMES[g.de]} ${ordem.indexOf(g.ate) - ordem.indexOf(g.de) === 1 ? 'e' : 'a'} ${NOMES[g.ate].toLowerCase()}`,
    horas: g.horas,
  }))
}

export function hojeISO() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function diaDaSemanaISO(iso: string) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d).getDay()
}

export function isoParaBR(iso: string) {
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}
