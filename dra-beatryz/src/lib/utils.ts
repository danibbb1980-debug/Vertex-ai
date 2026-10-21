import { CONFIG } from "../config";

/** Junta classes ignorando valores vazios. */
export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

/** Link do WhatsApp com mensagem pronta. Com cidade, a mensagem cita a unidade. */
export function linkWhatsapp(cidade?: string) {
  const base = CONFIG.mensagemWhatsapp;
  const msg = cidade ? `${base.replace(/\.$/, "")} em ${cidade}.` : base;
  return `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`;
}

/** Atributos padrão para links externos. */
export const externo = { target: "_blank", rel: "noopener noreferrer" } as const;

export function srcSet(base: string) {
  return `${base}-480.webp 480w, ${base}-800.webp 800w, ${base}-1100.webp 1100w`;
}
