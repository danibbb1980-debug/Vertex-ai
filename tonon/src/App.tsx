import { useEffect, useState, type ReactNode } from 'react'
import { LazyMotion, MotionConfig, domAnimation, m } from 'motion/react'
import { CONFIG, waArea, waLink } from './config'
import { TextReveal } from './components/TextReveal'
import { IconArrow, IconClock, IconInstagram, IconPin, IconWhatsApp } from './components/Icons'

const ext = { target: '_blank', rel: 'noopener noreferrer' } as const

/** Tons da escala de cor, do mais claro ao mais quente. */
const TONS = ['#F7F2E8', '#F1E8D6', '#EBDEC5', '#E4D3B4', '#DDC8A4', '#D3BA92']

/** Elemento autoral: escala de cor. Cada amostra sobe e mostra o código. */
function Escala({ tamanho = 'md' }: { tamanho?: 'sm' | 'md' }) {
  const h = tamanho === 'sm' ? 'h-14 w-6 sm:h-16 sm:w-7' : 'h-24 w-9 sm:h-28 sm:w-11'
  return (
    <div className="flex items-end gap-1.5 sm:gap-2" aria-hidden="true">
      {TONS.map((cor, i) => (
        <div key={cor} className="amostra flex flex-col items-center gap-1.5">
          <span
            className={`${h} block rounded-t-[5px] rounded-b-[45%] border border-black/5`}
            style={{ background: `linear-gradient(180deg, ${cor} 0%, ${cor} 55%, color-mix(in srgb, ${cor} 82%, #8a7350) 100%)` }}
          />
          <span className="codigo font-sans text-[10px] tracking-wider text-grafite tabular-nums">{String(i + 1).padStart(2, '0')}</span>
        </div>
      ))}
    </div>
  )
}

/** Revelação ao rolar (uma vez). Com redução de movimento: só opacidade. */
function Revela({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <m.div
      className={className}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 0.7, ease: [0.2, 0.7, 0.15, 1] }}
    >
      {children}
    </m.div>
  )
}

function Rascunho() {
  if (!CONFIG.rascunho) return null
  return (
    <div className="sticky top-0 z-50 border-b border-filete bg-pedra/95 backdrop-blur">
      <p className="wrap py-1.5 text-center text-[11px] leading-snug text-grafite/80 sm:text-[12px]">
        Rascunho para avaliação. Informações sujeitas a confirmação.
      </p>
    </div>
  )
}

function Header() {
  return (
    <header className="wrap flex items-center justify-between py-4 sm:py-5">
      <a href="#topo" className="flex items-center gap-3 rounded-md">
        <span className="font-display text-[30px] leading-none tracking-tight sm:text-[34px]">Tonon</span>
        <span className="rotulo mt-1 border-l border-filete pl-3 text-texto">Laboratório</span>
      </a>
      <nav className="flex items-center gap-7" aria-label="Principal">
        <a href="#trabalho" className="hidden text-[14px] text-texto hover:text-grafite md:inline">Trabalho</a>
        <a href="#sobre" className="hidden text-[14px] text-texto hover:text-grafite md:inline">Sobre</a>
        <a href="#contato" className="hidden text-[14px] text-texto hover:text-grafite md:inline">Contato</a>
        <a href={waLink()} {...ext} className="btn-principal min-h-11 px-4 text-[14px] sm:px-5">
          <IconWhatsApp />
          <span className="sm:hidden">Agendar</span>
          <span className="hidden sm:inline">Agendar avaliação</span>
        </a>
      </nav>
    </header>
  )
}

function Hero() {
  return (
    <section id="topo" className="wrap grid gap-10 pt-6 pb-16 sm:pt-12 md:grid-cols-12 md:gap-12 md:pb-24">
      <div className="md:col-span-6 md:pt-6">
        <p className="rotulo text-petroleo">Reabilitação oral · {CONFIG.cidade}</p>
        <TextReveal
          text="Um sorriso planejado *peça por peça.*"
          className="mt-5 text-[50px] leading-[0.98] sm:text-[72px] lg:text-[88px]"
        />
        <p className="mt-6 max-w-[36ch] text-[17px] leading-relaxed text-texto">
          Reabilitação oral e estética, com planejamento individual e atenção a cada detalhe.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
          <a id="cta-hero" href={waLink()} {...ext} className="btn-principal">
            <IconWhatsApp />
            Agendar avaliação
          </a>
          <a href={CONFIG.maps} {...ext} className="inline-flex items-center gap-1.5 text-[15px] font-medium underline decoration-filete underline-offset-[6px] hover:decoration-grafite">
            Como chegar
            <IconArrow />
          </a>
        </div>
        <ul className="mt-8 flex flex-col gap-1.5 text-[14px] text-texto sm:flex-row sm:gap-6">
          <li className="flex items-center gap-2">
            <IconPin className="size-4 shrink-0 text-petroleo" />
            {CONFIG.endereco.bairro}
          </li>
          <li className="flex items-center gap-2">
            <IconClock className="size-4 shrink-0 text-petroleo" />
            {CONFIG.horarioCurto}
          </li>
        </ul>
      </div>

      <div className="relative md:col-span-6">
        <figure className="relative aspect-[4/3] overflow-hidden rounded-[14px] bg-pedra md:aspect-auto md:h-full md:min-h-[410px]">
          <img
            src={CONFIG.fotos.laboratorio}
            alt="Bancadas do Laboratório Tonon"
            width={496}
            height={297}
            fetchPriority="high"
            className="absolute inset-0 size-full object-cover"
          />
        </figure>
        <div className="absolute -bottom-6 left-4 rounded-[12px] border border-filete bg-porcelana/95 px-4 pt-4 pb-3 shadow-[0_20px_40px_-24px_rgba(22,21,20,.35)] backdrop-blur sm:left-6 sm:px-5 sm:pt-5">
          <Escala tamanho="sm" />
          <p className="rotulo mt-2 text-[10px] text-texto">Escala de cor</p>
        </div>
      </div>
    </section>
  )
}

function Trabalho() {
  return (
    <section id="trabalho" aria-labelledby="trabalho-titulo" className="border-t border-filete">
      <Revela className="wrap grid gap-8 py-14 md:grid-cols-12 md:gap-10 md:py-20">
        <div className="md:col-span-5">
          <p className="rotulo text-texto">01 · O trabalho</p>
          <h2 id="trabalho-titulo" className="mt-4 text-[40px] leading-[1.02] sm:text-[56px]">
            Cada caso começa pelo <em className="text-petroleo">tom</em> certo.
          </h2>
          <p className="mt-5 max-w-[38ch] text-[16px] leading-relaxed text-texto">
            Forma, proporção e cor são estudadas antes de qualquer peça ficar pronta.
          </p>
        </div>
        <div className="md:col-span-7 md:pt-2">
          <ul className="grid gap-px overflow-hidden rounded-[14px] border border-filete bg-filete sm:grid-cols-2">
            {CONFIG.areas.map((a, i) => (
              <li key={a.nome} className="bg-porcelana">
                <a
                  href={waArea(a.nome)}
                  {...ext}
                  aria-label={`${a.nome}: agendar avaliação pelo WhatsApp`}
                  className="group flex h-full flex-col p-5 transition-colors duration-300 hover:bg-white sm:p-8"
                >
                  <span className="flex items-center justify-between text-[12px] tracking-wider text-petroleo tabular-nums">
                    {String(i + 1).padStart(2, '0')}
                    <IconArrow className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                  <h3 className="mt-4 text-[28px] leading-tight sm:mt-8 sm:text-[34px]">{a.nome}</h3>
                  <p className="mt-2 text-[15px] text-texto">{a.linha}</p>
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-5 text-[13.5px] text-texto">A indicação de cada tratamento depende de avaliação individual.</p>
        </div>
      </Revela>
    </section>
  )
}

function Casos() {
  if (!CONFIG.mostrarCasos) return null
  return (
    <section aria-labelledby="casos-titulo" className="bg-grafite text-porcelana">
      <Revela className="wrap py-14 md:py-20">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="rotulo text-porcelana/70">02 · Casos</p>
            <h2 id="casos-titulo" className="mt-4 text-[40px] leading-[1.02] sm:text-[56px]">
              Detalhe que <em className="text-claro">aparece</em> no sorriso.
            </h2>
          </div>
          <p className="max-w-[34ch] text-[13.5px] text-porcelana/70">
            Casos atendidos. Cada caso tem indicação própria.
          </p>
        </div>
        {/* CONFIRMAR COM O CLIENTE: TCLE dos pacientes e CRO do responsável (CFO 196/2019) */}
        <ul className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {CONFIG.casos.map((c) => (
            <li
              key={c.src}
              className={`relative overflow-hidden rounded-[12px] bg-white/5 ${c.orientacao === 'horizontal' ? 'col-span-2 aspect-[16/9] md:aspect-auto' : 'aspect-[4/5] md:aspect-[5/6]'}`}
            >
              <img src={c.src} alt={c.alt} width={c.w} height={c.h} loading="lazy" className="absolute inset-0 size-full object-cover" />
              <span className="rotulo absolute top-3 left-3 rounded-full bg-grafite/75 px-2.5 py-1 text-[10px] text-porcelana backdrop-blur">
                {c.rotulo}
              </span>
            </li>
          ))}
        </ul>
      </Revela>
    </section>
  )
}

function Sobre() {
  const n = CONFIG.mostrarCasos ? '03' : '02'
  return (
    <section id="sobre" aria-labelledby="sobre-titulo">
      <Revela className="wrap grid gap-8 py-14 md:grid-cols-12 md:gap-12 md:py-20">
        <figure className="relative w-full max-w-[220px] md:col-span-4 md:max-w-none">
          <div className="aspect-[4/5] overflow-hidden rounded-[14px] bg-pedra">
            <img
              src={CONFIG.fotos.retrato}
              alt={`${CONFIG.responsavel} no laboratório`}
              width={202}
              height={360}
              loading="lazy"
              className="size-full object-cover object-[50%_20%]"
            />
          </div>
        </figure>
        <div className="md:col-span-8 md:pt-4">
          <p className="rotulo text-texto">{n} · Sobre</p>
          <h2 id="sobre-titulo" className="mt-4 text-[44px] leading-none sm:text-[64px]">
            Matheus <em className="text-petroleo">Tonon</em>
          </h2>
          <p className="mt-3 text-[14px] text-texto">
            {CONFIG.funcao}
            {/* CONFIRMAR COM O CLIENTE: número do registro */}
            <span className="mx-2 text-filete">|</span>
            {CONFIG.registro}
          </p>
          <p className="mt-6 max-w-[46ch] font-display text-[24px] leading-snug sm:text-[28px]">
            “Gosto de entender cada caso antes de propor qualquer coisa. Do tom ao encaixe, tudo é conferido com calma.”
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href={waLink()} {...ext} className="btn-principal">
              <IconWhatsApp />
              Conversar com o Matheus
            </a>
            <a href={CONFIG.instagram} {...ext} className="btn-linha text-grafite hover:bg-pedra">
              <IconInstagram />
              {CONFIG.instagramArroba}
            </a>
          </div>

          <ul className="mt-8 grid grid-cols-3 gap-2 sm:gap-3" aria-label="Fotos do laboratório">
            {CONFIG.fotos.galeria.map((f) => (
              <li key={f.src} className="aspect-[3/4] overflow-hidden md:aspect-square rounded-[10px] bg-pedra">
                <img src={f.src} alt={f.alt} width={f.w} height={f.h} loading="lazy" className="size-full object-cover" />
              </li>
            ))}
          </ul>
        </div>
      </Revela>
    </section>
  )
}

function Contato() {
  const mapa = `https://www.google.com/maps?q=${encodeURIComponent(`${CONFIG.endereco.rua}, ${CONFIG.cidade} - ${CONFIG.uf}, ${CONFIG.endereco.cep}`)}&output=embed`
  return (
    <section id="contato" aria-labelledby="contato-titulo" className="bg-grafite text-porcelana">
      <div className="wrap grid gap-12 py-14 md:grid-cols-12 md:py-20">
        <div className="md:col-span-6">
          <p className="rotulo text-porcelana/70">Contato</p>
          <h2 id="contato-titulo" className="mt-4 text-[44px] leading-[1.02] sm:text-[64px]">
            Agende sua <em className="text-claro">avaliação.</em>
          </h2>
          <p className="mt-5 max-w-[36ch] text-[15px] text-porcelana/75">O clique abre uma conversa. O horário é combinado com você.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href={waLink()} {...ext} className="btn bg-porcelana text-grafite hover:bg-white">
              <IconWhatsApp />
              Agendar pelo WhatsApp
            </a>
            <a href={CONFIG.maps} {...ext} className="btn-linha text-porcelana hover:bg-white/10">
              <IconPin />
              Como chegar
            </a>
          </div>
          <ol className="mt-10 grid gap-4 border-t border-white/10 pt-6 sm:grid-cols-3" aria-label="Como funciona">
            {CONFIG.passos.map((p, i) => (
              <li key={p.titulo} className="flex gap-3 sm:block">
                <span className="font-display text-[30px] leading-none text-claro italic">{i + 1}</span>
                <p className="text-[14px] leading-snug text-porcelana/75 sm:mt-2">
                  <strong className="font-medium text-porcelana">{p.titulo}.</strong> {p.linha}
                </p>
              </li>
            ))}
          </ol>
          <dl className="mt-10 grid gap-8 text-[15px] sm:grid-cols-2">
            <div>
              <dt className="rotulo text-porcelana/70">Endereço</dt>
              <dd className="mt-2 leading-relaxed">
                {CONFIG.endereco.rua}
                <br />
                {CONFIG.endereco.bairro}
                <br />
                {CONFIG.cidade} - {CONFIG.uf}, {CONFIG.endereco.cep}
              </dd>
            </div>
            <div>
              <dt className="rotulo text-porcelana/70">Horários</dt>
              <dd className="mt-2 space-y-0.5">
                {CONFIG.horarios.map((h) => (
                  <p key={h.dias} className="flex justify-between gap-4 sm:block">
                    <span className="text-porcelana/75">{h.dias}</span> <span className="tabular-nums">{h.horas}</span>
                  </p>
                ))}
                <p className="pt-3">
                  <a href={`tel:+${CONFIG.whatsapp}`} className="underline decoration-porcelana/30 underline-offset-4 hover:decoration-porcelana">
                    {CONFIG.telefoneExibicao}
                  </a>
                </p>
              </dd>
            </div>
          </dl>
          <ul className="mt-8 flex flex-wrap gap-2" aria-label="O espaço">
            {CONFIG.espaco.map((item) => (
              <li key={item} className="rounded-full border border-white/15 px-3 py-1.5 text-[13px] text-porcelana/85">
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="hidden md:col-span-6 md:block">
          <div className="h-full min-h-[400px] overflow-hidden rounded-[14px] bg-white/5">
            <iframe
              title={`Mapa: ${CONFIG.marca}`}
              src={mapa}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="size-full border-0 grayscale-[.85] contrast-[1.05]"
            />
          </div>
        </div>
      </div>

      <footer className="border-t border-white/10">
        <div className="wrap flex flex-col gap-3 py-7 text-[12px] leading-relaxed text-porcelana/70 md:flex-row md:items-center md:justify-between">
          <p className="font-display text-[22px] text-porcelana">Tonon</p>
          <p>
            © {new Date().getFullYear()} {CONFIG.marca} · Responsável técnico: {CONFIG.responsavelTecnico} · Conteúdo informativo ·{' '}
            <a href="/privacidade.html" className="underline underline-offset-4 hover:text-porcelana">
              Privacidade
            </a>
          </p>
        </div>
      </footer>
    </section>
  )
}

function WhatsAppFixo() {
  // A barra só aparece depois que o botão do hero sai da tela.
  const [visivel, setVisivel] = useState(false)
  useEffect(() => {
    const alvo = document.getElementById('cta-hero')
    if (!alvo || !('IntersectionObserver' in window)) return setVisivel(true)
    const io = new IntersectionObserver(([e]) => setVisivel(!e.isIntersecting && e.boundingClientRect.top < 0))
    io.observe(alvo)
    return () => io.disconnect()
  }, [])
  return (
    <>
      <div
        className={`fixed inset-x-0 bottom-0 z-40 border-t border-filete bg-porcelana/95 px-4 pt-2.5 pb-[max(10px,env(safe-area-inset-bottom))] backdrop-blur transition-transform duration-300 motion-reduce:transition-none md:hidden ${visivel ? 'translate-y-0' : 'pointer-events-none translate-y-full'}`}
        aria-hidden={!visivel}
      >
        <a href={waLink()} {...ext} tabIndex={visivel ? 0 : -1} className="btn-principal w-full">
          <IconWhatsApp />
          Agendar avaliação
        </a>
      </div>
      <a
        href={waLink()}
        {...ext}
        aria-label="Agendar avaliação pelo WhatsApp"
        className="fixed right-6 bottom-6 z-40 hidden size-14 place-items-center rounded-full bg-petroleo text-porcelana shadow-[0_8px_24px_-8px_rgba(22,21,20,.5)] transition-colors hover:bg-petroleo-escuro md:grid"
      >
        <IconWhatsApp className="size-6" />
      </a>
    </>
  )
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation} strict>
        <a href="#conteudo" className="sr-only focus:not-sr-only focus:fixed focus:top-12 focus:left-4 focus:z-[60] focus:rounded-full focus:bg-grafite focus:px-4 focus:py-2 focus:text-porcelana">
          Pular para o conteúdo
        </a>
        <Rascunho />
        <Header />
        <main id="conteudo" className="pb-[76px] md:pb-0">
          <Hero />
          <Trabalho />
          <Casos />
          <Sobre />
          <Contato />
        </main>
        <WhatsAppFixo />
      </LazyMotion>
    </MotionConfig>
  )
}
