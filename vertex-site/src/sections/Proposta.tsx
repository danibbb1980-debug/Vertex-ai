import { Label } from "../components/SectionHead";

const pontos = [
  ["Você vê antes", "O rascunho do seu site fica pronto antes de qualquer pagamento. Nada de comprar no escuro."],
  ["Sem fidelidade", "Não existe contrato de permanência nem multa. Se deixar de fazer sentido, você cancela."],
  ["Só paga depois de aprovar", "A cobrança começa quando você aprova o site. E ainda há 7 dias de garantia."],
];

export function Proposta() {
  return (
    <section aria-labelledby="proposta-title" className="on-light relative z-10 bg-ivory py-24 text-cocoa sm:py-32">
      <div className="container-v">
        <Label>A proposta</Label>
        <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:items-end">
          <h2 id="proposta-title" className="text-[clamp(2.6rem,7.5vw,5.4rem)] lg:col-span-7">
            Primeiro você vê.
            <br />
            Depois decide.
          </h2>
          <p className="max-w-md text-[1.1rem] leading-relaxed text-cocoa-2 lg:col-span-4 lg:col-start-9 lg:pb-3">
            O comum é pagar antes e torcer para o resultado ficar bom. Na Vertex, a ordem é invertida: montamos o
            rascunho do site da sua empresa, você avalia com calma e só segue se gostar.
          </p>
        </div>

        <ol className="mt-16 grid sm:mt-20 md:grid-cols-3">
          {pontos.map(([t, d], i) => (
            <li key={t} className="border-t border-cocoa/20 py-7 md:pr-10">
              <span className="num">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-4 text-[1.35rem] font-normal text-cocoa">{t}</h3>
              <p className="mt-2 max-w-sm text-cocoa-2">{d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
