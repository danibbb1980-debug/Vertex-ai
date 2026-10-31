import { useRef, type MouseEvent } from 'react'
import { CONFIG, especialidadesVisiveis, linkWhats, msgAtendimento } from '../config'
import { AnelDourado, Reveal, Titulo } from './ui'
import { IconeAcessivel, IconeCartao, IconeCheck, IconeRelogio, IconeWhats, IlustracaoAtendimento } from './Icones'

/* ============================== O DENTISTA ============================== */

export function Dentista() {
  const foto = CONFIG.fotos.dentista
  const especialidades = especialidadesVisiveis()
  const principios = ['Avaliação individual', 'Explicações claras', 'Atendimento com hora marcada']

  return (
    <section id="dentista" aria-labelledby="t-dentista" className="relative bg-ivory py-24 sm:py-32">
      <div className="container-site grid items-center gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
        <Reveal className="relative mx-auto w-full max-w-[26rem] lg:mx-0">
          {foto ? (
            <figure className="relative">
              <AnelDourado
                className="absolute -left-[12%] -top-[9%] -z-0 w-[78%] text-gold"
                aneisInternos={false}
                espessura={0.9}
                duracao={2.6}
              />
              <div className="relative overflow-hidden rounded-t-[999px] rounded-b-[1.75rem] bg-sand-2 shadow-[0_30px_60px_-30px_rgb(15_14_12/0.45)]">
                <picture>
                  <source
                    type="image/webp"
                    srcSet={`${foto.webp.replace('-720', '-480')} 480w, ${foto.webp.replace('-720', '-600')} 600w, ${foto.webp} 720w`}
                    sizes="(min-width: 1024px) 416px, calc(100vw - 40px)"
                  />
                  <img
                    src={foto.jpg}
                    alt={foto.alt}
                    width={foto.largura}
                    height={foto.altura}
                    loading="lazy"
                    decoding="async"
                    className="aspect-[6/7] h-auto w-full object-cover"
                  />
                </picture>
              </div>
              <figcaption className="absolute -bottom-6 right-4 rounded-full border border-gold/40 bg-ink px-5 py-3 text-sm text-ivory shadow-lg sm:right-[-1.5rem]">
                {CONFIG.nome} · <span className="text-gold-soft">{CONFIG.cro}</span>
              </figcaption>
            </figure>
          ) : (
            <div className="relative aspect-square" aria-hidden>
              <AnelDourado className="absolute inset-0 size-full" />
              <div className="absolute inset-[18%] grid place-items-center rounded-full bg-ink text-center">
                <span className="font-serif text-[clamp(3rem,10vw,5rem)] font-[330] italic leading-none text-gold-soft">HM</span>
              </div>
            </div>
          )}
        </Reveal>

        <div>
          <Reveal>
            <Titulo id="t-dentista" rotulo="O dentista" texto="Cuidado que começa pela *escuta*." />
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-8 font-serif text-2xl font-[380] leading-snug text-text">
              {CONFIG.nome}
              <span className="mt-1 block font-sans text-base font-semibold tracking-[0.02em] text-gold-deep">
                {CONFIG.titulo} · {CONFIG.cro}
              </span>
            </p>
            {especialidades.length > 0 && (
              <ul className="mt-4 space-y-1 text-[0.95rem] text-muted">
                {especialidades.map((e) => (
                  <li key={e.nome}>
                    Especialista em {e.nome} · Registro de especialidade nº {e.registro}
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-6 space-y-4 text-[1.05rem] text-muted">
              <p>
                Cada tratamento começa com uma avaliação individual: entender o que você procura, examinar com atenção e
                explicar as alternativas com palavras simples.
              </p>
              <p>
                A decisão é tomada em conjunto, com tempo para perguntas. O atendimento acontece com hora marcada, no
                Jardim Aureliano, em {CONFIG.cidade}, para que cada consulta seja feita sem pressa.
              </p>
            </div>
          </Reveal>

          {CONFIG.formacao.length > 0 && (
            <Reveal delay={0.15}>
              <h3 className="mt-10 eyebrow text-gold-deep">Formação</h3>
              <ul className="mt-3 space-y-2 text-muted">
                {CONFIG.formacao.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </Reveal>
          )}

          <Reveal delay={0.2}>
            <ul className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3">
              {principios.map((p, i) => (
                <li key={p} className="bg-ivory px-5 py-5">
                  <span className="font-serif text-sm italic text-gold-deep">0{i + 1}</span>
                  <span className="mt-1 block text-[0.95rem] font-semibold leading-snug text-text">{p}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          {CONFIG.equipe.length > 0 && (
            <Reveal delay={0.25}>
              <h3 className="mt-10 eyebrow text-gold-deep">Equipe</h3>
              <ul className="mt-3 space-y-2 text-muted">
                {CONFIG.equipe.map((p) => (
                  <li key={p.nome}>
                    <strong className="font-semibold text-text">{p.nome}</strong> · {p.titulo} · {p.cro}
                  </li>
                ))}
              </ul>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  )
}

/* ============================== ATENDIMENTOS ============================== */

/** Cartão com brilho dourado que segue o cursor (adaptado do padrão "spotlight card"). */
function CartaoAtendimento({ a, i }: { a: (typeof CONFIG.atendimentos)[number]; i: number }) {
  const ref = useRef<HTMLElement>(null)
  const onMove = (e: MouseEvent) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    el.style.setProperty('--mx', `${e.clientX - r.left}px`)
    el.style.setProperty('--my', `${e.clientY - r.top}px`)
  }
  return (
    <Reveal as="li" delay={i * 0.08} className="h-full">
      <article
        ref={ref}
        onMouseMove={onMove}
        aria-labelledby={`at-${a.id}`}
        className="group relative flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-line bg-ivory p-7 transition-[border-color,transform,box-shadow] duration-500 ease-out-soft hover:-translate-y-1 hover:border-gold/70 hover:shadow-[0_24px_50px_-28px_rgb(15_14_12/0.35)] sm:p-8"
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: 'radial-gradient(420px circle at var(--mx,50%) var(--my,0%), rgb(195 164 107 / 0.16), transparent 60%)' }}
        />
        <div className="relative flex items-start justify-between gap-4">
          <span className="grid size-20 place-items-center rounded-full border border-gold/40 text-gold-deep transition-colors duration-500 group-hover:border-gold">
            <IlustracaoAtendimento tipo={a.icone} className="size-14" />
          </span>
          <span className="font-serif text-sm italic text-muted">0{i + 1}</span>
        </div>
        <h3 id={`at-${a.id}`} className="relative mt-7 text-[1.75rem] text-text">
          {a.nome}
        </h3>
        <p className="relative mt-3 text-[1rem] leading-relaxed text-muted">{a.resumo}</p>
        <p className="relative mt-3 text-[0.95rem] leading-relaxed text-muted">{a.detalhe}</p>
        <p className="relative mt-5 border-l-2 border-gold/60 pl-3 text-sm font-medium text-text/80">{CONFIG.avisoIndicacao}</p>
        <div className="relative mt-auto pt-7">
          <a
            href={linkWhats(msgAtendimento(a.nome))}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 items-center gap-2 text-[0.95rem] font-semibold text-gold-deep underline decoration-gold/50 underline-offset-[6px] transition-colors hover:text-ink hover:decoration-gold"
          >
            <IconeWhats className="size-5" />
            Perguntar sobre {a.nome.toLowerCase()}
            <span className="sr-only"> pelo WhatsApp (abre em nova aba)</span>
          </a>
        </div>
      </article>
    </Reveal>
  )
}

export function Atendimentos() {
  if (!CONFIG.atendimentos.length) return null
  return (
    <section id="atendimentos" aria-labelledby="t-atendimentos" className="bg-sand py-24 sm:py-32">
      <div className="container-site">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <Reveal>
            <Titulo id="t-atendimentos" rotulo="Atendimentos" texto="O que você encontra no *consultório*." />
          </Reveal>
          <Reveal delay={0.1} className="max-w-md">
            <p className="text-[1.05rem] text-muted">
              Conteúdo informativo para você chegar à consulta com mais clareza. Cada caso é avaliado individualmente.
            </p>
          </Reveal>
        </div>
        <ul className="mt-14 grid gap-5 md:grid-cols-2">
          {CONFIG.atendimentos.map((a, i) => (
            <CartaoAtendimento key={a.id} a={a} i={i} />
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ============================== QUANDO PROCURAR ============================== */

export function QuandoProcurar() {
  if (!CONFIG.quandoProcurar.length) return null
  return (
    <section aria-labelledby="t-quando" className="bg-ivory py-24 sm:py-32">
      <div className="container-site grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <Reveal>
          <Titulo id="t-quando" rotulo="Quando procurar" texto="Bons motivos para uma *conversa*." />
          <p className="mt-6 max-w-sm text-[1.05rem] text-muted">
            Não é preciso esperar um incômodo para marcar uma avaliação. Algumas situações comuns:
          </p>
        </Reveal>
        <ol className="divide-y divide-line border-y border-line">
          {CONFIG.quandoProcurar.map((q, i) => (
            <Reveal as="li" key={q.titulo} delay={i * 0.08} className="grid gap-3 py-8 sm:grid-cols-[4rem_1fr] sm:gap-6">
              <span aria-hidden className="font-serif text-4xl font-[300] italic leading-none text-gold-deep/80">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div>
                <h3 className="text-2xl text-text">{q.titulo}</h3>
                <p className="mt-2 text-muted">{q.texto}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}

/* ============================== COMO FUNCIONA ============================== */

/** Linha do tempo com progresso ao rolar (adaptado do padrão "scroll progress timeline"). */
export function ComoFunciona() {
  return (
    <section
      id="como-funciona"
      aria-labelledby="t-como"
      className="on-dark relative overflow-hidden bg-ink-2 py-24 text-ivory sm:py-32"
    >
      <div className="grid-fina absolute inset-0 opacity-60 [mask-image:linear-gradient(to_bottom,transparent,black_30%,black_70%,transparent)]" />
      <div className="container-site relative grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        <Reveal className="lg:sticky lg:top-40 lg:self-start">
          <Titulo id="t-como" rotulo="Como funciona" texto="Quatro etapas, sem *pressa*." escuro />
          <p className="mt-6 max-w-sm text-[1.05rem] text-ivory/70">
            Do primeiro contato ao acompanhamento, você sabe o que acontece em cada momento.
          </p>
        </Reveal>

        <ol data-progresso-alvo="" className="relative space-y-12 pl-14 sm:pl-20">
          <span aria-hidden className="absolute bottom-2 left-[1.15rem] top-2 w-px bg-ivory/12 sm:left-[1.65rem]" />
          <span
            aria-hidden
            data-progresso=""
            className="absolute bottom-2 left-[1.15rem] top-2 w-px origin-top bg-gold transition-transform duration-300 ease-out sm:left-[1.65rem]"
          />
          {CONFIG.etapas.map((e, i) => (
            <Reveal as="li" key={e.titulo} delay={0.05} className="relative">
              <span
                aria-hidden
                className="absolute -left-14 top-0 grid size-[2.35rem] place-items-center rounded-full border border-gold/60 bg-ink-2 font-serif text-sm italic text-gold-soft sm:-left-20 sm:size-[3.35rem] sm:text-base"
              >
                {i + 1}
              </span>
              <p className="eyebrow text-gold-soft/80">Etapa {i + 1}</p>
              <h3 className="mt-2 text-[1.75rem] text-ivory sm:text-3xl">{e.titulo}</h3>
              <p className="mt-3 max-w-lg text-ivory/70">{e.texto}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}

/* ============================== ESTRUTURA ============================== */

export function Estrutura() {
  const { acessibilidade, funcionamento, pagamentos } = CONFIG.estrutura
  const blocos = [
    { titulo: 'Acessibilidade', itens: acessibilidade, Icone: IconeAcessivel },
    { titulo: 'Funcionamento', itens: funcionamento, Icone: IconeRelogio },
    { titulo: 'Formas de pagamento', itens: pagamentos, Icone: IconeCartao },
  ].filter((b) => b.itens.length)
  if (!blocos.length) return null

  return (
    <section aria-labelledby="t-estrutura" className="bg-sand py-24 sm:py-32">
      <div className="container-site">
        <Reveal>
          <Titulo id="t-estrutura" rotulo="Acessibilidade e estrutura" texto="Um ambiente pensado para *receber*." />
        </Reveal>
        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {blocos.map(({ titulo, itens, Icone }, i) => (
            <Reveal key={titulo} delay={i * 0.08} className="rounded-[1.5rem] border border-line bg-ivory p-7 sm:p-8">
              <span className="grid size-12 place-items-center rounded-full border border-gold/50 text-gold-deep">
                <Icone className="size-6" />
              </span>
              <h3 className="mt-6 text-2xl text-text">{titulo}</h3>
              <ul className="mt-4 space-y-3">
                {itens.map((t) => (
                  <li key={t} className="flex gap-3 text-[0.98rem] text-muted">
                    <IconeCheck className="mt-1 size-4 shrink-0 text-gold-deep" />
                    {t}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}


/* ============================== O CONSULTÓRIO (galeria) ============================== */

/** Galeria em grade (sem carrossel): retratos ocupam duas linhas, a primeira foto horizontal fica em destaque. */
export function Consultorio() {
  const fotos = CONFIG.fotos.consultorio
  if (!fotos.length) return null
  const destaque = fotos.findIndex((f) => f.largura > f.altura)
  return (
    <section id="consultorio" aria-labelledby="t-consultorio" className="bg-ivory py-24 sm:py-32">
      <div className="container-site">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <Reveal>
            <Titulo id="t-consultorio" rotulo="O consultório" texto="Conheça o *espaço*." />
          </Reveal>
          <Reveal delay={0.1} className="max-w-md">
            <p className="text-[1.05rem] text-muted">
              {CONFIG.endereco.rua}, no {CONFIG.endereco.bairro}. Um ambiente simples e organizado, com atendimento
              com hora marcada.
            </p>
          </Reveal>
        </div>
        <ul className="mt-14 grid grid-flow-dense gap-4 sm:grid-cols-2 lg:auto-rows-[17rem] lg:grid-cols-4 lg:gap-5">
          {fotos.map((f, i) => {
            const retrato = f.altura > f.largura
            const forma = retrato
              ? 'aspect-[4/5] lg:row-span-2'
              : i === destaque
                ? 'aspect-[4/3] sm:col-span-2 sm:aspect-[16/9] lg:col-span-2'
                : 'aspect-[4/3]'
            return (
              <Reveal as="li" key={f.webp} delay={(i % 4) * 0.06} className={`${forma} lg:aspect-auto`}>
                <figure className="group relative h-full overflow-hidden rounded-[1.25rem] border border-line bg-sand">
                  <picture>
                    <source
                      type="image/webp"
                      srcSet={`${f.webp.replace('-800', '-480')} 480w, ${f.webp} 800w`}
                      sizes="(min-width: 1024px) 560px, (min-width: 640px) 50vw, 92vw"
                    />
                    <img
                      src={f.jpg}
                      alt={f.alt}
                      width={f.largura}
                      height={f.altura}
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-out-soft group-hover:scale-[1.03]"
                    />
                  </picture>
                  {f.legenda && (
                    <figcaption className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full bg-ink/85 px-3.5 py-1.5 text-[0.8rem] font-semibold text-ivory backdrop-blur-sm">
                      <span aria-hidden className="size-1.5 rounded-full bg-gold" />
                      {f.legenda}
                    </figcaption>
                  )}
                </figure>
              </Reveal>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
