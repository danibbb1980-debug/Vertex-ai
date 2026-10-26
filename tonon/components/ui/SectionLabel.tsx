type Props = { index: string; children: React.ReactNode; tone?: "light" | "dark"; className?: string };

/** Rótulo editorial de seção: "01 — O laboratório". */
export function SectionLabel({ index, children, tone = "light", className = "" }: Props) {
  const color = tone === "dark" ? "text-champagne" : "text-sage";
  return (
    <p className={`label ${color} ${className}`}>
      <span className="tabular-nums">{index}</span>
      <span aria-hidden="true">·</span>
      <span>{children}</span>
    </p>
  );
}
