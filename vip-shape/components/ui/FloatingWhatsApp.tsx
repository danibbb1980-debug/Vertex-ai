import { whatsappUrl } from "@/lib/site-data";
import { WhatsAppIcon } from "./BrandIcons";

/**
 * Botão flutuante discreto. É um link comum (sem JS) e respeita a área segura
 * do iPhone. O rótulo aparece ao passar o mouse no desktop.
 */
export function FloatingWhatsApp() {
  return (
    <a
      href={whatsappUrl("default")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Conversar com a VIP Shape no WhatsApp (abre em nova aba)"
      className="group fixed right-4 z-40 flex h-14 items-center gap-0 rounded-full bg-whatsapp pr-4 pl-4 text-white shadow-[0_12px_32px_-8px_rgb(0_0_0/0.7)] ring-1 ring-black/20 transition-[gap,transform] duration-300 ease-out-soft hover:-translate-y-0.5 sm:right-6"
      style={{ bottom: "max(1rem, env(safe-area-inset-bottom))" }}
    >
      <WhatsAppIcon className="h-6 w-6" />
      <span className="max-w-0 overflow-hidden text-sm font-semibold whitespace-nowrap text-[#0b2e16] opacity-0 transition-all duration-300 ease-out-soft group-hover:ml-2 group-hover:max-w-40 group-hover:opacity-100 group-focus-visible:ml-2 group-focus-visible:max-w-40 group-focus-visible:opacity-100">
        Fale conosco
      </span>
    </a>
  );
}
