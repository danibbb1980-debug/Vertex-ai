import type { DiaSemana, Horario } from "../config";

const NOMES: Record<DiaSemana, string> = {
  0: "Domingo",
  1: "Segunda",
  2: "Terça",
  3: "Quarta",
  4: "Quinta",
  5: "Sexta",
  6: "Sábado",
};

const ORDEM: DiaSemana[] = [1, 2, 3, 4, 5, 6, 0];

const minutos = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};
const hhmm = (min: number) =>
  `${String(Math.floor(min / 60)).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}`;

/** "08:00" -> "08h", "08:30" -> "08h30" */
export const formatarHora = (h: string) => {
  const [hh, mm] = h.split(":");
  return mm === "00" ? `${hh}h` : `${hh}h${mm}`;
};

export function horarioDoDia(horarios: Horario[], dia: number) {
  return horarios.find((h) => h.dia === dia);
}

/** Agrupa dias consecutivos com o mesmo horário: "Segunda a sexta · 08h às 20h". */
export function resumoHorarios(horarios: Horario[]) {
  type Linha = { dias: DiaSemana[]; texto: string };
  const linhas: Linha[] = [];
  for (const dia of ORDEM) {
    const h = horarioDoDia(horarios, dia);
    const texto = h
      ? `${formatarHora(h.abre)} às ${formatarHora(h.fecha)}` +
        (h.almoco ? ` (intervalo ${formatarHora(h.almoco.inicio)} às ${formatarHora(h.almoco.fim)})` : "")
      : "Fechado";
    const ultima = linhas[linhas.length - 1];
    if (ultima && ultima.texto === texto) ultima.dias.push(dia);
    else linhas.push({ dias: [dia], texto });
  }
  return linhas.map(({ dias, texto }) => {
    const primeiro = NOMES[dias[0]];
    const rotulo =
      dias.length === 1
        ? primeiro
        : dias.length === 2
          ? `${primeiro} e ${NOMES[dias[1]].toLowerCase()}`
          : `${primeiro} a ${NOMES[dias[dias.length - 1]].toLowerCase()}`;
    return { rotulo, texto, fechado: texto === "Fechado" };
  });
}

/** Blocos de 1 hora, sem o horário de fechamento e sem o almoço. */
export function blocosDoDia(horarios: Horario[], dia: number, aPartirDe?: number): string[] {
  const h = horarioDoDia(horarios, dia);
  if (!h) return [];
  const blocos: string[] = [];
  const fim = minutos(h.fecha);
  for (let t = minutos(h.abre); t + 60 <= fim; t += 60) {
    if (h.almoco) {
      const ai = minutos(h.almoco.inicio);
      const af = minutos(h.almoco.fim);
      if (t < af && t + 60 > ai) continue;
    }
    if (aPartirDe !== undefined && t <= aPartirDe) continue;
    blocos.push(hhmm(t));
  }
  return blocos;
}

/** Última hora de fechamento entre os dias (para textos como "até as 20h"). */
export function fechamentoMaisTarde(horarios: Horario[]) {
  const maior = horarios.reduce((m, h) => Math.max(m, minutos(h.fecha)), 0);
  return maior ? formatarHora(hhmm(maior)) : "";
}

export const isoLocal = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export const dataDeIso = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
};

export const formatarDataBR = (iso: string) => {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
};

/** Próximos dias com atendimento, para atalhos no formulário. */
export function proximosDiasAbertos(horarios: Horario[], quantidade: number, hoje = new Date()) {
  const dias: string[] = [];
  const d = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
  const agora = hoje.getHours() * 60 + hoje.getMinutes();
  for (let i = 0; dias.length < quantidade && i < 60; i++) {
    const dia = d.getDay();
    const livres = blocosDoDia(horarios, dia, i === 0 ? agora : undefined);
    if (livres.length) dias.push(isoLocal(d));
    d.setDate(d.getDate() + 1);
  }
  return dias;
}

export const NOME_DIA = NOMES;
