"use client";

import { useId, useState, type FormEvent } from "react";
import { ArrowRight } from "lucide-react";
import { modalities, whatsappUrl, whatsappUrlWithText } from "@/lib/site-data";
import { WhatsAppIcon } from "./BrandIcons";

const periods = ["Manhã", "Tarde", "Noite"] as const;

/**
 * Formulário de interesse sem backend: valida os campos e abre o WhatsApp
 * com a mensagem montada. Nada é enviado nem armazenado pelo site — o texto
 * abaixo do botão diz isso ao visitante.
 *
 * A abertura é síncrona de propósito: um await antes do window.open faz o
 * Safari/iOS tratar como pop-up e bloquear.
 */
export function InterestForm() {
  const id = useId();
  const [name, setName] = useState("");
  const [interest, setInterest] = useState("");
  const [period, setPeriod] = useState("");
  const [errors, setErrors] = useState<{ name?: string; interest?: string }>({});
  const [sentUrl, setSentUrl] = useState<string | null>(null);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next: typeof errors = {};
    const trimmed = name.trim();
    if (trimmed.length < 2) next.name = "Digite seu nome para a equipe saber com quem está falando.";
    if (!interest) next.interest = "Escolha o que você quer conhecer.";
    setErrors(next);
    if (next.name || next.interest) {
      const field = next.name ? `${id}-name` : `${id}-interest`;
      document.getElementById(field)?.focus();
      return;
    }

    const lines = [
      `Olá! Meu nome é ${trimmed} e conheci a VIP Shape Academia pelo site.`,
      `Tenho interesse em: ${interest}.`,
      period ? `Prefiro treinar no período da ${period.toLowerCase()}.` : null,
      "Gostaria de saber mais sobre planos, matrícula e como começar.",
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
      <div className="border border-white/15 bg-ink/70 p-7 sm:p-9" role="status">
        <p className="font-display text-2xl font-bold text-white uppercase">Só falta enviar.</p>
        <p className="mt-3 text-mist">
          Abrimos o WhatsApp com a sua mensagem pronta. Confira o texto e toque em enviar para falar com a equipe.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <a
            href={sentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="chamfer-sm inline-flex min-h-12 items-center justify-center gap-2 bg-orange px-6 text-sm font-semibold tracking-[0.08em] text-ink uppercase"
          >
            <WhatsAppIcon className="h-5 w-5" /> Abrir o WhatsApp de novo
          </a>
          <button
            type="button"
            onClick={() => setSentUrl(null)}
            className="min-h-12 px-4 text-sm font-semibold text-mist underline underline-offset-4 hover:text-white"
          >
            Editar dados
          </button>
        </div>
      </div>
    );
  }

  const field =
    "mt-2 block w-full min-h-12 border bg-ink/70 px-4 text-base text-white placeholder:text-white/35 transition-colors focus:border-orange focus:outline-none";

  return (
    <form noValidate onSubmit={onSubmit} className="border border-white/15 bg-ink/70 p-7 backdrop-blur-sm sm:p-9" aria-describedby={`${id}-privacy`}>
      <p className="font-display text-xl font-bold text-white uppercase">Monte sua mensagem</p>
      <p className="mt-1 text-sm text-mist">Leva 10 segundos.</p>

      <div className="mt-6 space-y-5">
        <div>
          <label htmlFor={`${id}-name`} className="text-sm font-medium text-white">
            Seu nome
          </label>
          <input
            id={`${id}-name`}
            name="name"
            autoComplete="given-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? `${id}-name-error` : undefined}
            className={`${field} ${errors.name ? "border-orange" : "border-white/15"}`}
            placeholder="Como podemos te chamar?"
          />
          {errors.name && (
            <p id={`${id}-name-error`} className="mt-2 text-sm text-orange">
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label htmlFor={`${id}-interest`} className="text-sm font-medium text-white">
            O que você quer conhecer?
          </label>
          <select
            id={`${id}-interest`}
            name="interest"
            value={interest}
            onChange={(e) => setInterest(e.target.value)}
            aria-invalid={Boolean(errors.interest)}
            aria-describedby={errors.interest ? `${id}-interest-error` : undefined}
            className={`${field} appearance-none bg-[url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23ff5a1f' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")] bg-[length:1.1rem] bg-[position:right_1rem_center] bg-no-repeat pr-10 ${errors.interest ? "border-orange" : "border-white/15"}`}
          >
            <option value="" disabled>
              Selecione uma opção
            </option>
            {modalities.map((m) => (
              <option key={m.id} value={m.name}>
                {m.name}
              </option>
            ))}
            <option value="Ainda não sei, quero orientação">Ainda não sei, quero orientação</option>
          </select>
          {errors.interest && (
            <p id={`${id}-interest-error`} className="mt-2 text-sm text-orange">
              {errors.interest}
            </p>
          )}
        </div>

        <fieldset>
          <legend className="text-sm font-medium text-white">
            Período preferido <span className="font-normal text-mist">(opcional)</span>
          </legend>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {periods.map((p) => (
              <label
                key={p}
                className="flex min-h-12 cursor-pointer items-center justify-center border border-white/15 text-sm font-medium text-mist transition-colors has-checked:border-orange has-checked:bg-orange has-checked:text-ink has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-orange"
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
      </div>

      <button
        type="submit"
        className="chamfer-sm group mt-7 flex min-h-13 w-full items-center justify-center gap-2.5 bg-orange px-6 text-sm font-bold tracking-[0.1em] text-ink uppercase transition-colors hover:bg-orange-hot"
      >
        <WhatsAppIcon className="h-5 w-5" />
        Continuar no WhatsApp
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
      </button>
      <p id={`${id}-privacy`} className="mt-4 text-xs leading-relaxed text-mist">
        Seus dados não são enviados nem armazenados por este site. Ao continuar, o WhatsApp abre com a mensagem
        pronta e você decide se quer enviá-la.{" "}
        <a href={whatsappUrl("default")} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-white">
          Prefere escrever do seu jeito?
        </a>
      </p>
    </form>
  );
}
