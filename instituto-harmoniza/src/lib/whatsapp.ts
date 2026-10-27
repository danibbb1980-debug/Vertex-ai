import { CONFIG } from "../config";

/** Link do WhatsApp com mensagem pronta. Nunca confirma agendamento: só abre a conversa. */
export function linkWhatsApp(mensagem: string = CONFIG.mensagemWhatsAppGeral): string {
  return `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(mensagem)}`;
}
