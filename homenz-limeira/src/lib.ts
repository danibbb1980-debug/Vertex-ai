import { CONFIG, atendimentosAtivos, type Area } from './config'

const BASE = 'Olá! Vi o site da Homenz Limeira e gostaria de agendar uma avaliação'

export function juntar(itens: string[]): string {
  if (itens.length <= 1) return itens.join('')
  return `${itens.slice(0, -1).join(', ')} e ${itens[itens.length - 1]}`
}

/** Áreas ativas na ordem do config. */
export function ordenar(areas: Iterable<Area>): Area[] {
  const set = new Set(areas)
  return atendimentosAtivos().map((a) => a.area).filter((a) => set.has(a))
}

export function frasesDe(areas: Iterable<Area>): string[] {
  const ativos = atendimentosAtivos()
  return ordenar(areas).map((ar) => ativos.find((a) => a.area === ar)!.naFrase)
}

export function mensagemFicha(areas: Iterable<Area>): string {
  const f = frasesDe(areas)
  return f.length ? `${BASE} de ${juntar(f)}.` : `${BASE}.`
}

export function waLink(texto: string): string {
  return `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(texto)}`
}

export const linkGeral = () => waLink(`${BASE}.`)
export const linkArea = (area: Area) => waLink(mensagemFicha([area]))

export const DIAS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']

export function horaCurta(h: string): string {
  const [hh, mm] = h.split(':')
  return mm === '00' ? `${Number(hh)}h` : `${Number(hh)}h${mm}`
}

/** Linhas de horário agrupando dias consecutivos iguais (seg a sex). */
export function linhasHorario(): { dias: string; horas: string; fechado?: boolean }[] {
  const out: { dias: string; horas: string; fechado?: boolean }[] = []
  const ordem = [1, 2, 3, 4, 5, 6, 0]
  let i = 0
  while (i < ordem.length) {
    const d = ordem[i]
    const h = CONFIG.horarios.find((x) => x.dia === d)
    let j = i
    while (j + 1 < ordem.length) {
      const n = CONFIG.horarios.find((x) => x.dia === ordem[j + 1])
      if (h && n && n.abre === h.abre && n.fecha === h.fecha) j++
      else if (!h && !n) j++
      else break
    }
    const dias = j > i ? `${DIAS[d]} a ${DIAS[ordem[j]].toLowerCase()}` : DIAS[d]
    out.push(h ? { dias, horas: `${horaCurta(h.abre)} às ${horaCurta(h.fecha)}` } : { dias, horas: 'Fechado', fechado: true })
    i = j + 1
  }
  return out
}

/** Horários de início possíveis (blocos de 1h, até 1h antes de fechar). */
export function horariosDoDia(dia: number): string[] {
  const h = CONFIG.horarios.find((x) => x.dia === dia)
  if (!h) return []
  const ini = Number(h.abre.split(':')[0])
  const fim = Number(h.fecha.split(':')[0])
  const out: string[] = []
  for (let x = ini; x <= fim - 1; x++) out.push(`${String(x).padStart(2, '0')}:00`)
  return out
}

export const diaAberto = (dia: number) => CONFIG.horarios.some((h) => h.dia === dia)

/** Data de hoje (aaaa-mm-dd) no fuso da clínica. */
export function hojeISO(): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: CONFIG.fusoHorario, year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date())
}

export function diaDaSemana(iso: string): number {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay()
}

export function dataBR(iso: string): string {
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}
