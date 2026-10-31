import { CONFIG } from '../config';

export const MSG_GERAL = 'Olá, Dr. Rennan! Vi seu site e gostaria de agendar uma avaliação.';

export function waLink(mensagem: string = MSG_GERAL): string {
  return `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(mensagem)}`;
}

export function waAtendimento(assunto: string): string {
  return waLink(`Olá, Dr. Rennan! Vi seu site e gostaria de informações sobre ${assunto}.`);
}
