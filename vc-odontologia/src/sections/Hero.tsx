import { CONFIG, type Profissional } from '../config'
import { Arco, BotaoWhatsApp, Foto, IconeLocal, IconeSeta } from '../components/base'

/** Quebra o título em palavras para a revelação palavra por palavra (CSS). */
function Palavras({ texto, inicio = 0, italico = false }: { texto: string; inicio?: number; italico?: boolean }) {
  return (
    <>
      {texto.split(' ').map((p, i) => (
        <span key={i}>
          <span className="palavra" style={{ ['--i' as string]: inicio + i }}>
            {italico ? <em className="text-champagne">{p}</em> : p}
          </span>{' '}
        </span>
      ))}
    </>
  )
}

export function Hero() {
  return (
    <section
      id="inicio"
      aria-labelledby="titulo-hero"
      className="escuro relative isolate overflow-hidden bg-navy-900 text-ivory"
    >
      {/* Fundo: luz suave + arco fino do logo, em escala grande */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 left-1/2 h-[46rem] w-[46rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(38_55_96/0.9),transparent)]" />
        <Arco className="absolute -right-48 top-24 h-[44rem] w-[44rem] text-champagne/10 lg:-right-24" />
      </div>

      <div
        className={`container-vc grid items-center gap-14 pb-16 ${CONFIG.rascunho ? 'pt-36' : 'pt-28'} sm:pb-20 lg:min-h-[min(100svh,58rem)] lg:grid-cols-[1.25fr_1fr] lg:gap-10 lg:pb-24 lg:pt-40`}
      >
        <div className="max-w-2xl">
          <h1 id="titulo-hero" className="titulo-hero">
            <span className="rotulo surge mb-7 flex items-center gap-3 text-champagne sm:gap-4" style={{ ['--d' as string]: '0.05s' }}>
              <span className="filete !w-8 sm:!w-14" />
              Odontologia em Alfenas - MG
            </span>
            <span className="block text-[clamp(2.75rem,1.9rem+4.4vw,5.25rem)] leading-[1.02]">
              <Palavras texto="Dois profissionais, um só" />
              <Palavras texto="cuidado" inicio={4} italico />
              <Palavras texto="com o seu sorriso." inicio={5} />
            </span>
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-relaxed text-ivory/80 sm:text-xl">
            Implantes, próteses e reabilitação oral, com diagnóstico, planejamento individual e explicações claras.
          </p>
          <div className="surge mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap" style={{ ['--d' as string]: '0.9s' }}>
            <BotaoWhatsApp>Agendar minha avaliação</BotaoWhatsApp>
            <a href="#profissionais" className="botao botao-contorno-claro">
              Conhecer os profissionais
              <IconeSeta tamanho={17} className="seta" />
            </a>
          </div>
          <p className="surge mt-10 flex items-start gap-3 text-sm text-ivory/70" style={{ ['--d' as string]: '1.05s' }}>
            <IconeLocal tamanho={18} className="mt-0.5 shrink-0 text-champagne" />
            <span>
              {CONFIG.endereco.logradouro} · {CONFIG.endereco.bairro} · {CONFIG.endereco.cidade} - {CONFIG.endereco.uf}
            </span>
          </p>
        </div>

        <Assinatura />
      </div>
    </section>
  )
}

/**
 * Momento de assinatura: as duas colunas (V de Vilhena, C de Carvalho) começam
 * afastadas e desencontradas e, ao rolar, se alinham em torno de uma linha
 * dourada central, formando o "V & C". O movimento é ligado depois do
 * carregamento por src/lib/movimento.ts (lib motion, só transform e opacity).
 * Sem JS ou com movimento reduzido, fica na composição final, estática.
 */
function Assinatura() {
  const [esq, dir] = CONFIG.profissionais
  return (
    <div data-assinatura className="surge relative mx-auto w-full max-w-[33rem] lg:mr-0" style={{ ['--d' as string]: '0.35s' }}>
      <div className="relative grid grid-cols-2 gap-4 sm:gap-6">
        <span
          aria-hidden="true"
          data-assin="linha"
          className="assin-linha absolute -bottom-4 -top-6 left-1/2 -ml-px w-px origin-top bg-gradient-to-b from-champagne/0 via-champagne to-champagne/0"
        />
        <Coluna prof={esq} lado={-1} />
        <Coluna prof={dir} lado={1} />
        <span
          aria-hidden="true"
          data-assin="e"
          className="assin-e absolute left-1/2 top-[46%] z-10 -ml-7 -mt-7 flex h-14 w-14 items-center justify-center rounded-full border border-champagne/60 bg-navy-900 font-display text-3xl italic text-champagne sm:-ml-8 sm:-mt-8 sm:h-16 sm:w-16 sm:text-4xl"
        >
          &amp;
        </span>
      </div>
      <p className="rotulo mt-16 text-center text-[0.625rem] text-champagne/80 sm:text-[0.6875rem]">{CONFIG.nomeCompleto}</p>
    </div>
  )
}

function Coluna({ prof, lado }: { prof: Profissional; lado: -1 | 1 }) {
  return (
    <figure data-assin={lado === -1 ? 'esq' : 'dir'} className="assin-col relative" style={{ ['--lado' as string]: lado }}>
      <div className="relative overflow-hidden rounded-t-[999px] rounded-b-md bg-navy-800 ring-1 ring-champagne/25">
        <Foto
          nome={prof.fotos.retrato}
          larguras={[320, 420, 538]}
          sizes="(min-width: 1024px) 255px, 45vw"
          alt={prof.alt}
          largura={538}
          altura={660}
          prioridade
          className="aspect-[538/660] h-auto w-full object-cover"
        />
        <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-navy-900/70 to-transparent" />
      </div>
      <figcaption className={`mt-5 ${lado === -1 ? 'text-right' : 'text-left'}`}>
        <span aria-hidden="true" className="block font-display text-5xl italic leading-none text-champagne sm:text-6xl">
          {prof.letra}
        </span>
        <span className="mt-2 block font-display text-lg leading-tight text-ivory sm:text-xl">{prof.nome}</span>
        <span className="mt-1.5 block text-[0.6875rem] font-semibold tracking-[0.04em] text-ivory/70 sm:tracking-[0.08em] lg:whitespace-nowrap lg:text-[0.625rem] lg:tracking-[0.02em]">
          {prof.cro}
        </span>
      </figcaption>
    </figure>
  )
}
