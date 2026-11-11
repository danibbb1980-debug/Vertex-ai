import { MEI_DEFAULT_LIMIT } from "../domain/calc";
import type { SaleDraft } from "../domain/service";
import type { Cost, Settings } from "../domain/types";

export function defaultSettings(): Settings {
  return {
    id: 1,
    monthly_goal: 0,
    mei_limit: MEI_DEFAULT_LIMIT,
    mei_other_revenue: 0,
    fees: {},
    hourly_cost: null,
    daily_cost: null,
    first_sale_prompt_done: false,
    updated_at: new Date().toISOString(),
  };
}

/** Mesmos ids do supabase/schema.sql, para a importação não duplicar. */
export function seedCosts(): Cost[] {
  const now = new Date().toISOString();
  const row = (id: string, p: Partial<Cost>): Cost => ({
    id, description: "", category: "outros", amount: null, recurrence: "mensal", day_of_month: null,
    date: null, starts_on: null, active: false, notes: null, created_at: now, updated_at: now,
    deleted_at: null, ...p,
  });
  return [
    row("00000000-0000-4000-8000-000000000001", {
      description: "Claude (assinatura)", category: "ferramentas", amount: 129.9, recurrence: "mensal", active: true,
    }),
    row("00000000-0000-4000-8000-000000000002", {
      description: "Imposto MEI (DAS)", category: "impostos", recurrence: "mensal",
    }),
    row("00000000-0000-4000-8000-000000000003", {
      description: "Domínios", category: "dominio", recurrence: "anual",
    }),
  ];
}

/** A primeira venda real, cadastrada só se o usuário aceitar no primeiro acesso. */
export const FIRST_SALE: SaleDraft = {
  client: "Diego Silva Advocacia",
  segment: "advocacia",
  city: null,
  contact: null,
  lead_origin: null,
  referred_by: null,
  package: "outro",
  description: null,
  gross_amount: 297,
  payment_method: "cartao_parcelado",
  installments_count: 3,
  platform: "asaas",
  fee_percent: 0,
  sale_date: "2026-11-10",
  first_payment_date: "2026-11-10",
  status: "paga",
  recurring_active: false,
  draft_sent_at: null,
  published_at: null,
  adjustments_end: null,
  domain_expires_at: null,
  domain: null,
  site_url: null,
  notes: null,
  refunded_at: null,
  lead_id: null,
};
