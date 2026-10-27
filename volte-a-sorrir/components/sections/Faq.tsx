import { Plus } from "lucide-react";
import { faq } from "@/lib/faq";
import { Reveal } from "../ui/Reveal";
import { Eyebrow } from "../ui/WaveMark";

export function Faq() {
  return (
    <section id="duvidas" aria-labelledby="duvidas-title" className="bg-paper py-24 sm:py-28 lg:py-36">
      <div className="mx-auto grid max-w-[1240px] gap-12 px-5 sm:px-8 lg:grid-cols-12 lg:gap-8">
        <Reveal className="lg:col-span-4">
          <Eyebrow>Dúvidas</Eyebrow>
          <h2
            id="duvidas-title"
            className="font-display mt-6 text-[clamp(2.2rem,4.6vw,3.4rem)] font-[420] leading-[1.04] text-navy-deep"
          >
            Perguntas frequentes.
          </h2>
        </Reveal>

        <Reveal delay={80} className="lg:col-span-8">
          <div className="border-t border-navy/12">
            {faq.map((item) => (
              <details key={item.q} className="group border-b border-navy/12">
                <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-5 text-left text-lg font-semibold text-navy">
                  {item.q}
                  <span className="faq-icon inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-navy/15 transition-[transform,background-color] duration-300 group-open:bg-sun">
                    <Plus className="size-5" strokeWidth={1.8} aria-hidden />
                  </span>
                </summary>
                <p className="max-w-2xl pb-7 pr-14 leading-relaxed text-stone">{item.a}</p>
              </details>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
