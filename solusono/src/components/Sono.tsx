import { Onda } from "./Onda";

const PONTOS = [
  {
    titulo: "O que é apneia do sono",
    texto:
      "Em termos gerais, são pausas ou reduções da respiração que se repetem durante o sono. Muitas vezes a pessoa não percebe, e quem dorme ao lado é quem nota primeiro.",
  },
  {
    titulo: "Ronco não é sinônimo de apneia",
    texto:
      "Ronco é o som da passagem do ar com dificuldade. Ele pode acontecer com ou sem apneia. Por isso, roncar não basta para concluir nada sozinho.",
  },
  {
    titulo: "Quem define o caminho é a avaliação",
    texto:
      "Cansaço ao acordar, sono agitado ou um familiar preocupado com o ronco são bons motivos para conversar com um profissional. A partir da avaliação, cada caso segue o seu próprio caminho.",
  },
];

export function Sono() {
  return (
    <section id="sono" aria-labelledby="sono-titulo" className="relative border-t border-line bg-white py-24 md:py-36">
      <div className="container-site grid gap-y-14 md:grid-cols-12 md:gap-x-8">
        {/* título fixo lateral, conteúdo rolando */}
        <div className="md:col-span-5">
          <div className="md:sticky md:top-32">
            <p className="rotulo">Sono e respiração</p>
            <h2 id="sono-titulo" className="titulo mt-5 text-[clamp(2.4rem,5.4vw,4.4rem)]">
              Ronco e apneia, em poucas <em>palavras</em>.
            </h2>
            <Onda className="mt-10 hidden h-28 w-full md:block" linhas={5} />
          </div>
        </div>

        <ol className="md:col-span-6 md:col-start-7">
          {PONTOS.map((p, i) => (
            <li key={p.titulo} className="grid grid-cols-[3.5rem_1fr] gap-x-4 border-t border-line py-10 first:border-t-0 first:pt-0 md:grid-cols-[5rem_1fr] md:py-14">
              <span className="num text-[2.6rem] leading-none text-sky md:text-[3.5rem]" aria-hidden="true">
                {i + 1}
              </span>
              <div>
                <h3 className="titulo text-[1.75rem] md:text-[2.1rem]">{p.titulo}</h3>
                <p className="mt-4 max-w-[52ch] text-muted">{p.texto}</p>
              </div>
            </li>
          ))}
          <li className="grid grid-cols-[3.5rem_1fr] gap-x-4 border-t border-line pt-8 md:grid-cols-[5rem_1fr]">
            <span aria-hidden="true" />
            <p className="text-sm text-muted">
              Conteúdo informativo. Não substitui consulta nem serve para diagnóstico.
            </p>
          </li>
        </ol>
      </div>
    </section>
  );
}
