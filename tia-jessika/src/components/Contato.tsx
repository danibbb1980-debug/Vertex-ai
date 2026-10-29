import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { CONFIG, enderecoCompleto } from '../config'
import { linhasHorario } from '../lib/horarios'
import { telLink, waLink } from '../lib/whatsapp'
import { Brilho, CoracaoTraco, Estrela, Onda } from './Decor'
import { IconFone, IconInsta, IconMais, IconPin, IconRelogio, IconSeta, IconWhats } from './Icons'
import { Cabecalho } from './Secoes'
import { Revela } from './TextReveal'

/* ---------------- Dúvidas frequentes ---------------- */

/** Acordeão acessível (inspirado no "Accordion" de ddoemonn, 21st.dev): vários abertos, teclado, altura animada via grid. */
function ItemFaq({ q, children, aberto, onToggle }: { q: string; children: ReactNode; aberto: boolean; onToggle: () => void }) {
  const id = useId()
  return (
    <li className="border-b border-tinta/12 last:border-b-0">
      <h3 className="font-sans text-lg tracking-normal md:text-xl" style={{ fontFamily: 'var(--font-sans)', lineHeight: 1.35 }}>
        <button
          type="button"
          id={`${id}-b`}
          aria-expanded={aberto}
          aria-controls={`${id}-p`}
          onClick={onToggle}
          className="flex min-h-16 w-full items-center justify-between gap-6 py-5 text-left font-extrabold text-tinta transition-colors hover:text-framboesa-600"
        >
          {q}
          <span
            className={`inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-tinta/15 transition-[transform,background-color,color] duration-300 ${
              aberto ? 'rotate-45 bg-framboesa-600 text-white border-framboesa-600' : 'bg-white/70'
            }`}
            aria-hidden="true"
          >
            <IconMais size={18} />
          </span>
        </button>
      </h3>
      <div
        id={`${id}-p`}
        role="region"
        aria-labelledby={`${id}-b`}
        className={`grid transition-[grid-template-rows] duration-400 ease-[var(--ease-suave)] ${aberto ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
        inert={!aberto}
      >
        <div className="overflow-hidden">
          <div className="max-w-3xl pb-6 pr-12 text-tinta-2 [&_p+p]:mt-3">{children}</div>
        </div>
      </div>
    </li>
  )
}

export function Faq() {
  const [abertos, setAbertos] = useState<number[]>([0])
  const toggle = (i: number) => setAbertos((a) => (a.includes(i) ? a.filter((x) => x !== i) : [...a, i]))
  const horas = linhasHorario()
  const itens: { q: string; a: ReactNode }[] = [
    {
      q: 'Com que idade levar a criança ao dentista pela primeira vez?',
      a: (
        <p>
          A recomendação geral é que a primeira visita aconteça cedo, ainda nos primeiros anos de vida, por volta do surgimento dos primeiros
          dentes. Assim a família recebe orientações desde o começo. Na avaliação, a doutora orienta sobre o melhor momento e a frequência
          das visitas para o seu filho.
        </p>
      ),
    },
    {
      q: 'Como funciona a primeira consulta?',
      a: (
        <p>
          Começa com uma conversa sobre a história e a rotina da criança. Ela conhece o espaço e a doutora com calma, a avaliação acontece no
          ritmo dela e, no final, os pais recebem orientações claras sobre o que foi observado e os próximos passos, se houver.
        </p>
      ),
    },
    {
      q: 'Como preparar a criança?',
      a: (
        <p>
          Fale da consulta com naturalidade e de forma verdadeira, sem promessas e sem usar o dentista como ameaça. Escolha um horário em que
          ela esteja descansada e deixe que a doutora explique cada passo. Na seção “Para os pais” há outras dicas.
        </p>
      ),
    },
    {
      q: 'Os pais podem acompanhar?',
      a: (
        <p>
          {CONFIG.paisAcompanham ||
            'A presença da família ajuda a criança a se sentir segura. Ao agendar, a equipe explica como a família participa do atendimento, de acordo com a idade da criança.'}
        </p>
      ),
    },
    {
      q: 'O que é Ortopedia Funcional dos Maxilares?',
      a: (
        <p>
          De forma geral, é a área da odontologia que acompanha o desenvolvimento dos ossos da face e da mordida durante o crescimento,
          considerando funções como respirar, mastigar e engolir. A necessidade de qualquer acompanhamento é avaliada individualmente.
        </p>
      ),
    },
    {
      q: 'A clínica atende bebês e adolescentes?',
      a: <p>Sim. O atendimento é voltado para bebês, crianças e adolescentes, com orientações adequadas a cada fase.</p>,
    },
    {
      q: 'Como agendar?',
      a: (
        <>
          <p>
            Pelo WhatsApp {CONFIG.whatsappExibicao}, pelo telefone {CONFIG.telefoneExibicao} ou pelo formulário de solicitação nesta página,
            que abre o WhatsApp com a sua mensagem pronta. A equipe confirma a disponibilidade.
          </p>
          <p>
            <a href="#agendar" className="font-extrabold text-framboesa-600 underline decoration-2 underline-offset-4">
              Ir para o formulário
            </a>
          </p>
        </>
      ),
    },
    {
      q: 'Onde fica o consultório?',
      a: (
        <p>
          {enderecoCompleto}. A entrada e o banheiro são acessíveis para cadeirantes.{' '}
          <a href={CONFIG.mapsUrl} target="_blank" rel="noopener noreferrer" className="font-extrabold text-framboesa-600 underline decoration-2 underline-offset-4">
            Ver no Google Maps
          </a>
        </p>
      ),
    },
    {
      q: 'Qual é o horário de atendimento?',
      a: (
        <p>
          {horas.map((h) => `${h.dias}: ${h.horas}`).join('. ')}. {CONFIG.observacaoHorario} O atendimento é com hora marcada.
        </p>
      ),
    },
    {
      q: 'Quais formas de pagamento são aceitas?',
      a: <p>{CONFIG.estrutura.pagamento.join(', ').replace(/, ([^,]*)$/, ' e $1')}. Outras informações, a equipe passa pelo WhatsApp.</p>,
    },
  ]
  return (
    <section id="duvidas" aria-labelledby="t-duvidas" className="relative py-20 md:py-28">
      <div className="container-site grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div className="lg:sticky lg:top-36 lg:self-start">
          <Cabecalho
            id="t-duvidas"
            rotulo="dúvidas frequentes"
            titulo={['Perguntas que', { em: 'toda' }, 'família faz.']}
            intro="Respostas gerais, para você chegar mais tranquilo. Cada caso é orientado na avaliação."
          />
          <Estrela className="mt-8 hidden size-12 text-framboesa/60 lg:block" />
        </div>
        <Revela>
          <ul className="cartao px-6 md:px-9">
            {itens.map((it, i) => (
              <ItemFaq key={it.q} q={it.q} aberto={abertos.includes(i)} onToggle={() => toggle(i)}>
                {it.a}
              </ItemFaq>
            ))}
          </ul>
        </Revela>
      </div>
    </section>
  )
}

/* ---------------- Localização e contato ---------------- */

function MapaLazy() {
  const ref = useRef<HTMLDivElement>(null)
  const [mostrar, setMostrar] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setMostrar(true)
          io.disconnect()
        }
      },
      { rootMargin: '300px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <div ref={ref} className="relative aspect-[4/3] w-full overflow-hidden rounded-[var(--radius-xl2)] border border-tinta/10 bg-ceu-50 lg:aspect-auto lg:h-full lg:min-h-[28rem]">
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center text-ceu-700">
        <IconPin size={36} />
        <span className="font-bold text-tinta">{CONFIG.endereco.rua} - {CONFIG.endereco.bairro}</span>
        <a href={CONFIG.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secundario">
          Abrir no Google Maps
        </a>
      </div>
      {mostrar && (
        <iframe
          title={`Mapa: ${enderecoCompleto}`}
          src={CONFIG.mapsEmbed}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 h-full w-full border-0"
        />
      )}
    </div>
  )
}

export function Contato() {
  const horas = linhasHorario()
  return (
    <section id="contato" aria-labelledby="t-contato" className="relative bg-papel/70 py-20 md:py-28">
      <div className="container-site">
        <Cabecalho id="t-contato" rotulo="localização e contato" titulo={['Venha conhecer o', { em: 'consultório.' }]} />
        <div className="mt-12 grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
          <Revela className="cartao p-7 md:p-9">
            <ul className="space-y-7">
              <li className="flex gap-4">
                <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-2xl bg-ceu-50 text-ceu-700">
                  <IconPin size={24} />
                </span>
                <div>
                  <h3 className="font-sans text-sm font-extrabold uppercase tracking-[0.14em] text-tinta-3" style={{ fontFamily: 'var(--font-sans)' }}>
                    Endereço
                  </h3>
                  <p className="mt-1 text-lg">
                    {CONFIG.endereco.rua} - {CONFIG.endereco.bairro}
                    <br />
                    {CONFIG.endereco.cidade} - {CONFIG.endereco.uf}, {CONFIG.endereco.cep}
                  </p>
                  <a
                    href={CONFIG.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex min-h-12 items-center gap-2 font-extrabold text-framboesa-600 hover:text-framboesa-700"
                  >
                    Como chegar <IconSeta size={18} />
                  </a>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-2xl bg-framboesa-50 text-framboesa-600">
                  <IconRelogio size={24} />
                </span>
                <div>
                  <h3 className="font-sans text-sm font-extrabold uppercase tracking-[0.14em] text-tinta-3" style={{ fontFamily: 'var(--font-sans)' }}>
                    Horários
                  </h3>
                  <dl className="mt-1 space-y-0.5 text-lg">
                    {horas.map((h) => (
                      <div key={h.dias} className="flex flex-wrap gap-x-2">
                        <dt className="font-bold">{h.dias}:</dt>
                        <dd>{h.horas}</dd>
                      </div>
                    ))}
                  </dl>
                  <p className="mt-2 text-sm text-tinta-3">
                    {CONFIG.horaMarcada ? 'Atendimento com hora marcada. ' : ''}
                    {CONFIG.observacaoHorario}
                  </p>
                </div>
              </li>
            </ul>
            <div className="mt-9 grid gap-3">
              <a href={waLink()} target="_blank" rel="noopener noreferrer" className="btn btn-primario">
                <IconWhats size={20} /> WhatsApp <span className="whitespace-nowrap">{CONFIG.whatsappExibicao}</span>
              </a>
              <a href={telLink} className="btn btn-secundario">
                <IconFone size={20} /> Ligar <span className="whitespace-nowrap">{CONFIG.telefoneExibicao}</span>
              </a>
              <a href={CONFIG.instagram} target="_blank" rel="noopener noreferrer" className="btn btn-secundario">
                <IconInsta size={20} /> {CONFIG.instagramUsuario}
              </a>
            </div>
          </Revela>
          <Revela delay={0.1} className="min-h-0">
            <MapaLazy />
          </Revela>
        </div>
      </div>
    </section>
  )
}

/* ---------------- CTA final ---------------- */

export function CtaFinal() {
  return (
    <section aria-labelledby="t-cta" className="relative">
      <Onda className="block h-10 w-full text-noite md:h-16" />
      <div className="relative overflow-hidden bg-noite py-20 text-creme md:py-28">
        <Brilho className="absolute left-[6%] top-8 size-8 text-framboesa md:left-[8%] md:top-12 md:size-10" />
        <Estrela className="absolute right-[6%] top-6 size-9 text-ceu md:right-[10%] md:top-20 md:size-12" />
        <CoracaoTraco className="absolute bottom-14 right-[22%] hidden w-16 text-framboesa/80 md:block" />
        <Brilho className="absolute bottom-16 left-[18%] hidden size-6 text-ceu-100 md:block" />
        <div className="container-site relative text-center">
          <p className="rotulo !text-ceu-100">o próximo passo</p>
          <h2 id="t-cta" className="mx-auto mt-4 max-w-3xl text-[2.4rem] !text-creme sm:text-6xl">
            O primeiro passo é uma <em className="enfase !text-[#f4a6b4]">conversa.</em>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-creme/80">
            Conte um pouco sobre seu filho pelo WhatsApp. A equipe orienta e combina com você o melhor horário.
          </p>
          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <a href={waLink()} target="_blank" rel="noopener noreferrer" className="btn btn-claro">
              <IconWhats size={20} /> Agendar pelo WhatsApp
            </a>
            <a href={CONFIG.instagram} target="_blank" rel="noopener noreferrer" className="btn btn-contorno-claro">
              <IconInsta size={20} /> Ver no Instagram
            </a>
          </div>
          {CONFIG.secoes.agendar && (
            <p className="mt-8">
              <a href="#agendar" className="inline-flex min-h-12 items-center font-bold text-creme/85 underline decoration-framboesa decoration-2 underline-offset-[6px] hover:text-creme">
                Prefere indicar dia e horário? Use o formulário de solicitação
              </a>
            </p>
          )}
        </div>
      </div>
    </section>
  )
}

/* ---------------- Rodapé ---------------- */

export function Rodape() {
  return (
    <footer className="bg-noite pb-28 text-creme/85 md:pb-12">
      <div className="container-site border-t border-creme/12 pt-14">
        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <div className="inline-block rounded-[1.75rem] bg-creme px-6 py-5">
              <img src="/img/logo-tia-jessika-360.webp" srcSet="/img/logo-tia-jessika-360.webp 1x, /img/logo-tia-jessika-560.webp 2x" width={CONFIG.logo.completoW} height={CONFIG.logo.completoH} alt={`${CONFIG.marca}, ${CONFIG.descritor}`} loading="lazy" decoding="async" className="h-24 w-auto" />
            </div>
            <p className="mt-5 font-mao text-3xl font-semibold text-[#f4a6b4]">com carinho, Tia Jessika</p>
            <p className="mt-2">
              {CONFIG.nome} · {CONFIG.titulo}
              <br />
              {CONFIG.cro}
            </p>
          </div>
          <div>
            <h2 className="font-sans text-sm font-extrabold uppercase tracking-[0.14em] !text-creme" style={{ fontFamily: 'var(--font-sans)' }}>
              Endereço
            </h2>
            <p className="mt-3">
              {CONFIG.endereco.rua} - {CONFIG.endereco.bairro}
              <br />
              {CONFIG.endereco.cidade} - {CONFIG.endereco.uf}, {CONFIG.endereco.cep}
            </p>
            <a href={CONFIG.mapsUrl} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex min-h-12 items-center underline decoration-creme/40 underline-offset-4 hover:text-creme">
              Abrir no Google Maps
            </a>
          </div>
          <div>
            <h2 className="font-sans text-sm font-extrabold uppercase tracking-[0.14em] !text-creme" style={{ fontFamily: 'var(--font-sans)' }}>
              Contato
            </h2>
            <ul className="mt-2">
              <li>
                <a href={waLink()} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-2.5 hover:text-creme">
                  <IconWhats size={18} /> WhatsApp {CONFIG.whatsappExibicao}
                </a>
              </li>
              <li>
                <a href={telLink} className="inline-flex min-h-12 items-center gap-2.5 hover:text-creme">
                  <IconFone size={18} /> {CONFIG.telefoneExibicao}
                </a>
              </li>
              <li>
                <a href={CONFIG.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-2.5 hover:text-creme">
                  <IconInsta size={18} /> {CONFIG.instagramUsuario}
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-3 border-t border-creme/12 pt-6 text-sm text-creme/70 md:flex-row md:items-center md:justify-between">
          <p>Conteúdo informativo; a indicação de cada atendimento depende de avaliação individual.</p>
          <a href="/privacidade.html" className="inline-flex min-h-12 items-center underline decoration-creme/40 underline-offset-4 hover:text-creme">
            Privacidade
          </a>
        </div>
      </div>
    </footer>
  )
}

/* ---------------- WhatsApp flutuante e barra do celular ---------------- */

export function BotoesFixos() {
  return (
    <>
      <a
        href={waLink()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Agendar avaliação pelo WhatsApp"
        className="fixed bottom-6 right-6 z-40 hidden size-14 items-center justify-center rounded-full bg-framboesa-600 text-white shadow-[0_14px_30px_-12px_rgb(150_44_75/0.7)] transition-transform duration-300 hover:scale-105 hover:bg-framboesa-700 md:inline-flex"
      >
        <IconWhats size={28} />
      </a>
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-tinta/10 bg-creme/95 px-3 pb-[max(0.6rem,env(safe-area-inset-bottom))] pt-2.5 backdrop-blur-md md:hidden">
        <div className="flex gap-2.5">
          <a href={waLink()} target="_blank" rel="noopener noreferrer" className="btn btn-primario flex-1 !min-h-12 !px-3 text-[0.95rem]">
            <IconWhats size={20} /> Agendar avaliação
          </a>
          <a href={telLink} className="btn btn-secundario !min-h-12 !px-4 text-[0.95rem]" aria-label={`Ligar para ${CONFIG.telefoneExibicao}`}>
            <IconFone size={20} /> Ligar
          </a>
        </div>
      </div>
    </>
  )
}
