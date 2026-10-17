"use client";

import { useEffect, useState } from "react";
import { formatTime, openingHours } from "@/lib/site-data";

type Status = { open: boolean; label: string; weekday: number };

/** Dia da semana e minutos no fuso de Poços de Caldas, independente do fuso do visitante. */
function nowInBrazil(): { weekday: number; minutes: number } {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Sao_Paulo",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  const weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
  return { weekday, minutes: Number(get("hour")) * 60 + Number(get("minute")) };
}

const toMinutes = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

function computeStatus(): Status {
  const { weekday, minutes } = nowInBrazil();
  const today = openingHours.find((d) => d.weekday === weekday);

  if (today?.opens && today.closes) {
    const opens = toMinutes(today.opens);
    const closes = toMinutes(today.closes);
    if (minutes >= opens && minutes < closes) {
      return { open: true, label: `Aberto agora · fecha às ${formatTime(today.closes)}`, weekday };
    }
    if (minutes < opens) {
      return { open: false, label: `Fechado agora · abre hoje às ${formatTime(today.opens)}`, weekday };
    }
  }

  // Próximo dia com expediente.
  for (let i = 1; i <= 7; i++) {
    const next = openingHours.find((d) => d.weekday === (weekday + i) % 7);
    if (next?.opens) {
      const when = i === 1 ? "amanhã" : next.label.toLowerCase();
      return { open: false, label: `Fechado agora · abre ${when} às ${formatTime(next.opens)}`, weekday };
    }
  }
  return { open: false, label: "Fechado agora", weekday };
}

/**
 * Status "aberto/fechado" calculado a partir dos horários oficiais.
 * Só renderiza depois de montar no navegador: no servidor a hora seria a do
 * build, e o HTML estático ficaria errado.
 */
export function OpenStatus({ tone = "light" }: { tone?: "light" | "dark" }) {
  const strong = tone === "light" ? "text-navy" : "text-ivory";
  const soft = tone === "light" ? "text-mineral" : "text-mist";
  const [status, setStatus] = useState<Status | null>(null);

  useEffect(() => {
    const update = () => setStatus(computeStatus());
    update();
    const timer = window.setInterval(update, 60_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!status) return;
    const row = document.querySelector<HTMLElement>(`[data-weekday="${status.weekday}"]`);
    row?.setAttribute("data-today", "true");
    return () => row?.removeAttribute("data-today");
  }, [status]);

  return (
    <p className="flex min-h-6 items-center gap-2.5 text-sm font-medium" aria-live="polite">
      {status && (
        <>
          <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
            {status.open && (
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-whatsapp opacity-60 motion-reduce:animate-none" />
            )}
            <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${status.open ? "bg-whatsapp" : tone === "light" ? "bg-mineral" : "bg-mist"}`} />
          </span>
          <span className={status.open ? strong : soft}>{status.label}</span>
        </>
      )}
    </p>
  );
}
