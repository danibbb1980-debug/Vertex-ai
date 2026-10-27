import { CONFIG } from "../config";
import { linkWhatsApp } from "../lib/whatsapp";
import { Botao } from "../components/Botao";
import { Revelar } from "../components/Revelar";

export function CtaFinal() {
  return (
    <section aria-labelledby="titulo-cta" className="sobre-escuro relative z-10 overflow-hidden bg-noite text-marfim">
      <svg viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true" className="absolute inset-0 h-full w-full">
        <g fill="none" stroke="#dcc8a3" strokeWidth="0.8">
          <circle cx="600" cy="760" r="300" strokeOpacity="0.14" />
          <circle cx="600" cy="760" r="420" strokeOpacity="0.1" />
          <circle cx="600" cy="760" r="540" strokeOpacity="0.07" />
          <line x1="440" y1="600" x2="760" y2="600" strokeOpacity="0.2" />
        </g>
      </svg>
      <div className="contem relative flex flex-col items-center py-28 text-center md:py-40">
        <Revelar className="flex items-center gap-4 text-champanhe">
          <span aria-hidden="true" className="h-px w-10 bg-champanhe/50" />
          <span className="rotulo">Agende sua avaliação</span>
          <span aria-hidden="true" className="h-px w-10 bg-champanhe/50" />
        </Revelar>
        <Revelar atraso={80}>
          <h2 id="titulo-cta" className="titulo-display mt-8 max-w-[16ch] text-[clamp(2.7rem,7vw,5.6rem)]">
            Seu próximo passo começa com uma <em>avaliação</em>.
          </h2>
        </Revelar>
        <Revelar atraso={160} className="mt-12 flex flex-col gap-3 sm:flex-row">
          <Botao href={linkWhatsApp()} externo icone="whatsapp" variante="claro" magnetico>
            Agendar pelo WhatsApp
          </Botao>
          <Botao href={CONFIG.instagram} externo variante="contorno-claro" icone="seta">
            Ver no Instagram
          </Botao>
        </Revelar>
        <p className="mt-10 text-[0.86rem] text-marfim/65">
          WhatsApp {CONFIG.telefoneExibicao} · Seg a sex {CONFIG.horarios.linhas[0].curto} · Sáb {CONFIG.horarios.linhas[1].curto}
        </p>
      </div>
    </section>
  );
}
