import { CONFIG, DIAS, type HorarioDia } from '../config'

export const MSG_GERAL =
  'Olá! Vi o site da Odontologia Estética (Dr. André e Dr. Douglas) e gostaria de agendar uma avaliação.'

export function msgAtendimento(nome: string) {
  return `Olá! Vi o site da Odontologia Estética (Dr. André e Dr. Douglas) e gostaria de informações sobre ${nome.toLowerCase()}.`
}

export function waLink(texto: string = MSG_GERAL, numero: string = CONFIG.whatsapp) {
  return `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`
}

/** 5535988775060 -> (35) 98877-5060 ; 553534229276 -> (35) 3422-9276 */
export function formatarFone(n: string) {
  const d = n.replace(/^55/, '')
  const ddd = d.slice(0, 2)
  const r = d.slice(2)
  const meio = r.length === 9 ? 5 : 4
  return `(${ddd}) ${r.slice(0, meio)}-${r.slice(meio)}`
}

export const telLink = (n: string) => `tel:+${n}`

export const fmtHora = (h: string) => h.replace(':', 'h')

/** Agrupa dias consecutivos com o mesmo horário para exibição. */
export function horariosAgrupados(): { dias: string; texto: string }[] {
  const ordem = [1, 2, 3, 4, 5, 6, 0]
  const chave = (h: HorarioDia) => (h ? `${h.abre}-${h.fecha}` : 'fechado')
  const grupos: { ini: number; fim: number; h: HorarioDia }[] = []
  for (const d of ordem) {
    const h = CONFIG.horarios[d]
    const ult = grupos[grupos.length - 1]
    if (ult && chave(ult.h) === chave(h)) ult.fim = d
    else grupos.push({ ini: d, fim: d, h })
  }
  return grupos.map((g) => ({
    dias: g.ini === g.fim ? DIAS[g.ini] : `${DIAS[g.ini]} a ${DIAS[g.fim].toLowerCase()}`,
    texto: g.h ? `${fmtHora(g.h.abre)} às ${fmtHora(g.h.fecha)}` : 'Fechado',
  }))
}

const min = (h: string) => {
  const [a, b] = h.split(':').map(Number)
  return a * 60 + b
}
const hhmm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`

/** Blocos de 1 hora dentro do expediente, sem o almoço e sem o horário de fechamento. */
export function horariosDoDia(diaSemana: number): string[] {
  const h = CONFIG.horarios[diaSemana]
  if (!h) return []
  const out: string[] = []
  for (let m = min(h.abre); m + 60 <= min(h.fecha); m += 60) {
    if (h.almoco && m < min(h.almoco.fim) && m + 60 > min(h.almoco.inicio)) continue
    out.push(hhmm(m))
  }
  return out
}

export const enderecoCompleto = () => {
  const e = CONFIG.endereco
  return `${e.rua} - ${e.bairro}, ${e.cidade} - ${e.uf}, ${e.cep}`
}
