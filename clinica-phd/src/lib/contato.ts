import { CONFIG, preenchido } from "../config";

export const temWhatsapp = CONFIG.usarWhatsapp && preenchido(CONFIG.whatsapp);
export const temTelefone = preenchido(CONFIG.telefone);

export const telHref = `tel:+${CONFIG.telefone}`;

export const waHref = (mensagem: string = CONFIG.mensagens.geral) =>
  `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(mensagem)}`;

/** Link principal de contato: WhatsApp quando ativo, senão telefone. */
export const contatoHref = (mensagem?: string) => (temWhatsapp ? waHref(mensagem) : telHref);
export const contatoExterno = temWhatsapp;
export const rotuloAgendar = temWhatsapp ? "Agendar pelo WhatsApp" : "Ligar para agendar";

export const enderecoLinha1 = `${CONFIG.endereco.logradouro}, ${CONFIG.endereco.complemento}`;
export const enderecoLinha2 = `${CONFIG.endereco.edificio} · ${CONFIG.endereco.bairro}`;
export const enderecoLinha3 = `${CONFIG.endereco.cidade} - ${CONFIG.endereco.uf} · CEP ${CONFIG.endereco.cep}`;

export const crmTexto = (crm: string, uf: string) => `CRM-${uf} ${crm}`;
