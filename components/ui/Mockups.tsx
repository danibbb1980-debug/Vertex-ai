import type { ReactNode } from "react";

/**
 * Pure-CSS device chrome. Deliberately not images: it stays razor sharp at any
 * DPI, costs no network request, and shifts no layout — the hero's LCP element
 * paints with the document.
 */

export function BrowserFrame({
  url,
  children,
  className = "",
}: {
  url: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`overflow-hidden rounded-xl border border-line bg-ink-2 shadow-[0_40px_120px_-30px_rgba(0,0,0,0.95)] ${className}`}
    >
      {/* Chrome */}
      <div className="flex items-center gap-3 border-b border-line-soft bg-surface px-4 py-3">
        <div className="flex gap-1.5" aria-hidden="true">
          <span className="size-2.5 rounded-full bg-white/15" />
          <span className="size-2.5 rounded-full bg-white/15" />
          <span className="size-2.5 rounded-full bg-white/15" />
        </div>
        <div className="ml-1 flex min-w-0 flex-1 items-center gap-2 rounded-md bg-ink/70 px-3 py-1.5">
          <svg
            viewBox="0 0 24 24"
            className="size-3 shrink-0 text-mint"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            aria-hidden="true"
          >
            <rect x="4" y="10" width="16" height="10" rx="2" />
            <path d="M8 10V7a4 4 0 1 1 8 0v3" />
          </svg>
          <span className="truncate font-mono text-[0.68rem] text-mist-dim">{url}</span>
        </div>
      </div>
      <div className="relative">{children}</div>
    </div>
  );
}

export function PhoneFrame({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`overflow-hidden rounded-[2rem] border-[6px] border-surface-2 bg-ink-2 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.95)] ring-1 ring-line ${className}`}
    >
      <div className="relative">
        {/* Notch */}
        <div
          className="absolute top-2 left-1/2 z-10 h-4 w-16 -translate-x-1/2 rounded-full bg-ink"
          aria-hidden="true"
        />
        {children}
      </div>
    </div>
  );
}

/**
 * Abstract page skeleton shown inside the frames. Grey blocks rather than fake
 * screenshots — it reads as "a website" without implying a client that doesn't
 * exist.
 */
export function SiteSkeleton({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={`grid-noise bg-linear-to-b from-surface to-ink-2 ${compact ? "p-4 pt-7" : "p-6"}`}
      aria-hidden="true"
    >
      {/* Nav row */}
      <div className="mb-5 flex items-center justify-between">
        <div className="h-2.5 w-16 rounded-full bg-linear-to-r from-brand to-brand-bright" />
        {!compact && (
          <div className="flex gap-2">
            <div className="h-2 w-10 rounded-full bg-white/10" />
            <div className="h-2 w-10 rounded-full bg-white/10" />
            <div className="h-2 w-10 rounded-full bg-white/10" />
          </div>
        )}
        <div className="h-5 w-14 rounded-full bg-brand/30" />
      </div>

      {/* Hero block */}
      <div className={compact ? "space-y-2" : "space-y-2.5"}>
        <div className="h-3 w-4/5 rounded-full bg-white/25" />
        <div className="h-3 w-3/5 rounded-full bg-white/15" />
        <div className="h-2 w-full rounded-full bg-white/[0.07]" />
        <div className="h-2 w-2/3 rounded-full bg-white/[0.07]" />
      </div>

      <div className="mt-4 flex gap-2">
        <div className="h-6 w-20 rounded-full bg-linear-to-r from-brand-deep to-brand" />
        <div className="h-6 w-16 rounded-full border border-line bg-white/[0.04]" />
      </div>

      {/* Card grid */}
      <div className={`mt-5 grid gap-2.5 ${compact ? "grid-cols-2" : "grid-cols-3"}`}>
        {Array.from({ length: compact ? 2 : 3 }).map((_, index) => (
          <div
            key={index}
            className="space-y-2 rounded-lg border border-line-soft bg-white/[0.03] p-3"
          >
            <div className="size-5 rounded-md bg-brand/25" />
            <div className="h-1.5 w-full rounded-full bg-white/15" />
            <div className="h-1.5 w-2/3 rounded-full bg-white/[0.08]" />
          </div>
        ))}
      </div>
    </div>
  );
}
