import { profissionaisVisiveis, mostrarTituloEspecialista, preenchido, type Profissional } from "../config";
import { Titulo } from "../components/Titulo";
import { Revela } from "../components/Revela";
import { crmTexto } from "../lib/contato";

function Cartao({ p, i }: { p: Profissional; i: number }) {
  const comTitulo = mostrarTituloEspecialista(p);
  const registro = `${crmTexto(p.crm, p.crmUf)}${preenchido(p.rqe) ? ` | RQE ${p.rqe}` : ""}`;
  return (
    <Revela as="li" atraso={(i % 3) * 80} className="h-full">
      <article className="group relative flex h-full flex-col border-t-[1.5px] border-grafite/80 pt-6 pb-2">
        <div aria-hidden="true" className="absolute left-0 top-[5px] h-px w-full origin-left scale-x-[0.25] bg-bronze transition-transform duration-700 ease-[var(--ease-suave)] group-hover:scale-x-100" />
        {preenchido(p.foto) ? (
          <img
            src={p.foto}
            alt={`Foto de ${p.tratamento} ${p.nome}`}
            width={480}
            height={600}
            loading="lazy"
            decoding="async"
            className="canto-d mb-6 aspect-[4/5] w-full object-cover"
          />
        ) : null}
        <h3 className="text-[1.6rem] leading-[1.15] sm:text-[1.75rem]">
          <span className="text-bronze-texto">{p.tratamento}</span> {p.nome}
        </h3>
        <p className="mt-3 text-[0.95rem] font-semibold tracking-[0.04em] text-grafite">
          {comTitulo ? `${p.titulo} · ` : ""}
          {registro}
        </p>
        {!comTitulo ? (
          <p className="mt-4 flex items-center gap-3 text-[0.95rem] text-cinza-texto">
            <span aria-hidden="true" className="h-[5px] w-5 border-y border-bronze-escuro" />
            Atende em: {p.area}
          </p>
        ) : null}
      </article>
    </Revela>
  );
}

export function CorpoClinico() {
  return (
    <section id="corpo-clinico" aria-labelledby="titulo-corpo" className="py-24 lg:py-32">
      <div className="container-phd">
        <Titulo
          id="titulo-corpo"
          rotulo="Corpo clínico"
          apoio={<p>Médicos e médicas que atendem na clínica, com o registro no Conselho Regional de Medicina ao lado de cada nome.</p>}
        >
          Quem <em>atende</em> você
        </Titulo>
        <ul className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
          {profissionaisVisiveis.map((p, i) => (
            <Cartao key={p.crm} p={p} i={i} />
          ))}
        </ul>
      </div>
    </section>
  );
}
