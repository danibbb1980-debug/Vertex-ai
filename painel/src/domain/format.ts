import { addDays, addMonths, format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { ISODate } from "./types";

export const TIMEZONE = "America/Sao_Paulo";

const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const brlShort = new Intl.NumberFormat("pt-BR", {
  style: "currency", currency: "BRL", maximumFractionDigits: 0,
});
const pct = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 1 });
const num2 = new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** R$ 1.234,56 (com espaço normal, não o espaço rígido do Intl). */
export function money(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value)) return "—";
  return brl.format(value).replace(/ /g, " ");
}

export function moneyShort(value: number): string {
  return brlShort.format(value).replace(/ /g, " ");
}

export function percent(value: number): string {
  return `${pct.format(value)}%`;
}

/** 1234.5 -> "1.234,50" (para preencher campos de valor). */
export function moneyInput(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value)) return "";
  return num2.format(value);
}

/** Arredonda para centavos sem erro de ponto flutuante. */
export function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

/**
 * Lê valores no formato brasileiro: "R$ 1.234,56", "1234,56", "297", "1.234".
 * Também aceita ponto decimal ("297.5"). Retorna null se não for número.
 */
export function parseMoney(input: string | number | null | undefined): number | null {
  if (input == null) return null;
  if (typeof input === "number") return Number.isFinite(input) ? round2(input) : null;
  let s = input.replace(/R\$|\s| /gi, "").trim();
  if (!s) return null;
  const negative = s.startsWith("-");
  s = s.replace(/^-/, "");
  if (s.includes(",")) {
    s = s.replace(/\./g, "").replace(",", ".");
  } else if (/^\d{1,3}(\.\d{3})+$/.test(s)) {
    s = s.replace(/\./g, "");
  }
  if (!/^\d+(\.\d+)?$/.test(s)) return null;
  const n = Number(s);
  return Number.isFinite(n) ? round2(negative ? -n : n) : null;
}

/** Hoje no fuso de São Paulo, "aaaa-mm-dd". */
export function todayISO(now: Date = new Date()): ISODate {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TIMEZONE, year: "numeric", month: "2-digit", day: "2-digit",
  }).format(now);
}

export function toDate(iso: ISODate): Date {
  return parseISO(iso);
}

export function toISO(date: Date): ISODate {
  return format(date, "yyyy-MM-dd");
}

export function plusDays(iso: ISODate, days: number): ISODate {
  return toISO(addDays(toDate(iso), days));
}

export function plusMonths(iso: ISODate, months: number): ISODate {
  return toISO(addMonths(toDate(iso), months));
}

/** "aaaa-mm-dd" -> "dd/mm/aaaa". */
export function dateBR(iso: ISODate | null | undefined): string {
  if (!iso) return "—";
  const [y, m, d] = iso.slice(0, 10).split("-");
  return `${d}/${m}/${y}`;
}

/** "dd/mm/aaaa" (ou "dd/mm/aa") -> "aaaa-mm-dd". Null se a data não existir. */
export function parseDateBR(input: string): ISODate | null {
  const m = input.trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{2}|\d{4})$/);
  if (!m) return null;
  const d = Number(m[1]);
  const mo = Number(m[2]);
  const y = m[3].length === 2 ? 2000 + Number(m[3]) : Number(m[3]);
  const date = new Date(y, mo - 1, d);
  if (date.getFullYear() !== y || date.getMonth() !== mo - 1 || date.getDate() !== d) return null;
  return toISO(date);
}

/** "aaaa-mm" do mês de uma data. */
export function monthKey(iso: ISODate): string {
  return iso.slice(0, 7);
}

export function monthLabel(key: string): string {
  const s = format(parseISO(`${key}-01`), "MMMM 'de' yyyy", { locale: ptBR });
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function monthShort(key: string): string {
  return format(parseISO(`${key}-01`), "MMM/yy", { locale: ptBR });
}

export function shiftMonth(key: string, delta: number): string {
  return format(addMonths(parseISO(`${key}-01`), delta), "yyyy-MM");
}

export function weekdayShort(iso: ISODate): string {
  return format(toDate(iso), "EEE", { locale: ptBR });
}

export function daysBetween(fromISO: ISODate, toISODate: ISODate): number {
  const a = Date.UTC(+fromISO.slice(0, 4), +fromISO.slice(5, 7) - 1, +fromISO.slice(8, 10));
  const b = Date.UTC(+toISODate.slice(0, 4), +toISODate.slice(5, 7) - 1, +toISODate.slice(8, 10));
  return Math.round((b - a) / 86_400_000);
}

export function dateTimeBR(iso: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: TIMEZONE, day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  }).format(new Date(iso));
}
