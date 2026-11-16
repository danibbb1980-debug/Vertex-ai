import { CONFIG, type Horario } from './config'

const hora = (s: string) => {
  const [h, m] = s.split(':').map(Number)
  return m ? `${h}h${String(m).padStart(2, '0')}` : `${h}h`
}

export const faixa = (h: Horario) => (h.abre && h.fecha ? `${hora(h.abre)} às ${hora(h.fecha)}` : 'Fechado')

/** "Segunda a sexta, das 8h às 19h. Sábado, das 8h às 14h." gerado a partir do config. */
export function resumoHorarios() {
  const abertos = CONFIG.horarios.filter((h) => h.abre && h.fecha)
  const grupos: Horario[][] = []
  for (const h of abertos) {
    const g = grupos[grupos.length - 1]
    if (g && g[0].abre === h.abre && g[0].fecha === h.fecha && h.diaSemana === g[g.length - 1].diaSemana + 1) g.push(h)
    else grupos.push([h])
  }
  const nome = (h: Horario) => h.dia.replace('-feira', '')
  return grupos
    .map((g) => {
      const dias = g.length > 1 ? `${nome(g[0])} a ${nome(g[g.length - 1]).toLowerCase()}` : nome(g[0])
      return `${dias}, das ${faixa(g[0])}.`
    })
    .join(' ')
}

/** Horários (em blocos de 1h) que podem ser pedidos num dia, excluindo o horário de fechamento. */
export function horariosDoDia(diaSemana: number | null): string[] {
  const h = diaSemana == null
    ? CONFIG.horarios.find((x) => x.abre && x.fecha && x.diaSemana >= 1 && x.diaSemana <= 5)
    : CONFIG.horarios.find((x) => x.diaSemana === diaSemana)
  if (!h || !h.abre || !h.fecha) return []
  const ini = Number(h.abre.split(':')[0])
  const fim = Number(h.fecha.split(':')[0])
  const lista: string[] = []
  for (let x = ini; x < fim; x++) lista.push(`${String(x).padStart(2, '0')}:00`)
  return lista
}

export function diaFechado(diaSemana: number) {
  const h = CONFIG.horarios.find((x) => x.diaSemana === diaSemana)
  return !h || !h.abre || !h.fecha
}
