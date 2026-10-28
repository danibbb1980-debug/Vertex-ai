import { CONFIG, type Profissional } from '../config'
import {
  CabecalhoSecao,
  ComConfirmar,
  Foto,
  IconeConversa,
  IconeInstagram,
  IconeLupa,
  IconeOuvir,
  IconePlano,
  SeloConfirmar,
} from '../components/base'

const ETAPAS = [
  {
    titulo: 'Contato pelo WhatsApp e agendamento',
    texto: 'Você manda uma mensagem e combinamos juntos o horário da sua avaliação.',
  },
  {
    titulo: 'Avaliação e diagnóstico',
    texto: 'Ouvimos o que te trouxe até aqui, examinamos com calma e, se for preciso, pedimos exames complementares.',
  },
  {
    titulo: 'Planejamento individualizado, explicado com clareza',
    texto: 'Apresentamos as possibilidades para o seu caso, com as etapas e os cuidados envolvidos, para você decidir com tranquilidade.',
  },
  {
    titulo: 'Acompanhamento',
    texto: 'Seguimos com você ao longo do tratamento e nos retornos combinados.',
  },
]

export function ComoFunciona() {
  return (
    <section
      id="como-funciona"
      aria-labelledby="titulo-como-funciona"
      className="escuro relative overflow-hidden bg-navy-900 py-24 text-ivory sm:py-32"
    >
      <div className="container-vc grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        <div className="lg:sticky lg:top-36 lg:self-start">
          <CabecalhoSecao
            id="titulo-como-funciona"
            claro
            rotulo="Como funciona"
            titulo={
              <>
                Do primeiro contato ao <em>acompanhamento</em>.
              </>
            }
            intro="Um caminho simples e sem pressa: você entende cada passo antes de decidir."
          />
        </div>

        <ol data-linha-tempo className="relative">
          {/* Trilho e progresso dourado (scaleY) */}
          <span aria-hidden="true" className="absolute bottom-2 left-[1.375rem] top-2 w-px bg-ivory/15" />
          <span
            aria-hidden="true"
            data-linha-progresso
            className="linha-progresso absolute bottom-2 left-[1.375rem] top-2 w-px origin-top bg-champagne"
          />
          {ETAPAS.map((e, i) => (
            <li key={e.titulo} className="revela relative grid grid-cols-[2.75rem_1fr] gap-6 pb-14 last:pb-0 sm:gap-8">
              <span className="relative z-10 flex h-11 w-11 items-center justify-center rounded-full border border-champagne/60 bg-navy-900 font-display text-xl text-champagne [font-variant-numeric:lining-nums]">
                {i + 1}
              </span>
              <div className="pt-1.5">
                <p className="rotulo text-champagne/80">Etapa {String(i + 1).padStart(2, '0')}</p>
                <h3 className="mt-3 text-[1.9rem] leading-tight text-ivory sm:text-[2.2rem]">{e.titulo}</h3>
                <p className="mt-3 max-w-lg leading-relaxed text-ivory/75">{e.texto}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

function CartaoProfissional({ p, i }: { p: Profissional; i: number }) {
  return (
    <article className="revela group flex flex-col" style={{ ['--d' as string]: `${i * 0.12}s` }} aria-labelledby={`nome-${p.id}`}>
      <div className="relative overflow-hidden rounded-t-[999px] rounded-b-xl bg-linho">
        <Foto
          nome={p.fotos.perfil}
          larguras={[400, 640]}
          sizes="(min-width: 768px) 34vw, 90vw"
          alt={p.alt}
          largura={640}
          altura={960}
          className="aspect-[4/5] h-auto w-full object-cover object-top transition-transform duration-[1.4s] ease-[var(--ease-saida)] group-hover:scale-[1.03]"
        />
        <span
          aria-hidden="true"
          className="absolute bottom-5 left-5 flex h-16 w-16 items-center justify-center rounded-full border border-champagne/70 bg-navy-900/90 font-display text-4xl italic text-champagne"
        >
          {p.letra}
        </span>
      </div>
      <div className="mt-8">
        <p className="rotulo text-ouro">{p.responsavelTecnico ? 'Cirurgião-dentista · Responsável técnico' : 'Cirurgião-dentista'}</p>
        <h3 id={`nome-${p.id}`} className="mt-3 text-[2.4rem] leading-none text-tinta sm:text-5xl">
          {p.nome}
        </h3>
        <p className="mt-3 text-sm font-semibold tracking-[0.12em] text-tinta-suave">
          <ComConfirmar texto={p.cro} />
        </p>
        <p className="mt-7 text-sm text-tinta-suave">Áreas de atuação</p>
        <ul className="mt-3 flex flex-wrap gap-2" aria-label={`Áreas de atuação de ${p.nome}`}>
          {p.areas.map((a) => (
            <li key={a} className="rounded-full border border-tinta/20 px-4 py-1.5 text-sm text-tinta">
              {a}
            </li>
          ))}
        </ul>
      </div>
    </article>
  )
}

export function Profissionais() {
  return (
    <section id="profissionais" aria-labelledby="titulo-profissionais" className="bg-ivory py-24 sm:py-32">
      <div className="container-vc">
        <CabecalhoSecao
          id="titulo-profissionais"
          rotulo="Profissionais"
          titulo={
            <>
              Duas trajetórias, um mesmo <em>propósito</em>.
            </>
          }
          intro="Atuações que se complementam: de um lado, implantes, diagnóstico e planejamento; do outro, reabilitação oral e função mastigatória."
          selo={<SeloConfirmar>CRO, áreas e imagens a confirmar</SeloConfirmar>}
        />
        <div className="relative mt-16 grid gap-16 md:grid-cols-2 md:gap-10 lg:gap-20">
          <span aria-hidden="true" className="absolute bottom-0 left-1/2 top-0 hidden w-px bg-gradient-to-b from-transparent via-ouro/40 to-transparent md:block" />
          {CONFIG.profissionais.map((p, i) => (
            <CartaoProfissional key={p.id} p={p} i={i} />
          ))}
        </div>
        <p className="revela mt-14 flex flex-col items-start gap-4 border-t border-linho pt-8 text-tinta-suave sm:flex-row sm:items-center sm:justify-between">
          <span>Acompanhe a rotina da clínica no Instagram.</span>
          <a
            href={CONFIG.instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            className="botao botao-contorno-escuro"
          >
            <IconeInstagram tamanho={19} />
            {CONFIG.instagram.usuario}
          </a>
        </p>
      </div>
    </section>
  )
}

const COMPROMISSOS = [
  { Icone: IconeOuvir, titulo: 'Escuta', texto: 'Antes de qualquer exame, entender o que te incomoda e o que você espera do tratamento.' },
  { Icone: IconeLupa, titulo: 'Diagnóstico cuidadoso', texto: 'Examinar com calma e pedir exames complementares só quando eles ajudam a decidir.' },
  { Icone: IconePlano, titulo: 'Planejamento individual', texto: 'Um plano pensado para o seu caso, com etapas claras e prioridades definidas com você.' },
  { Icone: IconeConversa, titulo: 'Clareza nas explicações', texto: 'Explicar possibilidades, cuidados e limites em linguagem simples, sem pressa.' },
]

export function Compromissos() {
  return (
    <section aria-labelledby="titulo-compromissos" className="bg-sand py-24 sm:py-32">
      <div className="container-vc">
        <CabecalhoSecao
          id="titulo-compromissos"
          rotulo="Compromissos de atendimento"
          titulo={
            <>
              O que guia cada <em>consulta</em>.
            </>
          }
          selo={<SeloConfirmar>A validar com a clínica</SeloConfirmar>}
        />
        <ul className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {COMPROMISSOS.map(({ Icone, titulo, texto }, i) => (
            <li key={titulo} className="revela border-t border-ouro/40 pt-7" style={{ ['--d' as string]: `${i * 0.08}s` }}>
              <Icone tamanho={30} className="text-ouro" />
              <h3 className="mt-6 text-[1.75rem] leading-tight text-tinta">{titulo}</h3>
              <p className="mt-3 leading-relaxed text-tinta-suave">{texto}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
