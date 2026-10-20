import type { ReactNode } from "react";

type Props = {
  id: string;
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  className?: string;
};

export function SectionHeading({ id, eyebrow, title, intro, className = "" }: Props) {
  return (
    <div className={className}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 id={id} className="mt-4 text-[2.15rem] sm:text-5xl">
        {title}
      </h2>
      {intro && <p className="mt-5 max-w-xl text-lg text-muted">{intro}</p>}
    </div>
  );
}
