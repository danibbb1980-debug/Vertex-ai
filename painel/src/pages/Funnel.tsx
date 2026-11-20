import { endOfWeek, startOfWeek } from "date-fns";
import { useEffect, useMemo, useState, type DragEvent } from "react";
import { dateBR, money, monthKey, percent, toDate, toISO } from "../domain/format";
import {
  dateInSaoPaulo, followupDate, followupStatus, isWeekend, leadFollowupStatus, nextMonday, schedule,
} from "../domain/followups";
import {
  FOLLOWUP_CANAIS, FOLLOWUP_STATUS, FOLLOWUP_TIPOS, FOLLOWUP_TIPOS_CURTO, ORIGINS, SEGMENTS, STAGES, STAGE_ORDER, entries,
} from "../domain/labels";
import { moveLead, restore, softDelete, uid, withCadence, type Changes } from "../domain/service";
import type { FollowupCanal, FollowupTipo, Lead, LeadStage } from "../domain/types";
import { FollowupRow, STATUS_TONE, useFollowupActions } from "../ui/followups";
import { groupFollowups } from "./Followups";
import { navigate } from "../data/router";
import { alive, useStore } from "../data/store";
import {
  Button, DateField, Dialog, Empty, Field, MoneyField, PageHeader, Pill, SelectField, TextArea, TextField, cx, useConfirm,
} from "../ui/kit";

/** Desfazer de mudanças que criaram linhas novas: as novas são excluídas, as antigas voltam. */
function undoOf(before: { leads: Lead[] }, changes: Changes): Changes {
  const leadsBefore = new Map(before.leads.map((l) => [l.id, l]));
  return {
    leads: (changes.leads ?? []).map((l) => leadsBefore.get(l.id) ? restore(leadsBefore.get(l.id)!) : softDelete(l)),
    followups: (changes.followups ?? []).map((f) => softDelete(f)),
  };
}

const ALL_STAGES: LeadStage[] = [...STAGE_ORDER, "perdido"];
const COUNTERS: [LeadStage, string][] = [
  ["contatado", "Contatos"], ["respondeu", "Respostas"], ["rascunho", "Rascunhos enviados"],
  ["proposta", "Valores enviados"], ["fechado", "Fechamentos"],
];

function blank(today: string): Lead {
  const now = new Date().toISOString();
  return {
    id: uid(), name: "", segment: "outro", origin: "instagram", stage: "contatado", stage_dates: { contatado: today },
    offered_amount: null, last_contact_at: today, next_followup_at: null, lost_reason: null, notes: null, sale_id: null,
    created_at: now, updated_at: now, deleted_at: null,
  };
}

/** Lead "chegou" a um estágio se tem a data dele ou de qualquer estágio depois. */
function reached(lead: Lead, stage: LeadStage): boolean {
  const idx = STAGE_ORDER.indexOf(stage);
  return STAGE_ORDER.slice(idx).some((s) => lead.stage_dates[s]) || STAGE_ORDER.indexOf(lead.stage) >= idx;
}

export function Funnel({ focus }: { focus: string | null }) {
  const { data, today, commit } = useStore();
  const [ask, confirmNode] = useConfirm();
  const [editing, setEditing] = useState<Lead | null>(null);
  const [closed, setClosed] = useState<Lead | null>(null);
  const [dragOver, setDragOver] = useState<LeadStage | null>(null);
  const leads = alive(data.leads);

  useEffect(() => {
    if (focus) {
      const l = data.leads.find((x) => x.id === focus);
      if (l) setEditing(l);
    }
  }, [focus, data.leads]);

  const weekStart = toISO(startOfWeek(toDate(today), { weekStartsOn: 1 }));
  const weekEnd = toISO(endOfWeek(toDate(today), { weekStartsOn: 1 }));
  const month = monthKey(today);

  const counts = useMemo(() => COUNTERS.map(([stage, label]) => {
    const dates = leads.map((l) => l.stage_dates[stage]).filter((d): d is string => !!d);
    return {
      stage, label,
      week: dates.filter((d) => d >= weekStart && d <= weekEnd).length,
      month: dates.filter((d) => monthKey(d) === month).length,
      sent: stage === "proposta"
        ? leads.filter((l) => l.stage_dates.proposta && monthKey(l.stage_dates.proposta) === month).reduce((a, l) => a + (l.offered_amount ?? 0), 0)
        : 0,
    };
  }), [leads, weekStart, weekEnd, month]);
  const sentDays = useMemo(
    () => data.followups.filter((f) => !f.deleted_at && f.enviado_em).map((f) => dateInSaoPaulo(f.enviado_em!)),
    [data.followups],
  );
  const sentCount = {
    week: sentDays.filter((d) => d >= weekStart && d <= weekEnd).length,
    month: sentDays.filter((d) => monthKey(d) === month).length,
  };

  const conversions = STAGE_ORDER.slice(1).map((stage, i) => {
    const from = STAGE_ORDER[i];
    const a = leads.filter((l) => reached(l, from)).length;
    const b = leads.filter((l) => reached(l, stage)).length;
    return { from, stage, rate: a ? b / a : null };
  });

  const fuGroups = useMemo(() => groupFollowups(data.followups, today), [data.followups, today]);
  const dueNow = [...fuGroups.atrasados, ...fuGroups.hoje];

  function cadenceNote(changes: Changes): string {
    const f = changes.followups?.[0];
    return f ? ` Follow-up agendado para ${dateBR(f.data_prevista)}.` : "";
  }

  async function move(lead: Lead, stage: LeadStage) {
    const changes = moveLead(data, lead.id, stage, today);
    if (!changes.leads) return;
    await commit(changes, { message: `${lead.name}: ${STAGES[stage]}.${cadenceNote(changes)}`, undo: undoOf({ leads: [lead] }, changes) });
    if (stage === "fechado" && !lead.sale_id) setClosed(changes.leads[0]);
  }

  async function save(l: Lead) {
    const before = data.leads.find((x) => x.id === l.id);
    // "Próximo follow-up" é espelho calculado: nunca vem do formulário.
    // O último contato pode ter mudado enquanto o formulário estava aberto (follow-up marcado): fica o mais recente.
    const lastContact = [l.last_contact_at, before?.last_contact_at].filter(Boolean).sort().at(-1) ?? null;
    const lead = {
      ...l, name: l.name.trim(), next_followup_at: before?.next_followup_at ?? null, last_contact_at: lastContact,
      updated_at: new Date().toISOString(),
    };
    if (before && before.stage !== l.stage) {
      lead.stage_dates = { ...lead.stage_dates, [l.stage]: lead.stage_dates[l.stage] ?? today };
    }
    const changes = !before || before.stage !== l.stage ? withCadence(data, lead, today) : { leads: [lead] };
    await commit(changes, { message: `Lead salvo.${cadenceNote(changes)}` });
    setEditing(null);
    if (l.stage === "fechado" && before?.stage !== "fechado" && !l.sale_id) setClosed(lead);
  }

  async function remove(l: Lead) {
    const ok = await ask({ title: `Excluir ${l.name}?`, body: "O lead sai do funil. Dá para desfazer logo em seguida.", confirm: "Excluir", danger: true });
    if (!ok) return;
    setEditing(null);
    await commit({ leads: [softDelete(l)] }, { message: "Lead excluído.", undo: { leads: [restore(l)] } });
  }

  function onDrop(e: DragEvent, stage: LeadStage) {
    e.preventDefault();
    setDragOver(null);
    const lead = leads.find((l) => l.id === e.dataTransfer.getData("text/plain"));
    if (lead) void move(lead, stage);
  }

  return (
    <div>
      {confirmNode}
      <PageHeader title="Funil">
        <Button variant="primary" onClick={() => setEditing(blank(today))}>Novo lead</Button>
      </PageHeader>

      {/* Contadores */}
      <div className="scroll-x mb-6">
        <table className="w-full min-w-[620px] text-[14px]">
          <thead>
            <tr className="border-b border-line-strong text-left text-[13px] text-ink-3">
              <th scope="col" className="py-2 pr-3 font-medium"><span className="sr-only">Período</span></th>
              {counts.map((c) => <th key={c.stage} scope="col" className="py-2 pr-3 text-right font-medium">{c.label}</th>)}
              <th scope="col" className="py-2 pr-3 text-right font-medium">Follow-ups enviados</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-line">
              <th scope="row" className="py-2 pr-3 text-left font-normal text-ink-2">Esta semana</th>
              {counts.map((c) => <td key={c.stage} className="num py-2 pr-3 text-right text-[16px] font-semibold">{c.week}</td>)}
              <td className="num py-2 pr-3 text-right text-[16px] font-semibold">{sentCount.week}</td>
            </tr>
            <tr className="border-b border-line">
              <th scope="row" className="py-2 pr-3 text-left font-normal text-ink-2">Este mês</th>
              {counts.map((c) => (
                <td key={c.stage} className="num py-2 pr-3 text-right">
                  <span className="text-[16px] font-semibold">{c.month}</span>
                  {c.stage === "proposta" && c.sent > 0 && <span className="block text-[12px] text-ink-3">{money(c.sent)}</span>}
                </td>
              ))}
              <td className="num py-2 pr-3 text-right text-[16px] font-semibold">{sentCount.month}</td>
            </tr>
          </tbody>
        </table>
        <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-ink-3">
          <span className="font-medium text-ink-2">Conversão:</span>
          {conversions.map((c) => (
            <span key={c.stage} className="num">{STAGES[c.from].split(" ")[0]} → {STAGES[c.stage].split("/")[0].split(" ")[0]} {c.rate == null ? "—" : percent(c.rate * 100)}</span>
          ))}
        </p>
      </div>

      {/* Follow-ups de hoje */}
      <section className="mb-8 border-t border-line pt-4" aria-labelledby="fu">
        <div className="mb-1 flex items-center justify-between gap-3">
          <h2 id="fu" className="eyebrow">Follow-ups de hoje {fuGroups.atrasados.length > 0 && <span className="text-danger">· {fuGroups.atrasados.length} atrasados</span>}</h2>
          <a href="#/followups" className="text-[13px] text-accent underline underline-offset-2">Todos os follow-ups</a>
        </div>
        {dueNow.length ? (
          <ul className="divide-y divide-line">
            {dueNow.map((f) => <FollowupRow key={f.id} f={f} compact />)}
          </ul>
        ) : <Empty>Nenhum follow-up para hoje.</Empty>}
      </section>

      {/* Quadro */}
      <div className="scroll-x -mx-4 px-4 pb-2 sm:mx-0 sm:px-0">
        <div className="grid auto-cols-[minmax(232px,1fr)] grid-flow-col gap-3">
          {ALL_STAGES.map((stage) => {
            const col = leads.filter((l) => l.stage === stage).sort((a, b) => (a.next_followup_at ?? "9").localeCompare(b.next_followup_at ?? "9"));

            return (
              <section
                key={stage}
                aria-label={STAGES[stage]}
                onDragOver={(e) => { e.preventDefault(); setDragOver(stage); }}
                onDragLeave={() => setDragOver(null)}
                onDrop={(e) => onDrop(e, stage)}
                className={cx("flex min-h-40 flex-col rounded-xl border bg-surface-2/60 p-2", dragOver === stage ? "border-accent" : "border-line")}
              >
                <h3 className="flex items-center justify-between px-1 pb-2 text-[13.5px] font-semibold">
                  {STAGES[stage]} <span className="num font-normal text-ink-3">{col.length}</span>
                </h3>
                <ul className="flex flex-col gap-2">
                  {col.map((l) => (
                    <li key={l.id} draggable onDragStart={(e) => e.dataTransfer.setData("text/plain", l.id)}
                      className="rounded-lg border border-line bg-surface p-2.5">
                      <button type="button" onClick={() => setEditing(l)} className="block w-full text-left">
                        <span className="block truncate font-medium underline-offset-2 hover:underline">{l.name}</span>
                        <span className="block text-[12.5px] text-ink-3">
                          {SEGMENTS[l.segment]} · {ORIGINS[l.origin]}{l.offered_amount ? ` · ${money(l.offered_amount)}` : ""}
                        </span>
                      </button>
                      <LeadFollowupBadge lead={l} today={today} />
                      <label className="mt-2 block">
                        <span className="sr-only">Mover {l.name} para</span>
                        <select className="input !min-h-9 text-[13.5px]" value={l.stage} onChange={(e) => move(l, e.target.value as LeadStage)}>
                          {ALL_STAGES.map((s) => <option key={s} value={s}>{STAGES[s]}</option>)}
                        </select>
                      </label>
                      {stage === "fechado" && !l.sale_id && (
                        <Button size="sm" variant="ghost" className="mt-1 w-full" onClick={() => navigate(`/vendas/nova?lead=${l.id}`)}>Criar venda</Button>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      </div>

      {editing && (
        <LeadDialog key={editing.id} lead={editing} isNew={!data.leads.some((l) => l.id === editing.id)}
          onClose={() => { setEditing(null); if (focus) navigate("/funil"); }} onSave={save} onDelete={remove} />
      )}

      <Dialog open={!!closed} onClose={() => setClosed(null)} title="Lead fechado"
        footer={<>
          <Button onClick={() => setClosed(null)}>Depois</Button>
          <Button variant="primary" onClick={() => { const id = closed?.id; setClosed(null); navigate(`/vendas/nova?lead=${id}`); }}>Criar venda a partir deste lead</Button>
        </>}>
        <p className="text-[15px] text-ink-2">
          {closed?.name} fechou{closed?.offered_amount ? ` por ${money(closed.offered_amount)}` : ""}. Quer lançar a venda agora? Os dados do lead já vêm preenchidos.
        </p>
      </Dialog>
    </div>
  );
}

function LeadDialog({ lead, isNew, onClose, onSave, onDelete }: {
  lead: Lead; isNew: boolean; onClose: () => void; onSave: (l: Lead) => void; onDelete: (l: Lead) => void;
}) {
  const [l, setL] = useState(lead);
  const [error, setError] = useState<string | null>(null);
  const set = <K extends keyof Lead>(k: K, v: Lead[K]) => setL((x) => ({ ...x, [k]: v }));
  return (
    <Dialog open onClose={onClose} title={isNew ? "Novo lead" : l.name || "Lead"} wide
      footer={<>
        {!isNew && <Button variant="ghost" className="mr-auto" onClick={() => onDelete(lead)}>Excluir</Button>}
        <Button onClick={onClose}>Voltar</Button>
        <Button variant="primary" onClick={() => (l.name.trim() ? onSave(l) : setError("Informe o nome."))}>Salvar</Button>
      </>}>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField label="Nome" required className="sm:col-span-2" value={l.name} onChange={(e) => { setError(null); set("name", e.target.value); }} error={error ?? undefined} autoFocus={isNew} />
        <SelectField label="Segmento" value={l.segment} options={entries(SEGMENTS)} onChange={(v) => set("segment", v)} />
        <SelectField label="Origem" value={l.origin} options={entries(ORIGINS)} onChange={(v) => set("origin", v)} />
        <SelectField label="Estágio" value={l.stage} options={ALL_STAGES.map((s) => [s, STAGES[s]] as [LeadStage, string])} onChange={(v) => set("stage", v)} />
        <MoneyField label="Valor ofertado" value={l.offered_amount} onChange={(v) => set("offered_amount", v)} allowEmpty />
        <DateField label="Último contato" value={l.last_contact_at} onChange={(v) => set("last_contact_at", v)} />
        <Field label="Próximo follow-up" hint="Calculado a partir dos follow-ups abaixo.">
          <p className="num flex min-h-11 items-center text-[15px]">{lead.next_followup_at ? dateBR(lead.next_followup_at) : "Nenhum em aberto"}</p>
        </Field>
        {l.stage === "perdido" && (
          <TextField label="Motivo da perda" className="sm:col-span-2" value={l.lost_reason ?? ""} onChange={(e) => set("lost_reason", e.target.value || null)} />
        )}
        <TextArea label="Observação" className="sm:col-span-2" value={l.notes ?? ""} onChange={(e) => set("notes", e.target.value || null)} />
      </div>
      <LeadFollowups lead={lead} isNew={isNew} />
    </Dialog>
  );
}

/** Selo pequeno no card do lead: status do follow-up mais urgente, em texto e cor. */
function LeadFollowupBadge({ lead, today }: { lead: Lead; today: string }) {
  const { data } = useStore();
  const status = leadFollowupStatus(data.followups, lead.id, today);
  if (!status) return null;
  return (
    <p className="mt-1.5 flex flex-wrap items-center gap-1.5 text-[12.5px] text-ink-3">
      <Pill tone={STATUS_TONE[status]}>Follow-up {FOLLOWUP_STATUS[status].toLowerCase()}</Pill>
      {lead.next_followup_at && status !== "enviado" && <span className="num">{dateBR(lead.next_followup_at)}</span>}
    </p>
  );
}

/** Linha do tempo de follow-ups do lead + agendar um novo. */
function LeadFollowups({ lead, isNew }: { lead: Lead; isNew: boolean }) {
  const { data, today, commit } = useStore();
  const actions = useFollowupActions();
  const mine = data.followups
    .filter((f) => f.lead_id === lead.id && !f.deleted_at)
    .sort((a, b) => followupDate(b).localeCompare(followupDate(a)));
  const [tipo, setTipo] = useState<FollowupTipo>("outro");
  const [canal, setCanal] = useState<FollowupCanal>(lead.origin === "whatsapp" || lead.origin === "instagram" ? lead.origin : "whatsapp");
  const [date, setDate] = useState<string | null>(null);

  async function add() {
    if (!date) return;
    const r = schedule(data, { tipo, canal, lead_id: lead.id, data_prevista: date });
    if (await commit(r.changes, { message: `Follow-up agendado para ${dateBR(date)}.`, undo: r.undo })) setDate(null);
  }

  return (
    <section className="mt-6 border-t border-line pt-4" aria-labelledby={`fu-${lead.id}`}>
      <h3 id={`fu-${lead.id}`} className="eyebrow mb-2">Follow-ups</h3>
      {isNew ? (
        <p className="text-[14px] text-ink-3">Salve o lead para agendar follow-ups. Ao mover para "Rascunho enviado" ou "Proposta/valor enviado", o primeiro é criado sozinho.</p>
      ) : (
        <>
          {mine.length ? (
            <ol className="mb-4 flex flex-col">
              {mine.map((f) => {
                const st = followupStatus(f, today);
                return (
                  <li key={f.id} className="border-b border-line last:border-0">
                    <button type="button" onClick={() => actions.open(f.id)} className="flex min-h-12 w-full flex-wrap items-center gap-x-3 gap-y-1 py-2 text-left">
                      <span className="num w-20 text-[13px] text-ink-3">{dateBR(followupDate(f))}</span>
                      <Pill tone={STATUS_TONE[st]}>{FOLLOWUP_STATUS[st]}</Pill>
                      <span className="text-[14px]">{FOLLOWUP_TIPOS_CURTO[f.tipo]} · {FOLLOWUP_CANAIS[f.canal]}</span>
                      {(f.observacao || f.motivo_dispensa) && <span className="basis-full pl-[5.75rem] text-[13px] text-ink-2">{f.observacao ?? f.motivo_dispensa}</span>}
                    </button>
                  </li>
                );
              })}
            </ol>
          ) : <p className="mb-4 text-[14px] text-ink-3">Nenhum follow-up ainda.</p>}
          <div className="grid gap-3 rounded-lg border border-line p-3 sm:grid-cols-[1fr_1fr_1fr_auto] sm:items-end">
            <SelectField label="Tipo" value={tipo} options={entries(FOLLOWUP_TIPOS)} onChange={setTipo} />
            <SelectField label="Canal" value={canal} options={entries(FOLLOWUP_CANAIS)} onChange={setCanal} />
            <DateField label="Data prevista" value={date} onChange={setDate} />
            <Button disabled={!date} onClick={add}>Agendar</Button>
            {date && isWeekend(date) && (
              <p className="text-[13px] text-warn sm:col-span-4">
                Fim de semana: sugerimos segunda-feira.{" "}
                <button type="button" className="min-h-9 font-medium underline underline-offset-2" onClick={() => setDate(nextMonday(date))}>Usar {dateBR(nextMonday(date))}</button>
              </p>
            )}
          </div>
        </>
      )}
    </section>
  );
}
