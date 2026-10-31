import { useUnidade } from "../../lib/unidade";
import { IconeAproximacao, IconeCalendario, IconeCartao, IconeCheck, IconePorta } from "../ui/Icones";
import { Revelar } from "../ui/Revelar";
import { TituloSecao } from "../ui/TituloSecao";

const iconeEstrutura = (t: string) => (/hora marcada|agend/i.test(t) ? IconeCalendario : /banheiro/i.test(t) ? IconePorta : IconeCheck);
const iconePagamento = (t: string) => (/aproxima/i.test(t) ? IconeAproximacao : IconeCartao);

export function Estrutura() {
  const { unidade } = useUnidade();
  const grupos = [
    { titulo: "Estrutura", itens: unidade.estrutura, icone: iconeEstrutura },
    { titulo: "Formas de pagamento", itens: unidade.pagamentos, icone: iconePagamento },
  ].filter((g) => g.itens.length);
  if (!grupos.length) return null;

  return (
    <section id="estrutura" aria-labelledby="titulo-estrutura" className="relative bg-sand-200 py-24 sm:py-28">
      <div className="container-site">
        <Revelar>
          <TituloSecao id="titulo-estrutura" rotulo="Estrutura e pagamento" titulo="Informações *práticas* para a sua visita." />
        </Revelar>
        <div className={`mt-12 grid gap-5 ${grupos.length > 1 ? "lg:grid-cols-2" : ""}`}>
          {grupos.map((g, gi) => (
            <Revelar key={g.titulo} atraso={gi * 0.1} className="rounded-[1.75rem] border border-line bg-white p-6 sm:p-10">
              <h3 className="text-2xl text-navy-900">{g.titulo}</h3>
              <div className="filete mt-5" aria-hidden="true" />
              <ul className="mt-6 space-y-4">
                {g.itens.map((t) => {
                  const Ic = g.icone(t);
                  return (
                    <li key={t} className="flex items-center gap-4">
                      <span className="grid size-11 shrink-0 place-items-center rounded-full bg-teal-200/50 text-teal-700">
                        <Ic tamanho={20} />
                      </span>
                      <span className="text-[1.02rem]">{t}</span>
                    </li>
                  );
                })}
              </ul>
            </Revelar>
          ))}
        </div>
      </div>
    </section>
  );
}
