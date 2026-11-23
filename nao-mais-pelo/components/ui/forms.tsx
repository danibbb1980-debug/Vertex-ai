"use client";

import { useId, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { Arrow } from "@/components/ui/primitives";
import { centralWhatsappHref, site, whatsappLink } from "@/lib/site";
import { cadastroUnits, UF_NAMES } from "@/lib/units";

type Status = { state: "idle" | "sending" | "done" | "error"; message?: string };

async function sendLead(form: "cadastro" | "newsletter" | "franquia", fields: Record<string, string>, website: string) {
  const res = await fetch("/api/lead", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ form, fields, website }),
  });
  const data = (await res.json().catch(() => ({}))) as { ok?: boolean; message?: string };
  if (!res.ok || !data.ok) throw new Error(data.message ?? "Não foi possível enviar agora.");
}

/** "SP - CAMPINAS CAMBUÍ" → "Campinas Cambuí" (só para exibição; o valor enviado segue o original). */
function unitLabel(nome: string) {
  const small = new Set(["de", "da", "do", "das", "dos", "e"]);
  return nome
    .replace(/^[A-Z]{2}\s*-\s*/, "")
    .toLowerCase()
    .split(/\s+/)
    .map((w, i) => (i > 0 && small.has(w) ? w : /^(bh|ii|iii|iv)$/.test(w) ? w.toUpperCase() : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(" ");
}

/** Máscara de telefone brasileiro, igual à do site original. */
function maskPhone(value: string) {
  const v = value.replace(/\D/g, "").slice(0, 11);
  if (!v) return "";
  if (v.length <= 2) return `(${v}`;
  if (v.length <= 6) return `(${v.slice(0, 2)}) ${v.slice(2)}`;
  if (v.length <= 10) return `(${v.slice(0, 2)}) ${v.slice(2, 6)}-${v.slice(6)}`;
  return `(${v.slice(0, 2)}) ${v.slice(2, 7)}-${v.slice(7)}`;
}

function Field({
  label,
  name,
  type = "text",
  autoComplete,
  dark,
  value,
  onChange,
  inputMode,
}: {
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
  dark?: boolean;
  value?: string;
  onChange?: (v: string) => void;
  inputMode?: "tel" | "email" | "text";
}) {
  const id = useId();
  return (
    <div className="relative">
      <input
        id={id}
        name={name}
        type={type}
        required
        placeholder=" "
        autoComplete={autoComplete}
        inputMode={inputMode}
        value={value}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        className={`field ${dark ? "field-dark" : ""}`}
      />
      <label htmlFor={id} className={`float-label ${dark ? "text-mist" : ""}`}>
        {label}
      </label>
    </div>
  );
}

function Select({
  label,
  name,
  value,
  onChange,
  disabled,
  children,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  children: ReactNode;
}) {
  const id = useId();
  return (
    <div className="relative">
      <select id={id} name={name} required value={value} disabled={disabled} onChange={(e) => onChange(e.target.value)} className="field">
        <option value="" disabled hidden />
        {children}
      </select>
      <label htmlFor={id} className={`float-label ${value ? "is-up" : ""}`}>
        {label}
      </label>
    </div>
  );
}

/** Campo-armadilha para robôs, invisível para pessoas e leitores de tela. */
function Honeypot({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label>
        Website
        <input tabIndex={-1} autoComplete="off" value={value} onChange={(e) => onChange(e.target.value)} />
      </label>
    </div>
  );
}

/**
 * "Cadastre-se e garanta sua primeira sessão gratuita" — o formulário principal
 * do site original. Estado → cidade → unidade; depois do envio, abre o WhatsApp
 * da unidade escolhida com a mesma mensagem que o site original usa.
 */
export function CadastroForm() {
  const [uf, setUf] = useState("");
  const [cidade, setCidade] = useState("");
  const [unidade, setUnidade] = useState("");
  const [phone, setPhone] = useState("");
  const [trap, setTrap] = useState("");
  const [status, setStatus] = useState<Status>({ state: "idle" });
  const [wppHref, setWppHref] = useState<string | null>(null);

  const ufs = useMemo(() => Object.keys(cadastroUnits).sort(), []);
  const cidades = useMemo(() => (uf ? Object.keys(cadastroUnits[uf] ?? {}).sort((a, b) => a.localeCompare(b, "pt-BR")) : []), [uf]);
  const unidades = useMemo(() => (uf && cidade ? cadastroUnits[uf]?.[cidade] ?? [] : []), [uf, cidade]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const nome = String(data.get("nome") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const chosen = unidades.find((u) => u.nome === unidade);
    const message = `Olá, meu nome é ${nome} e meu e-mail é ${email} e tenho interesse.`;
    const href = chosen?.whatsapp ? whatsappLink(chosen.whatsapp, message) : whatsappLink(site.centralWhatsapp, message);

    setStatus({ state: "sending" });
    try {
      await sendLead(
        "cadastro",
        { nome, telefone: phone, email, estado: uf, cidade, unidade, lgpd: data.get("lgpd") ? "1" : "" },
        trap,
      );
      setWppHref(href);
      setStatus({ state: "done" });
      window.open(href, "_blank", "noopener");
    } catch (err) {
      setWppHref(href);
      setStatus({ state: "error", message: err instanceof Error ? err.message : undefined });
    }
  }

  if (status.state === "done") {
    return (
      <div role="status" className="animate-[fade-up_0.9s_var(--ease-out-expo)_both]">
        <p className="eyebrow text-gold-deep">Cadastro recebido</p>
        <p className="mt-5 font-display text-4xl leading-tight md:text-5xl">
          Obrigado. <em>Agora é só combinar o horário.</em>
        </p>
        <p className="mt-5 max-w-md text-stone">Continue a conversa com a unidade escolhida pelo WhatsApp para agendar a sua sessão.</p>
        {wppHref ? (
          <a href={wppHref} target="_blank" rel="noopener noreferrer" className="btn btn-solid-dark mt-8">
            <span>Continuar no WhatsApp</span>
            <Arrow />
          </a>
        ) : null}
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="relative grid gap-5" noValidate={false}>
      <Honeypot value={trap} onChange={setTrap} />
      <Field label="Nome" name="nome" autoComplete="name" />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="WhatsApp" name="telefone" type="tel" inputMode="tel" autoComplete="tel" value={phone} onChange={(v) => setPhone(maskPhone(v))} />
        <Field label="E-mail" name="email" type="email" inputMode="email" autoComplete="email" />
      </div>
      <div className="grid gap-5 sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <Select
          label="Estado"
          name="estado"
          value={uf}
          onChange={(v) => {
            setUf(v);
            setCidade("");
            setUnidade("");
          }}
        >
          {ufs.map((s) => (
            <option key={s} value={s}>
              {UF_NAMES[s] ?? s}
            </option>
          ))}
        </Select>
        <Select
          label="Cidade"
          name="cidade"
          value={cidade}
          disabled={!uf}
          onChange={(v) => {
            setCidade(v);
            setUnidade("");
          }}
        >
          {cidades.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Select>
      </div>
      <Select label="Unidade" name="unidade" value={unidade} disabled={!cidade} onChange={setUnidade}>
        {unidades.map((u) => (
          <option key={u.nome} value={u.nome}>
            {unitLabel(u.nome)}
          </option>
        ))}
      </Select>

      <label className="mt-3 flex cursor-pointer items-start gap-3 text-[0.8125rem] leading-relaxed text-stone">
        <input type="checkbox" name="lgpd" value="1" required className="mt-1 h-4 w-4 shrink-0 accent-ink" />
        <span>
          Concordo em ter meus dados tratados conforme a{" "}
          <a href={site.external.privacy} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
            Política de Privacidade
          </a>{" "}
          com a finalidade única de receber comunicações e ofertas de produtos e serviços da Não+Pelo.
        </span>
      </label>

      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button type="submit" disabled={status.state === "sending"} className="btn btn-solid-dark w-full disabled:opacity-60 sm:w-auto">
          <span>{status.state === "sending" ? "Enviando…" : "Garantir minha sessão"}</span>
          <Arrow />
        </button>
        <a href={centralWhatsappHref} target="_blank" rel="noopener noreferrer" className="eyebrow link-line self-start text-stone sm:self-auto">
          Prefiro falar com a central
        </a>
      </div>

      {status.state === "error" ? (
        <div role="alert" className="border-l border-ink pl-4 text-sm">
          <p>{status.message ?? "Não foi possível enviar agora."}</p>
          {wppHref ? (
            <a href={wppHref} target="_blank" rel="noopener noreferrer" className="link-line mt-1 inline-block font-medium">
              Agendar direto pelo WhatsApp da unidade
            </a>
          ) : null}
        </div>
      ) : null}
    </form>
  );
}

/** Newsletter do rodapé ("Fique por dentro das novidades!"). */
export function NewsletterForm() {
  const [status, setStatus] = useState<Status>({ state: "idle" });
  const [trap, setTrap] = useState("");
  const id = useId();

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = String(new FormData(e.currentTarget).get("email") ?? "");
    setStatus({ state: "sending" });
    try {
      await sendLead("newsletter", { email }, trap);
      setStatus({ state: "done" });
    } catch (err) {
      setStatus({ state: "error", message: err instanceof Error ? err.message : undefined });
    }
  }

  if (status.state === "done") {
    return (
      <p role="status" className="font-display text-2xl italic">
        Inscrição confirmada. Até breve.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="relative">
      <Honeypot value={trap} onChange={setTrap} />
      <div className="relative flex items-end gap-4">
        <div className="relative flex-1">
          <input id={id} name="email" type="email" required placeholder=" " autoComplete="email" className="field field-dark" />
          <label htmlFor={id} className="float-label text-mist">
            Seu e-mail
          </label>
        </div>
        <button type="submit" disabled={status.state === "sending"} className="btn btn-outline-light min-h-11 shrink-0 px-5 disabled:opacity-60">
          <span>{status.state === "sending" ? "Enviando" : "Inscrever-se"}</span>
        </button>
      </div>
      {status.state === "error" ? (
        <p role="alert" className="mt-3 text-sm text-mist">
          {status.message ?? "Não foi possível enviar agora."}
        </p>
      ) : null}
    </form>
  );
}

/** Formulário "Receber apresentação" da página de franquias. */
export function FranquiaForm() {
  const [phone, setPhone] = useState("");
  const [trap, setTrap] = useState("");
  const [status, setStatus] = useState<Status>({ state: "idle" });

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setStatus({ state: "sending" });
    try {
      await sendLead(
        "franquia",
        { nome: String(data.get("nome") ?? ""), telefone: phone, email: String(data.get("email") ?? "") },
        trap,
      );
      setStatus({ state: "done" });
    } catch (err) {
      setStatus({ state: "error", message: err instanceof Error ? err.message : undefined });
    }
  }

  if (status.state === "done") {
    return (
      <div role="status" className="animate-[fade-up_0.9s_var(--ease-out-expo)_both]">
        <p className="eyebrow text-gold">Recebemos seu cadastro</p>
        <p className="mt-5 font-display text-4xl leading-tight">
          Obrigado. <em>Nossa equipe de expansão vai entrar em contato.</em>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="relative grid gap-5">
      <Honeypot value={trap} onChange={setTrap} />
      <Field label="Nome" name="nome" autoComplete="name" dark />
      <Field label="WhatsApp" name="telefone" type="tel" inputMode="tel" autoComplete="tel" dark value={phone} onChange={(v) => setPhone(maskPhone(v))} />
      <Field label="E-mail" name="email" type="email" inputMode="email" autoComplete="email" dark />
      <p className="mt-2 text-[0.8125rem] leading-relaxed text-mist">
        Ao enviar os dados acima, eu concordo em receber contatos e mensagens por meio do WhatsApp, telefones e e-mails.
      </p>
      <button type="submit" disabled={status.state === "sending"} className="btn btn-solid-light mt-2 w-full disabled:opacity-60">
        <span>{status.state === "sending" ? "Enviando…" : "Receber apresentação"}</span>
        <Arrow />
      </button>
      {status.state === "error" ? (
        <p role="alert" className="text-sm text-mist">
          {status.message ?? "Não foi possível enviar agora."} Escreva para{" "}
          <a className="underline" href="mailto:franquias@naomaispelo.com.br">
            franquias@naomaispelo.com.br
          </a>
          .
        </p>
      ) : null}
    </form>
  );
}
