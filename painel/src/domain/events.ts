import { costDueDate } from "./calc";
import { money, monthKey, plusDays, shiftMonth } from "./format";
import { followupDate, followupStatus, followupSubject } from "./followups";
import { FOLLOWUP_CANAIS, FOLLOWUP_TIPOS_CURTO } from "./labels";
import type { Dataset, FollowupStatus, FollowupTipo, ISODate } from "./types";

export type EventKind = "recebimento" | "ajustes" | "dominio" | "followup" | "custo";

export const EVENT_LABELS: Record<EventKind, string> = {
  recebimento: "Recebimentos",
  ajustes: "Fim dos ajustes",
  dominio: "Domínios",
  followup: "Follow-ups",
  custo: "Custos",
};

export interface CalEvent {
  id: string;
  date: ISODate;
  kind: EventKind;
  title: string;
  detail?: string;
  done?: boolean;
  late?: boolean;
  /** Só follow-ups: situação calculada e tipo. */
  followup?: { status: FollowupStatus; tipo: FollowupTipo };
  target: { type: "sale" | "lead" | "cost" | "followup"; id: string };
}

/** Eventos gerados a partir dos dados, entre duas datas (inclusive). */
export function buildEvents(data: Dataset, from: ISODate, to: ISODate, today: ISODate): CalEvent[] {
  const out: CalEvent[] = [];
  const inRange = (d: ISODate | null | undefined): d is ISODate => !!d && d >= from && d <= to;
  const sales = new Map(data.sales.filter((s) => !s.deleted_at).map((s) => [s.id, s]));

  for (const i of data.installments) {
    const s = sales.get(i.sale_id);
    if (!s || i.deleted_at || i.status === "cancelada" || s.status === "cancelada") continue;
    const date = i.received_at ?? i.due_date;
    if (!inRange(date)) continue;
    const total = data.installments.filter((x) => x.sale_id === s.id && !x.deleted_at).length;
    out.push({
      id: `i-${i.id}`, date, kind: "recebimento",
      title: s.client,
      detail: `${money(i.gross_amount)} · parcela ${i.number}${s.package === "mensal" ? "" : `/${total}`}${i.received_at ? " · recebida" : ""}`,
      done: !!i.received_at,
      late: !i.received_at && i.due_date < today,
      target: { type: "sale", id: s.id },
    });
  }

  for (const s of sales.values()) {
    if (s.status === "cancelada") continue;
    if (inRange(s.adjustments_end)) {
      out.push({ id: `a-${s.id}`, date: s.adjustments_end, kind: "ajustes", title: s.client, detail: "Fim dos 30 dias de ajustes", target: { type: "sale", id: s.id } });
    }
    if (inRange(s.domain_expires_at)) {
      out.push({ id: `d-${s.id}`, date: s.domain_expires_at, kind: "dominio", title: s.client, detail: `Renovação do domínio${s.domain ? ` ${s.domain}` : ""}`, target: { type: "sale", id: s.id } });
    }
  }

  // Follow-ups: pendentes/atrasados na data prevista, enviados na data do envio.
  for (const f of data.followups ?? []) {
    if (f.deleted_at || f.dispensado_em) continue;
    const date = followupDate(f);
    if (!inRange(date)) continue;
    const status = followupStatus(f, today);
    out.push({
      id: `f-${f.id}`, date, kind: "followup", title: followupSubject(data, f).name,
      detail: `${FOLLOWUP_TIPOS_CURTO[f.tipo]} · ${FOLLOWUP_CANAIS[f.canal]}${status === "enviado" ? " · enviado" : ""}`,
      done: status === "enviado", late: status === "atrasado",
      followup: { status, tipo: f.tipo },
      target: { type: "followup", id: f.id },
    });
  }

  for (let key = monthKey(from); key <= monthKey(to); key = shiftMonth(key, 1)) {
    for (const c of data.costs) {
      const d = costDueDate(c, key);
      if (inRange(d)) {
        out.push({ id: `c-${c.id}-${key}`, date: d, kind: "custo", title: c.description, detail: money(c.amount), target: { type: "cost", id: c.id } });
      }
    }
  }

  const order: EventKind[] = ["recebimento", "followup", "ajustes", "dominio", "custo"];
  return out.sort((a, b) => a.date.localeCompare(b.date) || order.indexOf(a.kind) - order.indexOf(b.kind));
}

export function nextDays(data: Dataset, today: ISODate, days = 7): CalEvent[] {
  return buildEvents(data, today, plusDays(today, days), today).filter((e) => !e.done);
}

/** Arquivo .ics com eventos de dia inteiro. */
export function toICS(events: CalEvent[]): string {
  const esc = (s: string) => s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
  const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d+Z$/, "Z");
  const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Lumivo Web//Painel//PT-BR", "CALSCALE:GREGORIAN", "X-WR-TIMEZONE:America/Sao_Paulo"];
  for (const e of events) {
    const d = e.date.replace(/-/g, "");
    const end = plusDays(e.date, 1).replace(/-/g, "");
    lines.push(
      "BEGIN:VEVENT",
      `UID:${e.id}@painel.lumivo`,
      `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${d}`,
      `DTEND;VALUE=DATE:${end}`,
      `SUMMARY:${esc(`${EVENT_LABELS[e.kind]}: ${e.title}`)}`,
      ...(e.detail ? [`DESCRIPTION:${esc(e.detail)}`] : []),
      "END:VEVENT",
    );
  }
  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}
