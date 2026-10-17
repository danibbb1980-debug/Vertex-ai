import type { ReactNode } from "react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

type Props = {
  eyebrow: string;
  title: ReactNode;
  intro: ReactNode;
  crumbs: { name: string; path: string }[];
  children?: ReactNode;
  aside?: ReactNode;
};

/** Abertura das páginas internas: H1, introdução e trilha de navegação. */
export function PageHero({ eyebrow, title, intro, crumbs, children, aside }: Props) {
  return (
    <section className="paper relative overflow-hidden pt-32 pb-16 sm:pt-40 sm:pb-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 right-[-10%] h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(circle,rgb(197_165_114/0.14),transparent_62%)]"
      />
      <div className={`container-site relative grid items-center gap-12 ${aside ? "lg:grid-cols-12" : ""}`}>
        <div className={aside ? "lg:col-span-7" : "max-w-4xl"}>
          <div className="hero-rise">
            <Breadcrumbs items={crumbs} />
          </div>
          <p className="eyebrow hero-rise mt-10 [--d:80ms]">{eyebrow}</p>
          <h1 className="serif hero-rise mt-5 text-[2.9rem] leading-[1] [--d:160ms] sm:text-6xl lg:text-[4.6rem]">{title}</h1>
          <div className="hero-rise mt-7 max-w-2xl text-lg leading-relaxed text-mineral [--d:240ms] sm:text-xl">{intro}</div>
          {children && <div className="hero-rise mt-10 [--d:320ms]">{children}</div>}
        </div>
        {aside && <div className="hero-rise [--d:300ms] lg:col-span-5">{aside}</div>}
      </div>
    </section>
  );
}
