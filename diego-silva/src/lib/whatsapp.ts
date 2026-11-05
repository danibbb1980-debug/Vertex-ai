import { CONFIG } from "../config";

export const MSG_PADRAO = "Olá! Vim pelo site e gostaria de falar sobre um atendimento.";

export function waLink(texto: string = MSG_PADRAO, numero: string = CONFIG.whatsapp) {
  return `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`;
}
