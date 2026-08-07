"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { LinkButton } from "./Button";
import { whatsappUrl, brl, site } from "@/lib/site";

/**
 * Mobile-only sticky conversion bar.
 *
 * On phones the CTA scrolls out of view within a screen or two and never comes
 * back until the footer. This keeps price + action permanently one tap away for
 * the majority of the traffic. It appears after the hero (so it doesn't cover
 * the first impression) and hides over the final CTA, where it would compete
 * with the form.
 */
export function StickyCta() {
  const [visible, setVisible] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const onScroll = () => {
      const past = window.scrollY > window.innerHeight * 0.9;
      const finalCta = document.getElementById("contato");
      const atEnd = finalCta
        ? finalCta.getBoundingClientRect().top < window.innerHeight
        : false;
      setVisible(past && !atEnd);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={reduceMotion ? false : { y: 90 }}
          animate={{ y: 0 }}
          exit={reduceMotion ? undefined : { y: 90 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-ink/92 px-4 pt-3 backdrop-blur-xl lg:hidden"
          style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
        >
          <div className="flex items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="font-display text-base font-semibold leading-tight">
                {brl(site.price)}
                <span className="text-sm font-normal text-mist">/mês</span>
              </p>
              <p className="truncate text-[0.7rem] text-mist-dim">
                Sem fidelidade · Sem taxa de setup
              </p>
            </div>
            <LinkButton
              href={whatsappUrl("barra-fixa")}
              target="_blank"
              rel="noopener noreferrer"
              variant="whatsapp"
              className="shrink-0 px-4"
              aria-label="Falar no WhatsApp"
              trackAs="sticky-whatsapp"
            >
              <MessageCircle className="size-4" aria-hidden="true" />
            </LinkButton>
            <LinkButton href="#contato" className="shrink-0" trackAs="sticky-bar">
              Quero meu site
            </LinkButton>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
