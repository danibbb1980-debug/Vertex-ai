import { CONFIG, type Horario } from "../config";

/** "08:00" -> "8h"; "09:30" -> "9h30" */
export const fmtHora = (h: string) => {
  const [hh, mm] = h.split(":");
  return `${Number(hh)}h${mm === "00" ? "" : mm}`;
};

export const faixa = (h: Horario) =>
  h.abre && h.fecha ? `${fmtHora(h.abre)} às ${fmtHora(h.fecha)}` : "Fechado";

export const horarioDoDia = (diaSemana: number) =>
  CONFIG.horarios.find((h) => h.diasSemana.includes(diaSemana));

/** Horários de início possíveis (blocos de 1 h, o último 1 h antes de fechar). */
export const slotsDoDia = (diaSemana: number): string[] => {
  const h = horarioDoDia(diaSemana);
  if (!h || !h.abre || !h.fecha) return [];
  const [a] = h.abre.split(":").map(Number);
  const [f] = h.fecha.split(":").map(Number);
  const out: string[] = [];
  for (let x = a; x <= f - 1; x++) out.push(`${String(x).padStart(2, "0")}:00`);
  return out;
};

/** Data de hoje (aaaa-mm-dd) no fuso do espaço. */
export const hojeISO = () =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: CONFIG.fusoHorario,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());

/** Dia da semana de uma data aaaa-mm-dd (independe do fuso do navegador). */
export const diaSemanaISO = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
};

export const fmtDataBR = (iso: string) => iso.split("-").reverse().join("/");

/** Texto corrido dos horários, para as dúvidas. */
export const horariosTexto = () =>
  CONFIG.horarios
    .map((h) => `${h.dia.toLowerCase()}, ${faixa(h).toLowerCase()}`)
    .join("; ")
    .replace(/^./, (c) => c.toUpperCase()) + ".";
