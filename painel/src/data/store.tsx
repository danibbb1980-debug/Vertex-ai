import {
  createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode,
} from "react";
import { todayISO } from "../domain/format";
import { applyChanges, ensureRecurring, type Changes } from "../domain/service";
import type { Dataset, Settings, TableName } from "../domain/types";
import type { Repo } from "./repo";

export interface ToastState {
  id: number;
  message: string;
  tone?: "info" | "error";
  action?: { label: string; run: () => void };
}

interface StoreValue {
  data: Dataset;
  mode: Repo["mode"];
  today: string;
  author: string | null;
  commit: (changes: Changes, opts?: { message?: string; undo?: Changes }) => Promise<boolean>;
  saveSettings: (patch: Partial<Settings>, message?: string) => Promise<void>;
  importData: (incoming: Partial<Dataset>) => Promise<number>;
  toast: (t: Omit<ToastState, "id">) => void;
  toastState: ToastState | null;
  dismissToast: () => void;
  reload: () => Promise<void>;
}

const Ctx = createContext<StoreValue | null>(null);

// Ordem de gravação: vendas antes de parcelas/histórico (chave estrangeira).
const ORDER: TableName[] = ["sales", "installments", "sale_history", "costs", "leads"];

export function StoreProvider({
  repo, initial, author, children,
}: { repo: Repo; initial: Dataset; author: string | null; children: ReactNode }) {
  const [data, setData] = useState<Dataset>(initial);
  const dataRef = useRef(data);
  dataRef.current = data;
  const [toastState, setToast] = useState<ToastState | null>(null);
  const [today, setToday] = useState(todayISO());

  // Vira o dia sem precisar recarregar a página.
  useEffect(() => {
    const t = setInterval(() => setToday(todayISO()), 60_000);
    return () => clearInterval(t);
  }, []);

  const toast = useCallback((t: Omit<ToastState, "id">) => setToast({ ...t, id: Date.now() }), []);
  const dismissToast = useCallback(() => setToast(null), []);

  const reload = useCallback(async () => {
    setData(await repo.load());
  }, [repo]);

  const persist = useCallback(async (changes: Changes) => {
    for (const table of ORDER) {
      const rows = changes[table];
      if (rows?.length) await repo.upsert(table, rows);
    }
  }, [repo]);

  const commit = useCallback<StoreValue["commit"]>(async (changes, opts) => {
    setData((d) => applyChanges(d, changes));
    try {
      await persist(changes);
    } catch (e) {
      toast({ message: (e as Error).message || "Erro ao salvar.", tone: "error" });
      await reload().catch(() => undefined);
      return false;
    }
    if (opts?.message) {
      const undo = opts.undo;
      toast({
        message: opts.message,
        action: undo ? {
          label: "Desfazer",
          run: () => {
            setData((d) => applyChanges(d, undo));
            persist(undo).catch((e) => toast({ message: (e as Error).message, tone: "error" }));
          },
        } : undefined,
      });
    }
    return true;
  }, [persist, reload, toast]);

  const saveSettings = useCallback<StoreValue["saveSettings"]>(async (patch, message) => {
    const settings = { ...dataRef.current.settings, ...patch, updated_at: new Date().toISOString() };
    setData((d) => ({ ...d, settings }));
    try {
      await repo.saveSettings(settings);
      if (message) toast({ message });
    } catch (e) {
      toast({ message: (e as Error).message, tone: "error" });
    }
  }, [repo, toast]);

  const importData = useCallback<StoreValue["importData"]>(async (incoming) => {
    const changes: Changes = {};
    let count = 0;
    for (const t of ORDER) {
      const rows = incoming[t];
      if (Array.isArray(rows) && rows.length) {
        (changes as Record<string, unknown>)[t] = rows;
        count += rows.length;
      }
    }
    await persist(changes);
    if (incoming.settings) {
      await repo.saveSettings({ ...dataRef.current.settings, ...incoming.settings, id: 1 });
    }
    await reload();
    return count;
  }, [persist, reload, repo]);

  // Planos mensais: cria as mensalidades que venceram desde o último acesso.
  useEffect(() => {
    const changes = ensureRecurring(dataRef.current, today);
    if (changes.installments?.length) void commit(changes);
  }, [today, commit]);

  const value = useMemo<StoreValue>(() => ({
    data, mode: repo.mode, today, author, commit, saveSettings, importData, toast, toastState,
    dismissToast, reload,
  }), [data, repo.mode, today, author, commit, saveSettings, importData, toast, toastState, dismissToast, reload]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore(): StoreValue {
  const v = useContext(Ctx);
  if (!v) throw new Error("useStore fora do StoreProvider");
  return v;
}

/** Apenas linhas não excluídas. */
export function alive<T extends { deleted_at: string | null }>(rows: T[]): T[] {
  return rows.filter((r) => !r.deleted_at);
}
