import { CONFIG, type Horario } from '../config'

export const temTexto = (v?: string | null) => typeof v === 'string' && v.trim().length > 0
export const temItens = <T,>(v?: T[] | null): v is T[] => Array.isArray(v) && v.length > 0

export function linkWhatsApp(mensagem: string = CONFIG.mensagens.geral) {
  if (!temTexto(CONFIG.whatsapp)) return ''
  return `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(mensagem)}`
}

export const estaFechado = (h?: Horario) => !h || !temTexto(h.abre) || !temTexto(h.fecha)

/** "11:00" -> "11h" ; "08:30" -> "8h30" */
export function horaCurta(hhmm: string) {
  const [h, m] = hhmm.split(':').map(Number)
  return m ? `${h}h${String(m).padStart(2, '0')}` : `${h}h`
}

export function faixaHorario(h: Horario) {
  if (estaFechado(h)) return 'Fechado'
  const base = `${horaCurta(h.abre)} às ${horaCurta(h.fecha)}`
  if (temTexto(h.pausaInicio) && temTexto(h.pausaFim)) {
    return `${horaCurta(h.abre)} às ${horaCurta(h.pausaInicio!)} e ${horaCurta(h.pausaFim!)} às ${horaCurta(h.fecha)}`
  }
  return base
}

const toMin = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}
const toHHMM = (min: number) =>
  `${String(Math.floor(min / 60)).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`

export const horarioDoDia = (dia: number) => CONFIG.horarios.find((h) => h.dia === dia)

/** Blocos de horário para o formulário: do início até (fechamento - último bloco), sem pausa. */
export function blocosDoDia(dia: number): string[] {
  const h = horarioDoDia(dia)
  if (estaFechado(h)) return []
  const { intervalo, ultimoBlocoAntesDoFechamento } = CONFIG.agendamento
  const ini = toMin(h!.abre)
  const fim = toMin(h!.fecha) - ultimoBlocoAntesDoFechamento
  const pIni = temTexto(h!.pausaInicio) ? toMin(h!.pausaInicio!) : null
  const pFim = temTexto(h!.pausaFim) ? toMin(h!.pausaFim!) : null
  const out: string[] = []
  for (let t = ini; t <= fim; t += intervalo) {
    if (pIni !== null && pFim !== null && t + intervalo > pIni && t < pFim) continue
    out.push(toHHMM(t))
  }
  return out
}

/** Data/hora atual no fuso de São Paulo (independente do fuso do aparelho). */
export function agoraSP() {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
    weekday: 'short',
  }).formatToParts(new Date())
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? ''
  const wd = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'))
  return {
    iso: `${get('year')}-${get('month')}-${get('day')}`,
    dia: wd,
    minutos: Number(get('hour')) * 60 + Number(get('minute')),
  }
}

/** Dia da semana de uma data "AAAA-MM-DD" (sem efeito de fuso). */
export function diaDaSemana(iso: string) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay()
}

export const isoParaBR = (iso: string) => iso.split('-').reverse().join('/')

export const minutosDe = toMin

export const enderecoCompleto = () => {
  const e = CONFIG.endereco
  return `${e.rua}, ${e.bairro}, ${e.cidade} - ${e.uf}, CEP ${e.cep}`
}

/** Ordem de exibição: segunda a domingo */
export const horariosOrdenados = () =>
  [...CONFIG.horarios].sort((a, b) => ((a.dia + 6) % 7) - ((b.dia + 6) % 7))
