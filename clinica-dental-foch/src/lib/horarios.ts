import type { DiaSemana, Expediente, Horarios } from '../config'

export const NOMES_DIAS: Record<DiaSemana, string> = {
  0: 'Domingo',
  1: 'Segunda',
  2: 'Terça',
  3: 'Quarta',
  4: 'Quinta',
  5: 'Sexta',
  6: 'Sábado',
}

const ORDEM: DiaSemana[] = [1, 2, 3, 4, 5, 6, 0]

const paraMin = (h: string) => {
  const [hh, mm] = h.split(':').map(Number)
  return hh * 60 + mm
}
const deMin = (m: number) =>
  `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`

/** "09:00" -> "09h", "09:30" -> "09h30" */
export const horaCurta = (h: string) => {
  const [hh, mm] = h.split(':')
  return mm === '00' ? `${hh}h` : `${hh}h${mm}`
}

const chave = (e: Expediente | null) =>
  e ? `${e.abre}-${e.fecha}-${e.almoco?.join('-') ?? ''}` : 'fechado'

const descreve = (e: Expediente | null) => {
  if (!e) return 'Fechado'
  if (e.almoco)
    return `${horaCurta(e.abre)} às ${horaCurta(e.almoco[0])} e ${horaCurta(e.almoco[1])} às ${horaCurta(e.fecha)}`
  return `${horaCurta(e.abre)} às ${horaCurta(e.fecha)}`
}

/** Agrupa dias consecutivos com o mesmo horário: "Segunda a sexta". */
export function resumoHorarios(h: Horarios): { dias: string; horario: string; aberto: boolean }[] {
  const grupos: { dias: DiaSemana[]; exp: Expediente | null }[] = []
  for (const d of ORDEM) {
    const ultimo = grupos[grupos.length - 1]
    if (ultimo && chave(ultimo.exp) === chave(h[d])) ultimo.dias.push(d)
    else grupos.push({ dias: [d], exp: h[d] })
  }
  return grupos.map(({ dias, exp }) => {
    const primeiro = NOMES_DIAS[dias[0]]
    const ultimo = NOMES_DIAS[dias[dias.length - 1]].toLowerCase()
    let rotulo = primeiro
    if (dias.length === 2) rotulo = `${primeiro} e ${ultimo}`
    else if (dias.length > 2) rotulo = `${primeiro} a ${ultimo}`
    return { dias: rotulo, horario: descreve(exp), aberto: !!exp }
  })
}

/** Converte "aaaa-mm-dd" em Date local (sem fuso). */
export const dataLocal = (iso: string) => {
  const [a, m, d] = iso.split('-').map(Number)
  return new Date(a, m - 1, d)
}

export const isoLocal = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

export const expedienteDoDia = (h: Horarios, iso: string) =>
  h[dataLocal(iso).getDay() as DiaSemana]

/**
 * Horários preferidos para o dia: blocos de 1 h a partir da abertura,
 * sem o intervalo de almoço e sem o horário de fechamento.
 * Se o dia for hoje, só horários a partir da próxima hora cheia.
 */
export function slotsDoDia(h: Horarios, iso: string, agora = new Date()): string[] {
  const exp = expedienteDoDia(h, iso)
  if (!exp) return []
  const abre = paraMin(exp.abre)
  const fecha = paraMin(exp.fecha)
  const almoco = exp.almoco ? exp.almoco.map(paraMin) : null
  const ehHoje = iso === isoLocal(agora)
  const agoraMin = agora.getHours() * 60 + agora.getMinutes()
  const slots: string[] = []
  for (let m = abre; m + 60 <= fecha; m += 60) {
    if (almoco && m < almoco[1] && m + 60 > almoco[0]) continue
    if (ehHoje && m <= agoraMin) continue
    slots.push(deMin(m))
  }
  return slots
}

/** Próximos dias com atendimento (para sugestões rápidas). */
export function proximosDiasAbertos(h: Horarios, qtd: number, agora = new Date()): string[] {
  const dias: string[] = []
  const d = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate())
  for (let i = 0; i < 60 && dias.length < qtd; i++) {
    const iso = isoLocal(d)
    if (slotsDoDia(h, iso, agora).length) dias.push(iso)
    d.setDate(d.getDate() + 1)
  }
  return dias
}

export const dataBR = (iso: string) => {
  const [a, m, d] = iso.split('-')
  return `${d}/${m}/${a}`
}

export const dataCurta = (iso: string) => {
  const d = dataLocal(iso)
  const dia = NOMES_DIAS[d.getDay() as DiaSemana].slice(0, 3).toLowerCase()
  return `${dia}, ${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`
}

/** Dados para JSON-LD (openingHoursSpecification). */
export function especificacaoHorarios(h: Horarios) {
  const nomes: Record<DiaSemana, string> = {
    0: 'Sunday',
    1: 'Monday',
    2: 'Tuesday',
    3: 'Wednesday',
    4: 'Thursday',
    5: 'Friday',
    6: 'Saturday',
  }
  const grupos = new Map<string, { dias: string[]; exp: Expediente }>()
  for (const d of ORDEM) {
    const exp = h[d]
    if (!exp) continue
    const k = chave(exp)
    if (!grupos.has(k)) grupos.set(k, { dias: [], exp })
    grupos.get(k)!.dias.push(nomes[d])
  }
  const out: Record<string, unknown>[] = []
  for (const { dias, exp } of grupos.values()) {
    const faixas: [string, string][] = exp.almoco
      ? [
          [exp.abre, exp.almoco[0]],
          [exp.almoco[1], exp.fecha],
        ]
      : [[exp.abre, exp.fecha]]
    for (const [opens, closes] of faixas)
      out.push({ '@type': 'OpeningHoursSpecification', dayOfWeek: dias, opens, closes })
  }
  return out
}
