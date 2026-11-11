import { useEffect, type ReactNode } from "react";
import { href, type Route } from "../data/router";
import { useStore } from "../data/store";
import { cx } from "./kit";
import { useTheme } from "./theme";

const NAV = [
  { to: "/", label: "Painel", short: "Painel" },
  { to: "/vendas", label: "Vendas", short: "Vendas" },
  { to: "/agenda", label: "Calendário", short: "Agenda" },
  { to: "/funil", label: "Funil", short: "Funil" },
  { to: "/custos", label: "Custos", short: "Custos" },
];

function isActive(route: Route, to: string): boolean {
  if (to === "/") return route.path === "/";
  return route.path === to || route.path.startsWith(`${to}/`);
}

export function Wordmark() {
  return (
    <span className="inline-flex items-baseline gap-1.5 font-semibold tracking-[-0.02em]">
      <span className="text-[17px]">lumivo</span>
      <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-ink-3">painel</span>
    </span>
  );
}

export function Shell({ route, children, onSignOut }: { route: Route; children: ReactNode; onSignOut?: () => void }) {
  const { mode, toastState, dismissToast } = useStore();
  const [theme, toggleTheme] = useTheme();
  const onForm = route.path.startsWith("/vendas/nova") || route.path.endsWith("/editar");

  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[216px_minmax(0,1fr)]">
      <a href="#conteudo" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-surface focus:px-3 focus:py-2">
        Pular para o conteúdo
      </a>

      {/* Lateral (desktop) */}
      <aside className="hidden lg:flex lg:sticky lg:top-0 lg:h-dvh flex-col border-r border-line bg-surface px-4 py-5">
        <a href={href("/")} className="px-2 text-ink no-underline"><Wordmark /></a>
        <a href={href("/vendas/nova")} className="mt-6 inline-flex min-h-10 items-center justify-center rounded-lg bg-accent px-3 text-[15px] font-medium text-accent-ink no-underline hover:bg-accent-strong">
          Nova venda
        </a>
        <nav aria-label="Principal" className="mt-6 flex flex-col gap-0.5">
          {[...NAV, { to: "/config", label: "Configurações", short: "Ajustes" }].map((n) => (
            <a
              key={n.to}
              href={href(n.to)}
              aria-current={isActive(route, n.to) ? "page" : undefined}
              className={cx(
                "relative rounded-md px-2 py-2 text-[15px] no-underline transition-colors duration-150",
                isActive(route, n.to)
                  ? "bg-surface-2 font-semibold text-ink before:absolute before:-left-4 before:top-2 before:bottom-2 before:w-[3px] before:rounded-r before:bg-accent"
                  : "text-ink-2 hover:bg-surface-2 hover:text-ink",
              )}
            >
              {n.label}
            </a>
          ))}
        </nav>
        <div className="mt-auto flex flex-col gap-2 border-t border-line pt-4 text-[13px] text-ink-3">
          {mode === "local" && <p>Modo local: os dados ficam só neste navegador.</p>}
          <button type="button" onClick={toggleTheme} className="min-h-9 rounded-md px-2 text-left text-ink-2 hover:bg-surface-2">
            {theme === "dark" ? "Usar tema claro" : "Usar tema escuro"}
          </button>
          {onSignOut && (
            <button type="button" onClick={onSignOut} className="min-h-9 rounded-md px-2 text-left text-ink-2 hover:bg-surface-2">
              Sair
            </button>
          )}
        </div>
      </aside>

      {/* Topo (celular) */}
      <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-line bg-bg/95 px-4 py-2.5 backdrop-blur lg:hidden">
        <a href={href("/")} className="text-ink no-underline"><Wordmark /></a>
        <div className="flex items-center gap-1">
          {mode === "local" && <span className="rounded-full border border-line px-2 py-0.5 text-[12px] text-ink-3" title="Modo local: os dados ficam só neste navegador.">Modo local</span>}
          <a
            href={href("/config")}
            aria-current={route.path === "/config" ? "page" : undefined}
            className={cx("inline-flex min-h-11 items-center rounded-md px-2 text-[14px] no-underline", route.path === "/config" ? "font-semibold text-ink" : "text-ink-2")}
          >
            Ajustes
          </a>
        </div>
      </header>

      <main id="conteudo" tabIndex={-1} className="mx-auto w-full max-w-[1180px] px-4 pb-32 pt-5 outline-none sm:px-6 lg:px-10 lg:pb-12 lg:pt-8">
        {children}
      </main>

      {/* Botão flutuante (celular) */}
      {!onForm && (
        <a
          href={href("/vendas/nova")}
          className="fixed right-4 z-30 inline-flex min-h-12 items-center rounded-full bg-accent px-5 text-[15px] font-semibold text-accent-ink no-underline shadow-[0_8px_24px_-8px_rgb(8_18_24/0.5)] lg:hidden"
          style={{ bottom: "calc(68px + env(safe-area-inset-bottom))" }}
        >
          Nova venda
        </a>
      )}

      {/* Navegação inferior (celular) */}
      <nav aria-label="Principal" className="safe-bottom fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface lg:hidden">
        <ul className="grid grid-cols-5">
          {NAV.map((n) => (
            <li key={n.to}>
              <a
                href={href(n.to)}
                aria-current={isActive(route, n.to) ? "page" : undefined}
                className={cx(
                  "relative flex min-h-14 items-center justify-center text-[13.5px] no-underline",
                  isActive(route, n.to)
                    ? "font-semibold text-ink before:absolute before:inset-x-4 before:top-0 before:h-[3px] before:rounded-b before:bg-accent"
                    : "text-ink-3",
                )}
              >
                {n.short}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <Toast state={toastState} onDismiss={dismissToast} />
    </div>
  );
}

function Toast({ state, onDismiss }: { state: ReturnType<typeof useStore>["toastState"]; onDismiss: () => void }) {
  useEffect(() => {
    if (!state) return;
    const t = setTimeout(onDismiss, state.action ? 7000 : 4000);
    return () => clearTimeout(t);
  }, [state, onDismiss]);
  return (
    <div aria-live="polite" role="status" className="pointer-events-none fixed inset-x-0 z-50 flex justify-center px-4 lg:bottom-6" style={{ bottom: "calc(128px + env(safe-area-inset-bottom))" }}>
      {state && (
        <div
          key={state.id}
          className={cx(
            "rise pointer-events-auto flex max-w-md items-center gap-3 rounded-lg px-4 py-2.5 text-[14px] shadow-[0_10px_30px_-10px_rgb(8_18_24/0.5)]",
            state.tone === "error" ? "bg-danger text-bg" : "bg-ink text-bg",
          )}
        >
          <span>{state.message}</span>
          {state.action && (
            <button
              type="button"
              className="min-h-9 rounded-md px-2 font-semibold underline underline-offset-2"
              onClick={() => { state.action?.run(); onDismiss(); }}
            >
              {state.action.label}
            </button>
          )}
          <button type="button" onClick={onDismiss} aria-label="Fechar aviso" className="min-h-9 min-w-9 rounded-md opacity-70 hover:opacity-100">×</button>
        </div>
      )}
    </div>
  );
}
