import { CONFIG } from '../config'

export const MSG_GERAL =
  'Olá! Vi o site da Tia Jessika e gostaria de agendar uma avaliação para meu filho(a).'

export const MSG_FASE = {
  bebes: 'Olá! Vi o site da Tia Jessika e gostaria de conversar sobre uma avaliação para meu bebê.',
  criancas: 'Olá! Vi o site da Tia Jessika e gostaria de conversar sobre uma avaliação para minha criança.',
  adolescentes: 'Olá! Vi o site da Tia Jessika e gostaria de conversar sobre uma avaliação para meu filho(a) adolescente.',
  maxilares:
    'Olá! Vi o site da Tia Jessika e gostaria de conversar sobre o acompanhamento do desenvolvimento dos maxilares do meu filho(a).',
} as const

export function waLink(msg: string = MSG_GERAL) {
  return `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`
}

export const telLink = `tel:${CONFIG.telefone}`
