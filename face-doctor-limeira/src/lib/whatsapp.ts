import { CONFIG } from '../config'

export const waUrl = (mensagem: string = CONFIG.mensagens.geral) =>
  `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(mensagem)}`

export const waAtendimento = (nome: string) => waUrl(CONFIG.mensagens.porAtendimento(nome))
