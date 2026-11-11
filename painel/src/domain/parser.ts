// Lê um texto colado (comprovante, notificação do Asaas/Mercado Pago, mensagem
// de WhatsApp) e extrai o que reconhecer. Nada é salvo sem confirmação.
import { parseDateBR, parseMoney, round2 } from "./format";
import type { ISODate, PaymentMethod, Platform } from "./types";

export interface ParsedPayment {
  client?: string;
  gross_amount?: number;
  installments_count?: number;
  installment_amount?: number;
  payment_method?: PaymentMethod;
  platform?: Platform;
  date?: ISODate;
  /** O que foi reconhecido, em português, para mostrar antes de aplicar. */
  found: { field: string; label: string; value: string }[];
}

const MONEY = String.raw`R\$\s*(\d{1,3}(?:\.\d{3})*(?:,\d{2})?|\d+(?:,\d{2})?)`;

export function parsePaymentText(text: string): ParsedPayment {
  const out: ParsedPayment = { found: [] };
  const t = text.replace(/ /g, " ");

  // "3 x de R$ 99,00" / "3x R$ 99,00" / "em 3 vezes de R$ 99,00"
  const inst = t.match(new RegExp(String.raw`(\d{1,2})\s*(?:x|vezes)\s*(?:de\s*)?` + MONEY, "i"));
  if (inst) {
    out.installments_count = Number(inst[1]);
    out.installment_amount = parseMoney(inst[2]) ?? undefined;
  }

  // Valor total: "no valor de R$ X", "total: R$ X", "(R$ X)" depois das parcelas, ou o 1º R$.
  const total =
    t.match(new RegExp(String.raw`(?:valor(?:\s+total)?(?:\s+de)?|total)\s*:?\s*` + MONEY, "i")) ??
    (inst ? t.slice((inst.index ?? 0) + inst[0].length).match(new RegExp(String.raw`\(\s*` + MONEY + String.raw`\s*\)`)) : null) ??
    t.match(new RegExp(MONEY));
  if (total) out.gross_amount = parseMoney(total[1]) ?? undefined;
  if (out.gross_amount == null && out.installments_count && out.installment_amount) {
    out.gross_amount = round2(out.installments_count * out.installment_amount);
  }
  // Se o "total" achado for na verdade o valor da parcela, corrige.
  if (
    out.installments_count && out.installments_count > 1 && out.installment_amount &&
    out.gross_amount === out.installment_amount
  ) {
    out.gross_amount = round2(out.installments_count * out.installment_amount);
  }

  // Forma de pagamento
  if (/cart[aã]o\s+de\s+cr[eé]dito|cr[eé]dito|cart[aã]o/i.test(t)) {
    out.payment_method = out.installments_count && out.installments_count > 1 ? "cartao_parcelado" : "cartao_avista";
  } else if (/\bpix\b/i.test(t)) {
    out.payment_method = "pix";
  } else if (/\bboleto\b/i.test(t)) {
    out.payment_method = "boleto";
  } else if (/transfer[eê]ncia|\bTED\b|\bDOC\b/i.test(t)) {
    out.payment_method = "transferencia";
  }

  // Plataforma
  if (/asaas/i.test(t)) out.platform = "asaas";
  else if (/mercado\s*pago/i.test(t)) out.platform = "mercado_pago";

  // Data dd/mm/aaaa
  const dm = t.match(/\b(\d{1,2}\/\d{1,2}\/(?:\d{4}|\d{2}))\b/);
  if (dm) out.date = parseDateBR(dm[1]) ?? undefined;

  // Nome: depois de "Cliente:" (ou Pagador/Nome) ou começando com Dr./Dra.
  const NAME_WORD = String.raw`[A-ZÀ-Ý][\p{L}'’-]*`;
  const NAME = String.raw`${NAME_WORD}(?:\s+(?:d[aeo]s?\s+|e\s+)?${NAME_WORD})*`;
  const labeled = t.match(/(?:cliente|pagador|nome)\s*:\s*([^\n\r,;|]+)/i);
  const doctor = t.match(new RegExp(String.raw`\b(Dra?\.?\s+${NAME})`, "u"));
  const name = labeled?.[1] ?? doctor?.[1];
  if (name) out.client = name.trim().replace(/[.\s]+$/, "");

  const f = out.found;
  if (out.client) f.push({ field: "client", label: "Cliente", value: out.client });
  if (out.gross_amount != null) f.push({ field: "gross_amount", label: "Valor", value: brl(out.gross_amount) });
  if (out.payment_method) f.push({ field: "payment_method", label: "Forma", value: METHOD_LABEL[out.payment_method] });
  if (out.installments_count) {
    f.push({
      field: "installments_count",
      label: "Parcelas",
      value: `${out.installments_count}x${out.installment_amount ? ` de ${brl(out.installment_amount)}` : ""}`,
    });
  }
  if (out.platform) f.push({ field: "platform", label: "Plataforma", value: out.platform === "asaas" ? "Asaas" : "Mercado Pago" });
  if (out.date) f.push({ field: "date", label: "Data", value: out.date.split("-").reverse().join("/") });
  return out;
}

const METHOD_LABEL: Record<PaymentMethod, string> = {
  pix: "Pix",
  cartao_avista: "Cartão à vista",
  cartao_parcelado: "Cartão parcelado",
  boleto: "Boleto",
  transferencia: "Transferência",
};

function brl(n: number): string {
  return `R$ ${n.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
