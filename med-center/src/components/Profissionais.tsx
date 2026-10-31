import { CONFIG, profissionaisVisiveis, temTexto } from "../config";
import { Reveal } from "./Reveal";

function iniciais(nome: string) {
  const partes = nome.replace(/^(Dra?\.)\s*/, "").split(" ").filter((p) => p.length > 2 || /^[A-Z]\.?$/.test(p));
  return ((partes[0]?.[0] ?? "") + (partes[partes.length - 1]?.[0] ?? "")).toUpperCase();
}

export function Profissionais() {
  const lista = profissionaisVisiveis();
  if (!CONFIG.secoes.profissionais || lista.length === 0) return null;

  return (
    <section id="profissionais" aria-labelledby="prof-titulo" className="py-20 sm:py-28">
      <div className="wrap">
        <Reveal className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <p className="eyebrow">Profissionais</p>
            <h2 id="prof-titulo" className="h2 mt-4">
              Quem <em className="enfase">atende</em> no centro.
            </h2>
          </div>
          <p className="max-w-sm text-graphite-soft">Cada cartão traz o registro no conselho profissional. Consulte a recepção sobre agenda e disponibilidade.</p>
        </Reveal>

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {lista.map((p, i) => (
            <Reveal as="li" key={p.nome} delay={(i % 3) * 0.06} className="card flex gap-4 p-5 sm:p-6">
              {temTexto(p.foto) ? (
                <img src={p.foto} alt={`Foto de ${p.nome}`} width={64} height={64} loading="lazy" className="h-16 w-16 shrink-0 rounded-2xl object-cover" />
              ) : (
                <span className="relative grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-brand-soft font-display text-lg font-semibold text-brand-ink" aria-hidden>
                  {iniciais(p.nome)}
                  <span className="absolute -left-1.5 top-2 h-2.5 w-2.5 rounded-[3px] bg-brand/50" />
                </span>
              )}
              <div className="min-w-0">
                <h3 className="font-display text-lg font-semibold leading-snug text-night">{p.nome}</h3>
                <p className="mt-1 text-[0.95rem] leading-snug text-graphite-soft">{p.area}</p>
                <p className="mt-3 inline-flex flex-wrap gap-1.5">
                  <span className="rounded-lg bg-night px-2.5 py-1 font-display text-[0.78rem] font-semibold tracking-wide text-white">{p.registro}</span>
                  {temTexto(p.rqe) && <span className="rounded-lg bg-night/80 px-2.5 py-1 font-display text-[0.78rem] font-semibold tracking-wide text-white">{p.rqe}</span>}
                </p>
                {p.formacao && p.formacao.length > 0 && (
                  <div className="mt-3 text-[0.85rem] leading-relaxed text-graphite-soft">
                    <span className="font-semibold text-graphite">Formação informada:</span> {p.formacao.join("; ")}.
                  </div>
                )}
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
