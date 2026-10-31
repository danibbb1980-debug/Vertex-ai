import { CONFIG } from "../config";

/** Símbolo original (sem redesenho) + nome composto em tipografia. */
export function Brand({ dark = false, size = 40 }: { dark?: boolean; size?: number }) {
  return (
    <span className="flex items-center gap-3">
      <span
        className="grid shrink-0 place-items-center overflow-hidden rounded-xl bg-white ring-1 ring-night/5"
        style={{ width: size, height: size }}
      >
        <img src={CONFIG.logo} alt="" width={size} height={size} className="h-full w-full object-contain" decoding="async" />
      </span>
      <span className="flex flex-col leading-none">
        <span className={`font-display text-[0.62rem] font-semibold uppercase tracking-[0.22em] ${dark ? "text-[#9CC9E8]" : "text-brand-ink"}`}>
          Med Center
        </span>
        <span className={`font-display text-[1.08rem] font-semibold tracking-tight ${dark ? "text-white" : "text-night"}`}>Vital Brazil</span>
      </span>
    </span>
  );
}
