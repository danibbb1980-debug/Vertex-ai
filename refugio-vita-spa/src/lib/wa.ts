import { CONFIG } from '../config'

export const MSG_GERAL = `Olá! Vi o site do ${CONFIG.nome} e gostaria de agendar um horário.`
export const msgAtendimento = (nome: string) =>
  `Olá! Vi o site do ${CONFIG.nome} e gostaria de agendar um horário de ${nome.toLowerCase()}.`

export const waLink = (texto = MSG_GERAL) =>
  `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(texto)}`
