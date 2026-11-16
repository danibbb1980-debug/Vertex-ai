import { CONFIG, type Horario } from "../config";

export const waLink = (mensagem: string) =>
  `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(mensagem)}`;

export const temItens = <T,>(lista: T[] | undefined | null): lista is T[] =>
  Array.isArray(lista) && lista.length > 0;

export const preenchido = (v: string | undefined | null) => typeof v === "string" && v.trim() !== "";

/** "08:00" -> "08h00" */
export const hora = (h: string) => h.replace(":", "h");

export const horarioDoDia = (dia: number): Horario | undefined =>
  CONFIG.horarios.find((h) => h.dia === dia);

/** Blocos de 1 hora, do horário de abertura até 1 hora antes do fechamento. */
export function slotsDoDia(dia: number): string[] {
  const h = horarioDoDia(dia);
  if (!h || !h.abre || !h.fecha) return [];
  const ini = parseInt(h.abre, 10);
  const fim = parseInt(h.fecha, 10);
  const out: string[] = [];
  for (let x = ini; x < fim; x++) out.push(`${String(x).padStart(2, "0")}:00`);
  return out;
}

/** Agrupa dias consecutivos com o mesmo horário: "Segunda a sexta" etc. */
export function horariosAgrupados() {
  const ordem = [1, 2, 3, 4, 5, 6, 0].map((d) => horarioDoDia(d)).filter(Boolean) as Horario[];
  const grupos: { dias: Horario[]; abre: string; fecha: string }[] = [];
  for (const h of ordem) {
    const ult = grupos[grupos.length - 1];
    if (ult && ult.abre === h.abre && ult.fecha === h.fecha) ult.dias.push(h);
    else grupos.push({ dias: [h], abre: h.abre, fecha: h.fecha });
  }
  return grupos.map((g) => {
    const curto = (n: string) => n.replace("-feira", "");
    const rotulo =
      g.dias.length === 1
        ? g.dias[0].nome.replace("-feira", "")
        : `${curto(g.dias[0].nome)} a ${curto(g.dias[g.dias.length - 1].nome).toLowerCase()}`;
    return {
      rotulo,
      dias: g.dias.map((d) => d.dia),
      texto: g.abre ? `${hora(g.abre)} às ${hora(g.fecha)}` : "Fechado",
      aberto: !!g.abre,
    };
  });
}
