import type {
  CostCategory, InstallmentStatus, LeadOrigin, LeadStage, Package, PaymentMethod, Platform,
  Recurrence, SaleStatus, Segment,
} from "./types";

export const SEGMENTS: Record<Segment, string> = {
  advocacia: "Advocacia",
  odontologia: "Odontologia",
  estetica: "Estética",
  clinica_medica: "Clínica médica",
  outro: "Outro",
};

export const ORIGINS: Record<LeadOrigin, string> = {
  instagram: "Instagram",
  whatsapp: "WhatsApp",
  indicacao: "Indicação",
  outro: "Outro",
};

export const PACKAGES: Record<Package, string> = {
  essencial: "Essencial",
  padrao: "Padrão",
  completo: "Completo",
  mensal: "Mensal",
  outro: "Outro",
};

export const METHODS: Record<PaymentMethod, string> = {
  pix: "Pix",
  cartao_avista: "Cartão à vista",
  cartao_parcelado: "Cartão parcelado",
  boleto: "Boleto",
  transferencia: "Transferência",
};

export const PLATFORMS: Record<Platform, string> = {
  asaas: "Asaas",
  mercado_pago: "Mercado Pago",
  direto: "Direto",
};

export const SALE_STATUS: Record<SaleStatus, string> = {
  proposta: "Proposta enviada",
  aceita: "Aceita",
  aguardando: "Aguardando pagamento",
  parcial: "Parcialmente paga",
  paga: "Paga",
  cancelada: "Cancelada",
};

export const INSTALLMENT_STATUS: Record<InstallmentStatus, string> = {
  a_receber: "A receber",
  recebida: "Recebida",
  atrasada: "Atrasada",
  cancelada: "Cancelada",
};

export const COST_CATEGORIES: Record<CostCategory, string> = {
  ferramentas: "Ferramentas",
  dominio: "Domínio",
  hospedagem: "Hospedagem",
  taxas: "Taxas",
  impostos: "Impostos",
  marketing: "Marketing",
  outros: "Outros",
};

export const RECURRENCES: Record<Recurrence, string> = {
  mensal: "Mensal",
  anual: "Anual",
  unica: "Única",
};

export const STAGES: Record<LeadStage, string> = {
  contatado: "Contatado",
  respondeu: "Respondeu",
  rascunho: "Rascunho enviado",
  proposta: "Proposta/valor enviado",
  fechado: "Fechado",
  perdido: "Perdido",
};

/** Ordem do funil (sem "perdido", que é uma saída lateral). */
export const STAGE_ORDER: LeadStage[] = ["contatado", "respondeu", "rascunho", "proposta", "fechado"];

export function entries<K extends string>(map: Record<K, string>): [K, string][] {
  return Object.entries(map) as [K, string][];
}
