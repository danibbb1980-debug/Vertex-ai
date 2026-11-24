import { CONFIG } from "../config";
import RelogioDeSol from "./RelogioDeSol";
import { BotaoWhats } from "./ui";

/** Revelação por linha (inspirada no "Text Reveal" do 21st.dev): cada linha sobe de dentro de uma máscara. */
function Linha({ children, atraso, folga = false }: { children: React.ReactNode; atraso: number; folga?: boolean }) {
  return (
    <span className={`block overflow-hidden ${folga ? "pb-[0.36em] -mb-[0.2em]" : "pb-[0.14em] -mb-[0.14em]"}`}>
      <span className="revela block" style={{ animationDelay: `${atraso}ms` }}>
        {children}
      </span>
    </span>
  );
}

export default function Hero() {
  return (
    <section id="inicio" className="relative overflow-hidden bg-linho pt-[128px] sm:pt-[140px]">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <p className="rotulo text-cinza">
          {CONFIG.nome} · {CONFIG.descritor} · {CONFIG.cidade}/{CONFIG.uf}
        </p>
        <h1 className="titulo mt-5 text-[clamp(2.9rem,6.4vw,5rem)] text-grafite">
          <span className="sr-only">Seu horário, com tempo para você.</span>
          {/* celular: 3 linhas */}
          <span aria-hidden="true" className="block md:hidden">
            <Linha atraso={80}>Seu horário,</Linha>
            <Linha atraso={200} folga>
              com <span className="enfase">tempo</span>
            </Linha>
            <Linha atraso={320}>para você.</Linha>
          </span>
          {/* telas largas: 2 linhas */}
          <span aria-hidden="true" className="hidden md:block">
            <Linha atraso={80}>Seu horário, com</Linha>
            <Linha atraso={220} folga>
              <span className="enfase">tempo</span> para você.
            </Linha>
          </span>
        </h1>
        <div className="mt-6 grid gap-6 md:mt-8 md:grid-cols-12 md:items-end">
          <p className="max-w-[30rem] text-[1.08rem] leading-relaxed text-grafite/85 md:col-span-6">
            Estética e bem-estar com atendimento individual e horário marcado, de segunda a sábado, em{" "}
            {CONFIG.cidade}.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row md:col-span-6 md:justify-end">
            <BotaoWhats texto="Agendar horário" />
            {CONFIG.secoes.atendimentos && (
              <a href="#atendimentos" className="btn btn-linha">
                Ver atendimentos
              </a>
            )}
          </div>
        </div>
        <RelogioDeSol className="mt-12 pb-16 sm:mt-10 sm:pb-20" />
      </div>
    </section>
  );
}
