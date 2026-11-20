import { useMemo, useState } from "react";
import { followupStatus, followupSubject } from "../domain/followups";
import { FOLLOWUP_CANAIS, FOLLOWUP_TIPOS, entries } from "../domain/labels";
import type { Followup, FollowupCanal, FollowupTipo } from "../domain/types";
import { navigate } from "../data/router";
import { alive, useStore } from "../data/store";
import { FollowupRow } from "../ui/followups";
import { Empty, PageHeader, cx } from "../ui/kit";

export type Tab = "atrasados" | "hoje" | "proximos" | "enviados";
const TABS: [Tab, string][] = [["atrasados", "Atrasados"], ["hoje", "Hoje"], ["proximos", "Próximos"], ["enviados", "Enviados"]];

/** Separa e ordena os follow-ups nas quatro abas. */
export function groupFollowups(followups: Followup[], today: string): Record<Tab, Followup[]> {
  const g: Record<Tab, Followup[]> = { atrasados: [], hoje: [], proximos: [], enviados: [] };
  for (const f of alive(followups)) {
    const s = followupStatus(f, today);
    if (s === "atrasado") g.atrasados.push(f);
    else if (s === "hoje") g.hoje.push(f);
    else if (s === "pendente") g.proximos.push(f);
    else if (s === "enviado") g.enviados.push(f);
  }
  const byDate = (a: Followup, b: Followup) => a.data_prevista.localeCompare(b.data_prevista) || a.created_at.localeCompare(b.created_at);
  g.atrasados.sort(byDate); // mais antigo primeiro
  g.hoje.sort(byDate);
  g.proximos.sort(byDate);
  g.enviados.sort((a, b) => (b.enviado_em ?? "").localeCompare(a.enviado_em ?? "")); // mais recente primeiro
  return g;
}

export function Followups({ tab }: { tab: string | null }) {
  const { data, today } = useStore();
  const groups = useMemo(() => groupFollowups(data.followups, today), [data.followups, today]);
  const active: Tab = TABS.some(([k]) => k === tab) ? (tab as Tab) : groups.atrasados.length ? "atrasados" : "hoje";
  const [q, setQ] = useState("");
  const [tipo, setTipo] = useState<FollowupTipo | "">("");
  const [canal, setCanal] = useState<FollowupCanal | "">("");

  const rows = groups[active].filter((f) => {
    if (tipo && f.tipo !== tipo) return false;
    if (canal && f.canal !== canal) return false;
    if (q.trim()) {
      const needle = q.trim().toLocaleLowerCase("pt-BR");
      const { name } = followupSubject(data, f);
      return [name, f.observacao].some((v) => v?.toLocaleLowerCase("pt-BR").includes(needle));
    }
    return true;
  });

  return (
    <div>
      <PageHeader title="Follow-ups" sub="Você envia pelo WhatsApp ou Instagram e marca aqui. O painel não envia mensagens." />

      <div role="tablist" aria-label="Situação dos follow-ups" className="mb-4 grid grid-cols-4 border-b border-line">
        {TABS.map(([k, label]) => {
          const n = groups[k].length;
          const selected = active === k;
          return (
            <button
              key={k} type="button" role="tab" aria-selected={selected} aria-controls="lista-followups"
              onClick={() => navigate(`/followups?aba=${k}`)}
              className={cx(
                "relative flex min-h-14 flex-col items-center justify-center gap-0.5 px-1 text-[14px] transition-colors duration-150 sm:flex-row sm:gap-1.5",
                selected ? "font-semibold text-ink" : "text-ink-3 hover:text-ink",
                selected && "after:absolute after:inset-x-2 after:-bottom-px after:h-[3px] after:rounded-t after:bg-accent",
              )}
            >
              {label}
              <span className={cx(
                "num inline-flex min-w-6 justify-center rounded-full px-1.5 text-[12.5px]",
                k === "atrasados" && n > 0 ? "bg-danger-soft font-semibold text-danger" : "bg-surface-2 text-ink-2",
              )}>
                {n}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mb-3 grid grid-cols-2 gap-2 sm:grid-cols-[1fr_auto_auto]">
        <label className="col-span-2 sm:col-span-1">
          <span className="sr-only">Buscar</span>
          <input type="search" className="input" placeholder="Buscar por nome ou observação…" value={q} onChange={(e) => setQ(e.target.value)} />
        </label>
        <select className="input" aria-label="Tipo de follow-up" value={tipo} onChange={(e) => setTipo(e.target.value as FollowupTipo | "")}>
          <option value="">Tipo: todos</option>
          {entries(FOLLOWUP_TIPOS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select className="input" aria-label="Canal" value={canal} onChange={(e) => setCanal(e.target.value as FollowupCanal | "")}>
          <option value="">Canal: todos</option>
          {entries(FOLLOWUP_CANAIS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>

      <div id="lista-followups" role="tabpanel">
        {rows.length ? (
          <ul className="divide-y divide-line border-y border-line">
            {rows.map((f) => <FollowupRow key={f.id} f={f} />)}
          </ul>
        ) : (
          <Empty>
            {groups[active].length ? "Nenhum follow-up com esses filtros." : {
              atrasados: "Nenhum follow-up atrasado.",
              hoje: "Nenhum follow-up para hoje.",
              proximos: "Nenhum follow-up agendado.",
              enviados: "Nenhum follow-up enviado ainda.",
            }[active]}
          </Empty>
        )}
      </div>
    </div>
  );
}
