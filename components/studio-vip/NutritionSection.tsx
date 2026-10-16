import { Reveal } from "@/components/ui/Reveal";
import { Eyebrow, WhatsAppLink } from "./ui";

/**
 * Treino + nutrição.
 *
 * O grafismo usa duas vezes a silhueta do logo — azul (movimento) e verde
 * (alimentação) — sobrepostas, com "sua rotina" na interseção. Nenhuma foto de
 * comida ou de consulta: o estúdio não forneceu, e uma imagem de banco
 * prometeria algo que não sabemos se existe.
 *
 * O texto evita afirmar pacote, inclusão em plano ou resultado: as condições
 * são confirmadas pela equipe no WhatsApp.
 */
export function NutritionSection() {
  return (
    <section
      id="nutricao"
      className="relative overflow-hidden bg-vip-mist py-24 text-vip-graphite sm:py-32"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-16 px-4 sm:px-8 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
        {/* ── Grafismo ── */}
        <Reveal className="order-2 lg:order-1">
          <div className="relative mx-auto aspect-square w-full max-w-[30rem]" aria-hidden="true">
            <div className="vip-shape absolute top-0 left-0 flex h-[66%] w-[66%] items-start justify-start bg-vip-900 p-6 text-white [--vip-r:5rem] sm:p-8">
              <span className="font-vip-display text-3xl leading-none font-extrabold uppercase italic sm:text-4xl">
                Movimento
              </span>
            </div>
            <div className="vip-shape absolute right-0 bottom-0 flex h-[66%] w-[66%] items-end justify-end bg-vip-green p-6 text-vip-graphite [--vip-r:5rem] sm:p-8">
              <span className="font-vip-display text-3xl leading-none font-extrabold uppercase italic sm:text-4xl">
                Alimentação
              </span>
            </div>
            {/* Interseção: onde as duas frentes se encontram */}
            <div className="absolute inset-[34%] flex items-center justify-center bg-white shadow-[0_20px_50px_-20px_rgba(4,55,90,0.5)]">
              <span className="text-center font-vip-display text-2xl leading-[0.9] font-extrabold text-vip-900 uppercase italic sm:text-3xl">
                Sua
                <br />
                rotina
              </span>
            </div>
            <div className="absolute -top-3 -left-3 h-[66%] w-[66%] rounded-[0_5.75rem_0_5.75rem] border-[1.5px] border-vip-green" />
          </div>
        </Reveal>

        {/* ── Texto ── */}
        <div className="order-1 lg:order-2">
          <Reveal>
            <Eyebrow tone="dark">Treino e nutrição na mesma jornada</Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-6 text-[clamp(2.5rem,7.5vw,4.6rem)] text-vip-900">
              Movimento, alimentação e cuidado.{" "}
              <span className="text-vip-700">Tudo conectado à sua rotina.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 text-lg leading-relaxed text-vip-graphite/80">
              Para quem deseja ampliar o cuidado com a saúde, o Studio VIP também oferece a
              possibilidade de acompanhamento nutricional personalizado com a profissional{" "}
              <strong className="font-bold text-vip-900">Aline</strong>.
            </p>
          </Reveal>

          <dl className="mt-10 grid gap-0 sm:grid-cols-2">
            {[
              {
                title: "Treinamento personalizado",
                text: "Orientação profissional e exercícios alinhados aos seus objetivos.",
              },
              {
                title: "Acompanhamento nutricional",
                text: "Orientação alimentar individualizada, com foco em uma abordagem prática e compatível com a rotina.",
              },
            ].map((item, index) => (
              <Reveal
                key={item.title}
                delay={0.12 + index * 0.06}
                className={`border-t-[3px] py-6 sm:pr-6 ${
                  index === 0 ? "border-vip-900" : "border-vip-green sm:pl-6"
                }`}
              >
                <dt className="font-vip-display text-2xl leading-none font-extrabold text-vip-900 uppercase italic">
                  {item.title}
                </dt>
                <dd className="mt-3 text-[0.95rem] leading-relaxed text-vip-graphite/75">
                  {item.text}
                </dd>
              </Reveal>
            ))}
          </dl>

          <Reveal delay={0.2}>
            <p className="mt-6 font-medium text-vip-900">
              Converse com nossa equipe e descubra quais opções de acompanhamento estão disponíveis
              para você.
            </p>
            <WhatsAppLink message="nutrition" trackAs="nutricao" variant="dark" className="mt-7">
              Quero conhecer as opções
            </WhatsAppLink>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
