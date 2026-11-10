import { CONFIG, preenchido } from "../config";
import { BotaoAgendar, LinkTelefone } from "../components/Botoes";
import { IconeInstagram } from "../components/Icones";
import { Revela } from "../components/Revela";
import { temWhatsapp } from "../lib/contato";
import { secaoAtiva } from "../lib/secoes";

export function CtaFinal() {
  return (
    <section aria-labelledby="titulo-cta" className="escuro relative overflow-hidden bg-chumbo py-24 text-creme lg:py-32">
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-[7px] border-y-[1.5px] border-bronze" />
      <div className="container-phd">
        <Revela className="max-w-3xl">
          <p className="rotulo">Agendamento</p>
          <h2 id="titulo-cta" className="mt-5 text-[2.4rem] text-creme sm:text-[3.2rem] lg:text-[3.9rem]">
            O primeiro passo é uma <em>mensagem</em>.
          </h2>
          <p className="mt-6 max-w-xl text-lg text-creme/85">
            {temWhatsapp
              ? "Conte qual atendimento você procura. A equipe da clínica responde e combina o dia e o horário com você."
              : "Ligue para a clínica. A equipe combina o dia e o horário com você."}
          </p>
        </Revela>
        <div className="mt-12 flex flex-col items-start gap-14 pl-[0.25rem] sm:flex-row sm:items-center sm:gap-20">
          <BotaoAgendar variante="claro" dataSig />
          {preenchido(CONFIG.instagram.url) ? (
            <a href={CONFIG.instagram.url} target="_blank" rel="noopener noreferrer" className="botao botao-contorno">
              <IconeInstagram /> Ver no Instagram
              <span className="sr-only">(abre em nova aba)</span>
            </a>
          ) : null}
        </div>
        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-2 text-creme/85">
          {temWhatsapp ? <LinkTelefone className="text-creme hover:text-bronze-claro" /> : null}
          {secaoAtiva("agendar") && temWhatsapp ? (
            <a href="#agendar" className="link-sublinhado inline-flex min-h-12 items-center text-creme">
              Ou use o formulário de solicitação
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}
