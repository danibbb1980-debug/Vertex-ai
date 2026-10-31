import { CONFIG, type Turno } from '../config';

const NOMES = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];

const toMin = (h: string) => {
  const [a, b] = h.split(':').map(Number);
  return a * 60 + b;
};
const hh = (h: string) => {
  const [a, b] = h.split(':');
  return b === '00' ? `${Number(a)}h` : `${Number(a)}h${b}`;
};
const pad = (n: number) => String(n).padStart(2, '0');

export function turno(dia: number): Turno | null {
  const h = CONFIG.horarios[dia];
  return h && h !== 'fechado' ? h : null;
}

/** Linhas de horário agrupando dias consecutivos iguais. Dias desconhecidos (null) são omitidos. */
export function linhasHorario(): { dias: string; texto: string }[] {
  const ordem = [1, 2, 3, 4, 5, 6, 0];
  const grupos: { dias: number[]; chave: string; texto: string }[] = [];
  for (const d of ordem) {
    const h = CONFIG.horarios[d];
    if (h === null || h === undefined) {
      grupos.push({ dias: [], chave: '__gap__', texto: '' });
      continue;
    }
    const chave = h === 'fechado' ? 'fechado' : `${h.abre}-${h.fecha}`;
    const texto = h === 'fechado' ? 'fechado' : `${hh(h.abre)} às ${hh(h.fecha)}`;
    const ult = grupos[grupos.length - 1];
    if (ult && ult.chave === chave) ult.dias.push(d);
    else grupos.push({ dias: [d], chave, texto });
  }
  return grupos
    .filter((g) => g.dias.length)
    .map((g) => {
      const a = NOMES[g.dias[0]];
      const b = NOMES[g.dias[g.dias.length - 1]];
      const dias = g.dias.length === 1 ? a : g.dias.length === 2 ? `${a} e ${b}` : `${a} a ${b}`;
      return { dias: dias.charAt(0).toUpperCase() + dias.slice(1), texto: g.texto };
    });
}

/** Resumo curto: "Terça a sexta, 9h às 18h". */
export function resumoHorario(): string {
  const l = linhasHorario().find((x) => x.texto !== 'fechado');
  return l ? `${l.dias}, ${l.texto}` : '';
}

/** Dia aceita agendamento? Só dias com turno conhecido. */
export function diaDisponivel(d: Date): boolean {
  return turno(d.getDay()) !== null;
}

/** Blocos de 1h do dia, sem o almoço e sem o horário de fechamento. */
export function blocosHorario(d: Date, agora: Date = new Date()): string[] {
  const t = turno(d.getDay());
  if (!t) return [];
  const ini = toMin(t.abre);
  const fim = toMin(t.fecha);
  const alm = CONFIG.almoco ? [toMin(CONFIG.almoco.abre), toMin(CONFIG.almoco.fecha)] : null;
  const mesmoDia = d.toDateString() === agora.toDateString();
  const agoraMin = agora.getHours() * 60 + agora.getMinutes();
  const out: string[] = [];
  for (let m = ini; m + 60 <= fim; m += 60) {
    if (alm && m < alm[1] && m + 60 > alm[0]) continue;
    if (mesmoDia && m <= agoraMin) continue;
    out.push(`${pad(Math.floor(m / 60))}:${pad(m % 60)}`);
  }
  return out;
}

export const isoDate = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const brDate = (iso: string) => iso.split('-').reverse().join('/');
export const parseIso = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
};

/** Dias da semana com turno, para o JSON-LD. */
export function diasAbertosSchema() {
  const map = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return [0, 1, 2, 3, 4, 5, 6]
    .map((d) => ({ d, t: turno(d) }))
    .filter((x) => x.t)
    .map((x) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: `https://schema.org/${map[x.d]}`,
      opens: x.t!.abre,
      closes: x.t!.fecha,
    }));
}
