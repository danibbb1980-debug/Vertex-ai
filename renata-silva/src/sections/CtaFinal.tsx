import { CONFIG } from "../config";
import { RevealTitle } from "../components/Reveal";
import { Magnetic } from "../components/Magnetic";
import { InstagramIcon, WhatsAppIcon } from "../components/icons";
import { waLink } from "../lib/whatsapp";

export function CtaFinal() {
  if (!CONFIG.secoes.ctaFinal) return null;
  return (
    <section aria-labelledby="cta-titulo" className="on-dark relative overflow-hidden bg-navy-950 py-28 text-pearl md:py-40">
      <div className="filete absolute inset-x-0 top-0" aria-hidden="true" />
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 -z-0 size-[38rem] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(228,141,157,0.10), transparent 60%)" }}
      />
      <div className="container-site relative z-[2] flex flex-col items-center text-center">
        <p className="eyebrow mb-6 text-rose-300">
          {CONFIG.nome} · {CONFIG.cidade}
        </p>
        <RevealTitle id="cta-titulo" text="Sua avaliação é o primeiro *passo*." className="max-w-[46rem] text-[2.8rem] md:text-[4.6rem]" />
        <p className="mt-6 max-w-[30rem] text-mist">Fale com a clínica, tire suas dúvidas e combine um horário para a sua visita.</p>
        <div className="mt-16 flex flex-col items-center gap-12 sm:flex-row sm:gap-16">
          <Magnetic>
            <a data-line-end href={waLink()} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              <WhatsAppIcon />
              Agendar pelo WhatsApp
            </a>
          </Magnetic>
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            {CONFIG.instagram.url && (
              <a href={CONFIG.instagram.url} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                <InstagramIcon />
                Ver no Instagram
              </a>
            )}
            {CONFIG.secoes.agendamento && (
              <a href="#agendar" className="link-underline min-h-12 content-center font-label text-[0.8rem] uppercase tracking-[0.18em] text-rose-300">
                Solicitar horário pelo formulário
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
