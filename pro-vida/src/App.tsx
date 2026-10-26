import { useEffect, useState } from 'react'
import { LazyMotion, MotionConfig, domAnimation, m } from 'motion/react'
import { CONFIG, waArea, waLink } from './config'
import { TextReveal } from './components/TextReveal'
import { IconArrow, IconClock, IconInstagram, IconPin, IconWhatsApp } from './components/Icons'

const ext = { target: '_blank', rel: 'noopener noreferrer' } as const

function Rascunho() {
  if (!CONFIG.rascunho) return null
  return (
    <div className="sticky top-0 z-50 border-b border-filete bg-nevoa/95 backdrop-blur">
      <p className="wrap py-1.5 text-center text-[11px] leading-snug text-tinta/80 sm:text-[12px]">
        Rascunho para avaliação. Informações sujeitas a confirmação.
      </p>
    </div>
  )
}

function Header() {
  return (
    <header className="wrap flex items-center justify-between py-3 sm:py-4">
      <a href="#topo" className="-ml-1 block rounded-md" aria-label={`${CONFIG.nome}, início`}>
        <img
          src={CONFIG.logo}
          alt={CONFIG.nome}
          width={142}
          height={98}
          className="h-[50px] w-auto mix-blend-multiply sm:h-[60px]"
        />
      </a>
      <div className="flex items-center gap-5">
        <a href="#contato" className="hidden text-[14px] font-medium text-tinta/80 hover:text-tinta sm:inline">
          Contato
        </a>
        <a href={waLink()} {...ext} className="btn-principal min-h-11 px-4 text-[14px] sm:px-5">
          <IconWhatsApp />
          <span className="sm:hidden">Agendar</span>
          <span className="hidden sm:inline">Agendar pelo WhatsApp</span>
        </a>
      </div>
    </header>
  )
}

function FotoFachada() {
  return (
    <figure className="relative h-full overflow-hidden rounded-[20px] bg-nevoa">
      <img
        src={CONFIG.fotoFachada}
        alt={`Fachada do ${CONFIG.nome}, em ${CONFIG.cidade}`}
        width={294}
        height={297}
        fetchPriority="high"
        className="absolute inset-0 size-full object-cover object-[35%_45%]"
      />
    </figure>
  )
}

function Hero() {
  return (
    <section id="topo" className="wrap grid gap-8 pt-4 pb-14 sm:pt-10 md:grid-cols-12 md:items-stretch md:gap-10 md:pb-24">
      <div className="md:col-span-7 md:py-6">
        <p className="rotulo text-cobalto">
          {CONFIG.cidade} · {CONFIG.uf}
        </p>
        <TextReveal
          text="Atendimento médico e odontológico *reunido* em um só endereço."
          className="mt-4 text-[38px] leading-[1.06] sm:text-[52px] lg:text-[62px]"
        />
        <p className="mt-5 max-w-[34ch] text-[17px] text-texto">Marque sua consulta pelo WhatsApp, de forma simples.</p>
        <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
          <a id="cta-hero" href={waLink()} {...ext} className="btn-principal self-start">
            <IconWhatsApp />
            Agendar pelo WhatsApp
          </a>
        </div>
        <ul className="mt-6 space-y-1.5 text-[14px] text-texto">
          <li className="flex items-center gap-2">
            <IconPin className="size-4 shrink-0 text-cobalto" />
            {CONFIG.endereco.rua} · {CONFIG.endereco.bairro}
          </li>
          <li className="flex items-center gap-2">
            <IconClock className="size-4 shrink-0 text-cobalto" />
            {CONFIG.horarioCurto}
          </li>
        </ul>
      </div>
      <div className="h-44 sm:h-64 md:col-span-5 md:h-auto md:min-h-[440px]">
        <FotoFachada />
      </div>
    </section>
  )
}

function Areas() {
  return (
    <section aria-labelledby="areas-titulo" className="border-t border-filete">
      <div className="wrap py-14 md:py-20">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="rotulo text-tinta/75">01 · Áreas de atendimento</p>
            <h2 id="areas-titulo" className="mt-3 text-[30px] leading-tight sm:text-[40px]">
              Escolha a <em>área</em> e fale com a recepção.
            </h2>
          </div>
        </div>

        {/* reducedMotion="user": com redução de movimento, sem deslocamento (só opacidade) */}
        <MotionConfig reducedMotion="user">
        <LazyMotion features={domAnimation} strict>
          <ul className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-[18px] border border-filete bg-filete md:grid-cols-3">
            {CONFIG.areas.map((a, i) => (
              <m.li
                key={a.nome}
                className="bg-gelo"
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '0px 0px -10% 0px' }}
                transition={{ duration: 0.55, delay: (i % 3) * 0.07 + Math.floor(i / 3) * 0.1, ease: [0.2, 0.7, 0.15, 1] }}
              >
                <a
                  href={waArea(a.nome)}
                  {...ext}
                  className="group relative flex h-full flex-col p-4 transition-colors duration-300 hover:bg-white focus-visible:bg-white sm:p-6"
                  aria-label={`${a.nome}: agendar pelo WhatsApp`}
                >
                  <span className="flex items-center justify-between font-display text-[13px] text-cobalto tabular-nums">
                    {String(i + 1).padStart(2, '0')}
                    <IconArrow className="size-4 -translate-x-1 translate-y-1 opacity-0 transition-all duration-300 group-hover:translate-0 group-hover:opacity-100 group-focus-visible:translate-0 group-focus-visible:opacity-100" />
                  </span>
                  <h3 className="mt-3 text-[19px] leading-snug sm:text-[23px]">{a.nome}</h3>
                  <p className="mt-1.5 text-[13.5px] leading-snug text-texto sm:text-[14.5px]">{a.linha}</p>
                  <span className="absolute bottom-0 left-4 h-px w-0 bg-cobalto transition-all duration-500 group-hover:w-[calc(100%-2rem)] sm:left-6 sm:group-hover:w-[calc(100%-3rem)]" />
                </a>
              </m.li>
            ))}
          </ul>
        </LazyMotion>
        </MotionConfig>

        <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[13.5px] text-texto">A indicação de cada atendimento depende de avaliação individual.</p>
          <a href={waLink()} {...ext} className="btn-linha self-start text-cobalto hover:bg-nevoa sm:self-auto">
            Agendar consulta
            <IconArrow />
          </a>
        </div>
      </div>
    </section>
  )
}

const iniciais = (nome: string) =>
  nome
    .replace(/^Dra?\.\s*/, '')
    .split(' ')
    .filter((p) => p.length > 2)
    .map((p) => p[0])
    .filter((_, i, arr) => i === 0 || i === arr.length - 1)
    .join('')

function Instituto() {
  return (
    <section aria-labelledby="inst-titulo" className="bg-nevoa/60">
      <div className="wrap grid gap-8 py-14 md:grid-cols-12 md:gap-10 md:py-20">
        <div className="md:col-span-5">
          <p className="rotulo text-tinta/75">02 · Profissionais</p>
          <h2 id="inst-titulo" className="mt-3 text-[30px] leading-tight sm:text-[40px]">
            Várias áreas, <em>um</em> endereço.
          </h2>
          <p className="mt-4 max-w-[38ch] text-[15.5px] text-texto">
            O Instituto reúne áreas médicas e odontologia. Tudo na mesma clínica, no {CONFIG.endereco.bairro}.
          </p>
        </div>
        <ul className="grid gap-3 md:col-span-7 md:grid-cols-2 md:self-end">
          {CONFIG.profissionais.map((p) => (
            <li key={p.nome} className="flex items-center gap-4 rounded-[16px] border border-filete bg-gelo p-4">
              {p.foto ? (
                <img src={p.foto} alt={`Foto de ${p.nome}`} width={64} height={64} loading="lazy" className="size-16 shrink-0 rounded-full object-cover" />
              ) : (
                <span aria-hidden="true" className="grid size-16 shrink-0 place-items-center rounded-full border border-cobalto/40 font-display text-[20px] text-cobalto italic">
                  {iniciais(p.nome)}
                </span>
              )}
              <div className="min-w-0">
                <h3 className="font-sans text-[15.5px] leading-snug font-medium tracking-normal">{p.nome}</h3>
                <p className="text-[14px] text-texto">{p.area}</p>
                {/* CONFIRMAR COM A CLÍNICA: número de registro */}
                <p className="mt-1 text-[12px] font-medium tracking-wide text-tinta/75">{p.registro}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function Contato() {
  return (
    <section id="contato" aria-labelledby="contato-titulo" className="bg-tinta text-gelo">
      <div className="wrap grid gap-10 py-14 md:grid-cols-12 md:py-20">
        <div className="md:col-span-6">
          <p className="rotulo text-[#9DBBF0]">03 · Contato</p>
          <h2 id="contato-titulo" className="mt-3 text-[30px] leading-tight sm:text-[44px]">
            Agende sua <em className="text-[#9DBBF0]">consulta</em>.
          </h2>
          <p className="mt-4 max-w-[36ch] text-[15px] text-gelo/75">O clique abre uma conversa. A equipe confirma o horário.</p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <a href={waLink()} {...ext} className="btn bg-gelo text-tinta hover:bg-white">
              <IconWhatsApp />
              Agendar pelo WhatsApp
            </a>
            <a href={CONFIG.maps} {...ext} className="btn-linha text-gelo hover:bg-white/10">
              <IconPin />
              Como chegar
            </a>
          </div>
        </div>

        <dl className="grid gap-6 text-[15px] sm:grid-cols-2 md:col-span-6 md:pt-8">
          <div>
            <dt className="rotulo text-gelo/70">Endereço</dt>
            <dd className="mt-2 leading-relaxed">
              {CONFIG.endereco.rua}
              <br />
              {CONFIG.endereco.bairro}, {CONFIG.cidade} - {CONFIG.uf}
              <br />
              CEP {CONFIG.endereco.cep}
            </dd>
          </div>
          <div>
            <dt className="rotulo text-gelo/70">Horários</dt>
            <dd className="mt-2">
              <ul className="space-y-0.5">
                {CONFIG.horarios.map((h) => (
                  <li key={h.dias} className="flex justify-between gap-4 sm:block">
                    <span className="text-gelo/75">{h.dias}</span> <span className="tabular-nums">{h.horas}</span>
                  </li>
                ))}
              </ul>
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="sr-only">Telefone e Instagram</dt>
            <dd className="flex flex-wrap gap-x-6 gap-y-2">
              <a href={`tel:+${CONFIG.whatsapp}`} className="underline decoration-gelo/30 underline-offset-4 hover:decoration-gelo">
                {CONFIG.telefoneExibicao}
              </a>
              <a href={CONFIG.instagram} {...ext} className="inline-flex items-center gap-2 underline decoration-gelo/30 underline-offset-4 hover:decoration-gelo">
                <IconInstagram />
                {CONFIG.instagramArroba}
              </a>
              {CONFIG.mostrarNotaGoogle && (
                <a href={CONFIG.maps} {...ext} className="underline decoration-gelo/30 underline-offset-4 hover:decoration-gelo">
                  Google: {CONFIG.notaGoogle.nota} ({CONFIG.notaGoogle.total})
                </a>
              )}
            </dd>
          </div>
        </dl>
      </div>

      <footer className="border-t border-white/10">
        <div className="wrap flex flex-col gap-2 py-6 text-[12px] leading-relaxed text-gelo/70 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {CONFIG.nome} · Diretor técnico: {CONFIG.diretorTecnico} · Responsável técnico odontológico:{' '}
            {CONFIG.responsavelOdonto}
          </p>
          <p className="flex gap-4">
            <span>Conteúdo informativo.</span>
            <a href="/privacidade.html" className="underline underline-offset-4 hover:text-gelo">
              Privacidade
            </a>
          </p>
        </div>
      </footer>
    </section>
  )
}

/** Celular: barra fixa. Desktop: botão flutuante discreto. */
function WhatsAppFixo() {
  // A barra só aparece depois que o botão do hero sai da tela (evita botões repetidos).
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
        className={`fixed inset-x-0 bottom-0 z-40 border-t border-filete bg-gelo/95 px-4 pt-2.5 pb-[max(10px,env(safe-area-inset-bottom))] backdrop-blur transition-transform duration-300 motion-reduce:transition-none md:hidden ${visivel ? 'translate-y-0' : 'pointer-events-none translate-y-full'}`}
        aria-hidden={!visivel}
      >
        <a href={waLink()} {...ext} tabIndex={visivel ? 0 : -1} className="btn-principal w-full">
          <IconWhatsApp />
          Agendar pelo WhatsApp
        </a>
      </div>
      <a
        href={waLink()}
        {...ext}
        aria-label="Agendar pelo WhatsApp"
        className="fixed right-6 bottom-6 z-40 hidden size-14 place-items-center rounded-full bg-cobalto text-white shadow-[0_6px_20px_-6px_rgba(15,42,74,.45)] transition-colors hover:bg-cobalto-escuro md:grid"
      >
        <IconWhatsApp className="size-6" />
      </a>
    </>
  )
}

export default function App() {
  return (
    <>
      <a href="#conteudo" className="sr-only focus:not-sr-only focus:fixed focus:top-12 focus:left-4 focus:z-[60] focus:rounded-full focus:bg-tinta focus:px-4 focus:py-2 focus:text-gelo">
        Pular para o conteúdo
      </a>
      <Rascunho />
      <Header />
      <main id="conteudo" className="pb-[76px] md:pb-0">
        <Hero />
        <Areas />
        <Instituto />
        <Contato />
      </main>
      <WhatsAppFixo />
    </>
  )
}
