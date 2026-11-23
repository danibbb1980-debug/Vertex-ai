import unitsJson from "./data/unidades.json";
import cadastroJson from "./data/cadastro-unidades.json";
import { site, whatsappLink } from "./site";

/**
 * Unidades publicadas em naomaispelo.com.br/onde-estamos (131 lojas).
 * Gerado a partir da página original; ver README para atualizar.
 */
export type Unit = {
  id: string;
  nome: string;
  uf: string;
  cidade: string;
  endereco: string;
  telefone: string;
  /** Número com DDI, ou null quando a unidade não publicou WhatsApp. */
  whatsapp: string | null;
};

export const units = unitsJson as Unit[];

export const UF_NAMES: Record<string, string> = {
  BA: "Bahia",
  CE: "Ceará",
  DF: "Distrito Federal",
  ES: "Espírito Santo",
  GO: "Goiás",
  MA: "Maranhão",
  MG: "Minas Gerais",
  MS: "Mato Grosso do Sul",
  PA: "Pará",
  PE: "Pernambuco",
  PR: "Paraná",
  RJ: "Rio de Janeiro",
  RS: "Rio Grande do Sul",
  SC: "Santa Catarina",
  SE: "Sergipe",
  SP: "São Paulo",
};

export const states = Array.from(new Set(units.map((u) => u.uf))).sort();

/** Link de agendamento da unidade; sem WhatsApp publicado, cai na central. */
export function unitBookingHref(unit: Unit) {
  return whatsappLink(unit.whatsapp ?? site.centralWhatsapp);
}

export function unitMapsHref(unit: Unit) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`Não+Pelo ${unit.endereco}`)}`;
}

/** Normaliza texto para busca sem acento e sem caixa. */
export function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

/**
 * Unidades do formulário de cadastro, no formato da API do site original
 * (/wp-json/clinicaon/v1). Os nomes são os que o CRM da rede espera receber.
 */
export type CadastroUnit = { nome: string; whatsapp: string };
export const cadastroUnits = cadastroJson as Record<string, Record<string, CadastroUnit[]>>;
