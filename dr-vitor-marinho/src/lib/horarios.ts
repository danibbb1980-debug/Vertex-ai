import { CONFIG, type DiaSemana, type Horario } from '../config'

const NOMES = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']

const toMin = (h: string) => {
  const [hh, mm] = h.split(':').map(Number)
  return hh * 60 + mm
}
const toHora = (m: number) =>
  `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`

/** "08:00" -> "8h", "17:30" -> "17h30" */
export const horaCurta = (h: string) => {
  const [hh, mm] = h.split(':')
  return `${Number(hh)}h${mm === '00' ? '' : mm}`
}

export const horarioDoDia = (dia: number): Horario | undefined =>
  CONFIG.horarios.find((h) => h.dia === dia)

/** Blocos de 1 hora, sem o almoço e sem o horário de fechamento. */
export const slotsDoDia = (h: Horario): string[] => {
  const out: string[] = []
  const fim = toMin(h.fecha)
  for (let t = toMin(h.abre); t + 60 <= fim; t += 60) {
    if (h.almoco) {
      const a = toMin(h.almoco.inicio)
      const b = toMin(h.almoco.fim)
      if (t < b && t + 60 > a) continue
    }
    out.push(toHora(t))
  }
  return out
}

/** Sem data escolhida: todos os horários possíveis em algum dia de atendimento. */
export const slotsGerais = (): string[] =>
  Array.from(new Set(CONFIG.horarios.flatMap(slotsDoDia))).sort()

/** Agrupa dias consecutivos com o mesmo horário: "Segunda a sexta · 8h às 18h". */
export const resumoHorarios = (): { dias: string; horas: string }[] => {
  const ordem: DiaSemana[] = [1, 2, 3, 4, 5, 6, 0]
  const grupos: { dias: DiaSemana[]; chave: string; h?: Horario }[] = []
  for (const d of ordem) {
    const h = horarioDoDia(d)
    const chave = h ? `${h.abre}-${h.fecha}-${h.almoco?.inicio ?? ''}-${h.almoco?.fim ?? ''}` : 'fechado'
    const ult = grupos[grupos.length - 1]
    if (ult && ult.chave === chave) ult.dias.push(d)
    else grupos.push({ dias: [d], chave, h })
  }
  return grupos.map((g) => {
    const a = NOMES[g.dias[0]]
    const b = NOMES[g.dias[g.dias.length - 1]]
    const dias =
      g.dias.length === 1 ? a : g.dias.length === 2 ? `${a} e ${b.toLowerCase()}` : `${a} a ${b.toLowerCase()}`
    if (!g.h) return { dias, horas: 'Fechado' }
    const horas = g.h.almoco
      ? `${horaCurta(g.h.abre)} às ${horaCurta(g.h.almoco.inicio)} e ${horaCurta(g.h.almoco.fim)} às ${horaCurta(g.h.fecha)}`
      : `${horaCurta(g.h.abre)} às ${horaCurta(g.h.fecha)}`
    return { dias, horas }
  })
}

/** "2026-11-03" -> Date local (sem fuso). */
export const parseData = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}
export const formatarData = (iso: string) => {
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}
export const hojeISO = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
