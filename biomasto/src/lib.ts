import { CONFIG, type Dia } from './config'

/** "09:00" -> "09h00" */
export const hora = (h: string) => h.replace(':', 'h')

export const minutos = (h: string) => {
  const [a, b] = h.split(':').map(Number)
  return a * 60 + b
}
const hhmm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`

export const waLink = (texto: string) =>
  `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(texto)}`

export type Acao = { href: string; label: string; externo: boolean; tipo: 'tel' | 'whatsapp' }

/**
 * Ação principal de contato. Com usarWhatsapp = false, tudo vira "Ligar" (tel:).
 * labelWa / labelTel permitem textos específicos por botão.
 */
export function acaoContato(opts: { mensagem?: string; labelWa?: string; labelTel?: string } = {}): Acao {
  if (CONFIG.usarWhatsapp && CONFIG.whatsapp) {
    return {
      href: waLink(opts.mensagem ?? CONFIG.mensagens.geral),
      label: opts.labelWa ?? 'Agendar pelo WhatsApp',
      externo: true,
      tipo: 'whatsapp',
    }
  }
  return { href: CONFIG.telefoneLink, label: opts.labelTel ?? 'Ligar', externo: false, tipo: 'tel' }
}

export const diaDaSemana = (semana: number): Dia | undefined =>
  CONFIG.horarios.find((d) => d.semana === semana)

/** Blocos de 1 hora que terminam dentro de cada período (exclui almoço e fechamento). */
export function horariosDoDia(semana: number): string[] {
  const dia = diaDaSemana(semana)
  if (!dia) return []
  const out: string[] = []
  for (const p of dia.periodos) {
    for (let m = minutos(p.inicio); m + 60 <= minutos(p.fim); m += 60) out.push(hhmm(m))
  }
  return out
}

export const diaAberto = (semana: number) => (diaDaSemana(semana)?.periodos.length ?? 0) > 0

/** "2026-11-10" -> Date local (sem fuso). */
export const parseData = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}
export const isoHoje = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
export const dataBR = (iso: string) => iso.split('-').reverse().join('/')

export const enderecoLinha = () => {
  const e = CONFIG.endereco
  return `${e.rua}, ${e.complemento}, ${e.bairro}, ${e.cidade} - ${e.uf}, CEP ${e.cep}`
}

export const temTexto = (s?: string | null) => !!s && s.trim().length > 0
