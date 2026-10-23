import { useEffect, useState } from 'react'
import { m as motion } from 'motion/react'
import {
  CONFIG,
  areasVisiveis,
  enderecoCompleto,
  mapsDirectionsUrl,
  mapsEmbedUrl,
  whatsappUrl,
} from './config'
import { DraftBanner, Header, Signature } from './components/Header'
import { Accordion, ArrowIcon, MagneticLink, Reveal, SectionLabel, WhatsAppIcon, type FaqItem } from './components/ui'

const EASE = [0.22, 1, 0.36, 1] as const
const AVISO = 'Este site tem caráter exclusivamente informativo e não constitui aconselhamento jurídico nem oferta de serviços.'

/* ---------- Hero ---------- */

function Portrait({ className = '' }: { className?: string }) {
  if (!CONFIG.foto.src) {
    return (
      <div className={`grid aspect-square place-items-center border border-dashed border-bronze/50 bg-night-2 text-center ${className}`}>
        <span className="label px-4 text-mist">Foto do advogado (substituir)</span>
      </div>
    )
  }
  return (
    <img
      src={CONFIG.foto.src}
      srcSet={`${CONFIG.foto.src} 1x, ${CONFIG.foto.src2x} 2x`}
      alt={CONFIG.foto.alt}
      width={150}
      height={150}
      decoding="async"
      className={`aspect-square object-cover [filter:saturate(.72)_contrast(1.04)] ${className}`}
    />
  )
}

const LINES: { text: string; italic?: boolean }[][] = [
  [{ text: 'Defesa técnica,' }],
  [{ text: 'com ' }, { text: 'seriedade', italic: true }],
  [{ text: 'e discrição.' }],
]

function Hero() {
  return (
    <section id="inicio" aria-labelledby="hero-title" className="relative overflow-hidden bg-night text-ivory">
      {/* textura discreta: gradiente e grade de filetes */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_85%_10%,#1f2b3d_0%,transparent_55%),linear-gradient(180deg,#131b27_0%,#0f1217_100%)]" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-line-dark" />

      <div className="wrap relative grid min-h-[100svh] items-center gap-14 pt-[calc(var(--banner-h,0px)+7rem)] pb-20 md:grid-cols-12 md:gap-8 md:pb-24">
        <div className="md:col-span-7 lg:col-span-7">
          <motion.p
            className="label flex items-center gap-4 text-bronze"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: EASE }}
          >
            <span aria-hidden="true" className="h-px w-10 bg-bronze/60" />
            Advocacia criminal
          </motion.p>

          <h1 id="hero-title" className="display mt-8 text-[clamp(2.9rem,9vw,6.4rem)] text-ivory">
            {LINES.map((line, i) => (
              <span key={i} className="block overflow-hidden pb-[0.08em]">
                <motion.span
                  className="block"
                  initial={{ y: '105%' }}
                  animate={{ y: '0%' }}
                  transition={{ duration: 1.2, delay: 0.15 + i * 0.14, ease: EASE }}
                >
                  {line.map((part) =>
                    part.italic ? (
                      <em key={part.text} className="text-bronze">
                        {part.text}
                      </em>
                    ) : (
                      <span key={part.text}>{part.text}</span>
                    ),
                  )}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.75, ease: EASE }}
          >
            <p className="mt-8 max-w-[34rem] text-[1.05rem] leading-relaxed text-mist md:text-[1.12rem]">
              Atuação em Direito Penal e Processo Penal, com atenção individual a cada caso e sigilo profissional.
            </p>

            <div className="mt-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-8">
              <MagneticLink
                href={whatsappUrl}
                external
                className="inline-flex items-center justify-center gap-3 bg-bronze px-7 py-4 text-[0.95rem] font-medium text-ink transition-colors duration-300 hover:bg-[#c8a374]"
              >
                <WhatsAppIcon />
                Entrar em contato
              </MagneticLink>
              <a href="#atuacao" className="group inline-flex items-center gap-3 self-start py-2 text-[0.95rem] text-ivory sm:self-auto">
                <span className="border-b border-ivory/30 pb-0.5 transition-colors duration-300 group-hover:border-bronze">Conhecer a atuação</span>
                <ArrowIcon className="h-4 w-4 text-bronze transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </div>
          </motion.div>
        </div>

        {/* Placa de identificação com retrato */}
        <motion.aside
          aria-label="Identificação profissional"
          className="md:col-span-5 md:justify-self-end lg:col-span-4 lg:col-start-9"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4, delay: 0.5, ease: EASE }}
        >
          <div className="relative w-full max-w-[22rem] border border-line-dark bg-ink/60 p-7 md:p-8">
            <span aria-hidden="true" className="absolute -top-px left-7 h-px w-16 bg-bronze" />
            <div className="flex items-end gap-5">
              <div className="relative shrink-0 p-1.5 ring-1 ring-bronze/40">
                <Portrait className="h-[7.5rem] w-[7.5rem]" />
              </div>
              <p className="label pb-1 text-[0.62rem] leading-relaxed text-mist">
                Escritório em
                <br />
                <span className="text-ivory">
                  {CONFIG.endereco.cidade} · {CONFIG.endereco.uf}
                </span>
              </p>
            </div>
            <p className="display mt-7 text-[2rem] text-ivory">{CONFIG.nome}</p>
            <p className="mt-1 text-[0.92rem] text-mist">{CONFIG.profissao}</p>
            <dl className="mt-6 divide-y divide-line-dark border-y border-line-dark text-[0.86rem]">
              <div className="flex justify-between gap-4 py-3">
                <dt className="text-mist">Inscrição</dt>
                <dd className="font-medium tracking-wide text-ivory">{CONFIG.oab}</dd>
              </div>
              <div className="flex justify-between gap-4 py-3">
                <dt className="text-mist">Atuação</dt>
                <dd className="text-right text-ivory">Penal e Processo Penal</dd>
              </div>
            </dl>
          </div>
        </motion.aside>
      </div>
    </section>
  )
}

/* ---------- Sobre ---------- */

function Sobre() {
  return (
    <section id="sobre" aria-labelledby="sobre-title" className="bg-ivory py-24 md:py-36">
      <div className="wrap grid gap-12 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-5">
          <SectionLabel n="01">Sobre</SectionLabel>
          <Reveal>
            <h2 id="sobre-title" className="display mt-8 text-[clamp(2.4rem,5.5vw,4rem)]">
              Técnica a serviço da <em className="text-bronze-deep">defesa</em>.
            </h2>
          </Reveal>
        </div>
        <div className="md:col-span-6 md:col-start-7 md:pt-14">
          <Reveal delay={0.1}>
            <div className="space-y-5 text-[1.05rem] text-muted">
              <p>
                <span className="text-text">{CONFIG.nome}</span> é advogado criminalista, inscrito na Ordem dos Advogados do
                Brasil, Seção de São Paulo, sob o nº 220.810, com escritório em {CONFIG.endereco.cidade}.
              </p>
              <p>
                Sua atuação se concentra em Direito Penal e Processo Penal. O trabalho parte da análise cuidadosa de cada
                situação e de uma comunicação clara sobre o que a lei prevê, sempre sob sigilo profissional.
              </p>
              {CONFIG.mostrarProfessor && <p>É também professor universitário.</p>}
              {CONFIG.mostrarCargoOAB && <p>{CONFIG.cargoOAB}.</p>}
            </div>
            <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-3 border-t border-line pt-6 text-[0.88rem]">
              <li className="flex items-center gap-3">
                <span aria-hidden="true" className="h-1 w-1 rotate-45 bg-bronze-deep" />
                {CONFIG.oab}
              </li>
              <li className="flex items-center gap-3">
                <span aria-hidden="true" className="h-1 w-1 rotate-45 bg-bronze-deep" />
                {CONFIG.mostrarEspecialista ? CONFIG.especialidade : 'Direito Penal e Processo Penal'}
              </li>
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ---------- Atuação ---------- */

function Atuacao() {
  return (
    <section id="atuacao" aria-labelledby="atuacao-title" className="border-t border-line bg-paper py-24 md:py-36">
      <div className="wrap">
        <div className="grid gap-8 md:grid-cols-12">
          <div className="md:col-span-6">
            <SectionLabel n="02">Atuação</SectionLabel>
            <Reveal>
              <h2 id="atuacao-title" className="display mt-8 text-[clamp(2.4rem,5.5vw,4rem)]">
                Áreas de <em className="text-bronze-deep">atuação</em>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.1} className="md:col-span-5 md:col-start-8 md:self-end">
            <p className="text-muted">
              Informações gerais sobre o campo de trabalho do escritório. O conteúdo é educativo e não substitui a análise
              de um caso concreto.
            </p>
          </Reveal>
        </div>

        <ul className="mt-16 grid gap-px border border-line bg-line md:grid-cols-2">
          {areasVisiveis.map((area, i) => (
            <li key={area.titulo} className="group relative bg-paper transition-colors duration-500 hover:bg-ivory">
              <span
                aria-hidden="true"
                className="absolute top-0 left-0 h-px w-12 bg-bronze-deep transition-[width] duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:w-full"
              />
              <article className="flex h-full flex-col p-8 md:p-12">
                <span className="label tabular-nums text-bronze-deep">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="display mt-10 text-[2.1rem] md:text-[2.5rem]">{area.titulo}</h3>
                <p className="mt-5 max-w-md text-muted">{area.descricao}</p>
              </article>
            </li>
          ))}
        </ul>

        <p className="mt-8 flex items-center gap-3 text-[0.9rem] text-muted">
          <span aria-hidden="true" className="h-px w-6 bg-bronze-deep/60" />
          Cada caso exige análise individual.
        </p>
      </div>
    </section>
  )
}

/* ---------- Como funciona ---------- */

const ETAPAS = [
  {
    t: 'Contato pelo WhatsApp',
    d: 'Você envia uma mensagem pelo WhatsApp do escritório, no horário que for possível. Não é necessário detalhar a situação nessa primeira mensagem.',
  },
  {
    t: 'Análise inicial da situação',
    d: 'Em conversa reservada, o advogado entende o contexto, os documentos disponíveis e a fase em que o caso se encontra.',
  },
  {
    t: 'Orientação sobre os próximos passos',
    d: 'Você recebe uma explicação clara sobre o cenário jurídico e os caminhos possíveis, para decidir com informação.',
  },
]

function ComoFunciona() {
  return (
    <section id="como-funciona" aria-labelledby="como-title" className="bg-ink py-24 text-ivory md:py-36">
      <div className="wrap">
        <div className="grid gap-8 md:grid-cols-12">
          <div className="md:col-span-7">
            <SectionLabel n="03" dark>
              Como funciona
            </SectionLabel>
            <Reveal>
              <h2 id="como-title" className="display mt-8 text-[clamp(2.4rem,5.5vw,4rem)]">
                O primeiro <em className="text-bronze">contato</em>
              </h2>
            </Reveal>
          </div>
        </div>

        <ol className="mt-16 grid gap-12 md:grid-cols-3 md:gap-10">
          {ETAPAS.map((e, i) => (
            <li key={e.t}>
              <Reveal delay={i * 0.08}>
                <div className="flex items-center gap-4">
                  <span className="display text-[2.6rem] leading-none text-bronze tabular-nums">{i + 1}</span>
                  <span aria-hidden="true" className="h-px flex-1 bg-line-dark" />
                </div>
                <h3 className="mt-6 text-[1.1rem] font-semibold text-ivory">{e.t}</h3>
                <p className="mt-3 text-mist">{e.d}</p>
              </Reveal>
            </li>
          ))}
        </ol>

        <Reveal>
          <p className="mt-16 max-w-2xl border-l border-bronze/60 pl-6 text-mist">
            O sigilo profissional é um dever do advogado, previsto no Estatuto da Advocacia, e se estende às informações
            compartilhadas desde a primeira conversa.
          </p>
        </Reveal>
      </div>
    </section>
  )
}

/* ---------- Princípios ---------- */

// CONFIRMAR COM O ADVOGADO: pilares apresentados como compromissos a validar.
const PRINCIPIOS = [
  { t: 'Sigilo', d: 'Reserva sobre tudo o que é compartilhado, como dever ético e legal da advocacia.' },
  { t: 'Técnica', d: 'Estudo atento da lei, da jurisprudência e dos documentos de cada caso.' },
  { t: 'Atenção individual', d: 'Cada situação é analisada em suas particularidades, sem respostas prontas.' },
  { t: 'Comunicação clara', d: 'Explicações objetivas sobre cada etapa, em linguagem acessível.' },
]

function Principios() {
  return (
    <section aria-labelledby="principios-title" className="bg-ivory py-24 md:py-36">
      <div className="wrap">
        <SectionLabel n="04">Princípios</SectionLabel>
        <Reveal>
          <h2 id="principios-title" className="display mt-8 max-w-3xl text-[clamp(2.4rem,5.5vw,4rem)]">
            Compromissos de <em className="text-bronze-deep">atuação</em>
          </h2>
        </Reveal>
        <ul className="mt-16 grid border-t border-line sm:grid-cols-2 lg:grid-cols-4">
          {PRINCIPIOS.map((p, i) => (
            <li
              key={p.t}
              className="border-b border-line py-8 sm:pr-8 sm:even:border-l sm:even:pl-8 lg:border-b-0 lg:border-l lg:pl-8 lg:first:border-l-0 lg:first:pl-0"
            >
              <Reveal delay={i * 0.06}>
                <span className="label tabular-nums text-bronze-deep">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="display mt-6 text-[1.9rem]">{p.t}</h3>
                <p className="mt-3 text-[0.95rem] text-muted">{p.d}</p>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ---------- Dúvidas ---------- */

const RESSALVA = 'A orientação adequada depende sempre da análise do caso concreto.'

const FAQ: FaqItem[] = [
  {
    q: 'Como entro em contato?',
    a: (
      <p>
        O contato é feito pelo WhatsApp {CONFIG.whatsappExibicao}. Basta enviar uma mensagem de apresentação; os detalhes
        são tratados depois, em conversa reservada.
      </p>
    ),
  },
  {
    q: 'O que levar para a primeira conversa?',
    a: (
      <p>
        Se houver, documentos relacionados à situação: intimações, boletim de ocorrência, mandados, decisões ou números de
        procedimentos. Anotações com datas e fatos em ordem cronológica também ajudam. {RESSALVA}
      </p>
    ),
  },
  {
    q: 'O sigilo profissional se aplica ao primeiro contato?',
    a: (
      <p>
        Sim. O sigilo profissional é dever do advogado previsto no Estatuto da Advocacia e no Código de Ética e Disciplina
        da OAB, e abrange as informações recebidas em razão da atividade profissional, inclusive no primeiro contato.
      </p>
    ),
  },
  {
    q: 'Qual a diferença entre inquérito e ação penal?',
    a: (
      <p>
        De forma geral, o inquérito policial é a fase de investigação, conduzida pela autoridade policial, que reúne
        elementos sobre um fato. A ação penal começa quando o Ministério Público (ou o ofendido, em alguns casos) apresenta
        a acusação e ela é recebida pelo juiz, dando início ao processo. Esta é uma explicação geral e educativa. {RESSALVA}
      </p>
    ),
  },
  {
    q: 'O advogado pode acompanhar um depoimento?',
    a: (
      <p>
        Em regra, a pessoa ouvida em procedimentos de investigação ou no processo pode estar acompanhada de advogado. As
        particularidades de cada situação devem ser avaliadas individualmente. {RESSALVA}
      </p>
    ),
  },
  {
    q: 'Onde fica o escritório?',
    a: (
      <p>
        {enderecoCompleto}. Atendimento de segunda a sexta, das 09h00 às 17h30.
      </p>
    ),
  },
]

function Duvidas() {
  return (
    <section id="duvidas" aria-labelledby="duvidas-title" className="border-t border-line bg-paper py-24 md:py-36">
      <div className="wrap grid gap-12 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-4">
          <SectionLabel n="05">Dúvidas</SectionLabel>
          <Reveal>
            <h2 id="duvidas-title" className="display mt-8 text-[clamp(2.4rem,5.5vw,4rem)]">
              Dúvidas <em className="text-bronze-deep">frequentes</em>
            </h2>
            <p className="mt-6 max-w-xs text-[0.95rem] text-muted">
              Respostas gerais e informativas. Não constituem aconselhamento jurídico.
            </p>
          </Reveal>
        </div>
        <div className="md:col-span-8">
          <Accordion items={FAQ} />
        </div>
      </div>
    </section>
  )
}

/* ---------- Escritório ---------- */

function Escritorio() {
  return (
    <section id="contato" aria-labelledby="contato-title" className="bg-ivory py-24 md:py-36">
      <div className="wrap grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <SectionLabel n="06">Contato</SectionLabel>
          <Reveal>
            <h2 id="contato-title" className="display mt-8 text-[clamp(2.4rem,5.5vw,4rem)]">
              <em className="text-bronze-deep">Escritório</em>
            </h2>
          </Reveal>

          <dl className="mt-10 divide-y divide-line border-y border-line">
            <div className="grid gap-1 py-5 sm:grid-cols-[8rem_1fr]">
              <dt className="label pt-1 text-bronze-deep">Endereço</dt>
              <dd>
                <address className="not-italic">
                  {CONFIG.endereco.rua} · {CONFIG.endereco.bairro}
                  <br />
                  {CONFIG.endereco.cidade} - {CONFIG.endereco.uf} · CEP {CONFIG.endereco.cep}
                </address>
              </dd>
            </div>
            <div className="grid gap-1 py-5 sm:grid-cols-[8rem_1fr]">
              <dt className="label pt-1 text-bronze-deep">Horários</dt>
              <dd>
                <ul>
                  {CONFIG.horarios.map((h) => (
                    <li key={h.dias} className="flex justify-between gap-4">
                      <span className="text-muted">{h.dias}</span>
                      <span>{h.horas}</span>
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
            <div className="grid gap-1 py-5 sm:grid-cols-[8rem_1fr]">
              <dt className="label pt-1 text-bronze-deep">Telefones</dt>
              <dd className="space-y-1">
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 underline-offset-4 hover:underline">
                  <WhatsAppIcon className="h-3.5 w-3.5 text-bronze-deep" />
                  {CONFIG.whatsappExibicao} <span className="text-muted">(WhatsApp)</span>
                </a>
                {CONFIG.telefoneFixo && (
                  <a href={`tel:${CONFIG.telefoneFixoLink}`} className="block pl-[1.375rem] underline-offset-4 hover:underline">
                    {CONFIG.telefoneFixo} <span className="text-muted">(fixo)</span>
                  </a>
                )}
              </dd>
            </div>
            {CONFIG.mostrarInstagram && (
              <div className="grid gap-1 py-5 sm:grid-cols-[8rem_1fr]">
                <dt className="label pt-1 text-bronze-deep">Instagram</dt>
                <dd>
                  <a href={CONFIG.instagram} target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:underline">
                    @natalino.polato
                  </a>
                </dd>
              </div>
            )}
          </dl>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 bg-ink px-6 py-4 text-[0.92rem] font-medium text-ivory transition-colors duration-300 hover:bg-night-2"
            >
              <WhatsAppIcon />
              Falar pelo WhatsApp
            </a>
            <a
              href={mapsDirectionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 border border-text/25 px-6 py-4 text-[0.92rem] font-medium transition-colors duration-300 hover:border-bronze-deep hover:text-bronze-deep"
            >
              Como chegar
              <ArrowIcon />
            </a>
          </div>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <div className="relative aspect-[4/3] w-full overflow-hidden border border-line bg-paper lg:aspect-auto lg:h-full lg:min-h-[30rem]">
            <iframe
              title={`Mapa do escritório: ${enderecoCompleto}`}
              src={mapsEmbedUrl}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 h-full w-full border-0 [filter:grayscale(1)_contrast(.95)_sepia(.12)]"
            />
          </div>
        </div>
      </div>

      <div className="wrap">
        <p className="mt-20 border-t border-line pt-6 text-[0.85rem] text-muted">{AVISO}</p>
      </div>
    </section>
  )
}

/* ---------- CTA final ---------- */

function CtaFinal() {
  return (
    <section aria-labelledby="cta-title" className="relative overflow-hidden bg-night py-24 text-ivory md:py-32">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_90%_at_50%_120%,#1f2b3d_0%,transparent_70%)]" />
      <div className="wrap relative flex flex-col items-start gap-10 md:flex-row md:items-end md:justify-between">
        <Reveal>
          <h2 id="cta-title" className="display max-w-2xl text-[clamp(2.2rem,5vw,3.6rem)]">
            Para conversar sobre o seu caso, <em className="text-bronze">entre em contato</em>.
          </h2>
        </Reveal>
        <MagneticLink
          href={whatsappUrl}
          external
          className="inline-flex shrink-0 items-center gap-3 border border-bronze px-7 py-4 text-[0.95rem] font-medium text-ivory transition-colors duration-300 hover:bg-bronze hover:text-ink"
        >
          <WhatsAppIcon />
          Falar pelo WhatsApp
        </MagneticLink>
      </div>
    </section>
  )
}

/* ---------- Rodapé ---------- */

function Footer() {
  return (
    <footer className="bg-ink pt-16 pb-28 text-mist md:pb-16">
      <div className="wrap">
        <div className="grid gap-10 border-b border-line-dark pb-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <Signature />
            <p className="label mt-6 text-bronze">{CONFIG.oab}</p>
          </div>
          <div className="text-[0.9rem] md:col-span-4">
            <p className="label mb-3 text-ivory">Escritório</p>
            <address className="not-italic">
              {CONFIG.endereco.rua}, {CONFIG.endereco.bairro}
              <br />
              {CONFIG.endereco.cidade} - {CONFIG.endereco.uf}, {CONFIG.endereco.cep}
            </address>
          </div>
          <div className="text-[0.9rem] md:col-span-3">
            <p className="label mb-3 text-ivory">Contato</p>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="block hover:text-ivory">
              WhatsApp {CONFIG.whatsappExibicao}
            </a>
            {CONFIG.telefoneFixo && (
              <a href={`tel:${CONFIG.telefoneFixoLink}`} className="block hover:text-ivory">
                Telefone {CONFIG.telefoneFixo}
              </a>
            )}
            {CONFIG.mostrarInstagram && (
              <a href={CONFIG.instagram} target="_blank" rel="noopener noreferrer" className="block hover:text-ivory">
                Instagram
              </a>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-4 pt-8 text-[0.8rem] md:flex-row md:items-start md:justify-between">
          <p className="max-w-xl">{AVISO}</p>
          <p className="flex shrink-0 gap-6">
            <a href="/privacidade.html" className="underline-offset-4 hover:text-ivory hover:underline">
              Privacidade
            </a>
            <span>© {new Date().getFullYear()} {CONFIG.nome}</span>
          </p>
        </div>
      </div>
    </footer>
  )
}

/* ---------- WhatsApp fixo ---------- */

function WhatsFixo() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <>
      {/* celular: barra fixa inferior (o rodapé tem espaço reservado) */}
      <div className={`fixed inset-x-0 bottom-0 z-40 transition-transform duration-500 ${show ? 'translate-y-0' : 'translate-y-full'} border-t border-line-dark bg-ink/95 px-4 py-3 backdrop-blur-md [padding-bottom:max(.75rem,env(safe-area-inset-bottom))] md:hidden`} inert={!show}>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2 bg-bronze py-3.5 text-[0.92rem] font-medium text-ink"
        >
          <WhatsAppIcon />
          Falar pelo WhatsApp
        </a>
      </div>
      {/* desktop: botão flutuante discreto */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Falar pelo WhatsApp"
        className="fixed right-6 bottom-6 z-40 hidden h-14 w-14 place-items-center rounded-full border border-bronze/60 bg-ink text-bronze shadow-[0_10px_30px_-10px_rgba(0,0,0,.6)] transition-colors duration-300 hover:bg-bronze hover:text-ink md:grid"
      >
        <WhatsAppIcon className="h-5 w-5" />
      </a>
    </>
  )
}

export default function App() {
  return (
    <>
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:top-12 focus:left-4 focus:z-[70] focus:bg-ivory focus:px-4 focus:py-2 focus:text-text"
      >
        Pular para o conteúdo
      </a>
      <DraftBanner />
      <Header />
      <main id="conteudo">
        <Hero />
        <Sobre />
        <Atuacao />
        <ComoFunciona />
        <Principios />
        <Duvidas />
        <Escritorio />
        <CtaFinal />
      </main>
      <Footer />
      <WhatsFixo />
    </>
  )
}
