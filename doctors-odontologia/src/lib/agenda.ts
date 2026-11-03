import { CONFIG, type Horario } from '../config'

const min = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}
const fmt = (minutos: number) =>
  `${String(Math.floor(minutos / 60)).padStart(2, '0')}:${String(minutos % 60).padStart(2, '0')}`

/** "2026-11-03" -> Date local (sem fuso UTC) */
export const dataLocal = (iso: string) => {
  const [a, m, d] = iso.split('-').map(Number)
  return new Date(a, m - 1, d)
}

export const hojeIso = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export const horarioDoDia = (iso: string): Horario | undefined => {
  if (!iso) return undefined
  const dia = dataLocal(iso).getDay()
  return CONFIG.horarios.find((h) => (h.dias as number[]).includes(dia))
}

/**
 * Blocos de 1 hora dentro do expediente. Um bloco só entra se terminar até o fechamento
 * e não cruzar o almoço. Em datas de hoje, horários que já passaram ficam de fora.
 */
export function horariosDisponiveis(iso: string, agora = new Date()): string[] {
  const h = horarioDoDia(iso)
  if (!h) return []
  const abre = min(h.abre)
  const fecha = min(h.fecha)
  const almoco = h.almoco ? [min(h.almoco.inicio), min(h.almoco.fim)] : null
  const ehHoje = iso === hojeIso()
  const agoraMin = agora.getHours() * 60 + agora.getMinutes()
  const lista: string[] = []
  for (let t = abre; t + 60 <= fecha; t += 60) {
    if (almoco && t < almoco[1] && t + 60 > almoco[0]) continue
    if (ehHoje && t <= agoraMin) continue
    lista.push(fmt(t))
  }
  return lista
}

export const dataBr = (iso: string) => {
  const [a, m, d] = iso.split('-')
  return `${d}/${m}/${a}`
}
