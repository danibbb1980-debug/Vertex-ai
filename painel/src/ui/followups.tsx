// Ações de follow-up compartilhadas por todas as telas: marcar como enviado
// (com painel opcional de retomada/encerrar), adiar, dispensar, copiar a
// mensagem e registrar envio em data anterior. O painel nunca envia mensagens.
import {
  createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode,
} from "react";
import {
  addBusinessDays, closeLead, daysLate, dismiss, followupStatus, followupSubject, isWeekend, markSent,
  messageFor, nextMonday, postpone, remove, reopen, scheduleRetake, setObservation, type FollowupResult,
} from "../domain/followups";
import { dateBR, dateTimeBR, plusDays } from "../domain/format";
import {
  FOLLOWUP_CANAIS, FOLLOWUP_STATUS, FOLLOWUP_TIPOS, FOLLOWUP_TIPOS_CURTO, LOST_REASONS, SEGMENTS,
} from "../domain/labels";
import type { Followup, FollowupStatus } from "../domain/types";
import { href } from "../data/router";
import { useStore } from "../data/store";
import { Button, DateField, Dialog, Field, Pill, cx, type Tone } from "./kit";

export const STATUS_TONE: Record<FollowupStatus, Tone> = {
  atrasado: "danger",
  hoje: "fu",
  pendente: "fu",
  enviado: "neutral",
  dispensado: "muted",
};

interface Actions {
  /** Um toque: marca como enviado agora. */
  markSent: (id: string) => void;
  /** Abre a folha com todas as ações do follow-up. */
  open: (id: string) => void;
  copyMessage: (id: string) => void;
  moveToMonday: (id: string) => void;
}

const Ctx = createContext<Actions | null>(null);

export function useFollowupActions(): Actions {
  const v = useContext(Ctx);
  if (!v) throw new Error("useFollowupActions fora do FollowupProvider");
  return v;
}

async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    ta.remove();
    return ok;
  }
}

export function FollowupProvider({ children }: { children: ReactNode }) {
  const { data, today, commit, toast } = useStore();
  const [sheetId, setSheetId] = useState<string | null>(null);
  const [after, setAfter] = useState<{ id: string; undo: FollowupResult["undo"]; until: number } | null>(null);
  const [closing, setClosing] = useState<string | null>(null);

  const name = useCallback((f: Followup) => followupSubject(data, f).name, [data]);

  const run = useCallback(async (r: FollowupResult, message: string) => {
    if (!r.changes.followups?.length && !r.changes.leads?.length) return false;
    return commit(r.changes, { message, undo: r.undo });
  }, [commit]);

  const doMarkSent = useCallback(async (id: string, at?: string) => {
    const f = data.followups.find((x) => x.id === id);
    if (!f) return;
    const r = markSent(data, id, at);
    // Sem aviso flutuante: o "Desfazer" fica no painel que abre em seguida.
    const ok = await commit(r.changes);
    if (ok) {
      setSheetId(null);
      setAfter({ id, undo: r.undo, until: Date.now() + 6000 });
    }
  }, [data, commit]);

  const copyMessage = useCallback(async (id: string) => {
    const f = data.followups.find((x) => x.id === id);
    if (!f) return;
    const ok = await copyToClipboard(messageFor(data.settings, f.tipo, name(f)));
    toast(ok ? { message: "Mensagem copiada. Cole no WhatsApp ou Instagram." } : { message: "Não foi possível copiar.", tone: "error" });
  }, [data, name, toast]);

  const moveToMonday = useCallback((id: string) => {
    const f = data.followups.find((x) => x.id === id);
    if (!f) return;
    void run(postpone(data, id, nextMonday(f.data_prevista)), `Movido para segunda, ${dateBR(nextMonday(f.data_prevista))}.`);
  }, [data, run]);

  const value = useMemo<Actions>(() => ({
    markSent: (id) => void doMarkSent(id),
    open: setSheetId,
    copyMessage: (id) => void copyMessage(id),
    moveToMonday,
  }), [doMarkSent, copyMessage, moveToMonday]);

  const sheetFu = sheetId ? data.followups.find((f) => f.id === sheetId) : undefined;
  const afterFu = after ? data.followups.find((f) => f.id === after.id) : undefined;
  const closingLead = closing ? data.leads.find((l) => l.id === closing) : undefined;

  return (
    <Ctx.Provider value={value}>
      {children}
      {sheetFu && (
        <FollowupSheet
          f={sheetFu} today={today} name={name(sheetFu)}
          onClose={() => setSheetId(null)}
          onSent={(at) => void doMarkSent(sheetFu.id, at)}
          onCopy={() => void copyMessage(sheetFu.id)}
          onPostpone={async (date) => { if (await run(postpone(data, sheetFu.id, date), `Adiado para ${dateBR(date)}.`)) setSheetId(null); }}
          onDismiss={async (reason) => { if (await run(dismiss(data, sheetFu.id, reason), "Follow-up dispensado.")) setSheetId(null); }}
          onReopen={async () => { await run(reopen(data, sheetFu.id), "Follow-up reaberto."); }}
          onRemove={async () => { if (await run(remove(data, sheetFu.id), "Follow-up excluído.")) setSheetId(null); }}
          onObservation={async (text) => { await run(setObservation(data, sheetFu.id, text), "Observação salva."); }}
        />
      )}
      {after && afterFu && (
        <AfterSentPanel
          f={afterFu} name={name(afterFu)} until={after.until}
          retakeDays={data.settings.followup_retake_days || 60}
          onUndo={async () => {
            await commit(after.undo, { message: "Envio desfeito." });
            setAfter(null);
          }}
          onObservation={(text) => void run(setObservation(data, afterFu.id, text), "Observação salva.")}
          onRetake={async (days) => {
            if (!afterFu.lead_id) return;
            if (await run(scheduleRetake(data, afterFu.lead_id, days, today), `Retomada agendada para ${dateBR(plusDays(today, days))}.`)) setAfter(null);
          }}
          onClose={() => { if (afterFu.lead_id) setClosing(afterFu.lead_id); setAfter(null); }}
          onDismiss={() => setAfter(null)}
        />
      )}
      {closingLead && (
        <CloseLeadDialog
          name={closingLead.name}
          onCancel={() => setClosing(null)}
          onConfirm={async (reason) => {
            if (await run(closeLead(data, closingLead.id, reason, today), `${closingLead.name} movido para Perdido.`)) setClosing(null);
          }}
        />
      )}
    </Ctx.Provider>
  );
}

// ------------------------------------------------------------------ linha

export function FollowupRow({ f, compact }: { f: Followup; compact?: boolean }) {
  const { data, today } = useStore();
  const actions = useFollowupActions();
  const { name, segment } = followupSubject(data, f);
  const status = followupStatus(f, today);
  const open = status === "atrasado" || status === "hoje" || status === "pendente";
  const late = daysLate(f, today);
  const weekend = open && isWeekend(f.data_prevista);

  return (
    <li className="py-3">
      <div className="flex flex-wrap items-start gap-x-4 gap-y-2">
        <div className="min-w-0 flex-1 basis-[14rem]">
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="truncate font-medium">{name}</span>
            <Pill tone={STATUS_TONE[status]}>{FOLLOWUP_STATUS[status]}{late > 0 ? ` há ${late} ${late === 1 ? "dia" : "dias"}` : ""}</Pill>
          </p>
          <p className="text-[13px] text-ink-3">
            {segment ? `${SEGMENTS[segment]} · ` : ""}{FOLLOWUP_TIPOS_CURTO[f.tipo]} · {FOLLOWUP_CANAIS[f.canal]} ·{" "}
            <span className="num">
              {f.enviado_em ? `enviado ${dateTimeBR(f.enviado_em)}` : f.dispensado_em ? `dispensado, previsto ${dateBR(f.data_prevista)}` : `previsto ${dateBR(f.data_prevista)}`}
            </span>
          </p>
          {!compact && (f.observacao || f.motivo_dispensa) && (
            <p className="mt-0.5 text-[13px] text-ink-2">{f.observacao ?? f.motivo_dispensa}</p>
          )}
          {weekend && (
            <p className="mt-1 flex flex-wrap items-center gap-2 text-[13px] text-warn">
              Fim de semana: sugerimos segunda-feira.
              <button type="button" onClick={() => actions.moveToMonday(f.id)}
                className="min-h-9 rounded-md px-1 font-medium underline underline-offset-2">
                Mover para {dateBR(nextMonday(f.data_prevista)).slice(0, 5)}
              </button>
            </p>
          )}
        </div>
        <div className="flex w-full items-center gap-2 sm:w-auto">
          {open && (
            <button
              type="button"
              onClick={() => actions.markSent(f.id)}
              aria-label={`Marcar follow-up de ${name} como enviado`}
              className="inline-flex min-h-12 flex-1 items-center justify-center rounded-lg bg-accent px-4 text-[15px] font-semibold text-accent-ink transition-colors duration-150 hover:bg-accent-strong sm:flex-none"
            >
              Marcar como enviado
            </button>
          )}
          <button
            type="button"
            onClick={() => actions.open(f.id)}
            aria-label={`Mais ações do follow-up de ${name}`}
            className={cx("inline-flex min-h-12 items-center justify-center rounded-lg border border-line-strong bg-surface px-3 text-[14px] font-medium text-ink-2 hover:bg-surface-2", !open && "flex-1 sm:flex-none")}
          >
            {open ? "Mais" : "Detalhes"}
          </button>
        </div>
      </div>
    </li>
  );
}

// ------------------------------------------------------------------ folha

function FollowupSheet({ f, today, name, onClose, onSent, onCopy, onPostpone, onDismiss, onReopen, onRemove, onObservation }: {
  f: Followup; today: string; name: string; onClose: () => void; onSent: (at?: string) => void; onCopy: () => void;
  onPostpone: (date: string) => void; onDismiss: (reason: string | null) => void; onReopen: () => void;
  onRemove: () => void; onObservation: (text: string | null) => void;
}) {
  const status = followupStatus(f, today);
  const open = status === "atrasado" || status === "hoje" || status === "pendente";
  const late = daysLate(f, today);
  const [date, setDate] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [obs, setObs] = useState(f.observacao ?? "");
  const [backdate, setBackdate] = useState("");
  const [panel, setPanel] = useState<"none" | "adiar" | "dispensar" | "data">("none");

  return (
    <Dialog open onClose={onClose} title={name} wide>
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2 text-[14px]">
          <Pill tone={STATUS_TONE[status]}>{FOLLOWUP_STATUS[status]}{late > 0 ? ` há ${late} ${late === 1 ? "dia" : "dias"}` : ""}</Pill>
          <span className="text-ink-2">{FOLLOWUP_TIPOS[f.tipo]} · {FOLLOWUP_CANAIS[f.canal]}</span>
        </div>
        <dl className="num grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-[14px]">
          <dt className="text-ink-3">Prevista</dt><dd>{dateBR(f.data_prevista)}</dd>
          {f.enviado_em && <><dt className="text-ink-3">Enviado</dt><dd>{dateTimeBR(f.enviado_em)} (marcado à mão)</dd></>}
          {f.dispensado_em && <><dt className="text-ink-3">Dispensado</dt><dd>{dateTimeBR(f.dispensado_em)}{f.motivo_dispensa ? ` · ${f.motivo_dispensa}` : ""}</dd></>}
        </dl>

        {open && (
          <Button variant="primary" className="min-h-12 w-full text-[16px]" onClick={() => onSent()} aria-label={`Marcar follow-up de ${name} como enviado`}>
            Marcar como enviado
          </Button>
        )}

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Button onClick={onCopy}>Copiar mensagem</Button>
          {open && <Button onClick={() => setPanel(panel === "adiar" ? "none" : "adiar")} aria-expanded={panel === "adiar"}>Adiar</Button>}
          {open && <Button onClick={() => setPanel(panel === "dispensar" ? "none" : "dispensar")} aria-expanded={panel === "dispensar"}>Dispensar</Button>}
          {open && <Button onClick={() => setPanel(panel === "data" ? "none" : "data")} aria-expanded={panel === "data"}>Enviei antes</Button>}
          {!open && <Button onClick={onReopen}>{f.enviado_em ? "Marcar como não enviado" : "Reabrir"}</Button>}
        </div>

        {panel === "adiar" && (
          <div className="rounded-lg border border-line p-3">
            <p className="mb-2 text-[13px] font-medium text-ink-2">Adiar para</p>
            <div className="grid grid-cols-3 gap-2">
              <Button size="sm" onClick={() => onPostpone(addBusinessDays(today, 1))}>+1 dia útil</Button>
              <Button size="sm" onClick={() => onPostpone(addBusinessDays(today, 2))}>+2 dias úteis</Button>
              <Button size="sm" onClick={() => onPostpone(plusDays(today, 7))}>+7 dias</Button>
            </div>
            <div className="mt-3 flex items-end gap-2">
              <DateField label="Outra data" value={date} onChange={setDate} className="flex-1" />
              <Button disabled={!date} onClick={() => date && onPostpone(date)}>Adiar</Button>
            </div>
            {date && isWeekend(date) && <p className="mt-2 text-[13px] text-warn">Fim de semana: sugerimos segunda-feira, {dateBR(nextMonday(date))}.</p>}
          </div>
        )}

        {panel === "dispensar" && (
          <div className="rounded-lg border border-line p-3">
            <Field label="Motivo (opcional)" htmlFor="motivo-dispensa">
              <input id="motivo-dispensa" className="input" maxLength={200} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Ex.: respondeu por ligação" />
            </Field>
            <Button className="mt-3" variant="danger" onClick={() => onDismiss(reason || null)}>Dispensar follow-up</Button>
          </div>
        )}

        {panel === "data" && (
          <div className="rounded-lg border border-line p-3">
            <Field label="Data e hora em que você enviou" htmlFor="enviado-em" hint="Para quando você esqueceu de marcar na hora.">
              <input id="enviado-em" type="datetime-local" className="input" value={backdate} max={`${today}T23:59`} onChange={(e) => setBackdate(e.target.value)} />
            </Field>
            <Button className="mt-3" variant="primary" disabled={!backdate}
              onClick={() => onSent(new Date(`${backdate}:00-03:00`).toISOString())}>
              Registrar envio
            </Button>
          </div>
        )}

        <Field label="Observação" htmlFor="obs-fu" hint="Ex.: enviei sem o link; pediu para falar semana que vem.">
          <div className="flex gap-2">
            <input id="obs-fu" className="input" maxLength={500} value={obs} onChange={(e) => setObs(e.target.value)} />
            <Button disabled={obs === (f.observacao ?? "")} onClick={() => onObservation(obs || null)}>Salvar</Button>
          </div>
        </Field>

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line pt-3 text-[14px]">
          {f.lead_id ? (
            <a className="min-h-11 content-center text-accent underline underline-offset-2" href={href(`/funil?id=${f.lead_id}`)} onClick={onClose}>Abrir lead</a>
          ) : f.sale_id ? (
            <a className="min-h-11 content-center text-accent underline underline-offset-2" href={href(`/vendas/${f.sale_id}`)} onClick={onClose}>Abrir venda</a>
          ) : <span />}
          <Button variant="ghost" size="sm" onClick={onRemove}>Excluir follow-up</Button>
        </div>
      </div>
    </Dialog>
  );
}

// ------------------------------------------------------------------ depois de enviar

function AfterSentPanel({ f, name, until, retakeDays, onUndo, onObservation, onRetake, onClose, onDismiss }: {
  f: Followup; name: string; until: number; retakeDays: number; onUndo: () => void;
  onObservation: (text: string | null) => void; onRetake: (days: number) => void; onClose: () => void; onDismiss: () => void;
}) {
  const [canUndo, setCanUndo] = useState(Date.now() < until);
  const [obs, setObs] = useState(f.observacao ?? "");
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    setCanUndo(Date.now() < until);
    const t = setTimeout(() => setCanUndo(false), Math.max(0, until - Date.now()));
    return () => clearTimeout(t);
  }, [until]);
  const second = retakeDays === 90 ? 60 : 90;
  const withLead = !!f.lead_id && f.tipo !== "pos_venda";

  return (
    <div
      ref={ref}
      role="region"
      aria-label="Follow-up enviado"
      className="rise fixed inset-x-0 z-40 mx-auto w-full max-w-md px-3 lg:bottom-6 lg:right-6 lg:left-auto lg:mx-0"
      style={{ bottom: "calc(64px + env(safe-area-inset-bottom))" }}
    >
      <div className="rounded-xl border border-line-strong bg-surface p-4 shadow-[0_16px_40px_-16px_rgb(8_18_24/0.5)]">
        <div className="flex items-start justify-between gap-3">
          <p className="text-[15px] font-semibold" aria-live="polite">Enviado para {name}.</p>
          <div className="flex shrink-0 items-center gap-1">
            {canUndo && <Button size="sm" variant="ghost" className="font-semibold underline" onClick={onUndo}>Desfazer</Button>}
            <button type="button" onClick={onDismiss} aria-label="Fechar" className="min-h-9 min-w-9 rounded-md text-ink-3 hover:bg-surface-2">×</button>
          </div>
        </div>
        <div className="mt-3 flex gap-2">
          <label className="sr-only" htmlFor="obs-after">Observação (opcional)</label>
          <input id="obs-after" className="input" maxLength={500} placeholder="Observação (opcional)" value={obs} onChange={(e) => setObs(e.target.value)} />
          <Button disabled={!obs.trim() || obs === (f.observacao ?? "")} onClick={() => onObservation(obs)}>Salvar</Button>
        </div>
        {withLead && (
          <>
            <p className="mt-3 text-[13px] text-ink-3">E agora? (opcional)</p>
            <div className="mt-1.5 grid gap-2">
              <Button className="min-h-12" onClick={() => onRetake(retakeDays)}>Agendar retomada em {retakeDays} dias</Button>
              <Button className="min-h-12" onClick={() => onRetake(second)}>Agendar retomada em {second} dias</Button>
              <Button className="min-h-12" variant="danger" onClick={onClose}>Encerrar sem retomada</Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function CloseLeadDialog({ name, onCancel, onConfirm }: { name: string; onCancel: () => void; onConfirm: (reason: string) => void }) {
  const [reason, setReason] = useState<string>(LOST_REASONS[0]);
  const [other, setOther] = useState("");
  const final = reason === "Outro" ? (other.trim() ? `Outro: ${other.trim()}` : "Outro") : reason;
  return (
    <Dialog open onClose={onCancel} title={`Encerrar ${name}`}
      footer={<><Button onClick={onCancel}>Voltar</Button><Button variant="danger" onClick={() => onConfirm(final)}>Mover para Perdido</Button></>}>
      <fieldset>
        <legend className="mb-2 text-[14px] text-ink-2">Motivo da perda</legend>
        <div className="grid gap-2">
          {LOST_REASONS.map((r) => (
            <label key={r} className={cx(
              "flex min-h-12 cursor-pointer items-center gap-3 rounded-lg border px-3 text-[15px]",
              reason === r ? "border-accent bg-accent-soft font-medium" : "border-line-strong",
            )}>
              <input type="radio" name="motivo" value={r} checked={reason === r} onChange={() => setReason(r)} className="h-4 w-4 accent-[var(--accent)]" />
              {r}
            </label>
          ))}
        </div>
        {reason === "Outro" && (
          <input aria-label="Descreva o motivo" className="input mt-2" maxLength={200} value={other} onChange={(e) => setOther(e.target.value)} placeholder="Descreva (opcional)" />
        )}
      </fieldset>
    </Dialog>
  );
}

/** Link para a aba de follow-ups (usado no painel). */
export function followupsHref(tab: "atrasados" | "hoje" | "proximos" | "enviados"): string {
  return href(`/followups?aba=${tab}`);
}


