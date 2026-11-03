import { CONFIG } from '../config'

export function linkWhatsapp(mensagem: string = CONFIG.mensagemWhatsapp): string {
  return `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(mensagem)}`
}

export function linkTelefone(telefone: string = CONFIG.telefone): string {
  return `tel:+55${telefone.replace(/\D/g, '')}`
}

export function enderecoCompleto(): string {
  const e = CONFIG.endereco
  return `${e.rua} - ${e.bairro}, ${e.cidade} - ${e.uf}, ${e.cep}`
}
