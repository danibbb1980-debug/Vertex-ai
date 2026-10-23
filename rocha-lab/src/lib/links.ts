import { CONFIG } from '../config'

/** Link do WhatsApp com mensagem pronta. O clique apenas abre a conversa. */
export function whatsappLink(mensagem: string = CONFIG.mensagens.geral) {
  return `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(mensagem)}`
}

export const enderecoLinha1 = `${CONFIG.endereco.rua} · ${CONFIG.endereco.bairro}`
export const enderecoLinha2 = `${CONFIG.endereco.cidade} - ${CONFIG.endereco.uf} · CEP ${CONFIG.endereco.cep}`

/** Atributos para links que abrem em outra aba. */
export const externo = { target: '_blank', rel: 'noopener noreferrer' } as const
