import { dateBR, daysBetween, weekdayShort } from "../domain/format";
import { EVENT_LABELS, type CalEvent, type EventKind } from "../domain/events";
import { FOLLOWUP_STATUS } from "../domain/labels";
import { href } from "../data/router";
import { useFollowupActions } from "./followups";
import { cx } from "./kit";

/** Cores por tipo (verde, âmbar, vermelho suave...) sempre com texto junto. */
export const KIND_STYLE: Record<EventKind, { dot: string; chip: string }> = {
  recebimento: { dot: "bg-accent", chip: "bg-accent-soft text-accent-strong" },
  ajustes: { dot: "bg-[#c48a12]", chip: "bg-warn-soft text-warn" },
  dominio: { dot: "bg-[#d4705e]", chip: "bg-danger-soft text-danger" },
  followup: { dot: "bg-fu", chip: "bg-fu-soft text-fu" },
  custo: { dot: "bg-chart-out", chip: "bg-surface-2 text-ink-2" },
};

/** Follow-up: pendente azul-petróleo, atrasado vermelho suave, enviado cinza. */
export function eventChip(e: CalEvent): string {
  if (e.kind === "followup" && e.followup) {
    if (e.followup.status === "atrasado") return "bg-danger-soft text-danger";
    if (e.followup.status === "enviado") return "bg-surface-2 text-ink-3";
  }
  return KIND_STYLE[e.kind].chip;
}

export const KIND_SHORT: Record<EventKind, string> = {
  recebimento: "Recebimento",
  ajustes: "Ajustes",
  dominio: "Domínio",
  followup: "Follow-up",
  custo: "Custo",
};

/** Rótulo curto do evento (follow-up mostra o status em texto, nunca só a cor). */
export function eventLabel(e: CalEvent): string {
  if (e.kind === "followup" && e.followup) return `Follow-up ${FOLLOWUP_STATUS[e.followup.status].toLowerCase()}`;
  return KIND_SHORT[e.kind];
}

export function eventHref(e: CalEvent): string {
  if (e.target.type === "sale") return href(`/vendas/${e.target.id}`);
  if (e.target.type === "lead") return href(`/funil?id=${e.target.id}`);
  if (e.target.type === "followup") return href(`/followups`);
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
  const actions = useFollowupActions();
  return (
    <ul className="divide-y divide-line">
      {events.map((e) => {
        const isFu = e.target.type === "followup";
        const openFu = isFu && e.followup && e.followup.status !== "enviado";
        const body = (
          <>
            {showDate && (
              <span className={cx("num w-[68px] shrink-0 text-[13px] capitalize", e.late ? "font-semibold text-danger" : "text-ink-3")}>
                {e.late ? "Atrasado" : relative(e.date, today)}
              </span>
            )}
            <span className={cx("shrink-0 rounded px-1.5 py-0.5 text-[11.5px] font-medium", eventChip(e))} title={EVENT_LABELS[e.kind]}>
              {isFu ? "Follow-up" : KIND_SHORT[e.kind]}
            </span>
            <span className="min-w-0 flex-1 text-left">
              <span className="block truncate text-[14.5px] font-medium group-hover:underline">{e.title}</span>
              {e.detail && <span className="num block truncate text-[13px] text-ink-3">{e.detail}</span>}
            </span>
          </>
        );
        return (
          <li key={e.id} className={cx(isFu && "flex flex-wrap items-center gap-x-3")}>
            {isFu ? (
              <button type="button" onClick={() => actions.open(e.target.id)} className="group flex min-h-12 min-w-0 flex-1 basis-56 items-center gap-3 py-2 text-ink">
                {body}
              </button>
            ) : (
              <a href={eventHref(e)} className="group flex min-h-12 items-center gap-3 py-2 text-ink no-underline">{body}</a>
            )}
            {openFu && (
              <button
                type="button"
                onClick={() => actions.markSent(e.target.id)}
                aria-label={`Marcar follow-up de ${e.title} como enviado`}
                className="mb-2 inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-accent px-3 text-[14px] font-semibold text-accent-ink hover:bg-accent-strong sm:mb-0 sm:w-auto"
              >
                Marcar como enviado
              </button>
            )}
          </li>
        );
      })}
    </ul>
  );
}
