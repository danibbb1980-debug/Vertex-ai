import type { PointerEvent } from 'react'
import { AlertTriangle, Phone } from 'lucide-react'
import { CONFIG } from '../config'
import { mensagemAtendimento, temTexto } from '../lib/util'
import { Aquarela, BotaoLigar, Monograma, BotaoWhatsApp, Credenciais, Enfase, IlustracaoAtendimento, Revela, useNaTela } from './base'

/* ---------------- Marquee discreto ---------------- */

export function Marquee() {
  const [ref, naTela] = useNaTela<HTMLDivElement>()
  const itens = [
    ...CONFIG.atendimentos.map((a) => (a.id === 'fleboestetica' ? 'Fleboestética · varizes e vasinhos' : a.titulo)),
    'Avaliação individual',
    'Hora marcada',
    `${CONFIG.cidade} - ${CONFIG.uf}`,
  ]
  const faixa = (oculta: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={oculta || undefined}>
      {itens.map((t, i) => (
        <li key={i} className="flex items-center whitespace-nowrap px-6 font-serif text-[1.45rem] italic text-marinho/80 md:text-[1.7rem]">
          {t}
          <svg className="ml-12 size-2.5 text-vinho" viewBox="0 0 10 10" aria-hidden="true">
            <circle cx="5" cy="5" r="2.2" fill="currentColor" />
          </svg>
        </li>
      ))}
    </ul>
  )
  return (
    <div
      ref={ref}
      data-pausado={!naTela}
      className="marquee relative overflow-hidden border-y border-linha bg-marfim-2/70 py-5 [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]"
    >
      <p className="sr-only">{itens.join(', ')}.</p>
      <div className="marquee-trilho" aria-hidden="true">
        {faixa(false)}
        {faixa(true)}
      </div>
    </div>
  )
}

/* ---------------- A médica ---------------- */

export function Medica() {
  const s = CONFIG.sobre
  const especialidades = CONFIG.mostrarEspecialidadesAdicionais
    ? CONFIG.especialidadesAdicionais.filter((e) => temTexto(e.nome) && temTexto(e.rqe))
    : []
  const vinculos = CONFIG.mostrarVinculos ? CONFIG.vinculos.filter((v) => temTexto(v.instituicao)) : []

  return (
    <section id="a-medica" aria-labelledby="titulo-medica" className="relative py-24 md:py-36">
      <div className="container-site grid gap-16 md:grid-cols-[0.9fr_1.1fr] md:gap-20">
        <Revela className="relative">
          <p className="rotulo">A médica</p>
          <h2 id="titulo-medica" className="titulo-secao mt-5 text-marinho">
            <Enfase texto="Uma escuta *atenta* antes de qualquer conduta." />
          </h2>

          <div className="relative mt-12 hidden aspect-square max-w-[22rem] md:block" aria-hidden="true">
            <div className="absolute inset-0 rounded-full border border-vinho/20" />
            <div className="absolute inset-[12%] rounded-full bg-pessego/60" />
            <Monograma className="relative size-full p-10" />
          </div>
        </Revela>

        <div>
          <Revela>
            <p className="font-serif text-[1.55rem] leading-snug text-marinho md:text-[1.8rem]">
              {CONFIG.nome}
              <span className="mt-1 block font-sans text-[0.95rem] tracking-wide text-tinta">
                {CONFIG.titulo} · <Credenciais />
              </span>
            </p>
            {especialidades.length > 0 && (
              <ul className="mt-3 flex flex-wrap gap-2">
                {especialidades.map((e) => (
                  <li key={e.nome} className="rounded-full bg-pessego/70 px-3 py-1 text-[0.85rem] text-marinho">
                    {e.nome} · RQE {e.rqe}
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-8 text-[1.08rem] leading-relaxed text-tinta">{s.texto}</p>
          </Revela>

          <Revela as="blockquote" className="relative mt-10 border-l border-vinho/40 pl-6">
            <p className="font-serif text-[1.5rem] italic leading-snug text-vinho md:text-[1.7rem]">“{s.principio}”</p>
            <footer className="mt-3 text-[0.9rem] tracking-wide text-tinta">{s.assinatura}</footer>
          </Revela>

          {s.formacao.length > 0 && (
            <Revela className="mt-14">
              <h3 className="rotulo !text-marinho">Formação</h3>
              <ol className="relative mt-6 space-y-7 border-l border-linha pl-8">
                {s.formacao.map((f) => (
                  <li key={f.etapa} className="relative">
                    <span className="absolute -left-[2.37rem] top-1.5 size-3 rounded-full border border-vinho bg-marfim" aria-hidden="true" />
                    <p className="font-serif text-[1.35rem] leading-tight text-marinho">{f.etapa}</p>
                    <p className="mt-1 text-[0.98rem] text-tinta">{f.local}</p>
                  </li>
                ))}
              </ol>
            </Revela>
          )}

          {vinculos.length > 0 && (
            <Revela className="mt-12">
              <h3 className="rotulo !text-marinho">Atuação</h3>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {vinculos.map((v) => (
                  <li key={v.instituicao} className="rounded-2xl border border-linha bg-white/60 px-5 py-4">
                    <p className="text-[0.85rem] text-tinta">{v.funcao}</p>
                    <p className="font-serif text-[1.2rem] leading-tight text-marinho">{v.instituicao}</p>
                  </li>
                ))}
              </ul>
            </Revela>
          )}
        </div>
      </div>
    </section>
  )
}

/* ---------------- Atendimentos ---------------- */

function moverLuz(e: PointerEvent<HTMLElement>) {
  const r = e.currentTarget.getBoundingClientRect()
  e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`)
  e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`)
}

export function Atendimentos() {
  const lista = CONFIG.atendimentos.filter((a) => temTexto(a.titulo) && temTexto(a.descricao))
  if (!lista.length) return null
  return (
    <section id="atendimentos" aria-labelledby="titulo-atendimentos" className="relative overflow-hidden bg-marfim-2/60 py-24 md:py-36">
      <Aquarela tipo="topo" className="-left-40 top-0 w-[56rem] max-w-none opacity-50" />
      <div className="container-site relative">
        <Revela className="max-w-2xl">
          <p className="rotulo">Atendimentos</p>
          <h2 id="titulo-atendimentos" className="titulo-secao mt-5 text-marinho">
            <Enfase texto="Cada caso, com o seu *tempo*." />
          </h2>
          <p className="mt-6 text-[1.08rem] text-tinta">
            Informação clara sobre cada atendimento. O que é indicado para você só se define depois de uma avaliação.
          </p>
        </Revela>

        <ul className="mt-14 grid gap-5 md:grid-cols-3" data-fluxo="atendimentos">
          {lista.map((a, i) => (
            <Revela as="li" key={a.id} atraso={i * 110} className="h-full">
              <article
                onPointerMove={moverLuz}
                className="cartao-luz group flex h-full flex-col rounded-[1.75rem] border border-linha bg-white/80 p-7 shadow-[0_30px_60px_-50px_rgba(37,42,69,.55)] transition-[transform,box-shadow] duration-500 ease-[var(--ease-flui)] hover:-translate-y-1 hover:shadow-[0_40px_70px_-45px_rgba(37,42,69,.5)] md:p-8"
              >
                <div className="flex items-start justify-between">
                  <IlustracaoAtendimento id={a.id} className="size-20 text-marinho transition-transform duration-700 group-hover:rotate-[-4deg]" />
                  <span className="font-serif text-[1.1rem] italic text-tinta">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <p className="rotulo mt-8 !text-[0.68rem]">{a.rotulo}</p>
                <h3 className="mt-2 text-[2rem] text-marinho">{a.titulo}</h3>
                <p className="mt-4 text-[1rem] leading-relaxed text-tinta">{a.descricao}</p>
                <p className="mt-5 border-t border-linha pt-4 text-[0.88rem] italic text-marinho/80">{CONFIG.notaAtendimento}</p>
                <div className="mt-auto flex flex-wrap gap-2 pt-7">
                  <BotaoWhatsApp
                    mensagem={mensagemAtendimento(a.nomeMensagem)}
                    className="!min-h-12 !px-5 !text-[0.95rem]"
                    rotuloAria={`Pedir informações sobre ${a.titulo} pelo WhatsApp`}
                  >
                    Saber mais
                  </BotaoWhatsApp>
                  <BotaoLigar className="!min-h-12 !px-5 !text-[0.95rem]" />
                </div>
              </article>
            </Revela>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ---------------- Quando procurar avaliação ---------------- */

export function QuandoProcurar() {
  const q = CONFIG.quandoProcurar
  if (!q.sinais.length) return null
  return (
    <section aria-labelledby="titulo-quando" className="relative py-24 md:py-36">
      <div className="container-site grid gap-14 md:grid-cols-[0.85fr_1.15fr] md:gap-20">
        <Revela>
          <p className="rotulo">Quando procurar avaliação</p>
          <h2 id="titulo-quando" className="titulo-secao mt-5 text-marinho">
            <Enfase texto="Sinais que pedem uma *conversa*." />
          </h2>
          <p className="mt-6 text-[1.08rem] text-tinta">
            Não é preciso esperar o incômodo crescer. Estas são situações comuns que levam à consulta, e só a avaliação
            médica diz o que cada uma significa no seu caso.
          </p>
        </Revela>

        <div>
          <ul className="grid gap-x-10 sm:grid-cols-2">
            {q.sinais.map((s, i) => (
              <Revela as="li" key={s.titulo} atraso={i * 80} className="border-t border-linha py-6">
                <span className="font-serif text-[1rem] italic text-vinho">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="mt-1 text-[1.6rem] leading-tight text-marinho">{s.titulo}</h3>
                <p className="mt-2 text-[0.98rem] text-tinta">{s.texto}</p>
              </Revela>
            ))}
          </ul>

          {temTexto(q.alerta) && (
            <Revela className="mt-8 flex gap-4 rounded-2xl border border-vinho/30 bg-white/70 p-5 md:p-6" role="note">
              <AlertTriangle className="mt-0.5 size-5 shrink-0 text-vinho" strokeWidth={1.6} aria-hidden="true" />
              <div>
                <p className="text-[0.98rem] font-medium text-marinho">{q.alerta}</p>
                <a href="tel:192" className="mt-3 inline-flex min-h-12 items-center gap-2 text-[0.95rem] text-vinho">
                  <Phone className="size-4" strokeWidth={1.6} aria-hidden="true" />
                  <span className="link-sublinhado">Ligar 192 (SAMU)</span>
                </a>
              </div>
            </Revela>
          )}
        </div>
      </div>
    </section>
  )
}
