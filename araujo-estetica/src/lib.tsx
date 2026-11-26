import type { ReactNode } from "react";
import { CONFIG, type Horario } from "./config";

/** Título revelado por linha (mecanismo A). Cada item de `lines` é uma linha. */
export function Lines({ lines }: { lines: ReactNode[] }) {
  return (
    <>
      {lines.map((l, i) => (
        <span className="ln" key={i}>
          <span>{l}</span>
        </span>
      ))}
    </>
  );
}

/** Rótulo de seção: número + fio diagonal (mecanismo B) + nome. */
export function SecLabel({ n, children }: { n: string; children: ReactNode }) {
  return (
    <p className="sec-label">
      <span className="sec-num">{n}</span>
      <span className="sec-tick" aria-hidden="true" />
      <span>{children}</span>
    </p>
  );
}

/** Link externo: nova aba, noopener. */
export function Ext({
  href,
  className,
  children,
  label,
}: {
  href: string;
  className?: string;
  children: ReactNode;
  label?: string;
}) {
  return (
    <a href={href} className={className} target="_blank" rel="noopener noreferrer" aria-label={label}>
      {children}
    </a>
  );
}

/** "07:30" → "7h30"; "08:00" → "8h" */
export function hora(h: string) {
  const [hh, mm] = h.split(":");
  return `${Number(hh)}h${mm === "00" ? "" : mm}`;
}

export type GrupoHorario = { rotulo: string; dias: number[]; abre?: string; fecha?: string };

/** Agrupa dias consecutivos com o mesmo horário ("Segunda a sexta"). */
export function agruparHorarios(hs: Horario[] = CONFIG.horarios): GrupoHorario[] {
  const out: GrupoHorario[] = [];
  for (const h of hs) {
    const last = out[out.length - 1];
    if (last && last.abre === h.abre && last.fecha === h.fecha && h.abre) {
      last.dias.push(h.dia);
      last.rotulo = `${last.rotulo.split(" a ")[0]} a ${h.rotulo.toLowerCase()}`;
    } else {
      out.push({ rotulo: h.rotulo, dias: [h.dia], abre: h.abre, fecha: h.fecha });
    }
  }
  return out;
}

/** Dia da semana e data (AAAA-MM-DD) de hoje no fuso da empresa. */
export function hojeNoFuso() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: CONFIG.fusoHorario,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
  }).formatToParts(new Date());
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const wd = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
  return { iso: `${get("year")}-${get("month")}-${get("day")}`, dia: wd };
}

/** Dia da semana de uma data "AAAA-MM-DD" (independente do fuso do navegador). */
export function diaDaSemana(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

/** Blocos de 1 hora a partir da abertura, sem o último (sobra 1 h antes de fechar). */
export function horariosDoDia(dia: number): string[] {
  const h = CONFIG.horarios.find((x) => x.dia === dia);
  if (!h?.abre || !h.fecha) return [];
  const toMin = (s: string) => {
    const [a, b] = s.split(":").map(Number);
    return a * 60 + b;
  };
  const out: string[] = [];
  for (let t = toMin(h.abre); t + 60 <= toMin(h.fecha); t += 60) {
    out.push(`${String(Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`);
  }
  return out;
}
