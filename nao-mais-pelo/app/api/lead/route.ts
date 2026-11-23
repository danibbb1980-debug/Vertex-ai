import { NextResponse } from "next/server";

/**
 * Encaminha os formulários do site para o Contact Form 7 do WordPress original,
 * preservando o funil atual (e-mails, integração com o CRM das unidades).
 *
 * O envio real só acontece com CF7_FORWARD=true. Sem isso (desenvolvimento,
 * previews), o lead é validado e registrado no log, mas não é enviado —
 * para que testes não gerem contatos falsos para as unidades.
 */

const FORMS = {
  cadastro: { id: 5, post: 2, fields: ["nome", "telefone", "email", "estado", "cidade", "unidade", "lgpd"], required: ["nome", "telefone", "email", "estado", "cidade", "unidade", "lgpd"] },
  newsletter: { id: 21, post: 2, fields: ["email"], required: ["email"] },
} as const;

type FormKey = keyof typeof FORMS;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(request: Request) {
  let body: { form?: string; fields?: Record<string, unknown>; website?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Requisição inválida." }, { status: 400 });
  }

  // Honeypot: robôs preenchem o campo escondido "website".
  if (body.website) return NextResponse.json({ ok: true });

  const key = body.form as FormKey;
  const config = FORMS[key];
  if (!config) return NextResponse.json({ ok: false, message: "Formulário desconhecido." }, { status: 400 });

  const values: Record<string, string> = {};
  for (const name of config.fields) {
    const raw = body.fields?.[name];
    values[name] = typeof raw === "string" ? raw.trim().slice(0, 400) : "";
  }

  const missing = config.required.filter((name) => !values[name]);
  if (missing.length) {
    return NextResponse.json({ ok: false, message: "Preencha todos os campos.", missing }, { status: 422 });
  }
  if (values.email && !EMAIL.test(values.email)) {
    return NextResponse.json({ ok: false, message: "Confira o e-mail informado.", missing: ["email"] }, { status: 422 });
  }
  if (values.telefone && values.telefone.replace(/\D/g, "").length < 10) {
    return NextResponse.json({ ok: false, message: "Confira o número de WhatsApp.", missing: ["telefone"] }, { status: 422 });
  }

  if (process.env.CF7_FORWARD !== "true") {
    console.info(`[lead:${key}] modo de teste — não enviado ao CF7`);
    return NextResponse.json({ ok: true, dryRun: true });
  }

  const base = (process.env.CF7_BASE_URL ?? "https://naomaispelo.com.br").replace(/\/$/, "");
  const form = new FormData();
  form.set("_wpcf7", String(config.id));
  form.set("_wpcf7_version", "6.1.4");
  form.set("_wpcf7_locale", "pt_BR");
  form.set("_wpcf7_unit_tag", `wpcf7-f${config.id}-p${config.post}-o1`);
  form.set("_wpcf7_container_post", String(config.post));
  for (const [name, value] of Object.entries(values)) form.set(name, value);

  try {
    const res = await fetch(`${base}/wp-json/contact-form-7/v1/contact-forms/${config.id}/feedback`, {
      method: "POST",
      body: form,
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(12000),
    });
    const data = (await res.json().catch(() => ({}))) as { status?: string; message?: string };
    if (data.status === "mail_sent") return NextResponse.json({ ok: true });
    console.error(`[lead:${key}] CF7 respondeu`, res.status, data.status);
    return NextResponse.json({ ok: false, message: data.message ?? "Não foi possível enviar agora." }, { status: 502 });
  } catch (error) {
    console.error(`[lead:${key}] falha ao enviar`, error);
    return NextResponse.json({ ok: false, message: "Não foi possível enviar agora." }, { status: 502 });
  }
}
