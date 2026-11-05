import { CONFIG } from "../config";

export const waLink = (mensagem: string = CONFIG.mensagens.geral) =>
  `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(mensagem)}`;

export const waAtendimento = (nome: string) => waLink(CONFIG.mensagens.atendimento(nome));
