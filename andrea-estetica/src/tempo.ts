import { CONFIG, type Faixa } from "./config";

export const DIAS = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];
export const DIAS_CURTOS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

/** "08:30" -> 8.5 */
export const horaNum = (h: string) => {
  const [hh, mm] = h.split(":").map(Number);
  return hh + mm / 60;
};

/** "18:30" -> "18h30", "08:00" -> "8h" */
export const horaFala = (h: string) => {
  const [hh, mm] = h.split(":").map(Number);
  return mm ? `${hh}h${String(mm).padStart(2, "0")}` : `${hh}h`;
};

/** Agora no fuso de São Paulo: dia da semana, hora decimal e data ISO local. */
export function agoraSP(base: Date = new Date()) {
  const partes = new Intl.DateTimeFormat("en-CA", {
    timeZone: CONFIG.horarios.fuso,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    weekday: "short",
  }).formatToParts(base);
  const p = (t: string) => partes.find((x) => x.type === t)?.value ?? "";
  const mapa: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  return {
    dia: mapa[p("weekday")],
    hora: Number(p("hour")) + Number(p("minute")) / 60,
    iso: `${p("year")}-${p("month")}-${p("day")}`,
  };
}

/** Escala do relógio: primeira abertura e último fechamento da semana. */
export function escala() {
  const faixas = CONFIG.horarios.dias.filter(Boolean) as Exclude<Faixa, null>[];
  const ini = Math.floor(Math.min(...faixas.map((f) => horaNum(f.abre))));
  const fim = Math.ceil(Math.max(...faixas.map((f) => horaNum(f.fecha))));
  return { ini, fim };
}

export type Status = {
  aberto: boolean;
  texto: string;
  /** Hora decimal onde a haste do relógio deve pousar. */
  hasteEm: number;
};

export function status(base: Date = new Date()): Status {
  const { dia, hora } = agoraSP(base);
  const dias = CONFIG.horarios.dias;
  const hoje = dias[dia];

  if (hoje && hora >= horaNum(hoje.abre) && hora < horaNum(hoje.fecha)) {
    return { aberto: true, texto: `Aberto agora, até ${horaFala(hoje.fecha)}`, hasteEm: hora };
  }

  // Próxima abertura
  if (hoje && hora < horaNum(hoje.abre)) {
    return {
      aberto: false,
      texto: `Fechado agora. Abre hoje às ${horaFala(hoje.abre)}`,
      hasteEm: horaNum(hoje.abre),
    };
  }
  for (let i = 1; i <= 7; i++) {
    const d = (dia + i) % 7;
    const f = dias[d];
    if (!f) continue;
    // No domingo, o brief pede o nome do dia ("Abre segunda às 8h").
    const quando = i === 1 && dia !== 0 ? "amanhã" : DIAS[d];
    return {
      aberto: false,
      texto: `Fechado agora. Abre ${quando} às ${horaFala(f.abre)}`,
      hasteEm: horaNum(f.abre),
    };
  }
  return { aberto: false, texto: "Fechado agora", hasteEm: escala().ini };
}

/** Horários de início possíveis (blocos de 1 h, cabendo 1 h antes de fechar). */
export function horariosDoDia(dia: number): string[] {
  const f = CONFIG.horarios.dias[dia];
  if (!f) return [];
  const out: string[] = [];
  for (let h = horaNum(f.abre); h + 1 <= horaNum(f.fecha); h++) {
    const hh = Math.floor(h);
    const mm = Math.round((h - hh) * 60);
    out.push(`${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`);
  }
  return out;
}

/** Dia da semana de uma data "AAAA-MM-DD" (sem efeito de fuso). */
export const diaDaData = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
};

export const dataBR = (iso: string) => iso.split("-").reverse().join("/");
