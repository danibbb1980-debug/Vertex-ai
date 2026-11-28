import { useState, type FormEvent, type ReactNode } from 'react'
import { CONFIG, waLink } from '../config'
import { IconeWhatsApp } from './icones'

// Hero em painel arredondado, a partir da referência enviada pelo cliente.
// A imagem é ilustrativa e original (gerada para este rascunho), não é foto da clínica
// nem de paciente. Para trocar por uma foto real da OrtoFisio, substitua public/img/hero-pilates-*.webp
// (mesma proporção 3:2, pessoa à direita) e ajuste os pontos de `notas` abaixo.

// Pontos das anotações, em pixels da imagem original (1536 × 1024)
const IMG_W = 1536
const IMG_H = 1024
const notas = [
  { x: 1197, y: 104, lx: 1262, ly: 132, texto: 'Avaliação individual antes de começar' },
  { x: 1088, y: 612, lx: 640, ly: 520, texto: 'Fisioterapia e pilates', esquerda: true },
  { x: 1296, y: 664, lx: 1338, ly: 742, texto: `No Centro de ${CONFIG.cidade}` },
]
const pct = (v: number, t: number) => `${(v / t) * 100}%`

function Anotacoes() {
  return (
    <div className="anotacoes absolute inset-0 hidden xl:block" aria-hidden="true">
      <svg viewBox={`0 0 ${IMG_W} ${IMG_H}`} className="absolute inset-0 h-full w-full" fill="none">
        {notas.map((n) => (
          <g key={n.texto}>
            <path
              d={`M ${n.x} ${n.y} L ${n.esquerda ? n.lx + 250 : n.lx - 10} ${n.ly + 14}`}
              stroke="#f3f1ea"
              strokeOpacity="0.6"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
            <circle cx={n.x} cy={n.y} r="15" stroke="#f3f1ea" strokeOpacity="0.7" strokeWidth="1" vectorEffect="non-scaling-stroke" />
            <circle cx={n.x} cy={n.y} r="6" fill="#f3f1ea" />
          </g>
        ))}
      </svg>
      {notas.map((n) => (
        <p
          key={n.texto}
          className={`absolute w-[10rem] text-[0.875rem] font-medium leading-snug text-linho ${n.esquerda ? 'text-right' : ''}`}
          style={n.esquerda ? { right: pct(IMG_W - (n.lx + 250), IMG_W), top: pct(n.ly, IMG_H), marginRight: '0.6rem' } : { left: pct(n.lx, IMG_W), top: pct(n.ly, IMG_H) }}
        >
          {n.texto}
        </p>
      ))}
    </div>
  )
}

function Imagem({ className = '' }: { className?: string }) {
  return (
    <img
      src="/img/hero-pilates-1536.webp"
      srcSet="/img/hero-pilates-640.webp 640w, /img/hero-pilates-1024.webp 1024w, /img/hero-pilates-1536.webp 1536w"
      sizes="(min-width: 1280px) 75vw, 100vw"
      width={IMG_W}
      height={IMG_H}
      alt="Mulher em postura de alongamento lateral sobre um tapete, com um braço estendido para o alto (imagem ilustrativa)"
      fetchPriority="high"
      decoding="async"
      className={className}
    />
  )
}

const Chip = ({ children }: { children: ReactNode }) => (
  <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-linho/30 bg-linho/10 text-linho md:h-12 md:w-12">
    {children}
  </span>
)

export function HeroPainel() {
  const [nome, setNome] = useState('')
  const hora = (h: string) => h.replace(':00', 'h').replace(/^0/, '')

  const enviar = (e: FormEvent) => {
    e.preventDefault()
    const n = nome.trim()
    const msg = n ? `${CONFIG.mensagens.geral} Meu nome é ${n}.` : CONFIG.mensagens.geral
    const janela = window.open(waLink(msg), '_blank')
    if (janela) janela.opener = null
    else window.location.href = waLink(msg)
  }

  return (
    <section id="topo" aria-labelledby="titulo-hero" className={`px-3 pb-6 md:px-5 ${CONFIG.rascunho ? 'pt-[6.75rem] md:pt-[7.5rem]' : 'pt-[4.75rem] md:pt-[5.5rem]'}`}>
      <div className="painel-hero bg-escuro relative isolate overflow-hidden rounded-[2rem] text-linho md:rounded-[2.75rem]">
        {/* Imagem no desktop: ancorada à direita, emendada no fundo por máscara */}
        <div className="foto-hero absolute bottom-0 right-0 hidden h-[92%] xl:block" style={{ aspectRatio: `${IMG_W} / ${IMG_H}` }}>
          <Imagem className="mascara-foto absolute inset-0 h-full w-full" />
          <Anotacoes />
        </div>

        <div className="mx-auto grid max-w-[86rem] gap-6 px-6 pb-8 pt-12 md:grid-cols-12 md:gap-x-6 md:px-12 md:pb-12 md:pt-20 lg:gap-x-8">
          <div className="relative z-10 md:col-span-7 lg:col-span-6">
            <p className="rotulo !text-linho/75">
              Fisioterapia e pilates <span aria-hidden="true">·</span>{' '}
              <span className="whitespace-nowrap">
                {CONFIG.cidade} - {CONFIG.uf}
              </span>
            </p>
            <h1 id="titulo-hero" className="mt-6 font-display text-[clamp(2.6rem,6vw,5rem)] font-normal leading-[0.98] tracking-[-0.035em] !text-linho">
              <span className="linha-mascara">
                <span>Cuidado</span>
              </span>
              <span className="linha-mascara">
                <span className="enfase" style={{ animationDelay: '0.08s' }}>
                  individualizado
                </span>
              </span>
              <span className="linha-mascara">
                <span style={{ animationDelay: '0.16s' }}>para o seu</span>
              </span>
              <span className="linha-mascara">
                <span className="flex flex-wrap items-center gap-x-4 gap-y-3" style={{ animationDelay: '0.24s' }}>
                  movimento.
                  <span className="inline-flex gap-1.5 align-middle" aria-hidden="true">
                    <Chip>
                      {/* movimento */}
                      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
                        <circle cx="15.5" cy="5" r="1.8" fill="currentColor" />
                        <path d="M4 19c3-.6 6-2.6 8-5.6 1.6-2.4 3-4.6 5.5-5.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </Chip>
                    <Chip>
                      {/* local */}
                      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
                        <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z" stroke="currentColor" strokeWidth="1.5" />
                        <circle cx="12" cy="10" r="2.2" stroke="currentColor" strokeWidth="1.5" />
                      </svg>
                    </Chip>
                    <Chip>
                      {/* agenda */}
                      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
                        <rect x="4" y="5.5" width="16" height="14" rx="3" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M8 3.5v4M16 3.5v4M4 10h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </Chip>
                  </span>
                </span>
              </span>
            </h1>

            <p className="mt-7 max-w-[36ch] text-lg leading-relaxed text-linho/90 md:text-xl">
              Fisioterapia e pilates em {CONFIG.cidade}, com atendimento pensado para cada pessoa.
            </p>

            {CONFIG.whatsapp && (
              <form onSubmit={enviar} className="mt-9 max-w-[32rem]">
                <div className="flex flex-col gap-2 rounded-[1.75rem] border border-linho/25 bg-linho/10 p-2 sm:flex-row sm:items-center sm:rounded-full">
                  <label htmlFor="hero-nome" className="sr-only">
                    Seu nome (opcional)
                  </label>
                  <input
                    id="hero-nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    autoComplete="given-name"
                    placeholder="Seu nome (opcional)"
                    className="campo-hero min-h-12 flex-1 rounded-full bg-transparent px-4 text-base text-linho placeholder:text-linho/65"
                  />
                  <button type="submit" className="btn btn-claro !min-h-12 shrink-0">
                    <IconeWhatsApp />
                    Agendar pelo WhatsApp
                  </button>
                </div>
              </form>
            )}
            {CONFIG.secoes.atendimentos && CONFIG.atendimentos.length > 0 && (
              <a href="#atendimentos" className="link-fino mt-5 inline-flex min-h-12 items-center font-semibold text-linho">
                Conhecer os atendimentos
              </a>
            )}
          </div>

          {/* Imagem no celular */}
          <div className="-mx-6 overflow-hidden md:col-span-12 md:-mx-12 xl:hidden">
            <Imagem className="mascara-foto-celular aspect-[4/3] w-full object-cover object-[78%_100%] md:aspect-[16/9]" />
          </div>

          {/* Base do painel: dados reais no lugar de prova social */}
          <dl className="relative z-10 grid gap-y-4 border-t border-linho/20 pt-6 xl:mt-10 xl:max-w-[22rem] xl:grid-cols-1 md:grid-cols-3 text-[0.95rem] sm:grid-cols-2 md:col-span-12 md:gap-x-6">
            <div>
              <dt className="rotulo !text-linho/70">Endereço</dt>
              <dd className="mt-1">
                {CONFIG.endereco.rua}, {CONFIG.endereco.bairro}
              </dd>
            </div>
            {CONFIG.horarios.length > 0 && (
              <div>
                <dt className="rotulo !text-linho/70">Horários</dt>
                <dd className="tabular mt-1">
                  {CONFIG.horarios
                    .map((h) => `${h.rotulo.replace('Segunda a quinta', 'Seg. a qui.').replace('Sexta', 'Sex.')} ${hora(h.abre)} às ${hora(h.fecha)}`)
                    .join('  /  ')}
                </dd>
              </div>
            )}
            {CONFIG.telefoneExibicao && (
              <div className="xl:hidden">
                <dt className="rotulo !text-linho/70">Telefone</dt>
                <dd className="tabular mt-1">
                  <a href={`tel:${CONFIG.telefone}`} className="link-fino">
                    {CONFIG.telefoneExibicao}
                  </a>
                </dd>
              </div>
            )}
          </dl>
        </div>
      </div>
    </section>
  )
}
