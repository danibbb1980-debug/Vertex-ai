"use client";

import { useId, useState } from "react";
import { CheckCircle2, MessageCircle } from "lucide-react";
import { Button, LinkButton } from "./Button";
import { leadForm } from "@/lib/content";
import { whatsappLeadUrl, type Lead } from "@/lib/site";
import { track } from "@/lib/analytics";

type Field = keyof Lead;
type Errors = Partial<Record<Field, string>>;

const NEEDS_MAX = 600;

/** Formats as the user types: (35) 98448-7206 — fewer malformed numbers. */
function maskPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10)
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

const empty: Lead = { name: "", company: "", phone: "", segment: "", needs: "" };

/**
 * Lead capture with a WhatsApp handoff — no backend.
 *
 * On submit the form validates all five fields, then opens WhatsApp with the
 * whole lead pre-written into the message. Labels are always visible (never
 * placeholder-only), errors render next to their field, and validation only
 * fires after the first submit attempt so the form never scolds someone
 * mid-typing.
 */
export function LeadForm({ location = "form" }: { location?: string }) {
  const id = useId();
  const [values, setValues] = useState<Lead>(empty);
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [done, setDone] = useState(false);
  /** Kept so the success screen can re-open the exact same message. */
  const [leadUrl, setLeadUrl] = useState("");

  const validate = (next: Lead): Errors => {
    const found: Errors = {};
    if (next.name.trim().length < 2) found.name = "Digite seu nome.";
    if (next.company.trim().length < 2)
      found.company = "Digite o nome do seu negócio.";
    if (next.phone.replace(/\D/g, "").length < 10)
      found.phone = "Digite um WhatsApp com DDD.";
    if (!next.segment) found.segment = "Escolha o tipo de negócio.";
    if (next.needs.trim().length < 10)
      found.needs = "Conte em uma frase o que você precisa.";
    return found;
  };

  const update = (field: Field, value: string) => {
    const next = { ...values, [field]: value };
    setValues(next);
    if (submitted) setErrors(validate(next));
  };

  /*
   * Deliberately synchronous — no `await` anywhere before window.open.
   * Safari and iOS only treat a popup as user-initiated while the original
   * gesture is still on the stack; a single await is enough to get it blocked.
   */
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitted(true);

    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      track("form_error", { fields: Object.keys(found).join(",") });
      return;
    }

    const url = whatsappLeadUrl(values);
    setLeadUrl(url);
    track("lead_submit", { segment: values.segment, form_location: location });

    // Fall back to a same-tab navigation if the popup is blocked.
    const opened = window.open(url, "_blank", "noopener,noreferrer");
    if (!opened) window.location.href = url;

    setDone(true);
  };

  if (done) {
    return (
      <div className="surface-card rounded-2xl p-8 text-center" role="status">
        <CheckCircle2 className="mx-auto mb-4 size-10 text-mint" aria-hidden="true" />
        <h3 className="text-xl font-semibold">{leadForm.successTitle}</h3>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-mist">
          {leadForm.successBody}
        </p>
        <LinkButton
          href={leadUrl}
          target="_blank"
          rel="noopener noreferrer"
          variant="whatsapp"
          className="mt-6"
          trackAs="form-success"
        >
          <MessageCircle className="size-4" aria-hidden="true" />
          Abrir WhatsApp
        </LinkButton>
      </div>
    );
  }

  const fieldClass = (hasError: boolean) =>
    `w-full rounded-xl border bg-ink/60 px-4 text-[0.95rem] text-cloud transition-colors duration-200 placeholder:text-mist-dim ${
      hasError ? "border-rose" : "border-line hover:border-white/20"
    }`;

  /** Renders label + error wiring once, so every field stays consistent. */
  const fieldProps = (field: Field) => ({
    id: `${id}-${field}`,
    name: field,
    "aria-invalid": Boolean(errors[field]),
    "aria-describedby": errors[field] ? `${id}-${field}-error` : undefined,
  });

  const Label = ({ field, text }: { field: Field; text: string }) => (
    <label
      htmlFor={`${id}-${field}`}
      className="mb-1.5 block text-sm font-medium text-cloud"
    >
      {text}
    </label>
  );

  const Error = ({ field }: { field: Field }) =>
    errors[field] ? (
      <p id={`${id}-${field}-error`} className="mt-1.5 text-xs text-rose">
        {errors[field]}
      </p>
    ) : null;

  return (
    <form onSubmit={handleSubmit} noValidate className="surface-card rounded-2xl p-6 sm:p-8">
      <h3 className="text-xl font-semibold sm:text-2xl">{leadForm.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-mist">{leadForm.sub}</p>

      <div className="mt-6 space-y-4">
        <div>
          <Label field="name" text={leadForm.fields.name.label} />
          <input
            {...fieldProps("name")}
            type="text"
            autoComplete="name"
            className={`${fieldClass(Boolean(errors.name))} min-h-12`}
            placeholder={leadForm.fields.name.placeholder}
            value={values.name}
            onChange={(event) => update("name", event.target.value)}
          />
          <Error field="name" />
        </div>

        <div>
          <Label field="company" text={leadForm.fields.company.label} />
          <input
            {...fieldProps("company")}
            type="text"
            autoComplete="organization"
            className={`${fieldClass(Boolean(errors.company))} min-h-12`}
            placeholder={leadForm.fields.company.placeholder}
            value={values.company}
            onChange={(event) => update("company", event.target.value)}
          />
          <Error field="company" />
        </div>

        <div>
          <Label field="phone" text={leadForm.fields.phone.label} />
          <input
            {...fieldProps("phone")}
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            className={`${fieldClass(Boolean(errors.phone))} min-h-12`}
            placeholder={leadForm.fields.phone.placeholder}
            value={values.phone}
            onChange={(event) => update("phone", maskPhone(event.target.value))}
          />
          <Error field="phone" />
        </div>

        <div>
          <Label field="segment" text={leadForm.fields.segment.label} />
          <select
            {...fieldProps("segment")}
            className={`${fieldClass(Boolean(errors.segment))} min-h-12 cursor-pointer appearance-none ${
              values.segment ? "" : "text-mist-dim"
            }`}
            value={values.segment}
            onChange={(event) => update("segment", event.target.value)}
          >
            <option value="">{leadForm.fields.segment.placeholder}</option>
            {leadForm.segments.map((segment) => (
              <option key={segment} value={segment}>
                {segment}
              </option>
            ))}
          </select>
          <Error field="segment" />
        </div>

        <div>
          <Label field="needs" text={leadForm.fields.needs.label} />
          <textarea
            {...fieldProps("needs")}
            rows={3}
            maxLength={NEEDS_MAX}
            className={`${fieldClass(Boolean(errors.needs))} resize-y py-3 leading-relaxed`}
            placeholder={leadForm.fields.needs.placeholder}
            value={values.needs}
            onChange={(event) => update("needs", event.target.value)}
          />
          <div className="mt-1.5 flex items-start justify-between gap-3">
            <Error field="needs" />
            <span className="ml-auto shrink-0 text-xs text-mist-dim">
              {values.needs.length}/{NEEDS_MAX}
            </span>
          </div>
        </div>
      </div>

      <Button type="submit" size="lg" className="mt-6 w-full" trackAs={location}>
        <MessageCircle className="size-4" aria-hidden="true" />
        {leadForm.submit}
      </Button>

      <p className="mt-3 text-center text-xs text-mist-dim">{leadForm.privacy}</p>
    </form>
  );
}
