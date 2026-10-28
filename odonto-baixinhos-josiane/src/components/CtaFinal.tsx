import { linkWhatsApp, profissionaisAtivas } from "../config";
import { IconeInstagram, IconeWhatsApp } from "./Icones";
import { Brilho } from "./Ornamentos";

export function CtaFinal() {
  const ativas = profissionaisAtivas();
  return (
    <section className="relative isolate overflow-hidden bg-tinta py-20 text-marfim md:py-28" aria-labelledby="titulo-cta">
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(30rem 26rem at 0% 0%, rgba(34,97,125,.35), transparent 70%), radial-gradient(30rem 26rem at 100% 100%, rgba(138,94,51,.35), transparent 70%)",
        }}
      />
      <div className="container-site text-center">
        <Brilho className="mx-auto h-6 w-6 text-ouro-claro" />
        <h2 id="titulo-cta" className="revela mx-auto mt-6 max-w-3xl text-[2.4rem] leading-[1.04] sm:text-6xl md:text-7xl [&_em]:!text-ouro-claro">
          O primeiro passo é uma <em>conversa</em>.
        </h2>
        <p className="revela mx-auto mt-6 max-w-lg text-lg text-marfim/80">
          Mande uma mensagem, tire suas dúvidas e combine o melhor horário.
        </p>
        <div className="revela mx-auto mt-10 flex max-w-2xl flex-col justify-center gap-3 sm:flex-row">
          {ativas.map((p) => (
            <a
              key={p.id}
              href={linkWhatsApp(p.whatsapp, p.mensagemWhatsApp)}
              target="_blank"
              rel="noopener"
              className={`btn !min-h-14 flex-1 text-base ${p.id === "aline" ? "btn-ceu" : "btn-ouro"}`}
              aria-label={`Agendar com a ${p.nome} pelo WhatsApp (abre em nova aba)`}
            >
              <IconeWhatsApp tamanho={20} />
              Agendar com a {p.nomeCurto}
            </a>
          ))}
        </div>
        <div className="revela mt-6 flex flex-wrap justify-center gap-3">
          <a href="#agendar" className="btn btn-marfim-contorno">
            Solicitar agendamento
          </a>
          {ativas.map((p) => (
            <a
              key={p.id}
              href={p.instagram}
              target="_blank"
              rel="noopener"
              className="btn btn-marfim-contorno"
              aria-label={`Instagram ${p.instagramUser} (abre em nova aba)`}
            >
              <IconeInstagram tamanho={18} /> {p.instagramUser}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
