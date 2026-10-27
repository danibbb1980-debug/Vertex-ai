import { defaultMessage, site, whatsappUrl } from "@/lib/site";
import { WhatsAppIcon } from "../ui/BrandIcons";
import { ButtonLink } from "../ui/Button";
import { Reveal } from "../ui/Reveal";

export function FinalCta() {
  return (
    <section aria-labelledby="cta-final-title" className="on-dark relative overflow-hidden bg-navy py-24 text-white sm:py-28">
      <svg aria-hidden viewBox="0 0 600 300" className="pointer-events-none absolute -bottom-24 -right-24 w-[38rem]" fill="none">
        <path d="M30 220C110 80 300 40 420 100c60 30 96 60 150 46" stroke="#ffffff" strokeOpacity="0.07" strokeWidth="14" strokeLinecap="round" />
      </svg>
      <Reveal className="relative mx-auto max-w-[1240px] px-5 text-center sm:px-8">
        <h2 id="cta-final-title" className="font-display mx-auto max-w-3xl text-[clamp(2.3rem,5.4vw,4.1rem)] font-[400] leading-[1.04]">
          Volte a sorrir <span className="italic text-sun">com tranquilidade.</span>
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-white/75">
          Mande uma mensagem e agende sua avaliação na Dentista Volte a Sorrir, em {site.city}.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <ButtonLink href={whatsappUrl(defaultMessage)} external variant="sun" icon={<WhatsAppIcon className="size-5" />}>
            Agende pelo WhatsApp
          </ButtonLink>
          <ButtonLink href={`tel:${site.phoneE164}`} variant="ghost-light">
            {site.phoneDisplay}
          </ButtonLink>
        </div>
      </Reveal>
    </section>
  );
}
