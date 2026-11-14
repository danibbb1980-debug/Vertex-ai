import { describe, expect, it } from "vitest";
import { applyChanges, moveLead, saveSale, type SaleDraft } from "./service";
import { todayISO } from "./format";
import {
  addBusinessDays, cadenceFollowup, closeLead, daysLate, dismiss, followupStatus, isWeekend, leadFollowupStatus,
  leadMirrorDate, markSent, messageFor, migrateLeadsToFollowups, newFollowup, nextMonday, postpone,
  scheduleRetake,
} from "./followups";
import { migrateLocalDataset } from "../data/repo";
import { defaultSettings } from "../data/seed";
import type { Dataset, Followup, Lead } from "./types";

const base = { created_at: "2026-11-01T12:00:00.000Z", updated_at: "2026-11-01T12:00:00.000Z", deleted_at: null };

function lead(p: Partial<Lead> = {}): Lead {
  return {
    ...base, id: "l1", name: "Clínica Teste", segment: "odontologia", origin: "instagram", stage: "contatado",
    stage_dates: { contatado: "2026-11-01" }, offered_amount: 497, last_contact_at: "2026-11-01",
    next_followup_at: null, lost_reason: null, notes: "obs antiga", sale_id: null, ...p,
  };
}

function fu(p: Partial<Followup> = {}): Followup {
  return newFollowup({ tipo: "followup_2du", canal: "whatsapp", data_prevista: "2026-11-14", lead_id: "l1", ...p });
}

function dataset(p: Partial<Dataset> = {}): Dataset {
  return {
    sales: [], installments: [], costs: [], leads: [lead()], sale_history: [], followups: [],
    settings: defaultSettings(), ...p,
  };
}

describe("status do follow-up (fuso de São Paulo)", () => {
  const today = "2026-11-14";
  it("ontem é Atrasado, hoje é Hoje, amanhã é Pendente", () => {
    expect(followupStatus(fu({ data_prevista: "2026-11-13" }), today)).toBe("atrasado");
    expect(followupStatus(fu({ data_prevista: "2026-11-14" }), today)).toBe("hoje");
    expect(followupStatus(fu({ data_prevista: "2026-11-15" }), today)).toBe("pendente");
  });
  it("enviado e dispensado têm prioridade sobre a data", () => {
    expect(followupStatus(fu({ data_prevista: "2026-11-01", enviado_em: "2026-11-02T13:00:00Z" }), today)).toBe("enviado");
    expect(followupStatus(fu({ data_prevista: "2026-11-01", dispensado_em: "2026-11-02T13:00:00Z" }), today)).toBe("dispensado");
  });
  it("virada do dia: 23:59 em São Paulo ainda é o mesmo dia; 00:00 já atrasa", () => {
    const f = fu({ data_prevista: "2026-11-14" });
    // 23:59 de 14/11 em SP = 02:59 UTC de 15/11
    expect(followupStatus(f, todayISO(new Date("2026-11-15T02:59:00Z")))).toBe("hoje");
    // 00:00 de 15/11 em SP = 03:00 UTC
    expect(followupStatus(f, todayISO(new Date("2026-11-15T03:00:00Z")))).toBe("atrasado");
    // 22:00 UTC de 14/11 ainda é 19:00 em SP: um follow-up de amanhã continua pendente
    expect(followupStatus(fu({ data_prevista: "2026-11-15" }), todayISO(new Date("2026-11-14T22:00:00Z")))).toBe("pendente");
  });
  it("conta os dias de atraso", () => {
    expect(daysLate(fu({ data_prevista: "2026-11-10" }), today)).toBe(4);
    expect(daysLate(fu({ data_prevista: "2026-11-14" }), today)).toBe(0);
  });
});

describe("dias úteis", () => {
  it("+2 dias úteis: sexta vira terça, quinta vira segunda, segunda vira quarta", () => {
    expect(addBusinessDays("2026-11-13", 2)).toBe("2026-11-17"); // sex -> ter
    expect(addBusinessDays("2026-11-12", 2)).toBe("2026-11-16"); // qui -> seg
    expect(addBusinessDays("2026-11-09", 2)).toBe("2026-11-11"); // seg -> qua
  });
  it("a partir do fim de semana também pula para dias úteis", () => {
    expect(addBusinessDays("2026-11-14", 2)).toBe("2026-11-17"); // sáb -> ter
    expect(addBusinessDays("2026-11-15", 1)).toBe("2026-11-16"); // dom -> seg
  });
  it("fim de semana e segunda seguinte", () => {
    expect(isWeekend("2026-11-14")).toBe(true);
    expect(isWeekend("2026-11-16")).toBe(false);
    expect(nextMonday("2026-11-14")).toBe("2026-11-16");
    expect(nextMonday("2026-11-15")).toBe("2026-11-16");
    expect(nextMonday("2026-11-18")).toBe("2026-11-18");
  });
});

describe("marcar como enviado", () => {
  it("grava enviado_em, enviado_manual e atualiza o último contato do lead", () => {
    const f = fu();
    const data = dataset({ followups: [f], leads: [lead({ next_followup_at: f.data_prevista })] });
    const { changes } = markSent(data, f.id, "2026-11-14T15:30:00Z");
    expect(changes.followups?.[0]).toMatchObject({ enviado_em: "2026-11-14T15:30:00Z", enviado_manual: true });
    expect(changes.leads?.[0].last_contact_at).toBe("2026-11-14");
    expect(changes.leads?.[0].next_followup_at).toBeNull(); // espelho: não há mais follow-up em aberto
  });

  it("desfazer restaura o follow-up e o lead exatamente como estavam", () => {
    const f = fu();
    const original = lead({ next_followup_at: f.data_prevista });
    const data = dataset({ followups: [f], leads: [original] });
    const { changes, undo } = markSent(data, f.id, "2026-11-14T15:30:00Z");
    const after = applyChanges(data, changes);
    const restored = applyChanges(after, undo);
    const rf = restored.followups.find((x) => x.id === f.id)!;
    expect(rf.enviado_em).toBeNull();
    expect(rf.enviado_manual).toBe(false);
    const rl = restored.leads.find((x) => x.id === original.id)!;
    expect(rl.last_contact_at).toBe(original.last_contact_at);
    expect(rl.next_followup_at).toBe(original.next_followup_at);
  });

  it("envio registrado em data anterior usa essa data, sem voltar o último contato", () => {
    const f = fu();
    const data = dataset({ followups: [f], leads: [lead({ last_contact_at: "2026-11-01" })] });
    // 01:00 UTC de 12/11 = 22:00 de 11/11 em São Paulo
    expect(markSent(data, f.id, "2026-11-12T01:00:00Z").changes.leads?.[0].last_contact_at).toBe("2026-11-11");
    const recent = dataset({ followups: [f], leads: [lead({ last_contact_at: "2026-11-13" })] });
    expect(markSent(recent, f.id, "2026-11-12T15:00:00Z").changes.leads?.[0].last_contact_at).toBe("2026-11-13");
  });
});

describe("adiar e dispensar", () => {
  it("adiar muda a data prevista e o espelho do lead; desfazer volta", () => {
    const f = fu({ data_prevista: "2026-11-10" });
    const data = dataset({ followups: [f], leads: [lead({ next_followup_at: "2026-11-10" })] });
    const { changes, undo } = postpone(data, f.id, addBusinessDays("2026-11-14", 1));
    expect(changes.followups?.[0].data_prevista).toBe("2026-11-16");
    expect(changes.leads?.[0].next_followup_at).toBe("2026-11-16");
    expect(applyChanges(applyChanges(data, changes), undo).followups[0].data_prevista).toBe("2026-11-10");
  });
  it("dispensar marca dispensado_em com motivo; não é mais atrasado; desfazer reabre", () => {
    const f = fu({ data_prevista: "2026-11-10" });
    const data = dataset({ followups: [f] });
    const { changes, undo } = dismiss(data, f.id, "Respondeu pelo telefone", "2026-11-14T12:00:00Z");
    const d = changes.followups![0];
    expect(d.dispensado_em).toBe("2026-11-14T12:00:00Z");
    expect(d.motivo_dispensa).toBe("Respondeu pelo telefone");
    expect(followupStatus(d, "2026-11-14")).toBe("dispensado");
    expect(applyChanges(applyChanges(data, changes), undo).followups[0].dispensado_em).toBeNull();
  });
  it("não adia nem dispensa o que já foi enviado", () => {
    const f = fu({ enviado_em: "2026-11-13T10:00:00Z" });
    const data = dataset({ followups: [f] });
    expect(postpone(data, f.id, "2026-11-20").changes).toEqual({});
    expect(dismiss(data, f.id, null).changes).toEqual({});
  });
});

describe("cadência automática", () => {
  it("mover para Rascunho enviado cria o follow-up em +2 dias úteis, com canal da origem", () => {
    const data = dataset();
    const changes = moveLead(data, "l1", "rascunho", "2026-11-13"); // sexta
    expect(changes.followups).toHaveLength(1);
    expect(changes.followups![0]).toMatchObject({
      tipo: "followup_2du", lead_id: "l1", canal: "instagram", data_prevista: "2026-11-17", enviado_em: null,
    });
    expect(changes.leads![0].next_followup_at).toBe("2026-11-17");
  });
  it("no máximo um follow-up de 2 dias úteis por lead, mesmo depois de enviado", () => {
    const sent = fu({ enviado_em: "2026-11-10T10:00:00Z" });
    const data = dataset({ followups: [sent], leads: [lead({ stage: "rascunho" })] });
    expect(moveLead(data, "l1", "proposta", "2026-11-14").followups).toBeUndefined();
  });
  it("estágios fora da cadência não criam follow-up", () => {
    expect(moveLead(dataset(), "l1", "respondeu", "2026-11-14").followups).toBeUndefined();
    expect(cadenceFollowup([], lead({ stage: "fechado" }), "2026-11-14", defaultSettings())).toBeNull();
  });
  it("respeita a configuração de dias úteis", () => {
    const f = cadenceFollowup([], lead({ stage: "proposta" }), "2026-11-16", { followup_business_days: 3 });
    expect(f?.data_prevista).toBe("2026-11-19");
  });
  it("retomada em 60 ou 90 dias e encerrar movem o lead corretamente", () => {
    const data = dataset();
    expect(scheduleRetake(data, "l1", 60, "2026-11-14").changes.followups![0]).toMatchObject({ tipo: "retomada", data_prevista: "2027-01-13" });
    expect(scheduleRetake(data, "l1", 90, "2026-11-14").changes.followups![0].data_prevista).toBe("2027-02-12");
    const open = fu({ data_prevista: "2026-11-20" });
    const closed = closeLead(dataset({ followups: [open] }), "l1", "Sem resposta", "2026-11-14");
    expect(closed.changes.leads![0]).toMatchObject({ stage: "perdido", lost_reason: "Sem resposta" });
    expect(closed.changes.followups![0].dispensado_em).not.toBeNull();
  });
});

describe("pós-venda", () => {
  const draft: SaleDraft = {
    client: "Cliente Teste", segment: "advocacia", city: null, contact: "35999990000", lead_origin: null,
    referred_by: null, package: "padrao", description: null, gross_amount: 497, payment_method: "pix",
    installments_count: 1, platform: "direto", fee_percent: 0, sale_date: "2026-11-01",
    first_payment_date: "2026-11-01", status: "paga", recurring_active: false, draft_sent_at: null,
    published_at: null, adjustments_end: null, domain_expires_at: null, domain: null, site_url: null,
    notes: null, refunded_at: null, lead_id: null,
  };
  it("sem data de publicação não cria nada; com publicação cria em +30 dias (fim dos ajustes)", () => {
    const data = dataset({ leads: [] });
    expect(saveSale(data, draft, null, "2026-11-14").changes.followups).toEqual([]);
    const { changes, sale } = saveSale(data, { ...draft, published_at: "2026-11-10" }, null, "2026-11-14");
    expect(changes.followups).toHaveLength(1);
    expect(changes.followups![0]).toMatchObject({ tipo: "pos_venda", sale_id: sale.id, lead_id: null, data_prevista: "2026-12-10" });
    expect(changes.followups![0].data_prevista).toBe(sale.adjustments_end);
  });
  it("não duplica ao salvar de novo, e acompanha a nova data de publicação", () => {
    const data0 = dataset({ leads: [] });
    const first = saveSale(data0, { ...draft, published_at: "2026-11-10" }, null, "2026-11-14");
    const data1 = applyChanges(data0, first.changes);
    const { created_at: _c, updated_at: _u, deleted_at: _d, net_amount: _n, ...again } = first.sale;
    expect(saveSale(data1, again, null, "2026-11-14").changes.followups).toEqual([]);
    const moved = saveSale(data1, { ...again, published_at: "2026-11-12", adjustments_end: null }, null, "2026-11-14");
    expect(moved.changes.followups![0].data_prevista).toBe("2026-12-12");
  });
});

describe("migração dos leads existentes", () => {
  it("cria um follow-up por lead com próximo follow-up, sem perder nem alterar dados", () => {
    const leads = [
      lead({ id: "a", next_followup_at: "2026-11-20", origin: "whatsapp" }),
      lead({ id: "b", next_followup_at: null }),
      lead({ id: "c", next_followup_at: "2026-11-05", origin: "indicacao", deleted_at: "2026-11-06T10:00:00Z" }),
    ];
    const before = JSON.stringify(leads);
    const out = migrateLeadsToFollowups(leads, []);
    expect(out.map((f) => [f.lead_id, f.data_prevista, f.canal, f.tipo, f.enviado_em])).toEqual([
      ["a", "2026-11-20", "whatsapp", "followup_2du", null],
      ["c", "2026-11-05", "outro", "followup_2du", null],
    ]);
    expect(out[1].deleted_at).toBe("2026-11-06T10:00:00Z"); // lead excluído continua excluído
    expect(JSON.stringify(leads)).toBe(before);
    // idempotente: rodar de novo não duplica
    expect(migrateLeadsToFollowups(leads, out)).toEqual([]);
    expect(leadMirrorDate(out, "a")).toBe("2026-11-20");
  });

  it("modo local: dados antigos sem follow-ups são migrados uma única vez, mantendo tudo", () => {
    const old = {
      sales: [{ id: "s" }], installments: [{ id: "i" }], costs: [{ id: "c" }], sale_history: [],
      leads: [lead({ id: "a", next_followup_at: "2026-11-20" })],
      settings: { ...defaultSettings(), monthly_goal: 5000 },
    } as unknown as Partial<Dataset>;
    const { data, migrated } = migrateLocalDataset(old);
    expect(migrated).toBe(true);
    expect(data.followups).toHaveLength(1);
    expect(data.sales).toEqual(old.sales);
    expect(data.leads).toEqual(old.leads);
    expect(data.settings.monthly_goal).toBe(5000);
    expect(data.settings.followup_business_days).toBe(2);
    const again = migrateLocalDataset(data);
    expect(again.migrated).toBe(false);
    expect(again.data.followups).toHaveLength(1);
  });
});

describe("selo do lead e mensagem", () => {
  it("o selo mostra o mais urgente", () => {
    const fs = [fu({ data_prevista: "2026-11-20" }), fu({ data_prevista: "2026-11-10" })];
    expect(leadFollowupStatus(fs, "l1", "2026-11-14")).toBe("atrasado");
    expect(leadFollowupStatus([fu({ enviado_em: "2026-11-10T10:00:00Z" })], "l1", "2026-11-14")).toBe("enviado");
    expect(leadFollowupStatus([], "l1", "2026-11-14")).toBeNull();
  });
  it("modelo de mensagem substitui {nome} e aceita modelo editado", () => {
    expect(messageFor(defaultSettings(), "followup_2du", "Ana")).toMatch(/^Olá, Ana!/);
    expect(messageFor({ followup_templates: { retomada: "Oi {nome}, tudo certo?" } }, "retomada", "Bia")).toBe("Oi Bia, tudo certo?");
  });
});
