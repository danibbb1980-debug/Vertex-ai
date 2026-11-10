import { CONFIG, DIAS_NOMES, type Horario } from "../config";

const min = (h: string) => {
  const [a, b] = h.split(":").map(Number);
  return a * 60 + b;
};
const hhmm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
export const fmtHora = (h: string) => h.replace(":", "h");

export const horarioDoDia = (dia: number): Horario | undefined => CONFIG.horarios.find((h) => h.dia === dia);

/** Blocos de 1 hora que terminam até o fechamento, sem o almoço. */
export function slotsDoDia(dia: number, aPartirDe?: number): string[] {
  const h = horarioDoDia(dia);
  if (!h) return [];
  const out: string[] = [];
  for (let t = min(h.abre); t + 60 <= min(h.fecha); t += 60) {
    if (h.almoco && t < min(h.almoco.fim) && t + 60 > min(h.almoco.inicio)) continue;
    if (aPartirDe !== undefined && t <= aPartirDe) continue;
    out.push(hhmm(t));
  }
  return out;
}

/** Agrupa dias consecutivos com o mesmo horário: "Segunda a sexta: 09h00 às 18h00". */
export function resumoHorarios(): { dias: string; horas: string }[] {
  const linhas: { dias: string; horas: string }[] = [];
  const ordem = [1, 2, 3, 4, 5, 6, 0];
  let grupo: number[] = [];
  let chave = "";
  const fechar = () => {
    if (!grupo.length) return;
    const n = (d: number) => DIAS_NOMES[d].replace("-feira", "");
    const dias = grupo.length === 1 ? DIAS_NOMES[grupo[0]] : `${n(grupo[0])} a ${n(grupo[grupo.length - 1]).toLowerCase()}`;
    linhas.push({ dias, horas: chave });
    grupo = [];
  };
  for (const d of ordem) {
    const h = horarioDoDia(d);
    const k = h ? `${fmtHora(h.abre)} às ${fmtHora(h.fecha)}${h.almoco ? ` (pausa ${fmtHora(h.almoco.inicio)} às ${fmtHora(h.almoco.fim)})` : ""}` : "Fechado";
    if (k !== chave) { fechar(); chave = k; }
    grupo.push(d);
  }
  fechar();
  // "Sábado a domingo" fica melhor como "Sábado e domingo"
  return linhas.map((l) => ({ ...l, dias: l.dias.replace("Sábado a domingo", "Sábado e domingo") }));
}
