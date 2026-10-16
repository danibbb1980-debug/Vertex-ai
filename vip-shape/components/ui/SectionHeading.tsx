import type { ReactNode } from "react";

type SectionHeadingProps = {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  id?: string;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  id,
  align = "left",
  className = "",
}: SectionHeadingProps) {
  const centered = align === "center";
  return (
    <div className={`${centered ? "mx-auto text-center" : ""} max-w-3xl ${className}`}>
      <p className={`eyebrow ${centered ? "justify-center" : ""}`}>{eyebrow}</p>
      <h2 id={id} className="display mt-5 text-[2.5rem] sm:text-5xl lg:text-[4.25rem]">
        {title}
      </h2>
      {description && (
        <p className={`mt-6 max-w-xl text-base text-mist sm:text-lg ${centered ? "mx-auto" : ""}`}>
          {description}
        </p>
      )}
    </div>
  );
}
