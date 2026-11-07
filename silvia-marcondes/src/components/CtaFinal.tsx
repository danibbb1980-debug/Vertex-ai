import { CONFIG } from "../config";
import { linkWhatsapp, temWhatsapp } from "../lib/whatsapp";
import { Botao } from "./Botao";
import { IconeInstagram, IconeWhatsapp } from "./Icones";
import { Monograma } from "./Logo";
import { TextReveal } from "./TextReveal";

export function CtaFinal() {
  return (
    <section aria-labelledby="titulo-cta" className="escuro relative overflow-hidden bg-grafite py-24 text-porcelana sm:py-32">
      {/* filete de luz */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-pessego/70 to-transparent" />
      <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-0 h-64 w-[44rem] max-w-full -translate-x-1/2 bg-[radial-gradient(closest-side,rgba(242,216,203,0.18),transparent)]" />
      <Monograma className="pointer-events-none absolute -bottom-16 -right-10 size-[22rem] text-white/[0.04]" strokeWidth={1.4} />
      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
        <p className="rotulo">{CONFIG.marca.nomeCompleto}</p>
        <h2 id="titulo-cta" className="mt-5 font-serif text-[2.5rem] leading-[1.05] tracking-[-0.02em] sm:text-6xl">
          <TextReveal text="Seu horário começa com uma *mensagem*." />
        </h2>
        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          {temWhatsapp ? (
            <Botao href={linkWhatsapp()} externo variante="claro" icone={<IconeWhatsapp />}>
              Agendar pelo WhatsApp
            </Botao>
          ) : null}
          {CONFIG.instagram.url ? (
            <Botao href={CONFIG.instagram.url} externo variante="contorno-claro" icone={<IconeInstagram />}>
              Ver no Instagram
            </Botao>
          ) : null}
        </div>
        {temWhatsapp && CONFIG.secoes.agendar ? (
          <p className="mt-8 text-[#e7deec]">
            Prefere escolher dia e horário antes?{" "}
            <a href="#agendar" className="inline-flex min-h-12 items-center font-semibold text-porcelana underline underline-offset-4">
              Solicitar agendamento
            </a>
          </p>
        ) : null}
      </div>
    </section>
  );
}
