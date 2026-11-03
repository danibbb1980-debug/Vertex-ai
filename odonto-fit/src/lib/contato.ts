import { CONFIG } from '../config'

export const waLink = (mensagem: string = CONFIG.mensagens.geral) =>
  `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(mensagem)}`

export const telLink = () => `tel:+55${CONFIG.telefone.replace(/\D/g, '')}`

export const enderecoLinha = () => {
  const e = CONFIG.endereco
  return `${e.rua} - ${e.bairro}, ${e.cidade} - ${e.uf}, ${e.cep}`
}

export const mapsEmbedUrl = () =>
  `https://www.google.com/maps?q=${encodeURIComponent(`${CONFIG.nome}, ${enderecoLinha()}`)}&output=embed`
