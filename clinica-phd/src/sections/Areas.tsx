import { CONFIG, areasAtivas } from "../config";
import { Titulo } from "../components/Titulo";
import { Revela } from "../components/Revela";
import { contatoExterno, contatoHref, temWhatsapp } from "../lib/contato";
import { IconeSeta } from "../components/Icones";

export function Areas() {
  return (
    <section id="areas" aria-labelledby="titulo-areas" className="bg-areia/55 py-24 lg:py-32">
      <div className="container-phd">
        <Titulo
          id="titulo-areas"
          rotulo="Áreas de atendimento"
          apoio={<p>Cada consulta começa por uma avaliação médica individual. A indicação de cada atendimento é feita pelo médico ou pela médica.</p>}
        >
          O que você encontra <em>aqui</em>
        </Titulo>

        <ul className="grade-areas mt-14 grid gap-5 sm:grid-cols-2 lg:mt-16 lg:gap-6">
          {areasAtivas.map((a, i) => (
            <Revela as="li" key={a.slug} atraso={(i % 2) * 90} className="h-full">
              <article className="cartao-area canto-d relative flex h-full flex-col bg-creme p-7 sm:p-9" aria-labelledby={`area-${a.slug}`}>
                <div aria-hidden="true" className="linha-topo absolute left-7 right-16 top-0 h-[7px] border-y-[1.5px] border-bronze sm:left-9" />
                <div className="flex items-baseline justify-between gap-4">
                  <h3 id={`area-${a.slug}`} className="text-[1.9rem] sm:text-[2.1rem]">
                    {a.nome}
                  </h3>
                  <span aria-hidden="true" className="font-serif text-lg italic text-bronze-texto">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <p className="mt-5 text-[1.05rem] text-grafite">{a.educativo}</p>
                <p className="mt-3 text-[1rem] text-cinza-texto">{a.descricao}</p>
                <div className="mt-auto pt-8">
                  <a
                    href={contatoHref(CONFIG.mensagens.area(a.nome))}
                    {...(contatoExterno ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="group inline-flex min-h-12 items-center gap-2 font-semibold text-grafite"
                  >
                    <span className="link-sublinhado">
                      {temWhatsapp ? `Pedir informações sobre ${a.nome.toLowerCase()}` : "Ligar para a clínica"}
                    </span>
                    <IconeSeta className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                    {contatoExterno ? <span className="sr-only">(abre o WhatsApp em nova aba)</span> : null}
                  </a>
                </div>
              </article>
            </Revela>
          ))}
        </ul>
      </div>
    </section>
  );
}
