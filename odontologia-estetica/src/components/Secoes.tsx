import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { CONFIG, atendimentosVisiveis, type Foto } from '../config'
import {
  enderecoCompleto,
  formatarFone,
  horariosAgrupados,
  msgAtendimento,
  telLink,
  waLink,
} from '../lib/contato'
import { BotaoWhats } from './Estrutura'
import {
  IconeAcesso,
  IconeAcolhimento,
  IconeAtendimento,
  IconeCalendario,
  IconeCarro,
  IconeCartao,
  IconeCheck,
  IconeInstagram,
  IconeMais,
  IconeMapa,
  IconeRelogio,
  IconeSeta,
  IconeTelefone,
  IconeWhatsApp,
} from './Icones'
import { Encaixe, Surge, TituloRevelado, type Trecho } from './Movimento'

function Cabeca({ rotulo, titulo, apoio, escuro }: { rotulo: string; titulo: Trecho[]; apoio?: ReactNode; escuro?: boolean }) {
  return (
    <div className="max-w-2xl">
      <p className={`rotulo flex items-center gap-3 ${escuro ? 'text-terracota-claro' : 'text-terracota'}`}>
        <span aria-hidden className="inline-block size-2.5 rounded-tl-full bg-current" />
        {rotulo}
      </p>
      <TituloRevelado
        trechos={titulo}
        className={`mt-4 text-[2rem] leading-[1.1] font-light tracking-[-0.01em] sm:text-[2.6rem] ${escuro ? 'text-gelo' : 'text-taupe-950'}`}
      />
      {apoio && <div className={`mt-5 text-[1.05rem] ${escuro ? 'text-pedra-100/85' : 'text-taupe-800'}`}>{apoio}</div>}
    </div>
  )
}

/* ---------------- HERO ---------------- */
export function Hero() {
  return (
    <section id="inicio" className="relative overflow-hidden pt-[calc(4.5rem+2rem)] lg:pt-[calc(4.5rem+2rem)]">
      <div aria-hidden className="grade-fina pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
      <div className="container-site relative grid min-h-[min(88svh,860px)] items-center gap-10 pt-10 pb-16 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16 lg:pt-6">
        <div>
          <p className="rotulo text-taupe-700">Odontologia · Pouso Alegre - MG</p>
          <TituloRevelado
            as="h1"
            noCarregamento
            atraso={0.1}
            trechos={['Planejamento, técnica e', { enfase: 'cuidado' }, 'em cada atendimento.']}
            className="mt-5 text-[2.6rem] leading-[1.04] font-light tracking-[-0.02em] text-taupe-950 sm:text-[3.6rem] lg:text-[4.4rem]"
          />
          <Surge noCarregamento atraso={0.55}>
            <p className="mt-6 max-w-lg text-[1.1rem] text-taupe-800">
              Avaliação individual, explicações claras e atendimento com hora marcada. Dr. André Totti e Dr. Douglas
              Barbosa em um consultório no bairro São Geraldo.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <BotaoWhats texto="Agendar minha avaliação" />
              <a
                href="#atendimentos"
                className="group inline-flex min-h-12 items-center justify-center gap-2 border border-taupe-700/35 px-6 text-[0.95rem] font-medium text-taupe-900 transition-colors hover:border-taupe-900 hover:bg-pedra-50"
              >
                Ver atendimentos
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  <IconeSeta />
                </span>
              </a>
            </div>
          </Surge>
        </div>
        <div className="relative mx-auto w-full max-w-[420px] lg:max-w-none">
          <Encaixe noCarregamento parallax className="aspect-square w-full" />
          <p className="rotulo absolute -bottom-2 left-0 text-[0.62rem] text-taupe-500">Dois perfis que se encaixam</p>
        </div>
      </div>
    </section>
  )
}

/* ---------------- MARQUEE ---------------- */
export function Faixa() {
  const ref = useRef<HTMLDivElement>(null)
  const [visivel, setVisivel] = useState(true)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setVisivel(e.isIntersecting))
    io.observe(el)
    return () => io.disconnect()
  }, [])
  const itens = atendimentosVisiveis().map((a) => a.nomeCurto)
  if (!itens.length) return null
  const lista = (oculta: boolean) => (
    <ul aria-hidden={oculta || undefined} className="flex shrink-0 items-center">
      {itens.map((t) => (
        <li key={t} className="flex items-center gap-8 pr-8 font-display text-[1.35rem] font-light whitespace-nowrap text-pedra-100">
          {t}
          <span aria-hidden className="inline-block size-2 rounded-tl-full bg-terracota-claro" />
        </li>
      ))}
    </ul>
  )
  return (
    <div ref={ref} className={`overflow-hidden bg-taupe-900 py-5 ${visivel ? '' : 'marquee-pausado'}`}>
      <p className="sr-only">Atendimentos: {itens.join(', ')}.</p>
      <div aria-hidden className="marquee-trilha flex w-max">
        {lista(true)}
        {lista(true)}
      </div>
    </div>
  )
}

/* ---------------- A CLÍNICA ---------------- */
function Imagem({ f, className = '', prioridade = false }: { f: Foto; className?: string; prioridade?: boolean }) {
  return (
    <img
      src={f.src}
      alt={f.alt}
      width={f.largura}
      height={f.altura}
      loading={prioridade ? 'eager' : 'lazy'}
      decoding="async"
      className={`h-full w-full object-cover ${className}`}
    />
  )
}

export function Clinica() {
  const comCro = CONFIG.profissionais.filter((p) => p.cro)
  const pilares = [
    {
      t: 'Dois dentistas',
      d: 'Dr. André Totti e Dr. Douglas Barbosa atendem no mesmo consultório, cada paciente com seu próprio planejamento.',
      i: <IconeAcolhimento />,
    },
    { t: 'Hora marcada', d: 'Cada consulta acontece em um horário reservado. É necessário agendar.', i: <IconeCalendario /> },
    { t: 'Acessibilidade', d: 'Entrada, assento, banheiro e estacionamento acessíveis para cadeirantes.', i: <IconeAcesso /> },
  ]
  const equipe = CONFIG.fotosEquipe
  return (
    <section id="clinica" className="py-24 sm:py-32">
      <div className="container-site">
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <Cabeca
            rotulo="A clínica"
            titulo={['Um consultório,', { enfase: 'dois olhares' }, 'sobre o seu sorriso.']}
            apoio={
              <>
                <p>
                  Na Odontologia Estética, <strong className="font-medium text-taupe-950">Dr. André Totti</strong> e{' '}
                  <strong className="font-medium text-taupe-950">Dr. Douglas Barbosa</strong> reúnem atendimento clínico,
                  estético, ortodôntico, cirúrgico e protético no mesmo endereço.
                </p>
                <p className="mt-4">
                  Cada tratamento começa por uma avaliação. A partir dela, o plano é montado e explicado com calma, para que
                  você entenda as alternativas antes de decidir.
                </p>
              </>
            }
          />
          {equipe.length > 0 && (
            <Surge className="grid grid-cols-6 grid-rows-[auto_auto] gap-3 self-end">
              <div className="col-span-6 overflow-hidden bg-pedra-100 sm:col-span-4">
                <Imagem f={equipe[0]} className="aspect-[3/2]" />
              </div>
              {equipe[1] && (
                <div className="col-span-3 overflow-hidden rounded-tl-[999px] bg-pedra-100 sm:col-span-2 sm:row-span-2 sm:rounded-tl-[160px]">
                  <Imagem f={equipe[1]} className="aspect-[3/4] object-[28%_center] sm:aspect-auto" />
                </div>
              )}
              {equipe[2] && (
                <div className="col-span-3 overflow-hidden bg-pedra-100 sm:col-span-4">
                  <Imagem f={equipe[2]} className="aspect-[3/4] sm:aspect-[3/1.4]" />
                </div>
              )}
            </Surge>
          )}
        </div>

        <ul className="mt-16 grid border-t border-pedra-200 sm:grid-cols-3">
          {pilares.map((p, i) => (
            <li key={p.t} className={`py-8 sm:px-8 sm:py-10 ${i > 0 ? 'border-t border-pedra-200 sm:border-t-0 sm:border-l' : 'sm:pl-0'}`}>
              <Surge atraso={i * 0.08}>
                <span className="text-musgo">{p.i}</span>
                <h3 className="mt-4 text-[1.4rem] font-normal text-taupe-950">{p.t}</h3>
                <p className="mt-2 text-taupe-800">{p.d}</p>
              </Surge>
            </li>
          ))}
        </ul>

        {comCro.length > 0 && (
          <ul className="mt-12 grid gap-6 sm:grid-cols-2">
            {comCro.map((p) => (
              <li key={p.nome} className="flex gap-5 border border-pedra-200 p-6">
                {p.foto && <img src={p.foto} alt={`Foto de ${p.nome}`} width={96} height={96} className="size-24 object-cover" loading="lazy" />}
                <div>
                  <h3 className="text-xl">{p.nome}</h3>
                  <p className="rotulo mt-1 text-taupe-700">{p.cro}</p>
                  {p.formacao && p.formacao.length > 0 && (
                    <ul className="mt-3 text-sm text-taupe-800">
                      {p.formacao.map((f) => (
                        <li key={f}>{f}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}

export function Galeria() {
  const fotos = CONFIG.fotosConsultorio
  if (!fotos.length) return null
  // mosaico arquitetônico: cantos retos com um arco
  // mosaico arquitetônico (5 x 2 no desktop, 2 colunas no celular): cantos retos com um arco
  const formatos = ['col-span-2 sm:row-span-2', '', 'row-span-2 rounded-tr-[999px]', '', '', '']
  return (
    <section aria-labelledby="titulo-galeria" className="bg-pedra-50 py-24 sm:py-28">
      <div className="container-site">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="rotulo text-terracota">O consultório</p>
            <h2 id="titulo-galeria" className="mt-4 max-w-xl text-[2rem] leading-[1.1] font-light text-taupe-950 sm:text-[2.4rem]">
              Um ambiente <span className="enfase">acolhedor</span> para a sua consulta.
            </h2>
          </div>
          <p className="max-w-sm text-taupe-800">Recepção, sala de espera e consultórios na Av. Ver. Antônio da Costa Rios, em Pouso Alegre.</p>
        </div>
        <ul className="mt-12 grid grid-flow-dense auto-rows-[160px] grid-cols-2 gap-3 sm:auto-rows-[190px] sm:grid-cols-5 lg:auto-rows-[210px]">
          {fotos.map((f, i) => (
            <li key={f.src} className={`overflow-hidden bg-pedra-100 ${formatos[i % formatos.length]}`}>
              <Surge atraso={i * 0.05} className="h-full">
                <Imagem f={f} className="transition-transform duration-700 ease-(--ease-encaixe) hover:scale-[1.03]" />
              </Surge>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ---------------- ATENDIMENTOS ---------------- */
export function Atendimentos() {
  const lista = atendimentosVisiveis()
  if (!lista.length) return null
  return (
    <section id="atendimentos" className="py-24 sm:py-32">
      <div className="container-site">
        <Cabeca
          rotulo="Atendimentos"
          titulo={['Atendimento', { enfase: 'amplo,' }, 'do cuidado preventivo à reabilitação.']}
          apoio={<p>Uma visão geral do que é feito no consultório. Em todos os casos, a indicação depende de avaliação individual.</p>}
        />
        <ul className="mt-14 grid border-t border-l border-pedra-200 sm:grid-cols-2 lg:grid-cols-3">
          {lista.map((a, i) => (
            <li key={a.id} className="group relative border-r border-b border-pedra-200 bg-gelo">
              <span
                aria-hidden
                className="pointer-events-none absolute top-0 right-0 size-16 origin-top-right scale-50 rounded-bl-full bg-pedra-100 opacity-0 transition-[transform,opacity] duration-500 ease-(--ease-encaixe) group-hover:scale-100 group-hover:opacity-100"
              />
              <Surge atraso={(i % 3) * 0.06} className="relative flex h-full flex-col p-7 sm:p-8">
                <div className="flex items-start justify-between">
                  <span className="text-taupe-700 transition-colors duration-300 group-hover:text-terracota">
                    <IconeAtendimento tipo={a.icone} />
                  </span>
                  <span className="font-display text-sm text-taupe-500 tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <h3 className="mt-6 text-[1.4rem] leading-tight font-normal text-taupe-950">{a.nome}</h3>
                <p className="mt-3 text-[0.98rem] text-taupe-800">{a.descricao}</p>
                <p className="mt-3 text-[0.85rem] text-taupe-700 italic">A indicação depende de avaliação individual.</p>
                <a
                  href={waLink(msgAtendimento(a.nomeCurto))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto inline-flex min-h-12 items-center gap-2 pt-6 text-[0.92rem] font-medium text-musgo"
                >
                  <IconeWhatsApp size={16} />
                  <span className="underline decoration-musgo/30 underline-offset-4 transition-colors group-hover:decoration-musgo">
                    Perguntar sobre {a.nomeCurto.toLowerCase()}
                  </span>
                  <span className="sr-only"> pelo WhatsApp (abre em nova aba)</span>
                </a>
              </Surge>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ---------------- QUANDO PROCURAR ---------------- */
export function QuandoProcurar() {
  const itens = [
    {
      t: 'Check-up periódico',
      d: 'Consultas de rotina ajudam a acompanhar dentes e gengivas mesmo quando nada incomoda. O intervalo entre elas é combinado com o dentista.',
    },
    {
      t: 'Dente do siso',
      d: 'É comum o dentista acompanhar os terceiros molares na adolescência e no início da vida adulta, com exames de imagem, para decidir se precisam ou não sair.',
    },
    {
      t: 'Perda de um dente',
      d: 'Quando um dente falta, os vizinhos podem se movimentar com o tempo. Uma avaliação mostra as alternativas de reposição para o seu caso.',
    },
    {
      t: 'Alinhamento dos dentes',
      d: 'Dentes desalinhados ou mordida desencaixada podem ser avaliados em qualquer idade, para entender se há indicação de aparelho.',
    },
    {
      t: 'Gengiva',
      d: 'Sangramento ao escovar, inchaço ou sensação de gengiva "baixa" são sinais que merecem ser observados em consulta.',
    },
  ]
  return (
    <section aria-labelledby="titulo-quando" className="escuro relative overflow-hidden bg-taupe-900 py-24 text-pedra-100 sm:py-32">
      <div aria-hidden className="grade-fina-clara pointer-events-none absolute inset-0" />
      <div className="container-site relative grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <p className="rotulo flex items-center gap-3 text-terracota-claro">
            <span aria-hidden className="inline-block size-2.5 rounded-tl-full bg-current" />
            Quando procurar
          </p>
          <h2 id="titulo-quando" className="mt-4 text-[2rem] leading-[1.1] font-light text-gelo sm:text-[2.6rem]">
            Situações em que vale <span className="enfase">conversar</span> com o dentista.
          </h2>
          <p className="mt-5 text-pedra-100/85">Informação geral, para ajudar você a decidir quando marcar uma avaliação.</p>
        </div>
        <ol className="border-t border-pedra-100/15">
          {itens.map((it, i) => (
            <li key={it.t} className="grid grid-cols-[3rem_1fr] gap-4 border-b border-pedra-100/15 py-7 sm:grid-cols-[4rem_1fr]">
              <span className="font-display text-[1.1rem] text-terracota-claro tabular-nums">{String(i + 1).padStart(2, '0')}</span>
              <Surge>
                <h3 className="text-[1.35rem] font-normal text-gelo">{it.t}</h3>
                <p className="mt-2 text-pedra-100/85">{it.d}</p>
              </Surge>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

/* ---------------- COMO FUNCIONA (linha do tempo adaptada do 21st.dev) ---------------- */
export function ComoFunciona() {
  const etapas = [
    { t: 'Contato e agendamento', d: 'Você chama pelo WhatsApp ou telefone e a equipe combina um dia e horário disponível.' },
    { t: 'Avaliação e escuta', d: 'Na primeira consulta, o dentista ouve o que você procura, examina e, se necessário, pede exames.' },
    { t: 'Plano explicado com clareza', d: 'As alternativas de tratamento são apresentadas com etapas, cuidados e o que esperar de cada uma.' },
    { t: 'Acompanhamento', d: 'Durante e depois do tratamento, as consultas de retorno ajudam a manter o que foi feito.' },
  ]
  return (
    <section id="como-funciona" className="py-24 sm:py-32">
      <div className="container-site grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <Cabeca
            rotulo="Como funciona"
            titulo={['Do primeiro contato ao', { enfase: 'acompanhamento.' }]}
            apoio={<p>Quatro etapas simples, sempre com hora marcada.</p>}
          />
          <div className="mt-8">
            <BotaoWhats variante="contorno" texto="Começar pelo WhatsApp" />
          </div>
        </div>
        <ol data-progresso className="relative pl-12 sm:pl-16">
          <span aria-hidden className="absolute top-2 bottom-2 left-[11px] w-px bg-pedra-200 sm:left-[15px]" />
          <span
            aria-hidden
            data-progresso-barra
            className="linha-progresso absolute top-2 bottom-2 left-[11px] w-px origin-top bg-terracota sm:left-[15px]"
          />
          {etapas.map((e, i) => (
            <li key={e.t} className="relative pb-14 last:pb-0">
              <span
                aria-hidden
                className="absolute top-1 -left-12 flex size-6 items-center justify-center bg-gelo sm:-left-16 sm:size-8"
              >
                <span className="block size-3 rounded-tl-full border border-terracota bg-gelo sm:size-4" />
              </span>
              <Surge atraso={0.05}>
                <p className="rotulo text-taupe-700">Etapa {String(i + 1).padStart(2, '0')}</p>
                <h3 className="mt-2 text-[1.6rem] leading-tight font-normal text-taupe-950">{e.t}</h3>
                <p className="mt-3 max-w-md text-taupe-800">{e.d}</p>
              </Surge>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

/* ---------------- ACESSIBILIDADE E ESTRUTURA ---------------- */
export function EstruturaLocal() {
  const blocos = [
    { t: 'Acessibilidade', i: <IconeAcesso />, itens: CONFIG.acessibilidade.filter((a) => a.includes('cadeirantes')) },
    {
      t: 'Chegada',
      i: <IconeCarro />,
      itens: [
        ...CONFIG.acessibilidade.filter((a) => !a.includes('cadeirantes')),
        'Atendimento com hora marcada',
      ],
    },
    { t: 'Formas de pagamento', i: <IconeCartao />, itens: CONFIG.pagamentos },
  ].filter((b) => b.itens.length)
  return (
    <section aria-labelledby="titulo-estrutura" className="bg-pedra-50 py-24 sm:py-32">
      <div className="container-site">
        <div className="max-w-2xl">
          <p className="rotulo flex items-center gap-3 text-terracota">
            <span aria-hidden className="inline-block size-2.5 rounded-tl-full bg-current" />
            Acessibilidade e estrutura
          </p>
          <h2 id="titulo-estrutura" className="mt-4 text-[2rem] leading-[1.1] font-light text-taupe-950 sm:text-[2.6rem]">
            Um espaço <span className="enfase">acessível</span> para todas as pessoas.
          </h2>
        </div>
        <div className="mt-14 grid gap-px bg-pedra-200 sm:grid-cols-3">
          {blocos.map((b, i) => (
            <Surge key={b.t} atraso={i * 0.08} className="bg-pedra-50 p-7 sm:p-8">
              <span className="text-musgo">{b.i}</span>
              <h3 className="mt-4 text-[1.35rem] font-normal text-taupe-950">{b.t}</h3>
              <ul className="mt-4 space-y-2.5">
                {b.itens.map((it) => (
                  <li key={it} className="flex gap-2.5 text-taupe-800">
                    <span className="mt-1 shrink-0 text-musgo">
                      <IconeCheck size={16} />
                    </span>
                    {it}
                  </li>
                ))}
              </ul>
            </Surge>
          ))}
        </div>

        {CONFIG.mostrarAcolhimento && CONFIG.acolhimento.length > 0 && (
          <Surge className="mt-10">
            <div className="flex flex-col gap-5 border border-musgo/30 bg-gelo p-7 sm:flex-row sm:items-center sm:gap-8 sm:p-8">
              <span className="text-musgo">
                <IconeAcolhimento size={32} />
              </span>
              <div>
                <h3 className="text-[1.3rem] font-normal text-taupe-950">Acolhimento</h3>
                <p className="mt-1 text-taupe-800">
                  {CONFIG.acolhimento.join('. ')}.
                </p>
              </div>
            </div>
          </Surge>
        )}
      </div>
    </section>
  )
}

/* ---------------- DÚVIDAS ---------------- */
function ItemFaq({ p, r }: { p: string; r: ReactNode }) {
  const [aberto, setAberto] = useState(false)
  const id = useId()
  return (
    <li className="border-b border-pedra-200">
      <h3 className="font-sans text-base">
        <button
          type="button"
          aria-expanded={aberto}
          aria-controls={`${id}-r`}
          id={`${id}-p`}
          onClick={() => setAberto((v) => !v)}
          className="flex min-h-16 w-full items-center justify-between gap-6 py-5 text-left font-display text-[1.2rem] font-normal text-taupe-950 sm:text-[1.3rem]"
        >
          {p}
          <span className={`shrink-0 transition-colors ${aberto ? 'text-terracota' : 'text-taupe-700'}`}>
            <IconeMais aberto={aberto} />
          </span>
        </button>
      </h3>
      <div
        id={`${id}-r`}
        role="region"
        aria-labelledby={`${id}-p`}
        className={`grid transition-[grid-template-rows,opacity] duration-400 ease-(--ease-encaixe) ${aberto ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
        inert={!aberto}
      >
        <div className="overflow-hidden">
          <div className="max-w-2xl pb-6 text-taupe-800">{r}</div>
        </div>
      </div>
    </li>
  )
}

export function Duvidas() {
  const h = horariosAgrupados()
  const faq: { p: string; r: ReactNode }[] = [
    { p: 'Preciso agendar?', r: 'Sim. O atendimento é feito com hora marcada. Você pode solicitar um horário pelo WhatsApp, pelo telefone ou pelo formulário deste site.' },
    {
      p: 'Como é a avaliação?',
      r: 'É uma conversa seguida de exame clínico. O dentista entende o que você procura, observa dentes e gengivas e, quando necessário, solicita exames complementares antes de indicar um tratamento.',
    },
    {
      p: 'Quais atendimentos há no consultório?',
      r: `${atendimentosVisiveis()
        .map((a) => a.nomeCurto)
        .join(', ')}. A indicação de cada um depende de avaliação individual.`,
    },
    {
      p: 'Quais são os horários? Atendem aos sábados?',
      r: (
        <>
          {h.map((x) => `${x.dias}: ${x.texto.toLowerCase()}`).join('; ')}. Sim, há atendimento no sábado pela manhã. Os horários
          podem variar em feriados.
        </>
      ),
    },
    {
      p: 'Onde fica e onde estaciono?',
      r: `${enderecoCompleto()}. Há estacionamento gratuito na rua, inclusive com vaga acessível para cadeirantes.`,
    },
    { p: 'Há acessibilidade?', r: 'Sim. A entrada, o assento, o banheiro e o estacionamento são acessíveis para cadeirantes.' },
    { p: 'Quais são as formas de pagamento?', r: `${CONFIG.pagamentos.join(', ')}. Para outras questões, fale com a equipe.` },
    {
      p: 'O que levar na primeira consulta?',
      r: 'De forma geral, um documento com foto, exames odontológicos recentes se você tiver e a lista de medicamentos que usa. Se tiver dúvidas, pergunte à equipe ao agendar.',
    },
    {
      p: 'Posso escolher com qual dentista serei atendido?',
      r: 'Você pode informar sua preferência ao solicitar o agendamento. A equipe confirma a disponibilidade.',
    },
  ]
  return (
    <section id="duvidas" className="py-24 sm:py-32">
      <div className="container-site grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <Cabeca rotulo="Dúvidas frequentes" titulo={['Perguntas antes da', { enfase: 'primeira' }, 'consulta.']} />
        </div>
        <ul className="border-t border-pedra-200">
          {faq.map((f) => (
            <ItemFaq key={f.p} {...f} />
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ---------------- CONTATO ---------------- */
export function Contato() {
  const [mapa, setMapa] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setMapa(true)
          io.disconnect()
        }
      },
      { rootMargin: '300px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  const linhas = [
    CONFIG.whatsapp && { href: waLink(undefined, CONFIG.whatsapp), rotulo: `WhatsApp ${formatarFone(CONFIG.whatsapp)}`, i: <IconeWhatsApp size={18} />, ext: true },
    CONFIG.whatsapp2 && { href: waLink(undefined, CONFIG.whatsapp2), rotulo: `WhatsApp ${formatarFone(CONFIG.whatsapp2)}`, i: <IconeWhatsApp size={18} />, ext: true },
    CONFIG.telefone && { href: telLink(CONFIG.telefone), rotulo: `Telefone ${formatarFone(CONFIG.telefone)}`, i: <IconeTelefone size={18} />, ext: false },
    CONFIG.instagram.url && { href: CONFIG.instagram.url, rotulo: CONFIG.instagram.usuario, i: <IconeInstagram size={18} />, ext: true },
  ].filter(Boolean) as { href: string; rotulo: string; i: ReactNode; ext: boolean }[]

  return (
    <section id="contato" className="bg-pedra-50 py-24 sm:py-32">
      <div className="container-site">
        <Cabeca rotulo="Localização e contato" titulo={['Venha nos', { enfase: 'visitar.' }]} />
        <div className="mt-14 grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-1">
            <div>
              <h3 className="flex items-center gap-2.5 text-[1.3rem] font-normal text-taupe-950">
                <span className="text-musgo"><IconeMapa /></span> Endereço
              </h3>
              <p className="mt-3 text-taupe-800">
                {CONFIG.endereco.rua}
                <br />
                {CONFIG.endereco.bairro}, {CONFIG.endereco.cidade} - {CONFIG.endereco.uf}
                <br />
                CEP {CONFIG.endereco.cep}
              </p>
              <a
                href={CONFIG.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex min-h-12 items-center gap-2 font-medium text-musgo underline decoration-musgo/30 underline-offset-4 hover:decoration-musgo"
              >
                Como chegar <IconeSeta size={16} />
                <span className="sr-only"> (abre o Google Maps em nova aba)</span>
              </a>
            </div>
            <div>
              <h3 className="flex items-center gap-2.5 text-[1.3rem] font-normal text-taupe-950">
                <span className="text-musgo"><IconeRelogio /></span> Horários
              </h3>
              <dl className="mt-3 space-y-1.5 text-taupe-800">
                {horariosAgrupados().map((x) => (
                  <div key={x.dias} className="flex justify-between gap-6 border-b border-pedra-200 pb-1.5">
                    <dt>{x.dias}</dt>
                    <dd className="tabular-nums">{x.texto}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-3 text-[0.9rem] text-taupe-700">Atendimento com hora marcada. Horários podem variar em feriados.</p>
            </div>
            <div className="sm:col-span-2 lg:col-span-1">
              <h3 className="text-[1.3rem] font-normal text-taupe-950">Fale com a clínica</h3>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {linhas.map((l) => (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      {...(l.ext ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      className="flex min-h-12 items-center gap-3 border border-pedra-200 bg-gelo px-4 text-taupe-900 transition-colors hover:border-taupe-700"
                    >
                      <span className="text-musgo">{l.i}</span>
                      <span className="tabular-nums [overflow-wrap:anywhere]">{l.rotulo}</span>
                      {l.ext && <span className="sr-only"> (abre em nova aba)</span>}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-[0.42fr_1fr]">
            {CONFIG.fotoFachada && (
              <div className="hidden overflow-hidden rounded-tl-[160px] bg-pedra-100 sm:block">
                <Imagem f={CONFIG.fotoFachada} className="object-[center_80%]" />
              </div>
            )}
            <div ref={ref} className="relative min-h-[320px] overflow-hidden border border-pedra-200 bg-pedra-100 sm:min-h-[460px]">
              {mapa ? (
                <iframe
                  title="Mapa: Odontologia Estética, Av. Ver. Antônio da Costa Rios, 318, Pouso Alegre"
                  src={CONFIG.mapaEmbed}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0 h-full w-full grayscale-[0.4]"
                />
              ) : (
                <div className="grade-fina absolute inset-0" aria-hidden />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------------- CTA FINAL ---------------- */
export function CtaFinal() {
  return (
    <section aria-labelledby="titulo-cta" className="escuro relative overflow-hidden bg-taupe-900 py-24 text-gelo sm:py-32">
      <div aria-hidden className="grade-fina-clara pointer-events-none absolute inset-0" />
      <div className="container-site relative grid items-center gap-12 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <TituloRevelado
            trechos={['Sua avaliação é o', { enfase: 'primeiro passo.' }]}
            className="text-[2.4rem] leading-[1.05] font-light tracking-[-0.02em] text-gelo sm:text-[3.4rem]"
          />
          <p className="mt-6 max-w-lg text-pedra-100/85">
            Converse com a equipe e escolha um horário. A consulta é marcada conforme a disponibilidade da agenda.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <BotaoWhats variante="claro" texto="Agendar pelo WhatsApp" />
            <a
              href={CONFIG.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center justify-center gap-2.5 border border-pedra-100/35 px-6 text-[0.95rem] font-medium text-gelo transition-colors hover:border-gelo hover:bg-taupe-800"
            >
              <IconeInstagram size={18} /> Ver no Instagram
              <span className="sr-only"> (abre em nova aba)</span>
            </a>
            {CONFIG.secoes.agendar && (
              <a href="#agendar" className="inline-flex min-h-12 items-center justify-center px-2 text-[0.95rem] text-pedra-100 underline decoration-pedra-100/40 underline-offset-4 hover:decoration-gelo">
                Usar o formulário
              </a>
            )}
          </div>
        </div>
        <Encaixe tom="escuro" className="mx-auto aspect-square w-full max-w-[340px]" />
      </div>
    </section>
  )
}

/* ---------------- RODAPÉ ---------------- */
export function Rodape() {
  const comCro = CONFIG.profissionais.filter((p) => p.cro)
  return (
    <footer className="bg-taupe-950 pt-16 pb-28 text-pedra-100 md:pb-16">
      <div className="container-site grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr]">
        <div className="flex items-start gap-4">
          <img src="/img/logo.webp" alt="Logo Odontologia Estética, Dr. André Totti e Dr. Douglas Barbosa" width={72} height={72} loading="lazy" className="size-[72px] rounded-full" />
          <div>
            <p className="font-display text-xl text-gelo">Odontologia Estética</p>
            <p className="text-[0.9rem]">Dr. André Totti &amp; Dr. Douglas Barbosa</p>
            {comCro.map((p) => (
              <p key={p.nome} className="text-[0.85rem] text-pedra-100/80">
                {p.nome} · {p.cro}
              </p>
            ))}
          </div>
        </div>
        <address className="text-[0.95rem] not-italic">
          {enderecoCompleto()}
          <br />
          <a className="inline-flex min-h-12 items-center underline decoration-pedra-100/30 underline-offset-4 hover:decoration-gelo" href={CONFIG.mapsUrl} target="_blank" rel="noopener noreferrer">
            Ver no mapa<span className="sr-only"> (abre em nova aba)</span>
          </a>
        </address>
        <ul className="space-y-1 text-[0.95rem]">
          <li>
            <a className="inline-flex min-h-10 items-center hover:text-gelo" href={waLink(undefined, CONFIG.whatsapp)} target="_blank" rel="noopener noreferrer">
              WhatsApp {formatarFone(CONFIG.whatsapp)}
            </a>
          </li>
          <li>
            <a className="inline-flex min-h-10 items-center hover:text-gelo" href={waLink(undefined, CONFIG.whatsapp2)} target="_blank" rel="noopener noreferrer">
              WhatsApp {formatarFone(CONFIG.whatsapp2)}
            </a>
          </li>
          <li>
            <a className="inline-flex min-h-10 items-center hover:text-gelo" href={telLink(CONFIG.telefone)}>
              Telefone {formatarFone(CONFIG.telefone)}
            </a>
          </li>
          <li>
            <a className="inline-flex min-h-10 items-center hover:text-gelo" href={CONFIG.instagram.url} target="_blank" rel="noopener noreferrer">
              Instagram {CONFIG.instagram.usuario}
            </a>
          </li>
        </ul>
      </div>
      <div className="container-site mt-12 flex flex-col gap-3 border-t border-pedra-100/15 pt-6 text-[0.85rem] text-pedra-100/80 sm:flex-row sm:justify-between">
        <p>Conteúdo informativo; a indicação de cada tratamento depende de avaliação individual.</p>
        <a href="/privacidade.html" className="inline-flex min-h-10 items-center underline decoration-pedra-100/30 underline-offset-4 hover:text-gelo">
          Privacidade
        </a>
      </div>
    </footer>
  )
}
