import { useEffect, useId, useRef, useState } from 'react'
import { AnimatePresence, m, useInView, useReducedMotion } from 'motion/react'
import { CONFIG, enderecoLinha, waLink } from '../config'
import { BotaoLink, Revelar, TituloSecao } from './ui'
import { Logo } from './Topo'
import { IconeInstagram, IconeMais, IconePin, IconeRelogio, IconeSetaDiagonal, IconeWhatsApp } from './Icones'

/* ---------------- Dúvidas ---------------- */

const horasSabado = CONFIG.horarios.find((h) => h.dias.includes(6))

const PERGUNTAS: { p: string; r: string }[] = [
  {
    p: 'Preciso agendar antes de ir?',
    r: 'Sim, é recomendado marcar hora. Assim a clínica reserva o seu horário. O agendamento pode ser pedido pelo WhatsApp ou pelo formulário deste site.',
  },
  {
    p: 'Como é a primeira avaliação?',
    r: 'O profissional conversa sobre o que você sente e o que procura, conhece seu histórico de saúde e examina a boca. Se for preciso, pode pedir exames complementares. Depois, explica as opções possíveis para o seu caso.',
  },
  {
    p: 'Quais atendimentos a clínica oferece?',
    r: `${CONFIG.atendimentos.map((a) => a.nome).join(', ')}. A indicação de cada tratamento depende de avaliação individual.`,
  },
  {
    p: 'A clínica atende crianças?',
    r: 'Sim. A clínica oferece atendimento em odontopediatria, voltado a bebês, crianças e adolescentes, com orientações para a família.',
  },
  {
    p: 'Quais são os horários? Abre aos sábados?',
    r: `De segunda a sexta, das 08h às 20h. Aos sábados, das 08h às ${horasSabado ? horasSabado.fecha.replace(':', 'h') : '15h30'}. Aos domingos a clínica não abre. ${CONFIG.avisoHorario}`,
  },
  {
    p: 'Onde fica a clínica?',
    r: `${enderecoLinha()}. No fim da página há o link para abrir a rota no Google Maps.`,
  },
  {
    p: 'A clínica tem acessibilidade?',
    r: 'Sim. A entrada, o assento e o banheiro são acessíveis para cadeirantes.',
  },
  {
    p: 'Quais formas de pagamento são aceitas?',
    r: 'Cartão de crédito, cartão de débito e pagamento por aproximação (NFC). Para outras dúvidas sobre pagamento, fale com a clínica pelo WhatsApp.',
  },
  {
    p: 'O que levar na primeira consulta?',
    r: 'De forma geral, vale levar um documento com foto, a lista dos medicamentos que você usa e exames ou radiografias recentes, se tiver. Para crianças, é importante a presença de um responsável.',
  },
]

function ItemFaq({ p, r, aberto, alternar }: { p: string; r: string; aberto: boolean; alternar: () => void }) {
  const id = useId()
  const reduzir = useReducedMotion()
  return (
    <li className="border-b border-linha">
      <h3 className="font-sans text-base">
        <button
          type="button"
          id={`${id}-b`}
          aria-expanded={aberto}
          aria-controls={`${id}-p`}
          onClick={alternar}
          className="group flex min-h-16 w-full items-center justify-between gap-6 py-5 text-left font-serif text-[1.3rem] leading-snug text-vinho-900 md:text-[1.45rem]"
        >
          {p}
          <span
            aria-hidden
            className={`inline-flex size-10 shrink-0 items-center justify-center rounded-full border transition-[transform,background-color,border-color,color] duration-500 ease-[var(--ease-suave)] ${
              aberto ? 'rotate-45 border-vinho bg-vinho text-creme' : 'border-ouro/60 text-vinho group-hover:border-vinho'
            }`}
          >
            <IconeMais tamanho={18} />
          </span>
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {aberto && (
          <m.div
            id={`${id}-p`}
            role="region"
            aria-labelledby={`${id}-b`}
            initial={reduzir ? false : { opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduzir ? undefined : { opacity: 0, transition: { duration: 0.15 } }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="max-w-2xl pb-7 pr-14 text-[1.05rem] leading-relaxed text-pedra">{r}</p>
          </m.div>
        )}
      </AnimatePresence>
    </li>
  )
}

export function Duvidas() {
  const [aberto, setAberto] = useState<number | null>(0)
  return (
    <section id="duvidas" data-secao="Dúvidas" aria-labelledby="t-duv" className="bg-marfim py-24 md:py-32">
      <div className="container-site grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-36">
            <TituloSecao id="t-duv" rotulo="Dúvidas frequentes" descricao="Não encontrou o que procurava? Pergunte pelo WhatsApp.">
              Antes de <em className="enfase">marcar</em>.
            </TituloSecao>
            <Revelar className="mt-8">
              <BotaoLink href={waLink('Olá! Vi o site da Doctors Odontologia e Saúde e tenho uma dúvida.')} variante="secundario" whatsapp>
                Tirar uma dúvida
              </BotaoLink>
            </Revelar>
          </div>
        </div>
        <ul className="border-t border-linha lg:col-span-7 lg:col-start-6">
          {PERGUNTAS.map((q, i) => (
            <ItemFaq key={q.p} {...q} aberto={aberto === i} alternar={() => setAberto(aberto === i ? null : i)} />
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ---------------- Contato ---------------- */

function Mapa() {
  const [carregar, setCarregar] = useState(false)
  const q = encodeURIComponent(`${CONFIG.nome}, ${enderecoLinha()}`)
  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-linha bg-areia lg:aspect-auto lg:h-full lg:min-h-[420px]">
      {carregar ? (
        <iframe
          title={`Mapa com a localização da ${CONFIG.nome}`}
          src={`https://www.google.com/maps?q=${q}&output=embed`}
          className="absolute inset-0 h-full w-full"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      ) : (
        <div className="absolute inset-0">
          {/* Ilustração de traço: quadras do centro */}
          <svg aria-hidden className="absolute inset-0 h-full w-full text-vinho/15" preserveAspectRatio="xMidYMid slice" viewBox="0 0 400 300" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M-10 70h420M-10 160h420M-10 245h420M70-10v320M175-10v320M290-10v320M-10 300 410 20" />
            <path d="M0 115h400M120 0v300M235 0v300M340 0v300" strokeDasharray="2 5" />
          </svg>
          <div className="absolute left-1/2 top-[44%] -translate-x-1/2 -translate-y-full">
            <span className="flex size-12 items-center justify-center rounded-full rounded-bl-none bg-vinho text-creme shadow-lg [transform:rotate(-45deg)]">
              <span className="[transform:rotate(45deg)]">
                <IconePin tamanho={22} />
              </span>
            </span>
          </div>
          <div className="absolute inset-x-5 bottom-5 flex flex-col gap-3 rounded-xl bg-creme/95 p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-pedra">
              O mapa interativo é do Google e só é carregado se você pedir.
            </p>
            <button
              type="button"
              onClick={() => setCarregar(true)}
              className="min-h-12 shrink-0 rounded-full border border-vinho/30 px-5 text-[0.92rem] font-medium text-vinho-900 transition-colors hover:border-vinho"
            >
              Carregar mapa
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export function Contato() {
  return (
    <section id="contato" data-secao="Contato" aria-labelledby="t-cont" className="py-24 md:py-32">
      <div className="container-site grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <TituloSecao id="t-cont" rotulo="Localização e contato">
            Venha nos <em className="enfase">visitar</em>.
          </TituloSecao>

          <Revelar className="mt-10 space-y-8">
            <div className="flex gap-4">
              <IconePin tamanho={24} className="mt-1 shrink-0 text-ouro-escuro" />
              <div>
                <h3 className="rotulo text-ouro-escuro">Endereço</h3>
                <address className="mt-2 text-lg not-italic text-grafite">
                  {CONFIG.endereco.rua} - {CONFIG.endereco.bairro}
                  <br />
                  {CONFIG.endereco.cidade} - {CONFIG.endereco.uf}, {CONFIG.endereco.cep}
                </address>
                <a
                  href={CONFIG.endereco.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex min-h-12 items-center gap-1.5 font-medium text-vinho underline decoration-ouro/60 underline-offset-[6px] hover:decoration-vinho"
                >
                  Como chegar <IconeSetaDiagonal tamanho={16} />
                </a>
              </div>
            </div>

            <div className="flex gap-4">
              <IconeRelogio tamanho={24} className="mt-1 shrink-0 text-ouro-escuro" />
              <div className="flex-1">
                <h3 className="rotulo text-ouro-escuro">Horários</h3>
                <dl className="mt-2 divide-y divide-linha text-lg">
                  {CONFIG.horarios.map((h) => (
                    <div key={h.rotulo} className="flex justify-between gap-4 py-2">
                      <dt className="text-grafite">{h.rotulo}</dt>
                      <dd className="tabular-nums text-pedra">
                        {h.abre.replace(':', 'h')} às {h.fecha.replace(':', 'h')}
                      </dd>
                    </div>
                  ))}
                  {CONFIG.diasFechados.map((d) => (
                    <div key={d.rotulo} className="flex justify-between gap-4 py-2">
                      <dt className="text-grafite">{d.rotulo}</dt>
                      <dd className="text-pedra">{d.texto}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-2 text-sm italic text-pedra">{CONFIG.avisoHorario}</p>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <BotaoLink href={waLink()} whatsapp>
                WhatsApp {CONFIG.telefoneExibicao}
              </BotaoLink>
              <BotaoLink href={CONFIG.instagram.url} externo variante="secundario">
                <span className="inline-flex items-center gap-2">
                  <IconeInstagram tamanho={18} /> {CONFIG.instagram.usuario}
                </span>
              </BotaoLink>
            </div>
          </Revelar>
        </div>
        <Revelar className="lg:col-span-6 lg:col-start-7">
          <Mapa />
        </Revelar>
      </div>
    </section>
  )
}

/* ---------------- CTA final: a barra dourada fecha o "D" ---------------- */

export function CtaFinal() {
  const ref = useRef<HTMLDivElement>(null)
  const visivel = useInView(ref, { once: true, margin: '0px 0px -20% 0px' })
  const reduzir = useReducedMotion()
  const desenhar = reduzir || visivel

  return (
    <section data-secao="Fim" aria-labelledby="t-cta" className="escuro relative overflow-hidden bg-vinho py-24 text-creme md:py-32">
      <div className="container-site">
        <div ref={ref} className="grid items-center gap-12 md:grid-cols-[auto_1fr] md:gap-16">
          {/* O D completo: barra dourada + curva */}
          <svg viewBox="0 0 160 220" className="mx-auto h-44 w-auto md:h-72" aria-hidden>
            <m.rect
              x="0"
              y="0"
              width="22"
              height="220"
              fill="var(--color-ouro)"
              style={{ transformOrigin: 'top', transformBox: 'fill-box' }}
              initial={reduzir ? false : { scaleY: 0 }}
              animate={desenhar ? { scaleY: 1 } : undefined}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            />
            <m.path
              d="M40 10 H62 C118 10 150 52 150 110 C150 168 118 210 62 210 H40"
              fill="none"
              stroke="var(--color-creme)"
              strokeWidth="14"
              initial={reduzir ? false : { pathLength: 0 }}
              animate={desenhar ? { pathLength: 1 } : undefined}
              transition={{ duration: 1.3, delay: 0.5, ease: [0.65, 0, 0.35, 1] }}
            />
          </svg>
          <div className="text-center md:text-left">
            <p className="rotulo text-ouro">Agende pelo WhatsApp</p>
            <h2 id="t-cta" className="mt-4 text-4xl sm:text-5xl lg:text-6xl">
              Sua avaliação é o primeiro <em className="enfase">passo</em>.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lg text-ouro-claro md:mx-0">
              Conte o que você procura. A equipe conversa com você pelo WhatsApp e combina o horário.
            </p>
            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row md:justify-start">
              <BotaoLink href={waLink()} variante="claro" whatsapp>
                Agendar pelo WhatsApp
              </BotaoLink>
              <BotaoLink href={CONFIG.instagram.url} externo variante="contorno-claro">
                Ver no Instagram
              </BotaoLink>
              {CONFIG.secoes.agendar && (
                <BotaoLink href="#agendar" variante="contorno-claro">
                  Preencher o formulário
                </BotaoLink>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------------- Rodapé ---------------- */

export function Rodape() {
  const rt = CONFIG.responsavelTecnico
  return (
    <footer className="border-t border-linha bg-creme pb-28 pt-16 md:pb-14">
      <div className="container-site grid gap-10 md:grid-cols-12">
        <div className="md:col-span-4">
          <Logo className="h-28 w-auto" />
        </div>
        <div className="text-pedra md:col-span-4">
          <h2 className="rotulo text-ouro-escuro">Endereço</h2>
          <p className="mt-3">{enderecoLinha()}</p>
          <a href={CONFIG.endereco.mapsUrl} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex min-h-12 items-center gap-1.5 text-vinho underline decoration-ouro/60 underline-offset-4">
            Abrir no Google Maps <IconeSetaDiagonal tamanho={14} />
          </a>
        </div>
        <div className="text-pedra md:col-span-4">
          <h2 className="rotulo text-ouro-escuro">Contato</h2>
          <ul className="mt-2">
            <li>
              <a href={waLink()} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-2 hover:text-vinho">
                <IconeWhatsApp tamanho={18} /> WhatsApp {CONFIG.telefoneExibicao}
              </a>
            </li>
            <li>
              <a href={CONFIG.instagram.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-2 hover:text-vinho">
                <IconeInstagram tamanho={18} /> {CONFIG.instagram.usuario}
              </a>
            </li>
            <li>
              <a href="/privacidade.html" className="inline-flex min-h-12 items-center hover:text-vinho">
                Privacidade
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="container-site mt-12 text-sm text-pedra"><div className="border-t border-linha pt-6">
        {rt.nome && rt.cro && (
          <p className="mb-2">
            Responsável técnico: {rt.nome} · CRO {rt.cro}
          </p>
        )}
        <p>Conteúdo informativo; a indicação de cada tratamento depende de avaliação individual.</p>
        <p className="mt-2">© {new Date().getFullYear()} {CONFIG.nome}</p>
      </div></div>
    </footer>
  )
}

/* ---------------- WhatsApp flutuante e barra no celular ---------------- */

export function WhatsAppFixo() {
  const [mostrar, setMostrar] = useState(false)
  useEffect(() => {
    const f = () => setMostrar(window.scrollY > 500)
    f()
    window.addEventListener('scroll', f, { passive: true })
    return () => window.removeEventListener('scroll', f)
  }, [])
  return (
    <>
      <a
        href={waLink()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Agendar avaliação pelo WhatsApp"
        tabIndex={mostrar ? 0 : -1}
        className={`fixed bottom-6 right-6 z-40 hidden size-14 items-center justify-center rounded-full bg-vinho text-creme shadow-[0_12px_30px_-10px_rgba(74,29,34,.6)] ring-1 ring-ouro/40 transition-[opacity,transform] duration-500 hover:bg-vinho-900 md:flex ${
          mostrar ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
        }`}
      >
        <IconeWhatsApp tamanho={26} />
      </a>
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-linha bg-creme/95 px-4 pb-[max(.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur md:hidden">
        <a
          href={waLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-12 items-center justify-center gap-2 rounded-full bg-vinho text-[0.95rem] font-medium text-creme"
        >
          <IconeWhatsApp tamanho={18} /> Agendar avaliação pelo WhatsApp
        </a>
      </div>
    </>
  )
}
