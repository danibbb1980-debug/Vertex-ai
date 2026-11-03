import { CONFIG } from '../config'

export const MSG_GERAL = 'Olá! Vi o site da Clínica União e gostaria de agendar uma avaliação.'

export const msgAtendimento = (nome: string) =>
  `Olá! Vi o site da Clínica União e gostaria de informações sobre ${nome}.`

export const waLink = (mensagem = MSG_GERAL) =>
  CONFIG.whatsapp ? `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(mensagem)}` : ''

export const telLink = CONFIG.telefoneE164 ? `tel:${CONFIG.telefoneE164}` : ''

const e = CONFIG.endereco
export const enderecoLinha1 = `${e.logradouro} - ${e.bairro}`
export const enderecoLinha2 = `${e.cidade} - ${e.uf}, ${e.cep}`
export const enderecoCompleto = `${enderecoLinha1}, ${enderecoLinha2}`

export const comoChegarLink = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
  enderecoCompleto,
)}`
export const mapaEmbed = `https://www.google.com/maps?q=${encodeURIComponent(CONFIG.mapsEmbedQuery)}&output=embed`
