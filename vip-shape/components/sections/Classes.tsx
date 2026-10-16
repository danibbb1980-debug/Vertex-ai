import { CalendarClock, Dumbbell, Music2, Waves, Zap, type LucideIcon } from "lucide-react";
import {
  classSchedule,
  modalities,
  modalityName,
  photos,
  whatsappUrl,
  type ModalityId,
} from "@/lib/site-data";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Photo } from "@/components/ui/Photo";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/BrandIcons";

const icons: Record<ModalityId, LucideIcon> = {
  musculacao: Dumbbell,
  "hit-dance": Zap,
  danca: Music2,
  jump: Waves,
};

/** Dias em que cada aula coletiva acontece, derivados da grade (fonte única). */
function daysFor(id: ModalityId): string {
  const days = classSchedule.filter((c) => c.modality === id).map((c) => c.short);
  return days.join(" · ");
}

export function Classes() {
  const [strength, ...group] = modalities;

  return (
    <section id="modalidades" aria-labelledby="modalidades-title" className="relative py-24 sm:py-32">
      <div className="container-site">
        <Reveal>
          <SectionHeading
            id="modalidades-title"
            eyebrow="Modalidades"
            title={
              <>
                Encontre o <span className="text-orange">seu ritmo.</span>
              </>
            }
            description="Da musculação às aulas coletivas: escolha o formato que combina com você — ou misture os dois."
          />
        </Reveal>

        <div className="mt-14 grid gap-4 lg:grid-cols-12 lg:gap-5">
          {/* Musculação: card de destaque com foto real */}
          <Reveal variant="scale" className="group relative isolate min-h-[26rem] overflow-hidden lg:col-span-5 lg:row-span-3 lg:min-h-0">
            <article className="flex h-full flex-col justify-end p-7 sm:p-9">
              <div className="absolute inset-0 -z-10">
                <Photo
                  photo={photos.funcional}
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="h-full w-full"
                  imgClassName="transition-transform duration-[1.2s] ease-out-soft group-hover:scale-105"
                />
              </div>
              <div aria-hidden="true" className="absolute inset-0 -z-10 bg-linear-to-t from-ink via-ink/60 to-ink/10" />
              <Dumbbell className="h-8 w-8 text-orange" strokeWidth={1.5} aria-hidden="true" />
              <p className="mt-6 text-[0.7rem] font-semibold tracking-[0.22em] text-orange uppercase">{strength.kind}</p>
              <h3 className="display mt-2 text-5xl sm:text-6xl">{strength.name}</h3>
              <p className="mt-4 max-w-sm text-white/80">{strength.description}</p>
            </article>
          </Reveal>

          {/* Aulas coletivas: faixas horizontais com tipografia grande */}
          {group.map((m, i) => {
            const Icon = icons[m.id];
            return (
              <Reveal key={m.id} delay={100 + i * 80} className="lg:col-span-7">
                <article className="group relative flex h-full items-center gap-5 overflow-hidden border border-white/10 bg-graphite p-6 transition-colors duration-300 hover:border-orange/60 sm:gap-7 sm:p-8">
                  <span
                    aria-hidden="true"
                    className="text-outline pointer-events-none absolute -right-2 -bottom-6 hidden opacity-60 md:block font-display text-[7rem] leading-none font-bold whitespace-nowrap uppercase transition-[-webkit-text-stroke-color] duration-300 select-none group-hover:[-webkit-text-stroke-color:rgb(255_90_31/0.45)] sm:text-[8.5rem]"
                  >
                    {m.name}
                  </span>
                  <span className="relative flex h-14 w-14 shrink-0 items-center justify-center bg-orange text-ink transition-transform duration-300 group-hover:-rotate-6">
                    <Icon className="h-6 w-6" strokeWidth={2} aria-hidden="true" />
                  </span>
                  <div className="relative">
                    <p className="text-[0.68rem] font-semibold tracking-[0.22em] text-mist uppercase">
                      {m.kind} · <span className="text-orange">{daysFor(m.id)}</span>
                    </p>
                    <h3 className="mt-1 font-display text-2xl font-bold text-white uppercase sm:text-3xl">{m.name}</h3>
                    <p className="mt-1.5 max-w-md text-sm text-mist sm:text-base">{m.description}</p>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>

        {/* Grade de horários */}
        <div className="mt-20 grid gap-10 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-4">
            <CalendarClock className="h-8 w-8 text-orange" strokeWidth={1.5} aria-hidden="true" />
            <h3 className="display mt-5 text-4xl sm:text-5xl">Horários das aulas coletivas</h3>
            <p className="mt-5 text-mist">
              Consulte a equipe para confirmar a disponibilidade das aulas e eventuais alterações na programação.
            </p>
            <Button
              href={whatsappUrl("classes")}
              external
              icon={<WhatsAppIcon className="h-5 w-5" />}
              className="mt-8 w-full sm:w-auto"
            >
              Quero saber mais sobre as aulas
            </Button>
          </Reveal>

          <Reveal delay={120} className="lg:col-span-8">
            <table className="w-full border-collapse text-left">
              <caption className="sr-only">Grade semanal de aulas coletivas da VIP Shape</caption>
              <thead>
                <tr className="border-b-2 border-orange text-[0.7rem] tracking-[0.2em] text-mist uppercase">
                  <th scope="col" className="py-3 pr-3 font-semibold">Dia</th>
                  <th scope="col" className="py-3 pr-3 font-semibold">Modalidade</th>
                  <th scope="col" className="py-3 text-right font-semibold">Horário</th>
                </tr>
              </thead>
              <tbody>
                {classSchedule.map((row) => (
                  <tr key={row.day} className="border-b border-white/10 transition-colors hover:bg-white/[0.03]">
                    <th scope="row" className="py-5 pr-3 align-middle font-normal sm:py-6">
                      <span className="font-display text-xl font-bold text-white uppercase sm:hidden">{row.short}</span>
                      <span className="hidden font-display text-xl font-bold text-white uppercase sm:inline md:text-2xl">
                        {row.day}
                      </span>
                    </th>
                    <td className="py-5 pr-3 align-middle sm:py-6">
                      <span className="inline-flex items-center gap-2 text-sm font-semibold text-white sm:text-base">
                        <span aria-hidden="true" className="h-2 w-2 rotate-45 bg-orange" />
                        {modalityName(row.modality)}
                      </span>
                    </td>
                    <td className="py-5 text-right align-middle sm:py-6">
                      <span className="inline-flex flex-wrap justify-end gap-1.5">
                        {row.times.map((t, i) => (
                          <span key={t} className="contents">
                            <time className="border border-white/20 px-2.5 py-1 font-display text-sm font-bold text-white sm:px-3 sm:text-base">
                              {t}
                            </time>
                            {i < row.times.length - 1 && <span className="sr-only"> e </span>}
                          </span>
                        ))}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
