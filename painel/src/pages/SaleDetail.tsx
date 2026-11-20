import { useState } from "react";
import { effectiveStatus, isRecurring, pendingRefund } from "../domain/calc";
import { dateBR, dateTimeBR, money, round2 } from "../domain/format";
import {
  INSTALLMENT_STATUS, METHODS, ORIGINS, PACKAGES, PLATFORMS, SALE_STATUS, SEGMENTS,
} from "../domain/labels";
import {
  editInstallment, endSubscription, markReceived, markRefunded, restore, saveSale, softDelete,
} from "../domain/service";
import type { Installment, InstallmentStatus } from "../domain/types";
import { href, navigate } from "../data/router";
import { alive, useStore } from "../data/store";
import {
  Button, DateField, Dialog, LinkButton, MoneyField, PageHeader, Pill, Section, cx, useConfirm, type Tone,
} from "../ui/kit";
import { STATUS_TONE } from "./Sales";

const INST_TONE: Record<InstallmentStatus, Tone> = {
  a_receber: "neutral", recebida: "accent", atrasada: "danger", cancelada: "muted",
};

export function SaleDetail({ id }: { id: string }) {
  const { data, today, commit, author } = useStore();
  const [ask, confirmNode] = useConfirm();
  const [editing, setEditing] = useState<Installment | null>(null);
  const sale = data.sales.find((s) => s.id === id);

  if (!sale || sale.deleted_at) {
    return <p>Venda não encontrada. <a className="text-accent underline" href={href("/vendas")}>Voltar para vendas</a></p>;
  }

  const installments = alive(data.installments).filter((i) => i.sale_id === sale.id).sort((a, b) => a.number - b.number);
  const received = installments.filter((i) => i.received_at).reduce((a, i) => a + i.gross_amount, 0);
  const refund = pendingRefund(sale, data.installments);
  const hist = data.sale_history.filter((h) => h.sale_id === sale.id).sort((a, b) => b.at.localeCompare(a.at));
  const recurring = isRecurring(sale);

  async function toggle(i: Installment) {
    await commit(markReceived(data, i.id, i.received_at ? null : today, author), {
      message: i.received_at ? `Parcela ${i.number} voltou para “a receber”.` : `Parcela ${i.number} recebida hoje.`,
    });
  }

  async function cancelOrReactivate() {
    if (!sale) return;
    const cancelling = sale.status !== "cancelada";
    if (cancelling) {
      const ok = await ask({
        title: "Cancelar esta venda?",
        body: <>A venda sai da receita e das previsões, mas continua no histórico.{received > 0 && <> Já foram recebidos <strong className="num">{money(received)}</strong>: vai aparecer um aviso de reembolso pendente.</>}</>,
        confirm: "Cancelar venda", danger: true,
      });
      if (!ok) return;
    }
    const { created_at: _c, updated_at: _u, deleted_at: _d, net_amount: _n, ...draft } = sale;
    const r = saveSale(data, { ...draft, status: cancelling ? "cancelada" : "aceita" }, author, today);
    await commit(r.changes, { message: cancelling ? "Venda cancelada." : "Venda reativada." });
  }

  async function remove() {
    if (!sale) return;
    const ok = await ask({
      title: "Excluir esta venda?",
      body: "Ela some das listas e dos cálculos. Dá para desfazer logo em seguida.",
      confirm: "Excluir", danger: true,
    });
    if (!ok) return;
    const ins = installments.map(softDelete);
    await commit({ sales: [softDelete(sale)], installments: ins }, {
      message: "Venda excluída.",
      undo: { sales: [restore(sale)], installments: ins.map(restore) },
    });
    navigate("/vendas");
  }

  async function endSub() {
    if (!sale) return;
    const ok = await ask({ title: "Encerrar assinatura?", body: "Não serão geradas novas mensalidades. As já criadas continuam como estão.", confirm: "Encerrar" });
    if (ok) await commit(endSubscription(data, sale.id, author), { message: "Assinatura encerrada." });
  }

  const timeline: [string, string | null][] = [
    ["Aceite", sale.sale_date],
    ["Rascunho enviado", sale.draft_sent_at],
    ["Publicação", sale.published_at],
    ["Fim dos ajustes", sale.adjustments_end],
    ["Vencimento do domínio", sale.domain_expires_at],
  ];
  const wa = sale.contact?.replace(/\D/g, "");

  return (
    <div>
      {confirmNode}
      <a href={href("/vendas")} className="mb-2 inline-flex min-h-9 items-center text-[14px] text-ink-3 underline-offset-2 hover:underline">← Vendas</a>
      <PageHeader
        title={sale.client}
        sub={<span className="inline-flex flex-wrap items-center gap-2"><Pill tone={STATUS_TONE[sale.status]}>{SALE_STATUS[sale.status]}</Pill>{SEGMENTS[sale.segment]} · {PACKAGES[sale.package]}{sale.city ? ` · ${sale.city}` : ""}</span>}
      >
        <LinkButton href={href(`/vendas/${sale.id}/editar`)}>Editar</LinkButton>
        {recurring && sale.recurring_active && <Button onClick={endSub}>Encerrar assinatura</Button>}
        <Button variant={sale.status === "cancelada" ? "secondary" : "danger"} onClick={cancelOrReactivate}>
          {sale.status === "cancelada" ? "Reativar" : "Cancelar venda"}
        </Button>
        <Button variant="ghost" onClick={remove}>Excluir</Button>
      </PageHeader>

      {refund > 0 && (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-lg bg-danger-soft px-4 py-3 text-danger">
          <p className="text-[14.5px]">Reembolso pendente: <strong className="num">{money(refund)}</strong> foram recebidos desta venda cancelada.</p>
          <Button size="sm" onClick={() => commit(markRefunded(data, sale.id, today, author), { message: "Reembolso registrado." })}>Marcar reembolso feito</Button>
        </div>
      )}

      <div className="grid gap-x-10 gap-y-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0">
          {/* Valores */}
          <dl className="grid grid-cols-2 gap-px border-y border-line bg-line sm:grid-cols-4">
            {[
              [recurring ? "Valor mensal" : "Valor bruto", money(sale.gross_amount)],
              ["Líquido", money(sale.net_amount)],
              ["Recebido", money(round2(received))],
              ["Taxa", `${String(sale.fee_percent).replace(".", ",")}%`],
            ].map(([k, v]) => (
              <div key={k} className="bg-bg px-3 py-3 [&:nth-child(odd)]:pl-0 sm:[&:nth-child(odd)]:pl-3 sm:first:pl-0">
                <dt className="text-[13px] text-ink-3">{k}</dt>
                <dd className="num text-[19px] font-semibold tracking-[-0.015em]">{v}</dd>
              </div>
            ))}
          </dl>

          <Section title={recurring ? "Mensalidades" : "Parcelas"} className="mt-8"
            action={recurring ? <span className="text-[13px] text-ink-3">{sale.recurring_active ? "Assinatura ativa" : "Assinatura encerrada"}</span> : undefined}>
            <ul className="divide-y divide-line border-b border-line">
              {installments.map((i) => {
                const st = effectiveStatus(i, sale, today);
                return (
                  <li key={i.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 py-3">
                    <span className="num w-8 text-[14px] text-ink-3">{i.number}ª</span>
                    <span className="min-w-[9rem] flex-1">
                      <span className="num block font-medium">{money(i.gross_amount)}<span className="font-normal text-ink-3"> · líq. {money(i.net_amount)}</span></span>
                      <span className="num block text-[13px] text-ink-3">
                        {i.received_at ? `Recebida em ${dateBR(i.received_at)}` : `Prevista para ${dateBR(i.due_date)}`}
                      </span>
                    </span>
                    <Pill tone={INST_TONE[st]}>{INSTALLMENT_STATUS[st]}</Pill>
                    <span className="flex gap-1">
                      {st !== "cancelada" && (
                        <Button size="sm" variant={i.received_at ? "ghost" : "primary"} onClick={() => toggle(i)}
                          aria-label={i.received_at ? `Desmarcar parcela ${i.number}` : `Marcar parcela ${i.number} como recebida`}>
                          {i.received_at ? "Desmarcar" : "Recebida"}
                        </Button>
                      )}
                      <Button size="sm" variant="ghost" onClick={() => setEditing(i)} aria-label={`Ajustar parcela ${i.number}`}>Ajustar</Button>
                    </span>
                  </li>
                );
              })}
            </ul>
          </Section>

          <Section title="Detalhes" className="mt-8">
            <dl className="grid grid-cols-1 gap-x-8 gap-y-2 text-[14.5px] sm:grid-cols-2">
              <Row k="Forma" v={`${METHODS[sale.payment_method]}${sale.installments_count > 1 && !recurring ? ` em ${sale.installments_count}x` : ""}`} />
              <Row k="Plataforma" v={PLATFORMS[sale.platform]} />
              <Row k="1º pagamento" v={dateBR(sale.first_payment_date)} />
              <Row k="Origem" v={sale.lead_origin ? ORIGINS[sale.lead_origin] : "—"} />
              <Row k="Indicado por" v={sale.referred_by ?? "—"} />
              <Row k="Contato" v={sale.contact ? (
                wa ? <a className="text-accent underline underline-offset-2" href={`https://wa.me/${wa.length <= 11 ? `55${wa}` : wa}`} target="_blank" rel="noreferrer noopener">{sale.contact}</a> : sale.contact
              ) : "—"} />
              <Row k="Domínio" v={sale.domain ?? "—"} />
              <Row k="Site" v={sale.site_url ? <a className="break-all text-accent underline underline-offset-2" href={sale.site_url} target="_blank" rel="noreferrer noopener">{sale.site_url.replace(/^https?:\/\//, "")}</a> : "—"} />
              {sale.description && <Row k="Descrição" v={sale.description} />}
            </dl>
            {sale.notes && <p className="mt-3 whitespace-pre-wrap rounded-lg bg-surface-2 px-3 py-2 text-[14.5px] text-ink-2">{sale.notes}</p>}
          </Section>
        </div>

        <aside className="flex min-w-0 flex-col gap-8">
          <Section title="Linha do tempo do projeto">
            <ol className="relative ml-1.5 border-l border-line-strong">
              {timeline.map(([label, date]) => {
                const done = !!date && date <= today;
                return (
                  <li key={label} className="relative pb-4 pl-5 last:pb-0">
                    <span aria-hidden="true" className={cx("absolute -left-[5px] top-1.5 h-[9px] w-[9px] rounded-full ring-2 ring-bg",
                      done ? "bg-accent" : date ? "bg-surface border border-accent" : "bg-line-strong")} />
                    <p className="text-[14px] font-medium">{label}</p>
                    <p className="num text-[13px] text-ink-3">{date ? `${dateBR(date)}${done ? "" : " · previsto"}` : "não informado"}</p>
                  </li>
                );
              })}
            </ol>
          </Section>

          <Section title="Histórico de edições">
            {hist.length ? (
              <ul className="flex flex-col gap-3">
                {hist.slice(0, 30).map((h) => (
                  <li key={h.id} className="text-[13.5px]">
                    <p className="num text-ink-3">{dateTimeBR(h.at)}{h.author ? ` · ${h.author}` : ""}</p>
                    <p className="text-ink-2">{h.summary}</p>
                  </li>
                ))}
              </ul>
            ) : <p className="text-[14px] text-ink-3">Sem registros.</p>}
          </Section>
        </aside>
      </div>

      {editing && (
        <InstallmentDialog
          inst={editing}
          onClose={() => setEditing(null)}
          onSave={async (patch) => {
            await commit(editInstallment(data, { id: editing.id, ...patch }, author), { message: "Parcela ajustada." });
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4 border-b border-line py-1.5 sm:block sm:border-0 sm:py-0">
      <dt className="text-ink-3">{k}</dt>
      <dd className="text-right sm:text-left">{v}</dd>
    </div>
  );
}

function InstallmentDialog({ inst, onClose, onSave }: {
  inst: Installment; onClose: () => void; onSave: (p: Partial<Installment>) => void;
}) {
  const [due, setDue] = useState<string | null>(inst.due_date);
  const [gross, setGross] = useState<number | null>(inst.gross_amount);
  const [net, setNet] = useState<number | null>(inst.net_amount);
  const [recv, setRecv] = useState<string | null>(inst.received_at);
  const valid = !!due && gross != null && gross >= 0 && net != null;
  return (
    <Dialog open onClose={onClose} title={`Ajustar parcela ${inst.number}`}
      footer={<>
        <Button onClick={onClose}>Voltar</Button>
        <Button variant="primary" disabled={!valid} onClick={() => valid && onSave({
          due_date: due!, gross_amount: gross!, net_amount: net!, received_at: recv,
          status: recv ? "recebida" : inst.status === "cancelada" ? "cancelada" : "a_receber",
        })}>Salvar</Button>
      </>}>
      <div className="grid gap-4">
        <DateField label="Data prevista" required value={due} onChange={setDue} />
        <MoneyField label="Valor bruto" value={gross} onChange={setGross} />
        <MoneyField label="Valor líquido" value={net} onChange={setNet} />
        <DateField label="Recebida em" value={recv} onChange={setRecv} hint="Deixe vazio se ainda não recebeu." />
      </div>
    </Dialog>
  );
}
