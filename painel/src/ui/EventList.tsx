import { dateBR, daysBetween, weekdayShort } from "../domain/format";
import { EVENT_LABELS, type CalEvent, type EventKind } from "../domain/events";
import { href } from "../data/router";
import { cx } from "./kit";

/** Cores por tipo (verde, âmbar, vermelho suave...) sempre com texto junto. */
export const KIND_STYLE: Record<EventKind, { dot: string; chip: string }> = {
  recebimento: { dot: "bg-accent", chip: "bg-accent-soft text-accent-strong" },
  ajustes: { dot: "bg-[#c48a12]", chip: "bg-warn-soft text-warn" },
  dominio: { dot: "bg-[#d4705e]", chip: "bg-danger-soft text-danger" },
  followup: { dot: "bg-ink-2", chip: "bg-surface-2 text-ink-2" },
  custo: { dot: "bg-chart-out", chip: "bg-surface-2 text-ink-2" },
};

export const KIND_SHORT: Record<EventKind, string> = {
  recebimento: "Recebimento",
  ajustes: "Ajustes",
  dominio: "Domínio",
  followup: "Follow-up",
  custo: "Custo",
};

export function eventHref(e: CalEvent): string {
  if (e.target.type === "sale") return href(`/vendas/${e.target.id}`);
  if (e.target.type === "lead") return href(`/funil?id=${e.target.id}`);
  return href(`/custos?id=${e.target.id}`);
}

function relative(date: string, today: string): string {
  const d = daysBetween(today, date);
  if (d === 0) return "Hoje";
  if (d === 1) return "Amanhã";
  if (d === -1) return "Ontem";
  return `${weekdayShort(date)} ${dateBR(date).slice(0, 5)}`;
}

export function EventList({ events, today, showDate = true }: { events: CalEvent[]; today: string; showDate?: boolean }) {
  return (
    <ul className="divide-y divide-line">
      {events.map((e) => (
        <li key={e.id}>
          <a href={eventHref(e)} className="group flex min-h-12 items-center gap-3 py-2 text-ink no-underline">
            {showDate && (
              <span className={cx("num w-[68px] shrink-0 text-[13px] capitalize", e.late ? "font-semibold text-danger" : "text-ink-3")}>
                {e.late ? "Atrasado" : relative(e.date, today)}
              </span>
            )}
            <span className={cx("shrink-0 rounded px-1.5 py-0.5 text-[11.5px] font-medium", KIND_STYLE[e.kind].chip)} title={EVENT_LABELS[e.kind]}>
              {KIND_SHORT[e.kind]}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[14.5px] font-medium group-hover:underline">{e.title}</span>
              {e.detail && <span className="num block truncate text-[13px] text-ink-3">{e.detail}</span>}
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
