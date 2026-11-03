import { CONFIG, type Horario } from '../config'

export const DIAS = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado']
const ORDEM = [1, 2, 3, 4, 5, 6, 0]

/** "08:30" -> "08h30" */
export const hx = (h: string) => h.replace(':', 'h')

const chave = (h: Horario) =>
  h ? `${h.abre}-${h.fecha}-${h.almoco?.inicio ?? ''}-${h.almoco?.fim ?? ''}` : 'fechado'

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

/** Agrupa dias seguidos com o mesmo horário: "Segunda a sexta", "Sábado e domingo". */
export function horariosAgrupados(): { dias: string; texto: string; aberto: boolean }[] {
  const grupos: { ini: number; fim: number; h: Horario; n: number }[] = []
  for (const d of ORDEM) {
    const h = CONFIG.horarios[d] ?? null
    const ult = grupos[grupos.length - 1]
    if (ult && chave(ult.h) === chave(h)) {
      ult.fim = d
      ult.n++
    } else grupos.push({ ini: d, fim: d, h, n: 1 })
  }
  return grupos.map((g) => {
    const dias =
      g.n === 1 ? cap(DIAS[g.ini]) : g.n === 2 ? `${cap(DIAS[g.ini])} e ${DIAS[g.fim]}` : `${cap(DIAS[g.ini])} a ${DIAS[g.fim]}`
    if (!g.h) return { dias, texto: 'Fechado', aberto: false }
    const base = `${hx(g.h.abre)} às ${hx(g.h.fecha)}`
    const texto = g.h.almoco ? `${hx(g.h.abre)} às ${hx(g.h.almoco.inicio)} e ${hx(g.h.almoco.fim)} às ${hx(g.h.fecha)}` : base
    return { dias, texto, aberto: true }
  })
}

const min = (h: string) => {
  const [a, b] = h.split(':').map(Number)
  return a * 60 + b
}
const fmt = (m: number) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`

/** Blocos de 1 hora para o dia da semana; exclui almoço e o horário de fechamento. */
export function horariosDoDia(diaSemana: number, aPartirDe?: number): string[] {
  const h = CONFIG.horarios[diaSemana]
  if (!h) return []
  const out: string[] = []
  for (let m = min(h.abre); m + 60 <= min(h.fecha); m += 60) {
    if (h.almoco && m < min(h.almoco.fim) && m + 60 > min(h.almoco.inicio)) continue
    if (aPartirDe !== undefined && m <= aPartirDe) continue
    out.push(fmt(m))
  }
  return out
}

export const diaAberto = (diaSemana: number) => !!CONFIG.horarios[diaSemana]
