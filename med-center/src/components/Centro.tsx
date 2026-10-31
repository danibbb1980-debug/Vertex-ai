import { CONFIG } from "../config";
import { AccessIcon, CalendarIcon, LayersIcon } from "./Icons";
import { Reveal } from "./Reveal";

export function Centro() {
  const pilares = [
    { icon: <LayersIcon />, titulo: "Várias áreas", texto: `Odontologia, medicina, nutrição, saúde mental, fisioterapia e estética, distribuídas em ${CONFIG.estrutura.andares} andares.` },
    { icon: <CalendarIcon />, titulo: "Hora marcada", texto: "O atendimento é organizado por agendamento, com recepção para orientar cada visita." },
    {
      icon: <AccessIcon />,
      titulo: "Acessibilidade e acolhimento",
      texto: CONFIG.mostrarAcolhimento
        ? "Entrada, banheiro e estacionamento acessíveis para cadeirantes. Um espaço que acolhe todas as pessoas."
        : "Entrada, banheiro e estacionamento acessíveis para cadeirantes.",
    },
  ];
  return (
    <section id="centro" aria-labelledby="centro-titulo" className="relative py-20 sm:py-28">
      <div className="wrap grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <Reveal>
          <p className="eyebrow">O centro</p>
          <h2 id="centro-titulo" className="h2 mt-4">
            Cada área é uma peça que se <em className="enfase">encaixa</em>.
          </h2>
          <p className="lead mt-6">
            O Med Center Vital Brazil reúne profissionais de áreas diferentes da saúde em um mesmo endereço, em Pouso Alegre. São três andares,
            com recepção e atendimento com hora marcada, para que você encontre a área que procura em um só lugar.
          </p>
          <p className="mt-8 font-display text-lg font-medium italic text-brand-ink">{CONFIG.assinatura}</p>
        </Reveal>
        <ul className="grid gap-4 sm:grid-cols-2">
          {pilares.map((p, i) => (
            <Reveal as="li" key={p.titulo} delay={i * 0.08} className={`card p-6 sm:p-7 ${i === 0 ? "sm:col-span-2" : ""}`}>
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-soft text-brand-ink">{p.icon}</span>
              <h3 className="mt-5 font-display text-xl font-semibold text-night">{p.titulo}</h3>
              <p className="mt-2 leading-relaxed text-graphite-soft">{p.texto}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** Faixa discreta com os nomes das áreas, em movimento lento. Pausa fora da tela. */
export function AreasMarquee() {
  const nomes = CONFIG.categorias.map((c) => c.nome);
  const items = [...nomes, ...nomes];
  return (
    <div className="marquee relative overflow-hidden border-y border-night/[0.06] bg-white py-5" aria-hidden="true" ref={pauseOffscreen}>
      <div className="marquee-track flex w-max items-center gap-10 pr-10">
        {[...items, ...items].map((n, i) => (
          <span key={i} className="flex items-center gap-10 font-display text-xl font-medium text-night/70 sm:text-2xl">
            {n}
            <span className="inline-block h-2.5 w-2.5 rounded-[3px] bg-brand" />
          </span>
        ))}
      </div>
    </div>
  );
}

function pauseOffscreen(el: HTMLDivElement | null) {
  if (!el || typeof IntersectionObserver === "undefined") return;
  const io = new IntersectionObserver(([e]) => el.classList.toggle("marquee-paused", !e.isIntersecting));
  io.observe(el);
}
