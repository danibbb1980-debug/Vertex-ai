"use client";

import { useId, useState, type FormEvent } from "react";
import { ArrowRight } from "lucide-react";
import { treatments, whatsappUrlWithText } from "@/lib/site-data";
import { WhatsAppIcon } from "./BrandIcons";

const periods = ["Manhã", "Tarde", "Sábado"] as const;
const otherOption = "Outro tratamento / ainda não sei";

/**
 * Formulário sem backend: valida os campos e abre o WhatsApp com a mensagem
 * montada. Nada é enviado nem armazenado pelo site. Pede só o mínimo — nome,
 * assunto e período — e nenhuma informação clínica (dado sensível na LGPD).
 *
 * A abertura é síncrona de propósito: um await antes do window.open faz o
 * Safari/iOS tratar como pop-up e bloquear.
 */
export function ContactForm({ defaultInterest = "" }: { defaultInterest?: string }) {
  const id = useId();
  const [name, setName] = useState("");
  const [interest, setInterest] = useState(defaultInterest);
  const [period, setPeriod] = useState("");
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; interest?: string; consent?: string }>({});
  const [sentUrl, setSentUrl] = useState<string | null>(null);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next: typeof errors = {};
    const trimmed = name.trim().replace(/\s+/g, " ");
    if (trimmed.length < 2) next.name = "Informe seu nome para a equipe saber com quem está falando.";
    if (!interest) next.interest = "Escolha o assunto da avaliação.";
    if (!consent) next.consent = "Para continuar, confirme que leu como seus dados são usados.";
    setErrors(next);
    const firstError = (["name", "interest", "consent"] as const).find((k) => next[k]);
    if (firstError) {
      document.getElementById(`${id}-${firstError}`)?.focus();
      return;
    }

    const lines = [
      `Olá! Meu nome é ${trimmed.slice(0, 80)} e conheci a Star Sorrindo pelo site.`,
      `Gostaria de agendar uma avaliação sobre: ${interest}.`,
      period ? `Período de preferência: ${period.toLowerCase()}.` : null,
    ].filter(Boolean);
    const url = whatsappUrlWithText(lines.join("\n"));
    setSentUrl(url);

    // Sem "noopener" nos features: com ele o window.open sempre retorna null
    // e o fallback abriria o WhatsApp também na aba atual.
    const win = window.open(url, "_blank");
    if (win) win.opener = null;
    else window.location.href = url;
  }

  if (sentUrl) {
    return (
      <div className="rounded-2xl border border-line bg-white p-7 sm:p-10" role="status">
        <p className="serif text-3xl">Sua mensagem está pronta.</p>
        <p className="mt-3 text-mineral">
          Abrimos o WhatsApp com o texto preenchido. Confira e toque em enviar. A equipe responde com a disponibilidade —
          o horário só fica marcado depois da confirmação da clínica.
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <a
            href={sentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-navy px-6 text-sm font-semibold text-ivory transition-colors hover:bg-navy-3"
          >
            <WhatsAppIcon className="h-5 w-5" /> Abrir o WhatsApp novamente
            <span className="sr-only"> (abre em nova aba)</span>
          </a>
          <button
            type="button"
            onClick={() => setSentUrl(null)}
            className="min-h-12 px-4 text-sm font-semibold text-mineral underline underline-offset-4 hover:text-navy"
          >
            Editar dados
          </button>
        </div>
      </div>
    );
  }

  const field =
    "mt-2 block w-full min-h-13 rounded-xl border bg-ivory px-4 text-base text-navy placeholder:text-mineral/70 transition-colors focus:border-navy focus:bg-white focus:outline-none";
  const errorText = "mt-2 text-sm font-medium text-[#9b2c2c]";

  return (
    <form noValidate onSubmit={onSubmit} className="rounded-2xl border border-line bg-white p-7 shadow-[0_30px_60px_-40px_rgb(14_29_54/0.35)] sm:p-10">
      <p className="serif text-3xl">Solicitar avaliação</p>
      <p className="mt-2 text-sm text-mineral">Preencha e continue a conversa no WhatsApp.</p>

      <div className="mt-8 space-y-6">
        <div>
          <label htmlFor={`${id}-name`} className="text-sm font-semibold">
            Seu nome
          </label>
          <input
            id={`${id}-name`}
            name="name"
            autoComplete="name"
            maxLength={80}
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? `${id}-name-error` : undefined}
            className={`${field} ${errors.name ? "border-[#9b2c2c]" : "border-line"}`}
            placeholder="Como podemos te chamar?"
          />
          {errors.name && (
            <p id={`${id}-name-error`} className={errorText}>
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label htmlFor={`${id}-interest`} className="text-sm font-semibold">
            Assunto da avaliação
          </label>
          <select
            id={`${id}-interest`}
            name="interest"
            value={interest}
            onChange={(e) => setInterest(e.target.value)}
            aria-invalid={Boolean(errors.interest)}
            aria-describedby={errors.interest ? `${id}-interest-error` : undefined}
            className={`${field} appearance-none bg-[url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%237a5d2e' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")] bg-[length:1.1rem] bg-[position:right_1rem_center] bg-no-repeat pr-10 ${errors.interest ? "border-[#9b2c2c]" : "border-line"}`}
          >
            <option value="" disabled>
              Selecione uma opção
            </option>
            {treatments.map((t) => (
              <option key={t.id} value={t.name}>
                {t.name}
              </option>
            ))}
            <option value={otherOption}>{otherOption}</option>
          </select>
          {errors.interest && (
            <p id={`${id}-interest-error`} className={errorText}>
              {errors.interest}
            </p>
          )}
        </div>

        <fieldset>
          <legend className="text-sm font-semibold">
            Período de preferência <span className="font-normal text-mineral">(opcional)</span>
          </legend>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {periods.map((p) => (
              <label
                key={p}
                className="flex min-h-12 cursor-pointer items-center justify-center rounded-xl border border-line bg-ivory text-sm font-medium text-mineral transition-colors hover:border-navy/40 has-checked:border-navy has-checked:bg-navy has-checked:text-ivory has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-gold-ink"
              >
                <input
                  type="radio"
                  name="period"
                  value={p}
                  checked={period === p}
                  onChange={() => setPeriod(p)}
                  className="sr-only"
                />
                {p}
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <label className="flex cursor-pointer items-start gap-3 text-sm text-mineral">
            <input
              id={`${id}-consent`}
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              aria-invalid={Boolean(errors.consent)}
              aria-describedby={errors.consent ? `${id}-consent-error` : undefined}
              className="mt-1 h-5 w-5 shrink-0 accent-navy"
            />
            <span>
              Entendo que meu nome e o assunto escolhido serão enviados à Star Sorrindo pelo WhatsApp, apenas para responder ao
              meu contato. O site não armazena esses dados.{" "}
              <a href="/politica-de-privacidade/" className="font-semibold text-navy underline underline-offset-4">
                Política de privacidade
              </a>
              .
            </span>
          </label>
          {errors.consent && (
            <p id={`${id}-consent-error`} className={errorText}>
              {errors.consent}
            </p>
          )}
        </div>
      </div>

      <button
        type="submit"
        className="group mt-8 inline-flex min-h-13 w-full items-center justify-center gap-2.5 rounded-full bg-navy px-7 text-[0.95rem] font-semibold text-ivory transition-[background-color,box-shadow] duration-300 hover:bg-navy-3 hover:shadow-[0_14px_34px_-14px_rgb(14_29_54/0.55)]"
      >
        <WhatsAppIcon className="h-5 w-5" />
        Continuar no WhatsApp
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
      </button>
      <p className="mt-4 text-center text-xs text-mineral">
        O envio abre uma conversa. A consulta é confirmada pela equipe da clínica.
      </p>
    </form>
  );
}
