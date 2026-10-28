/**
 * Regras do formulário "Solicitar agendamento". Tudo roda no navegador:
 * nada é guardado nem enviado a servidor algum.
 */
import { CONFIG, type Horario } from '../config'

const DIAS_SCHEMA = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

/** 'AAAA-MM-DD' → Date local (sem o desvio de fuso do new Date('AAAA-MM-DD')). */
export function lerData(valor: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(valor)
  if (!m) return null
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]))
  return d.getMonth() === Number(m[2]) - 1 ? d : null
}

export function dataISO(d: Date): string {
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}

export function dataBR(valor: string): string {
  const d = lerData(valor)
  if (!d) return ''
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`
}

/** Horário de funcionamento do dia (ou null se a clínica não abre). */
export function horarioDoDia(d: Date, horarios: Horario[] = CONFIG.horarios): Horario | null {
  const nome = DIAS_SCHEMA[d.getDay()]
  return horarios.find((h) => h.schemaDias.includes(nome) && h.abre && h.fecha) ?? null
}

const emMinutos = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}
const emHHMM = (min: number) => `${String(Math.floor(min / 60)).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`

/**
 * Blocos de 1 hora do dia: começa na abertura, exclui o intervalo de almoço e o
 * horário de fechamento. Se for hoje, exclui também os horários que já passaram.
 */
export function horariosDoDia(
  d: Date,
  agora: Date = new Date(),
  almoco = CONFIG.agendamento.intervaloAlmoco,
  horarios: Horario[] = CONFIG.horarios,
): string[] {
  const h = horarioDoDia(d, horarios)
  if (!h?.abre || !h.fecha) return []
  const abre = emMinutos(h.abre)
  const fecha = emMinutos(h.fecha)
  const hoje = dataISO(d) === dataISO(agora)
  const agoraMin = agora.getHours() * 60 + agora.getMinutes()
  const blocos: string[] = []
  for (let t = abre; t + 60 <= fecha; t += 60) {
    if (almoco && t < emMinutos(almoco.fim) && t + 60 > emMinutos(almoco.inicio)) continue
    if (hoje && t <= agoraMin) continue
    blocos.push(emHHMM(t))
  }
  return blocos
}

export type Pedido = {
  nome: string
  atendimento: string
  data: string
  horario: string
  observacoes: string
}

export type Erros = Partial<Record<keyof Pedido, string>>

export function validar(p: Pedido, agora: Date = new Date()): Erros {
  const erros: Erros = {}
  if (!p.nome.trim()) erros.nome = 'Informe seu nome.'
  if (CONFIG.agendamento.exigirAtendimento && !p.atendimento) erros.atendimento = 'Escolha o atendimento desejado.'
  if (p.data) {
    const d = lerData(p.data)
    const hoje = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate())
    if (!d) erros.data = 'Data inválida. Use o formato dd/mm/aaaa.'
    else if (d < hoje) erros.data = 'Escolha uma data a partir de hoje.'
    else if (!horarioDoDia(d)) erros.data = 'Dia sem atendimento, escolha outra data.'
    else if (!horariosDoDia(d, agora).length) erros.data = 'Não há mais horários neste dia, escolha outra data.'
    else if (p.horario && !horariosDoDia(d, agora).includes(p.horario)) erros.horario = 'Escolha um horário da lista.'
  }
  if (p.observacoes.length > CONFIG.agendamento.limiteObservacoes)
    erros.observacoes = `Use no máximo ${CONFIG.agendamento.limiteObservacoes} caracteres.`
  return erros
}

export function montarMensagem(p: Pedido): string {
  return [
    'Olá! Vim pelo site e gostaria de solicitar um agendamento.',
    `Nome: ${p.nome.trim()}`,
    `Atendimento: ${p.atendimento || 'a definir'}`,
    `Data preferida: ${p.data ? dataBR(p.data) : 'a combinar'}`,
    `Horário preferido: ${p.horario || 'a combinar'}`,
    `Observações: ${p.observacoes.trim() || '-'}`,
  ].join('\n')
}

export const urlWhatsApp = (mensagem: string) => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(mensagem)}`

/** Opções do select: atendimentos confirmados + duas opções fixas. */
export function opcoesAtendimento(): string[] {
  return [...CONFIG.atendimentos.map((a) => a.titulo), 'Primeira avaliação', 'Ainda não sei, quero conversar']
}
