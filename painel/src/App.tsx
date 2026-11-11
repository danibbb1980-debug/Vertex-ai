import { useCallback, useEffect, useMemo, useState } from "react";
import {
  NotAllowedError, createLocalRepo, createSupabaseRepo, supabase, supabaseConfigured, type Repo, type Session,
} from "./data/repo";
import { useRoute } from "./data/router";
import { StoreProvider } from "./data/store";
import type { Dataset } from "./domain/types";
import { Calendar } from "./pages/Calendar";
import { Costs } from "./pages/Costs";
import { Dashboard } from "./pages/Dashboard";
import { Funnel } from "./pages/Funnel";
import { Login } from "./pages/Login";
import { SaleDetail } from "./pages/SaleDetail";
import { SaleForm } from "./pages/SaleForm";
import { Sales } from "./pages/Sales";
import { SettingsPage } from "./pages/Settings";
import { Button } from "./ui/kit";
import { Shell, Wordmark } from "./ui/Shell";

export function App() {
  if (!supabaseConfigured) return <LocalApp />;
  return <RemoteApp />;
}

function LocalApp() {
  const repo = useMemo(() => createLocalRepo(), []);
  return <Loader repo={repo} author={null} />;
}

function RemoteApp() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  useEffect(() => {
    const sb = supabase();
    sb.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = sb.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);
  const repo = useMemo(() => (session ? createSupabaseRepo() : null), [session]);
  const signOut = useCallback(() => { void supabase().auth.signOut(); }, []);

  if (session === undefined) return <Splash text="Carregando…" />;
  if (!session || !repo) return <Login />;
  return <Loader repo={repo} author={session.user.email ?? null} onSignOut={signOut} />;
}

function Loader({ repo, author, onSignOut }: { repo: Repo; author: string | null; onSignOut?: () => void }) {
  const [data, setData] = useState<Dataset | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const load = useCallback(() => {
    setError(null);
    repo.load().then(setData).catch((e: Error) => setError(e));
  }, [repo]);
  useEffect(load, [load]);

  if (error) {
    return (
      <Splash text={error instanceof NotAllowedError
        ? `${error.message} Peça para incluir seu e-mail na tabela allowed_emails do Supabase.`
        : error.message}
      >
        <div className="flex gap-2">
          {!(error instanceof NotAllowedError) && <Button onClick={load}>Tentar de novo</Button>}
          {onSignOut && <Button onClick={onSignOut}>Sair</Button>}
        </div>
      </Splash>
    );
  }
  if (!data) return <Splash text="Carregando os dados…" />;
  return (
    <StoreProvider repo={repo} initial={data} author={author}>
      <Routes onSignOut={onSignOut} />
    </StoreProvider>
  );
}

function Routes({ onSignOut }: { onSignOut?: () => void }) {
  const route = useRoute();
  const [a, b, c] = route.segments;

  useEffect(() => {
    document.getElementById("conteudo")?.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }, [route.path]);

  let page;
  if (!a) page = <Dashboard />;
  else if (a === "vendas" && b === "nova") page = <SaleForm key={`nova-${route.query.toString()}`} leadId={route.query.get("lead")} />;
  else if (a === "vendas" && b && c === "editar") page = <SaleForm key={`ed-${b}`} saleId={b} />;
  else if (a === "vendas" && b) page = <SaleDetail id={b} />;
  else if (a === "vendas") page = <Sales query={route.query} />;
  else if (a === "agenda") page = <Calendar />;
  else if (a === "custos") page = <Costs focus={route.query.get("id")} />;
  else if (a === "funil") page = <Funnel focus={route.query.get("id")} />;
  else if (a === "config") page = <SettingsPage />;
  else page = <p>Página não encontrada. <a href="#/" className="text-accent underline">Voltar ao painel</a></p>;

  return <Shell route={route} onSignOut={onSignOut}>{page}</Shell>;
}

function Splash({ text, children }: { text: string; children?: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 px-6 text-center">
      <Wordmark />
      <p className="max-w-sm text-[15px] text-ink-2" role="status">{text}</p>
      {children}
    </div>
  );
}
