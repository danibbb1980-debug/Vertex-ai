/**
 * Minimal analytics shim.
 *
 * A conversion page you can't measure can't be optimised, so every CTA on the
 * site reports where it was clicked. This pushes to `dataLayer` (GTM) and calls
 * `gtag` when present, and is a silent no-op when neither is installed — so
 * nothing breaks before you wire up a provider.
 */

type EventPayload = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: EventPayload[];
    gtag?: (command: string, eventName: string, params?: EventPayload) => void;
  }
}

export function track(event: string, payload: EventPayload = {}): void {
  if (typeof window === "undefined") return;

  try {
    window.dataLayer?.push({ event, ...payload });
    window.gtag?.("event", event, payload);
  } catch {
    // Analytics must never break the page.
  }
}

/** Fired by every primary/secondary CTA, tagged with the section it lives in. */
export function trackCta(location: string, label: string): void {
  track("cta_click", { cta_location: location, cta_label: label });
}
