import type { ReactNode, SVGProps } from 'react'
import { CONFIG, linkWhatsApp } from '../config'

/* ---------- Ícones de traço fino ---------- */

type IconeProps = SVGProps<SVGSVGElement> & { tamanho?: number }

function Svg({ tamanho = 20, children, ...p }: IconeProps & { children: ReactNode }) {
  return (
    <svg
      width={tamanho}
      height={tamanho}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...p}
    >
      {children}
    </svg>
  )
}

export const IconeSeta = (p: IconeProps) => (
  <Svg {...p}>
    <path d="M4 12h15M13 6l6 6-6 6" />
  </Svg>
)
export const IconeWhatsApp = (p: IconeProps) => (
  <Svg {...p}>
    <path d="M3.5 20.5l1.3-4.2A8.5 8.5 0 1 1 8 19.3z" />
    <path d="M9 8.6c0 3.3 3 6.4 6.4 6.4l1.2-1.4-2-1-1 .8c-1.1-.5-2-1.4-2.5-2.5l.8-1-1-2z" />
  </Svg>
)
export const IconeInstagram = (p: IconeProps) => (
  <Svg {...p}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" stroke="none" />
  </Svg>
)
export const IconeLocal = (p: IconeProps) => (
  <Svg {...p}>
    <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z" />
    <circle cx="12" cy="10" r="2.3" />
  </Svg>
)
export const IconeRelogio = (p: IconeProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </Svg>
)
export const IconeMenu = (p: IconeProps) => (
  <Svg {...p}>
    <path d="M4 8h16M4 16h16" />
  </Svg>
)
export const IconeFechar = (p: IconeProps) => (
  <Svg {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </Svg>
)
export const IconeMais = (p: IconeProps) => (
  <Svg {...p}>
    <path d="M12 5v14M5 12h14" />
  </Svg>
)
export const IconeOuvir = (p: IconeProps) => (
  <Svg {...p}>
    <path d="M7 9a5 5 0 0 1 10 0c0 3-3 3.5-3 6.5a2.5 2.5 0 0 1-4.6 1.3" />
    <path d="M10 9.5a2 2 0 0 1 4 0" />
  </Svg>
)
export const IconeLupa = (p: IconeProps) => (
  <Svg {...p}>
    <circle cx="10.5" cy="10.5" r="6" />
    <path d="M15 15l5 5" />
  </Svg>
)
export const IconePlano = (p: IconeProps) => (
  <Svg {...p}>
    <path d="M5 4.5h10l4 4v11H5z" />
    <path d="M14.5 4.5v4.5H19M8.5 12.5h7M8.5 16h5" />
  </Svg>
)
export const IconeConversa = (p: IconeProps) => (
  <Svg {...p}>
    <path d="M4 5.5h16v10H10l-4 3.5v-3.5H4z" />
    <path d="M8 9.5h8M8 12.5h5" />
  </Svg>
)
export const IconeCarro = (p: IconeProps) => (
  <Svg {...p}>
    <path d="M5 16.5v2M19 16.5v2M3.5 16.5h17v-4l-2-5h-13l-2 5z" />
    <path d="M3.5 12.5h17" />
  </Svg>
)
export const IconeAcesso = (p: IconeProps) => (
  <Svg {...p}>
    <circle cx="12" cy="4.8" r="1.6" />
    <path d="M5.5 8.5l6.5 1 6.5-1M12 9.5v4.5l-3 6M12 14l3 6" />
  </Svg>
)
export const IconeCartao = (p: IconeProps) => (
  <Svg {...p}>
    <rect x="3.5" y="6" width="17" height="12" rx="2" />
    <path d="M3.5 10h17M7 14.5h4" />
  </Svg>
)

/* ---------- Arco fino, eco do arco do logo (usar com moderação) ---------- */

export function Arco({ className = '', espessura = 1 }: { className?: string; espessura?: number }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true" focusable="false" fill="none">
      <path
        d="M168 52A84 84 0 1 0 172 140"
        stroke="currentColor"
        strokeWidth={espessura}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}

/* Separador em losango fino */
export const Losango = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 10 10" className={className} aria-hidden="true" focusable="false">
    <path d="M5 0.8 9.2 5 5 9.2 0.8 5z" fill="none" stroke="currentColor" strokeWidth="0.9" />
  </svg>
)

/* ---------- Logo: arquivo da clínica, usado exatamente como enviado ---------- */

export function Logo({ tamanho = 44, className = '' }: { tamanho?: number; className?: string }) {
  return (
    <img
      src="/marca/logo-vc-96.webp"
      width={tamanho}
      height={tamanho}
      alt=""
      decoding="async"
      className={`rounded-full ${className}`}
    />
  )
}

/* ---------- Placeholders de dados a confirmar ---------- */

/** Texto com placeholder visível: o que estiver entre colchetes vira marcação. */
export function ComConfirmar({ texto }: { texto: string }) {
  const partes = texto.split(/(\[[^\]]+\])/g)
  return (
    <>
      {partes.map((p, i) =>
        p.startsWith('[') ? (
          // CONFIRMAR COM A CLÍNICA
          <span key={i} className="confirmar" title="Informação a confirmar com a clínica">
            {p}
          </span>
        ) : (
          p
        ),
      )}
    </>
  )
}

/** Selo "a confirmar": só aparece no modo rascunho. */
export function SeloConfirmar({ children = 'A confirmar com a clínica', className = '' }: { children?: ReactNode; className?: string }) {
  if (!CONFIG.rascunho) return null
  return <span className={`selo-confirmar ${className}`}>{children}</span>
}

/* ---------- Foto otimizada (AVIF + WebP) ---------- */

export function Foto({
  nome,
  larguras,
  sizes,
  alt,
  largura,
  altura,
  className = '',
  prioridade = false,
}: {
  nome: string
  larguras: number[]
  sizes: string
  alt: string
  largura: number
  altura: number
  className?: string
  prioridade?: boolean
}) {
  const srcset = (ext: string) => larguras.map((w) => `/fotos/${nome}-${w}.${ext} ${w}w`).join(', ')
  return (
    <picture>
      <source type="image/avif" srcSet={srcset('avif')} sizes={sizes} />
      <source type="image/webp" srcSet={srcset('webp')} sizes={sizes} />
      <img
        src={`/fotos/${nome}-${larguras[larguras.length - 1]}.webp`}
        alt={alt}
        width={largura}
        height={altura}
        loading={prioridade ? 'eager' : 'lazy'}
        fetchPriority={prioridade ? 'high' : 'auto'}
        decoding={prioridade ? 'sync' : 'async'}
        className={className}
      />
    </picture>
  )
}

/* ---------- Cabeçalho de seção ---------- */

export function CabecalhoSecao({
  rotulo,
  titulo,
  intro,
  id,
  claro = false,
  centro = false,
  selo,
}: {
  rotulo: string
  titulo: ReactNode
  intro?: ReactNode
  id: string
  claro?: boolean
  centro?: boolean
  selo?: ReactNode
}) {
  return (
    <div className={`revela max-w-3xl ${centro ? 'mx-auto text-center' : ''}`}>
      <p className={`rotulo flex items-center gap-4 ${centro ? 'justify-center' : ''} ${claro ? 'text-champagne' : 'text-ouro'}`}>
        <span className="filete filete-revela" />
        {rotulo}
      </p>
      <h2 id={id} className={`titulo-secao mt-5 ${claro ? 'text-ivory' : 'text-tinta'}`}>
        {titulo}
      </h2>
      {intro && (
        <p className={`mt-6 max-w-2xl text-lg ${centro ? 'mx-auto' : ''} ${claro ? 'text-ivory/80' : 'text-tinta-suave'}`}>{intro}</p>
      )}
      {selo && <div className={`mt-5 ${claro ? 'text-champagne/90' : 'text-ouro'}`}>{selo}</div>}
    </div>
  )
}

/* ---------- Botão de WhatsApp ---------- */

export function BotaoWhatsApp({
  mensagem,
  children = 'Agendar minha avaliação',
  variante = 'ouro',
  className = '',
  rotuloAcessivel,
}: {
  mensagem?: string
  children?: ReactNode
  variante?: 'ouro' | 'azul' | 'contorno-claro' | 'contorno-escuro'
  className?: string
  rotuloAcessivel?: string
}) {
  return (
    <a
      href={linkWhatsApp(mensagem)}
      target="_blank"
      rel="noopener noreferrer"
      className={`botao botao-${variante} ${className}`}
      aria-label={rotuloAcessivel}
    >
      <IconeWhatsApp tamanho={19} />
      <span>{children}</span>
      <IconeSeta tamanho={17} className="seta" />
    </a>
  )
}
