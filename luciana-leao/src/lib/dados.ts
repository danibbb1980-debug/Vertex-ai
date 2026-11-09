import { CONFIG, type DiaSemana, type Horario } from '../config'

export const NOMES_DIAS: Record<DiaSemana, string> = {
  0: 'Domingo',
  1: 'Segunda-feira',
  2: 'Terça-feira',
  3: 'Quarta-feira',
  4: 'Quinta-feira',
  5: 'Sexta-feira',
  6: 'Sábado',
}

/** "CRM 90524 | RQE 32476" (ou "CRM-MG 90524 | RQE 32476" quando a UF for preenchida). */
export function registro(): string {
  const { crm, uf, rqe } = CONFIG.profissional
  const partes: string[] = []
  if (crm) partes.push(`${uf ? `CRM-${uf}` : 'CRM'} ${crm}`)
  if (rqe) partes.push(`RQE ${rqe}`)
  return partes.join(' | ')
}

/** "8h", "18h30" */
export function horaCurta(hhmm: string): string {
  const [h, m] = hhmm.split(':').map(Number)
  return m ? `${h}h${String(m).padStart(2, '0')}` : `${h}h`
}

export function horarioDoDia(dia: number): Horario | undefined {
  return CONFIG.horarios.find((h) => h.dia === dia)
}

export function diaAberto(dia: number): boolean {
  const h = horarioDoDia(dia)
  return Boolean(h && !h.fechado && h.abre && h.fecha)
}

/** Agrupa dias consecutivos com o mesmo horário: [{rotulo: "Segunda a sexta", texto: "8h às 18h30"}] */
export function horariosResumidos(): { rotulo: string; texto: string; fechado: boolean }[] {
  const lista = [...CONFIG.horarios].sort((a, b) => ((a.dia + 6) % 7) - ((b.dia + 6) % 7))
  const grupos: { dias: Horario[]; chave: string }[] = []
  for (const h of lista) {
    const chave = h.fechado ? 'fechado' : `${h.abre}-${h.fecha}`
    const ultimo = grupos[grupos.length - 1]
    const anterior = ultimo?.dias[ultimo.dias.length - 1]
    if (ultimo && ultimo.chave === chave && anterior && (anterior.dia + 1) % 7 === h.dia) {
      ultimo.dias.push(h)
    } else grupos.push({ dias: [h], chave })
  }
  const curto = (d: DiaSemana) => NOMES_DIAS[d].replace('-feira', '').toLowerCase()
  return grupos.map(({ dias, chave }) => {
    const primeiro = dias[0]
    const ultimo = dias[dias.length - 1]
    const rotuloBase =
      dias.length === 1 ? NOMES_DIAS[primeiro.dia].replace('-feira', '') : `${curto(primeiro.dia)} a ${curto(ultimo.dia)}`
    const rotulo = rotuloBase.charAt(0).toUpperCase() + rotuloBase.slice(1)
    if (chave === 'fechado') return { rotulo, texto: 'Fechado', fechado: true }
    return { rotulo, texto: `${horaCurta(primeiro.abre!)} às ${horaCurta(primeiro.fecha!)}`, fechado: false }
  })
}

export function enderecoLinha1(): string {
  const e = CONFIG.endereco
  return [`${e.rua}, ${e.numero}`, e.complemento].filter(Boolean).join(', ')
}
export function enderecoLinha2(): string {
  const e = CONFIG.endereco
  return `${e.bairro}, ${e.cidade} - ${e.uf}${e.cep ? `, CEP ${e.cep}` : ''}`
}
export function enderecoCompleto(): string {
  return `${enderecoLinha1()}, ${enderecoLinha2()}`
}

export const MSG_GERAL = 'Olá! Vi o site da Dra. Luciana Leão e gostaria de agendar uma consulta.'
export function msgAtendimento(nome: string): string {
  return `Olá! Vi o site da Dra. Luciana Leão e gostaria de informações sobre ${nome}.`
}

export function linkWhatsApp(mensagem: string = MSG_GERAL): string {
  if (!CONFIG.whatsapp) return ''
  return `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(mensagem)}`
}

export const temWhatsApp = Boolean(CONFIG.whatsapp)
