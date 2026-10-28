import { CONFIG, type Profissional } from "../config";
import { numeroDaSecao } from "../lib/secoes";
import { CabecalhoSecao } from "../components/CabecalhoSecao";
import { Confirmar, exibir } from "../components/Confirmar";
import { Revelar } from "../components/Revelar";
import { IconeInstagram, IconeSetaDiagonal } from "../components/Icones";

function Retrato({ p }: { p: Profissional }) {
  return (
    <div className="relative size-28 shrink-0 md:size-32">
      <span aria-hidden="true" className="absolute -inset-2 rounded-full border border-ouro/50" />
      {p.foto ? (
        <picture>
          <source srcSet={`${p.foto}.avif`} type="image/avif" />
          <img
            src={`${p.foto}.webp`}
            alt={`Retrato de ${p.nome}`}
            width={128}
            height={128}
            loading="lazy"
            decoding="async"
            className="size-full rounded-full object-cover grayscale-[0.15]"
          />
        </picture>
      ) : (
        <span className="grid size-full place-items-center rounded-full bg-areia font-display text-[2.2rem] text-bronze italic">
          {p.iniciais}
        </span>
      )}
    </div>
  );
}

export function Profissionais() {
  return (
    <section id="profissionais" aria-labelledby="titulo-profissionais" className="relative z-10 py-24 md:py-36">
      <div className="contem">
        <CabecalhoSecao
          numero={numeroDaSecao("profissionais")}
          rotulo="Profissionais"
          id="titulo-profissionais"
          titulo={
            <>
              Quem <em>cuida</em> de você.
            </>
          }
        />
        <ul className="mt-14 grid gap-5 md:mt-20 md:gap-6 lg:grid-cols-2">
          {CONFIG.profissionais.map((p, i) => (
            <Revelar como="li" key={p.nome} atraso={i * 120}>
              <article className="flex h-full flex-col gap-8 rounded-[28px] border border-linha bg-branco p-7 sm:flex-row sm:items-start md:p-10">
                <Retrato p={p} />
                <div className="flex flex-1 flex-col">
                  <h3 className="font-display text-[2.2rem] leading-none font-medium md:text-[2.5rem]">{p.nome}</h3>
                  <p className="mt-4 text-[0.95rem] text-suave">
                    {p.titulo}
                    {exibir(p.cro.valor) && (
                      <>
                        <span aria-hidden="true" className="mx-2 text-ouro">
                          ·
                        </span>
                        <span className="tabular-nums">{p.cro.valor}</span>
                        <Confirmar mostrar={!p.cro.confirmado} valor={p.cro.valor} />
                      </>
                    )}
                  </p>
                  {p.atuacao && <p className="mt-2 text-[0.95rem] text-suave">{p.atuacao}</p>}
                  {p.formacao && (
                    <p className="mt-2 text-[0.95rem] text-suave">
                      Formação: {p.formacao.valor}
                      <Confirmar mostrar={!p.formacao.confirmado} />
                    </p>
                  )}
                  <a
                    href={p.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group mt-8 inline-flex min-h-11 items-center gap-2.5 self-start border-t border-linha pt-5 text-[0.92rem] text-tinta"
                  >
                    <IconeInstagram tamanho={18} className="text-bronze" />
                    {p.instagramUsuario}
                    <IconeSetaDiagonal tamanho={15} className="text-bronze transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    <span className="sr-only">(Instagram, abre em nova aba)</span>
                  </a>
                </div>
              </article>
            </Revelar>
          ))}
        </ul>
      </div>
    </section>
  );
}
