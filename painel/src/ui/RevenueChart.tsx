import { useId, useState } from "react";
import {
  Bar, BarChart, CartesianGrid, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis,
  type TooltipContentProps,
} from "recharts";
import { money, moneyShort, monthLabel, monthShort } from "../domain/format";
import { cx } from "./kit";

export interface ChartRow {
  key: string;
  income: number;
  costs: number;
}

/** Barras agrupadas: entrada (recebido ou vendido) x custos, por mês. */
export function RevenueChart({ rows, incomeLabel, selected }: { rows: ChartRow[]; incomeLabel: string; selected: string }) {
  const [asTable, setAsTable] = useState(false);
  const titleId = useId();
  const data = rows.map((r) => ({ ...r, label: monthShort(r.key) }));

  const DirectLabel = (props: { x?: unknown; y?: unknown; width?: unknown; value?: unknown; index?: number }) => {
    if (props.value == null || props.value === "" || !Number(props.value)) return null;
    const x = Number(props.x) + Number(props.width) / 2;
    return (
      <text x={x} y={Number(props.y) - 6} textAnchor="middle" fontSize={11} fill="var(--ink-2)" className="num">
        {moneyShort(Number(props.value))}
      </text>
    );
  };

  return (
    <figure aria-labelledby={titleId} className="m-0">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <figcaption id={titleId} className="flex items-center gap-4 text-[13px] text-ink-2">
          <span className="inline-flex items-center gap-1.5"><Swatch color="var(--chart-in)" />{incomeLabel}</span>
          <span className="inline-flex items-center gap-1.5"><Swatch color="var(--chart-out)" />Custos</span>
        </figcaption>
        <button
          type="button"
          onClick={() => setAsTable((v) => !v)}
          className="min-h-9 rounded-md px-2 text-[13px] text-ink-2 underline underline-offset-2 hover:text-ink"
          aria-pressed={asTable}
        >
          {asTable ? "Ver gráfico" : "Ver como tabela"}
        </button>
      </div>

      {asTable ? (
        <div className="scroll-x">
          <table className="w-full min-w-[320px] text-[14px]">
            <thead>
              <tr className="border-b border-line text-left text-ink-3">
                <th scope="col" className="py-2 pr-3 font-medium">Mês</th>
                <th scope="col" className="py-2 pr-3 text-right font-medium">{incomeLabel}</th>
                <th scope="col" className="py-2 pr-3 text-right font-medium">Custos</th>
                <th scope="col" className="py-2 text-right font-medium">Resultado</th>
              </tr>
            </thead>
            <tbody>
              {data.map((d) => (
                <tr key={d.key} className={cx("border-b border-line", d.key === selected && "font-semibold")}>
                  <th scope="row" className="py-2 pr-3 text-left font-normal">{monthLabel(d.key)}</th>
                  <td className="num py-2 pr-3 text-right">{money(d.income)}</td>
                  <td className="num py-2 pr-3 text-right">{money(d.costs)}</td>
                  <td className={cx("num py-2 text-right", d.income - d.costs < 0 && "text-danger")}>{money(d.income - d.costs)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="h-[220px] w-full lg:h-[260px]" role="img" aria-label={`Gráfico de ${incomeLabel.toLowerCase()} e custos por mês. Use "Ver como tabela" para os valores.`}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 4, bottom: 0, left: 4 }} barGap={2} barCategoryGap="24%">
              <CartesianGrid vertical={false} stroke="var(--line)" strokeDasharray="0" />
              <XAxis
                dataKey="label" tickLine={false} axisLine={{ stroke: "var(--line-strong)" }}
                tick={{ fill: "var(--ink-3)", fontSize: 11.5 }} interval="preserveStartEnd" minTickGap={4}
              />
              <YAxis
                width={56} tickLine={false} axisLine={false} tick={{ fill: "var(--ink-3)", fontSize: 11.5 }}
                tickFormatter={(v: number) => (v >= 1000 ? `${(v / 1000).toLocaleString("pt-BR", { maximumFractionDigits: 1 })} mil` : String(v))}
              />
              <Tooltip
                cursor={{ fill: "var(--surface-2)" }}
                content={(p) => <ChartTooltip {...(p as TooltipContentProps<number, string>)} incomeLabel={incomeLabel} />}
              />
              <Bar dataKey="income" name={incomeLabel} fill="var(--chart-in)" radius={[4, 4, 0, 0]} maxBarSize={22} isAnimationActive={false}>
                <LabelList dataKey={(d: ChartRow) => (d.key === selected ? d.income : "")} content={DirectLabel} />
              </Bar>
              <Bar dataKey="costs" name="Custos" fill="var(--chart-out)" radius={[4, 4, 0, 0]} maxBarSize={22} isAnimationActive={false}>
                <LabelList dataKey={(d: ChartRow) => (d.key === selected ? d.costs : "")} content={DirectLabel} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </figure>
  );
}

function Swatch({ color }: { color: string }) {
  return <span aria-hidden="true" className="inline-block h-2.5 w-2.5 rounded-[3px]" style={{ background: color }} />;
}

function ChartTooltip({ active, payload, label, incomeLabel }: TooltipContentProps<number, string> & { incomeLabel: string }) {
  if (!active || !payload?.length) return null;
  const row = payload[0].payload as ChartRow;
  return (
    <div className="rounded-lg border border-line bg-surface px-3 py-2 text-[13px] shadow-[0_8px_24px_-12px_rgb(8_18_24/0.4)]">
      <p className="mb-1 font-semibold">{label}</p>
      <p className="flex justify-between gap-4"><span className="inline-flex items-center gap-1.5"><Swatch color="var(--chart-in)" />{incomeLabel}</span><span className="num">{money(row.income)}</span></p>
      <p className="flex justify-between gap-4"><span className="inline-flex items-center gap-1.5"><Swatch color="var(--chart-out)" />Custos</span><span className="num">{money(row.costs)}</span></p>
      <p className="mt-1 flex justify-between gap-4 border-t border-line pt-1 text-ink-2"><span>Resultado</span><span className="num">{money(row.income - row.costs)}</span></p>
    </div>
  );
}
