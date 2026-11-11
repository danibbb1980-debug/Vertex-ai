import { useMemo, useState } from "react";
import {
  adjustmentsEndingSoon, effectiveStatus, meiStatus, monthMetrics, pendingRefund, receivedInYear,
} from "../domain/calc";
import { nextDays } from "../domain/events";
import { dateBR, money, monthKey, monthLabel, percent, shiftMonth } from "../domain/format";
import { saveSale } from "../domain/service";
import { FIRST_SALE } from "../data/seed";
import { href, navigate } from "../data/router";
import { alive, useStore } from "../data/store";
import { EventList } from "../ui/EventList";
import { Button, Empty, Section, Segmented, cx } from "../ui/kit";
import { RevenueChart } from "../ui/RevenueChart";

type Basis = "caixa" | "competencia";

function usePersisted<T extends string>(key: string, fallback: T): [T, (v: T) => void] {
  const [v, setV] = useState<T>(() => {
    try { return (localStorage.getItem(key) as T) || fallback; } catch { return fallback; }
  });
  return [v, (n: T) => { setV(n); try { localStorage.setItem(key, n); } catch { /* opcional */ } }];
}

export function Dashboard() {
  const { data, today, commit, saveSettings, author } = useStore();
  const [month, setMonth] = useState(monthKey(today));
  const [basis, setBasis] = usePersisted<Basis>("lumivo-painel:base", "caixa");
  const [range, setRange] = usePersisted<"6" | "12">("lumivo-painel:meses", "6");

  const m = useMemo(() => monthMetrics(data, month), [data, month]);
  const cash = basis === "caixa";
  const result = cash ? m.resultCash : m.resultAccrual;
  const income = cash ? m.receivedNet : m.soldNet;

  const chartRows = useMemo(() => {
    const n = Number(range);
    return Array.from({ length: n }, (_, i) => {
      const key = shiftMonth(month, i - n + 1);
      const mm = monthMetrics(data, key);
      return { key, income: cash ? mm.receivedNet : mm.soldNet, costs: mm.costs };
    });
  }, [data, month, range, cash]);

  const year = month.slice(0, 4);
  const mei = meiStatus(receivedInYear(data, year), data.settings.mei_other_revenue, data.settings.mei_limit);

  const upcoming = useMemo(() => nextDays(data, today, 7), [data, today]);
  const sales = alive(data.sales);
  const refunds = sales.map((s) => ({ s, v: pendingRefund(s, data.installments) })).filter((x) => x.v > 0);
  const ending = sales.filter((s) => adjustmentsEndingSoon(s, today));
  const salesById = new Map(sales.map((s) => [s.id, s]));
  const overdue = alive(data.installments).filter((i) => effectiveStatus(i, salesById.get(i.sale_id), today) === "atrasada");

  const goal = data.settings.monthly_goal;
  const goalValue = cash ? m.receivedNet : m.soldGross;
  const goalRatio = goal > 0 ? Math.min(1, goalValue / goal) : 0;

  const showFirstSale = sales.length === 0 && !data.settings.first_sale_prompt_done;

  async function createFirstSale() {
    const { changes } = saveSale(data, FIRST_SALE, author, today);
    await commit(changes, { message: "Primeira venda cadastrada." });
    await saveSettings({ first_sale_prompt_done: true });
  }

  return (
    <div>
      {/* Cabeçalho: mês e base de cálculo */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1">
          <button type="button" onClick={() => setMonth(shiftMonth(month, -1))} aria-label="Mês anterior"
            className="min-h-11 min-w-11 rounded-lg text-ink-2 hover:bg-surface-2 hover:text-ink">
            <Chevron dir="left" />
          </button>
          <h1 className="min-w-[10.5rem] text-center text-[19px] font-semibold tracking-[-0.01em] lg:text-[21px]" aria-live="polite">
            {monthLabel(month)}
          </h1>
          <button type="button" onClick={() => setMonth(shiftMonth(month, 1))} aria-label="Próximo mês"
            className="min-h-11 min-w-11 rounded-lg text-ink-2 hover:bg-surface-2 hover:text-ink">
            <Chevron dir="right" />
          </button>
          {month !== monthKey(today) && (
            <button type="button" onClick={() => setMonth(monthKey(today))} className="ml-1 min-h-11 rounded-lg px-2 text-[14px] text-accent underline underline-offset-2">
              Mês atual
            </button>
          )}
        </div>
        <div className="flex flex-col items-start gap-1 sm:items-end">
          <Segmented label="Base de cálculo" value={basis} onChange={setBasis}
            options={[["caixa", "Caixa"], ["competencia", "Competência"]]} />
          <p className="text-[12.5px] text-ink-3">
            {cash ? "Caixa: o dinheiro que entrou no mês, pela data de recebimento." : "Competência: o que foi vendido no mês, pela data da venda."}
          </p>
        </div>
      </div>

      {showFirstSale && (
        <div className="mb-6 rounded-xl border border-accent/40 bg-accent-soft px-4 py-4 sm:px-5">
          <p className="font-semibold">Comece pela sua primeira venda</p>
          <p className="mt-1 text-[14px] text-ink-2">
            Diego Silva Advocacia · Advocacia · R$ 297,00 no cartão em 3x de R$ 99,00 · Asaas · 10/11/2026 · Paga.
            As 3 parcelas entram como “a receber”; marque cada uma quando cair na conta.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button variant="primary" onClick={createFirstSale}>Cadastrar minha primeira venda</Button>
            <Button variant="ghost" onClick={() => saveSettings({ first_sale_prompt_done: true })}>Agora não</Button>
          </div>
        </div>
      )}

      {(refunds.length > 0 || ending.length > 0 || overdue.length > 0) && (
        <ul className="mb-6 flex flex-col gap-2" aria-label="Alertas">
          {refunds.map(({ s, v }) => (
            <Alert key={`r-${s.id}`} tone="danger" to={`/vendas/${s.id}`}>
              Reembolso pendente: {s.client} ({money(v)} já recebidos de uma venda cancelada).
            </Alert>
          ))}
          {overdue.length > 0 && (
            <Alert tone="danger" to="/vendas?status=atrasada">
              {overdue.length === 1 ? "1 parcela atrasada" : `${overdue.length} parcelas atrasadas`} ({money(overdue.reduce((a, i) => a + i.gross_amount, 0))}).
            </Alert>
          )}
          {ending.map((s) => (
            <Alert key={`a-${s.id}`} tone="warn" to={`/vendas/${s.id}`}>
              Ajustes de {s.client} terminam em {dateBR(s.adjustments_end)}.
            </Alert>
          ))}
        </ul>
      )}

      <div className="grid gap-x-10 gap-y-8 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0">
          {/* Resultado: o maior número da tela */}
          <section aria-labelledby="resultado">
            <h2 id="resultado" className="eyebrow">Resultado do mês</h2>
            <p className={cx("num mt-1 text-[44px] font-semibold leading-none tracking-[-0.035em] sm:text-[56px] lg:text-[64px]", result < 0 && "text-danger")}>
              {money(result)}
            </p>
            <p className="num mt-2 text-[14px] text-ink-3">
              {cash ? "Recebido líquido" : "Vendido líquido"} {money(income)} − custos {money(m.costs)}
            </p>
          </section>

          {/* Números do mês, separados por fios */}
          <dl className="mt-6 grid grid-cols-2 gap-px border-y border-line bg-line sm:grid-cols-3">
            <Figure label="Recebido no mês" value={money(m.receivedNet)} note={m.receivedGross !== m.receivedNet ? `bruto ${money(m.receivedGross)}` : "líquido"} strong={cash} />
            <Figure label="A receber no mês" value={money(m.toReceiveNet)} note="previsto, líquido" />
            <Figure label="Vendido no mês" value={money(m.soldGross)} note="bruto, pela data da venda" strong={!cash} />
            <Figure label="Custos do mês" value={money(m.costs)} note={<a href={href("/custos")} className="underline underline-offset-2">ver custos</a>} />
            <Figure label="Ticket médio" value={m.salesCount ? money(m.ticket) : "—"} note="vendas do mês" />
            <Figure label="Vendas" value={String(m.salesCount)} note={m.salesCount === 1 ? "venda no mês" : "vendas no mês"} />
          </dl>

          {/* Meta */}
          <section className="mt-7" aria-labelledby="meta">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 id="meta" className="eyebrow">Meta do mês</h2>
              {goal > 0 ? (
                <p className="num text-[14px] text-ink-2">
                  {money(goalValue)} de {money(goal)} · {goalValue >= goal ? "meta batida" : `faltam ${money(goal - goalValue)}`}
                </p>
              ) : (
                <a href={href("/config")} className="text-[14px] text-accent underline underline-offset-2">Definir meta mensal</a>
              )}
            </div>
            <div
              className="mt-2 h-2.5 overflow-hidden rounded-full bg-surface-2 ring-1 ring-inset ring-line"
              role="progressbar" aria-label="Progresso da meta mensal"
              aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(goalRatio * 100)}
            >
              <div className="h-full rounded-full bg-accent transition-[width] duration-300" style={{ width: `${goalRatio * 100}%` }} />
            </div>
            <p className="mt-1.5 text-[12.5px] text-ink-3">{cash ? "Conta o recebido líquido do mês." : "Conta o vendido bruto do mês."}</p>
          </section>

          {/* Gráfico */}
          <Section
            title={`Últimos ${range} meses`}
            className="mt-8"
            action={<Segmented label="Período do gráfico" value={range} onChange={setRange} options={[["6", "6 meses"], ["12", "12 meses"]]} />}
          >
            <RevenueChart rows={chartRows} incomeLabel={cash ? "Recebido" : "Vendido"} selected={month} />
          </Section>
        </div>

        <aside className="flex min-w-0 flex-col gap-8">
          {/* MEI */}
          <Section title={`MEI · acumulado em ${year}`}>
            <p className="num text-[26px] font-semibold tracking-[-0.02em]">{money(mei.total)}</p>
            <p className="num text-[14px] text-ink-3">de {money(data.settings.mei_limit)} · {percent(mei.ratio * 100)}</p>
            <div className="relative mt-3 h-2.5 rounded-full bg-surface-2 ring-1 ring-inset ring-line"
              role="meter" aria-label="Uso do limite anual do MEI" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(mei.ratio * 100)}>
              <div className={cx("h-full rounded-full", mei.level === "ok" ? "bg-accent" : mei.level === "atencao" ? "bg-[#c48a12]" : "bg-danger")}
                style={{ width: `${Math.min(100, mei.ratio * 100)}%` }} />
              <span aria-hidden="true" className="absolute top-[-3px] h-4 w-px bg-ink-3" style={{ left: "70%" }} />
              <span aria-hidden="true" className="absolute top-[-3px] h-4 w-px bg-ink-3" style={{ left: "90%" }} />
            </div>
            <div className="num mt-1 flex text-[11.5px] text-ink-3" aria-hidden="true">
              <span className="w-[70%]" /><span className="-translate-x-1/2">70%</span><span className="ml-auto pr-[7%]">90%</span>
            </div>
            {mei.level !== "ok" && (
              <p className={cx("mt-2 rounded-md px-3 py-2 text-[13.5px]", mei.level === "atencao" ? "bg-warn-soft text-warn" : "bg-danger-soft text-danger")}>
                {mei.level === "atencao" && "Atenção: mais de 70% do limite anual."}
                {mei.level === "alto" && `Perto do limite: restam ${money(mei.remaining)}.`}
                {mei.level === "excedido" && "Limite anual ultrapassado. Fale com seu contador."}
              </p>
            )}
            <p className="mt-2 text-[12.5px] text-ink-3">
              Recebido bruto de vendas{data.settings.mei_other_revenue > 0 ? ` + ${money(data.settings.mei_other_revenue)} de outras receitas` : ""}.
              {" "}Soma informativa. Confirme as regras do MEI com seu contador.
            </p>
          </Section>

          {/* Próximos 7 dias */}
          <Section title="Próximos 7 dias" action={<a href={href("/agenda")} className="text-[13px] text-accent underline underline-offset-2">Calendário</a>}>
            {upcoming.length ? <EventList events={upcoming} today={today} /> : <Empty>Nada previsto para os próximos 7 dias.</Empty>}
          </Section>

          {sales.length === 0 && !showFirstSale && (
            <Button variant="primary" onClick={() => navigate("/vendas/nova")}>Lançar a primeira venda</Button>
          )}
        </aside>
      </div>
    </div>
  );
}

function Figure({ label, value, note, strong }: { label: string; value: string; note?: React.ReactNode; strong?: boolean }) {
  return (
    <div className="bg-bg px-3 py-3 first:pl-0 [&:nth-child(2n+1)]:pl-0 sm:[&:nth-child(2n+1)]:pl-3 sm:[&:nth-child(3n+1)]:pl-0">
      <dt className="text-[13px] text-ink-3">{label}</dt>
      <dd className={cx("num mt-0.5 text-[19px] font-semibold tracking-[-0.015em] sm:text-[21px]", strong && "text-accent-strong")}>{value}</dd>
      {note && <dd className="text-[12.5px] text-ink-3">{note}</dd>}
    </div>
  );
}

function Alert({ tone, to, children }: { tone: "warn" | "danger"; to: string; children: React.ReactNode }) {
  return (
    <li>
      <a href={href(to)} className={cx(
        "flex min-h-11 items-center justify-between gap-3 rounded-lg px-3 py-2 text-[14px] no-underline",
        tone === "warn" ? "bg-warn-soft text-warn" : "bg-danger-soft text-danger",
      )}>
        <span>{children}</span>
        <span aria-hidden="true">→</span>
      </a>
    </li>
  );
}

function Chevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true" className="mx-auto">
      <path d={dir === "left" ? "M11 4L6 9l5 5" : "M7 4l5 5-5 5"} stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
