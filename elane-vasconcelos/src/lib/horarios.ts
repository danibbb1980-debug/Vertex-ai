import { CONFIG } from "../config";

const toMin = (h: string) => {
  const [a, b] = h.split(":").map(Number);
  return a * 60 + b;
};
const toHora = (m: number) =>
  `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;

/** "08:00" -> "8h", "08:30" -> "8h30" */
export const legivel = (h: string) => {
  const [a, b] = h.split(":");
  return `${Number(a)}h${b === "00" ? "" : b}`;
};

/** Blocos de 1h dentro de cada faixa, sem incluir o horário de fechamento. */
export function blocosDoDia(diaSemana: number): string[] {
  const faixas = CONFIG.horarios[diaSemana] ?? [];
  const out: string[] = [];
  for (const [ini, fim] of faixas) {
    for (let m = toMin(ini); m + 60 <= toMin(fim); m += 60) out.push(toHora(m));
  }
  return out;
}

export const diaAberto = (diaSemana: number) => (CONFIG.horarios[diaSemana] ?? []).length > 0;

/** "yyyy-mm-dd" -> dia da semana local, sem fuso. */
export function diaDaSemana(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).getDay();
}

export function hojeISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export const isoParaBR = (iso: string) => iso.split("-").reverse().join("/");

const NOMES = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

/** Agrupa dias consecutivos com as mesmas faixas: [{dias:"Segunda a sexta", faixas:[...]}] */
export function resumoSemanal() {
  const ordem = [1, 2, 3, 4, 5, 6, 0];
  const grupos: { dias: number[]; faixas: [string, string][] }[] = [];
  for (const d of ordem) {
    const f = CONFIG.horarios[d] ?? [];
    const ult = grupos[grupos.length - 1];
    if (ult && JSON.stringify(ult.faixas) === JSON.stringify(f)) ult.dias.push(d);
    else grupos.push({ dias: [d], faixas: f });
  }
  return grupos.map((g) => ({
    dias:
      g.dias.length > 1
        ? `${NOMES[g.dias[0]]} a ${NOMES[g.dias[g.dias.length - 1]].toLowerCase()}`
        : NOMES[g.dias[0]],
    faixas: g.faixas,
    texto: g.faixas.length
      ? g.faixas.map(([a, b]) => `${legivel(a)} às ${legivel(b)}`).join(" e ")
      : "Fechado",
  }));
}

/** Intervalo entre faixas de dias úteis (ex.: almoço 12h às 14h), se houver. */
export function pausaAlmoco(): string | null {
  const f = CONFIG.horarios[1] ?? [];
  if (f.length < 2) return null;
  return `${legivel(f[0][1])} às ${legivel(f[1][0])}`;
}

/** Para JSON-LD */
export function openingHoursSpec() {
  const schemaDias = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const out: { "@type": string; dayOfWeek: string; opens: string; closes: string }[] = [];
  for (let d = 0; d < 7; d++)
    for (const [opens, closes] of CONFIG.horarios[d] ?? [])
      out.push({ "@type": "OpeningHoursSpecification", dayOfWeek: schemaDias[d], opens, closes });
  return out;
}
