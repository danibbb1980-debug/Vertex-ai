import type { CSSProperties } from 'react'
import { Accessibility, ArrowUpRight, CalendarClock, ClipboardList, Ear, MapPin, Repeat, Users } from 'lucide-react'
import { CONFIG } from '../config'
import { useUnidade } from '../context/unidade'
import { linkWhatsapp } from '../lib/whatsapp'
import { moverLuz, useNaTela } from '../lib/hooks'
import { Cabecalho, OndaMini } from '../components/Titulo'
import { IconeWhatsapp } from '../components/Marcas'

const atraso = (ms: number) => ({ '--d': `${ms}ms` }) as CSSProperties

/* ---------------- A clínica ---------------- */
export function Clinica() {
  const { unidade } = useUnidade()
  const pilares = [
    {
      icone: Users,
      titulo: 'Para toda a família',
      texto: 'Crianças, adultos e idosos recebidos no mesmo endereço, cada um no seu tempo.',
    },
    CONFIG.estrutura.horaMarcada && {
      icone: CalendarClock,
      titulo: 'Hora marcada',
      texto: 'Consultas com horário agendado, para organizar a sua rotina e a da casa.',
    },
    CONFIG.estrutura.acessibilidade.length > 0 && {
      icone: Accessibility,
      titulo: 'Acessibilidade',
      texto: 'Entrada e banheiro acessíveis para cadeirantes.',
    },
  ].filter(Boolean) as { icone: typeof Users; titulo: string; texto: string }[]

  return (
    <section id="clinica" aria-labelledby="titulo-clinica" className="bg-white py-20 sm:py-28">
      <div className="container-site grid gap-14 lg:grid-cols-[1fr_1fr] lg:gap-20">
        <div>
          <Cabecalho
            id="titulo-clinica"
            rotulo="A clínica"
            titulo="Uma clínica pensada para *cada* pessoa da casa."
          />
          <a
            href={unidade.mapsUrl}
            target="_blank"
            rel="noopener"
            className="reveal group mt-10 flex max-w-md items-center gap-4 rounded-[var(--radius-soft)] border border-teal-800/10 bg-ice p-4 pr-5 transition-colors hover:border-teal-600/40"
            style={atraso(240)}
          >
            <span className="icone-circulo bg-white">
              <MapPin aria-hidden="true" size={22} strokeWidth={1.7} />
            </span>
            <span className="flex-1 text-[0.95rem] leading-snug">
              <span className="rotulo block !text-[0.6875rem] text-teal-700">{unidade.rotulo}</span>
              <span className="mt-1 block text-ink">
                {unidade.endereco.logradouro}, {unidade.endereco.bairro}
              </span>
            </span>
            <ArrowUpRight aria-hidden="true" size={20} className="shrink-0 text-teal-700 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            <span className="sr-only">(abrir no Google Maps)</span>
          </a>
        </div>
        <div className="space-y-5 text-lg text-ink-soft lg:pt-12">
          <p className="reveal" style={atraso(120)}>
            A {CONFIG.nome} recebe pais, filhos e avós no mesmo lugar, com atendimento por hora marcada e conversa
            sem pressa. Cada consulta começa por entender quem está ali e o que essa pessoa procura.
          </p>
          <p className="reveal" style={atraso(200)}>
            A <strong className="font-semibold text-teal-800">{unidade.rotulo}</strong> é o primeiro endereço de uma
            clínica que quer crescer sem perder o essencial: atenção a cada pessoa, do primeiro contato ao
            acompanhamento.
          </p>
        </div>
      </div>
      <ul className="container-site mt-16 grid gap-5 sm:mt-20 md:grid-cols-3">
        {pilares.map((p, i) => (
          <li key={p.titulo} className="reveal" style={atraso(i * 110)}>
            <div onPointerMove={moverLuz} className="cartao h-full p-7 sm:p-8">
              <span className="icone-circulo">
                <p.icone aria-hidden="true" size={22} strokeWidth={1.7} />
              </span>
              <h3 className="mt-6 text-2xl">{p.titulo}</h3>
              <p className="mt-3 text-ink-soft">{p.texto}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

/* ---------------- Atendimento (com dados) ou Como cuidamos (sem dados) ---------------- */
export function Atendimento() {
  const { unidade } = useUnidade()
  const itens = CONFIG.atendimentos

  if (itens.length > 0) {
    return (
      <section id="atendimento" aria-labelledby="titulo-atendimento" className="bg-sand py-20 sm:py-28">
        <div className="container-site">
          <Cabecalho
            id="titulo-atendimento"
            rotulo="Atendimento"
            titulo="O que você encontra na *clínica*."
            intro={<p>A indicação de cada atendimento depende de avaliação individual.</p>}
          />
          <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {itens.map((a, i) => (
              <li key={a.titulo} className="reveal" style={atraso((i % 3) * 100)}>
                <article onPointerMove={moverLuz} className="cartao flex h-full flex-col p-7 sm:p-8">
                  <h3 className="text-2xl">{a.titulo}</h3>
                  <p className="mt-3 flex-1 text-ink-soft">{a.descricao}</p>
                  <p className="mt-5 text-sm text-ink-soft">Depende de avaliação individual.</p>
                  <a
                    href={linkWhatsapp(
                      unidade.whatsapp,
                      `Olá! Vi o site da Clínica Dental (Unidade ${unidade.nome}) e gostaria de saber mais sobre: ${a.titulo}.`,
                    )}
                    target="_blank"
                    rel="noopener"
                    className="mt-5 inline-flex min-h-12 items-center gap-2 font-semibold text-teal-800 underline decoration-aqua-400 decoration-2 underline-offset-4 hover:decoration-teal-700"
                  >
                    <IconeWhatsapp size={18} />
                    Perguntar pelo WhatsApp
                    <span className="sr-only"> sobre {a.titulo}</span>
                  </a>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>
    )
  }

  const etapas = [
    {
      icone: Ear,
      titulo: 'Avaliação individual',
      texto: 'Um primeiro encontro para conhecer o seu histórico, ouvir o que incomoda e observar com atenção.',
    },
    {
      icone: ClipboardList,
      titulo: 'Plano explicado com clareza',
      texto: 'Cada etapa sugerida é apresentada em linguagem simples, com espaço para dúvidas antes de qualquer decisão.',
    },
    {
      icone: Repeat,
      titulo: 'Acompanhamento',
      texto: 'O cuidado continua nos retornos, combinados de acordo com a necessidade de cada pessoa.',
    },
  ]
  return (
    <section id="atendimento" aria-labelledby="titulo-atendimento" className="bg-sand py-20 sm:py-28">
      <div className="container-site">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <Cabecalho id="titulo-atendimento" rotulo="Como cuidamos" titulo="Antes de qualquer indicação, vem a *escuta*." />
          <p className="reveal text-lg text-ink-soft" style={atraso(160)}>
            Todo atendimento parte de uma avaliação individual e de uma conversa franca sobre as possibilidades.
            Você entende, pergunta e decide com calma.
          </p>
        </div>
        <ol className="mt-14 grid gap-5 md:grid-cols-3">
          {etapas.map((e, i) => (
            <li key={e.titulo} className="reveal" style={atraso(i * 120)}>
              <article onPointerMove={moverLuz} className="cartao relative h-full overflow-hidden p-7 sm:p-8">
                <span aria-hidden="true" className="absolute right-6 top-4 font-display text-7xl italic text-aqua-200">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="icone-circulo relative">
                  <e.icone aria-hidden="true" size={22} strokeWidth={1.7} />
                </span>
                <h3 className="relative mt-6 text-2xl">{e.titulo}</h3>
                <p className="relative mt-3 text-ink-soft">{e.texto}</p>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

/* ---------------- Para quem ---------------- */
function Figura({ tipo }: { tipo: number }) {
  // Pequenas ilustrações de traço, abstratas: círculos e ondas de tamanhos diferentes.
  const comum = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round' as const }
  return (
    <svg aria-hidden="true" viewBox="0 0 96 64" className="h-16 w-24 text-teal-600">
      {tipo === 0 && (
        <>
          <circle cx="48" cy="22" r="9" {...comum} />
          <path d="M28 54c4-12 12-18 20-18s16 6 20 18" {...comum} />
          <path d="M6 58q8-6 16 0t16 0 16 0 16 0 16 0" {...comum} stroke="#78c4ca" />
        </>
      )}
      {tipo === 1 && (
        <>
          <circle cx="48" cy="18" r="11" {...comum} />
          <path d="M24 56c4-14 13-22 24-22s20 8 24 22" {...comum} />
          <path d="M6 58q8-6 16 0t16 0 16 0 16 0 16 0" {...comum} stroke="#78c4ca" />
        </>
      )}
      {tipo === 2 && (
        <>
          <circle cx="44" cy="18" r="11" {...comum} />
          <path d="M22 56c4-14 12-22 22-22 7 0 13 4 17 10" {...comum} />
          <path d="M66 30v26" {...comum} />
          <path d="M6 58q8-6 16 0t16 0 16 0 16 0 16 0" {...comum} stroke="#78c4ca" />
        </>
      )}
      {tipo === 3 && (
        <>
          <circle cx="26" cy="22" r="9" {...comum} />
          <circle cx="70" cy="22" r="9" {...comum} />
          <circle cx="48" cy="32" r="6" {...comum} />
          <path d="M10 56c3-10 9-16 16-16s13 6 16 16M54 56c3-10 9-16 16-16s13 6 16 16M38 56c2-7 6-11 10-11s8 4 10 11" {...comum} />
        </>
      )}
    </svg>
  )
}

export function ParaQuem() {
  const fases = [
    {
      titulo: 'Crianças',
      texto: 'Os primeiros contatos com o dentista podem ser tranquilos. Um ambiente acolhedor ajuda a criar o hábito de cuidar desde cedo.',
    },
    {
      titulo: 'Adultos',
      texto: 'Rotina corrida pede organização: consulta com hora marcada e explicações objetivas para decidir com tranquilidade.',
    },
    {
      titulo: 'Idosos',
      texto: 'Atenção ao tempo de cada um, conversa sem pressa e estrutura com acessibilidade para cadeirantes.',
    },
    {
      titulo: 'A família toda',
      texto: 'Quando todos se cuidam no mesmo lugar, fica mais simples acompanhar a saúde bucal da casa.',
    },
  ]
  return (
    <section id="para-quem" aria-labelledby="titulo-para-quem" className="bg-white py-20 sm:py-28">
      <div className="container-site">
        <Cabecalho
          id="titulo-para-quem"
          rotulo="Para quem"
          titulo="Em cada *fase* da vida."
          intro={<p>Visitas regulares ao dentista ajudam a acompanhar a saúde bucal ao longo dos anos. Aqui, todas as idades são bem-vindas.</p>}
        />
        <ul className="mt-14 grid gap-px overflow-hidden rounded-[var(--radius-card)] border border-teal-800/10 bg-teal-800/10 sm:grid-cols-2 lg:grid-cols-4">
          {fases.map((f, i) => (
            <li key={f.titulo} className="reveal bg-white p-7 sm:p-8" style={atraso(i * 90)}>
              <Figura tipo={i} />
              <h3 className="mt-5 text-2xl">{f.titulo}</h3>
              <p className="mt-3 text-ink-soft">{f.texto}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ---------------- Marquee discreto ---------------- */
export function Faixa() {
  const [ref, visivel] = useNaTela<HTMLDivElement>()
  const { unidade } = useUnidade()
  const frases = [
    CONFIG.posicionamento,
    'Avaliação individual',
    'Explicações claras',
    'Hora marcada',
    unidade.rotulo,
    `${CONFIG.cidade} - ${CONFIG.uf}`,
  ]
  const linha = (
    <span className="flex shrink-0 items-center">
      {frases.map((f) => (
        <span key={f} className="flex items-center">
          <span className="px-6 font-display text-2xl italic sm:text-3xl">{f}</span>
          <OndaMini className="text-aqua-400" />
        </span>
      ))}
    </span>
  )
  return (
    <div ref={ref} data-pausado={!visivel} aria-hidden="true" className="marquee overflow-hidden bg-teal-800 py-6 text-aqua-100">
      <div className="marquee-trilho flex w-max">
        {linha}
        {linha}
      </div>
    </div>
  )
}

/* ---------------- Equipe (só com dados) ---------------- */
export function Equipe() {
  const lista = CONFIG.profissionais
  if (!lista.length) return null
  return (
    <section id="equipe" aria-labelledby="titulo-equipe" className="bg-white py-20 sm:py-28">
      <div className="container-site">
        <Cabecalho id="titulo-equipe" rotulo="Equipe" titulo="Quem cuida de *você*." />
        <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {lista.map((p, i) => (
            <li key={p.nome} className="reveal" style={atraso((i % 3) * 100)}>
              <article className="cartao h-full overflow-hidden">
                {p.foto && (
                  <img src={p.foto} alt={`Foto de ${p.nome}`} loading="lazy" decoding="async" className="aspect-[4/5] w-full object-cover" />
                )}
                <div className="p-7">
                  <h3 className="text-2xl">{p.nome}</h3>
                  {p.cro && <p className="rotulo mt-2 text-teal-700">{p.cro}</p>}
                  {p.formacao && <p className="mt-3 text-ink-soft">{p.formacao}</p>}
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ---------------- Galeria (só com fotos) ---------------- */
export function Galeria() {
  const fotos = CONFIG.fotos
  if (!fotos.length) return null
  return (
    <section id="galeria" aria-labelledby="titulo-galeria" className="bg-ice py-20 sm:py-28">
      <div className="container-site">
        <Cabecalho id="titulo-galeria" rotulo="Ambiente" titulo="Conheça o *espaço*." />
        <ul className="mt-14 grid grid-cols-2 gap-4 lg:grid-cols-3">
          {fotos.map((f, i) => (
            <li key={f.src} className={`reveal overflow-hidden rounded-[var(--radius-soft)] ${i === 0 ? 'col-span-2 row-span-2' : ''}`} style={atraso((i % 3) * 90)}>
              <img src={f.src} alt={f.alt} loading="lazy" decoding="async" className="h-full w-full object-cover" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ---------------- Unidades (só com 2+) ---------------- */
export function Unidades() {
  const { unidade, setUnidadeId, multiplas } = useUnidade()
  if (!multiplas) return null
  return (
    <section id="unidades" aria-labelledby="titulo-unidades" className="bg-sand py-20 sm:py-28">
      <div className="container-site">
        <Cabecalho id="titulo-unidades" rotulo="Unidades" titulo="Escolha a unidade mais *perto*." />
        <ul className="mt-14 grid gap-5 md:grid-cols-2">
          {CONFIG.unidades.map((u) => (
            <li key={u.id}>
              <article className={`cartao h-full p-7 ${u.id === unidade.id ? '!border-teal-600' : ''}`}>
                <p className="rotulo text-teal-700">{u.rotulo}</p>
                <h3 className="mt-3 text-2xl">
                  {u.endereco.bairro}, {u.endereco.cidade}
                </h3>
                <p className="mt-2 text-ink-soft">{u.endereco.logradouro}</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <a href="#contato" onClick={() => setUnidadeId(u.id)} className="btn btn-secundario">
                    Ver horários e mapa
                  </a>
                  <a href={u.mapsUrl} target="_blank" rel="noopener" className="btn btn-secundario">
                    Como chegar <ArrowUpRight aria-hidden="true" size={18} />
                  </a>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

