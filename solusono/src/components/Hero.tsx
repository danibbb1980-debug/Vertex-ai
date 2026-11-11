import { CONFIG, linkWhatsapp } from "../config";
import { Botao } from "./Botao";
import { IconeWhatsapp } from "./Icones";
import { Respira } from "./Respira";
import { Onda } from "./Onda";

export function Hero() {
  const { cidade, uf } = CONFIG;
  return (
    <section id="inicio" className="relative overflow-hidden">
      {/* fundo: azul-claro só no canto, sem gradiente chamativo */}
      <div aria-hidden="true" className="absolute inset-y-0 right-0 -z-10 hidden w-[42%] bg-mist md:block" />

      <div className="container-site grid items-center gap-y-10 pb-16 pt-10 md:grid-cols-12 md:gap-x-8 md:pb-24 md:pt-14 lg:min-h-[calc(100svh-7rem)]">
        <div className="md:col-span-7 lg:col-span-7">
          <p className="rotulo aparece">
            Fisioterapia do sono <span aria-hidden="true">·</span>{" "}
            <span className="whitespace-nowrap">
              {cidade} - {uf}
            </span>
          </p>

          <h1 className="titulo mt-5 text-[clamp(3rem,11.5vw,5.6rem)] lg:text-[clamp(4.5rem,6.6vw,6rem)]">
            <span className="linha-mascara">
              <span>Dormir bem</span>
            </span>
            <span className="linha-mascara">
              <span style={{ animationDelay: "120ms" }}>começa por</span>
            </span>
            <span className="linha-mascara">
              <span style={{ animationDelay: "240ms" }}>
                <em>entender</em> o seu
              </span>
            </span>
            <span className="linha-mascara">
              <span style={{ animationDelay: "360ms" }}>sono.</span>
            </span>
          </h1>

          <p className="aparece mt-7 max-w-[34ch] text-lg text-muted md:text-xl" style={{ animationDelay: "600ms" }}>
            Avaliação e acompanhamento para ronco e apneia do sono, presencial ou online.
          </p>

          <div className="aparece mt-9 flex flex-col gap-3 sm:flex-row sm:items-center" style={{ animationDelay: "750ms" }}>
            <Botao href={linkWhatsapp(CONFIG.mensagens.geral)} externo icone={<IconeWhatsapp />}>
              Agendar pelo WhatsApp
            </Botao>
            <Botao href="#servicos" variante="secundario">
              Conhecer os serviços
            </Botao>
          </div>
        </div>

        <figure className="relative md:col-span-5">
          <Onda className="absolute left-[-30%] right-[-30%] top-1/2 -z-10 h-40 w-[160%] -translate-y-1/2" linhas={6} cor="#b9d0e8" />
          <div className="relative mx-auto w-[min(78vw,26rem)] md:w-full md:max-w-[30rem]">
            <Respira />
            <span aria-hidden="true" className="rotulo absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-[0.65rem] text-muted md:bg-mist">
              inspira
            </span>
            <span aria-hidden="true" className="rotulo absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 bg-white px-3 text-[0.65rem] text-muted md:bg-mist">
              expira
            </span>
          </div>
          <figcaption className="mt-8 text-center text-[0.8rem] tracking-[0.04em] text-muted">
            Um ciclo de respiração, devagar: cerca de seis segundos.
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
