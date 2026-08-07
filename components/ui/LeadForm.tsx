"use client";

import { useId, useState } from "react";
import { CheckCircle2, MessageCircle } from "lucide-react";
import { Button, LinkButton } from "./Button";
import { leadForm } from "@/lib/content";
import { whatsappUrl } from "@/lib/site";
import { track } from "@/lib/analytics";

type Errors = Partial<Record<"name" | "phone" | "segment", string>>;

/** Formats as the user types: (11) 98765-4321 — fewer malformed numbers. */
function maskPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10)
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

/**
 * Three fields only.
 *
 * Every additional field measurably reduces completion, and name + WhatsApp +
 * segment is everything needed to open a qualified conversation. Labels are
 * always visible (never placeholder-only), errors render next to their field,
 * and validation only fires after the first submit attempt so the form never
 * scolds someone mid-typing.
 */
export function LeadForm({ location = "form" }: { location?: string }) {
  const id = useId();
  const [values, setValues] = useState({ name: "", phone: "", segment: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");

  const validate = (next = values): Errors => {
    const found: Errors = {};
    if (next.name.trim().length < 2) found.name = "Digite seu nome.";
    if (next.phone.replace(/\D/g, "").length < 10)
      found.phone = "Digite um WhatsApp com DDD.";
    if (!next.segment) found.segment = "Escolha um segmento.";
    return found;
  };

  const update = (field: keyof typeof values, value: string) => {
    const next = { ...values, [field]: value };
    setValues(next);
    if (submitted) setErrors(validate(next));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitted(true);
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) {
      track("form_error", { fields: Object.keys(found).join(",") });
      return;
    }

    setStatus("sending");
    track("lead_submit", { segment: values.segment, form_location: location });

    /*
     * No backend is wired up yet. Point this at your CRM, a Next.js route
     * handler, or a form service — then keep the WhatsApp fallback below,
     * which is where most Brazilian local-business leads actually convert.
     */
    await new Promise((resolve) => setTimeout(resolve, 700));
    setStatus("done");
  };

  if (status === "done") {
    return (
      <div className="surface-card rounded-2xl p-8 text-center" role="status">
        <CheckCircle2 className="mx-auto mb-4 size-10 text-mint" aria-hidden="true" />
        <h3 className="text-xl font-semibold">{leadForm.successTitle}</h3>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-mist">
          {leadForm.successBody}
        </p>
        <LinkButton
          href={whatsappUrl("pos-formulario")}
          target="_blank"
          rel="noopener noreferrer"
          variant="whatsapp"
          className="mt-6"
          trackAs="form-success"
        >
          <MessageCircle className="size-4" aria-hidden="true" />
          Abrir WhatsApp agora
        </LinkButton>
      </div>
    );
  }

  const fieldClass = (hasError: boolean) =>
    `min-h-12 w-full rounded-xl border bg-ink/60 px-4 text-[0.95rem] text-cloud transition-colors duration-200 placeholder:text-mist-dim ${
      hasError ? "border-rose" : "border-line hover:border-white/20"
    }`;

  return (
    <form onSubmit={handleSubmit} noValidate className="surface-card rounded-2xl p-6 sm:p-8">
      <h3 className="text-xl font-semibold sm:text-2xl">{leadForm.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-mist">{leadForm.sub}</p>

      <div className="mt-6 space-y-4">
        <div>
          <label htmlFor={`${id}-name`} className="mb-1.5 block text-sm font-medium text-cloud">
            {leadForm.fields.name.label}
          </label>
          <input
            id={`${id}-name`}
            name="name"
            type="text"
            autoComplete="name"
            className={fieldClass(Boolean(errors.name))}
            placeholder={leadForm.fields.name.placeholder}
            value={values.name}
            onChange={(event) => update("name", event.target.value)}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? `${id}-name-error` : undefined}
          />
          {errors.name && (
            <p id={`${id}-name-error`} className="mt-1.5 text-xs text-rose">
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label htmlFor={`${id}-phone`} className="mb-1.5 block text-sm font-medium text-cloud">
            {leadForm.fields.phone.label}
          </label>
          <input
            id={`${id}-phone`}
            name="phone"
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            className={fieldClass(Boolean(errors.phone))}
            placeholder={leadForm.fields.phone.placeholder}
            value={values.phone}
            onChange={(event) => update("phone", maskPhone(event.target.value))}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? `${id}-phone-error` : undefined}
          />
          {errors.phone && (
            <p id={`${id}-phone-error`} className="mt-1.5 text-xs text-rose">
              {errors.phone}
            </p>
          )}
        </div>

        <div>
          <label htmlFor={`${id}-segment`} className="mb-1.5 block text-sm font-medium text-cloud">
            {leadForm.fields.segment.label}
          </label>
          <select
            id={`${id}-segment`}
            name="segment"
            className={`${fieldClass(Boolean(errors.segment))} cursor-pointer appearance-none ${
              values.segment ? "" : "text-mist-dim"
            }`}
            value={values.segment}
            onChange={(event) => update("segment", event.target.value)}
            aria-invalid={Boolean(errors.segment)}
            aria-describedby={errors.segment ? `${id}-segment-error` : undefined}
          >
            <option value="">{leadForm.fields.segment.placeholder}</option>
            {leadForm.segments.map((segment) => (
              <option key={segment} value={segment}>
                {segment}
              </option>
            ))}
          </select>
          {errors.segment && (
            <p id={`${id}-segment-error`} className="mt-1.5 text-xs text-rose">
              {errors.segment}
            </p>
          )}
        </div>
      </div>

      <Button
        type="submit"
        size="lg"
        className="mt-6 w-full"
        disabled={status === "sending"}
        trackAs={location}
      >
        {status === "sending" ? leadForm.submitting : leadForm.submit}
      </Button>

      <p className="mt-3 text-center text-xs text-mist-dim">{leadForm.privacy}</p>

      <div className="mt-5 flex items-center gap-3" aria-hidden="true">
        <span className="h-px flex-1 bg-line" />
        <span className="text-xs text-mist-dim">ou</span>
        <span className="h-px flex-1 bg-line" />
      </div>

      <LinkButton
        href={whatsappUrl(location)}
        target="_blank"
        rel="noopener noreferrer"
        variant="whatsapp"
        className="mt-5 w-full"
        trackAs={`${location}-whatsapp`}
      >
        <MessageCircle className="size-4" aria-hidden="true" />
        Falar agora no WhatsApp
      </LinkButton>
    </form>
  );
}
