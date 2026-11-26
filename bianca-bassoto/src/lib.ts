import { CONFIG, type Dia } from './config';

export const hora = (h?: string) => (h ? `${Number(h.slice(0, 2))}h${h.slice(3) === '00' ? '' : h.slice(3)}` : '');

/** Dia da semana e data (aaaa-mm-dd) de hoje no fuso da clínica. */
export function hojeNoFuso() {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: CONFIG.fusoHorario,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short',
  }).formatToParts(new Date());
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '';
  const wd = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'));
  return { iso: `${get('year')}-${get('month')}-${get('day')}`, dia: wd };
}

/** Dia da semana de uma data aaaa-mm-dd (independe de fuso). */
export const diaDaSemana = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
};

/** Blocos de 1 hora, excluindo o horário de fechamento (cabe 1 hora antes de fechar). */
export function horariosDoDia(d?: Dia): string[] {
  if (!d?.abre || !d?.fecha) return [];
  const a = Number(d.abre.slice(0, 2));
  const f = Number(d.fecha.slice(0, 2));
  const out: string[] = [];
  for (let h = a; h + 1 <= f; h++) out.push(`${String(h).padStart(2, '0')}:00`);
  return out;
}

/** Agrupa dias com o mesmo horário: "Segunda a sexta". */
export function horariosAgrupados() {
  const ordem = [1, 2, 3, 4, 5, 6, 0];
  const dias = ordem.map((n) => CONFIG.horarios.find((h) => h.dia === n)).filter(Boolean) as Dia[];
  const grupos: { dias: Dia[]; abre?: string; fecha?: string }[] = [];
  for (const d of dias) {
    const g = grupos[grupos.length - 1];
    if (g && g.abre === d.abre && g.fecha === d.fecha) g.dias.push(d);
    else grupos.push({ dias: [d], abre: d.abre, fecha: d.fecha });
  }
  return grupos.map((g) => ({
    ...g,
    nome:
      g.dias.length > 1
        ? `${g.dias[0].nome.replace('-feira', '')} a ${g.dias[g.dias.length - 1].nome.replace('-feira', '').toLowerCase()}`
        : g.dias[0].nome.replace('-feira', ''),
    texto: g.abre ? `${hora(g.abre)} às ${hora(g.fecha)}` : 'Fechado',
  }));
}
