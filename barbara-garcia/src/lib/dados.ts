import { CONFIG, type Dia } from '../config'

export const temWhatsapp = CONFIG.whatsapp.replace(/\D/g, '').length >= 12

export function linkWhatsapp(mensagem: string = CONFIG.mensagens.geral): string {
  return `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(mensagem)}`
}

export function mensagemAtendimento(atendimento: string): string {
  return CONFIG.mensagens.porAtendimento.replace('{atendimento}', atendimento)
}

export const enderecoLinha = `${CONFIG.endereco.rua}, ${CONFIG.endereco.bairro}, ${CONFIG.endereco.cidade} - ${CONFIG.endereco.uf}`
export const enderecoCompleto = `${enderecoLinha}, CEP ${CONFIG.endereco.cep}`

/** "15:00" -> "15h", "06:30" -> "6h30" */
export function horaCurta(h: string): string {
  const [hh, mm] = h.split(':').map(Number)
  return mm ? `${hh}h${String(mm).padStart(2, '0')}` : `${hh}h`
}

export function faixaDia(d: Dia): string {
  if (!d.abre || !d.fecha) return 'Fechado'
  return `${horaCurta(d.abre)} às ${horaCurta(d.fecha)}`
}

export function diaPorDow(dow: number): Dia | undefined {
  return CONFIG.horarios.find((d) => d.dow === dow)
}

export function aberto(d: Dia | undefined): boolean {
  return Boolean(d && d.abre && d.fecha)
}

/** Blocos de 1h, começando na abertura e terminando 1h antes do fechamento. */
export function slotsDoDia(d: Dia | undefined): string[] {
  if (!d || !d.abre || !d.fecha) return []
  const [ah, am] = d.abre.split(':').map(Number)
  const [fh, fm] = d.fecha.split(':').map(Number)
  const inicio = ah * 60 + am
  const fim = fh * 60 + fm
  const out: string[] = []
  for (let t = inicio; t + 60 <= fim; t += 60) {
    out.push(`${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`)
  }
  return out
}

/** Data e hora atuais no fuso de São Paulo. */
export function agoraSP(): { ymd: string; dow: number; minutos: number } {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    weekday: 'short',
    hourCycle: 'h23',
  }).formatToParts(new Date())
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? ''
  const ymd = `${get('year')}-${get('month')}-${get('day')}`
  const wd = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'))
  return { ymd, dow: wd, minutos: Number(get('hour')) * 60 + Number(get('minute')) }
}

/** "2026-11-09" -> dia da semana (0-6), sem depender do fuso do navegador */
export function dowDeYmd(ymd: string): number {
  const [y, m, d] = ymd.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay()
}

export function ymdParaBr(ymd: string): string {
  const [y, m, d] = ymd.split('-')
  return `${d}/${m}/${y}`
}

export function somarDias(ymd: string, n: number): string {
  const [y, m, d] = ymd.split('-').map(Number)
  const dt = new Date(Date.UTC(y, m - 1, d + n))
  return dt.toISOString().slice(0, 10)
}

export const diasAbertos = CONFIG.horarios.filter(aberto)
export const diasFechados = CONFIG.horarios.filter((d) => !aberto(d))
