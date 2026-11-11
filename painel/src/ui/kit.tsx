import {
  forwardRef, useEffect, useId, useRef, useState, type ButtonHTMLAttributes, type InputHTMLAttributes,
  type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes,
} from "react";
import { moneyInput, parseMoney } from "../domain/format";

export function cx(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(" ");
}

// ------------------------------------------------------------------ botões

type Variant = "primary" | "secondary" | "ghost" | "danger";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-accent text-accent-ink hover:bg-accent-strong border border-transparent",
  secondary: "bg-surface text-ink border border-line-strong hover:bg-surface-2",
  ghost: "bg-transparent text-ink-2 border border-transparent hover:bg-surface-2 hover:text-ink",
  danger: "bg-surface text-danger border border-line-strong hover:bg-danger-soft",
};

export const Button = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant; size?: "md" | "sm";
}>(function Button({ variant = "secondary", size = "md", className, type = "button", ...rest }, ref) {
  return (
    <button
      ref={ref}
      type={type}
      className={cx(
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium whitespace-nowrap transition-colors duration-150 disabled:opacity-50 disabled:pointer-events-none select-none",
        size === "md" ? "min-h-11 px-4 text-[15px] lg:min-h-10" : "min-h-9 px-3 text-sm",
        VARIANTS[variant],
        className,
      )}
      {...rest}
    />
  );
});

export function LinkButton({ href, variant = "secondary", className, children }: {
  href: string; variant?: Variant; className?: string; children: ReactNode;
}) {
  return (
    <a
      href={href}
      className={cx(
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium whitespace-nowrap min-h-11 px-4 text-[15px] lg:min-h-10 transition-colors duration-150 no-underline",
        VARIANTS[variant], className,
      )}
    >
      {children}
    </a>
  );
}

// ------------------------------------------------------------------ campos

export function Field({ label, hint, error, children, className, required, htmlFor }: {
  label: string; hint?: ReactNode; error?: string; children: ReactNode; className?: string;
  required?: boolean; htmlFor?: string;
}) {
  return (
    <div className={cx("flex flex-col gap-1.5 min-w-0", className)}>
      <label htmlFor={htmlFor} className="text-[13px] font-medium text-ink-2">
        {label}
        {required && <span className="text-ink-3 font-normal"> (obrigatório)</span>}
      </label>
      {children}
      {error ? (
        <p className="text-[13px] text-danger" role="alert">{error}</p>
      ) : hint ? (
        <p className="text-[13px] text-ink-3">{hint}</p>
      ) : null}
    </div>
  );
}

/** Input com rótulo ligado automaticamente. */
export function TextField({ label, hint, error, required, className, ...rest }: InputHTMLAttributes<HTMLInputElement> & {
  label: string; hint?: ReactNode; error?: string;
}) {
  const id = useId();
  return (
    <Field label={label} hint={hint} error={error} required={required} className={className} htmlFor={id}>
      <input id={id} className="input" aria-invalid={error ? true : undefined} required={required} {...rest} />
    </Field>
  );
}

export function TextArea({ label, hint, className, ...rest }: TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string; hint?: ReactNode;
}) {
  const id = useId();
  return (
    <Field label={label} hint={hint} className={className} htmlFor={id}>
      <textarea id={id} className="input" {...rest} />
    </Field>
  );
}

export function SelectField<K extends string>({ label, options, value, onChange, hint, className, placeholder, ...rest }: Omit<SelectHTMLAttributes<HTMLSelectElement>, "onChange" | "value"> & {
  label: string; options: [K, string][]; value: K | "" | null; onChange: (v: K) => void; hint?: ReactNode;
  placeholder?: string;
}) {
  const id = useId();
  return (
    <Field label={label} hint={hint} className={className} htmlFor={id}>
      <select id={id} className="input" value={value ?? ""} onChange={(e) => onChange(e.target.value as K)} {...rest}>
        {placeholder != null && <option value="">{placeholder}</option>}
        {options.map(([k, v]) => <option key={k} value={k}>{v}</option>)}
      </select>
    </Field>
  );
}

/** Data nativa (o celular abre o seletor). Valor "aaaa-mm-dd" ou null. */
export function DateField({ label, value, onChange, hint, required, className, error }: {
  label: string; value: string | null; onChange: (v: string | null) => void; hint?: ReactNode;
  required?: boolean; className?: string; error?: string;
}) {
  const id = useId();
  return (
    <Field label={label} hint={hint} required={required} className={className} htmlFor={id} error={error}>
      <input
        id={id} type="date" className="input" value={value ?? ""} required={required}
        aria-invalid={error ? true : undefined}
        onChange={(e) => onChange(e.target.value || null)}
      />
    </Field>
  );
}

/**
 * Valor em reais. Aceita "R$ 1.234,56", "1234,56", "297". Formata ao sair do
 * campo. Mostra o teclado numérico no celular.
 */
export function MoneyField({ label, value, onChange, hint, required, className, error, autoFocus, allowEmpty }: {
  label: string; value: number | null; onChange: (v: number | null) => void; hint?: ReactNode;
  required?: boolean; className?: string; error?: string; autoFocus?: boolean; allowEmpty?: boolean;
}) {
  const id = useId();
  const [text, setText] = useState(moneyInput(value));
  const focused = useRef(false);
  useEffect(() => {
    if (!focused.current) setText(moneyInput(value));
  }, [value]);
  const invalid = text.trim() !== "" && parseMoney(text) == null;
  return (
    <Field label={label} hint={hint} required={required} className={className} htmlFor={id}
      error={error ?? (invalid ? "Valor inválido. Use o formato 1.234,56." : undefined)}>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-3 pointer-events-none" aria-hidden="true">R$</span>
        <input
          id={id}
          className="input num pl-10"
          inputMode="decimal"
          autoComplete="off"
          autoFocus={autoFocus}
          value={text}
          required={required}
          aria-invalid={error || invalid ? true : undefined}
          onFocus={() => { focused.current = true; }}
          onChange={(e) => {
            setText(e.target.value);
            const v = parseMoney(e.target.value);
            if (v != null || (allowEmpty && e.target.value.trim() === "")) onChange(v);
          }}
          onBlur={() => {
            focused.current = false;
            const v = parseMoney(text);
            setText(v == null ? (allowEmpty ? "" : text) : moneyInput(v));
          }}
        />
      </div>
    </Field>
  );
}

export function NumberField({ label, value, onChange, min, max, step, suffix, hint, className }: {
  label: string; value: number | null; onChange: (v: number | null) => void; min?: number; max?: number;
  step?: number; suffix?: string; hint?: ReactNode; className?: string;
}) {
  const id = useId();
  const [text, setText] = useState(value == null ? "" : String(value).replace(".", ","));
  const focused = useRef(false);
  useEffect(() => {
    if (!focused.current) setText(value == null ? "" : String(value).replace(".", ","));
  }, [value]);
  return (
    <Field label={label} hint={hint} className={className} htmlFor={id}>
      <div className="relative">
        <input
          id={id} className={cx("input num", suffix && "pr-9")} inputMode="decimal" value={text}
          min={min} max={max} step={step}
          onFocus={() => { focused.current = true; }}
          onBlur={() => { focused.current = false; }}
          onChange={(e) => {
            setText(e.target.value);
            const raw = e.target.value.trim();
            if (raw === "") return onChange(null);
            const n = Number(raw.replace(",", "."));
            if (Number.isFinite(n)) onChange(Math.min(max ?? Infinity, Math.max(min ?? -Infinity, n)));
          }}
        />
        {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-3 pointer-events-none" aria-hidden="true">{suffix}</span>}
      </div>
    </Field>
  );
}

// ------------------------------------------------------------------ diálogos

export function Dialog({ open, onClose, title, children, footer, wide }: {
  open: boolean; onClose: () => void; title: string; children: ReactNode; footer?: ReactNode; wide?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);
  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onClose={onClose}
      onCancel={(e) => { e.preventDefault(); onClose(); }}
      onClick={(e) => { if (e.target === ref.current) onClose(); }}
      className={cx(
        "m-auto w-[calc(100%-24px)] rounded-xl border border-line bg-surface p-0 shadow-[0_20px_60px_-20px_rgb(8_18_24/0.45)]",
        wide ? "max-w-2xl" : "max-w-md",
      )}
    >
      {open && (
        <div className="flex max-h-[85dvh] flex-col">
          <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-3.5">
            <h2 id={titleId} className="text-base font-semibold">{title}</h2>
            <button type="button" onClick={onClose} className="-mr-2 min-h-11 min-w-11 rounded-lg text-ink-3 hover:bg-surface-2 hover:text-ink" aria-label="Fechar">
              <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" className="mx-auto"><path d="M3.5 3.5l9 9m0-9l-9 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
            </button>
          </div>
          <div className="overflow-y-auto px-5 py-4">{children}</div>
          {footer && <div className="flex flex-wrap justify-end gap-2 border-t border-line px-5 py-3">{footer}</div>}
        </div>
      )}
    </dialog>
  );
}

/** Confirmação simples: const [ask, node] = useConfirm(); await ask({...}) */
export function useConfirm(): [
  (o: { title: string; body: ReactNode; confirm: string; danger?: boolean }) => Promise<boolean>,
  ReactNode,
] {
  const [state, setState] = useState<null | {
    title: string; body: ReactNode; confirm: string; danger?: boolean; resolve: (v: boolean) => void;
  }>(null);
  const close = (v: boolean) => {
    state?.resolve(v);
    setState(null);
  };
  const node = (
    <Dialog
      open={!!state}
      onClose={() => close(false)}
      title={state?.title ?? ""}
      footer={<>
        <Button onClick={() => close(false)}>Voltar</Button>
        <Button variant={state?.danger ? "danger" : "primary"} onClick={() => close(true)}>{state?.confirm}</Button>
      </>}
    >
      <div className="text-[15px] text-ink-2">{state?.body}</div>
    </Dialog>
  );
  return [(o) => new Promise<boolean>((resolve) => setState({ ...o, resolve })), node];
}

// ------------------------------------------------------------------ pequenos

export type Tone = "neutral" | "accent" | "warn" | "danger" | "muted";

const TONES: Record<Tone, string> = {
  neutral: "bg-surface-2 text-ink-2",
  accent: "bg-accent-soft text-accent-strong",
  warn: "bg-warn-soft text-warn",
  danger: "bg-danger-soft text-danger",
  muted: "bg-transparent text-ink-3 border border-line",
};

export function Pill({ tone = "neutral", children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span className={cx("inline-flex items-center rounded-full px-2 py-0.5 text-[12.5px] font-medium whitespace-nowrap", TONES[tone])}>
      {children}
    </span>
  );
}

export function PageHeader({ title, children, sub }: { title: string; children?: ReactNode; sub?: ReactNode }) {
  return (
    <header className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div className="min-w-0">
        <h1 className="text-[22px] font-semibold tracking-[-0.01em] lg:text-2xl">{title}</h1>
        {sub && <p className="mt-0.5 text-[14px] text-ink-3">{sub}</p>}
      </div>
      {children && <div className="flex flex-wrap items-center gap-2">{children}</div>}
    </header>
  );
}

export function Section({ title, action, children, className }: {
  title: string; action?: ReactNode; children: ReactNode; className?: string;
}) {
  return (
    <section className={cx("border-t border-line pt-4", className)}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="eyebrow">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return <p className="rounded-lg border border-dashed border-line px-4 py-6 text-center text-[14px] text-ink-3">{children}</p>;
}

/** Alternância de 2 ou 3 opções (rádio acessível). */
export function Segmented<K extends string>({ value, onChange, options, label }: {
  value: K; onChange: (v: K) => void; options: [K, string][]; label: string;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex rounded-lg border border-line-strong bg-surface p-0.5">
      {options.map(([k, text]) => (
        <button
          key={k} type="button" role="radio" aria-checked={value === k}
          onClick={() => onChange(k)}
          className={cx(
            "min-h-10 rounded-md px-3 text-[14px] font-medium transition-colors duration-150 lg:min-h-8",
            value === k ? "bg-ink text-bg" : "text-ink-2 hover:text-ink",
          )}
        >
          {text}
        </button>
      ))}
    </div>
  );
}
