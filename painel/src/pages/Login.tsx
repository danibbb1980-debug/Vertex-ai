import { useState, type FormEvent } from "react";
import { supabase } from "../data/repo";
import { Button, Segmented, TextField } from "../ui/kit";
import { Wordmark } from "../ui/Shell";

export function Login() {
  const [method, setMethod] = useState<"senha" | "link">("senha");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ tone: "ok" | "err"; text: string } | null>(null);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    const sb = supabase();
    if (method === "senha") {
      const { error } = await sb.auth.signInWithPassword({ email: email.trim(), password });
      if (error) setMsg({ tone: "err", text: "E-mail ou senha incorretos." });
    } else {
      const { error } = await sb.auth.signInWithOtp({
        email: email.trim(),
        options: { shouldCreateUser: false, emailRedirectTo: window.location.origin },
      });
      setMsg(error
        ? { tone: "err", text: "Não foi possível enviar o link. Confira o e-mail." }
        : { tone: "ok", text: "Link enviado. Abra o e-mail neste aparelho para entrar." });
    }
    setBusy(false);
  }

  return (
    <main className="flex min-h-dvh items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        <Wordmark />
        <h1 className="mt-6 text-2xl font-semibold tracking-[-0.01em]">Entrar</h1>
        <p className="mt-1 text-[14px] text-ink-3">Acesso restrito aos sócios da Lumivo Web.</p>
        <div className="mt-6">
          <Segmented label="Forma de entrar" value={method} onChange={setMethod}
            options={[["senha", "E-mail e senha"], ["link", "Link por e-mail"]]} />
        </div>
        <form onSubmit={submit} className="mt-5 flex flex-col gap-4">
          <TextField label="E-mail" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          {method === "senha" && (
            <TextField label="Senha" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          )}
          <Button type="submit" variant="primary" disabled={busy}>
            {busy ? "Aguarde…" : method === "senha" ? "Entrar" : "Enviar link"}
          </Button>
          {msg && (
            <p role="alert" className={msg.tone === "err" ? "text-[14px] text-danger" : "text-[14px] text-accent-strong"}>{msg.text}</p>
          )}
        </form>
      </div>
    </main>
  );
}
