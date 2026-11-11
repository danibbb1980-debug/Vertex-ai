// Tipos do domínio. Os nomes dos campos são os mesmos das colunas do Supabase,
// então não há tradução entre o app e o banco. Datas sem hora são "aaaa-mm-dd".

export type Segment = "advocacia" | "odontologia" | "estetica" | "clinica_medica" | "outro";
export type LeadOrigin = "instagram" | "whatsapp" | "indicacao" | "outro";
export type Package = "essencial" | "padrao" | "completo" | "mensal" | "outro";
export type PaymentMethod = "pix" | "cartao_avista" | "cartao_parcelado" | "boleto" | "transferencia";
export type Platform = "asaas" | "mercado_pago" | "direto";
export type SaleStatus = "proposta" | "aceita" | "aguardando" | "parcial" | "paga" | "cancelada";
export type InstallmentStatus = "a_receber" | "recebida" | "atrasada" | "cancelada";
export type CostCategory =
  | "ferramentas" | "dominio" | "hospedagem" | "taxas" | "impostos" | "marketing" | "outros";
export type Recurrence = "mensal" | "anual" | "unica";
export type LeadStage = "contatado" | "respondeu" | "rascunho" | "proposta" | "fechado" | "perdido";

/** Data sem hora, "aaaa-mm-dd". */
export type ISODate = string;

interface Row {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface Sale extends Row {
  client: string;
  segment: Segment;
  city: string | null;
  contact: string | null;
  lead_origin: LeadOrigin | null;
  referred_by: string | null;
  package: Package;
  description: string | null;
  gross_amount: number;
  payment_method: PaymentMethod;
  installments_count: number;
  platform: Platform;
  fee_percent: number;
  net_amount: number;
  sale_date: ISODate;
  first_payment_date: ISODate;
  status: SaleStatus;
  recurring_active: boolean;
  draft_sent_at: ISODate | null;
  published_at: ISODate | null;
  adjustments_end: ISODate | null;
  domain_expires_at: ISODate | null;
  domain: string | null;
  site_url: string | null;
  notes: string | null;
  refunded_at: ISODate | null;
  lead_id: string | null;
}

export interface Installment extends Row {
  sale_id: string;
  number: number;
  gross_amount: number;
  net_amount: number;
  due_date: ISODate;
  received_at: ISODate | null;
  status: InstallmentStatus;
}

export interface Cost extends Row {
  description: string;
  category: CostCategory;
  amount: number | null;
  recurrence: Recurrence;
  day_of_month: number | null;
  date: ISODate | null;
  starts_on: ISODate | null;
  active: boolean;
  notes: string | null;
}

export interface Lead extends Row {
  name: string;
  segment: Segment;
  origin: LeadOrigin;
  stage: LeadStage;
  stage_dates: Partial<Record<LeadStage, ISODate>>;
  offered_amount: number | null;
  last_contact_at: ISODate | null;
  next_followup_at: ISODate | null;
  lost_reason: string | null;
  notes: string | null;
  sale_id: string | null;
}

export interface SaleHistory {
  id: string;
  sale_id: string;
  at: string;
  author: string | null;
  summary: string;
}

export interface Settings {
  id: 1;
  monthly_goal: number;
  mei_limit: number;
  mei_other_revenue: number;
  /** Chave "plataforma|forma" -> taxa em %. */
  fees: Record<string, number>;
  hourly_cost: number | null;
  daily_cost: number | null;
  first_sale_prompt_done: boolean;
  updated_at: string;
}

export interface Dataset {
  sales: Sale[];
  installments: Installment[];
  costs: Cost[];
  leads: Lead[];
  sale_history: SaleHistory[];
  settings: Settings;
}

export type TableName = "sales" | "installments" | "costs" | "leads" | "sale_history";
