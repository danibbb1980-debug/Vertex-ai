import { m } from "motion/react";
import { CONFIG, enderecoCompleto, temAdvogado } from "../config";
import { DarkSection } from "../components/DarkSection";
import { MagneticLink } from "../components/Magnetic";
import { Logo } from "../components/Chrome";
import { waLink } from "../lib/whatsapp";

export function FinalCta() {
  return (
    <DarkSection as="div" className="pt-32 md:pt-48">
      <section aria-label="Conversar com o escritório" className="wrap">
        <p className="eyebrow text-gold-light">Próximo passo</p>
        <h2 className="title mt-6 text-[clamp(3.2rem,11vw,9.5rem)] leading-[0.95] tracking-[-0.035em]">
          Conversar é o <br className="hidden sm:block" />
          primeiro <em>passo</em>.
        </h2>

        {/* a linha do processo termina aqui, em círculo, junto ao botão */}
        <div className="mt-14 flex flex-col gap-8 md:mt-20 md:flex-row md:items-center md:gap-0">
          <div aria-hidden className="hidden flex-1 items-center md:flex">
            <m.div
              className="h-px flex-1 origin-left bg-wine-light/70"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: "0px 0px -15% 0px" }}
              transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
            />
            <m.span
              className="mr-6 flex h-6 w-6 items-center justify-center rounded-full border-2 border-wine-light"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true, margin: "0px 0px -15% 0px" }}
              transition={{ duration: 0.6, delay: 1.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="h-2 w-2 rounded-full bg-wine-light" />
            </m.span>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <MagneticLink href={waLink()} external variant="paper" size="lg">
              Falar pelo WhatsApp
            </MagneticLink>
            <MagneticLink href="#agendar" variant="outline-dark" size="lg">
              Pré-atendimento
            </MagneticLink>
          </div>
        </div>
      </section>

      <footer className="wrap mt-32 pb-10 md:mt-44">
        <div className="grid gap-12 border-t border-paper/15 pt-14 md:grid-cols-12">
          <div className="md:col-span-5">
            <Logo dark />
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-paper/70">{enderecoCompleto}</p>
            {temAdvogado ? (
              <p className="mt-3 text-sm text-paper/70">
                {CONFIG.advogado.nome} · {CONFIG.advogado.oab}
              </p>
            ) : null}
          </div>
          <nav aria-label="Rodapé" className="md:col-span-3 md:col-start-7">
            <p className="eyebrow text-gold-light">Contato</p>
            <ul className="mt-5 space-y-3 text-paper/85">
              <li>
                <a href={waLink()} target="_blank" rel="noopener noreferrer" className="ulink">
                  WhatsApp {CONFIG.whatsappExibicao}
                </a>
              </li>
              <li>
                <a href={CONFIG.instagram.url} target="_blank" rel="noopener noreferrer" className="ulink">
                  Instagram {CONFIG.instagram.usuario}
                </a>
              </li>
              <li>
                <a href={CONFIG.mapsUrl} target="_blank" rel="noopener noreferrer" className="ulink">
                  Como chegar
                </a>
              </li>
            </ul>
          </nav>
          <div className="md:col-span-3">
            <p className="eyebrow text-gold-light">Horário</p>
            <p className="mt-5 text-paper/85">Segunda a sexta, 09h às 18h</p>
            <p className="mt-1 text-sm text-paper/65">{CONFIG.avisoHorario}</p>
          </div>
        </div>
        <div className="mt-16 flex flex-col gap-4 border-t border-paper/15 pt-8 text-[0.82rem] text-paper/65 md:flex-row md:items-center md:justify-between">
          <p>Conteúdo informativo, sem caráter de captação de clientela.</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <a href="/privacidade.html" className="ulink">
              Privacidade
            </a>
            <span>Site criado pela Lumivo Web</span>
          </div>
        </div>
      </footer>
    </DarkSection>
  );
}
