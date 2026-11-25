import { CONFIG, type Faixa } from '../config'

export const DIAS = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado']
export const DIAS_CURTOS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
/** Ordem de exibição: segunda a domingo */
export const ORDEM_SEMANA = [1, 2, 3, 4, 5, 6, 0]

export const minutos = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + (m || 0)
}

/** 480 -> "8h", 750 -> "12h30" */
export const hora = (min: number) => {
  const h = Math.floor(min / 60)
  const m = min % 60
  return m ? `${h}h${String(m).padStart(2, '0')}` : `${h}h`
}

export const faixasDoDia = (dia: number): Faixa[] => CONFIG.horarios[dia] ?? []

/** "8h às 12h e 16h às 19h" ou "fechado" */
export const textoDoDia = (dia: number) => {
  const f = faixasDoDia(dia)
  if (!f.length) return 'fechado'
  return f.map((x) => `${hora(minutos(x.inicio))} às ${hora(minutos(x.fim))}`).join(' e ')
}

/** Limites da régua: da primeira abertura ao último fechamento da semana */
export const limitesSemana = () => {
  const todas = Object.values(CONFIG.horarios).flat()
  return {
    de: Math.min(...todas.map((f) => minutos(f.inicio))),
    ate: Math.max(...todas.map((f) => minutos(f.fim))),
  }
}

/** Dia da semana e minutos de agora, no fuso do spa */
export const agoraNoFuso = (data = new Date()) => {
  const p = new Intl.DateTimeFormat('en-US', {
    timeZone: CONFIG.fuso,
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(data)
  const v = (t: string) => p.find((x) => x.type === t)?.value ?? ''
  const dia = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(v('weekday'))
  return {
    dia,
    min: Number(v('hour')) * 60 + Number(v('minute')),
    iso: `${v('year')}-${v('month')}-${v('day')}`,
  }
}

/** Linha de status: "Aberto agora, até 12h" / "Fechado agora. Abre hoje às 16h" … */
export const statusAgora = (data = new Date()) => {
  const { dia, min } = agoraNoFuso(data)
  const hoje = faixasDoDia(dia)
  const aberta = hoje.find((f) => min >= minutos(f.inicio) && min < minutos(f.fim))
  if (aberta) return { aberto: true, texto: `Aberto agora, até ${hora(minutos(aberta.fim))}` }
  const proximaHoje = hoje.find((f) => minutos(f.inicio) > min)
  if (proximaHoje)
    return { aberto: false, texto: `Fechado agora. Abre hoje às ${hora(minutos(proximaHoje.inicio))}` }
  for (let i = 1; i <= 7; i++) {
    const d = (dia + i) % 7
    const f = faixasDoDia(d)
    if (f.length) {
      const quando = i === 1 ? 'amanhã' : DIAS[d]
      return { aberto: false, texto: `Fechado agora. Abre ${quando} às ${hora(minutos(f[0].inicio))}` }
    }
  }
  return { aberto: false, texto: 'Fechado agora.' }
}

/** Horários de início possíveis (blocos de 1 h, cabendo antes do fechamento de cada faixa) */
export const opcoesDeHorario = (dia: number) =>
  faixasDoDia(dia).flatMap((f) => {
    const out: string[] = []
    for (let m = minutos(f.inicio); m + 60 <= minutos(f.fim); m += 60)
      out.push(`${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`)
    return out
  })
