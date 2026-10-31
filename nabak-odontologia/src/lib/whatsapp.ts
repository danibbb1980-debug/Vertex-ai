import { CONFIG } from '../config'

export const MSG_GERAL = 'Olá! Vi o site da Nabak Odontologia e gostaria de agendar uma avaliação.'

export const msgAtendimento = (nome: string) =>
  `Olá! Vi o site da Nabak Odontologia e gostaria de informações sobre ${nome.toLowerCase()}.`

export const waLink = (mensagem: string = MSG_GERAL) =>
  CONFIG.whatsapp ? `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(mensagem)}` : ''
