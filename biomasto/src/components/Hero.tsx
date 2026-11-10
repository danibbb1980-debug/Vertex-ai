import { useRef } from 'react'
import { m, useScroll, useTransform, useReducedMotion } from 'motion/react'
import { CONFIG } from '../config'
import { acaoContato } from '../lib'
import { IcPin, IcRelogio, IcSeta, IcTelefone, IcWhatsapp } from './icones'
import { Botao, TextoRevelado } from './ui'

export function Hero() {
  const principal = CONFIG.usarWhatsapp
    ? { href: '#agendar', label: 'Agendar minha consulta', externo: false, Icone: IcWhatsapp }
    : { ...acaoContato({ labelTel: 'Ligar para agendar' }), Icone: IcTelefone }

  return (
    <section
      id="inicio"
      aria-labelledby="titulo-hero"
      data-fio="hero"
      className={`relative overflow-hidden ${CONFIG.rascunho ? 'pt-[8.5rem]' : 'pt-[6.5rem]'} pb-16 sm:pb-20 lg:pb-28`}
    >
      {/* Fundo: véu lilás muito suave no canto, sem gradiente chamativo. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -top-40 size-[38rem] rounded-full bg-lilas-suave/70 blur-3xl"
      />
      <div className="container-site relative grid items-center gap-12 lg:grid-cols-[1.12fr_0.88fr] lg:gap-16">
        <div>
          <p className="rotulo surge leading-relaxed max-sm:text-[0.7rem] max-sm:tracking-[0.12em]">
            Mastologia · Ginecologia · Obstetrícia
            <span className="block text-tinta-2 sm:inline">
              <span className="hidden sm:inline"> · </span>
              {CONFIG.cidade} - {CONFIG.uf}
            </span>
          </p>
          <h1
            id="titulo-hero"
            className="mt-5 text-[2.65rem] leading-[1.04] sm:text-[3.6rem] lg:text-[4.35rem]"
          >
            <TextoRevelado texto="Saúde da mulher, com cuidado em cada *fase*." atraso={0} />
          </h1>
          <p className="surge mt-6 max-w-xl text-lg text-tinta-2 sm:text-xl" style={{ animationDelay: '450ms' }}>
            Atendimento com avaliação individual, explicações claras e hora marcada.
          </p>
          <div className="surge mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap" style={{ animationDelay: '600ms' }}>
            <Botao
              href={principal.href}
              externo={principal.externo}
              icone={<principal.Icone size={19} />}
              ariaLabel={CONFIG.usarWhatsapp ? undefined : `Ligar para agendar: ${CONFIG.telefone}`}
            >
              {principal.label}
            </Botao>
            <Botao href="#atendimentos" variante="secundario" icone={<IcSeta size={18} className="order-last transition-transform duration-300 group-hover:translate-x-1" />}>
              Conhecer os atendimentos
            </Botao>
          </div>
          <ul className="surge mt-10 flex flex-col gap-3 text-[0.95rem] text-tinta-2 sm:flex-row sm:flex-wrap sm:gap-x-7" style={{ animationDelay: '750ms' }}>
            <li className="flex items-center gap-2">
              <IcRelogio size={18} className="text-salvia-tinta" />
              Segunda a sexta, com hora marcada
            </li>
            <li className="flex items-center gap-2">
              <IcPin size={18} className="text-salvia-tinta" />
              {CONFIG.endereco.bairro}, {CONFIG.cidade}
            </li>
          </ul>
        </div>

        <ArcoTulipa />
      </div>
    </section>
  )
}

/** Composição de assinatura: arco suave com a tulipa da logo desenhada em traço. */
function ArcoTulipa() {
  const ref = useRef<HTMLDivElement>(null)
  const reduz = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], reduz ? [0, 0] : [0, -40])

  return (
    <div ref={ref} className="relative mx-auto w-full max-w-[16rem] sm:max-w-[24rem] lg:max-w-none" aria-hidden="true">
      <div className="relative aspect-[4/5] overflow-hidden rounded-t-[999px] rounded-b-[2.5rem] bg-gradient-to-b from-lilas-suave to-marfim-2 ring-1 ring-inset ring-ameixa/6">
        {/* filetes concêntricos */}
        <div className="absolute inset-5 rounded-t-[999px] rounded-b-[2rem] ring-1 ring-inset ring-lilas/50" />
        <div className="absolute inset-10 rounded-t-[999px] rounded-b-[1.6rem] ring-1 ring-inset ring-lilas/30" />
        <m.svg
          style={{ y }}
          viewBox="0 0 400 500"
          className="absolute inset-0 h-full w-full"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* caule e folhas */}
          <path className="desenha" pathLength={1} style={{ animationDelay: '700ms' }} d="M200 462V318" stroke="var(--color-salvia-tinta)" strokeWidth="2" />
          <path className="desenha" pathLength={1} style={{ animationDelay: '1100ms' }} d="M200 410c-26-36-70-50-108-43 12 40 56 58 108 43Z" stroke="var(--color-salvia-tinta)" strokeWidth="2" />
          <path className="desenha" pathLength={1} style={{ animationDelay: '1300ms' }} d="M200 372c22-31 60-43 92-38-10 34-48 50-92 38Z" stroke="var(--color-salvia-tinta)" strokeWidth="2" />
          {/* a tulipa do "m" ampliada */}
          <g transform="translate(61.4 40.2) scale(1.1)">
            <path className="desenha" pathLength={1} style={{ animationDelay: '200ms' }} d="M106 246C59 232 31 200 31 140V62C31 34 52 18 78 18S126 34 126 62V166" stroke="var(--color-lilas-tinta)" strokeWidth="1.8" />
            <path className="desenha" pathLength={1} style={{ animationDelay: '350ms' }} d="M146 246C193 232 221 200 221 140V62C221 34 200 18 174 18S126 34 126 62" stroke="var(--color-lilas-tinta)" strokeWidth="1.8" />
          </g>
          {/* a onda da logo, que vira o fio do site */}
          <path className="desenha" pathLength={1} style={{ animationDelay: '1500ms' }} d="M40 448c34 34 92 40 136 26 54-17 76-58 140-58 24 0 44 8 60 20" stroke="var(--color-salvia)" strokeWidth="3" />
        </m.svg>
      </div>
      <p className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-marfim px-5 py-2 font-serif text-[1.05rem] italic text-lilas-tinta shadow-[0_8px_24px_-14px_rgb(75_48_69/0.4)] ring-1 ring-ameixa/8">
        cuidado que acompanha
      </p>
    </div>
  )
}

/* ------------------------------------------------------------------
 * Faixa de palavras (adaptada do "Marquee" do 21st.dev). Em vez de rolar sozinha
 * (o que exigiria botão de pausa), ela se move junto com a rolagem da página:
 * parada quando a leitora para. Decorativa: o conteúdo já está no texto do site.
 * ------------------------------------------------------------------ */
export function FaixaPalavras() {
  const ref = useRef<HTMLDivElement>(null)
  const reduz = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const x = useTransform(scrollYProgress, [0, 1], reduz ? ['0%', '0%'] : ['0%', '-22%'])
  const itens = ['Mastologia', 'Ginecologia', 'Obstetrícia', 'Hora marcada', 'Avaliação individual', `${CONFIG.cidade} - ${CONFIG.uf}`]
  const linha = [...itens, ...itens, ...itens]
  return (
    <div ref={ref} aria-hidden="true" className="relative z-[2] overflow-hidden border-y border-ameixa/8 bg-marfim-2 py-5">
      <m.div style={{ x }} className="marquee-faixa flex w-max items-center gap-8 whitespace-nowrap font-serif text-[1.35rem] text-ameixa/80 sm:text-[1.6rem]">
        {linha.map((t, i) => (
          <span key={i} className="flex items-center gap-8">
            <span className={i % 3 === 1 ? 'italic text-lilas-tinta' : ''}>{t}</span>
            <svg viewBox="560 660 220 260" className="h-5 w-5" fill="none" stroke="var(--color-salvia)" strokeWidth="16" strokeLinecap="round">
              <path d="M650 906C603 892 575 860 575 800V722C575 694 596 678 622 678S670 694 670 722V826" />
              <path d="M690 906C737 892 765 860 765 800V722C765 694 744 678 718 678S670 694 670 722" />
            </svg>
          </span>
        ))}
      </m.div>
    </div>
  )
}
