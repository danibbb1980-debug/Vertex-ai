import { CONFIG } from "../config";

export const MSG_GERAL = "Olá! Vi o site da Clinic Sculpt e gostaria de agendar uma avaliação.";

export const msgTratamento = (nome: string) =>
  `Olá! Vi o site da Clinic Sculpt e gostaria de agendar uma avaliação sobre ${nome.toLowerCase()}.`;

export const waUrl = (mensagem: string = MSG_GERAL) =>
  `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(mensagem)}`;
