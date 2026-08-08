import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

export function Section({
  id,
  children,
  className = "",
}: {
  id?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    /*
     * overflow-x-clip (not hidden) contains decorative glows and overhanging
     * mockups without creating a scroll container — so position: sticky and
     * scroll-margin keep working inside sections.
     */
    <section
      id={id}
      className={`relative overflow-x-clip px-5 py-24 sm:px-8 md:py-32 ${className}`}
    >
      <div className="mx-auto w-full max-w-6xl">{children}</div>
    </section>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  sub,
  align = "center",
  accent,
}: {
  eyebrow?: string;
  title: string;
  sub?: string;
  align?: "center" | "left";
  /** Substring of `title` to render in the brand gradient. */
  accent?: string;
}) {
  const alignment =
    align === "center" ? "text-center mx-auto items-center" : "text-left items-start";

  const renderTitle = () => {
    if (!accent || !title.includes(accent)) return title;
    const [before, after] = title.split(accent);
    return (
      <>
        {before}
        <span className="text-gradient">{accent}</span>
        {after}
      </>
    );
  };

  return (
    <div className={`flex max-w-3xl flex-col ${alignment}`}>
      {eyebrow && (
        <Reveal>
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-line bg-white/[0.03] px-4 py-1.5 text-xs font-medium tracking-[0.14em] text-mist uppercase">
            <span className="size-1.5 rounded-full bg-brand-bright" aria-hidden="true" />
            {eyebrow}
          </span>
        </Reveal>
      )}
      <Reveal delay={0.05}>
        <h2 className="text-3xl font-semibold sm:text-4xl md:text-[2.9rem]">
          {renderTitle()}
        </h2>
      </Reveal>
      {sub && (
        <Reveal delay={0.1}>
          <p className="mt-5 text-base leading-relaxed text-mist sm:text-lg">{sub}</p>
        </Reveal>
      )}
    </div>
  );
}
