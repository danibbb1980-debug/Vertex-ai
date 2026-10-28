import { CONFIG } from '../config'

/** Link do WhatsApp com mensagem codificada. */
export function waLink(mensagem: string = CONFIG.mensagemWhatsApp) {
  return `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(mensagem)}`
}

/** Mensagem para um atendimento específico. */
export function waAtendimento(trecho: string) {
  return waLink(`Olá! Vi o site do Dr. Gustavo e gostaria de conversar sobre ${trecho}. Pode me ajudar a agendar uma avaliação?`)
}

export const telLink = `tel:+${CONFIG.telefone}`
export const mailLink = `mailto:${CONFIG.email}`

export function enderecoLinha() {
  const e = CONFIG.endereco
  return `${e.rua} - ${e.bairro}, ${e.cidade} - ${e.uf}, ${e.cep}`
}

export function turnosTexto(turnos: [string, string][]) {
  if (!turnos.length) return 'Fechado'
  return turnos.map(([a, b]) => `${a.replace(':00', 'h')}–${b.replace(':00', 'h')}`).join(' e ')
}
