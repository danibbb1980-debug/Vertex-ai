import { CONFIG, waLink } from "../config";
import { IconInstagram, IconWhatsApp } from "../components/Icons";
import { LogoSymbol } from "../components/Logo";
import { Reveal } from "../components/Reveal";
import { ClosingRing } from "../components/SignatureArc";

export function CtaFinal() {
  return (
    <section aria-labelledby="titulo-cta" className="on-dark relative overflow-hidden bg-petroleo-900 py-24 text-white sm:py-32">
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-agua-400 to-transparent" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-40 -right-40 size-[34rem] opacity-[0.07]">
        <LogoSymbol className="h-full w-full" />
      </div>
      <span data-arc="5" data-arc-x="left" className="absolute top-20 block h-px w-px" />
      <div className="container-site relative z-10 text-center">
        <Reveal>
          <p className="rotulo">Agende</p>
          <h2 id="titulo-cta" className="mx-auto mt-4 max-w-3xl text-[2.8rem] font-semibold text-white sm:text-6xl">
            Sua consulta é o primeiro <span className="enfase">passo</span>.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-white/80">
            Fale com a clínica, tire suas dúvidas e combine o dia e o horário da sua avaliação.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-5 sm:flex-row">
            <span className="relative inline-flex p-2.5">
              <ClosingRing />
              <span data-arc="6" data-arc-x="edge-left" className="absolute inset-y-0 left-0 w-px" />
              <a href={waLink()} target="_blank" rel="noopener noreferrer" className="btn btn-primario relative !min-h-14 !px-8 text-[1.05rem]">
                <IconWhatsApp width={21} height={21} /> Agendar pelo WhatsApp
                <span className="sr-only"> (abre em nova aba)</span>
              </a>
            </span>
            <a href={CONFIG.instagram.url} target="_blank" rel="noopener noreferrer" className="btn btn-secundario !min-h-14">
              <IconInstagram width={20} height={20} /> Ver no Instagram
              <span className="sr-only"> (abre em nova aba)</span>
            </a>
          </div>
          {CONFIG.secoes.agendar && (
            <p className="mt-6 text-white/75">
              Prefere preencher? <a href="#agendar" className="link-sub font-semibold text-white decoration-agua-300/60">Solicite pelo formulário</a>.
            </p>
          )}
        </Reveal>
      </div>
    </section>
  );
}
