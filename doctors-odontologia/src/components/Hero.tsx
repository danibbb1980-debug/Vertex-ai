import { useEffect, useRef, useState } from 'react'
import { CONFIG, waLink } from '../config'
import { BotaoLink, Foto } from './ui'
import { IconePin, IconeRelogio } from './Icones'

/** Revelação por linhas com máscara (adaptado de "vertical cut reveal"). */
function Linha({ children, i }: { children: React.ReactNode; i: number }) {
  return (
    <span className="block overflow-hidden pb-[0.08em]">
      <span className="anim-linha block" style={{ animationDelay: `${0.1 + i * 0.12}s` }}>
        {children}
      </span>
    </span>
  )
}

export function Hero() {
  const foto = CONFIG.fotos.destaque

  return (
    <section id="inicio" data-secao="Início" aria-labelledby="titulo-hero" className="relative overflow-hidden pt-[124px] md:pt-[140px]">
      {/* Grade editorial sutil */}
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-60 [background-image:linear-gradient(to_right,var(--color-linha)_1px,transparent_1px)] [background-size:calc(100%/6)_100%] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />

      <div className="container-site relative grid items-center gap-12 pb-16 md:pb-24 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-7">
          <p className="anim-surgir rotulo flex flex-wrap items-center gap-x-3 gap-y-1 text-ouro-escuro" style={{ animationDelay: '0s' }}>
            <span aria-hidden className="inline-block h-4 w-[3px] bg-ouro" />
            Odontologia e Saúde <span aria-hidden>·</span> {CONFIG.cidade} - {CONFIG.uf}
          </p>

          <h1 id="titulo-hero" className="mt-6 text-[2.6rem] leading-[1.02] text-vinho-900 sm:text-6xl lg:text-[3.7rem] xl:text-[4.1rem]">
            <Linha i={0}>Cuidado completo,</Linha>
            <Linha i={1}>com horário que</Linha>
            <Linha i={2}>
              cabe na sua <em className="enfase">rotina</em>.
            </Linha>
          </h1>

          <p className="mt-7 max-w-xl text-lg leading-relaxed text-pedra sm:text-xl">
            Várias áreas da odontologia em um só endereço, com avaliação individual e hora marcada.
          </p>

          <div className="anim-surgir mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap" style={{ animationDelay: '0.55s' }}>
            <BotaoLink href={waLink()} whatsapp>
              Agendar minha avaliação
            </BotaoLink>
            <BotaoLink href="#atendimentos" variante="secundario">
              Ver atendimentos
            </BotaoLink>
          </div>

          <div className="anim-surgir mt-10 grid gap-4 border-t border-linha pt-6 text-[0.92rem] text-pedra sm:grid-cols-2" style={{ animationDelay: '0.65s' }}>
            <div className="flex gap-3">
              <IconeRelogio tamanho={20} className="mt-0.5 shrink-0 text-ouro-escuro" />
              <div>
                <p className="sr-only">Horário</p>
                <p>
                  Segunda a sexta, 08h às 20h
                  <br />
                  Sábado, 08h às 15h30
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <IconePin tamanho={20} className="mt-0.5 shrink-0 text-ouro-escuro" />
              <div>
                <p className="sr-only">Endereço</p>
                <p>
                  {CONFIG.endereco.rua}, {CONFIG.endereco.bairro}
                  <br />
                  {CONFIG.endereco.cidade} - {CONFIG.endereco.uf}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* O "D": barra dourada + curva com a foto da recepção */}
        <div className="lg:col-span-5">
          <div
            className="anim-direita relative mx-auto flex w-full max-w-[420px] items-stretch gap-3 sm:gap-4"
          >
            <span aria-hidden className="anim-barra block w-[14px] shrink-0 origin-bottom bg-ouro sm:w-[18px]" />
            <div className="relative flex-1">
              <div aria-hidden className="absolute -inset-3 rounded-r-[999px] border border-vinho/25" />
              {foto ? (
                <figure className="relative">
                  <div className="overflow-hidden rounded-r-[999px] bg-areia">
                    <Foto
                      src={foto.src}
                      alt={foto.alt}
                      largura={foto.largura}
                      altura={foto.altura}
                      prioridade
                      className="aspect-[3/4] h-full w-full object-cover"
                    />
                  </div>
                  <figcaption className="rotulo absolute bottom-5 left-0 bg-creme px-3 py-1.5 text-[0.64rem] text-vinho">
                    {foto.legenda} · {CONFIG.endereco.rua}
                  </figcaption>
                </figure>
              ) : (
                <div className="aspect-[3/4] rounded-r-[999px] bg-vinho" />
              )}
            </div>
          </div>
        </div>
      </div>

      <Marquee />
    </section>
  )
}


function Marquee() {
  const ref = useRef<HTMLDivElement>(null)
  const [pausado, setPausado] = useState(true)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setPausado(!e.isIntersecting))
    io.observe(el)
    return () => io.disconnect()
  }, [])
  const itens = CONFIG.atendimentos.map((a) => a.nome)
  if (!itens.length) return null
  const grupo = (oculto: boolean) => (
    <ul aria-hidden={oculto || undefined} className="flex shrink-0 items-center">
      {itens.map((n) => (
        <li key={n} className="flex items-center whitespace-nowrap px-6 font-serif text-xl italic text-ouro-claro md:text-2xl">
          {n}
          <span aria-hidden className="ml-12 inline-block size-1.5 rotate-45 bg-ouro" />
        </li>
      ))}
    </ul>
  )
  return (
    <div ref={ref} className="marquee overflow-hidden bg-vinho py-5" data-pausado={pausado}>
      <p className="sr-only">Atendimentos: {itens.join(', ')}.</p>
      <div className="marquee-faixa flex w-max" aria-hidden>
        {grupo(true)}
        {grupo(true)}
      </div>
    </div>
  )
}
