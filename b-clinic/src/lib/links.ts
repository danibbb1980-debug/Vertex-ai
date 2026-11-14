import { CONFIG } from '../config'

/** URL de agendamento: WhatsApp com mensagem pronta, ou direct do Instagram. */
export function agendarUrl(mensagem: string = CONFIG.mensagens.geral): string {
  if (CONFIG.usarWhatsapp && CONFIG.whatsapp) {
    return `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(mensagem)}`
  }
  return CONFIG.instagram.direct
}

export const agendarCanal = () => (CONFIG.usarWhatsapp && CONFIG.whatsapp ? 'WhatsApp' : 'Instagram')

export const enderecoLinha = () => {
  const e = CONFIG.endereco
  return `${e.logradouro} · ${e.bairro} · ${e.cidade} - ${e.uf} · CEP ${e.cep}`
}

/** "Laser de CO2" → "laser de CO2" (preserva siglas). */
export const minusculaInicial = (s: string) => s.charAt(0).toLowerCase() + s.slice(1)
