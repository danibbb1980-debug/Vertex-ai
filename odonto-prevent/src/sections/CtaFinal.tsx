import { m, useReducedMotion } from 'motion/react'
import { CONFIG } from '../config'
import { linkWhatsapp } from '../lib/whatsapp'
import { Botao } from '../components/Botao'
import { TextoRevelado } from '../components/TextoRevelado'
import { IconeInstagram, IconeWhatsapp } from '../components/Icones'

export function CtaFinal() {
  const reduzir = useReducedMotion()
  return (
    <section aria-labelledby="titulo-cta" className="relative isolate overflow-hidden bg-grafite-950 py-28 text-white lg:py-40">
      <div aria-hidden="true" className="absolute left-1/2 top-1/2 -z-10 aspect-square w-[52rem] max-w-[160vw] -translate-x-1/2 -translate-y-1/2">
        <svg viewBox="0 0 400 400" className="h-full w-full">
          <circle cx="200" cy="200" r="190" fill="none" stroke="rgba(255,255,255,0.05)" />
          <circle cx="200" cy="200" r="150" fill="none" stroke="rgba(255,255,255,0.06)" strokeDasharray="2 6" />
          <m.circle
            cx="200"
            cy="200"
            r="170"
            fill="none"
            stroke="#75CEBE"
            strokeOpacity="0.5"
            strokeWidth="1.2"
            strokeLinecap="round"
            transform="rotate(-90 200 200)"
            initial={reduzir ? false : { pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1] }}
          />
        </svg>
      </div>
      <div className="container-site text-center">
        <p className="rotulo text-menta">Prevenção começa com uma conversa</p>
        <h2 id="titulo-cta" className="mx-auto mt-6 max-w-3xl text-[2.5rem] sm:text-6xl lg:text-7xl">
          <TextoRevelado texto="Sua avaliação é o primeiro *passo.*" />
        </h2>
        <p className="mx-auto mt-6 max-w-lg text-lg text-grafite-200">
          Fale com a {CONFIG.nome} e combine um horário. A equipe confirma a disponibilidade com você.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Botao href={linkWhatsapp()} externo variante="menta" icone={<IconeWhatsapp tamanho={20} />}>
            Agendar pelo WhatsApp
          </Botao>
          <Botao href={CONFIG.instagram} externo variante="contorno-claro" icone={<IconeInstagram tamanho={19} />}>
            Ver no Instagram
          </Botao>
        </div>
        {CONFIG.secoes.agendar && (
          <p className="mt-8 text-sm text-grafite-300">
            Prefere preencher?{' '}
            <a href="#agendar" className="font-medium text-menta underline underline-offset-4">
              Solicite pelo formulário
            </a>
          </p>
        )}
      </div>
    </section>
  )
}
