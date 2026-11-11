import { useMemo, useState } from "react";
import { EVENT_LABELS, buildEvents, toICS, type CalEvent, type EventKind } from "../domain/events";
import { monthKey, monthLabel, plusDays, plusMonths, shiftMonth, toDate, toISO } from "../domain/format";
import { download } from "../domain/csv";
import { useStore } from "../data/store";
import { EventList, KIND_SHORT, KIND_STYLE, eventHref } from "../ui/EventList";
import { Button, Empty, PageHeader, Segmented, cx } from "../ui/kit";

const KINDS: EventKind[] = ["recebimento", "ajustes", "dominio", "followup", "custo"];
const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export function Calendar() {
  const { data, today } = useStore();
  const [month, setMonth] = useState(monthKey(today));
  const [view, setView] = useState<"mes" | "agenda">(() => (window.matchMedia("(min-width: 768px)").matches ? "mes" : "agenda"));
  const [kinds, setKinds] = useState<Set<EventKind>>(new Set(KINDS));

  const first = `${month}-01`;
  const last = plusDays(plusMonths(first, 1), -1);
  const gridStart = plusDays(first, -toDate(first).getDay());
  const gridEnd = plusDays(last, 6 - toDate(last).getDay());

  const events = useMemo(
    () => buildEvents(data, gridStart, gridEnd, today).filter((e) => kinds.has(e.kind)),
    [data, gridStart, gridEnd, today, kinds],
  );
  const byDay = useMemo(() => {
    const m = new Map<string, CalEvent[]>();
    for (const e of events) m.set(e.date, [...(m.get(e.date) ?? []), e]);
    return m;
  }, [events]);

  const days: string[] = [];
  for (let d = gridStart; d <= gridEnd; d = plusDays(d, 1)) days.push(d);

  function exportICS() {
    const future = buildEvents(data, today, toISO(new Date(toDate(today).getFullYear() + 1, toDate(today).getMonth(), toDate(today).getDate())), today)
      .filter((e) => kinds.has(e.kind) && !e.done);
    download(`lumivo-agenda-${today}.ics`, toICS(future), "text/calendar;charset=utf-8");
  }

  const monthEvents = events.filter((e) => e.date >= first && e.date <= last);

  return (
    <div>
      <PageHeader title="Calendário">
        <Segmented label="Visualização" value={view} onChange={setView} options={[["mes", "Mês"], ["agenda", "Lista"]]} />
        <Button size="sm" variant="ghost" onClick={exportICS}>Exportar .ics</Button>
      </PageHeader>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1">
          <button type="button" aria-label="Mês anterior" onClick={() => setMonth(shiftMonth(month, -1))} className="min-h-11 min-w-11 rounded-lg text-ink-2 hover:bg-surface-2">‹</button>
          <h2 className="min-w-[10rem] text-center text-[17px] font-semibold" aria-live="polite">{monthLabel(month)}</h2>
          <button type="button" aria-label="Próximo mês" onClick={() => setMonth(shiftMonth(month, 1))} className="min-h-11 min-w-11 rounded-lg text-ink-2 hover:bg-surface-2">›</button>
          {month !== monthKey(today) && <button type="button" onClick={() => setMonth(monthKey(today))} className="min-h-11 px-2 text-[14px] text-accent underline underline-offset-2">Hoje</button>}
        </div>
        <fieldset className="flex flex-wrap gap-1.5">
          <legend className="sr-only">Tipos de evento</legend>
          {KINDS.map((k) => {
            const on = kinds.has(k);
            return (
              <label key={k} className={cx(
                "inline-flex min-h-9 cursor-pointer items-center gap-1.5 rounded-full border px-2.5 text-[13px]",
                on ? "border-line-strong bg-surface text-ink" : "border-line text-ink-3 line-through",
                "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-[var(--focus)]",
              )}>
                <input type="checkbox" className="sr-only" checked={on} onChange={() => setKinds((s) => {
                  const n = new Set(s);
                  if (n.has(k)) n.delete(k); else n.add(k);
                  return n;
                })} />
                <span aria-hidden="true" className={cx("h-2 w-2 rounded-full", KIND_STYLE[k].dot)} />
                {EVENT_LABELS[k]}
              </label>
            );
          })}
        </fieldset>
      </div>

      {view === "agenda" ? (
        monthEvents.length ? <EventList events={monthEvents} today={today} /> : <Empty>Nenhum evento neste mês.</Empty>
      ) : (
        <div className="scroll-x">
          <div className="grid min-w-[680px] grid-cols-7 gap-px overflow-hidden rounded-lg border border-line bg-line" role="grid" aria-label={`Calendário de ${monthLabel(month)}`}>
            {WEEKDAYS.map((w) => <div key={w} role="columnheader" className="bg-surface-2 px-2 py-1.5 text-[12px] font-medium text-ink-3">{w}</div>)}
            {days.map((d) => {
              const evs = byDay.get(d) ?? [];
              const inMonth = d >= first && d <= last;
              return (
                <div key={d} role="gridcell" className={cx("min-h-[104px] bg-surface p-1.5", !inMonth && "bg-bg")}>
                  <p className={cx("num mb-1 inline-flex h-6 min-w-6 items-center justify-center rounded-full px-1 text-[12.5px]",
                    d === today ? "bg-ink font-semibold text-bg" : inMonth ? "text-ink-2" : "text-ink-3/60")}>
                    {Number(d.slice(8))}
                  </p>
                  <ul className="flex flex-col gap-0.5">
                    {evs.slice(0, 4).map((e) => (
                      <li key={e.id}>
                        <a href={eventHref(e)} title={`${KIND_SHORT[e.kind]}: ${e.title}${e.detail ? ` · ${e.detail}` : ""}`}
                          className={cx("block truncate rounded px-1.5 py-0.5 text-[12px] no-underline hover:brightness-95", KIND_STYLE[e.kind].chip, e.done && "opacity-60", e.late && "ring-1 ring-inset ring-danger")}>
                          <span className="sr-only">{KIND_SHORT[e.kind]}: </span>{e.title}
                        </a>
                      </li>
                    ))}
                    {evs.length > 4 && <li className="px-1.5 text-[12px] text-ink-3">+{evs.length - 4}</li>}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      )}
      <p className="mt-3 text-[12.5px] text-ink-3">
        Verde: recebimentos · Âmbar: fim dos 30 dias de ajustes · Vermelho suave: vencimento de domínio · Contorno vermelho: atrasado.
      </p>
    </div>
  );
}
