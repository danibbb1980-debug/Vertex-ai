import { useState } from 'react'
import { CONFIG, enderecoLinha, linkWhatsApp } from '../config'
import {
  Arco,
  BotaoWhatsApp,
  CabecalhoSecao,
  ComConfirmar,
  Foto,
  IconeAcesso,
  IconeCarro,
  IconeCartao,
  IconeInstagram,
  IconeLocal,
  IconeMais,
  IconeRelogio,
  IconeSeta,
  Logo,
  SeloConfirmar,
} from '../components/base'

function Horarios({ claro = false }: { claro?: boolean }) {
  return (
    <>
      <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2">
        {CONFIG.horarios.map((h) => (
          <div key={h.dias} className="contents">
            <dt className={claro ? 'text-ivory/70' : 'text-tinta-suave'}>{h.dias}</dt>
            <dd className={`font-semibold ${claro ? 'text-ivory' : 'text-tinta'}`}>{h.horas}</dd>
          </div>
        ))}
      </dl>
      <p className={`mt-3 text-sm italic ${claro ? 'text-ivory/70' : 'text-tinta-suave'}`}>{CONFIG.observacaoHorarios}</p>
    </>
  )
}

export function Estrutura() {
  const itens = [
    { Icone: IconeLocal, titulo: 'Endereço', valor: <ComConfirmar texto={enderecoLinha()} /> },
    { Icone: IconeRelogio, titulo: 'Horários', valor: <Horarios /> },
    { Icone: IconeCarro, titulo: 'Estacionamento', valor: <ComConfirmar texto={CONFIG.pendentes.estacionamento} /> },
    { Icone: IconeAcesso, titulo: 'Acessibilidade', valor: <ComConfirmar texto={CONFIG.pendentes.acessibilidade} /> },
    { Icone: IconeCartao, titulo: 'Formas de pagamento', valor: <ComConfirmar texto={CONFIG.pendentes.pagamento} /> },
  ]
  return (
    <section aria-labelledby="titulo-estrutura" className="bg-ivory py-24 sm:py-32">
      <div className="container-vc grid gap-14 lg:grid-cols-[1fr_1fr] lg:gap-20">
        <div>
          <CabecalhoSecao
            id="titulo-estrutura"
            rotulo="Estrutura e conforto"
            titulo={
              <>
                Uma clínica <em>nova</em>, na Vila Formosa.
              </>
            }
            intro={
              CONFIG.rascunho
                ? 'Um espaço novo, pensado para receber você com calma. Abaixo, o que já está confirmado e o que ainda vamos detalhar.'
                : 'Um espaço novo, pensado para receber você com calma. Endereço, horários e informações práticas para a sua visita.'
            }
          />
          <dl className="mt-12 divide-y divide-linho border-y border-linho">
            {itens.map(({ Icone, titulo, valor }) => (
              <div key={titulo} className="revela grid grid-cols-[2rem_1fr] gap-4 py-6 sm:grid-cols-[2rem_11rem_1fr]">
                <Icone tamanho={22} className="mt-0.5 text-ouro" />
                <dt className="font-semibold text-tinta">{titulo}</dt>
                <dd className="col-start-2 text-tinta-suave sm:col-start-3">{valor}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="grid content-start gap-5">
          <figure className="revela relative overflow-hidden rounded-t-[999px] rounded-b-2xl bg-linho">
            <Foto
              nome="fachada"
              larguras={[480, 720]}
              sizes="(min-width: 1024px) 34rem, 92vw"
              alt="Fachada da clínica Vilhena Carvalho Odontologia, com o logo VC e o nome iluminados sobre a entrada de vidro"
              largura={720}
              altura={960}
              className="aspect-[4/5] h-auto w-full object-cover sm:aspect-[5/5] lg:aspect-[4/5]"
            />
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy-900/85 to-transparent p-6 pt-16 text-sm text-ivory">
              Fachada da clínica, em Alfenas.
            </figcaption>
          </figure>
          {CONFIG.rascunho && (
            <div className="grid grid-cols-2 gap-5">
              {['Recepção', 'Consultório'].map((t) => (
                <div
                  key={t}
                  className="relative flex aspect-[4/3] flex-col items-center justify-center gap-2 overflow-hidden rounded-xl border border-dashed border-ouro/50 bg-linho/60 p-4 text-center text-sm text-tinta-suave"
                >
                  <Arco className="absolute -right-10 -top-10 h-32 w-32 text-ouro/25" />
                  <span className="font-display text-xl italic text-tinta">{t}</span>
                  Foto do espaço (substituir)
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export function Avaliacoes() {
  const n = CONFIG.notaGoogle
  if (!CONFIG.mostrarNotaGoogle || !n) return null
  return (
    <section aria-labelledby="titulo-avaliacoes" className="bg-sand py-20">
      <div className="container-vc flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="rotulo text-ouro">Google</p>
          <h2 id="titulo-avaliacoes" className="mt-3 text-4xl text-tinta">
            Nota {n.nota.toLocaleString('pt-BR')} no Google, com {n.total} avaliações
          </h2>
        </div>
        <a href={CONFIG.maps.url} target="_blank" rel="noopener noreferrer" className="botao botao-contorno-escuro">
          Ver no Google Maps
          <IconeSeta tamanho={16} className="seta" />
        </a>
      </div>
    </section>
  )
}

const DUVIDAS: { p: string; r: string }[] = [
  {
    p: 'Como funciona a avaliação?',
    r: 'É uma consulta para conhecer você, entender o que te trouxe até aqui e examinar a sua saúde bucal. Se for preciso, pedimos exames complementares. Ao final, explicamos as possibilidades para o seu caso e os próximos passos.',
  },
  {
    p: 'O que é um implante dentário, de forma geral?',
    r: 'De forma geral, é uma peça instalada no osso para substituir a raiz de um dente perdido. Sobre ela é fixada uma coroa ou uma prótese. Se o implante é indicado para você, só a avaliação individual pode dizer.',
  },
  {
    p: 'O que é uma prótese protocolo, de forma geral?',
    r: 'É uma prótese fixa que repõe os dentes de uma arcada inteira e fica apoiada sobre implantes. Exige higiene diária e consultas de acompanhamento. A indicação depende de cada caso.',
  },
  {
    p: 'O que é reabilitação oral?',
    r: 'É o planejamento integrado para cuidar dos dentes, da mordida e da função mastigatória como um todo. Pode combinar diferentes tratamentos, organizados em etapas a partir do diagnóstico.',
  },
  {
    p: 'Quanto tempo leva um tratamento?',
    r: 'Depende de cada caso. As etapas e os prazos são explicados no planejamento, depois da avaliação.',
  },
  {
    p: 'Como agendar?',
    r: `Pelo WhatsApp ${CONFIG.whatsappExibicao}. Mande uma mensagem e combinamos o horário da sua avaliação.`,
  },
  {
    p: 'Onde fica a clínica e quais os horários?',
    r: `${enderecoLinha()}. Segunda a sexta, das 09h às 19h; sábado, das 08h às 12h; domingo, fechado. ${CONFIG.observacaoHorarios} [endereço e horários a confirmar]`,
  },
  { p: 'Quais são as formas de pagamento?', r: CONFIG.pendentes.pagamento },
  { p: 'A clínica atende convênios?', r: CONFIG.pendentes.convenios },
]

export function Duvidas() {
  return (
    <section id="duvidas" aria-labelledby="titulo-duvidas" className="border-t border-linho bg-ivory py-24 sm:py-32">
      <div className="container-vc grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div className="lg:sticky lg:top-36 lg:self-start">
          <CabecalhoSecao
            id="titulo-duvidas"
            rotulo="Dúvidas frequentes"
            titulo={
              <>
                Perguntas que <em>sempre</em> aparecem.
              </>
            }
            intro="Respostas gerais e educativas. A indicação de cada tratamento depende de avaliação individual."
          />
        </div>
        <div className="border-t border-linho">
          {DUVIDAS.map((d, i) => (
            <details key={d.p} className="duvida group border-b border-linho">
              <summary className="flex min-h-16 cursor-pointer items-center gap-5 py-5 text-left">
                <span aria-hidden="true" className="rotulo w-7 shrink-0 text-ouro">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="flex-1 font-display text-[1.45rem] leading-snug text-tinta sm:text-[1.65rem]">{d.p}</span>
                <span className="mais flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-tinta/20 text-tinta">
                  <IconeMais tamanho={18} />
                </span>
              </summary>
              <div className="resposta pb-7 pl-12 pr-4 leading-relaxed text-tinta-suave sm:pr-16">
                <p>
                  <ComConfirmar texto={d.r} />
                </p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

function Mapa() {
  const [carregar, setCarregar] = useState(false)
  if (carregar) {
    return (
      <iframe
        title={`Mapa: localização da ${CONFIG.nome} em Alfenas - MG`}
        src={CONFIG.maps.embed}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="h-full min-h-[24rem] w-full rounded-2xl border-0"
      />
    )
  }
  return (
    <div className="escuro relative flex h-full min-h-[24rem] flex-col items-center justify-center overflow-hidden rounded-2xl bg-navy-900 p-8 text-center text-ivory">
      <Arco className="absolute -left-24 -top-24 h-96 w-96 text-champagne/10" />
      <Arco className="absolute -bottom-32 -right-24 h-96 w-96 rotate-180 text-champagne/10" />
      <IconeLocal tamanho={34} className="text-champagne" />
      <p className="mt-5 font-display text-2xl">Vila Formosa · Alfenas - MG</p>
      <p className="mt-2 max-w-xs text-sm text-ivory/70">O mapa do Google só é carregado se você pedir.</p>
      <button type="button" onClick={() => setCarregar(true)} className="botao botao-contorno-claro mt-7">
        Mostrar o mapa aqui
      </button>
    </div>
  )
}

export function Localizacao() {
  return (
    <section id="contato" aria-labelledby="titulo-contato" className="bg-sand py-24 sm:py-32">
      <div className="container-vc grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <div>
          <CabecalhoSecao
            id="titulo-contato"
            rotulo="Localização e contato"
            titulo={
              <>
                Venha conhecer a <em>V&amp;C</em>.
              </>
            }
          />
          <div className="revela mt-10 space-y-8">
            <div className="flex gap-4">
              <IconeLocal tamanho={22} className="mt-1 shrink-0 text-ouro" />
              <div>
                <p className="text-lg text-tinta">
                  <ComConfirmar texto={enderecoLinha()} />
                </p>
                <SeloConfirmar className="mt-3 text-ouro">Endereço a confirmar</SeloConfirmar>
              </div>
            </div>
            <div className="flex gap-4">
              <IconeRelogio tamanho={22} className="mt-1 shrink-0 text-ouro" />
              <div className="flex-1">
                <Horarios />
                <SeloConfirmar className="mt-3 text-ouro">Horários a confirmar</SeloConfirmar>
              </div>
            </div>
          </div>
          <div className="revela mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a href={CONFIG.maps.url} target="_blank" rel="noopener noreferrer" className="botao botao-azul">
              <IconeLocal tamanho={19} />
              Como chegar
              <IconeSeta tamanho={16} className="seta" />
            </a>
            <BotaoWhatsApp variante="contorno-escuro">WhatsApp {CONFIG.whatsappExibicao}</BotaoWhatsApp>
            <a href={CONFIG.instagram.url} target="_blank" rel="noopener noreferrer" className="botao botao-contorno-escuro">
              <IconeInstagram tamanho={19} />
              Instagram
            </a>
          </div>
        </div>
        <div className="revela">
          <Mapa />
        </div>
      </div>
    </section>
  )
}

export function CtaFinal() {
  return (
    <section aria-labelledby="titulo-cta" className="escuro relative isolate overflow-hidden bg-navy-900 py-24 text-center text-ivory sm:py-32">
      <Arco className="absolute left-1/2 top-1/2 -z-10 h-[52rem] w-[52rem] -translate-x-1/2 -translate-y-1/2 text-champagne/10" />
      <div className="container-vc revela">
        <p className="rotulo flex items-center justify-center gap-4 text-champagne">
          <span className="filete" /> Agende <span className="filete" />
        </p>
        <h2 id="titulo-cta" className="titulo-secao mx-auto mt-6 max-w-4xl text-ivory">
          Seu próximo passo começa com uma <em className="text-champagne">avaliação</em>.
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg text-ivory/75">
          Mande uma mensagem pelo WhatsApp e combine um horário para conversar com a gente.
        </p>
        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <BotaoWhatsApp>Agendar pelo WhatsApp</BotaoWhatsApp>
          <a href={CONFIG.instagram.url} target="_blank" rel="noopener noreferrer" className="botao botao-contorno-claro">
            <IconeInstagram tamanho={19} />
            Ver no Instagram
          </a>
        </div>
      </div>
    </section>
  )
}

export function Rodape() {
  const ano = 2026
  return (
    <footer className="escuro bg-navy-950 pb-28 pt-16 text-ivory/75">
      <div className="container-vc">
        <div className="grid gap-12 border-b border-champagne/15 pb-12 md:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-4">
              <Logo tamanho={56} />
              <p className="flex flex-col leading-none text-ivory">
                <span className="font-display text-xl font-semibold tracking-[0.2em]">VILHENA CARVALHO</span>
                <span className="mt-1.5 text-[0.6875rem] tracking-[0.42em] text-champagne">ODONTOLOGIA</span>
              </p>
            </div>
            <p className="mt-6 max-w-sm text-sm leading-relaxed">
              {CONFIG.nome}. Implantes, próteses sobre implante e reabilitação oral em Alfenas - MG.
            </p>
          </div>
          <div className="text-sm">
            <p className="rotulo text-champagne">Responsabilidade técnica</p>
            <p className="mt-4 text-ivory">{CONFIG.otavio.nome}</p>
            <p>Responsável técnico</p>
            <p>
              <ComConfirmar texto={CONFIG.otavio.cro} />
            </p>
            <p className="mt-4 text-ivory">{CONFIG.tales.nome}</p>
            <p>
              <ComConfirmar texto={CONFIG.tales.cro} />
            </p>
          </div>
          <div className="text-sm">
            <p className="rotulo text-champagne">Contato</p>
            <ul className="mt-4 space-y-1">
              <li>
                <a href={linkWhatsApp()} target="_blank" rel="noopener noreferrer" className="link-sublinhado inline-flex min-h-11 items-center">
                  WhatsApp {CONFIG.whatsappExibicao}
                </a>
              </li>
              <li>
                <a href={CONFIG.instagram.url} target="_blank" rel="noopener noreferrer" className="link-sublinhado inline-flex min-h-11 items-center">
                  Instagram {CONFIG.instagram.usuario}
                </a>
              </li>
              <li>
                <a href={CONFIG.maps.url} target="_blank" rel="noopener noreferrer" className="link-sublinhado inline-flex min-h-11 items-center">
                  Ver no Google Maps
                </a>
              </li>
              <li className="pt-2">
                <ComConfirmar texto={enderecoLinha()} />
              </li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col gap-4 pt-8 text-xs leading-relaxed sm:flex-row sm:items-center sm:justify-between">
          <p>Conteúdo informativo; a indicação de cada tratamento depende de avaliação individual.</p>
          <p className="flex flex-wrap items-center gap-x-4">
            <a href="/privacidade.html" className="link-sublinhado inline-flex min-h-11 items-center">
              Privacidade
            </a>
            <span>
              © {ano} {CONFIG.nome}
            </span>
          </p>
        </div>
      </div>
    </footer>
  )
}
