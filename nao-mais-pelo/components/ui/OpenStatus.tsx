"use client";

import { useEffect, useState } from "react";
import { unit } from "@/lib/site";

type Status = { open: boolean; label: string };

/** Hora atual em São Paulo, independente do fuso do visitante. */
function nowInSaoPaulo() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Sao_Paulo",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
  return { day, minutes: Number(get("hour")) * 60 + Number(get("minute")) };
}

const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

function computeStatus(): Status {
  const { day, minutes } = nowInSaoPaulo();
  const today = unit.hours.find((h) => h.day === day);
  if (today?.open && today.close && minutes >= toMinutes(today.open) && minutes < toMinutes(today.close)) {
    return { open: true, label: `Aberto agora · até ${today.close}` };
  }
  // Próxima abertura: hoje mais tarde ou nos próximos dias.
  for (let i = 0; i < 7; i++) {
    const d = (day + i) % 7;
    const h = unit.hours.find((x) => x.day === d);
    if (!h?.open) continue;
    if (i === 0 && minutes >= toMinutes(h.open)) continue;
    const when = i === 0 ? "hoje" : i === 1 ? "amanhã" : h.label.toLowerCase();
    return { open: false, label: `Fechado · abre ${when} às ${h.open}` };
  }
  return { open: false, label: "Fechado" };
}

/** Selo "Aberto agora / Fechado", calculado no navegador e atualizado a cada minuto. */
export function OpenStatus() {
  const [status, setStatus] = useState<Status | null>(null);

  useEffect(() => {
    const update = () => setStatus(computeStatus());
    const first = window.setTimeout(update, 0);
    const timer = window.setInterval(update, 60_000);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(timer);
    };
  }, []);

  if (!status) return null;
  return (
    <p className="flex items-center gap-2 text-sm" aria-live="polite">
      <span className={`h-2 w-2 rounded-full ${status.open ? "bg-green" : "bg-mist"}`} aria-hidden="true" />
      <span className={status.open ? "text-green" : "text-mist"}>{status.label}</span>
    </p>
  );
}
