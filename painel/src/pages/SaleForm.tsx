import { useMemo, useRef, useState, type FormEvent } from "react";
import {
  adjustmentsEnd, defaultFee, domainRenewal, installmentCountFor, isRecurring, netAmount, planInstallments,
} from "../domain/calc";
import { dateBR, money } from "../domain/format";
import {
  METHODS, ORIGINS, PACKAGES, PLATFORMS, SALE_STATUS, SEGMENTS, entries,
} from "../domain/labels";
import { parsePaymentText, type ParsedPayment } from "../domain/parser";
import { saveSale, type SaleDraft } from "../domain/service";
import type { PaymentMethod, Platform } from "../domain/types";
import { href, navigate } from "../data/router";
import { alive, useStore } from "../data/store";
import {
  Button, DateField, Field, MoneyField, NumberField, PageHeader, SelectField, TextArea, TextField, cx,
} from "../ui/kit";

function emptyDraft(today: string): SaleDraft {
  return {
    client: "", segment: "outro", city: null, contact: null, lead_origin: null, referred_by: null,
    package: "outro", description: null, gross_amount: 0, payment_method: "pix", installments_count: 1,
    platform: "direto", fee_percent: 0, sale_date: today, first_payment_date: today, status: "aceita",
    recurring_active: false, draft_sent_at: null, published_at: null, adjustments_end: null,
    domain_expires_at: null, domain: null, site_url: null, notes: null, refunded_at: null, lead_id: null,
  };
}

const QUICK_METHODS: PaymentMethod[] = ["pix", "cartao_avista", "cartao_parcelado", "boleto", "transferencia"];

export function SaleForm({ saleId, leadId }: { saleId?: string; leadId?: string | null }) {
  const { data, today, commit, author, toast } = useStore();
  const existing = saleId ? data.sales.find((s) => s.id === saleId && !s.deleted_at) : undefined;
  const lead = leadId ? data.leads.find((l) => l.id === leadId) : undefined;

  const [draft, setDraft] = useState<SaleDraft>(() => {
    if (existing) {
      const { created_at: _c, updated_at: _u, deleted_at: _d, net_amount: _n, ...rest } = existing;
      return rest;
    }
    const d = emptyDraft(today);
    d.fee_percent = defaultFee(data.settings, d.platform, d.payment_method);
    if (lead) {
      Object.assign(d, {
        client: lead.name, segment: lead.segment, lead_origin: lead.origin, lead_id: lead.id,
        gross_amount: lead.offered_amount ?? 0, notes: lead.notes,
      });
    }
    return d;
  });
  const [touched, setTouched] = useState({ fee: !!existing, firstPay: !!existing, adjust: !!existing?.adjustments_end, domain: !!existing?.domain_expires_at });
  const [errors, setErrors] = useState<Partial<Record<"client" | "gross_amount" | "sale_date" | "first_payment_date", string>>>({});
  const [paste, setPaste] = useState("");
  const [parsed, setParsed] = useState<ParsedPayment | null>(null);
  const [saving, setSaving] = useState(false);
  const [moreOpen, setMoreOpen] = useState(!!existing);
  const formRef = useRef<HTMLFormElement>(null);

  const set = <K extends keyof SaleDraft>(k: K, v: SaleDraft[K]) => setDraft((d) => ({ ...d, [k]: v }));

  function setPayment(platform: Platform, method: PaymentMethod) {
    setDraft((d) => ({
      ...d, platform, payment_method: method,
      installments_count: method === "pix" || method === "cartao_avista" ? 1 : method === "cartao_parcelado" && d.installments_count < 2 ? 2 : d.installments_count,
      fee_percent: touched.fee ? d.fee_percent : defaultFee(data.settings, platform, method),
    }));
  }

  // Clientes já cadastrados (autocompletar)
  const clients = useMemo(() => {
    const m = new Map<string, (typeof data.sales)[number]>();
    for (const s of [...alive(data.sales)].sort((a, b) => a.sale_date.localeCompare(b.sale_date))) m.set(s.client, s);
    return m;
  }, [data.sales]);

  function onClient(name: string) {
    const known = clients.get(name);
    setDraft((d) => ({
      ...d, client: name,
      ...(known && !existing ? {
        segment: d.segment === "outro" ? known.segment : d.segment,
        city: d.city ?? known.city, contact: d.contact ?? known.contact,
      } : {}),
    }));
  }

  function applyParsed(p: ParsedPayment) {
    setDraft((d) => {
      const method = p.payment_method ?? d.payment_method;
      const platform = p.platform ?? d.platform;
      const date = p.date ?? d.sale_date;
      return {
        ...d,
        client: p.client ?? d.client,
        gross_amount: p.gross_amount ?? d.gross_amount,
        payment_method: method,
        platform,
        installments_count: installmentCountFor(method, p.installments_count ?? d.installments_count),
        fee_percent: touched.fee ? d.fee_percent : defaultFee(data.settings, platform, method),
        sale_date: date,
        first_payment_date: touched.firstPay ? d.first_payment_date : date,
      };
    });
    setParsed(null);
    setPaste("");
    toast({ message: "Dados aplicados. Confira antes de salvar." });
  }

  const recurring = isRecurring(draft);
  const count = recurring ? 1 : installmentCountFor(draft.payment_method, draft.installments_count);
  const net = netAmount(draft.gross_amount, draft.fee_percent);
  const plan = useMemo(() => (draft.gross_amount > 0 && draft.first_payment_date ? planInstallments({ ...draft, installments_count: count }) : []),
    [draft, count]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    const errs: typeof errors = {};
    if (!draft.client.trim()) errs.client = "Informe o cliente.";
    if (!(draft.gross_amount > 0)) errs.gross_amount = "Informe um valor maior que zero.";
    if (!draft.sale_date) errs.sale_date = "Informe a data da venda.";
    if (!draft.first_payment_date) errs.first_payment_date = "Informe a data do primeiro pagamento.";
    setErrors(errs);
    if (Object.keys(errs).length) {
      if (errs.first_payment_date) setMoreOpen(true);
      requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());
      return;
    }
    setSaving(true);
    const result = saveSale(data, { ...draft, installments_count: count }, author, today);
    const changes = result.changes;
    if (lead && !existing) {
      changes.leads = [{ ...lead, sale_id: result.sale.id, updated_at: new Date().toISOString() }];
    }
    const ok = await commit(changes, { message: result.warning ?? (existing ? "Venda atualizada." : "Venda salva.") });
    setSaving(false);
    if (ok) navigate(`/vendas/${result.sale.id}`);
  }

  if (saleId && !existing) {
    return <p>Venda não encontrada. <a className="text-accent underline" href={href("/vendas")}>Voltar para vendas</a></p>;
  }

  return (
    <form ref={formRef} onSubmit={submit} noValidate className="mx-auto max-w-3xl">
      <PageHeader title={existing ? `Editar venda` : "Nova venda"} sub={existing ? existing.client : lead ? `A partir do lead ${lead.name}` : "Só o essencial. O resto fica em “Mais detalhes”."} />

      {/* Colar texto */}
      {!existing && (
        <details className="group mb-6 rounded-xl border border-line bg-surface">
          <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-4 text-[15px] font-medium [&::-webkit-details-marker]:hidden">
            Colar texto do comprovante ou da mensagem
            <span aria-hidden="true" className="text-ink-3 transition-transform duration-150 group-open:rotate-45">+</span>
          </summary>
          <div className="border-t border-line px-4 py-4">
            <TextArea
              label="Texto colado"
              hint="Ex.: a notificação do Asaas, um comprovante de Pix ou a mensagem do cliente. Nada é salvo sem você confirmar."
              value={paste}
              rows={4}
              onChange={(e) => { setPaste(e.target.value); setParsed(e.target.value.trim() ? parsePaymentText(e.target.value) : null); }}
            />
            {parsed && (
              <div className="mt-3" aria-live="polite">
                {parsed.found.length === 0 ? (
                  <p className="text-[14px] text-ink-3">Não reconheci nenhum dado nesse texto.</p>
                ) : (
                  <>
                    <p className="text-[13px] text-ink-3">Reconheci:</p>
                    <dl className="mt-1 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-[14.5px]">
                      {parsed.found.map((f) => (
                        <div key={f.field} className="contents">
                          <dt className="text-ink-3">{f.label}</dt>
                          <dd className="num font-medium">{f.value}</dd>
                        </div>
                      ))}
                    </dl>
                    <Button className="mt-3" variant="primary" size="sm" onClick={() => applyParsed(parsed)}>Usar estes dados</Button>
                  </>
                )}
              </div>
            )}
          </div>
        </details>
      )}

      {/* Essencial */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Cliente" required htmlFor="cliente" error={errors.client} className="sm:col-span-2">
          <input
            id="cliente" className="input" list="clientes" autoComplete="off" required value={draft.client}
            aria-invalid={errors.client ? true : undefined}
            autoFocus={!existing && !lead}
            onChange={(e) => onClient(e.target.value)}
            placeholder="Nome da pessoa ou empresa"
          />
          <datalist id="clientes">{[...clients.keys()].map((c) => <option key={c} value={c} />)}</datalist>
        </Field>

        <MoneyField label={recurring ? "Valor mensal" : "Valor"} required value={draft.gross_amount || null}
          onChange={(v) => set("gross_amount", v ?? 0)} error={errors.gross_amount} />
        <DateField label="Data da venda (aceite)" required value={draft.sale_date} error={errors.sale_date}
          onChange={(v) => setDraft((d) => ({ ...d, sale_date: v ?? "", first_payment_date: touched.firstPay ? d.first_payment_date : (v ?? "") }))} />

        <fieldset className="sm:col-span-2">
          <legend className="mb-1.5 text-[13px] font-medium text-ink-2">Forma de pagamento</legend>
          <div className="flex flex-wrap gap-2">
            {QUICK_METHODS.map((m) => (
              <label key={m} className={cx(
                "inline-flex min-h-11 cursor-pointer items-center rounded-lg border px-3 text-[14.5px] lg:min-h-10",
                draft.payment_method === m ? "border-accent bg-accent-soft font-semibold text-accent-strong" : "border-line-strong bg-surface text-ink-2",
                "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[var(--focus)]",
              )}>
                <input type="radio" name="forma" value={m} className="sr-only" checked={draft.payment_method === m}
                  onChange={() => setPayment(draft.platform, m)} />
                {METHODS[m]}
              </label>
            ))}
          </div>
        </fieldset>

        {!recurring && draft.payment_method !== "pix" && draft.payment_method !== "cartao_avista" && (
          <NumberField label="Parcelas" value={draft.installments_count} min={1} max={24}
            onChange={(v) => set("installments_count", v ?? 1)} suffix="x" />
        )}
        <SelectField label="Plataforma" value={draft.platform} options={entries(PLATFORMS)}
          onChange={(v) => setPayment(v, draft.payment_method)} />
      </div>

      {/* Cálculo ao vivo */}
      <section aria-live="polite" className="mt-6 rounded-xl border border-line bg-surface px-4 py-4">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
          <div>
            <p className="text-[13px] text-ink-3">Líquido {draft.fee_percent > 0 ? `(taxa ${String(draft.fee_percent).replace(".", ",")}%)` : "(sem taxa)"}</p>
            <p className="num text-[24px] font-semibold tracking-[-0.02em]">{money(net)}{recurring && <span className="text-[15px] font-normal text-ink-3"> / mês</span>}</p>
          </div>
          {!recurring && count > 1 && plan.length > 0 && (
            <div className="text-right">
              <p className="text-[13px] text-ink-3">Parcela</p>
              <p className="num text-[18px] font-semibold">{count}x de {money(plan[plan.length - 1].gross_amount)}</p>
            </div>
          )}
        </div>
        {plan.length > 0 && (
          <ol className="num mt-3 flex flex-wrap gap-x-4 gap-y-1 border-t border-line pt-3 text-[13.5px] text-ink-2">
            {plan.map((p) => (
              <li key={p.number}><span className="text-ink-3">{p.number}ª</span> {dateBR(p.due_date)} · {money(p.gross_amount)}</li>
            ))}
            {recurring && <li className="text-ink-3">e uma nova mensalidade todo mês, até encerrar a assinatura</li>}
          </ol>
        )}
        {!touched.fee && draft.fee_percent === 0 && (
          <p className="mt-2 text-[12.5px] text-ink-3">Taxa padrão desta plataforma e forma: 0%. Ajuste em Configurações ou em “Mais detalhes”.</p>
        )}
      </section>

      {/* Mais detalhes */}
      <details open={moreOpen} onToggle={(e) => setMoreOpen((e.target as HTMLDetailsElement).open)} className="group mt-6 border-t border-line">
        <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between text-[15px] font-medium [&::-webkit-details-marker]:hidden">
          Mais detalhes
          <span aria-hidden="true" className="text-ink-3 transition-transform duration-150 group-open:rotate-45">+</span>
        </summary>
        <div className="grid gap-4 pb-2 pt-2 sm:grid-cols-2">
          <SelectField label="Pacote" value={draft.package} options={entries(PACKAGES)} onChange={(v) => set("package", v)}
            hint={draft.package === "mensal" ? "Plano mensal: gera uma mensalidade por mês até você encerrar." : undefined} />
          <SelectField label="Status" value={draft.status} options={entries(SALE_STATUS)} onChange={(v) => set("status", v)} />
          <SelectField label="Segmento" value={draft.segment} options={entries(SEGMENTS)} onChange={(v) => set("segment", v)} />
          <TextField label="Cidade" value={draft.city ?? ""} onChange={(e) => set("city", e.target.value || null)} autoComplete="address-level2" />
          <TextField label="Contato (WhatsApp)" type="tel" inputMode="tel" value={draft.contact ?? ""} onChange={(e) => set("contact", e.target.value || null)} placeholder="(35) 9 9999-9999" />
          <SelectField label="Origem do lead" value={draft.lead_origin} placeholder="Não informada" options={entries(ORIGINS)} onChange={(v) => set("lead_origin", v || null)} />
          <TextField label="Indicado por" value={draft.referred_by ?? ""} onChange={(e) => set("referred_by", e.target.value || null)} />
          <TextField label="Descrição curta" value={draft.description ?? ""} onChange={(e) => set("description", e.target.value || null)} />
          <NumberField label="Taxa total" suffix="%" min={0} max={99} value={draft.fee_percent}
            hint="Padrão vem das configurações; pode mudar só nesta venda."
            onChange={(v) => { setTouched((t) => ({ ...t, fee: true })); set("fee_percent", v ?? 0); }} />
          <DateField label="Data do primeiro pagamento" required value={draft.first_payment_date} error={errors.first_payment_date}
            onChange={(v) => { setTouched((t) => ({ ...t, firstPay: true })); set("first_payment_date", v ?? ""); }} />

          <h3 className="eyebrow mt-2 sm:col-span-2">Projeto</h3>
          <DateField label="Rascunho enviado em" value={draft.draft_sent_at} onChange={(v) => set("draft_sent_at", v)} />
          <DateField label="Publicado em" value={draft.published_at}
            onChange={(v) => setDraft((d) => ({
              ...d, published_at: v,
              adjustments_end: touched.adjust ? d.adjustments_end : adjustmentsEnd(v),
              domain_expires_at: touched.domain ? d.domain_expires_at : domainRenewal(v),
            }))} />
          <DateField label="Fim dos ajustes" value={draft.adjustments_end} hint="Publicação + 30 dias. Pode alterar."
            onChange={(v) => { setTouched((t) => ({ ...t, adjust: true })); set("adjustments_end", v); }} />
          <DateField label="Vencimento do domínio" value={draft.domain_expires_at} hint="Renovação anual. Sugestão: 1 ano após publicar."
            onChange={(v) => { setTouched((t) => ({ ...t, domain: true })); set("domain_expires_at", v); }} />
          <TextField label="Domínio" value={draft.domain ?? ""} onChange={(e) => set("domain", e.target.value.trim() || null)} placeholder="exemplo.com.br" autoCapitalize="none" />
          <TextField label="URL do site" type="url" value={draft.site_url ?? ""} onChange={(e) => set("site_url", e.target.value.trim() || null)} placeholder="https://" autoCapitalize="none" />
          <TextArea label="Observações" className="sm:col-span-2" value={draft.notes ?? ""} onChange={(e) => set("notes", e.target.value || null)} />
        </div>
      </details>

      {/* Ações: fixas no rodapé do celular, para salvar com o polegar */}
      <div className="sticky bottom-0 z-20 -mx-4 mt-6 flex gap-2 border-t border-line bg-bg/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:static lg:mx-0 lg:border-0 lg:bg-transparent lg:px-0 max-lg:bottom-[calc(56px+env(safe-area-inset-bottom))]">
        <Button variant="secondary" onClick={() => history.back()} className="flex-1 lg:flex-none">Cancelar</Button>
        <Button type="submit" variant="primary" disabled={saving} className="flex-[2] lg:flex-none lg:px-8">
          {saving ? "Salvando…" : existing ? "Salvar alterações" : "Salvar venda"}
        </Button>
      </div>
    </form>
  );
}
