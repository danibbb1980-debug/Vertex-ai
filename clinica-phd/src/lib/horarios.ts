import { CONFIG, type Horario } from "../config";

export const aberto = (h: Horario) => h.abre !== "" && h.fecha !== "";

const paraMin = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};
const paraHHMM = (min: number) =>
  `${String(Math.floor(min / 60)).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}`;

/** "08:00" -> "8h"; "08:30" -> "8h30" */
export const horaCurta = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return m ? `${h}h${String(m).padStart(2, "0")}` : `${h}h`;
};

export const horarioDoDia = (dia: number) => CONFIG.horarios.find((h) => h.dia === dia);

export const diaAberto = (dia: number) => {
  const h = horarioDoDia(dia);
  return !!h && aberto(h);
};

/**
 * Blocos de horário para o formulário: começam na abertura, de hora em hora,
 * sempre terminando até o fechamento e fora da pausa de almoço (se houver).
 */
export const blocosDoDia = (dia: number): string[] => {
  const h = horarioDoDia(dia);
  if (!h || !aberto(h)) return [];
  const passo = CONFIG.agendamento.intervaloMinutos;
  const inicio = paraMin(h.abre);
  const fim = paraMin(h.fecha);
  const almoco = CONFIG.almoco
    ? { i: paraMin(CONFIG.almoco.inicio), f: paraMin(CONFIG.almoco.fim) }
    : null;
  const blocos: string[] = [];
  for (let t = inicio; t + passo <= fim; t += passo) {
    if (almoco && t < almoco.f && t + passo > almoco.i) continue;
    blocos.push(paraHHMM(t));
  }
  return blocos;
};

/** Agrupa dias consecutivos com o mesmo horário: "Segunda a sexta", "8h às 18h" */
export const resumoHorarios = () => {
  const ordem = [1, 2, 3, 4, 5, 6, 0];
  const curto: Record<number, string> = { 0: "domingo", 1: "segunda", 2: "terça", 3: "quarta", 4: "quinta", 5: "sexta", 6: "sábado" };
  const grupos: { dias: number[]; texto: string; aberto: boolean }[] = [];
  for (const d of ordem) {
    const h = horarioDoDia(d);
    if (!h) continue;
    const texto = aberto(h) ? `${horaCurta(h.abre)} às ${horaCurta(h.fecha)}` : "Fechado";
    const ult = grupos[grupos.length - 1];
    if (ult && ult.texto === texto) ult.dias.push(d);
    else grupos.push({ dias: [d], texto, aberto: aberto(h) });
  }
  return grupos.map((g) => {
    const primeiro = curto[g.dias[0]];
    const ultimo = curto[g.dias[g.dias.length - 1]];
    const nome =
      g.dias.length === 1
        ? primeiro
        : g.dias.length === 2
          ? `${primeiro} e ${ultimo}`
          : `${primeiro} a ${ultimo}`;
    return { dias: nome.charAt(0).toUpperCase() + nome.slice(1), texto: g.texto, aberto: g.aberto };
  });
};
