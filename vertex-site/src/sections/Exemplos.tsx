import { Em, SectionHead } from "../components/SectionHead";

function Badge({ small = false }: { small?: boolean }) {
  return (
    <span
      className={`z-20 rounded-full border border-gold/50 bg-ink-0/90 font-display font-medium whitespace-nowrap text-gold-hi uppercase backdrop-blur ${
        small
          ? "mb-3 inline-block px-2.5 py-1 text-[0.58rem] tracking-[0.1em] sm:text-[0.66rem] sm:tracking-[0.16em]"
          : ""
      }`}
    >
      Exemplo ilustrativo
    </span>
  );
}

function Browser() {
  return (
    <div className="overflow-hidden rounded-xl border border-pearl/10 bg-ink-3 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.8)]">
      <div className="flex items-center gap-2 border-b border-pearl/8 px-4 py-3">
        <span className="size-2.5 rounded-full bg-pearl/15" />
        <span className="size-2.5 rounded-full bg-pearl/15" />
        <span className="size-2.5 rounded-full bg-pearl/15" />
        <span className="mx-auto rounded-md bg-ink-0/70 px-6 py-1 font-display text-[0.65rem] tracking-wide text-dim">clinicaalba.com.br</span>
      </div>
      {/* Clínica fictícia: tons de sálvia e areia */}
      <div aria-hidden="true" className="bg-[#f5f2ec] p-5 text-[#22302a] sm:p-8">
        <div className="flex items-center justify-between">
          <span className="font-serif text-xl italic">alba</span>
          <span className="hidden gap-5 text-[0.65rem] tracking-wide text-[#3d4f45] sm:flex">
            <span>Tratamentos</span><span>Equipe</span><span>Contato</span>
          </span>
          <span className="rounded-full bg-[#4f6656] px-3 py-1 text-[0.6rem] text-white">Agendar</span>
        </div>
        <div className="mt-6 grid grid-cols-5 items-center gap-5 sm:mt-10">
          <div className="col-span-3">
            <p className="text-[0.55rem] tracking-[0.25em] text-[#4f6656] uppercase">Odontologia</p>
            <p className="mt-2 font-display text-[1.15rem] leading-tight sm:text-[1.9rem]">
              Cuidado que se nota <span className="font-serif italic">no sorriso.</span>
            </p>
            <p className="mt-2 hidden text-[0.7rem] leading-snug text-[#3d4f45] sm:block">
              Atendimento sem pressa, com explicação clara de cada etapa do tratamento.
            </p>
            <span className="mt-4 inline-block rounded-full bg-[#4f6656] px-4 py-1.5 text-[0.6rem] text-white sm:text-[0.7rem]">
              Agendar pelo WhatsApp
            </span>
          </div>
          <div className="col-span-2">
            <div className="aspect-[3/4] rounded-t-full bg-[linear-gradient(160deg,#c9d3c7,#8ea08f_60%,#5f7563)]" />
          </div>
        </div>
        <div className="mt-6 grid grid-cols-3 gap-2 sm:gap-3">
          {["Limpeza", "Clareamento", "Implantes"].map((t) => (
            <span key={t} className="rounded-lg border border-[#22302a]/12 bg-white/60 px-2 py-2 text-center text-[0.58rem] sm:text-[0.7rem]">
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function Phone({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[230px] rounded-[2rem] border border-pearl/12 bg-ink-3 p-2 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.8)]">
      <div className="relative overflow-hidden rounded-[1.55rem]">
        <span className="absolute top-2 left-1/2 z-10 h-4 w-16 -translate-x-1/2 rounded-full bg-black/80" />
        {children}
      </div>
    </div>
  );
}

function Pilates() {
  return (
    <div aria-hidden="true" className="aspect-[9/17] bg-[#efe4d5] px-4 pt-9 pb-4 text-[#3b2219]">
      <div className="flex items-center justify-between">
        <span className="font-display text-sm tracking-[0.2em]">ONDINA</span>
        <span className="h-px w-5 bg-[#3b2219]" />
      </div>
      <p className="mt-5 text-[0.5rem] tracking-[0.25em] text-[#8a3f22] uppercase">Studio de pilates</p>
      <p className="mt-1 font-display text-[1.25rem] leading-[1.05]">
        Movimento com <span className="font-serif italic">presença.</span>
      </p>
      <div className="mt-3 aspect-[4/3] rounded-xl bg-[linear-gradient(150deg,#d9a184,#b5603f_55%,#7e3a22)]" />
      <ul className="mt-3 space-y-1.5 text-[0.55rem]">
        {[["Seg", "07h", "Solo"], ["Ter", "18h", "Aparelhos"], ["Qui", "19h", "Gestantes"]].map(([d, h, m]) => (
          <li key={d} className="flex justify-between border-b border-[#3b2219]/15 pb-1">
            <span>{d} · {h}</span>
            <span>{m}</span>
          </li>
        ))}
      </ul>
      <span className="mt-3 block rounded-full bg-[#8a3f22] py-1.5 text-center text-[0.55rem] text-white">Falar no WhatsApp</span>
    </div>
  );
}

function Cantina() {
  return (
    <div aria-hidden="true" className="aspect-[9/17] bg-[#1d1411] px-4 pt-9 pb-4 text-[#f3e6d4]">
      <div className="flex items-center justify-between">
        <span className="font-serif text-base italic">Brasa &amp; Trigo</span>
        <span className="h-px w-5 bg-[#f3e6d4]" />
      </div>
      <div className="mt-4 aspect-square rounded-full bg-[radial-gradient(circle_at_40%_35%,#f2b37a,#d9673a_45%,#5a2414_80%)]" />
      <p className="mt-3 font-display text-[1.1rem] leading-[1.05]">
        Massa fresca, <span className="font-serif italic text-[#f2b37a]">forno a lenha.</span>
      </p>
      <ul className="mt-3 space-y-1.5 text-[0.55rem]">
        {[["Tagliatelle ao ragu", "48"], ["Pizza margherita", "62"], ["Tiramisù", "26"]].map(([n, p]) => (
          <li key={n} className="flex justify-between border-b border-[#f3e6d4]/15 pb-1">
            <span>{n}</span>
            <span>R$ {p}</span>
          </li>
        ))}
      </ul>
      <span className="mt-3 block rounded-full bg-[#d9673a] py-1.5 text-center text-[0.55rem] text-[#1d1411]">Pedir pelo WhatsApp</span>
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
          intro="Marcas fictícias, criadas pela Vertex só para mostrar caminhos de estilo. Não são clientes nem projetos publicados."
        />

        <div className="mt-16 grid items-end gap-10 lg:grid-cols-12 lg:gap-8">
          <figure data-reveal className="relative lg:col-span-7">
            <Badge small />
            <Browser />
            <figcaption className="mt-4 text-[0.9rem] text-dim">
              <span className="text-mist">Clínica Alba</span> · marca fictícia · estilo para odontologia
            </figcaption>
          </figure>
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:col-span-5">
            <figure data-reveal style={{ ["--d" as string]: "100ms" }} className="relative text-center">
              <Badge small />
              <Phone>
                <Pilates />
              </Phone>
              <figcaption className="mt-4 text-[0.9rem] text-dim">
                <span className="text-mist">Ondina</span> · fictícia · pilates
              </figcaption>
            </figure>
            <figure data-reveal style={{ ["--d" as string]: "200ms" }} className="relative text-center lg:-translate-y-10">
              <Badge small />
              <Phone>
                <Cantina />
              </Phone>
              <figcaption className="mt-4 text-[0.9rem] text-dim">
                <span className="text-mist">Brasa &amp; Trigo</span> · fictícia · restaurante
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}
