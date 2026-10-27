import { useId, useState } from 'react'
import { CONFIG, PROFISSIONAIS_EXEMPLO, enderecoCompleto, type Profissional } from '../config'
import { waLink } from '../lib/whatsapp'
import { BotaoMagnetico, Placeholder, Revelar, TituloSecao } from './ui/Primitivos'
import {
  IconeAcessivel,
  IconeAcolhimento,
  IconeCartao,
  IconeClareza,
  IconeEscuta,
  IconeEstacionamento,
  IconeInstagram,
  IconeLocal,
  IconeMais,
  IconeRelogio,
  IconeSeguranca,
  IconeSetaDiagonal,
  IconeTelefone,
  IconeWhatsApp,
} from './ui/Icones'

/* ───────────── Equipe ───────────── */

const iniciais = (nome: string) =>
  nome.startsWith('[')
    ? '?'
    : nome
        .split(' ')
        .filter((p) => p.length > 2)
        .slice(0, 2)
        .map((p) => p[0])
        .join('')

function CartaoProfissional({ p, i }: { p: Profissional; i: number }) {
  return (
    <Revelar as="li" atraso={i * 0.07} className="h-full">
      <article className="flex h-full flex-col rounded-[var(--radius-suave)] border border-tinta/10 bg-papel p-7">
        <div className="flex items-center gap-4">
          {p.foto ? (
            <img src={p.foto} alt={`Foto de ${p.nome}`} width={72} height={72} loading="lazy" className="h-[4.5rem] w-[4.5rem] rounded-full object-cover" />
          ) : (
            <span
              aria-hidden
              className="grid h-[4.5rem] w-[4.5rem] shrink-0 place-items-center rounded-full border border-dashed border-areia bg-marfim font-display text-2xl italic text-azul"
            >
              {iniciais(p.nome)}
            </span>
          )}
          <div>
            <p className="text-[0.72rem] font-bold uppercase tracking-[0.18em] text-verde">{p.categoria}</p>
          </div>
        </div>
        <h3 className="mt-6 text-[1.55rem] leading-tight">{p.nome}</h3>
        <dl className="mt-4 space-y-1.5 text-[0.92rem] text-suave">
          <div className="flex gap-2">
            <dt className="sr-only">Registro profissional</dt>
            <dd className="font-semibold text-tinta/85">{p.registro}</dd>
          </div>
          {p.especialidade && (
            <div>
              <dt className="sr-only">Especialidade</dt>
              <dd>{p.especialidade}</dd>
            </div>
          )}
        </dl>
        {p.exemplo && (
          <div className="mt-6">
            <Placeholder>Cartão de exemplo</Placeholder>
          </div>
        )}
      </article>
    </Revelar>
  )
}

export function Equipe() {
  const lista = CONFIG.profissionais.length ? CONFIG.profissionais : PROFISSIONAIS_EXEMPLO
  return (
    <section id="equipe" aria-labelledby="titulo-equipe" className="bg-papel py-24 lg:py-36">
      <div className="container-site">
        <TituloSecao
          id="titulo-equipe"
          eyebrow="Equipe"
          apoio="Cada profissional é apresentado com nome e registro no conselho da sua área (CRO ou CRM). Especialidades aparecem apenas quando registradas."
        >
          Quem <em className="destaque">cuida</em> de você.
        </TituloSecao>
        <ul className="mt-14 grid gap-5 md:grid-cols-3">
          {lista.map((p, i) => (
            <CartaoProfissional key={i} p={p} i={i} />
          ))}
        </ul>
        {!CONFIG.profissionais.length && (
          <p className="mt-8 text-sm text-suave">
            A lista de profissionais será publicada após a confirmação dos registros. <Placeholder />
          </p>
        )}
      </div>
    </section>
  )
}

/* ───────────── Compromissos (seção escura) ───────────── */

export function Compromissos() {
  const itens = [
    { Icone: IconeEscuta, titulo: 'Escuta', texto: 'Tempo para ouvir sua história antes de qualquer orientação.' },
    { Icone: IconeClareza, titulo: 'Clareza', texto: 'Explicações em linguagem simples, com espaço para perguntas.' },
    { Icone: IconeSeguranca, titulo: 'Segurança', texto: 'Atenção às normas de biossegurança e ao registro de cada atendimento.' },
    { Icone: IconeAcolhimento, titulo: 'Acolhimento', texto: 'Um ambiente tranquilo, em que você se sinta à vontade.' },
  ]
  return (
    <section aria-labelledby="titulo-compromissos" className="relative overflow-hidden bg-tinta py-24 text-marfim lg:py-36">
      <svg aria-hidden viewBox="0 0 600 600" className="pointer-events-none absolute -left-48 -top-24 h-[44rem] w-[44rem] text-verde-claro/15" fill="none">
        <path d="M300 120C240 30 90 40 70 170c-18 120 120 220 230 330" stroke="currentColor" />
        <path d="M300 120c60-90 210-80 230 50 18 120-120 220-230 330" stroke="currentColor" />
      </svg>
      <div className="container-site relative">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <TituloSecao id="titulo-compromissos" eyebrow="Compromissos de atendimento" claro>
            O que você pode <em className="destaque !text-verde-claro">esperar</em> daqui.
          </TituloSecao>
          <Revelar>
            <Placeholder>[A VALIDAR COM A CLÍNICA]</Placeholder>
          </Revelar>
        </div>
        <ul className="mt-16 grid gap-px overflow-hidden rounded-[var(--radius-suave)] bg-marfim/10 sm:grid-cols-2 lg:grid-cols-4">
          {itens.map(({ Icone, titulo, texto }, i) => (
            <Revelar as="li" key={titulo} atraso={i * 0.08} className="bg-tinta p-8 lg:p-9">
              <div className="flex items-center justify-between">
                <Icone width={28} height={28} className="text-verde-claro" />
                <span className="font-display text-sm italic text-marfim/50">0{i + 1}</span>
              </div>
              <h3 className="mt-10 text-[1.9rem] !text-marfim">{titulo}</h3>
              <p className="mt-3 text-[0.98rem] text-marfim/75">{texto}</p>
            </Revelar>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ───────────── Estrutura e conforto ───────────── */

export function Estrutura() {
  const fatos = [
    { Icone: IconeLocal, titulo: 'Localização central', texto: `${CONFIG.endereco.rua}, ${CONFIG.endereco.bairro}, ${CONFIG.endereco.cidade} - ${CONFIG.endereco.uf}.` },
    { Icone: IconeRelogio, titulo: 'Manhã e tarde', texto: 'Atendimento em dois turnos durante a semana e aos sábados pela manhã.' },
  ]
  const pendentes = [
    { Icone: IconeEstacionamento, titulo: 'Estacionamento' },
    { Icone: IconeAcessivel, titulo: 'Acessibilidade' },
    { Icone: IconeCartao, titulo: 'Formas de pagamento' },
  ]
  const espaco = CONFIG.fotos.espaco
  return (
    <section aria-labelledby="titulo-estrutura" className="py-24 lg:py-36">
      <div className="container-site grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <Revelar className="order-2 lg:order-1">
          {espaco ? (
            <img src={espaco.src} alt={espaco.alt} loading="lazy" className="aspect-[4/5] w-full rounded-t-[999px] rounded-b-[1.75rem] object-cover" />
          ) : (
            // Bloco reservado: substituir por foto real do espaço da clínica
            <div className="relative grid aspect-[4/5] w-full place-items-center overflow-hidden rounded-t-[999px] rounded-b-[1.75rem] bg-gradient-to-b from-nevoa to-[#cfdfd8]">
              <svg aria-hidden viewBox="0 0 200 180" className="absolute w-[85%] opacity-40">
                <path d="M100 46C90 22 66 8 42 12 16 17 2 42 6 70c4 32 38 62 94 100-12-40 12-90 0-124Z" fill="none" stroke="#154352" strokeWidth="0.6" />
                <path d="M100 46C110 22 134 8 158 12c26 5 40 30 36 58-4 32-38 62-94 100-12-40 12-90 0-124Z" fill="none" stroke="#2a736a" strokeWidth="0.6" />
              </svg>
              <p className="relative rounded-full border border-dashed border-azul/40 bg-papel/80 px-5 py-2.5 text-sm font-semibold text-azul">
                Foto da clínica (substituir)
              </p>
            </div>
          )}
        </Revelar>
        <div className="order-1 lg:order-2">
          <TituloSecao id="titulo-estrutura" eyebrow="Estrutura e conforto">
            Um lugar para chegar <em className="destaque">com calma</em>.
          </TituloSecao>
          <ul className="mt-12 space-y-8">
            {fatos.map(({ Icone, titulo, texto }, i) => (
              <Revelar as="li" key={titulo} atraso={i * 0.08} className="flex gap-5">
                <Icone width={26} height={26} className="mt-1 shrink-0 text-verde" />
                <div>
                  <h3 className="font-sans text-lg font-semibold tracking-normal">{titulo}</h3>
                  <p className="mt-1 text-suave">{texto}</p>
                </div>
              </Revelar>
            ))}
          </ul>
          <div className="filete my-10" />
          <ul className="grid gap-4 sm:grid-cols-3">
            {pendentes.map(({ Icone, titulo }) => (
              <li key={titulo} className="rounded-2xl border border-tinta/10 bg-papel p-5">
                <Icone width={22} height={22} className="text-azul" />
                <p className="mt-3 font-semibold text-tinta">{titulo}</p>
                <div className="mt-2">
                  <Placeholder>A confirmar</Placeholder>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

/* ───────────── Avaliações do Google (desligada por padrão) ───────────── */

export function AvaliacoesGoogle() {
  const n = CONFIG.notaGoogle
  if (!CONFIG.mostrarNotaGoogle || !n) return null
  // Só a nota e o link. Sem textos de depoimentos (vedado pelo CFM).
  return (
    <section aria-labelledby="titulo-google" className="py-16">
      <div className="container-site flex flex-col items-center gap-4 text-center">
        <h2 id="titulo-google" className="text-3xl">Avaliações no Google</h2>
        <p className="font-display text-5xl">{n.nota.toFixed(1).replace('.', ',')}</p>
        <p className="text-suave">{n.total} avaliações na ficha do Google</p>
        <a href={CONFIG.mapsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-2 font-semibold text-azul underline underline-offset-4">
          Ver no Google Maps <IconeSetaDiagonal width={16} height={16} />
        </a>
      </div>
    </section>
  )
}

/* ───────────── Dúvidas (acordeão acessível) ───────────── */

const PERGUNTAS: { p: string; r: string; confirmar?: boolean }[] = [
  {
    p: 'Como funciona a avaliação?',
    r: 'É o primeiro encontro com o profissional. Ele ouve o que você procura, conhece seu histórico e observa o que for necessário. Ao final, explica o que foi visto e quais caminhos podem ser considerados. A indicação de qualquer atendimento depende dessa avaliação individual.',
  },
  {
    p: 'A clínica atende odontologia e medicina no mesmo lugar?',
    r: 'Sim. A CIVAMI reúne as duas áreas no mesmo endereço, no Centro de Alfenas. Quando faz sentido para o seu caso, os profissionais podem conversar entre si sobre o seu cuidado.',
  },
  {
    p: 'Como agendar uma consulta?',
    r: 'Pelo WhatsApp. Envie uma mensagem contando o que você procura, e a equipe informa os horários disponíveis. A consulta fica marcada somente depois da confirmação da clínica.',
  },
  {
    p: 'Onde fica e quais são os horários?',
    r: `A clínica fica na ${enderecoCompleto()}. O atendimento é de terça a sexta, das 8h às 12h e das 13h às 18h, e aos sábados, das 8h às 12h. O horário de segunda-feira está em confirmação. Os horários podem variar em feriados.`,
  },
  {
    p: 'Quais são as formas de pagamento?',
    r: 'Informação em confirmação com a clínica. Enquanto isso, pergunte pelo WhatsApp.',
    confirmar: true,
  },
  {
    p: 'A clínica atende por convênio?',
    r: 'Informação em confirmação com a clínica. Enquanto isso, pergunte pelo WhatsApp.',
    confirmar: true,
  },
  {
    p: 'Quais especialidades estão disponíveis?',
    r: 'A lista de atendimentos e especialidades está sendo confirmada com a clínica e será publicada aqui, com o registro de cada profissional.',
    confirmar: true,
  },
  {
    p: 'O que devo levar no dia da consulta?',
    r: 'A equipe informa no momento do agendamento. De modo geral, vale ter em mãos um documento com foto e, se houver, exames e receitas recentes.',
  },
  {
    p: 'Posso ser atendido nas duas áreas no mesmo dia?',
    r: 'Depende da agenda de cada profissional e da avaliação de cada caso. Pergunte pelo WhatsApp para verificar as possibilidades.',
  },
  {
    p: 'As informações deste site substituem uma consulta?',
    r: 'Não. O conteúdo é apenas informativo. Somente uma avaliação individual pode indicar o que é adequado para você.',
  },
]

function ItemDuvida({ p, r, confirmar, aberto, alternar }: { p: string; r: string; confirmar?: boolean; aberto: boolean; alternar: () => void }) {
  const id = useId()
  return (
    <li className="border-b border-tinta/12">
      <h3 className="font-sans text-[1.05rem] font-semibold tracking-normal sm:text-lg">
        <button
          type="button"
          id={`${id}-b`}
          aria-expanded={aberto}
          aria-controls={`${id}-p`}
          onClick={alternar}
          className="flex min-h-16 w-full items-center justify-between gap-6 py-5 text-left text-tinta"
        >
          <span>{p}</span>
          <span
            aria-hidden
            className={`grid h-10 w-10 shrink-0 place-items-center rounded-full border transition-[transform,background-color,border-color] duration-500 ${
              aberto ? 'rotate-45 border-tinta bg-tinta text-marfim' : 'border-tinta/20 text-tinta'
            }`}
          >
            <IconeMais width={18} height={18} />
          </span>
        </button>
      </h3>
      <div id={`${id}-p`} role="region" aria-labelledby={`${id}-b`} className="acordeao-painel" data-aberto={aberto} inert={!aberto}>
        <div className="overflow-hidden">
          <p className="max-w-2xl pb-7 pr-14 text-suave">
            {r} {confirmar && <Placeholder />}
          </p>
        </div>
      </div>
    </li>
  )
}

export function Duvidas() {
  const [aberto, setAberto] = useState<number | null>(0)
  return (
    <section id="duvidas" aria-labelledby="titulo-duvidas" className="bg-papel py-24 lg:py-36">
      <div className="container-site grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-40">
            <TituloSecao id="titulo-duvidas" eyebrow="Dúvidas frequentes">
              Perguntas <em className="destaque">comuns</em>, respostas diretas.
            </TituloSecao>
            <Revelar atraso={0.1}>
              <p className="mt-6 text-suave">Não encontrou o que procurava?</p>
              <a href={waLink()} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex min-h-12 items-center gap-2 font-semibold text-azul underline-offset-4 hover:underline">
                Pergunte pelo WhatsApp <IconeSetaDiagonal width={16} height={16} />
              </a>
            </Revelar>
          </div>
        </div>
        <ul className="border-t border-tinta/12 lg:col-span-8">
          {PERGUNTAS.map((q, i) => (
            <ItemDuvida key={q.p} {...q} aberto={aberto === i} alternar={() => setAberto(aberto === i ? null : i)} />
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ───────────── Localização e contato ───────────── */

function Mapa() {
  const [carregar, setCarregar] = useState(false)
  const q = encodeURIComponent(enderecoCompleto())
  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-suave)] border border-tinta/10 bg-nevoa lg:aspect-auto lg:h-full lg:min-h-[28rem]">
      {carregar ? (
        <iframe
          title={`Mapa: ${CONFIG.nome}, ${enderecoCompleto()}`}
          src={`https://www.google.com/maps?q=${q}&output=embed`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 h-full w-full border-0"
        />
      ) : (
        // O mapa só carrega com um toque: sem cookies de terceiros antes disso.
        <div className="absolute inset-0 grid place-items-center p-6 text-center">
          <svg aria-hidden className="absolute inset-0 h-full w-full text-azul/10" preserveAspectRatio="none" viewBox="0 0 400 300" fill="none">
            {[40, 90, 150, 210, 260].map((y) => (
              <path key={y} d={`M0 ${y}C100 ${y - 30} 220 ${y + 30} 400 ${y - 10}`} stroke="currentColor" strokeWidth="1" />
            ))}
            {[70, 160, 250, 330].map((x) => (
              <path key={x} d={`M${x} 0C${x + 20} 100 ${x - 20} 200 ${x + 10} 300`} stroke="currentColor" strokeWidth="1" />
            ))}
          </svg>
          <div className="relative flex flex-col items-center">
            <span className="grid h-14 w-14 place-items-center rounded-full bg-tinta text-marfim">
              <IconeLocal width={24} height={24} />
            </span>
            <p className="mt-4 max-w-xs font-semibold text-tinta">{enderecoCompleto()}</p>
            <button
              type="button"
              onClick={() => setCarregar(true)}
              className="mt-5 inline-flex min-h-12 items-center rounded-full border border-tinta/25 bg-papel px-5 text-sm font-semibold text-tinta hover:border-tinta"
            >
              Mostrar mapa do Google
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

const intervalo = (h: (typeof CONFIG.horarios)[number]) =>
  h.abre.length ? h.abre.map((a, i) => `${a.replace(':00', 'h')} – ${h.fecha[i].replace(':00', 'h')}`).join(' · ') : 'Fechado'

export function Contato() {
  return (
    <section id="contato" aria-labelledby="titulo-contato" className="py-24 lg:py-36">
      <div className="container-site grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <TituloSecao id="titulo-contato" eyebrow="Localização e contato">
            Venha conhecer a <em className="destaque">CIVAMI</em>.
          </TituloSecao>

          <Revelar atraso={0.05} className="mt-10 space-y-8">
            <div>
              <h3 className="flex items-center gap-2 font-sans text-xs font-bold uppercase tracking-[0.2em] text-azul">
                <IconeLocal width={16} height={16} /> Endereço
              </h3>
              <address className="mt-3 text-lg not-italic text-tinta">
                {CONFIG.endereco.rua} - {CONFIG.endereco.bairro}
                <br />
                {CONFIG.endereco.cidade} - {CONFIG.endereco.uf}, {CONFIG.endereco.cep}
              </address>
            </div>

            <div>
              <h3 className="flex items-center gap-2 font-sans text-xs font-bold uppercase tracking-[0.2em] text-azul">
                <IconeRelogio width={16} height={16} /> Horários
              </h3>
              <table className="mt-3 w-full text-[0.98rem]">
                <caption className="sr-only">Horários de atendimento (pausa para almoço das 12h às 13h)</caption>
                <tbody>
                  {CONFIG.horarios.map((h) => (
                    <tr key={h.dia} className="border-b border-tinta/10">
                      <th scope="row" className="py-2.5 pr-4 text-left font-medium text-tinta">
                        {h.dia}
                      </th>
                      <td className="py-2.5 text-right text-suave">
                        {intervalo(h)}
                        {h.confirmar && (
                          <span className="ml-2 align-middle">
                            <Placeholder>Confirmar</Placeholder>
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-3 text-sm text-suave">Pausa para almoço das 12h às 13h. {CONFIG.observacaoHorario}</p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a href={CONFIG.mapsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-tinta px-6 font-semibold text-marfim transition-colors hover:bg-azul">
                <IconeLocal width={18} height={18} /> Como chegar
              </a>
              <a href={waLink()} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-tinta/25 px-6 font-semibold text-tinta transition-colors hover:border-tinta">
                <IconeWhatsApp width={18} height={18} /> {CONFIG.telefoneExibicao}
              </a>
              <a href={CONFIG.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-tinta/25 px-6 font-semibold text-tinta transition-colors hover:border-tinta">
                <IconeInstagram width={18} height={18} /> {CONFIG.instagramHandle}
              </a>
            </div>
          </Revelar>
        </div>
        <Revelar atraso={0.1} className="lg:col-span-7">
          <Mapa />
        </Revelar>
      </div>
    </section>
  )
}

/* ───────────── CTA final e rodapé ───────────── */

export function ChamadaFinal() {
  return (
    <section aria-labelledby="titulo-cta" className="relative overflow-hidden bg-tinta py-28 text-center text-marfim lg:py-40">
      <svg aria-hidden viewBox="0 0 200 180" className="pointer-events-none absolute left-1/2 top-1/2 w-[46rem] max-w-none -translate-x-1/2 -translate-y-1/2 opacity-[0.07]">
        <path d="M100 46C90 22 66 8 42 12 16 17 2 42 6 70c4 32 38 62 94 100-12-40 12-90 0-124Z" fill="#6fa596" />
        <path d="M100 46C110 22 134 8 158 12c26 5 40 30 36 58-4 32-38 62-94 100-12-40 12-90 0-124Z" fill="#dce8e3" />
      </svg>
      <div className="container-site relative">
        <Revelar>
          <p className="eyebrow !text-verde-claro">Agendamento</p>
          <h2 id="titulo-cta" className="mx-auto mt-6 max-w-4xl text-[2.6rem] !text-marfim sm:text-6xl lg:text-7xl">
            Seu cuidado começa com uma <em className="destaque !text-verde-claro">conversa</em>.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-marfim/75">
            Envie uma mensagem pelo WhatsApp. A equipe responde com os horários disponíveis.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <BotaoMagnetico href={waLink()} externo variante="claro">
              <IconeWhatsApp width={18} height={18} /> Agendar pelo WhatsApp
            </BotaoMagnetico>
            <BotaoMagnetico href={CONFIG.instagram} externo variante="contorno-claro">
              <IconeInstagram width={18} height={18} /> Ver no Instagram
            </BotaoMagnetico>
          </div>
        </Revelar>
      </div>
    </section>
  )
}

export function Rodape() {
  const rt = CONFIG.responsaveisTecnicos
  return (
    <footer className="bg-marfim pb-28 pt-16 md:pb-12">
      <div className="container-site">
        <div className="grid gap-12 border-b border-tinta/10 pb-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <img src="/brand/logo-civami.png" alt="CIVAMI Clínica de Saúde" width={126} height={124} loading="lazy" className="h-auto w-[7.5rem]" />
            <p className="mt-5 max-w-xs text-sm text-suave">{CONFIG.posicionamento}. Alfenas - MG.</p>
          </div>
          <div className="md:col-span-4">
            <h2 className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-azul">Responsáveis técnicos</h2>
            <dl className="mt-4 space-y-4 text-sm">
              <div>
                <dt className="text-suave">Odontologia</dt>
                <dd className="mt-0.5 font-semibold text-tinta">
                  {rt.odontologia.nome} · {rt.odontologia.registro}
                </dd>
              </div>
              <div>
                <dt className="text-suave">Medicina (diretor técnico)</dt>
                <dd className="mt-0.5 font-semibold text-tinta">
                  {rt.medicina.nome} · {rt.medicina.registro}
                </dd>
              </div>
            </dl>
            <div className="mt-4">
              <Placeholder />
            </div>
          </div>
          <div className="md:col-span-4">
            <h2 className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-azul">Contato</h2>
            <ul className="mt-4 space-y-1 text-sm">
              <li>
                <a href={waLink()} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 text-tinta hover:text-azul">
                  <IconeTelefone width={16} height={16} /> {CONFIG.telefoneExibicao} (WhatsApp)
                </a>
              </li>
              <li>
                <a href={CONFIG.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 text-tinta hover:text-azul">
                  <IconeInstagram width={16} height={16} /> {CONFIG.instagramHandle}
                </a>
              </li>
              <li>
                <a href={CONFIG.mapsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-start gap-2 py-2 text-tinta hover:text-azul">
                  <IconeLocal width={16} height={16} className="mt-0.5 shrink-0" /> {enderecoCompleto()}
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col gap-4 pt-8 text-xs text-suave md:flex-row md:items-center md:justify-between">
          <p className="max-w-xl">Conteúdo informativo; a indicação de cada atendimento depende de avaliação individual.</p>
          <div className="flex items-center gap-5">
            <a href="/privacidade.html" className="inline-flex min-h-11 items-center underline underline-offset-4 hover:text-tinta">
              Privacidade
            </a>
            <span>© {new Date().getFullYear()} {CONFIG.nome}</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
