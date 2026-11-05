import { CONFIG, type Horario } from "../config";

const toMin = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};
const fmt = (min: number) => `${String(Math.floor(min / 60)).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}`;

/** "08h às 21h" */
export const faixa = (h: Horario) => `${h.abre.replace(":00", "h")} às ${h.fecha.replace(":00", "h")}`;

export const horarioDoDia = (dia: number): Horario | undefined =>
  CONFIG.horarios.find((h) => h.dias.includes(dia as Horario["dias"][number]));

/** Data local a partir de "aaaa-mm-dd" (sem fuso UTC). */
export const parseISODate = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
};

export const hojeISO = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

export const dataBR = (iso: string) => iso.split("-").reverse().join("/");

/**
 * Horários de início em blocos de 1 hora, terminando até o fechamento e fora
 * da pausa (se houver). Para hoje, só os horários que ainda não passaram.
 */
export function horariosDisponiveis(iso: string, agora = new Date()): string[] {
  if (!iso) return [];
  const data = parseISODate(iso);
  const h = horarioDoDia(data.getDay());
  if (!h) return [];
  const abre = toMin(h.abre);
  const fecha = toMin(h.fecha);
  const pausa = h.pausa ? [toMin(h.pausa.inicio), toMin(h.pausa.fim)] : null;
  const ehHoje = iso === hojeISO();
  const agoraMin = agora.getHours() * 60 + agora.getMinutes();
  const out: string[] = [];
  for (let t = abre; t + 60 <= fecha; t += 60) {
    if (pausa && t < pausa[1] && t + 60 > pausa[0]) continue;
    if (ehHoje && t <= agoraMin) continue;
    out.push(fmt(t));
  }
  return out;
}

/** Texto dos dias de funcionamento para o formulário: "segunda a sábado". */
export const resumoDias = () => {
  const nomes = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];
  const dias = [...new Set(CONFIG.horarios.flatMap((h) => h.dias))].sort();
  if (!dias.length) return "";
  const contiguo = dias.every((d, i) => i === 0 || d === dias[i - 1] + 1);
  return contiguo && dias.length > 2 ? `${nomes[dias[0]]} a ${nomes[dias[dias.length - 1]]}` : dias.map((d) => nomes[d]).join(", ");
};
