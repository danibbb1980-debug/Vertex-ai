// Armazenamento. Dois modos com a mesma interface:
// - local: tudo no localStorage deste navegador (quando não há Supabase);
// - supabase: Postgres com login e RLS.
import { createClient, type Session, type SupabaseClient } from "@supabase/supabase-js";
import { DEFAULT_BUSINESS_DAYS, DEFAULT_RETAKE_DAYS, migrateLeadsToFollowups } from "../domain/followups";
import type { Dataset, Settings, TableName } from "../domain/types";
import { defaultSettings, seedCosts } from "./seed";

export interface Repo {
  mode: "local" | "supabase";
  load(): Promise<Dataset>;
  upsert(table: TableName, rows: object[]): Promise<void>;
  saveSettings(settings: Settings): Promise<void>;
}

const TABLES: TableName[] = ["sales", "installments", "costs", "leads", "sale_history", "followups"];

// ------------------------------------------------------------------ local

const KEY = "lumivo-painel:dados:v1";

function emptyDataset(): Dataset {
  return {
    sales: [], installments: [], costs: seedCosts(), leads: [], sale_history: [], followups: [], settings: defaultSettings(),
  };
}

/**
 * Migração do modo local: dados salvos antes dos follow-ups não têm a lista
 * `followups`. Cada lead com "próximo follow-up" ganha um follow-up em aberto.
 * Nada existente é alterado ou apagado. Retorna `migrated` = true se mudou algo.
 */
export function migrateLocalDataset(parsed: Partial<Dataset>): { data: Dataset; migrated: boolean } {
  const base: Dataset = {
    ...emptyDataset(), ...parsed,
    settings: { ...defaultSettings(), ...parsed.settings, fees: parsed.settings?.fees ?? {} },
  };
  if (Array.isArray(parsed.followups)) return { data: base, migrated: false };
  return { data: { ...base, followups: migrateLeadsToFollowups(base.leads, []) }, migrated: true };
}

export function createLocalRepo(): Repo {
  let cache: Dataset | null = null;
  const read = (): Dataset => {
    if (cache) return cache;
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const { data, migrated } = migrateLocalDataset(JSON.parse(raw) as Partial<Dataset>);
        cache = data;
        if (migrated) write(data);
        return cache;
      }
    } catch {
      /* armazenamento indisponível: segue em memória */
    }
    cache = emptyDataset();
    write(cache);
    return cache;
  };
  const write = (d: Dataset) => {
    cache = d;
    try {
      localStorage.setItem(KEY, JSON.stringify(d));
    } catch (e) {
      throw new Error("Não foi possível salvar neste navegador (armazenamento cheio ou bloqueado).", { cause: e });
    }
  };
  return {
    mode: "local",
    async load() {
      return structuredClone(read());
    },
    async upsert(table, rows) {
      const d = read();
      const map = new Map((d[table] as { id: string }[]).map((r) => [r.id, r]));
      for (const r of rows as { id: string }[]) map.set(r.id, r);
      write({ ...d, [table]: [...map.values()] });
    },
    async saveSettings(settings) {
      write({ ...read(), settings });
    },
  };
}

// ------------------------------------------------------------------ supabase

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const supabaseConfigured = Boolean(url && anonKey);

let client: SupabaseClient | null = null;
export function supabase(): SupabaseClient {
  if (!client) {
    if (!url || !anonKey) throw new Error("Supabase não configurado");
    client = createClient(url, anonKey, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    });
  }
  return client;
}

const NUMERIC = new Set([
  "gross_amount", "net_amount", "fee_percent", "amount", "offered_amount", "monthly_goal",
  "mei_limit", "mei_other_revenue", "hourly_cost", "daily_cost",
]);

/** O Postgres pode devolver numeric como texto; garante número. */
function normalize<T extends object>(row: T): T {
  const out = { ...row } as Record<string, unknown>;
  for (const k of Object.keys(out)) {
    if (NUMERIC.has(k) && out[k] != null) out[k] = Number(out[k]);
  }
  return out as unknown as T;
}

async function selectAll(sb: SupabaseClient, table: string): Promise<object[]> {
  const rows: object[] = [];
  const page = 1000;
  for (let from = 0; ; from += page) {
    const { data, error } = await sb.from(table).select("*").range(from, from + page - 1);
    if (error) throw new Error(`Erro ao ler ${table}: ${error.message}`);
    rows.push(...(data ?? []).map(normalize));
    if (!data || data.length < page) break;
  }
  return rows;
}

export class NotAllowedError extends Error {
  constructor() {
    super("Este e-mail não está na lista de acesso do painel.");
  }
}

/** A tabela de follow-ups ainda não existe: falta rodar a migração no Supabase. */
export class MigrationMissingError extends Error {
  constructor() {
    super("O banco ainda não tem a tabela de follow-ups. Rode supabase/migrations/20261114_followups.sql no SQL Editor do Supabase e recarregue a página.");
  }
}

export function createSupabaseRepo(): Repo {
  const sb = supabase();
  return {
    mode: "supabase",
    async load() {
      const { data: allowed, error: allowErr } = await sb.rpc("is_allowed");
      if (allowErr) throw new Error(`Erro ao verificar acesso: ${allowErr.message}`);
      if (allowed !== true) throw new NotAllowedError();
      let rows: object[][];
      try {
        rows = await Promise.all([...TABLES.map((t) => selectAll(sb, t)), selectAll(sb, "settings")]);
      } catch (e) {
        if (/followups/.test((e as Error).message)) throw new MigrationMissingError();
        throw e;
      }
      const [sales, installments, costs, leads, sale_history, followups, settingsRows] = rows;
      let settings = settingsRows[0] as Settings | undefined;
      if (!settings) {
        settings = defaultSettings();
        const { error } = await sb.from("settings").upsert(settings);
        if (error) throw new Error(`Erro ao criar configurações: ${error.message}`);
      }
      return {
        sales, installments, costs, leads, sale_history, followups,
        settings: {
          ...defaultSettings(), ...settings, fees: settings.fees ?? {},
          followup_templates: settings.followup_templates ?? {},
          followup_business_days: settings.followup_business_days ?? DEFAULT_BUSINESS_DAYS,
          followup_retake_days: settings.followup_retake_days ?? DEFAULT_RETAKE_DAYS,
        },
      } as Dataset;
    },
    async upsert(table, rows) {
      if (!rows.length) return;
      const { error } = await sb.from(table).upsert(rows);
      if (error) throw new Error(`Erro ao salvar (${table}): ${error.message}`);
    },
    async saveSettings(settings) {
      const { error } = await sb.from("settings").upsert(settings);
      if (error) throw new Error(`Erro ao salvar configurações: ${error.message}`);
    },
  };
}

export type { Session };
