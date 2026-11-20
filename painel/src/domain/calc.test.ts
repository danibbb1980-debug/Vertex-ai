import { describe, expect, it } from "vitest";
import {
  adjustmentsEnd, adjustmentsEndingSoon, breakEven, costDueDate, costsForMonth, effectiveStatus,
  meiLevel, meiStatus, monthMetrics, netAmount, nextRecurring, pendingRefund, planInstallments,
  splitAmount, statusAfterReceipts,
} from "./calc";
import { dateBR, money, parseDateBR, parseMoney, todayISO } from "./format";
import type { Cost, Installment, Sale } from "./types";

const base = { created_at: "", updated_at: "", deleted_at: null };

function sale(p: Partial<Sale> = {}): Sale {
  return {
    ...base, id: "s1", client: "Cliente Teste", segment: "outro", city: null, contact: null,
    lead_origin: null, referred_by: null, package: "padrao", description: null,
    gross_amount: 297, payment_method: "pix", installments_count: 1, platform: "direto",
    fee_percent: 0, net_amount: 297, sale_date: "2026-11-10", first_payment_date: "2026-11-10",
    status: "aceita", recurring_active: false, draft_sent_at: null, published_at: null,
    adjustments_end: null, domain_expires_at: null, domain: null, site_url: null, notes: null,
    refunded_at: null, lead_id: null, ...p,
  };
}

function inst(p: Partial<Installment>): Installment {
  return {
    ...base, id: Math.random().toString(36), sale_id: "s1", number: 1, gross_amount: 0,
    net_amount: 0, due_date: "2026-11-10", received_at: null, status: "a_receber", ...p,
  };
}

function cost(p: Partial<Cost>): Cost {
  return {
    ...base, id: "c", description: "x", category: "ferramentas", amount: 129.9,
    recurrence: "mensal", day_of_month: null, date: null, starts_on: null, active: true, notes: null, ...p,
  };
}

describe("valor líquido", () => {
  it("desconta a taxa percentual", () => {
    expect(netAmount(297, 0)).toBe(297);
    expect(netAmount(297, 4.99)).toBe(282.18);
    expect(netAmount(797, 2.5)).toBe(777.08);
  });
});

describe("formatos brasileiros", () => {
  it("lê R$ 1.234,56 e variações", () => {
    expect(parseMoney("R$ 1.234,56")).toBe(1234.56);
    expect(parseMoney("297,00")).toBe(297);
    expect(parseMoney("1.500")).toBe(1500);
    expect(parseMoney("99.9")).toBe(99.9);
    expect(parseMoney("abc")).toBeNull();
  });
  it("formata moeda e datas", () => {
    expect(money(1234.56)).toBe("R$ 1.234,56");
    expect(dateBR("2026-11-10")).toBe("10/11/2026");
    expect(parseDateBR("10/11/2026")).toBe("2026-11-10");
    expect(parseDateBR("31/02/2026")).toBeNull();
  });
  it("hoje é calculado no fuso de São Paulo", () => {
    // 02:00 UTC de 11/11 ainda é 23:00 de 10/11 em São Paulo
    expect(todayISO(new Date("2026-11-11T02:00:00Z"))).toBe("2026-11-10");
  });
});

describe("geração de parcelas", () => {
  it("Pix gera 1 parcela, mesmo se pedirem mais", () => {
    const p = planInstallments(sale({ payment_method: "pix", installments_count: 3 }));
    expect(p).toHaveLength(1);
    expect(p[0]).toMatchObject({ number: 1, gross_amount: 297, due_date: "2026-11-10" });
  });

  it("cartão 3x: 3 parcelas de 99,00 a cada 30 dias", () => {
    const p = planInstallments(sale({ payment_method: "cartao_parcelado", installments_count: 3 }));
    expect(p.map((x) => x.gross_amount)).toEqual([99, 99, 99]);
    expect(p.map((x) => x.due_date)).toEqual(["2026-11-10", "2026-12-10", "2027-01-09"]);
  });

  it("cartão 6x: soma exata, diferença de centavos na 1ª parcela, líquido com taxa", () => {
    const p = planInstallments(sale({
      gross_amount: 497, payment_method: "cartao_parcelado", installments_count: 6, fee_percent: 5,
    }));
    expect(p).toHaveLength(6);
    expect(p[0].gross_amount).toBe(82.85);
    expect(p[1].gross_amount).toBe(82.83);
    expect(Math.round(p.reduce((a, x) => a + x.gross_amount, 0) * 100)).toBe(49700);
    expect(Math.round(p.reduce((a, x) => a + x.net_amount, 0) * 100)).toBe(Math.round(netAmount(497, 5) * 100));
    expect(p[5].due_date).toBe("2027-04-09");
  });

  it("splitAmount nunca perde centavos", () => {
    expect(splitAmount(100, 3)).toEqual([33.34, 33.33, 33.33]);
  });

  it("plano mensal: 1ª mensalidade e as próximas sob demanda", () => {
    const s = sale({ package: "mensal", gross_amount: 197, net_amount: 197, recurring_active: true, first_payment_date: "2026-08-05" });
    const p = planInstallments(s);
    expect(p).toEqual([{ number: 1, gross_amount: 197, net_amount: 197, due_date: "2026-08-05" }]);
    const existing = [inst({ number: 1, due_date: "2026-08-05", gross_amount: 197, net_amount: 197 })];
    const next = nextRecurring(s, existing, "2026-11-11");
    expect(next.map((x) => x.due_date)).toEqual(["2026-09-05", "2026-10-05", "2026-11-05", "2026-12-05"]);
    expect(next.at(-1)?.number).toBe(5);
  });

  it("assinatura encerrada não gera mais mensalidades", () => {
    const s = sale({ package: "mensal", recurring_active: false });
    expect(nextRecurring(s, [inst({ due_date: "2026-01-01" })], "2026-11-11")).toEqual([]);
  });
});

describe("situação das parcelas e da venda", () => {
  it("atrasada é calculada pela data", () => {
    expect(effectiveStatus(inst({ due_date: "2026-11-01" }), sale(), "2026-11-11")).toBe("atrasada");
    expect(effectiveStatus(inst({ due_date: "2026-11-20" }), sale(), "2026-11-11")).toBe("a_receber");
    expect(effectiveStatus(inst({ received_at: "2026-11-02" }), sale(), "2026-11-11")).toBe("recebida");
    expect(effectiveStatus(inst({}), sale({ status: "cancelada" }), "2026-11-11")).toBe("cancelada");
  });
  it("status da venda acompanha os recebimentos", () => {
    const s = sale({ status: "aguardando" });
    const a = inst({ number: 1, received_at: "2026-11-10" });
    const b = inst({ number: 2 });
    expect(statusAfterReceipts(s, [a, b])).toBe("parcial");
    expect(statusAfterReceipts(s, [a, { ...b, received_at: "2026-12-10" }])).toBe("paga");
  });
});

describe("recebido x a receber no mês", () => {
  const sales = [
    sale({ id: "a", gross_amount: 297, net_amount: 297, sale_date: "2026-11-10" }),
    sale({ id: "b", gross_amount: 500, net_amount: 480, sale_date: "2026-10-03", status: "cancelada" }),
    sale({ id: "c", gross_amount: 600, net_amount: 600, sale_date: "2026-11-02", status: "proposta" }),
  ];
  const installments = [
    inst({ sale_id: "a", number: 1, gross_amount: 99, net_amount: 95, due_date: "2026-11-10", received_at: "2026-11-12" }),
    inst({ sale_id: "a", number: 2, gross_amount: 99, net_amount: 95, due_date: "2026-11-30" }),
    inst({ sale_id: "a", number: 3, gross_amount: 99, net_amount: 95, due_date: "2026-12-30" }),
    inst({ sale_id: "b", gross_amount: 500, net_amount: 480, due_date: "2026-11-05", received_at: "2026-11-05" }),
  ];
  const costs = [cost({ amount: 129.9 })];

  it("soma recebido pela data de recebimento e a receber pela data prevista", () => {
    const m = monthMetrics({ sales, installments, costs }, "2026-11");
    expect(m.receivedNet).toBe(95);
    expect(m.toReceiveNet).toBe(95);
    expect(m.soldGross).toBe(297); // proposta e cancelada não contam
    expect(m.salesCount).toBe(1);
    expect(m.costs).toBe(129.9);
    expect(m.resultCash).toBe(-34.9);
    expect(m.resultAccrual).toBe(167.1);
  });

  it("venda cancelada com valor recebido gera aviso de reembolso", () => {
    expect(pendingRefund(sales[1], installments)).toBe(500);
    expect(pendingRefund({ ...sales[1], refunded_at: "2026-11-20" }, installments)).toBe(0);
  });
});

describe("fim dos ajustes", () => {
  it("é a publicação + 30 dias corridos", () => {
    expect(adjustmentsEnd("2026-11-10")).toBe("2026-12-10");
    expect(adjustmentsEnd("2027-02-01")).toBe("2027-03-03");
    expect(adjustmentsEnd(null)).toBeNull();
  });
  it("alerta quando faltam 7 dias ou menos", () => {
    expect(adjustmentsEndingSoon({ adjustments_end: "2026-11-18", status: "paga" }, "2026-11-11")).toBe(true);
    expect(adjustmentsEndingSoon({ adjustments_end: "2026-11-19", status: "paga" }, "2026-11-11")).toBe(false);
    expect(adjustmentsEndingSoon({ adjustments_end: "2026-11-10", status: "paga" }, "2026-11-11")).toBe(false);
  });
});

describe("alerta do MEI", () => {
  it("faixas de 70% e 90%", () => {
    expect(meiLevel(0.69)).toBe("ok");
    expect(meiLevel(0.7)).toBe("atencao");
    expect(meiLevel(0.9)).toBe("alto");
    expect(meiLevel(1.01)).toBe("excedido");
  });
  it("soma recebido e outras receitas contra o limite", () => {
    const s = meiStatus(40000, 10000, 81000);
    expect(s.total).toBe(50000);
    expect(s.level).toBe("ok");
    expect(meiStatus(60000, 13000, 81000).level).toBe("alto");
    expect(meiStatus(57000, 0, 81000).level).toBe("atencao");
  });
});

describe("custos", () => {
  it("custos sem valor ou inativos não contam", () => {
    expect(costsForMonth([cost({ amount: null, active: false }), cost({ amount: 129.9 })], "2026-11")).toBe(129.9);
  });
  it("anual cai só no mês cadastrado; única só no mês da data", () => {
    const anual = cost({ recurrence: "anual", amount: 40, date: "2026-03-15" });
    expect(costDueDate(anual, "2027-03")).toBe("2027-03-15");
    expect(costDueDate(anual, "2026-11")).toBeNull();
    const unica = cost({ recurrence: "unica", amount: 80, date: "2026-11-02" });
    expect(costDueDate(unica, "2026-11")).toBe("2026-11-02");
    expect(costDueDate(unica, "2026-12")).toBeNull();
  });
  it("ponto de equilíbrio", () => {
    expect(breakEven(129.9, 297)).toBe(1);
    expect(breakEven(600, 297)).toBe(3);
    expect(breakEven(100, 0)).toBeNull();
  });
});
