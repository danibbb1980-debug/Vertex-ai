// CSV com ponto e vírgula (o Excel em português abre direto) e cabeçalho com os
// nomes das colunas do banco, para exportar e importar sem perda.

const SEP = ";";

function cell(v: unknown): string {
  if (v == null) return "";
  const s = typeof v === "object" ? JSON.stringify(v) : String(v);
  return /[";\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function toCSV<T extends object>(rows: T[], columns: (keyof T & string)[]): string {
  const head = columns.join(SEP);
  const body = rows.map((r) => columns.map((c) => cell(r[c])).join(SEP));
  return "﻿" + [head, ...body].join("\r\n");
}

/** Lê CSV (com ; ou ,) respeitando aspas. Retorna objetos com strings. */
export function parseCSV(text: string): Record<string, string>[] {
  const src = text.replace(/^﻿/, "");
  const firstLine = src.split(/\r?\n/, 1)[0] ?? "";
  const sep = firstLine.split(";").length >= firstLine.split(",").length ? ";" : ",";
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    if (quoted) {
      if (ch === '"' && src[i + 1] === '"') { field += '"'; i++; }
      else if (ch === '"') quoted = false;
      else field += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === sep) { row.push(field); field = ""; }
    else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && src[i + 1] === "\n") i++;
      row.push(field); rows.push(row); row = []; field = "";
    } else field += ch;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  const [header, ...data] = rows.filter((r) => r.some((c) => c.trim() !== ""));
  if (!header) return [];
  return data.map((r) => Object.fromEntries(header.map((h, i) => [h.trim(), r[i] ?? ""])));
}

type Kind = "number" | "int" | "bool" | "json" | "text";

/** Converte os textos do CSV para os tipos certos de cada coluna. */
export function coerce(row: Record<string, string>, kinds: Record<string, Kind>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, raw] of Object.entries(row)) {
    const v = raw.trim();
    const kind = kinds[k] ?? "text";
    if (v === "") { out[k] = kind === "bool" ? false : null; continue; }
    if (kind === "number") out[k] = Number(v.includes(",") ? v.replace(/\./g, "").replace(",", ".") : v);
    else if (kind === "int") out[k] = parseInt(v, 10);
    else if (kind === "bool") out[k] = /^(true|1|sim|s)$/i.test(v);
    else if (kind === "json") { try { out[k] = JSON.parse(v); } catch { out[k] = {}; } }
    else out[k] = v;
  }
  return out;
}

export const COLUMN_KINDS: Record<string, Kind> = {
  gross_amount: "number", net_amount: "number", fee_percent: "number", amount: "number",
  offered_amount: "number", installments_count: "int", number: "int", day_of_month: "int",
  recurring_active: "bool", active: "bool", stage_dates: "json",
};

export function download(filename: string, content: string, type: string): void {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
