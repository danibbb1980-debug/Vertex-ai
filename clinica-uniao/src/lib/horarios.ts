import { CONFIG, type DiaSemana, type Expediente } from '../config'

const NOMES_DIA = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']

export const paraMin = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}
export const paraHHMM = (min: number) =>
  `${String(Math.floor(min / 60)).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`

/** "08:00" -> "8h", "08:30" -> "8h30" */
export const legivel = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number)
  return m ? `${h}h${String(m).padStart(2, '0')}` : `${h}h`
}

const igual = (a: Expediente | null, b: Expediente | null) =>
  JSON.stringify(a) === JSON.stringify(b)

/** Agrupa dias consecutivos com o mesmo expediente: "Segunda a sexta", "Sábado", "Domingo". */
export function linhasHorario() {
  const ordem: DiaSemana[] = [1, 2, 3, 4, 5, 6, 0]
  const grupos: { dias: DiaSemana[]; exp: Expediente | null }[] = []
  for (const d of ordem) {
    const exp = CONFIG.horarios[d]
    const ult = grupos[grupos.length - 1]
    if (ult && igual(ult.exp, exp)) ult.dias.push(d)
    else grupos.push({ dias: [d], exp })
  }
  return grupos.map(({ dias, exp }) => {
    const rotulo =
      dias.length === 1
        ? NOMES_DIA[dias[0]]
        : `${NOMES_DIA[dias[0]]} a ${NOMES_DIA[dias[dias.length - 1]].toLowerCase()}`
    let valor = 'Fechado'
    if (exp) {
      valor = exp.almoco
        ? `${legivel(exp.abre)} às ${legivel(exp.almoco.inicio)} e ${legivel(exp.almoco.fim)} às ${legivel(exp.fecha)}`
        : `${legivel(exp.abre)} às ${legivel(exp.fecha)}`
    }
    return { rotulo, valor, fechado: !exp }
  })
}

/** Converte "aaaa-mm-dd" em Date local (sem fuso). */
export function dataLocal(iso: string) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function expedienteDoDia(iso: string): Expediente | null {
  if (!iso) return null
  return CONFIG.horarios[dataLocal(iso).getDay() as DiaSemana] ?? null
}

/**
 * Blocos de 1 hora dentro do expediente, sem o horário de fechamento e sem o almoço.
 * Se a data for hoje, remove horários que já passaram.
 */
export function horariosDisponiveis(iso: string, agora = new Date()): string[] {
  const exp = expedienteDoDia(iso)
  if (!exp) return []
  const passo = CONFIG.agendamento.duracaoBlocoMin
  const abre = paraMin(exp.abre)
  const fecha = paraMin(exp.fecha)
  const almoco = exp.almoco ? [paraMin(exp.almoco.inicio), paraMin(exp.almoco.fim)] : null
  const hoje = hojeISO(agora) === iso
  const minAgora = agora.getHours() * 60 + agora.getMinutes()
  const lista: string[] = []
  for (let t = abre; t + passo <= fecha; t += passo) {
    if (almoco && t < almoco[1] && t + passo > almoco[0]) continue
    if (hoje && t <= minAgora) continue
    lista.push(paraHHMM(t))
  }
  return lista
}

export function hojeISO(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export const dataBR = (iso: string) => iso.split('-').reverse().join('/')

/** Para o JSON-LD (schema.org). */
export function openingHoursSpecification() {
  const nomes = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  return (Object.entries(CONFIG.horarios) as [string, Expediente | null][])
    .filter(([, e]) => e)
    .flatMap(([d, e]) => {
      const dia = `https://schema.org/${nomes[Number(d)]}`
      if (e!.almoco)
        return [
          { '@type': 'OpeningHoursSpecification', dayOfWeek: dia, opens: e!.abre, closes: e!.almoco.inicio },
          { '@type': 'OpeningHoursSpecification', dayOfWeek: dia, opens: e!.almoco.fim, closes: e!.fecha },
        ]
      return [{ '@type': 'OpeningHoursSpecification', dayOfWeek: dia, opens: e!.abre, closes: e!.fecha }]
    })
}

/** Texto curto para o campo de data, ex.: "Segunda a sábado. Domingo sem atendimento." */
export function dicaDias() {
  const fechados = ([0, 1, 2, 3, 4, 5, 6] as DiaSemana[]).filter((d) => !CONFIG.horarios[d])
  const abertos = linhasHorario().filter((l) => !l.fechado).map((l) => l.rotulo.toLowerCase())
  const t = abertos.join(' e ')
  const a = t.charAt(0).toUpperCase() + t.slice(1)
  const f = fechados.map((d) => NOMES_DIA[d]).join(' e ')
  return f ? `${a}. ${f} sem atendimento.` : `${a}.`
}
