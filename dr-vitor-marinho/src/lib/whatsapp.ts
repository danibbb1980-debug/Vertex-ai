import { CONFIG, MENSAGEM_GERAL } from '../config'

export const waLink = (mensagem: string = MENSAGEM_GERAL) =>
  `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(mensagem)}`
