import { CONFIG, type Unidade } from '../config'

export const linkWhatsapp = (numero: string, mensagem: string) =>
  `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`

export const mensagemGeral = (u: Unidade) => CONFIG.mensagemWhatsapp.replace('{unidade}', u.nome)

export const linkGeral = (u: Unidade) => linkWhatsapp(u.whatsapp, mensagemGeral(u))

export const enderecoLinha = (u: Unidade) =>
  `${u.endereco.logradouro} - ${u.endereco.bairro}, ${u.endereco.cidade} - ${u.endereco.uf}, ${u.endereco.cep}`

export const mapaEmbed = (u: Unidade) =>
  `https://www.google.com/maps?q=${encodeURIComponent(`${CONFIG.nome}, ${enderecoLinha(u)}`)}&output=embed`
