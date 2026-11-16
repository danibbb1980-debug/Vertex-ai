import { CONFIG, type Dia } from '../config'

const min = (h: string) => {
  const [a, b] = h.split(':').map(Number)
  return a * 60 + b
}
const hhmm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`

/**
 * Blocos de 1 hora a partir da abertura, sem incluir o fechamento.
 * A última opção é sempre fechamento − 1 h (ex.: terça 18:00, sexta 17:00).
 */
export function horariosDoDia(d: Dia): string[] {
  if (!d.abre || !d.fecha) return []
  const ini = min(d.abre)
  const ultimo = min(d.fecha) - 60
  const out: string[] = []
  for (let t = ini; t <= ultimo; t += 60) out.push(hhmm(t))
  if (ultimo >= ini && out[out.length - 1] !== hhmm(ultimo)) out.push(hhmm(ultimo))
  return out
}

/** "2026-11-16" no fuso local (sem o deslocamento de toISOString). */
export function dataLocalISO(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function diaDaData(iso: string): Dia | undefined {
  const [y, m, d] = iso.split('-').map(Number)
  if (!y || !m || !d) return undefined
  const dow = new Date(y, m - 1, d).getDay()
  return CONFIG.horarios.find((h) => h.dow === dow)
}

export function formatarData(iso: string) {
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}

export function montarMensagem(v: { nome: string; atendimento: string; data: string; horario: string; obs: string }) {
  return [
    'Olá! Vim pelo site da Danielle Souza Estética e gostaria de solicitar um agendamento.',
    `Nome: ${v.nome}`,
    `Atendimento: ${v.atendimento || 'a definir'}`,
    `Data preferida: ${v.data || 'a combinar'}`,
    `Horário preferido: ${v.horario || 'a combinar'}`,
    `Observações: ${v.obs || '-'}`,
  ].join('\n')
}
