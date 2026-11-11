// Operações de negócio. Recebem os dados atuais e devolvem só as linhas que
// mudaram (Changes). Não sabem de React nem de banco. Um webhook futuro do
// Asaas/Mercado Pago pode usar `saveSale` e `markReceived` direto daqui.
import {
  adjustmentsEnd, isRecurring, netAmount, nextRecurring, planInstallments, statusAfterReceipts,
} from "./calc";
import { dateBR, money } from "./format";
import { METHODS, PACKAGES, PLATFORMS, SALE_STATUS, SEGMENTS } from "./labels";
import type {
  Dataset, ISODate, Installment, Lead, LeadStage, Sale, SaleHistory, TableName,
} from "./types";

export type Changes = Partial<{
  sales: Sale[];
  installments: Installment[];
  costs: Dataset["costs"];
  leads: Lead[];
  sale_history: SaleHistory[];
}>;

export type SaleDraft = Omit<Sale, "id" | "created_at" | "updated_at" | "deleted_at" | "net_amount"> & {
  id?: string;
};

export const uid = (): string =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) =>
        (Number(c) ^ (Math.random() * 16) >> (Number(c) / 4)).toString(16));

const nowISO = () => new Date().toISOString();

function newInstallments(sale: Sale, plans: ReturnType<typeof planInstallments>): Installment[] {
  const now = nowISO();
  return plans.map((p) => ({
    id: uid(), sale_id: sale.id, ...p, received_at: null, status: "a_receber",
    created_at: now, updated_at: now, deleted_at: null,
  }));
}

function history(saleId: string, author: string | null, summary: string): SaleHistory {
  return { id: uid(), sale_id: saleId, at: nowISO(), author, summary };
}

const FINANCIAL: (keyof Sale)[] = [
  "gross_amount", "fee_percent", "payment_method", "installments_count", "first_payment_date", "package",
];

const DIFF_LABELS: Partial<Record<keyof Sale, [string, (v: unknown) => string]>> = {
  client: ["Cliente", String],
  gross_amount: ["Valor", (v) => money(v as number)],
  fee_percent: ["Taxa", (v) => `${String(v).replace(".", ",")}%`],
  payment_method: ["Forma", (v) => METHODS[v as Sale["payment_method"]]],
  installments_count: ["Parcelas", String],
  platform: ["Plataforma", (v) => PLATFORMS[v as Sale["platform"]]],
  package: ["Pacote", (v) => PACKAGES[v as Sale["package"]]],
  segment: ["Segmento", (v) => SEGMENTS[v as Sale["segment"]]],
  status: ["Status", (v) => SALE_STATUS[v as Sale["status"]]],
  sale_date: ["Data da venda", (v) => dateBR(v as string)],
  first_payment_date: ["1º pagamento", (v) => dateBR(v as string)],
  draft_sent_at: ["Rascunho enviado", (v) => dateBR(v as string)],
  published_at: ["Publicado", (v) => dateBR(v as string)],
  adjustments_end: ["Fim dos ajustes", (v) => dateBR(v as string)],
  domain_expires_at: ["Vencimento do domínio", (v) => dateBR(v as string)],
  domain: ["Domínio", (v) => String(v ?? "—")],
};

function describeDiff(before: Sale, after: Sale): string {
  const parts: string[] = [];
  for (const [key, [label, fmt]] of Object.entries(DIFF_LABELS) as [keyof Sale, [string, (v: unknown) => string]][]) {
    if ((before[key] ?? null) !== (after[key] ?? null)) parts.push(`${label}: ${fmt(before[key])} → ${fmt(after[key])}`);
  }
  if (parts.length === 0) return "Detalhes atualizados";
  return parts.join("; ");
}

export interface SaveResult {
  changes: Changes;
  sale: Sale;
  warning?: string;
}

/** Cria ou atualiza uma venda e mantém as parcelas coerentes. */
export function saveSale(data: Dataset, draft: SaleDraft, author: string | null, today: ISODate): SaveResult {
  const now = nowISO();
  const before = draft.id ? data.sales.find((s) => s.id === draft.id) : undefined;
  const sale: Sale = {
    ...draft,
    id: before?.id ?? draft.id ?? uid(),
    client: draft.client.trim(),
    net_amount: netAmount(draft.gross_amount, draft.fee_percent),
    adjustments_end: draft.adjustments_end ?? adjustmentsEnd(draft.published_at),
    recurring_active: before ? draft.recurring_active : isRecurring(draft) && draft.status !== "cancelada",
    created_at: before?.created_at ?? now,
    updated_at: now,
    deleted_at: null,
  };

  const existing = data.installments.filter((i) => i.sale_id === sale.id && !i.deleted_at);
  let installments: Installment[] = [];
  let warning: string | undefined;

  if (!before) {
    installments = newInstallments(sale, planInstallments(sale));
  } else if (FINANCIAL.some((k) => before[k] !== sale[k])) {
    if (existing.some((i) => i.received_at)) {
      warning = "Esta venda já tem parcelas recebidas, então as parcelas não foram refeitas. Ajuste valores e datas direto nas parcelas.";
    } else {
      installments = [
        ...existing.map((i) => ({ ...i, deleted_at: now, updated_at: now })),
        ...newInstallments(sale, planInstallments(sale)),
      ];
    }
  }

  // Cancelamento / reativação mexe nas parcelas não recebidas.
  if (before && before.status !== sale.status && (before.status === "cancelada" || sale.status === "cancelada")) {
    const target = sale.status === "cancelada" ? "cancelada" : "a_receber";
    const touched = new Set(installments.map((i) => i.id));
    for (const i of existing) {
      if (touched.has(i.id) || i.received_at) continue;
      installments.push({ ...i, status: target, updated_at: now });
    }
    if (sale.status === "cancelada") sale.recurring_active = false;
  }

  const live = [...existing.filter((i) => !installments.some((c) => c.id === i.id)), ...installments.filter((i) => !i.deleted_at)];
  const recurring = newInstallments(sale, nextRecurring(sale, live, today));

  return {
    sale,
    warning,
    changes: {
      sales: [sale],
      installments: [...installments, ...recurring],
      sale_history: [history(sale.id, author, before ? describeDiff(before, sale) : "Venda cadastrada")],
    },
  };
}

/** Marca (ou desmarca, com date = null) uma parcela como recebida. */
export function markReceived(data: Dataset, installmentId: string, date: ISODate | null, author: string | null): Changes {
  const inst = data.installments.find((i) => i.id === installmentId);
  if (!inst) return {};
  const sale = data.sales.find((s) => s.id === inst.sale_id);
  const now = nowISO();
  const updated: Installment = {
    ...inst, received_at: date, status: date ? "recebida" : "a_receber", updated_at: now,
  };
  const all = data.installments.map((i) => (i.id === updated.id ? updated : i));
  const changes: Changes = { installments: [updated] };
  if (sale) {
    const status = statusAfterReceipts(sale, all);
    if (status !== sale.status) {
      changes.sales = [{ ...sale, status, updated_at: now }];
    }
    changes.sale_history = [history(sale.id, author, date
      ? `Parcela ${inst.number} recebida em ${dateBR(date)} (${money(inst.gross_amount)})`
      : `Parcela ${inst.number} voltou para "a receber"`)];
  }
  return changes;
}

/** Ajuste manual de valor/data de uma parcela. */
export function editInstallment(data: Dataset, patch: Pick<Installment, "id"> & Partial<Installment>, author: string | null): Changes {
  const inst = data.installments.find((i) => i.id === patch.id);
  if (!inst) return {};
  const updated = { ...inst, ...patch, updated_at: nowISO() };
  return {
    installments: [updated],
    sale_history: [history(inst.sale_id, author, `Parcela ${inst.number} ajustada: ${money(updated.gross_amount)}, prevista ${dateBR(updated.due_date)}`)],
  };
}

export function endSubscription(data: Dataset, saleId: string, author: string | null): Changes {
  const sale = data.sales.find((s) => s.id === saleId);
  if (!sale) return {};
  const now = nowISO();
  return {
    sales: [{ ...sale, recurring_active: false, updated_at: now }],
    sale_history: [history(sale.id, author, "Assinatura mensal encerrada")],
  };
}

export function markRefunded(data: Dataset, saleId: string, date: ISODate, author: string | null): Changes {
  const sale = data.sales.find((s) => s.id === saleId);
  if (!sale) return {};
  return {
    sales: [{ ...sale, refunded_at: date, updated_at: nowISO() }],
    sale_history: [history(sale.id, author, `Reembolso feito em ${dateBR(date)}`)],
  };
}

/** Gera as mensalidades que faltam de todos os planos mensais ativos. */
export function ensureRecurring(data: Dataset, today: ISODate): Changes {
  const created: Installment[] = [];
  for (const s of data.sales) {
    created.push(...newInstallments(s, nextRecurring(s, data.installments, today)));
  }
  return created.length ? { installments: created } : {};
}

export function moveLead(data: Dataset, leadId: string, stage: LeadStage, today: ISODate): Changes {
  const lead = data.leads.find((l) => l.id === leadId);
  if (!lead || lead.stage === stage) return {};
  return {
    leads: [{
      ...lead, stage, last_contact_at: today,
      stage_dates: { ...lead.stage_dates, [stage]: lead.stage_dates[stage] ?? today },
      updated_at: nowISO(),
    }],
  };
}

export function softDelete<T extends { deleted_at: string | null; updated_at: string }>(row: T): T {
  const now = nowISO();
  return { ...row, deleted_at: now, updated_at: now };
}

export function restore<T extends { deleted_at: string | null; updated_at: string }>(row: T): T {
  return { ...row, deleted_at: null, updated_at: nowISO() };
}

/** Aplica um conjunto de mudanças ao estado em memória (upsert por id). */
export function applyChanges(data: Dataset, changes: Changes): Dataset {
  const next = { ...data };
  for (const [table, rows] of Object.entries(changes) as [TableName, { id: string }[]][]) {
    if (!rows?.length) continue;
    const map = new Map((data[table] as { id: string }[]).map((r) => [r.id, r]));
    for (const r of rows) map.set(r.id, r);
    (next as Record<string, unknown>)[table] = [...map.values()];
  }
  return next;
}
