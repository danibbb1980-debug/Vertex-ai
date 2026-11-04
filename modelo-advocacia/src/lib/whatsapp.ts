import { CONFIG } from "../config";

const base = (numero: string, texto: string) =>
  `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`;

/**
 * Link de WhatsApp do escritório.
 * No modo modelo, todo botão do escritório abre o WhatsApp da Lumivo Web
 * com a mensagem "Vi o modelo e quero um site assim".
 */
export function waEscritorio(mensagem = "Olá! Gostaria de falar com o escritório.") {
  if (CONFIG.modelo) return base(CONFIG.lumivo.whatsapp, CONFIG.lumivo.mensagemBotoes);
  return base(CONFIG.escritorio.whatsapp, mensagem);
}

/** Link do botão flutuante "Quero um site assim" (somente no modo modelo). */
export function waLumivo() {
  return base(CONFIG.lumivo.whatsapp, CONFIG.lumivo.mensagemModelo);
}

/** Link do pré-atendimento: monta a mensagem e abre o WhatsApp, sem guardar nada. */
export function waPreAtendimento(texto: string) {
  if (CONFIG.modelo) {
    return base(
      CONFIG.lumivo.whatsapp,
      `${CONFIG.lumivo.mensagemBotoes}. Testei o pré-atendimento do modelo:\n\n${texto}`,
    );
  }
  return base(CONFIG.escritorio.whatsapp, texto);
}
