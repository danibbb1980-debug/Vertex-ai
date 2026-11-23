"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Botão que abre um vídeo do YouTube num <dialog> nativo.
 * O iframe só é criado ao abrir (nada do YouTube carrega antes do clique)
 * e usa o domínio youtube-nocookie.
 */
export function VideoDialog({
  videoId,
  title,
  className = "",
  children,
}: {
  videoId: string;
  title: string;
  className?: string;
  children: ReactNode;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  return (
    <>
      <button type="button" className={className} onClick={() => setOpen(true)} aria-haspopup="dialog">
        {children}
      </button>
      <dialog
        ref={dialog}
        onClose={() => setOpen(false)}
        onClick={(e) => {
          if (e.target === e.currentTarget) setOpen(false);
        }}
        aria-label={title}
        className="m-auto w-[min(92vw,1100px)] max-w-none bg-transparent p-0 text-bone backdrop:bg-ink/90 backdrop:backdrop-blur-sm"
      >
        <div className="mb-3 flex items-center justify-between gap-4">
          <p className="eyebrow text-mist">{title}</p>
          <button type="button" onClick={() => setOpen(false)} className="eyebrow link-line py-2 text-bone">
            Fechar
          </button>
        </div>
        <div className="relative aspect-video w-full bg-ink">
          {open ? (
            <iframe
              className="absolute inset-0 h-full w-full"
              src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
              title={title}
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
            />
          ) : null}
        </div>
      </dialog>
    </>
  );
}

export function PlayIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 12 14" className={className} aria-hidden="true" fill="currentColor">
      <path d="M0 0l12 7-12 7z" />
    </svg>
  );
}
