import { useEffect, useRef } from 'react'
import { CONFIG } from '../config'
import { waLink } from '../lib/whatsapp'
import { BotaoMagnetico } from './ui/Primitivos'
import { IconeLocal, IconeSeta, IconeWhatsApp } from './ui/Icones'

/** Título com revelação palavra por palavra (padrão "Vertical Cut Reveal" do 21st.dev, refeito em CSS). */
function TituloRevelado({ partes }: { partes: { texto: string; italico?: boolean }[] }) {
  let i = 0
  return (
    <>
      {partes.map((p, k) =>
        p.texto.split(' ').map((palavra, j) => {
          const indice = i++
          const conteudo = p.italico ? <em className="destaque">{palavra}</em> : palavra
          return (
            <span key={`${k}-${j}`}>
              <span className="palavra">
                <span style={{ ['--i' as string]: indice }}>{conteudo}</span>
              </span>{' '}
            </span>
          )
        }),
      )}
    </>
  )
}

function FotoEquipe() {
  const f = CONFIG.fotos.equipe
  const set = (ext: string) => f.larguras.map((w) => `${f.base}-${w}.${ext} ${w}w`).join(', ')
  const sizes = '(min-width: 1024px) 40vw, 88vw'
  return (
    <picture>
      <source type="image/avif" srcSet={set('avif')} sizes={sizes} />
      <source type="image/webp" srcSet={set('webp')} sizes={sizes} />
      <img
        src={`${f.base}-720.webp`}
        width={f.largura}
        height={f.altura}
        alt={f.alt}
        fetchPriority="high"
        decoding="async"
        className="h-full w-full object-cover object-[50%_22%]"
      />
    </picture>
  )
}

export function Abertura() {
  const fotoRef = useRef<HTMLDivElement>(null)

  // Leve paralaxe da foto, só transform, pausada fora da tela.
  useEffect(() => {
    const el = fotoRef.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0
    let visivel = true
    const io = new IntersectionObserver(([e]) => (visivel = e.isIntersecting))
    io.observe(el)
    const aoRolar = () => {
      if (!visivel) return
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        el.style.transform = `translate3d(0, ${Math.min(window.scrollY, 900) * 0.06}px, 0)`
      })
    }
    window.addEventListener('scroll', aoRolar, { passive: true })
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', aoRolar)
    }
  }, [])

  return (
    <section
      id="inicio"
      aria-labelledby="titulo-inicio"
      className={`relative overflow-hidden ${CONFIG.rascunho ? 'pt-32' : 'pt-24'} pb-16 lg:pb-24 lg:pt-40`}
    >
      {/* Formas orgânicas de fundo: duas curvas que se encontram */}
      <svg
        aria-hidden
        className="pointer-events-none absolute -right-40 top-10 h-[52rem] w-[52rem] text-areia/60 lg:-right-20"
        viewBox="0 0 600 600"
        fill="none"
      >
        <path d="M300 120C240 30 90 40 70 170c-18 120 120 220 230 330" stroke="currentColor" strokeWidth="1" />
        <path d="M300 120c60-90 210-80 230 50 18 120-120 220-230 330" stroke="currentColor" strokeWidth="1" />
      </svg>

      <div className="container-site relative grid items-end gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7 lg:pb-10">
          <p className="eyebrow surge flex flex-wrap items-center gap-x-3 gap-y-1" style={{ ['--d' as string]: '0ms' }}>
            <span aria-hidden className="h-px w-8 bg-areia" />
            Odontologia e medicina integradas · Alfenas
          </p>
          <h1
            id="titulo-inicio"
            className="mt-6 text-[2.9rem] leading-[1.02] sm:text-[4rem] lg:text-[5.25rem] xl:text-[5.9rem]"
          >
            <TituloRevelado
              partes={[{ texto: 'Odontologia e medicina,' }, { texto: 'juntas', italico: true }, { texto: 'no seu cuidado.' }]}
            />
          </h1>
          <p
            className="surge mt-7 max-w-xl text-lg text-suave sm:text-xl"
            style={{ ['--d' as string]: '520ms' }}
          >
            Uma clínica que reúne duas áreas da saúde no mesmo lugar, com atendimento acolhedor e orientação
            clara.
          </p>
          <div className="surge mt-10 flex flex-col gap-3 sm:flex-row" style={{ ['--d' as string]: '680ms' }}>
            <BotaoMagnetico href={waLink()} externo>
              <IconeWhatsApp width={18} height={18} />
              Agendar minha avaliação
            </BotaoMagnetico>
            <BotaoMagnetico href="#clinica" variante="secundario">
              Conhecer a clínica
              <IconeSeta width={18} height={18} className="transition-transform group-hover:translate-x-1" />
            </BotaoMagnetico>
          </div>
          <p
            className="surge mt-10 flex items-center gap-2.5 text-sm text-suave"
            style={{ ['--d' as string]: '820ms' }}
          >
            <IconeLocal width={18} height={18} className="text-verde" />
            {CONFIG.endereco.rua}, {CONFIG.endereco.bairro} · {CONFIG.endereco.cidade} - {CONFIG.endereco.uf}
          </p>
        </div>

        <div className="relative lg:col-span-5">
          <div className="relative mx-auto max-w-[30rem]">
            <div className="absolute -inset-3 rounded-t-[999px] rounded-b-[2rem] border border-areia/70" aria-hidden />
            <div className="relative aspect-[4/5] overflow-hidden rounded-t-[999px] rounded-b-[1.75rem] bg-nevoa">
              <div ref={fotoRef} className="absolute inset-x-0 -top-6 bottom-0 will-change-transform">
                <div className="assenta h-full w-full">
                  <FotoEquipe />
                </div>
              </div>
            </div>
            <p className="surge absolute -bottom-5 left-6 rounded-full border border-tinta/10 bg-papel/95 px-4 py-2 text-xs font-semibold tracking-[0.06em] text-tinta shadow-sm backdrop-blur">
              Equipe CIVAMI · Alfenas - MG
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

/** Faixa de palavras em movimento lento (padrão "Logo Marquee" acessível do 21st.dev). Pausa fora da tela e no hover. */
export function Faixa() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => el.setAttribute('data-pausada', String(!e.isIntersecting)))
    io.observe(el)
    return () => io.disconnect()
  }, [])
  const itens = ['Odontologia', 'Medicina', 'Atendimento integrado', 'Escuta', 'Orientação clara', 'Acolhimento', 'Alfenas · MG']
  const linha = (oculta: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={oculta || undefined}>
      {itens.map((t) => (
        <li key={t} className="flex items-center whitespace-nowrap">
          <span className="px-7 font-display text-[1.9rem] italic text-tinta/75 sm:text-[2.4rem]">{t}</span>
          <svg width="18" height="18" viewBox="0 0 20 20" aria-hidden className="text-verde-claro">
            <path d="M10 4C8 1 3 2 3 6.5 3 10 7 13 10 16c3-3 7-6 7-9.5C17 2 12 1 10 4Z" fill="currentColor" />
          </svg>
        </li>
      ))}
    </ul>
  )
  return (
    <div
      ref={ref}
      className="faixa relative overflow-hidden border-y border-tinta/10 bg-papel py-6 [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]"
    >
      <p className="sr-only">Odontologia, medicina, atendimento integrado, escuta, orientação clara e acolhimento, em Alfenas - MG.</p>
      <div className="faixa-trilho flex w-max" aria-hidden>
        {linha(false)}
        {linha(true)}
      </div>
    </div>
  )
}
