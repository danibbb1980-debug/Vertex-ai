import { CONFIG, type Horario } from '../config'

export function waLink(mensagem: string = CONFIG.mensagemPadrao) {
  return `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(mensagem)}`
}

export function waAssunto(assunto: string) {
  return waLink(`Olá! Vi o site da CIOM Odontologia e gostaria de informações sobre ${assunto}.`)
}

export const temTexto = (v: unknown) => typeof v === 'string' && v.trim().length > 0

function minutos(hhmm: string) {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}
const hhmm = (min: number) => `${String(Math.floor(min / 60)).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`

export function horarioDoDia(dia: number): Horario | undefined {
  return CONFIG.horarios.find((h) => h.dia === dia)
}

export function abreNoDia(dia: number) {
  const h = horarioDoDia(dia)
  return !!(h && h.abre && h.fecha)
}

/** Blocos de início, excluindo almoço e o horário de fechamento. */
export function blocosDoDia(dia: number, aPartirDeMin = 0): string[] {
  const h = horarioDoDia(dia)
  if (!h?.abre || !h.fecha) return []
  const passo = CONFIG.agendamento.duracaoBlocoMin
  const out: string[] = []
  const ai = h.almocoInicio ? minutos(h.almocoInicio) : null
  const af = h.almocoFim ? minutos(h.almocoFim) : null
  for (let t = minutos(h.abre); t + passo <= minutos(h.fecha); t += passo) {
    if (ai !== null && af !== null && t < af && t + passo > ai) continue
    if (t < aPartirDeMin) continue
    out.push(hhmm(t))
  }
  return out
}

export function faixaHorario(h: Horario) {
  if (!h.abre || !h.fecha) return 'Fechado'
  const f = (s: string) => s.replace(':', 'h')
  if (h.almocoInicio && h.almocoFim) return `${f(h.abre)}–${f(h.almocoInicio)} · ${f(h.almocoFim)}–${f(h.fecha)}`
  return `${f(h.abre)}–${f(h.fecha)}`
}

export function hojeISO(d = new Date()) {
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}
