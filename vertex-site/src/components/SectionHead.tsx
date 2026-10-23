import type { ReactNode } from "react";

export function SectionHead({
  num,
  label,
  title,
  intro,
  id,
  align = "left",
}: {
  num: string;
  label: string;
  title: ReactNode;
  intro?: ReactNode;
  id: string;
  align?: "left" | "center";
}) {
  const center = align === "center";
  return (
    <div className={center ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      <p data-reveal className={`flex items-center gap-4 ${center ? "justify-center" : ""}`}>
        <span className="num">{num}</span>
        <span className="h-px w-10 bg-gold/50" aria-hidden="true" />
        <span className="eyebrow">{label}</span>
      </p>
      <h2 id={id} data-reveal style={{ ["--d" as string]: "80ms" }} className="mt-6 text-[clamp(2.1rem,6vw,3.75rem)]">
        {title}
      </h2>
      {intro && (
        <p data-reveal style={{ ["--d" as string]: "160ms" }} className={`mt-6 text-[1.08rem] leading-relaxed text-mist ${center ? "mx-auto max-w-2xl" : "max-w-2xl"} [.on-light_&]:text-cocoa-2`}>
          {intro}
        </p>
      )}
    </div>
  );
}

export const Em = ({ children }: { children: ReactNode }) => <em className="serif-accent text-[1.08em]">{children}</em>;
