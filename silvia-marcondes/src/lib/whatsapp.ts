import { CONFIG } from "../config";

export const temWhatsapp = CONFIG.whatsapp.trim().length > 0;

export function linkWhatsapp(mensagem: string = CONFIG.mensagens.geral) {
  return `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(mensagem)}`;
}
