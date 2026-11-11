import { CONFIG, type Horario } from "./config";

export const MSG_GERAL = `Olá, ${CONFIG.nomeCurto}! Vi seu site e gostaria de agendar uma consulta.`;

export function waLink(mensagem: string = MSG_GERAL): string {
  return `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(mensagem)}`;
}

export function waSobre(assunto: string): string {
  return waLink(`Olá, ${CONFIG.nomeCurto}! Vi seu site e gostaria de informações sobre ${assunto}.`);
}

/** "Dr. Melqui Massa · CRM-MG 00000" quando houver CRM; senão só o nome. */
export function crmTexto(): string {
  return CONFIG.crm ? `CRM-${CONFIG.crmUF} ${CONFIG.crm}` : "";
}

export function especialidadesVisiveis() {
  return CONFIG.mostrarEspecialidade ? CONFIG.especialidades.filter((e) => e.nome && e.rqe) : [];
}

const toMin = (h: string) => {
  const [a, b] = h.split(":").map(Number);
  return a * 60 + b;
};
const toHora = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;

export function horarioDoDia(dia: number): Horario | undefined {
  return CONFIG.horarios.find((h) => h.dia === dia);
}

/** Blocos de 1 hora que terminam até o fechamento, sem a pausa (se houver). */
export function blocosDoDia(dia: number): string[] {
  const h = horarioDoDia(dia);
  if (!h) return [];
  const out: string[] = [];
  const fim = toMin(h.fecha);
  for (let t = toMin(h.abre); t + 60 <= fim; t += 60) {
    if (h.pausa) {
      const pi = toMin(h.pausa.inicio);
      const pf = toMin(h.pausa.fim);
      if (t < pf && t + 60 > pi) continue;
    }
    out.push(toHora(t));
  }
  return out;
}

export function formatHora(h: string) {
  return h.replace(":", "h");
}

/** Data local (sem fuso) a partir de "aaaa-mm-dd". */
export function parseISODate(v: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v);
  if (!m) return null;
  return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
}

export function hojeISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function formatDataBR(v: string): string {
  const d = parseISODate(v);
  if (!d) return v;
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}

function pascoa(ano: number): Date {
  const a = ano % 19, b = Math.floor(ano / 100), c = ano % 100;
  const d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const mes = Math.floor((h + l - 7 * m + 114) / 31);
  const dia = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(ano, mes - 1, dia);
}

/** Feriados nacionais comuns (fixos e móveis). Usado só para exibir o aviso. */
export function ehFeriado(d: Date): boolean {
  const md = `${d.getMonth() + 1}-${d.getDate()}`;
  const fixos = ["1-1", "4-21", "5-1", "9-7", "10-12", "11-2", "11-15", "11-20", "12-25"];
  if (fixos.includes(md)) return true;
  const p = pascoa(d.getFullYear()).getTime();
  const dia = 86400000;
  const moveis = [-48, -47, -2, 60].map((n) => new Date(p + n * dia));
  return moveis.some((x) => x.getMonth() === d.getMonth() && x.getDate() === d.getDate());
}

export function enderecoLinha(): string {
  const e = CONFIG.endereco;
  return `${e.logradouro}, ${e.complemento}, ${e.bairro}, ${e.cidade} - ${e.uf}`;
}
