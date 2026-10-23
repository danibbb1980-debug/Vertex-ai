import { Em, SectionHead } from "../components/SectionHead";

const exemplos = [
  { img: "academia", estilo: "Academia", alt: "Captura de um site de academia em tons de preto e laranja, com foto da área de cárdio" },
  { img: "laboratorio", estilo: "Laboratório de prótese dentária", alt: "Captura de um site de laboratório de prótese em tons de creme e verde-escuro, com fotos de trabalhos" },
  { img: "odontopediatria", estilo: "Odontopediatria", alt: "Captura de um site de odontopediatria em tons claros e vinho, com foto da dentista no consultório" },
  { img: "clinica", estilo: "Clínica odontológica", alt: "Captura de um site de clínica odontológica em tons de creme, azul-marinho e dourado, com foto da recepção" },
  { img: "advocacia", estilo: "Advocacia", alt: "Captura de um site de advogado criminalista em tons de azul-noite e dourado, com cartão de apresentação" },
];

function Badge() {
  return (
    <span className="mb-3 inline-block rounded-full border border-gold/50 bg-ink-0/90 px-3 py-1 font-display text-[0.62rem] font-medium tracking-[0.16em] whitespace-nowrap text-gold-hi uppercase sm:text-[0.68rem]">
      Exemplo ilustrativo
    </span>
  );
}

function Browser({ img, alt }: { img: string; alt: string }) {
  return (
    <div className="overflow-hidden rounded-xl border border-pearl/10 bg-ink-3 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.8)] transition-transform duration-700 ease-[var(--ease-vertex)] group-hover:-translate-y-1">
      <div className="flex items-center gap-2 border-b border-pearl/8 px-4 py-2.5" aria-hidden="true">
        <span className="size-2.5 rounded-full bg-pearl/15" />
        <span className="size-2.5 rounded-full bg-pearl/15" />
        <span className="size-2.5 rounded-full bg-pearl/15" />
        <span className="mx-auto h-4 w-2/5 rounded-md bg-ink-0/70" />
      </div>
      <img
        src={`/exemplos/${img}-640.webp`}
        srcSet={`/exemplos/${img}-640.webp 640w, /exemplos/${img}-1200.webp 1200w`}
        sizes="(min-width: 1024px) 560px, 92vw"
        width={1200}
        height={750}
        loading="lazy"
        decoding="async"
        alt={alt}
        className="block aspect-[16/10] w-full object-cover object-top"
      />
    </div>
  );
}

export function Exemplos() {
  return (
    <section aria-labelledby="ex-title" className="relative z-10 overflow-hidden bg-ink-1 py-24 sm:py-32">
      <div className="container-v">
        <SectionHead
          id="ex-title"
          num="04"
          label="Exemplos de estilos"
          title={
            <>
              Um visual para cada <Em>segmento.</Em>
            </>
          }
          intro="Estilos desenhados pela Vertex, exibidos aqui apenas como exemplos ilustrativos do que dá para criar em cada área."
        />

        <ul className="mt-16 grid gap-x-8 gap-y-14 md:grid-cols-2">
          {exemplos.map((e, i) => (
            <li key={e.img} data-reveal style={{ ["--d" as string]: `${(i % 2) * 120}ms` }} className={
                i === exemplos.length - 1 && i % 2 === 0
                  ? "md:col-span-2 md:mx-auto md:mt-12 md:w-[calc(50%-1rem)]"
                  : i % 2 === 1
                    ? "md:translate-y-12"
                    : ""
              }
            >
              <figure className="group">
                <Badge />
                <Browser img={e.img} alt={e.alt} />
                <figcaption className="mt-4 flex items-baseline gap-3 text-[0.9rem] text-dim">
                  <span className="num">{String(i + 1).padStart(2, "0")}</span>
                  <span>
                    Estilo para <span className="text-mist">{e.estilo.toLowerCase()}</span>
                  </span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
