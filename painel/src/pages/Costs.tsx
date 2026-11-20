import { useEffect, useState } from "react";
import { breakEven, costsForMonth, fixedMonthly, overallTicket } from "../domain/calc";
import { dateBR, money, monthKey, monthLabel } from "../domain/format";
import { COST_CATEGORIES, RECURRENCES, entries } from "../domain/labels";
import { restore, softDelete, uid } from "../domain/service";
import type { Cost } from "../domain/types";
import { alive, useStore } from "../data/store";
import {
  Button, DateField, Dialog, MoneyField, NumberField, PageHeader, Pill, SelectField, TextArea, TextField, cx, useConfirm,
} from "../ui/kit";

function blank(): Cost {
  const now = new Date().toISOString();
  return {
    id: uid(), description: "", category: "ferramentas", amount: null, recurrence: "mensal", day_of_month: null,
    date: null, starts_on: null, active: true, notes: null, created_at: now, updated_at: now, deleted_at: null,
  };
}

export function Costs({ focus }: { focus: string | null }) {
  const { data, today, commit } = useStore();
  const [ask, confirmNode] = useConfirm();
  const [editing, setEditing] = useState<Cost | null>(null);
  const costs = alive(data.costs).sort((a, b) => Number(b.active) - Number(a.active) || a.description.localeCompare(b.description, "pt-BR"));
  const fixed = fixedMonthly(costs);
  const ticket = overallTicket(data.sales);
  const be = breakEven(fixed.total, ticket);
  const thisMonth = costsForMonth(costs, monthKey(today));

  useEffect(() => {
    if (focus) document.getElementById(`custo-${focus}`)?.scrollIntoView({ block: "center" });
  }, [focus]);

  async function save(c: Cost) {
    await commit({ costs: [{ ...c, updated_at: new Date().toISOString() }] }, { message: "Custo salvo." });
    setEditing(null);
  }

  async function remove(c: Cost) {
    const ok = await ask({ title: `Excluir “${c.description}”?`, body: "O custo sai dos cálculos. Dá para desfazer logo em seguida.", confirm: "Excluir", danger: true });
    if (!ok) return;
    await commit({ costs: [softDelete(c)] }, { message: "Custo excluído.", undo: { costs: [restore(c)] } });
  }

  return (
    <div>
      {confirmNode}
      <PageHeader title="Custos">
        <Button variant="primary" onClick={() => setEditing(blank())}>Novo custo</Button>
      </PageHeader>

      <dl className="mb-8 grid grid-cols-1 gap-px border-y border-line bg-line sm:grid-cols-3">
        <div className="bg-bg py-3 sm:pr-4">
          <dt className="text-[13px] text-ink-3">Custo fixo mensal</dt>
          <dd className="num text-[30px] font-semibold tracking-[-0.025em]">{money(fixed.total)}</dd>
          <dd className="num text-[12.5px] text-ink-3">mensais {money(fixed.monthly)}{fixed.annualShare > 0 ? ` + anuais ÷ 12 ${money(fixed.annualShare)}` : ""}</dd>
        </div>
        <div className="bg-bg py-3 sm:px-4">
          <dt className="text-[13px] text-ink-3">Ponto de equilíbrio</dt>
          <dd className="num text-[30px] font-semibold tracking-[-0.025em]">
            {be == null ? "—" : `${be} ${be === 1 ? "venda" : "vendas"}`}
          </dd>
          <dd className="num text-[12.5px] text-ink-3">
            {be == null ? "Cadastre vendas para calcular o ticket médio." : `por mês, com ticket médio de ${money(ticket)}`}
          </dd>
        </div>
        <div className="bg-bg py-3 sm:pl-4">
          <dt className="text-[13px] text-ink-3">Lançado em {monthLabel(monthKey(today))}</dt>
          <dd className="num text-[30px] font-semibold tracking-[-0.025em]">{money(thisMonth)}</dd>
          <dd className="text-[12.5px] text-ink-3">mensais + anuais e únicos que caem neste mês</dd>
        </div>
      </dl>

      <ul className="divide-y divide-line border-y border-line">
        {costs.map((c) => (
          <li key={c.id} id={`custo-${c.id}`} className={cx("flex flex-wrap items-center gap-x-4 gap-y-2 py-3", focus === c.id && "bg-accent-soft -mx-2 px-2 rounded-lg")}>
            <div className="min-w-[12rem] flex-1">
              <p className={cx("font-medium", !c.active && "text-ink-3")}>{c.description}</p>
              <p className="text-[13px] text-ink-3">
                {COST_CATEGORIES[c.category]} · {RECURRENCES[c.recurrence]}
                {c.recurrence === "mensal" && c.day_of_month ? ` · dia ${c.day_of_month}` : ""}
                {c.recurrence !== "mensal" && c.date ? ` · ${dateBR(c.date)}` : ""}
              </p>
            </div>
            <span className={cx("num text-[16px] font-semibold", c.amount == null && "font-normal text-ink-3")}>
              {c.amount == null ? "sem valor" : money(c.amount)}
            </span>
            {!c.active && <Pill tone="muted">Inativo</Pill>}
            <span className="flex gap-1">
              <Button size="sm" variant="ghost" onClick={() => commit({ costs: [{ ...c, active: !c.active, updated_at: new Date().toISOString() }] }, { message: c.active ? "Custo desativado." : "Custo ativado." })}
                disabled={!c.active && c.amount == null} title={!c.active && c.amount == null ? "Preencha o valor antes de ativar" : undefined}>
                {c.active ? "Desativar" : "Ativar"}
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setEditing(c)}>Editar</Button>
              <Button size="sm" variant="ghost" onClick={() => remove(c)} aria-label={`Excluir ${c.description}`}>Excluir</Button>
            </span>
          </li>
        ))}
      </ul>

      {editing && <CostDialog cost={editing} isNew={!data.costs.some((c) => c.id === editing.id)} onClose={() => setEditing(null)} onSave={save} />}
    </div>
  );
}

function CostDialog({ cost, isNew, onClose, onSave }: { cost: Cost; isNew: boolean; onClose: () => void; onSave: (c: Cost) => void }) {
  const [c, setC] = useState(cost);
  const [error, setError] = useState<string | null>(null);
  const set = <K extends keyof Cost>(k: K, v: Cost[K]) => setC((x) => ({ ...x, [k]: v }));
  function submit() {
    if (!c.description.trim()) return setError("Informe a descrição.");
    if (c.active && c.amount == null) return setError("Custo ativo precisa de valor. Deixe inativo se ainda não sabe o valor.");
    if (c.recurrence !== "mensal" && c.active && !c.date) return setError("Informe a data do custo.");
    onSave({ ...c, description: c.description.trim() });
  }
  return (
    <Dialog open onClose={onClose} title={isNew ? "Novo custo" : "Editar custo"} wide
      footer={<><Button onClick={onClose}>Voltar</Button><Button variant="primary" onClick={submit}>Salvar</Button></>}>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField label="Descrição" required className="sm:col-span-2" value={c.description} onChange={(e) => set("description", e.target.value)} autoFocus />
        <SelectField label="Categoria" value={c.category} options={entries(COST_CATEGORIES)} onChange={(v) => set("category", v)} />
        <MoneyField label="Valor" value={c.amount} onChange={(v) => set("amount", v)} allowEmpty hint="Pode deixar vazio enquanto não souber." />
        <SelectField label="Recorrência" value={c.recurrence} options={entries(RECURRENCES)} onChange={(v) => set("recurrence", v)} />
        {c.recurrence === "mensal" ? (
          <NumberField label="Dia do mês" min={1} max={31} value={c.day_of_month} onChange={(v) => set("day_of_month", v == null ? null : Math.round(v))} hint="Para aparecer no calendário." />
        ) : (
          <DateField label={c.recurrence === "anual" ? "Data (repete todo ano)" : "Data"} value={c.date} onChange={(v) => set("date", v)} />
        )}
        <DateField label="Vale a partir de" value={c.starts_on} onChange={(v) => set("starts_on", v)} hint="Opcional. Vazio = conta em todos os meses." />
        <label className="flex min-h-11 items-center gap-3 self-end">
          <input type="checkbox" className="h-5 w-5 accent-[var(--accent)]" checked={c.active} onChange={(e) => set("active", e.target.checked)} />
          <span className="text-[15px]">Ativo</span>
        </label>
        <TextArea label="Observação" className="sm:col-span-2" value={c.notes ?? ""} onChange={(e) => set("notes", e.target.value || null)} />
        {error && <p role="alert" className="text-[14px] text-danger sm:col-span-2">{error}</p>}
      </div>
    </Dialog>
  );
}
