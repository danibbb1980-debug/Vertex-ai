import { useRef, useState, type PointerEvent } from 'react'
import { CONFIG } from '../config'
import { CLINICA, ETAPAS, QUANDO_PROCURAR } from '../content'
import { FOTOS } from '../lib/fotos'
import { useProgressoRolagem } from '../lib/movimento'
import { msgAtendimento, waLink } from '../lib/links'
import { IconeAtendimento, IconeEstrutura, IconePilar, IconeWhats } from './Icones'
import { CabecalhoSecao, Reveal } from './ui'

/* ------------------------------------------------------------------ A clínica */
export function Clinica() {
  return (
    <section id="clinica" aria-labelledby="t-clinica" className="bg-cream py-20 sm:py-28">
      <div className="container-site grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-6">
          <CabecalhoSecao id="t-clinica" rotulo={CLINICA.rotulo} antes={CLINICA.tituloAntes} enfase={CLINICA.enfase} depois={CLINICA.tituloDepois} />
          <div className="mt-7 space-y-5 text-lg text-choco-800">
            {CLINICA.paragrafos.map((p, i) => (
              <Reveal key={i} delay={0.08 * (i + 1)}>
                <p>{p}</p>
              </Reveal>
            ))}
          </div>
        </div>
        <ul className="grid gap-4 self-end lg:col-span-6 lg:pl-6">
          {CLINICA.pilares.map((p, i) => (
            <Reveal as="li" key={p.titulo} delay={0.1 * i} className="flex gap-5 rounded-xl2 border border-choco-700/10 bg-ivory p-6 shadow-soft sm:p-7">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-olive-100 text-olive-700">
                <IconePilar tipo={p.icone} className="h-8 w-8" />
              </span>
              <div>
                <h3 className="text-[1.4rem] leading-tight">{p.titulo}</h3>
                <p className="mt-1.5 text-choco-700">{p.texto}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------- Atendimentos */
function CartaoAtendimento({ a, i }: { a: (typeof CONFIG.atendimentos)[number]; i: number }) {
  const mover = (e: PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--x', `${e.clientX - r.left}px`)
    e.currentTarget.style.setProperty('--y', `${e.clientY - r.top}px`)
  }
  return (
    <Reveal as="li" delay={0.05 * (i % 4)} className="flex">
      <article onPointerMove={mover} className="spot group flex w-full flex-col bg-ivory p-7 sm:p-8">
        <div className="flex items-start justify-between">
          <span className="text-choco-700 transition-transform duration-500 ease-out group-hover:-translate-y-0.5">
            <IconeAtendimento tipo={a.icone} className="h-14 w-14" />
          </span>
          <span className="font-serif text-sm italic text-camel-700" aria-hidden>
            {String(i + 1).padStart(2, '0')}
          </span>
        </div>
        <h3 className="mt-6 text-[1.5rem] leading-tight">{a.nome}</h3>
        <p className="mt-3 text-[1rem] leading-relaxed text-choco-700">{a.descricao}</p>
        <p className="mt-4 text-[0.88rem] text-choco-600">A indicação depende de avaliação individual.</p>
        {CONFIG.whatsapp && (
          <a
            href={waLink(msgAtendimento(a.nomeMensagem))}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-auto inline-flex min-h-12 items-center gap-2 pt-6 text-[0.95rem] font-semibold text-choco-900"
          >
            <IconeWhats className="h-[18px] w-[18px] text-olive" />
            <span className="link-sublinhado whitespace-nowrap">Perguntar no WhatsApp</span>
            <span className="sr-only">sobre {a.nome}</span>
          </a>
        )}
      </article>
    </Reveal>
  )
}

export function Atendimentos() {
  const lista = CONFIG.atendimentos
  if (lista.length === 0) return null
  // completa a grade com um cartão de avaliação quando sobra espaço
  const temExtra = lista.length % 2 === 1 && Boolean(CONFIG.whatsapp)
  return (
    <section id="atendimentos" aria-labelledby="t-atendimentos" className="py-20 sm:py-28">
      <div className="container-site">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <CabecalhoSecao
            id="t-atendimentos"
            className="lg:col-span-7"
            rotulo="Atendimentos"
            antes="Áreas diferentes,"
            enfase="conversando"
            depois="entre si."
          />
          <Reveal className="lg:col-span-5" delay={0.1}>
            <p className="text-lg text-choco-700">
              Conheça cada frente de atendimento da clínica. Os textos são informativos: o tratamento indicado para você é
              definido na avaliação.
            </p>
          </Reveal>
        </div>

        <ul className="mt-14 grid gap-px overflow-hidden rounded-xl2 border border-choco-700/[0.12] bg-choco-700/[0.12] sm:grid-cols-2 lg:grid-cols-4">
          {lista.map((a, i) => (
            <CartaoAtendimento key={a.id} a={a} i={i} />
          ))}
          {temExtra && (
            <Reveal as="li" delay={0.15} className="flex">
              <div className="on-dark relative flex w-full flex-col overflow-hidden bg-choco-800 p-7 text-ivory sm:p-8">
                <svg aria-hidden viewBox="0 0 200 200" className="absolute -bottom-16 -right-16 h-56 w-56 text-camel-500/30" fill="none">
                  <path d="M70 10a92 92 0 1 1 0 180" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
                  <path d="M104 26a74 74 0 0 0 0 148" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
                <p className="rotulo">Por onde começar</p>
                <h3 className="mt-5 text-[1.6rem] leading-tight !text-ivory">
                  Primeira <em className="!text-camel-300">avaliação</em>
                </h3>
                <p className="mt-3 text-camel-300">
                  Não sabe qual área procurar? A avaliação é o ponto de partida para montar o seu plano.
                </p>
                <a href={waLink()} target="_blank" rel="noopener noreferrer" className="btn btn-claro btn-brilho relative mt-auto self-start">
                  <IconeWhats /> Agendar avaliação
                </a>
              </div>
            </Reveal>
          )}
        </ul>
      </div>
    </section>
  )
}

/* ----------------------------------------------- Equipe (só com dados reais) */
export function Equipe() {
  const lista = CONFIG.dentistas.filter((d) => d.nome && d.cro)
  if (lista.length === 0) return null
  return (
    <section id="equipe" aria-labelledby="t-equipe" className="bg-cream py-20 sm:py-28">
      <div className="container-site">
        <CabecalhoSecao id="t-equipe" rotulo="Quem atende" antes="Nossa" enfase="equipe" />
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {lista.map((d, i) => (
            <Reveal as="li" key={d.cro} delay={0.06 * i} className="overflow-hidden rounded-xl2 border border-choco-700/10 bg-ivory shadow-soft">
              {d.foto && <img src={d.foto} alt={`Foto de ${d.nome}`} loading="lazy" className="aspect-[4/5] w-full object-cover" width={480} height={600} />}
              <div className="p-6">
                <h3 className="text-xl">{d.nome}</h3>
                <p className="mt-1 text-sm font-medium text-choco-700">{d.cro}</p>
                {d.especialidade && d.registroEspecialidade && (
                  <p className="mt-2 text-choco-700">
                    {d.especialidade} <span className="text-sm">({d.registroEspecialidade})</span>
                  </p>
                )}
                {d.formacao && <p className="mt-2 text-sm text-choco-700">{d.formacao}</p>}
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ------------------------------------------------ Galeria (só com fotos reais) */
export function Galeria() {
  if (FOTOS.length === 0) return null
  return (
    <section id="galeria" aria-labelledby="t-galeria" className="py-20 sm:py-28">
      <div className="container-site">
        <CabecalhoSecao id="t-galeria" rotulo="O espaço" antes="Conheça a" enfase="clínica" />
        <ul className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
          {FOTOS.map((f, i) => (
            <Reveal as="li" key={f.src} delay={0.05 * (i % 3)} className={i === 0 ? 'col-span-2 row-span-2' : ''}>
              <img src={f.src} alt={f.alt} loading="lazy" decoding="async" className="h-full w-full rounded-xl2 object-cover" />
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------- Quando procurar */
export function QuandoProcurar() {
  return (
    <section id="quando-procurar" aria-labelledby="t-quando" className="border-t border-choco-700/10 bg-ivory py-20 sm:py-28">
      <div className="container-site grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-[calc(var(--banner-h)+72px+40px)]">
            <CabecalhoSecao
              id="t-quando"
              rotulo={QUANDO_PROCURAR.rotulo}
              antes={QUANDO_PROCURAR.tituloAntes}
              enfase={QUANDO_PROCURAR.enfase}
              depois={QUANDO_PROCURAR.tituloDepois}
              intro={QUANDO_PROCURAR.intro}
            />
          </div>
        </div>
        <ol className="lg:col-span-7">
          {QUANDO_PROCURAR.itens.map((it, i) => (
            <Reveal as="li" key={it.titulo} delay={0.04 * i} className="grid grid-cols-[3.25rem_1fr] gap-4 border-b border-choco-700/[0.12] py-7 first:pt-0 sm:grid-cols-[4.5rem_1fr]">
              <span className="font-serif text-3xl italic leading-none text-olive sm:text-4xl" aria-hidden>
                {String(i + 1).padStart(2, '0')}
              </span>
              <div>
                <h3 className="text-[1.45rem] leading-snug">{it.titulo}</h3>
                <p className="mt-2 text-choco-700">{it.texto}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------- Como funciona */
export function ComoFunciona() {
  const ref = useRef<HTMLOListElement>(null) as React.RefObject<HTMLElement> & React.RefObject<HTMLOListElement>
  const barra = useRef<HTMLSpanElement>(null)
  const [ativo, setAtivo] = useState(-1)
  const total = ETAPAS.itens.length
  // de "topo da lista a 75% da tela" até "fim da lista a 55% da tela"
  useProgressoRolagem(
    ref,
    (r, vh) => (0.75 * vh - r.top) / (r.height + 0.2 * vh),
    (v) => {
      barra.current?.style.setProperty('transform', `scaleY(${v})`)
      setAtivo(v <= 0.02 ? -1 : Math.min(total - 1, Math.floor(v * total)))
    },
  )

  return (
    <section id="como-funciona" aria-labelledby="t-como" className="bg-sand/60 py-20 sm:py-28">
      <div className="container-site grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <CabecalhoSecao id="t-como" rotulo={ETAPAS.rotulo} antes={ETAPAS.tituloAntes} enfase={ETAPAS.enfase} depois={ETAPAS.tituloDepois} />
        </div>
        <ol ref={ref} className="relative lg:col-span-7">
          {/* trilho e progresso (adaptado de "Animated Progress Stepper", 21st.dev) */}
          <span aria-hidden className="absolute bottom-6 left-[1.4rem] top-6 w-px bg-choco-700/20" />
          <span
            ref={barra}
            aria-hidden
            className="absolute bottom-6 left-[calc(1.4rem-1px)] top-6 w-[3px] origin-top rounded-full bg-gradient-to-b from-camel-500 to-choco-700 transition-transform duration-200 ease-out"
            style={{ transform: 'scaleY(0)' }}
          />
          {ETAPAS.itens.map((e, i) => {
            const on = i <= ativo
            return (
              <li key={e.titulo} className="relative grid grid-cols-[2.8rem_1fr] gap-5 pb-12 last:pb-0">
                <span
                  className={`relative z-10 flex h-11 w-11 items-center justify-center rounded-full border-2 font-serif text-lg transition-[background-color,border-color,color] duration-500 ${
                    on ? 'border-choco-700 bg-choco-800 text-ivory' : 'border-choco-700/30 bg-ivory text-choco-700'
                  }`}
                >
                  {i + 1}
                </span>
                <div className={`pt-1.5 transition-opacity duration-500 ${on || ativo < 0 ? 'opacity-100' : 'opacity-60'}`}>
                  <h3 className="text-[1.45rem] leading-snug">{e.titulo}</h3>
                  <p className="mt-2 max-w-lg text-choco-700">{e.texto}</p>
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}

/* ----------------------------------------------------------------- Estrutura */
export function Estrutura() {
  const cartoes: { icone: 'acessivel' | 'agenda' | 'cartao'; titulo: string; texto?: string; lista?: string[] }[] = []
  if (CONFIG.estrutura.banheiroAcessivel)
    cartoes.push({
      icone: 'acessivel',
      titulo: 'Banheiro acessível',
      texto: 'A clínica conta com banheiro com acessibilidade para cadeirantes.',
    })
  if (CONFIG.estrutura.horaMarcadaRecomendada)
    cartoes.push({
      icone: 'agenda',
      titulo: 'Hora marcada',
      texto: 'Recomendamos agendar antes da visita, para reservar o tempo da sua consulta.',
    })
  if (CONFIG.pagamentos.length) cartoes.push({ icone: 'cartao', titulo: 'Formas de pagamento', lista: CONFIG.pagamentos })
  if (cartoes.length === 0) return null

  return (
    <section id="estrutura" aria-labelledby="t-estrutura" className="py-20 sm:py-28">
      <div className="container-site">
        <CabecalhoSecao id="t-estrutura" rotulo="Estrutura" antes="Para a sua visita ser" enfase="tranquila" depois="." />
        <ul className={`mt-12 grid gap-5 ${cartoes.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}>
          {cartoes.map((c, i) => (
            <Reveal as="li" key={c.titulo} delay={0.08 * i} className="rounded-xl2 border border-choco-700/[0.12] bg-cream p-7 sm:p-8">
              <span className="text-olive">
                <IconeEstrutura tipo={c.icone} className="h-11 w-11" />
              </span>
              <h3 className="mt-5 text-[1.4rem]">{c.titulo}</h3>
              {c.texto && <p className="mt-2 text-choco-700">{c.texto}</p>}
              {c.lista && (
                <ul className="mt-3 space-y-2">
                  {c.lista.map((t) => (
                    <li key={t} className="flex items-center gap-3 text-choco-800">
                      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-camel-600" />
                      {t}
                    </li>
                  ))}
                </ul>
              )}
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
