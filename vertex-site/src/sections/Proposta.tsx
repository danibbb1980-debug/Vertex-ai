import { Em, SectionHead } from "../components/SectionHead";

const pontos = [
  {
    t: "Você vê antes",
    d: "O rascunho do seu site fica pronto antes de qualquer pagamento. Nada de comprar no escuro.",
  },
  {
    t: "Sem fidelidade",
    d: "Não existe contrato de permanência nem multa. Se deixar de fazer sentido, você cancela.",
  },
  {
    t: "Só paga depois de aprovar",
    d: "A cobrança começa quando você aprova o site. E ainda há 7 dias de garantia.",
  },
];

export function Proposta() {
  return (
    <section aria-labelledby="proposta-title" className="on-light relative z-10 bg-ivory py-24 text-cocoa sm:py-32">
      <div className="container-v">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <SectionHead
              id="proposta-title"
              num="01"
              label="A proposta"
              title={
                <>
                  Primeiro você vê. <Em>Depois</Em> decide.
                </>
              }
            />
          </div>
          <p data-reveal style={{ ["--d" as string]: "160ms" }} className="self-end text-[1.12rem] leading-relaxed text-cocoa-2 lg:col-span-5">
            O comum é pagar antes e torcer para o resultado ficar bom. Na Vertex, a ordem é invertida: montamos o
            rascunho do site da sua empresa, você avalia com calma e só segue se gostar.
          </p>
        </div>

        <ol className="mt-16 grid border-t border-cocoa/15 sm:mt-20 md:grid-cols-3">
          {pontos.map((p, i) => (
            <li
              key={p.t}
              data-reveal
              style={{ ["--d" as string]: `${i * 110}ms` }}
              className="relative border-b border-cocoa/15 py-9 md:border-b-0 md:border-r md:px-8 md:first:pl-0 md:last:border-r-0"
            >
              <span className="num">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-5 text-[1.6rem] text-cocoa">{p.t}</h3>
              <p className="mt-3 max-w-sm text-cocoa-2">{p.d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
