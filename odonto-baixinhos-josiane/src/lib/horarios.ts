import { CONFIG, type DiaSemana, type Faixa } from "../config";

export const NOMES_DIAS = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

const paraMin = (h: string) => {
  const [hh, mm] = h.split(":").map(Number);
  return hh * 60 + mm;
};
const paraHora = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
export const formatarHora = (h: string) => h.replace(":", "h");

export function faixasDoDia(dia: number): Faixa[] {
  return CONFIG.horarios[dia as DiaSemana] ?? [];
}

/** Linhas agrupadas para exibir ("Segunda a sexta" etc.). */
export function linhasDeHorario(): { dias: string; texto: string; fechado: boolean }[] {
  const ordem = [1, 2, 3, 4, 5, 6, 0];
  const chave = (d: number) => faixasDoDia(d).map((f) => `${f.inicio}-${f.fim}`).join("|");
  const grupos: { inicio: number; fim: number; k: string }[] = [];
  for (const d of ordem) {
    const k = chave(d);
    const ult = grupos[grupos.length - 1];
    if (ult && ult.k === k) ult.fim = d;
    else grupos.push({ inicio: d, fim: d, k });
  }
  return grupos.map((g) => {
    const a = NOMES_DIAS[g.inicio];
    const b = NOMES_DIAS[g.fim];
    const dias = g.inicio === g.fim ? a : g.inicio === 6 && g.fim === 0 ? "Sábado e domingo" : `${a} a ${b.toLowerCase()}`;
    const faixas = faixasDoDia(g.inicio);
    return {
      dias,
      fechado: faixas.length === 0,
      texto: faixas.length ? faixas.map((f) => `${formatarHora(f.inicio)} – ${formatarHora(f.fim)}`).join(" · ") : "Fechado",
    };
  });
}

/** Blocos de 1 hora dentro das faixas (exclui almoço e fechamento). */
export function horariosDisponiveis(data: Date, agora = new Date()): string[] {
  const bloco = CONFIG.agendamento.duracaoBlocoMin;
  const mesmoDia = data.toDateString() === agora.toDateString();
  const minAgora = agora.getHours() * 60 + agora.getMinutes();
  const lista: string[] = [];
  for (const f of faixasDoDia(data.getDay())) {
    for (let m = paraMin(f.inicio); m + bloco <= paraMin(f.fim); m += bloco) {
      if (mesmoDia && m <= minAgora) continue;
      lista.push(paraHora(m));
    }
  }
  return lista;
}

export function diaAberto(data: Date): boolean {
  return faixasDoDia(data.getDay()).length > 0;
}

/** "2026-11-03" → Date local (sem fuso). */
export function lerData(iso: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return null;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return Number.isNaN(d.getTime()) ? null : d;
}
export const isoLocal = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
export const dataBR = (d: Date) =>
  `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
