import { describe, expect, it } from "vitest";
import { parsePaymentText } from "./parser";

describe("leitura do texto colado", () => {
  it("entende o texto real do Asaas", () => {
    const r = parsePaymentText(
      "Seu pagamento no cartão de crédito no valor de R$ 297,00 foi realizado. Sua compra foi confirmada em 3 x de R$ 99,00 (R$ 297,00).",
    );
    expect(r.gross_amount).toBe(297);
    expect(r.installments_count).toBe(3);
    expect(r.installment_amount).toBe(99);
    expect(r.payment_method).toBe("cartao_parcelado");
    expect(r.found.map((f) => f.label)).toEqual(["Valor", "Forma", "Parcelas"]);
  });

  it("Pix com data e cliente", () => {
    const r = parsePaymentText("Cliente: Clínica Sorriso Leve\nPix recebido R$ 1.234,56 em 05/11/2026");
    expect(r.client).toBe("Clínica Sorriso Leve");
    expect(r.gross_amount).toBe(1234.56);
    expect(r.payment_method).toBe("pix");
    expect(r.date).toBe("2026-11-05");
  });

  it("nome depois de Dr./Dra.", () => {
    expect(parsePaymentText("Pagamento da Dra. Ana Paula de Souza, R$ 497,00 via Mercado Pago").client)
      .toBe("Dra. Ana Paula de Souza");
    expect(parsePaymentText("Dr. Marcos Lima pagou R$ 797,00").client).toBe("Dr. Marcos Lima");
    expect(parsePaymentText("via Mercado Pago").platform).toBe("mercado_pago");
  });

  it("parcelas sem total explícito calculam o total", () => {
    const r = parsePaymentText("Compra em 6x de R$ 82,83 no cartão");
    expect(r.gross_amount).toBe(496.98);
    expect(r.payment_method).toBe("cartao_parcelado");
  });

  it("texto sem nada reconhecível não inventa dados", () => {
    const r = parsePaymentText("Oi, tudo bem? Amanhã te mando o comprovante.");
    expect(r.found).toEqual([]);
    expect(r.gross_amount).toBeUndefined();
  });
});
