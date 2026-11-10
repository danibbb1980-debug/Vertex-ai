import { CONFIG, areasAtivas, preenchido, profissionaisVisiveis } from "../config";
import { temTelefone, temWhatsapp } from "./contato";

type Secao = keyof typeof CONFIG.secoes;

/** Cada seção aparece só se estiver ligada em CONFIG.secoes E tiver conteúdo. */
export const secaoAtiva = (s: Secao): boolean => {
  if (!CONFIG.secoes[s]) return false;
  switch (s) {
    case "areas":
      return areasAtivas.length > 0;
    case "corpoClinico":
      return profissionaisVisiveis.length > 0;
    case "horariosDestaque":
    case "estrutura":
      return CONFIG.horarios.length > 0;
    case "agendar":
      // sem WhatsApp configurado o formulário não aparece; com usarWhatsapp=false vira "Ligar"
      return preenchido(CONFIG.whatsapp) && (temWhatsapp || temTelefone);
    case "ctaFinal":
      return temWhatsapp || temTelefone || preenchido(CONFIG.instagram.url);
    default:
      return true;
  }
};
