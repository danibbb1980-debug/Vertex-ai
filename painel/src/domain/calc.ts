// Regras de negócio e cálculos. Funções puras, sem React e sem banco: o mesmo
// código pode rodar num webhook (Asaas/Mercado Pago) no futuro.
import {
  daysBetween, monthKey, plusDays, plusMonths, round2,
} from "./format";
import type {
  Cost, Dataset, ISODate, Installment, InstallmentStatus, PaymentMethod, Platform, Sale,
  SaleStatus, Settings,
} from "./types";

export const ADJUSTMENT_DAYS = 30;
export const INSTALLMENT_INTERVAL_DAYS = 30;
export const MEI_DEFAULT_LIMIT = 81000;

// ---------------------------------------------------------------- taxas

export function feeKey(platform: Platform, method: PaymentMethod): string {
  return `${platform}|${method}`;
}

export function defaultFee(settings: Pick<Settings, "fees">, platform: Platform, method: PaymentMethod): number {
  return settings.fees[feeKey(platform, method)] ?? 0;
}

/** Valor líquido = bruto menos a taxa percentual. */
export function netAmount(gross: number, feePercent: number): number {
  return round2(gross * (1 - (feePercent || 0) / 100));
}

// ---------------------------------------------------------------- parcelas

export function isRecurring(sale: Pick<Sale, "package">): boolean {
  return sale.package === "mensal";
}

/** Pix e cartão à vista são sempre 1 parcela; o resto respeita o número informado. */
export function installmentCountFor(method: PaymentMethod, requested: number): number {
  if (method === "pix" || method === "cartao_avista") return 1;
  return Math.max(1, Math.min(24, Math.floor(requested || 1)));
}

/** Divide um total em n partes em centavos; a diferença de arredondamento vai na 1ª. */
export function splitAmount(total: number, n: number): number[] {
  const cents = Math.round(total * 100);
  const base = Math.floor(cents / n);
  const rest = cents - base * n;
  return Array.from({ length: n }, (_, i) => (base + (i === 0 ? rest : 0)) / 100);
}

export interface InstallmentPlan {
  number: number;
  gross_amount: number;
  net_amount: number;
  due_date: ISODate;
}

type PlanInput = Pick<
  Sale,
  "gross_amount" | "fee_percent" | "payment_method" | "installments_count" | "first_payment_date" | "package"
>;

/**
 * Parcelas de uma venda:
 * - Pix / cartão à vista: 1 parcela na data do primeiro pagamento;
 * - parcelado em N: N parcelas a cada 30 dias a partir do primeiro pagamento;
 * - plano mensal: a 1ª mensalidade (as seguintes nascem com `nextRecurring`).
 */
export function planInstallments(sale: PlanInput): InstallmentPlan[] {
  if (isRecurring(sale)) {
    return [{
      number: 1,
      gross_amount: round2(sale.gross_amount),
      net_amount: netAmount(sale.gross_amount, sale.fee_percent),
      due_date: sale.first_payment_date,
    }];
  }
  const n = installmentCountFor(sale.payment_method, sale.installments_count);
  const gross = splitAmount(sale.gross_amount, n);
  const net = splitAmount(netAmount(sale.gross_amount, sale.fee_percent), n);
  return gross.map((g, i) => ({
    number: i + 1,
    gross_amount: g,
    net_amount: net[i],
    due_date: plusDays(sale.first_payment_date, i * INSTALLMENT_INTERVAL_DAYS),
  }));
}

/**
 * Mensalidades que faltam criar para um plano mensal ativo: garante que sempre
 * exista uma mensalidade com vencimento hoje ou no futuro.
 */
export function nextRecurring(sale: Sale, existing: Installment[], today: ISODate): InstallmentPlan[] {
  if (!isRecurring(sale) || !sale.recurring_active || sale.status === "cancelada" || sale.deleted_at) return [];
  const mine = existing.filter((i) => i.sale_id === sale.id && !i.deleted_at);
  if (mine.length === 0) return [];
  const last = mine.reduce((a, b) => (a.number > b.number ? a : b));
  const plans: InstallmentPlan[] = [];
  let number = last.number;
  let due = last.due_date;
  // Limite de segurança: nunca cria mais de 36 de uma vez.
  while (due < today && plans.length < 36) {
    number += 1;
    due = plusMonths(sale.first_payment_date, number - 1);
    plans.push({
      number,
      gross_amount: round2(sale.gross_amount),
      net_amount: netAmount(sale.gross_amount, sale.fee_percent),
      due_date: due,
    });
  }
  return plans;
}

/** Situação real de uma parcela hoje (atrasada é calculada, não gravada). */
export function effectiveStatus(
  inst: Pick<Installment, "status" | "received_at" | "due_date">,
  sale: Pick<Sale, "status"> | undefined,
  today: ISODate,
): InstallmentStatus {
  if (inst.status === "cancelada") return "cancelada";
  if (inst.received_at) return "recebida";
  if (sale?.status === "cancelada") return "cancelada";
  if (inst.due_date < today) return "atrasada";
  return "a_receber";
}

/** Status sugerido da venda depois de marcar/desmarcar recebimentos. */
export function statusAfterReceipts(sale: Sale, installments: Installment[]): SaleStatus {
  if (sale.status === "cancelada" || sale.status === "proposta") return sale.status;
  const mine = installments.filter((i) => i.sale_id === sale.id && !i.deleted_at && i.status !== "cancelada");
  if (mine.length === 0) return sale.status;
  const received = mine.filter((i) => i.received_at).length;
  if (isRecurring(sale)) return received > 0 ? "paga" : sale.status;
  if (received === mine.length) return "paga";
  if (received > 0) return "parcial";
  return sale.status === "paga" || sale.status === "parcial" ? "aguardando" : sale.status;
}

// ---------------------------------------------------------------- projeto

/** Fim dos ajustes = publicação + 30 dias corridos. */
export function adjustmentsEnd(publishedAt: ISODate | null): ISODate | null {
  return publishedAt ? plusDays(publishedAt, ADJUSTMENT_DAYS) : null;
}

/** Vencimento do domínio sugerido: 1 ano após a publicação. */
export function domainRenewal(publishedAt: ISODate | null): ISODate | null {
  return publishedAt ? plusMonths(publishedAt, 12) : null;
}

/** Faltam até 7 dias (inclusive) para o fim dos ajustes. */
export function adjustmentsEndingSoon(sale: Pick<Sale, "adjustments_end" | "status">, today: ISODate): boolean {
  if (!sale.adjustments_end || sale.status === "cancelada") return false;
  const d = daysBetween(today, sale.adjustments_end);
  return d >= 0 && d <= 7;
}

// ---------------------------------------------------------------- custos

function lastDayOfMonth(key: string): number {
  const [y, m] = key.split("-").map(Number);
  return new Date(y, m, 0).getDate();
}

function costIsLive(cost: Cost): boolean {
  return cost.active && !cost.deleted_at && cost.amount != null && cost.amount > 0;
}

/** Data em que um custo cai num mês (ou null se não cai). */
export function costDueDate(cost: Cost, key: string): ISODate | null {
  if (!costIsLive(cost)) return null;
  if (cost.starts_on && monthKey(cost.starts_on) > key) return null;
  if (cost.recurrence === "mensal") {
    const day = Math.min(cost.day_of_month ?? 1, lastDayOfMonth(key));
    return `${key}-${String(day).padStart(2, "0")}`;
  }
  if (!cost.date) return null;
  if (cost.recurrence === "unica") return monthKey(cost.date) === key ? cost.date : null;
  // anual: mesmo mês, todos os anos a partir da data cadastrada
  if (cost.date.slice(5, 7) !== key.slice(5, 7) || cost.date.slice(0, 4) > key.slice(0, 4)) return null;
  const day = Math.min(Number(cost.date.slice(8, 10)), lastDayOfMonth(key));
  return `${key}-${String(day).padStart(2, "0")}`;
}

export function costsForMonth(costs: Cost[], key: string): number {
  return round2(costs.reduce((sum, c) => sum + (costDueDate(c, key) ? (c.amount ?? 0) : 0), 0));
}

/** Custo fixo mensal: mensais + anuais divididos por 12. */
export function fixedMonthly(costs: Cost[]): { monthly: number; annualShare: number; total: number } {
  let monthly = 0;
  let annual = 0;
  for (const c of costs) {
    if (!costIsLive(c)) continue;
    if (c.recurrence === "mensal") monthly += c.amount ?? 0;
    if (c.recurrence === "anual") annual += c.amount ?? 0;
  }
  const annualShare = round2(annual / 12);
  return { monthly: round2(monthly), annualShare, total: round2(monthly + annualShare) };
}

/** Quantas vendas do ticket médio cobrem os custos fixos do mês. */
export function breakEven(fixed: number, ticket: number): number | null {
  if (fixed <= 0) return 0;
  if (ticket <= 0) return null;
  return Math.ceil(fixed / ticket - 1e-9);
}

// ---------------------------------------------------------------- mês

export interface MonthMetrics {
  month: string;
  receivedNet: number;
  receivedGross: number;
  toReceiveNet: number;
  toReceiveGross: number;
  soldGross: number;
  soldNet: number;
  salesCount: number;
  ticket: number;
  costs: number;
  resultCash: number;
  resultAccrual: number;
}

function liveSales(sales: Sale[]): Map<string, Sale> {
  return new Map(sales.filter((s) => !s.deleted_at && s.status !== "cancelada").map((s) => [s.id, s]));
}

/** Venda conta como "vendida" a partir do aceite (proposta e cancelada ficam de fora). */
export function countsAsSold(sale: Sale): boolean {
  return !sale.deleted_at && sale.status !== "cancelada" && sale.status !== "proposta";
}

export function monthMetrics(data: Pick<Dataset, "sales" | "installments" | "costs">, key: string): MonthMetrics {
  const live = liveSales(data.sales);
  let receivedNet = 0, receivedGross = 0, toReceiveNet = 0, toReceiveGross = 0;
  for (const i of data.installments) {
    if (i.deleted_at || i.status === "cancelada" || !live.has(i.sale_id)) continue;
    if (i.received_at) {
      if (monthKey(i.received_at) === key) {
        receivedNet += i.net_amount;
        receivedGross += i.gross_amount;
      }
    } else if (monthKey(i.due_date) === key) {
      toReceiveNet += i.net_amount;
      toReceiveGross += i.gross_amount;
    }
  }
  const sold = data.sales.filter((s) => countsAsSold(s) && monthKey(s.sale_date) === key);
  const soldGross = round2(sold.reduce((a, s) => a + s.gross_amount, 0));
  const soldNet = round2(sold.reduce((a, s) => a + s.net_amount, 0));
  const costs = costsForMonth(data.costs, key);
  return {
    month: key,
    receivedNet: round2(receivedNet),
    receivedGross: round2(receivedGross),
    toReceiveNet: round2(toReceiveNet),
    toReceiveGross: round2(toReceiveGross),
    soldGross,
    soldNet,
    salesCount: sold.length,
    ticket: sold.length ? round2(soldGross / sold.length) : 0,
    costs,
    resultCash: round2(receivedNet - costs),
    resultAccrual: round2(soldNet - costs),
  };
}

/** Ticket médio de todas as vendas (para o ponto de equilíbrio). */
export function overallTicket(sales: Sale[]): number {
  const sold = sales.filter(countsAsSold);
  return sold.length ? round2(sold.reduce((a, s) => a + s.gross_amount, 0) / sold.length) : 0;
}

// ---------------------------------------------------------------- MEI

export type MeiLevel = "ok" | "atencao" | "alto" | "excedido";

export function meiLevel(ratio: number): MeiLevel {
  if (ratio >= 1) return "excedido";
  if (ratio >= 0.9) return "alto";
  if (ratio >= 0.7) return "atencao";
  return "ok";
}

/** Recebido bruto no ano (parcelas recebidas de vendas não canceladas). */
export function receivedInYear(data: Pick<Dataset, "sales" | "installments">, year: string): number {
  const live = liveSales(data.sales);
  return round2(
    data.installments
      .filter((i) => !i.deleted_at && i.status !== "cancelada" && i.received_at?.startsWith(year) && live.has(i.sale_id))
      .reduce((a, i) => a + i.gross_amount, 0),
  );
}

export function meiStatus(receivedYear: number, otherRevenue: number, limit: number) {
  const total = round2(receivedYear + (otherRevenue || 0));
  const ratio = limit > 0 ? total / limit : 0;
  return { total, ratio, remaining: round2(Math.max(0, limit - total)), level: meiLevel(ratio) };
}

// ---------------------------------------------------------------- cancelamento

/** Valor já recebido de uma venda cancelada que ainda precisa ser devolvido. */
export function pendingRefund(sale: Sale, installments: Installment[]): number {
  if (sale.status !== "cancelada" || sale.refunded_at || sale.deleted_at) return 0;
  return round2(
    installments
      .filter((i) => i.sale_id === sale.id && !i.deleted_at && i.received_at)
      .reduce((a, i) => a + i.gross_amount, 0),
  );
}
