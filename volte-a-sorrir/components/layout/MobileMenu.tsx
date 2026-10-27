"use client";

import { Menu, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { defaultMessage, navLinks, site, whatsappUrl } from "@/lib/site";
import { WhatsAppIcon } from "../ui/BrandIcons";

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const button = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        button.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    panel.current?.querySelector<HTMLElement>("a")?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        ref={button}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? "Fechar menu" : "Abrir menu"}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex size-11 cursor-pointer items-center justify-center rounded-full text-navy transition-colors hover:bg-navy/[0.07]"
      >
        {open ? <X className="size-6" strokeWidth={1.8} /> : <Menu className="size-6" strokeWidth={1.8} />}
      </button>

      <div
        id={panelId}
        ref={panel}
        hidden={!open}
        className="fixed inset-x-0 bottom-0 top-[4.25rem] z-40 overflow-y-auto border-t border-sun-line/70 bg-sun px-5 pb-10 pt-6 sm:px-8"
      >
        <nav aria-label="Menu">
          <ul className="divide-y divide-navy/10 border-y border-navy/10">
            {navLinks.map((link, i) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="flex items-baseline justify-between py-4 font-display text-[1.75rem] leading-tight text-navy"
                >
                  {link.label}
                  <span className="font-sans text-xs font-semibold tabular-nums text-navy/70">0{i + 1}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <a
          href={whatsappUrl(defaultMessage)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 flex min-h-14 items-center justify-center gap-2.5 rounded-full bg-navy text-base font-semibold text-white"
        >
          <WhatsAppIcon />
          Agende pelo WhatsApp
        </a>
        <p className="mt-6 text-center text-sm font-medium text-navy/70">
          {site.city} — {site.state} · {site.phoneDisplay}
        </p>
      </div>
    </div>
  );
}
