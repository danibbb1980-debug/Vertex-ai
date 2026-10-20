import { whatsappUrl } from "@/lib/site-data";
import { WhatsAppIcon } from "./BrandIcons";

/** Botão flutuante discreto: link comum, sem JS, respeitando a área segura do iPhone. */
export function FloatingWhatsApp() {
  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Agendar pelo WhatsApp (abre em nova aba)"
      className="fixed right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp text-[#0b3d1e] shadow-[0_12px_30px_-10px_rgb(46_42_48/0.55)] ring-4 ring-cream transition-transform duration-300 ease-out-soft hover:-translate-y-0.5 sm:right-6"
      style={{ bottom: "max(1rem, env(safe-area-inset-bottom))" }}
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  );
}
