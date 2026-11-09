import { CONFIG } from '../config'
import { OrquideaMarca } from '../brand/Logo'
import { OrquideaTraco } from '../brand/OrquideaTraco'
import { BotaoMagnetico } from '../components/BotaoMagnetico'
import { IconeSetaBaixo, IconeWhatsApp } from '../components/Icones'
import { TextReveal } from '../components/TextReveal'
import { linkWhatsApp, registro, temWhatsApp } from '../lib/dados'

export function Hero() {
  const temAtendimentos = CONFIG.secoes.atendimentos && CONFIG.atendimentos.length > 0
  return (
    <section id="inicio" className="grao relative isolate overflow-hidden pb-16 pt-36 sm:pt-40 lg:pb-24 lg:pt-48" aria-labelledby="titulo-hero">
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_70%_60%_at_85%_20%,#ead9d7_0%,transparent_70%),radial-gradient(ellipse_50%_50%_at_0%_100%,#efe4ee_0%,transparent_70%)]" />

      <div className="container-site grid items-center gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <p className="rotulo mb-7 flex items-center gap-3 !tracking-[0.14em] sm:!tracking-[0.2em]">
            <span aria-hidden="true" className="h-px w-8 bg-current opacity-60" />
            <span>Dermatologia · <span className="whitespace-nowrap">Poços de Caldas - MG</span></span>
          </p>
          <h1 id="titulo-hero" className="text-[2.65rem] leading-[1.04] sm:text-6xl lg:text-[4.6rem]">
            <TextReveal trechos={['Cuidado com a sua pele, com', { enfase: 'avaliação' }, 'médica individual.']} />
          </h1>
          <p className="mt-7 max-w-xl text-lg text-tinta-suave sm:text-xl">Dermatologia, estética e laser com hora marcada, em Poços de Caldas.</p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {temWhatsApp && (
              <BotaoMagnetico href={linkWhatsApp()} target="_blank" rel="noopener noreferrer" className="btn btn-primario" aria-label="Agendar pelo WhatsApp (abre em nova aba)">
                <IconeWhatsApp />
                Agendar pelo WhatsApp
              </BotaoMagnetico>
            )}
            {temAtendimentos && (
              <a href="#atendimentos" className="btn btn-secundario">
                Ver atendimentos
                <IconeSetaBaixo width={18} height={18} />
              </a>
            )}
          </div>

          <div className="mt-10 inline-flex items-center gap-4 rounded-2xl border border-filete bg-pedra-50/80 py-3 pl-3 pr-5 shadow-leve backdrop-blur">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-rose text-vinho">
              <OrquideaMarca className="h-5 w-7" />
            </span>
            <p className="text-[0.92rem] leading-snug text-tinta-suave">
              <strong className="font-semibold text-vinho">{CONFIG.nome}</strong> · {CONFIG.descritor}
              <span className="block font-medium tracking-wide text-tinta">{registro()}</span>
            </p>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[19rem] sm:max-w-sm lg:col-span-5 lg:max-w-none">
          <div className="relative aspect-[4/5] overflow-hidden rounded-t-full rounded-b-[2rem] bg-gradient-to-b from-rose-200 via-rose to-[#dcc3c5] shadow-cartao">
            <svg viewBox="0 0 400 500" className="absolute inset-0 h-full w-full text-pedra-50/70" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1">
              <path d="M40 500V200a160 160 0 0 1 320 0v300" vectorEffect="non-scaling-stroke" />
              <path d="M80 500V210a120 120 0 0 1 240 0v290" vectorEffect="non-scaling-stroke" />
            </svg>
            <OrquideaTraco desenhar className="absolute left-1/2 top-[44%] w-[82%] -translate-x-1/2 -translate-y-1/2 text-vinho" espessura={0.85} atraso={0.5} />
            <p className="absolute inset-x-0 bottom-7 text-center font-serif text-sm italic text-vinho/80">Centro de Dermatologia</p>
          </div>
          <div aria-hidden="true" className="absolute -bottom-6 -left-6 h-24 w-24 rounded-full border border-lilas/60" />
          <div aria-hidden="true" className="absolute -right-3 top-10 h-3 w-3 rounded-full bg-lilas" />
        </div>
      </div>
    </section>
  )
}
