// Follow-ups enviados manualmente. Funções puras: recebem os dados e devolvem
// só as linhas que mudaram, mais o "desfazer" correspondente. O status nunca é
// gravado: é calculado a partir das datas, no fuso de São Paulo.
import { adjustmentsEnd } from "./calc";
import { plusDays, toDate, todayISO } from "./format";
import { uid } from "./id";
import type {
  Dataset, Followup, FollowupCanal, FollowupStatus, FollowupTipo, ISODate, Lead, LeadOrigin, LeadStage,
  Sale, Settings,
} from "./types";

export const DEFAULT_BUSINESS_DAYS = 2;
export const DEFAULT_RETAKE_DAYS = 60;
/** Estágios que disparam o follow-up de 2 dias úteis. */
export const CADENCE_STAGES: LeadStage[] = ["rascunho", "proposta"];

export const DEFAULT_TEMPLATES: Record<FollowupTipo, string> = {
  followup_2du:
    "Olá, {nome}! Passando para saber se você conseguiu ver o que enviei. Fico à disposição para ajustar o que precisar.",
  retomada:
    "Olá, {nome}! Tudo bem? Conversamos há um tempo sobre o seu site. Se fizer sentido retomar agora, posso enviar uma proposta atualizada.",
  pos_venda:
    "Olá, {nome}! Seu site completa 30 dias no ar. Para mantê-lo atualizado e funcionando, temos o plano de manutenção de R$ 197 por mês. Posso explicar como funciona?",
  outro: "Olá, {nome}! Tudo bem?",
};

type FollowupChanges = { followups?: Followup[]; leads?: Lead[] };
export interface FollowupResult {
  changes: FollowupChanges;
  undo: FollowupChanges;
}

const nowISO = () => new Date().toISOString();

// ------------------------------------------------------------------ datas

/** 0 = domingo ... 6 = sábado. */
function weekday(iso: ISODate): number {
  return toDate(iso).getDay();
}

export function isWeekend(iso: ISODate): boolean {
  const d = weekday(iso);
  return d === 0 || d === 6;
}

/** Soma dias úteis (segunda a sexta). Sexta + 2 = terça. Feriados não contam. */
export function addBusinessDays(iso: ISODate, n: number): ISODate {
  let d = iso;
  let left = Math.max(0, Math.floor(n));
  while (left > 0) {
    d = plusDays(d, 1);
    if (!isWeekend(d)) left -= 1;
  }
  return d;
}

/** Segunda-feira seguinte a um sábado ou domingo (outras datas voltam iguais). */
export function nextMonday(iso: ISODate): ISODate {
  const w = weekday(iso);
  if (w === 6) return plusDays(iso, 2);
  if (w === 0) return plusDays(iso, 1);
  return iso;
}

/** Data (aaaa-mm-dd) de um instante ISO, no fuso de São Paulo. */
export function dateInSaoPaulo(instant: string): ISODate {
  return todayISO(new Date(instant));
}

// ------------------------------------------------------------------ status

/**
 * Enviado > Dispensado > Atrasado (antes de hoje) > Hoje > Pendente (futuro).
 * `today` é a data de hoje em São Paulo (use todayISO()).
 */
export function followupStatus(f: Pick<Followup, "enviado_em" | "dispensado_em" | "data_prevista">, today: ISODate): FollowupStatus {
  if (f.enviado_em) return "enviado";
  if (f.dispensado_em) return "dispensado";
  if (f.data_prevista < today) return "atrasado";
  if (f.data_prevista === today) return "hoje";
  return "pendente";
}

export function isOpen(f: Followup): boolean {
  return !f.deleted_at && !f.enviado_em && !f.dispensado_em;
}

/** Quantos dias de atraso (0 se não está atrasado). */
export function daysLate(f: Followup, today: ISODate): number {
  if (followupStatus(f, today) !== "atrasado") return 0;
  return Math.round((toDate(today).getTime() - toDate(f.data_prevista).getTime()) / 86_400_000);
}

/** Status que resume os follow-ups de um lead (para o selo no funil). */
export function leadFollowupStatus(followups: Followup[], leadId: string, today: ISODate): FollowupStatus | null {
  const mine = followups.filter((f) => f.lead_id === leadId && !f.deleted_at);
  const statuses = mine.map((f) => followupStatus(f, today));
  for (const s of ["atrasado", "hoje", "pendente", "enviado"] as FollowupStatus[]) {
    if (statuses.includes(s)) return s;
  }
  return null;
}

/** Espelho do lead: data prevista do follow-up em aberto mais próximo. */
export function leadMirrorDate(followups: Followup[], leadId: string): ISODate | null {
  const open = followups.filter((f) => f.lead_id === leadId && isOpen(f)).map((f) => f.data_prevista).sort();
  return open[0] ?? null;
}

export function channelFromOrigin(origin: LeadOrigin | null | undefined): FollowupCanal {
  if (origin === "whatsapp") return "whatsapp";
  if (origin === "instagram") return "instagram";
  return "outro";
}

// ------------------------------------------------------------------ montagem

export function newFollowup(p: Pick<Followup, "tipo" | "canal" | "data_prevista"> & Partial<Followup>): Followup {
  const now = nowISO();
  return {
    id: uid(), lead_id: null, sale_id: null, enviado_em: null, enviado_manual: false, dispensado_em: null,
    motivo_dispensa: null, observacao: null, created_at: now, updated_at: now, deleted_at: null, ...p,
  };
}

/**
 * Para cada linha alterada, devolve a versão anterior (ou a exclusão lógica,
 * se a linha é nova). Assim qualquer ação tem "Desfazer".
 */
function undoFor(data: Pick<Dataset, "followups" | "leads">, changes: FollowupChanges): FollowupChanges {
  const now = nowISO();
  const undo: FollowupChanges = {};
  if (changes.followups?.length) {
    const before = new Map(data.followups.map((f) => [f.id, f]));
    undo.followups = changes.followups.map((f) => {
      const old = before.get(f.id);
      return old ? { ...old, updated_at: now } : { ...f, deleted_at: now, updated_at: now };
    });
  }
  if (changes.leads?.length) {
    const before = new Map(data.leads.map((l) => [l.id, l]));
    undo.leads = changes.leads.map((l) => ({ ...(before.get(l.id) ?? l), updated_at: now }));
  }
  return undo;
}

/** Recalcula o espelho (próximo follow-up) dos leads afetados e inclui nas mudanças. */
function withMirror(data: Pick<Dataset, "followups" | "leads">, changes: FollowupChanges): FollowupChanges {
  const changed = new Map((changes.followups ?? []).map((f) => [f.id, f]));
  const all = [...data.followups.filter((f) => !changed.has(f.id)), ...changed.values()];
  const leadIds = new Set<string>();
  for (const f of changed.values()) if (f.lead_id) leadIds.add(f.lead_id);
  for (const id of changed.keys()) {
    const old = data.followups.find((f) => f.id === id);
    if (old?.lead_id) leadIds.add(old.lead_id);
  }
  const leads = new Map((changes.leads ?? []).map((l) => [l.id, l]));
  for (const id of leadIds) {
    const base = leads.get(id) ?? data.leads.find((l) => l.id === id);
    if (!base) continue;
    const mirror = leadMirrorDate(all, id);
    if (base.next_followup_at !== mirror || leads.has(id)) {
      leads.set(id, { ...base, next_followup_at: mirror, updated_at: nowISO() });
    }
  }
  return { followups: [...changed.values()], ...(leads.size ? { leads: [...leads.values()] } : {}) };
}

function result(data: Pick<Dataset, "followups" | "leads">, changes: FollowupChanges): FollowupResult {
  const full = withMirror(data, changes);
  return { changes: full, undo: undoFor(data, full) };
}

const empty: FollowupResult = { changes: {}, undo: {} };

// ------------------------------------------------------------------ ações

/**
 * Marca como enviado (manual). `sentAt` permite registrar um envio esquecido
 * em data/hora anterior. Atualiza o "último contato" do lead.
 */
export function markSent(data: Pick<Dataset, "followups" | "leads">, id: string, sentAt: string = nowISO(), observacao?: string | null): FollowupResult {
  const f = data.followups.find((x) => x.id === id);
  if (!f || f.deleted_at) return empty;
  const changes: FollowupChanges = {
    followups: [{
      ...f, enviado_em: sentAt, enviado_manual: true, dispensado_em: null, motivo_dispensa: null,
      observacao: observacao === undefined ? f.observacao : observacao, updated_at: nowISO(),
    }],
  };
  const lead = f.lead_id ? data.leads.find((l) => l.id === f.lead_id) : undefined;
  if (lead) {
    const sentDay = dateInSaoPaulo(sentAt);
    const last = lead.last_contact_at && lead.last_contact_at > sentDay ? lead.last_contact_at : sentDay;
    changes.leads = [{ ...lead, last_contact_at: last, updated_at: nowISO() }];
  }
  return result(data, changes);
}

/** Volta um follow-up enviado ou dispensado para "em aberto" (correção de engano). */
export function reopen(data: Pick<Dataset, "followups" | "leads">, id: string): FollowupResult {
  const f = data.followups.find((x) => x.id === id);
  if (!f) return empty;
  return result(data, {
    followups: [{ ...f, enviado_em: null, enviado_manual: false, dispensado_em: null, motivo_dispensa: null, updated_at: nowISO() }],
  });
}

export function setObservation(data: Pick<Dataset, "followups" | "leads">, id: string, observacao: string | null): FollowupResult {
  const f = data.followups.find((x) => x.id === id);
  if (!f) return empty;
  return result(data, { followups: [{ ...f, observacao: observacao?.trim() || null, updated_at: nowISO() }] });
}

/** Adia para uma nova data (reabre se estava dispensado). */
export function postpone(data: Pick<Dataset, "followups" | "leads">, id: string, date: ISODate): FollowupResult {
  const f = data.followups.find((x) => x.id === id);
  if (!f || f.enviado_em) return empty;
  return result(data, {
    followups: [{ ...f, data_prevista: date, dispensado_em: null, motivo_dispensa: null, updated_at: nowISO() }],
  });
}

export function dismiss(data: Pick<Dataset, "followups" | "leads">, id: string, reason: string | null, at: string = nowISO()): FollowupResult {
  const f = data.followups.find((x) => x.id === id);
  if (!f || f.enviado_em) return empty;
  return result(data, { followups: [{ ...f, dispensado_em: at, motivo_dispensa: reason?.trim() || null, updated_at: nowISO() }] });
}

export function remove(data: Pick<Dataset, "followups" | "leads">, id: string): FollowupResult {
  const f = data.followups.find((x) => x.id === id);
  if (!f) return empty;
  const now = nowISO();
  return result(data, { followups: [{ ...f, deleted_at: now, updated_at: now }] });
}

/** Cria um follow-up avulso (ou retomada) para um lead. */
export function schedule(
  data: Pick<Dataset, "followups" | "leads">,
  p: Pick<Followup, "tipo" | "data_prevista"> & Partial<Pick<Followup, "canal" | "lead_id" | "sale_id" | "observacao">>,
): FollowupResult {
  const lead = p.lead_id ? data.leads.find((l) => l.id === p.lead_id) : undefined;
  const f = newFollowup({ ...p, canal: p.canal ?? channelFromOrigin(lead?.origin) });
  return result(data, { followups: [f] });
}

/** Retomada em N dias corridos a partir de hoje. */
export function scheduleRetake(data: Pick<Dataset, "followups" | "leads">, leadId: string, days: number, today: ISODate): FollowupResult {
  return schedule(data, { tipo: "retomada", lead_id: leadId, data_prevista: plusDays(today, days) });
}

/** Encerra sem retomada: lead vai para Perdido com o motivo; follow-ups abertos são dispensados. */
export function closeLead(data: Pick<Dataset, "followups" | "leads">, leadId: string, reason: string, today: ISODate): FollowupResult {
  const lead = data.leads.find((l) => l.id === leadId);
  if (!lead) return empty;
  const now = nowISO();
  const followups = data.followups
    .filter((f) => f.lead_id === leadId && isOpen(f))
    .map((f) => ({ ...f, dispensado_em: now, motivo_dispensa: "Lead encerrado", updated_at: now }));
  return result(data, {
    followups,
    leads: [{
      ...lead, stage: "perdido", lost_reason: reason,
      stage_dates: { ...lead.stage_dates, perdido: lead.stage_dates.perdido ?? today }, updated_at: now,
    }],
  });
}

// ------------------------------------------------------------------ cadência

/**
 * Ao entrar em "Rascunho enviado" ou "Proposta/valor enviado": cria o
 * follow-up de 2 dias úteis, se o lead ainda não tiver um (no máximo um por lead).
 */
export function cadenceFollowup(
  followups: Followup[], lead: Pick<Lead, "id" | "stage" | "origin">, today: ISODate,
  settings: Pick<Settings, "followup_business_days">,
): Followup | null {
  if (!CADENCE_STAGES.includes(lead.stage)) return null;
  if (followups.some((f) => f.lead_id === lead.id && f.tipo === "followup_2du" && !f.deleted_at)) return null;
  return newFollowup({
    tipo: "followup_2du", lead_id: lead.id, canal: channelFromOrigin(lead.origin),
    data_prevista: addBusinessDays(today, settings.followup_business_days || DEFAULT_BUSINESS_DAYS),
  });
}

/**
 * Pós-venda: com "publicado em" preenchido, follow-up de oferta de manutenção
 * no 30º dia (mesma data do fim dos ajustes). Se a publicação mudar e ele ainda
 * estiver em aberto, a data acompanha. Venda cancelada dispensa o que estiver aberto.
 */
export function postSaleFollowups(followups: Followup[], sale: Sale, leads: Lead[]): Followup[] {
  const mine = followups.filter((f) => f.sale_id === sale.id && f.tipo === "pos_venda" && !f.deleted_at);
  const now = nowISO();
  if (sale.status === "cancelada" || sale.deleted_at) {
    return mine.filter(isOpen).map((f) => ({ ...f, dispensado_em: now, motivo_dispensa: "Venda cancelada", updated_at: now }));
  }
  const date = adjustmentsEnd(sale.published_at);
  if (!date) return [];
  if (mine.length === 0) {
    const lead = sale.lead_id ? leads.find((l) => l.id === sale.lead_id) : undefined;
    return [newFollowup({
      tipo: "pos_venda", sale_id: sale.id, lead_id: lead ? lead.id : null,
      canal: lead ? channelFromOrigin(lead.origin) : sale.contact ? "whatsapp" : channelFromOrigin(sale.lead_origin),
      data_prevista: date,
    })];
  }
  return mine.filter((f) => isOpen(f) && f.data_prevista !== date).map((f) => ({ ...f, data_prevista: date, updated_at: now }));
}

// ------------------------------------------------------------------ migração

/**
 * Migração dos dados antigos: cada lead com "próximo follow-up" preenchido
 * ganha um follow-up de 2 dias úteis em aberto naquela data. Idempotente: não
 * duplica se já existir um follow-up do lead nessa data. Nada é apagado.
 */
export function migrateLeadsToFollowups(leads: Lead[], existing: Followup[]): Followup[] {
  const out: Followup[] = [];
  for (const l of leads) {
    if (!l.next_followup_at) continue;
    if ([...existing, ...out].some((f) => f.lead_id === l.id && f.data_prevista === l.next_followup_at)) continue;
    out.push(newFollowup({
      tipo: "followup_2du", lead_id: l.id, canal: channelFromOrigin(l.origin), data_prevista: l.next_followup_at,
      created_at: l.updated_at || nowISO(), deleted_at: l.deleted_at,
    }));
  }
  return out;
}

// ------------------------------------------------------------------ mensagem

export function messageFor(settings: Pick<Settings, "followup_templates">, tipo: FollowupTipo, nome: string): string {
  const tpl = settings.followup_templates?.[tipo]?.trim() || DEFAULT_TEMPLATES[tipo];
  return tpl.replace(/\{nome\}/g, nome.trim());
}

/** Nome e segmento a mostrar (lead ou, no pós-venda sem lead, o cliente da venda). */
export function followupSubject(data: Pick<Dataset, "leads" | "sales">, f: Followup): { name: string; segment: Lead["segment"] | null } {
  const lead = f.lead_id ? data.leads.find((l) => l.id === f.lead_id) : undefined;
  if (lead) return { name: lead.name, segment: lead.segment };
  const sale = f.sale_id ? data.sales.find((s) => s.id === f.sale_id) : undefined;
  return { name: sale?.client ?? "Sem nome", segment: sale?.segment ?? null };
}

/** Data usada para ordenar/mostrar: envio (se enviado) ou prevista. */
export function followupDate(f: Followup): ISODate {
  return f.enviado_em ? dateInSaoPaulo(f.enviado_em) : f.data_prevista;
}

