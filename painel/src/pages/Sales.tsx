import { useMemo, useState } from "react";
import { effectiveStatus } from "../domain/calc";
import { dateBR, money, monthKey } from "../domain/format";
import { METHODS, PACKAGES, SALE_STATUS, SEGMENTS, entries } from "../domain/labels";
import type { PaymentMethod, Package, Sale, SaleStatus, Segment } from "../domain/types";
import { href } from "../data/router";
import { alive, useStore } from "../data/store";
import { Empty, LinkButton, PageHeader, Pill, cx, type Tone } from "../ui/kit";

export const STATUS_TONE: Record<SaleStatus, Tone> = {
  proposta: "muted",
  aceita: "neutral",
  aguardando: "warn",
  parcial: "warn",
  paga: "accent",
  cancelada: "danger",
};

type SortKey = "sale_date" | "client" | "gross_amount" | "status";
type StatusFilter = SaleStatus | "atrasada" | "";

export function Sales({ query }: { query: URLSearchParams }) {
  const { data, today } = useStore();
  const [q, setQ] = useState("");
  const [month, setMonth] = useState("");
  const [status, setStatus] = useState<StatusFilter>((query.get("status") as StatusFilter) ?? "");
  const [segment, setSegment] = useState<Segment | "">("");
  const [pkg, setPkg] = useState<Package | "">("");
  const [method, setMethod] = useState<PaymentMethod | "">("");
  const [sort, setSort] = useState<{ key: SortKey; dir: 1 | -1 }>({ key: "sale_date", dir: -1 });

  const sales = alive(data.sales);
  const byId = useMemo(() => new Map(sales.map((s) => [s.id, s])), [sales]);
  const overdueSales = useMemo(() => {
    const set = new Set<string>();
    for (const i of alive(data.installments)) {
      if (effectiveStatus(i, byId.get(i.sale_id), today) === "atrasada") set.add(i.sale_id);
    }
    return set;
  }, [data.installments, byId, today]);
  const paidBySale = useMemo(() => {
    const m = new Map<string, number>();
    for (const i of alive(data.installments)) if (i.received_at) m.set(i.sale_id, (m.get(i.sale_id) ?? 0) + i.gross_amount);
    return m;
  }, [data.installments]);

  const rows = useMemo(() => {
    const needle = q.trim().toLocaleLowerCase("pt-BR");
    const list = sales.filter((s) =>
      (!needle || [s.client, s.city, s.contact, s.domain, s.description].some((v) => v?.toLocaleLowerCase("pt-BR").includes(needle))) &&
      (!month || monthKey(s.sale_date) === month) &&
      (!status || (status === "atrasada" ? overdueSales.has(s.id) : s.status === status)) &&
      (!segment || s.segment === segment) &&
      (!pkg || s.package === pkg) &&
      (!method || s.payment_method === method));
    return list.sort((a, b) => {
      const av = a[sort.key], bv = b[sort.key];
      const c = typeof av === "number" ? (av as number) - (bv as number) : String(av).localeCompare(String(bv), "pt-BR");
      return c * sort.dir || b.created_at.localeCompare(a.created_at);
    });
  }, [sales, q, month, status, segment, pkg, method, sort, overdueSales]);

  const total = rows.filter((s) => s.status !== "cancelada" && s.status !== "proposta").reduce((a, s) => a + s.gross_amount, 0);
  const filtersOn = !!(q || month || status || segment || pkg || method);

  const th = (key: SortKey, label: string, right = false) => (
    <th scope="col" className={cx("py-2 pr-3 font-medium", right && "text-right")}
      aria-sort={sort.key === key ? (sort.dir === 1 ? "ascending" : "descending") : "none"}>
      <button type="button" className={cx("inline-flex min-h-9 items-center gap-1 hover:text-ink", right && "flex-row-reverse")}
        onClick={() => setSort((s) => ({ key, dir: s.key === key ? (s.dir === 1 ? -1 : 1) : key === "client" ? 1 : -1 }))}>
        {label}
        <span aria-hidden="true" className="w-3 text-[10px]">{sort.key === key ? (sort.dir === 1 ? "▲" : "▼") : ""}</span>
      </button>
    </th>
  );

  return (
    <div>
      <PageHeader title="Vendas" sub={`${rows.length} ${rows.length === 1 ? "venda" : "vendas"} · ${money(total)} vendidos (bruto)`}>
        <LinkButton href={href("/vendas/nova")} variant="primary" className="max-lg:hidden">Nova venda</LinkButton>
      </PageHeader>

      <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        <label className="col-span-2 sm:col-span-3 lg:col-span-2">
          <span className="sr-only">Buscar</span>
          <input type="search" className="input" placeholder="Buscar cliente, cidade, domínio…" value={q} onChange={(e) => setQ(e.target.value)} />
        </label>
        <label>
          <span className="sr-only">Mês</span>
          <input type="month" className="input" value={month} onChange={(e) => setMonth(e.target.value)} aria-label="Mês da venda" />
        </label>
        <Filter label="Status" value={status} onChange={setStatus} options={[...entries(SALE_STATUS), ["atrasada", "Com parcela atrasada"]]} />
        <Filter label="Segmento" value={segment} onChange={setSegment} options={entries(SEGMENTS)} />
        <Filter label="Pacote" value={pkg} onChange={setPkg} options={entries(PACKAGES)} />
        <Filter label="Pagamento" value={method} onChange={setMethod} options={entries(METHODS)} />
        {filtersOn && (
          <button type="button" className="min-h-11 rounded-lg px-2 text-left text-[14px] text-accent underline underline-offset-2"
            onClick={() => { setQ(""); setMonth(""); setStatus(""); setSegment(""); setPkg(""); setMethod(""); }}>
            Limpar filtros
          </button>
        )}
      </div>

      {rows.length === 0 ? (
        <Empty>{sales.length === 0 ? "Nenhuma venda cadastrada ainda." : "Nenhuma venda com esses filtros."}</Empty>
      ) : (
        <>
          {/* Celular: lista */}
          <ul className="divide-y divide-line border-y border-line md:hidden">
            {rows.map((s) => (
              <li key={s.id}>
                <a href={href(`/vendas/${s.id}`)} className="flex min-h-16 items-center gap-3 py-3 text-ink no-underline">
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium">{s.client}</span>
                    <span className="block truncate text-[13px] text-ink-3">
                      {dateBR(s.sale_date)} · {PACKAGES[s.package]} · {METHODS[s.payment_method]}{s.installments_count > 1 ? ` ${s.installments_count}x` : ""}
                    </span>
                  </span>
                  <span className="flex shrink-0 flex-col items-end gap-1">
                    <span className="num font-semibold">{money(s.gross_amount)}</span>
                    <StatusCell sale={s} overdue={overdueSales.has(s.id)} />
                  </span>
                </a>
              </li>
            ))}
          </ul>

          {/* Tablet e desktop: tabela */}
          <div className="scroll-x max-md:hidden">
            <table className="w-full min-w-[760px] text-[14.5px]">
              <thead>
                <tr className="border-b border-line-strong text-left text-[13px] text-ink-3">
                  {th("sale_date", "Data")}
                  {th("client", "Cliente")}
                  <th scope="col" className="py-2 pr-3 font-medium">Pacote</th>
                  <th scope="col" className="py-2 pr-3 font-medium">Pagamento</th>
                  {th("gross_amount", "Valor", true)}
                  <th scope="col" className="py-2 pr-3 text-right font-medium">Recebido</th>
                  {th("status", "Status")}
                </tr>
              </thead>
              <tbody>
                {rows.map((s) => (
                  <tr key={s.id} className="border-b border-line hover:bg-surface-2">
                    <td className="num py-2.5 pr-3 text-ink-2">{dateBR(s.sale_date)}</td>
                    <td className="max-w-[260px] py-2.5 pr-3">
                      <a href={href(`/vendas/${s.id}`)} className="block truncate font-medium text-ink underline-offset-2 hover:underline">{s.client}</a>
                      <span className="block truncate text-[12.5px] text-ink-3">{SEGMENTS[s.segment]}{s.city ? ` · ${s.city}` : ""}</span>
                    </td>
                    <td className="py-2.5 pr-3 text-ink-2">{PACKAGES[s.package]}</td>
                    <td className="py-2.5 pr-3 text-ink-2">{METHODS[s.payment_method]}{s.installments_count > 1 && s.package !== "mensal" ? ` · ${s.installments_count}x` : ""}</td>
                    <td className="num py-2.5 pr-3 text-right font-medium">{money(s.gross_amount)}</td>
                    <td className="num py-2.5 pr-3 text-right text-ink-2">{money(paidBySale.get(s.id) ?? 0)}</td>
                    <td className="py-2.5 pr-3"><StatusCell sale={s} overdue={overdueSales.has(s.id)} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

function StatusCell({ sale, overdue }: { sale: Sale; overdue: boolean }) {
  return (
    <span className="inline-flex flex-wrap items-center gap-1">
      <Pill tone={STATUS_TONE[sale.status]}>{SALE_STATUS[sale.status]}</Pill>
      {overdue && <Pill tone="danger">Atrasada</Pill>}
    </span>
  );
}

function Filter<K extends string>({ label, value, onChange, options }: {
  label: string; value: K | ""; onChange: (v: K | "") => void; options: [K, string][];
}) {
  return (
    <label>
      <span className="sr-only">{label}</span>
      <select className="input" value={value} onChange={(e) => onChange(e.target.value as K | "")} aria-label={label}>
        <option value="">{label}: todos</option>
        {options.map(([k, v]) => <option key={k} value={k}>{v}</option>)}
      </select>
    </label>
  );
}
