import { CONFIG, type Dia, type Horario } from "../config";

export const minutos = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

export const hhmm = (min: number) =>
  `${String(Math.floor(min / 60)).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}`;

/** "06:30" -> "6h30", "21:00" -> "21h" */
export const curto = (h: string) => {
  const [hh, mm] = h.split(":");
  return `${Number(hh)}h${mm === "00" ? "" : mm}`;
};

export const DIAS_CURTOS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"] as const;
export const DIAS_LONGOS = [
  "Domingo",
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
] as const;

export function horarioDoDia(dia: Dia): Horario | undefined {
  return CONFIG.horarios.find((h) => h.dias.includes(dia));
}

/**
 * Blocos de 1 hora dentro do funcionamento: começam na primeira hora cheia
 * a partir da abertura e terminam 1 hora antes do fechamento.
 * Seg a sex 06:30–21:00 -> 07:00 ... 20:00. Sáb/dom 07:00–11:00 -> 07:00 ... 10:00.
 */
export function blocosDoDia(dia: Dia): string[] {
  const h = horarioDoDia(dia);
  if (!h) return [];
  const passo = CONFIG.agendamento.duracaoBlocoMin;
  const inicio = Math.ceil(minutos(h.abre) / 60) * 60;
  const ultimo = minutos(h.fecha) - passo;
  const out: string[] = [];
  for (let t = inicio; t <= ultimo; t += passo) out.push(hhmm(t));
  return out;
}

/** Dia da semana em São João da Boa Vista (America/Sao_Paulo). */
export function hojeEmSP(): { iso: string; dia: Dia } {
  const partes = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
  return { iso: partes, dia: diaDaData(partes) };
}

export function diaDaData(iso: string): Dia {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay() as Dia;
}

export const dataBR = (iso: string) => iso.split("-").reverse().join("/");

/** Resumo do fim de semana a partir do config (sábado e/ou domingo). */
export function resumoFds(): { curto: string; longo: string; h: Horario } | null {
  const sab = horarioDoDia(6);
  const dom = horarioDoDia(0);
  if (sab && dom && sab.abre === dom.abre && sab.fecha === dom.fecha) return { curto: "Sáb. e dom.", longo: "sábados e domingos", h: sab };
  if (sab) return { curto: "Sáb.", longo: "sábados", h: sab };
  if (dom) return { curto: "Dom.", longo: "domingos", h: dom };
  return null;
}
