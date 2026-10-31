import { CONFIG, NOMES_DIAS, type Horario } from '../config'

const toMin = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}
const toHHMM = (min: number) =>
  `${String(Math.floor(min / 60)).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`

/** "09:00" -> "09h00" */
export const formatHora = (hhmm: string) => hhmm.replace(':', 'h')

export const horarioDoDia = (dia: number): Horario | undefined =>
  CONFIG.horarios.find((h) => h.dia === dia)

/** Converte "aaaa-mm-dd" em Date local (sem o deslocamento de fuso do construtor ISO). */
export const parseDataLocal = (iso: string) => {
  const [a, m, d] = iso.split('-').map(Number)
  if (!a || !m || !d) return null
  return new Date(a, m - 1, d)
}

export const isoHoje = (agora = new Date()) =>
  `${agora.getFullYear()}-${String(agora.getMonth() + 1).padStart(2, '0')}-${String(agora.getDate()).padStart(2, '0')}`

export const formatDataBR = (iso: string) => {
  const [a, m, d] = iso.split('-')
  return `${d}/${m}/${a}`
}

/**
 * Horários de início em blocos de `duracao` minutos.
 * Exclui o intervalo de almoço e qualquer bloco que termine depois do fechamento.
 * Se a data for hoje, omite horários que já passaram.
 */
export const horariosDisponiveis = (iso: string, agora = new Date()): string[] => {
  const data = parseDataLocal(iso)
  if (!data) return []
  const h = horarioDoDia(data.getDay())
  if (!h) return []
  const dur = CONFIG.agendamento.duracaoBlocoMin
  const abre = toMin(h.abre)
  const fecha = toMin(h.fecha)
  const almoco = h.almoco ? [toMin(h.almoco.inicio), toMin(h.almoco.fim)] : null
  const ehHoje = iso === isoHoje(agora)
  const minAgora = agora.getHours() * 60 + agora.getMinutes()
  const out: string[] = []
  for (let t = abre; t + dur <= fecha; t += dur) {
    if (almoco && t < almoco[1] && t + dur > almoco[0]) continue
    if (ehHoje && t <= minAgora) continue
    out.push(toHHMM(t))
  }
  return out
}

/** Agrupa dias consecutivos com o mesmo horário: "Segunda a sexta · 09h00 às 18h30". */
export const resumoHorarios = () => {
  const linhas: { dias: string; horas: string }[] = []
  const ordem = [1, 2, 3, 4, 5, 6, 0]
  let grupo: number[] = []
  let chave = ''
  const fechar = () => {
    if (!grupo.length) return
    const nome = (d: number) => NOMES_DIAS[d]
    const dias =
      grupo.length === 1
        ? nome(grupo[0])
        : `${nome(grupo[0])} ${grupo.length === 2 ? 'e' : 'a'} ${nome(grupo[grupo.length - 1]).toLowerCase()}`
    linhas.push({ dias, horas: chave })
    grupo = []
  }
  for (const d of ordem) {
    const h = horarioDoDia(d)
    const k = h
      ? `${formatHora(h.abre)} às ${formatHora(h.fecha)}${h.almoco ? ` (intervalo ${formatHora(h.almoco.inicio)}–${formatHora(h.almoco.fim)})` : ''}`
      : 'Fechado'
    if (k !== chave) {
      fechar()
      chave = k
    }
    grupo.push(d)
  }
  fechar()
  return linhas
}
