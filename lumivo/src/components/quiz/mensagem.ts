import { config } from '../../config'

export interface Respostas {
  nome: string
  negocio: string
  cidade: string
  whatsapp: string
  instagram: string
  area: string
  temSite: string
}

export const respostasVazias: Respostas = { nome: '', negocio: '', cidade: '', whatsapp: '', instagram: '', area: '', temSite: '' }

export function soDigitos(v: string) {
  return v.replace(/\D/g, '')
}

/** Aceita DDD + número (10 ou 11 dígitos), com ou sem 55 na frente. */
export function whatsappValido(v: string) {
  let d = soDigitos(v)
  if (d.length > 11 && d.startsWith('55')) d = d.slice(2)
  return d.length === 10 || d.length === 11
}

export function formatarWhatsapp(v: string) {
  const d = soDigitos(v).slice(0, 11)
  if (d.length <= 2) return d.length ? `(${d}` : ''
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
}

export function montarMensagem(r: Respostas) {
  const insta = r.instagram.trim()
  const partes = [
    `Olá, sou ${r.nome.trim()}, do ${r.negocio.trim()} (${r.cidade.trim()}).`,
    `Área: ${r.area}.`,
    `Site atual: ${r.temSite}.`,
    insta ? `Meu Instagram: ${insta.startsWith('@') ? insta : '@' + insta}.` : '',
    'Quero ver o rascunho do meu site.',
  ]
  return partes.filter(Boolean).join(' ')
}

export function linkWhatsapp(r: Respostas) {
  return `https://wa.me/${config.contato.whatsapp}?text=${encodeURIComponent(montarMensagem(r))}`
}

/** Ponto isolado para um backend futuro. Hoje o envio é só a abertura do WhatsApp. */
export function enviarLead(r: Respostas) {
  window.open(linkWhatsapp(r), '_blank', 'noopener,noreferrer')
}
