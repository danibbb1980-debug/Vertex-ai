import { whatsappUrl } from "@/lib/site-data";
import { WhatsAppIcon } from "./BrandIcons";

/**
 * Atalho flutuante para o WhatsApp. É um link comum: sem JS fica sempre
 * visível; com JS, some enquanto o hero (que já tem o CTA principal) está na
 * tela — o ClientEnhancements controla data-visible. Respeita a área segura do iPhone.
 */
export function FloatingWhatsApp() {
  return (
    <a
      href={whatsappUrl("default")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Conversar com o Laboratório Tonon no WhatsApp (abre em nova aba)"
      className="floating-cta group fixed right-4 z-40 flex h-14 items-center rounded-full bg-graphite pr-4 pl-4 text-paper shadow-[0_18px_40px_-14px_rgb(23_25_24/0.75)] ring-1 ring-paper/10 sm:right-6"
      style={{ bottom: "max(1rem, env(safe-area-inset-bottom))" }}
    >
      <WhatsAppIcon className="h-6 w-6 text-whatsapp" />
      <span className="max-w-0 overflow-hidden text-sm font-semibold whitespace-nowrap opacity-0 transition-all duration-300 ease-out-soft group-hover:ml-2.5 group-hover:max-w-40 group-hover:opacity-100 group-focus-visible:ml-2.5 group-focus-visible:max-w-40 group-focus-visible:opacity-100">
        Agendar
      </span>
    </a>
  );
}
