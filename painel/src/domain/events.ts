import { costDueDate } from "./calc";
import { money, monthKey, plusDays, shiftMonth } from "./format";
import type { Dataset, ISODate } from "./types";

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
  target: { type: "sale" | "lead" | "cost"; id: string };
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

  for (const l of data.leads) {
    if (l.deleted_at || l.stage === "fechado" || l.stage === "perdido") continue;
    if (inRange(l.next_followup_at)) {
      out.push({
        id: `f-${l.id}`, date: l.next_followup_at, kind: "followup", title: l.name, detail: "Follow-up",
        late: l.next_followup_at < today, target: { type: "lead", id: l.id },
      });
    }
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
