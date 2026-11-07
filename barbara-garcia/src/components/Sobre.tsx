import { CONFIG } from '../config'
import { Favo, Monograma } from './Marca'
import { IconeCheck } from './Icones'

const PONTOS = ['Atendimento individual, com hora marcada', 'Conversa e avaliação antes de cada procedimento', 'Explicações claras sobre cada etapa', 'Horários variados, de segunda a sábado']

export function Sobre() {
  if (!CONFIG.secoes.sobre) return null
  const { foto, profissional, marca } = CONFIG
  const credenciais = [profissional.titulo, profissional.formacao, profissional.registro].filter(Boolean)

  return (
    <section id="sobre" aria-labelledby="titulo-sobre" className="relative py-20 md:py-28">
      <div data-fio="margem" className="container-site grid items-center gap-12 md:grid-cols-[0.9fr_1.1fr] md:gap-16 lg:gap-24">
        <div className="revela relative mx-auto w-full max-w-[24rem] md:max-w-none">
          {foto ? (
            <figure className="relative">
              <div className="absolute -inset-3 rounded-t-[12rem] rounded-b-[2rem] border border-mel/60 md:-inset-4" aria-hidden="true" />
              <picture>
                <source type="image/avif" srcSet={`${foto.base}-320.avif 320w, ${foto.base}-440.avif 440w`} sizes="(min-width: 768px) 440px, 90vw" />
                <img
                  src={`${foto.base}-440.webp`}
                  srcSet={`${foto.base}-320.webp 320w, ${foto.base}-440.webp 440w`}
                  sizes="(min-width: 768px) 440px, 90vw"
                  width={foto.largura}
                  height={foto.altura}
                  alt={foto.alt}
                  loading="lazy"
                  decoding="async"
                  className="relative aspect-[4/5] w-full rounded-t-[11rem] rounded-b-[1.6rem] object-cover shadow-[var(--shadow-macia)]"
                />
              </picture>
              <Favo className="absolute -bottom-8 -right-2 w-20 text-mel md:-right-10 md:w-28" />
              <Favo preenchido className="absolute -left-10 top-[14%] hidden w-14 text-areia md:block" />
            </figure>
          ) : (
            <div className="relative mx-auto aspect-[4/5] w-full overflow-hidden rounded-t-[12rem] rounded-b-[2rem] bg-oliva" aria-hidden="true">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgb(217_164_65/0.35),transparent_60%)]" />
              {[
                ['-8%', '6%'],
                ['26%', '-6%'],
                ['60%', '8%'],
                ['-4%', '64%'],
                ['30%', '76%'],
                ['66%', '62%'],
              ].map(([left, top], i) => (
                <div key={i} className="absolute w-[34%] text-aveia/15" style={{ left, top }}>
                  <Favo className="w-full" />
                </div>
              ))}
              <Monograma tom="escuro" className="absolute left-1/2 top-1/2 w-[46%] -translate-x-1/2 -translate-y-1/2" />
            </div>
          )}
        </div>

        <div>
          <p className="rotulo revela">Sobre</p>
          <h2 id="titulo-sobre" className="revela mt-4 text-[clamp(2rem,4.8vw,3.2rem)]" style={{ ['--atraso' as string]: '80ms' }}>
            Um atendimento por vez, com tempo para <em>conversar</em>.
          </h2>
          {credenciais.length > 0 && <p className="revela mt-4 font-semibold text-oliva">{credenciais.join(' · ')}</p>}
          <div className="revela mt-6 space-y-4 text-[1.08rem] text-suave" style={{ ['--atraso' as string]: '160ms' }}>
            <p>
              Na {marca.nomeCompleto}, cada horário é reservado para uma pessoa. Antes de qualquer procedimento, há uma conversa e uma avaliação para
              entender o que você procura e explicar, de forma clara, como o atendimento funciona.
            </p>
            <p>
              Os horários mudam ao longo da semana, com opções cedo, à tarde e no começo da noite em alguns dias, além do sábado. Assim fica mais
              simples encaixar esse momento na sua rotina.
            </p>
          </div>
          <ul className="revela mt-8 grid gap-3 sm:grid-cols-2" style={{ ['--atraso' as string]: '240ms' }}>
            {PONTOS.map((p) => (
              <li key={p} className="flex items-start gap-3 rounded-2xl bg-areia-2 px-4 py-3.5 text-[0.98rem] text-grafite">
                <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-oliva text-aveia">
                  <IconeCheck tamanho={14} strokeWidth={2.4} />
                </span>
                {p}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
