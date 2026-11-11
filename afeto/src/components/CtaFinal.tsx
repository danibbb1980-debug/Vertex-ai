import { CONFIG } from '../config'
import { linkWhatsApp } from '../lib/dados'
import { Mosaico } from '../brand/Marca'
import { TituloEnfase } from './Enfase'
import { IconeInstagram, IconeWhatsApp } from './Icones'

/** Fechamento: o mosaico completo ao lado do convite para agendar. */
export function CtaFinal() {
  const zap = linkWhatsApp()
  return (
    <section aria-labelledby="titulo-cta" className="no-escuro relative overflow-hidden bg-terracota-escuro text-papel">
      <div className="mx-auto grid max-w-[84rem] items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-12 lg:gap-8 lg:px-10 lg:py-28">
        <div className="order-2 lg:order-1 lg:col-span-7">
          <h2 id="titulo-cta" className="text-[clamp(2.6rem,6.4vw,5.4rem)]">
            <TituloEnfase texto="O primeiro passo é uma *conversa*." />
          </h2>
          <p className="mt-6 max-w-[30rem] text-papel/90">
            Conte o que você busca. A equipe explica como funciona a avaliação e combina um horário com você.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {zap && (
              <a href={zap} target="_blank" rel="noopener noreferrer" className="botao botao-claro">
                <IconeWhatsApp /> Agendar pelo WhatsApp
              </a>
            )}
            {CONFIG.instagram.url && (
              <a href={CONFIG.instagram.url} target="_blank" rel="noopener noreferrer" className="botao botao-contorno-claro">
                <IconeInstagram /> Ver no Instagram
              </a>
            )}
          </div>
          {CONFIG.secoes.agendar && zap && (
            <p className="mt-6 text-[0.95rem] text-papel/90">
              Prefere escolher dia e horário?{' '}
              <a href="#agendar" className="link-fio font-semibold text-papel">
                Solicitar agendamento
              </a>
            </p>
          )}
        </div>
        <div className="order-1 lg:order-2 lg:col-span-5">
          <div className="relative mx-auto w-[62%] max-w-[26rem] sm:w-[45%] lg:w-full">
            <div aria-hidden="true" className="absolute inset-[8%] -z-0 rounded-full bg-[#7d330f]" />
            <Mosaico className="relative block w-full" titulo={`Mosaico do logo do ${CONFIG.nome}`} />
          </div>
        </div>
      </div>
    </section>
  )
}
