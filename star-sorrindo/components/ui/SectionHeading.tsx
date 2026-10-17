import type { ReactNode } from "react";

type Props = {
  eyebrow: string;
  title: ReactNode;
  id?: string;
  intro?: ReactNode;
  align?: "left" | "center";
  as?: "h1" | "h2";
  className?: string;
};

export function SectionHeading({ eyebrow, title, id, intro, align = "left", as: Tag = "h2", className = "" }: Props) {
  const center = align === "center";
  return (
    <div className={`${center ? "mx-auto text-center" : ""} max-w-3xl ${className}`}>
      <p className={`eyebrow ${center ? "justify-center" : ""}`}>{eyebrow}</p>
      <Tag id={id} className="serif mt-5 text-[2.5rem] sm:text-5xl lg:text-[3.6rem]">
        {title}
      </Tag>
      {intro && <div className={`mt-6 text-lg text-mineral ${center ? "mx-auto max-w-2xl" : "max-w-2xl"}`}>{intro}</div>}
    </div>
  );
}
