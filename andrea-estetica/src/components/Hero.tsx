import { CONFIG } from "../config";
import { horaFala } from "../tempo";
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
  const d = CONFIG.horarios.dias;
  const semana = d[1];
  const sab = d[6];
  return (
    <section id="inicio" className="relative overflow-hidden pt-[150px] sm:pt-[170px]">
      <div className="mx-auto grid max-w-[1240px] gap-y-12 px-5 sm:px-8 lg:grid-cols-12 lg:gap-x-10">
        <div className="lg:col-span-7">
          <p className="rotulo text-cinza">
            {CONFIG.nome} · {CONFIG.descritor} · {CONFIG.cidade}/{CONFIG.uf}
          </p>
          <h1 className="titulo mt-7 text-[clamp(3.1rem,9.4vw,7.4rem)] text-grafite">
            <Linha atraso={80}>Seu horário,</Linha>
            <Linha atraso={220} folga>
              com <span className="enfase">tempo</span>
            </Linha>
            <Linha atraso={360}>para você.</Linha>
          </h1>
          <p className="mt-8 max-w-[34rem] text-[1.1rem] leading-relaxed text-grafite/85">
            Estética e bem-estar com atendimento individual e horário marcado, de segunda a sábado, em{" "}
            {CONFIG.cidade}.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <BotaoWhats texto="Agendar horário" />
            {CONFIG.secoes.atendimentos && (
              <a href="#atendimentos" className="btn btn-linha">
                Ver atendimentos
              </a>
            )}
          </div>
        </div>

        <div className="lg:col-span-5 lg:pt-16">
          <RelogioDeSol className="mx-auto w-full max-w-[340px] sm:max-w-[420px] lg:max-w-none" />
        </div>
      </div>

      {/* Régua de fatos: o que a pessoa procura no celular, sem rolar muito. */}
      <div className="mx-auto mt-16 max-w-[1240px] px-5 sm:mt-20 sm:px-8">
        <dl className="grid border-t border-grafite/25 sm:grid-cols-3">
          {semana && (
            <div className="flex items-baseline justify-between gap-4 border-b border-grafite/15 py-4 sm:block sm:border-b-0 sm:border-r sm:pr-6">
              <dt className="text-sm text-cinza">Segunda a sexta</dt>
              <dd className="tab sm:mt-1 sm:text-lg">
                {horaFala(semana.abre)} às {horaFala(semana.fecha)}
              </dd>
            </div>
          )}
          {sab && (
            <div className="flex items-baseline justify-between gap-4 border-b border-grafite/15 py-4 sm:block sm:border-b-0 sm:border-r sm:px-6">
              <dt className="text-sm text-cinza">Sábado</dt>
              <dd className="tab sm:mt-1 sm:text-lg">
                {horaFala(sab.abre)} às {horaFala(sab.fecha)}
              </dd>
            </div>
          )}
          <div className="flex items-baseline justify-between gap-4 py-4 sm:block sm:pl-6">
            <dt className="text-sm text-cinza">Endereço</dt>
            <dd className="text-right sm:mt-1 sm:text-left sm:text-lg">
              {CONFIG.endereco.rua}, {CONFIG.endereco.numero}
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
