import { useRef, useState, type ChangeEvent } from "react";
import { feeKey } from "../domain/calc";
import { COLUMN_KINDS, coerce, download, parseCSV, toCSV } from "../domain/csv";
import { money } from "../domain/format";
import { METHODS, PLATFORMS, entries } from "../domain/labels";
import type { Cost, Dataset, Installment, Sale, Settings, TableName } from "../domain/types";
import { useStore } from "../data/store";
import { Button, MoneyField, NumberField, PageHeader, Section, Segmented, useConfirm } from "../ui/kit";
import { useTheme } from "../ui/theme";

const SALE_COLS: (keyof Sale)[] = [
  "id", "client", "segment", "city", "contact", "lead_origin", "referred_by", "package", "description",
  "gross_amount", "payment_method", "installments_count", "platform", "fee_percent", "net_amount", "sale_date",
  "first_payment_date", "status", "recurring_active", "draft_sent_at", "published_at", "adjustments_end",
  "domain_expires_at", "domain", "site_url", "notes", "refunded_at", "lead_id", "created_at", "updated_at", "deleted_at",
];
const INST_COLS: (keyof Installment)[] = [
  "id", "sale_id", "number", "gross_amount", "net_amount", "due_date", "received_at", "status", "created_at", "updated_at", "deleted_at",
];
const COST_COLS: (keyof Cost)[] = [
  "id", "description", "category", "amount", "recurrence", "day_of_month", "date", "starts_on", "active", "notes", "created_at", "updated_at", "deleted_at",
];

export function SettingsPage() {
  const { data, saveSettings, mode, importData, toast, today } = useStore();
  const [s, setS] = useState<Settings>(data.settings);
  const [theme, toggleTheme] = useTheme();
  const [ask, confirmNode] = useConfirm();
  const jsonInput = useRef<HTMLInputElement>(null);
  const csvInput = useRef<HTMLInputElement>(null);
  const [csvTable, setCsvTable] = useState<TableName>("sales");
  const dirty = JSON.stringify(s) !== JSON.stringify(data.settings);

  const setFee = (key: string, v: number | null) => setS((x) => ({ ...x, fees: { ...x.fees, [key]: v ?? 0 } }));

  function exportJSON() {
    const payload = { app: "lumivo-painel", version: 1, exported_at: new Date().toISOString(), ...data };
    download(`lumivo-backup-${today}.json`, JSON.stringify(payload, null, 2), "application/json");
  }

  async function onJSON(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text()) as Partial<Dataset> & { app?: string };
      if (parsed.app !== "lumivo-painel" && !parsed.sales) throw new Error("Arquivo não parece um backup do painel.");
      const total = ["sales", "installments", "costs", "leads", "sale_history"].reduce((a, k) => a + ((parsed as Record<string, unknown[]>)[k]?.length ?? 0), 0);
      const ok = await ask({
        title: "Importar backup?",
        body: `${total} registros serão adicionados ou atualizados (mesmo id = substitui). Nada é apagado.${mode === "supabase" ? " Os dados vão para o Supabase." : ""}`,
        confirm: "Importar",
      });
      if (!ok) return;
      const n = await importData({
        sales: parsed.sales, installments: parsed.installments, costs: parsed.costs, leads: parsed.leads,
        sale_history: parsed.sale_history, settings: parsed.settings,
      });
      setS((x) => ({ ...x, ...parsed.settings, id: 1 }));
      toast({ message: `${n} registros importados.` });
    } catch (err) {
      toast({ message: `Não foi possível importar: ${(err as Error).message}`, tone: "error" });
    }
  }

  async function onCSV(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      const rows = parseCSV(await file.text()).map((r) => coerce(r, COLUMN_KINDS)).filter((r) => r.id);
      if (!rows.length) throw new Error("nenhuma linha com coluna id.");
      const label = { sales: "vendas", installments: "parcelas", costs: "custos" }[csvTable as "sales"];
      const ok = await ask({ title: `Importar ${rows.length} ${label}?`, body: "Linhas com o mesmo id são substituídas. Nada é apagado.", confirm: "Importar" });
      if (!ok) return;
      const n = await importData({ [csvTable]: rows } as Partial<Dataset>);
      toast({ message: `${n} linhas importadas.` });
    } catch (err) {
      toast({ message: `Não foi possível importar o CSV: ${(err as Error).message}`, tone: "error" });
    }
  }

  return (
    <div className="max-w-3xl">
      {confirmNode}
      <PageHeader title="Configurações" sub={mode === "local" ? "Modo local: os dados ficam só neste navegador." : "Conectado ao Supabase."} />

      <Section title="Metas e MEI">
        <div className="grid gap-4 sm:grid-cols-3">
          <MoneyField label="Meta mensal de faturamento" value={s.monthly_goal || null} allowEmpty onChange={(v) => setS({ ...s, monthly_goal: v ?? 0 })} />
          <MoneyField label="Limite anual do MEI" value={s.mei_limit} onChange={(v) => setS({ ...s, mei_limit: v ?? 0 })} hint="Padrão R$ 81.000,00." />
          <MoneyField label="Outras receitas do MEI no ano" value={s.mei_other_revenue || null} allowEmpty onChange={(v) => setS({ ...s, mei_other_revenue: v ?? 0 })} hint="Somadas ao acumulado do MEI." />
        </div>
      </Section>

      <Section title="Taxas padrão (%)" className="mt-8">
        <p className="mb-3 text-[13.5px] text-ink-3">Preenchem a taxa de cada nova venda conforme plataforma e forma de pagamento. Podem ser alteradas em cada venda.</p>
        <div className="scroll-x">
          <table className="w-full min-w-[560px] text-[14px]">
            <thead>
              <tr className="border-b border-line-strong text-left text-[13px] text-ink-3">
                <th scope="col" className="py-2 pr-3 font-medium">Forma</th>
                {entries(PLATFORMS).map(([p, label]) => <th key={p} scope="col" className="py-2 pr-3 font-medium">{label}</th>)}
              </tr>
            </thead>
            <tbody>
              {entries(METHODS).map(([m, mLabel]) => (
                <tr key={m} className="border-b border-line">
                  <th scope="row" className="py-1.5 pr-3 text-left font-normal">{mLabel}</th>
                  {entries(PLATFORMS).map(([p, pLabel]) => (
                    <td key={p} className="py-1.5 pr-3">
                      <FeeInput label={`Taxa ${mLabel} no ${pLabel}`} value={s.fees[feeKey(p, m)] ?? 0} onChange={(v) => setFee(feeKey(p, m), v)} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Custo do trabalho (opcional)" className="mt-8">
        <div className="grid gap-4 sm:grid-cols-2">
          <MoneyField label="Custo por hora" value={s.hourly_cost} allowEmpty onChange={(v) => setS({ ...s, hourly_cost: v })} />
          <MoneyField label="Custo por dia" value={s.daily_cost} allowEmpty onChange={(v) => setS({ ...s, daily_cost: v })} />
        </div>
      </Section>

      <div className="sticky bottom-[calc(56px+env(safe-area-inset-bottom))] z-10 -mx-4 mt-6 flex items-center gap-3 border-t border-line bg-bg/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:static lg:mx-0 lg:border-0 lg:bg-transparent lg:px-0">
        <Button variant="primary" disabled={!dirty} onClick={() => saveSettings(s, "Configurações salvas.")}>Salvar configurações</Button>
        {dirty && <span className="text-[13px] text-ink-3">Alterações não salvas</span>}
      </div>

      <Section title="Aparência" className="mt-8">
        <Segmented label="Tema" value={theme} onChange={(v) => v !== theme && toggleTheme()} options={[["light", "Claro"], ["dark", "Escuro"]]} />
      </Section>

      <Section title="Backup" className="mt-8">
        <p className="mb-3 text-[13.5px] text-ink-3">
          O JSON leva tudo (vendas, parcelas, custos, leads, histórico e configurações). Use-o para migrar do modo local para o Supabase: exporte aqui, entre no painel conectado e importe.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button onClick={exportJSON}>Exportar JSON</Button>
          <Button onClick={() => jsonInput.current?.click()}>Importar JSON</Button>
          <input ref={jsonInput} type="file" accept="application/json,.json" className="sr-only" tabIndex={-1} aria-hidden="true" onChange={onJSON} />
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="text-[14px] text-ink-2">CSV:</span>
          <Button size="sm" onClick={() => download(`lumivo-vendas-${today}.csv`, toCSV(data.sales, SALE_COLS), "text/csv;charset=utf-8")}>Exportar vendas</Button>
          <Button size="sm" onClick={() => download(`lumivo-parcelas-${today}.csv`, toCSV(data.installments, INST_COLS), "text/csv;charset=utf-8")}>Exportar parcelas</Button>
          <Button size="sm" onClick={() => download(`lumivo-custos-${today}.csv`, toCSV(data.costs, COST_COLS), "text/csv;charset=utf-8")}>Exportar custos</Button>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <label className="text-[14px] text-ink-2" htmlFor="csv-tabela">Importar CSV de</label>
          <select id="csv-tabela" className="input !w-auto" value={csvTable} onChange={(e) => setCsvTable(e.target.value as TableName)}>
            <option value="sales">vendas</option>
            <option value="installments">parcelas</option>
            <option value="costs">custos</option>
          </select>
          <Button size="sm" onClick={() => csvInput.current?.click()}>Escolher arquivo</Button>
          <input ref={csvInput} type="file" accept=".csv,text/csv" className="sr-only" tabIndex={-1} aria-hidden="true" onChange={onCSV} />
        </div>
        <p className="mt-2 text-[12.5px] text-ink-3">O CSV precisa ter as mesmas colunas do arquivo exportado (separador ponto e vírgula).</p>
      </Section>

      <p className="mt-10 text-[12.5px] text-ink-3">Totais atuais: {data.sales.filter((x) => !x.deleted_at).length} vendas · {money(data.installments.filter((i) => !i.deleted_at && i.received_at).reduce((a, i) => a + i.gross_amount, 0))} recebidos no total.</p>
    </div>
  );
}

function FeeInput({ label, value, onChange }: { label: string; value: number; onChange: (v: number | null) => void }) {
  return (
    <div className="w-24">
      <NumberField label={label} value={value} min={0} max={99} suffix="%" onChange={onChange} className="[&>label]:sr-only" />
    </div>
  );
}
