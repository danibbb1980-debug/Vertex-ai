import { CONFIG } from '../config'

/** Link do WhatsApp com mensagem pronta. Nunca confirma agendamento: só abre a conversa. */
export const waLink = (mensagem: string = CONFIG.mensagens.geral) =>
  `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(mensagem)}`
