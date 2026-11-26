import { CONFIG } from './config';

export const MSG_GERAL =
  'Olá! Vi o site da The Details Estética Automotiva e gostaria de pedir um horário.';

export const msgServico = (nome: string) =>
  `Olá! Vi o site da The Details Estética Automotiva e gostaria de pedir um horário para ${nome.toLowerCase()}.`;

export const waUrl = (texto: string = MSG_GERAL) =>
  `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(texto)}`;

/** Horários de início em blocos de 1 h, sem o último (sobra ao menos 1 h antes de fechar). */
export function horariosDoDia(diaSemana: number): string[] {
  const d = CONFIG.horarios.find((h) => h.idx === diaSemana);
  if (!d?.abre || !d.fecha) return [];
  const ini = parseInt(d.abre, 10);
  const fim = parseInt(d.fecha, 10);
  const out: string[] = [];
  for (let h = ini; h <= fim - 1; h++) out.push(`${String(h).padStart(2, '0')}:00`);
  return out;
}

/** Dia da semana (0 = domingo) no fuso de Poços de Caldas. */
export function hojeNoFuso(): number {
  const nome = new Intl.DateTimeFormat('en-US', { weekday: 'short', timeZone: CONFIG.fuso }).format(new Date());
  return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(nome);
}

export function dataHojeISO(): string {
  // en-CA formata como AAAA-MM-DD
  return new Intl.DateTimeFormat('en-CA', { timeZone: CONFIG.fuso }).format(new Date());
}

export const horaCurta = (hhmm?: string) => (hhmm ? `${parseInt(hhmm, 10)}h` : '');

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
