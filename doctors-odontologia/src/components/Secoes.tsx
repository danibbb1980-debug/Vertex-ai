import { useRef } from 'react'
import { m, useScroll, useTransform, useReducedMotion } from 'motion/react'
import { CONFIG, equipeVisivel, mensagemAtendimento, waLink } from '../config'
import { Foto, Revelar, TituloSecao } from './ui'
import {
  IconeAproximacao,
  IconeCadeirante,
  IconeCalendario,
  IconeCamadas,
  IconeCartao,
  IconeCheck,
  IconeRelogio,
  IconeSetaDiagonal,
  IconeWhatsApp,
  iconeAtendimento,
} from './Icones'

/* ---------------- A clínica ---------------- */

export function Clinica() {
  const pilares = [
    {
      Icone: IconeCamadas,
      titulo: 'Várias áreas',
      texto: 'Diferentes frentes de atendimento no mesmo endereço, do cuidado de rotina aos tratamentos mais extensos.',
    },
    {
      Icone: IconeCalendario,
      titulo: 'Hora marcada',
      texto: 'Atendimento com agendamento prévio, para você se organizar e ser recebido no horário combinado.',
    },
    {
      Icone: IconeRelogio,
      titulo: 'Até as 20h',
      texto: 'Em dias úteis, de 08h às 20h. Aos sábados, de 08h às 15h30.',
    },
  ]
  const fotos = CONFIG.fotos.ambiente

  return (
    <section id="clinica" data-secao="A clínica" aria-labelledby="t-clinica" className="py-24 md:py-32">
      <div className="container-site">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <TituloSecao id="t-clinica" rotulo="A clínica">
              Um endereço para o cuidado da família <em className="enfase">inteira</em>.
            </TituloSecao>
          </div>
          <Revelar className="space-y-5 text-lg leading-relaxed text-pedra lg:col-span-5 lg:col-start-8 lg:pt-12">
            <p>
              Na Doctors, diferentes áreas da odontologia trabalham lado a lado. Isso permite olhar para o caso
              como um todo e organizar as etapas do tratamento em um só lugar.
            </p>
            <p>
              Cada plano começa por uma avaliação individual, com tempo para ouvir, examinar e explicar. As
              consultas são com hora marcada, e o horário estendido ajuda a encaixar o cuidado na rotina.
            </p>
          </Revelar>
        </div>

        <ul className="mt-16 grid border-t border-linha md:grid-cols-3">
          {pilares.map(({ Icone, titulo, texto }, i) => (
            <Revelar
              como="li"
              key={titulo}
              atraso={i * 0.08}
              className="relative border-b border-linha py-8 md:border-b-0 md:px-8 md:first:pl-0 md:[&+li]:border-l"
            >
              <Icone tamanho={30} className="text-ouro-escuro" />
              <h3 className="mt-5 text-2xl text-vinho-900">{titulo}</h3>
              <p className="mt-2 text-pedra">{texto}</p>
            </Revelar>
          ))}
        </ul>

        {fotos.length > 0 && (
          <div className="mt-20">
            <Revelar className="flex items-end justify-between gap-6">
              <p className="rotulo text-ouro-escuro">O espaço</p>
              <p className="hidden text-sm text-pedra sm:block">{CONFIG.endereco.rua}, {CONFIG.endereco.bairro}</p>
            </Revelar>
            <ul className="mt-6 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3">
              {fotos.map((f, i) => (
                <Revelar
                  como="li"
                  key={f.src}
                  atraso={i * 0.08}
                  className={i === 0 ? 'col-span-2 md:col-span-1' : ''}
                >
                  <figure className="group">
                    <div className={`overflow-hidden bg-areia ${i === 0 ? 'rounded-tr-[120px] md:rounded-tr-[160px]' : ''}`}>
                      <Foto
                        src={f.src}
                        alt={f.alt}
                        largura={f.largura}
                        altura={f.altura}
                        className={`w-full object-cover transition-transform duration-700 ease-[var(--ease-suave)] group-hover:scale-[1.03] ${
                          i === 0 ? 'aspect-[4/3] md:aspect-[3/4]' : 'aspect-[3/4]'
                        }`}
                      />
                    </div>
                    <figcaption className="mt-3 flex items-center gap-2 text-sm text-pedra">
                      <span aria-hidden className="inline-block h-3 w-[2px] bg-ouro" />
                      {f.legenda}
                    </figcaption>
                  </figure>
                </Revelar>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  )
}

/* ---------------- Atendimentos ---------------- */

export function Atendimentos() {
  const lista = CONFIG.atendimentos
  if (!lista.length) return null
  return (
    <section id="atendimentos" data-secao="Atendimentos" aria-labelledby="t-atend" className="bg-marfim py-24 md:py-32">
      <div className="container-site">
        <TituloSecao
          id="t-atend"
          rotulo="Atendimentos"
          descricao="Conheça as áreas atendidas na clínica. Em todas elas, a indicação depende de avaliação individual."
        >
          Várias áreas, um mesmo <em className="enfase">cuidado</em>.
        </TituloSecao>

        <ul className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-linha bg-linha sm:grid-cols-2 lg:grid-cols-3">
          {lista.map((a, i) => {
            const Icone = iconeAtendimento[a.icone]
            return (
              <Revelar
                como="li"
                key={a.id}
                atraso={(i % 3) * 0.06}
                className={`group relative flex flex-col bg-marfim p-7 transition-colors duration-500 hover:bg-white md:p-8 ${
                  i === lista.length - 1 && lista.length % 3 === 1 ? 'lg:col-span-3 lg:flex-row lg:items-center lg:gap-10' : ''
                } ${i === lista.length - 1 && lista.length % 2 === 1 ? 'sm:col-span-2 lg:col-span-1' : ''}`}
              >
                <span
                  aria-hidden
                  className="absolute left-0 top-0 h-full w-[3px] origin-top scale-y-0 bg-ouro transition-transform duration-500 ease-[var(--ease-suave)] group-hover:scale-y-100"
                />
                <div className="flex items-start justify-between">
                  <span className="inline-flex size-14 items-center justify-center rounded-full border border-ouro/50 text-vinho transition-colors duration-500 group-hover:bg-vinho group-hover:text-creme">
                    <Icone tamanho={28} />
                  </span>
                  <span className="rotulo text-ouro-escuro lg:hidden">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <div className="mt-6 flex-1 lg:mt-6">
                  <h3 className="text-[1.65rem] text-vinho-900">{a.nome}</h3>
                  <p className="mt-3 text-pedra">{a.resumo}</p>
                  <p className="mt-3 text-sm italic text-pedra">A indicação depende de avaliação individual.</p>
                </div>
                <a
                  href={waLink(mensagemAtendimento(a.nome))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex min-h-12 items-center gap-2 self-start text-[0.95rem] font-medium text-vinho underline decoration-ouro/60 decoration-1 underline-offset-[6px] transition-colors hover:decoration-vinho"
                  aria-label={`Pedir informações sobre ${a.nome} pelo WhatsApp`}
                >
                  <IconeWhatsApp tamanho={16} />
                  Falar sobre {a.nome.toLowerCase()}
                  <IconeSetaDiagonal tamanho={16} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              </Revelar>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

/* ---------------- Quando procurar ---------------- */

const MOTIVOS = [
  {
    titulo: 'Check-up periódico',
    texto: 'Consultas regulares ajudam a acompanhar a saúde bucal e a identificar alterações cedo. O intervalo ideal é definido com o dentista.',
  },
  {
    titulo: 'Dor ou sensibilidade',
    texto: 'Dor, sensibilidade ao frio ou ao doce e sangramento na gengiva são sinais para procurar uma avaliação.',
  },
  {
    titulo: 'Perda de dente',
    texto: 'Quando falta um dente, existem diferentes formas de reposição. A avaliação mostra quais fazem sentido para o seu caso.',
  },
  {
    titulo: 'Alinhamento dos dentes',
    texto: 'Dentes tortos, espaçados ou que não se encaixam bem podem ser avaliados em qualquer idade.',
  },
  {
    titulo: 'Primeira visita da criança',
    texto: 'A primeira consulta costuma ser recomendada por volta do nascimento dos primeiros dentes, com orientação para a família.',
  },
]

export function QuandoProcurar() {
  return (
    <section data-secao="Quando procurar" aria-labelledby="t-quando" className="py-24 md:py-32">
      <div className="container-site grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-36">
            <TituloSecao
              id="t-quando"
              rotulo="Quando procurar"
              descricao="Algumas situações comuns em que vale marcar uma consulta. Este conteúdo é informativo e não substitui a avaliação."
            >
              Sinais que merecem uma <em className="enfase">conversa</em>.
            </TituloSecao>
          </div>
        </div>
        <ol className="lg:col-span-6 lg:col-start-7">
          {MOTIVOS.map((m, i) => (
            <Revelar como="li" key={m.titulo} className="grid grid-cols-[3rem_1fr] gap-x-4 border-t border-linha py-7 last:border-b">
              <span className="font-serif text-2xl italic text-ouro-escuro">{String(i + 1).padStart(2, '0')}</span>
              <div>
                <h3 className="text-2xl text-vinho-900">{m.titulo}</h3>
                <p className="mt-2 text-pedra">{m.texto}</p>
              </div>
            </Revelar>
          ))}
        </ol>
      </div>
    </section>
  )
}

/* ---------------- Como funciona (linha do tempo) ---------------- */

const ETAPAS = [
  {
    titulo: 'Contato e agendamento',
    texto: 'Você chama a clínica pelo WhatsApp ou pelo formulário do site e combina o dia e o horário da consulta.',
  },
  {
    titulo: 'Avaliação e escuta',
    texto: 'Na consulta, o profissional ouve suas queixas, conhece seu histórico e examina a boca com calma.',
  },
  {
    titulo: 'Plano explicado com clareza',
    texto: 'Você recebe as opções indicadas para o seu caso, com as etapas explicadas antes de qualquer decisão.',
  },
  {
    titulo: 'Acompanhamento',
    texto: 'Depois do tratamento, os retornos ajudam a acompanhar o resultado e a manter a saúde bucal.',
  },
]

export function ComoFunciona() {
  const ref = useRef<HTMLOListElement>(null)
  const reduzir = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 55%'] })
  const escala = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <section
      id="como-funciona"
      data-secao="Como funciona"
      aria-labelledby="t-como"
      className="escuro relative overflow-hidden bg-vinho-900 py-24 text-creme md:py-32"
    >
      <div aria-hidden className="pointer-events-none absolute -right-40 top-10 hidden h-[520px] w-[520px] rounded-full border border-ouro/15 md:block" />
      <div className="container-site relative">
        <TituloSecao id="t-como" rotulo="Como funciona" claro>
          Do primeiro contato ao <em className="enfase">acompanhamento</em>.
        </TituloSecao>

        <div className="mt-16 grid gap-16 lg:grid-cols-12">
        <ol ref={ref} className="relative pl-12 md:pl-16 lg:col-span-7">
          <span aria-hidden className="absolute bottom-3 left-[11px] top-3 w-[2px] bg-ouro/20 md:left-[15px]" />
          <m.span
            aria-hidden
            className="absolute bottom-3 left-[11px] top-3 w-[2px] origin-top bg-ouro md:left-[15px]"
            style={{ scaleY: reduzir ? 1 : escala }}
          />
          {ETAPAS.map((e, i) => (
            <Revelar como="li" key={e.titulo} className="relative pb-14 last:pb-0">
              <span
                aria-hidden
                className="absolute -left-12 top-0 flex size-6 items-center justify-center rounded-full border border-ouro bg-vinho-900 font-serif text-[0.8rem] text-ouro md:-left-16 md:size-8 md:text-sm"
              >
                {i + 1}
              </span>
              <p className="rotulo text-ouro">Etapa {String(i + 1).padStart(2, '0')}</p>
              <h3 className="mt-2 text-3xl text-creme md:text-[2.1rem]">{e.titulo}</h3>
              <p className="mt-3 max-w-xl text-lg text-ouro-claro">{e.texto}</p>
            </Revelar>
          ))}
        </ol>
        <RelogioHorario />
        </div>
      </div>
    </section>
  )
}

/** Ilustração de traço: relógio com o arco do horário estendido. */
function RelogioHorario() {
  const reduzir = useReducedMotion()
  // 08h às 20h em um mostrador de 12h: arco completo partindo das 8
  const marcas = Array.from({ length: 12 }, (_, i) => i)
  return (
    <Revelar className="hidden lg:col-span-4 lg:col-start-9 lg:block">
      <figure className="sticky top-40 text-center">
        <svg viewBox="0 0 240 240" className="mx-auto w-full max-w-[300px]" aria-hidden>
          <circle cx="120" cy="120" r="100" fill="none" stroke="var(--color-ouro)" strokeOpacity=".25" strokeWidth="1" />
          {marcas.map((i) => {
            const ang = (i / 12) * Math.PI * 2
            const x1 = 120 + Math.sin(ang) * 88
            const y1 = 120 - Math.cos(ang) * 88
            const x2 = 120 + Math.sin(ang) * (i % 3 === 0 ? 76 : 82)
            const y2 = 120 - Math.cos(ang) * (i % 3 === 0 ? 76 : 82)
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--color-ouro-claro)" strokeWidth={i % 3 === 0 ? 1.6 : 1} />
          })}
          <m.circle
            cx="120"
            cy="120"
            r="100"
            fill="none"
            stroke="var(--color-ouro)"
            strokeWidth="3"
            strokeLinecap="round"
            transform="rotate(-90 120 120)"
            initial={reduzir ? false : { pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.8, ease: [0.65, 0, 0.35, 1] }}
          />
          <line x1="120" y1="120" x2="120" y2="62" stroke="var(--color-creme)" strokeWidth="2.5" strokeLinecap="round" transform="rotate(240 120 120)" />
          <line x1="120" y1="120" x2="120" y2="42" stroke="var(--color-creme)" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="120" cy="120" r="4" fill="var(--color-ouro)" />
        </svg>
        <figcaption className="mt-8">
          <p className="rotulo text-ouro">Horário estendido</p>
          <p className="mt-3 font-serif text-3xl text-creme">
            Até as <em className="enfase">20h</em>
          </p>
          <p className="mt-2 text-ouro-claro">Segunda a sexta. Sábado até as 15h30.</p>
        </figcaption>
      </figure>
    </Revelar>
  )
}

/* ---------------- Estrutura ---------------- */

export function Estrutura() {
  const e = CONFIG.estrutura
  const iconePagamento = [IconeCartao, IconeCartao, IconeAproximacao]
  return (
    <section data-secao="Estrutura" aria-labelledby="t-estr" className="py-24 md:py-32">
      <div className="container-site">
        <TituloSecao id="t-estr" rotulo="Acessibilidade e estrutura">
          Pensado para receber <em className="enfase">bem</em>.
        </TituloSecao>
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {e.acessibilidade.length > 0 && (
            <Revelar className="rounded-2xl border border-linha bg-marfim p-7 md:col-span-1">
              <IconeCadeirante tamanho={30} className="text-ouro-escuro" />
              <h3 className="mt-5 text-2xl text-vinho-900">Acessibilidade</h3>
              <ul className="mt-4 space-y-2.5 text-pedra">
                {e.acessibilidade.map((t) => (
                  <li key={t} className="flex gap-2.5">
                    <IconeCheck tamanho={18} className="mt-1 shrink-0 text-vinho" />
                    {t}
                  </li>
                ))}
              </ul>
            </Revelar>
          )}
          {e.horaMarcada && (
            <Revelar atraso={0.06} className="rounded-2xl border border-linha bg-marfim p-7">
              <IconeCalendario tamanho={30} className="text-ouro-escuro" />
              <h3 className="mt-5 text-2xl text-vinho-900">Hora marcada</h3>
              <p className="mt-4 text-pedra">
                {e.horaMarcada} Assim, a consulta acontece no horário combinado. Fale com a clínica pelo WhatsApp para
                escolher o seu.
              </p>
            </Revelar>
          )}
          {e.pagamentos.length > 0 && (
            <Revelar atraso={0.12} className="rounded-2xl bg-vinho p-7 text-creme">
              <IconeCartao tamanho={30} className="text-ouro" />
              <h3 className="mt-5 text-2xl">Formas de pagamento</h3>
              <ul className="mt-4 space-y-2.5 text-ouro-claro">
                {e.pagamentos.map((t, i) => {
                  const I = iconePagamento[i] ?? IconeCartao
                  return (
                    <li key={t} className="flex gap-2.5">
                      <I tamanho={18} className="mt-1 shrink-0 text-ouro" />
                      {t}
                    </li>
                  )
                })}
              </ul>
            </Revelar>
          )}
        </div>
      </div>
    </section>
  )
}

/* ---------------- Equipe (só com CRO) ---------------- */

export function Equipe() {
  const lista = equipeVisivel()
  if (!lista.length) return null
  return (
    <section data-secao="Equipe" aria-labelledby="t-equipe" className="bg-marfim py-24 md:py-32">
      <div className="container-site">
        <TituloSecao id="t-equipe" rotulo="Quem atende">
          Profissionais da <em className="enfase">clínica</em>.
        </TituloSecao>
        <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {lista.map((p, i) => (
            <Revelar como="li" key={p.nome} atraso={(i % 3) * 0.06} className="rounded-2xl border border-linha bg-creme p-6">
              {p.foto && (
                <img src={p.foto} alt={`Foto de ${p.nome}`} width={400} height={500} loading="lazy" className="mb-5 aspect-[4/5] w-full rounded-tr-[80px] object-cover" />
              )}
              <h3 className="text-2xl text-vinho-900">{p.nome}</h3>
              <p className="mt-1 text-pedra">{p.atuacao}</p>
              <p className="rotulo mt-3 text-ouro-escuro">CRO {p.cro}</p>
              {p.registroEspecialidade && <p className="mt-1 text-sm text-pedra">{p.registroEspecialidade}</p>}
            </Revelar>
          ))}
        </ul>
      </div>
    </section>
  )
}

