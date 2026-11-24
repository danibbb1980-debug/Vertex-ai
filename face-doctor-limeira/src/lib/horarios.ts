import { CONFIG, type DiaSemana, type Horario } from '../config'

const paraMin = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}
const paraHHMM = (min: number) =>
  `${String(Math.floor(min / 60)).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`

/** "09:00" -> "9h"; "08:30" -> "8h30" */
export const hLegivel = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number)
  return m ? `${h}h${String(m).padStart(2, '0')}` : `${h}h`
}

export const horarioDoDia = (dia: DiaSemana): Horario | undefined =>
  CONFIG.horarios.find((h) => h.dias.includes(dia))

export const abreNoDia = (dia: DiaSemana) => {
  const h = horarioDoDia(dia)
  return !!(h && h.abre && h.fecha)
}

/** Blocos de 1 h, excluindo o horário de fechamento (cabe 1 h antes de fechar). */
export const blocosDoDia = (dia: DiaSemana): string[] => {
  const h = horarioDoDia(dia)
  if (!h || !h.abre || !h.fecha) return []
  const out: string[] = []
  for (let m = paraMin(h.abre); m + 60 <= paraMin(h.fecha); m += 60) out.push(paraHHMM(m))
  return out
}

/** Data e hora atuais no fuso da clínica. */
export const agoraNaClinica = () => {
  const partes = new Intl.DateTimeFormat('en-CA', {
    timeZone: CONFIG.fusoHorario,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
    weekday: 'short',
  }).formatToParts(new Date())
  const p = Object.fromEntries(partes.map((x) => [x.type, x.value]))
  const dias = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  return {
    iso: `${p.year}-${p.month}-${p.day}`,
    minutos: Number(p.hour) * 60 + Number(p.minute),
    dia: dias.indexOf(p.weekday) as DiaSemana,
  }
}

/** Dia da semana de uma data "AAAA-MM-DD" (sem depender do fuso do aparelho). */
export const diaDaData = (iso: string): DiaSemana => {
  const [a, m, d] = iso.split('-').map(Number)
  return new Date(Date.UTC(a, m - 1, d)).getUTCDay() as DiaSemana
}

export const dataBR = (iso: string) => iso.split('-').reverse().join('/')

export { paraMin }
