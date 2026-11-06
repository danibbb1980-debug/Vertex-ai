import { CONFIG } from "../config";

export const waLink = (mensagem: string = CONFIG.mensagens.geral) =>
  CONFIG.whatsapp ? `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(mensagem)}` : "";
