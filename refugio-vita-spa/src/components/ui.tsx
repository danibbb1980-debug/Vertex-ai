import type { ReactNode } from 'react'
import { CONFIG } from '../config'

export const Pausa = ({ className = '' }: { className?: string }) => (
  <span className={`pausa ${className}`} aria-hidden="true">
    <i />
    <i />
  </span>
)

/** Número da seção com o símbolo de pausa que se desenha ao entrar na tela */
export const MarcaSecao = ({ n, texto }: { n: number; texto: string }) => (
  <p className="rotulo marca-secao observar">
    <Pausa />
    <span>
      {String(n).padStart(2, '0')} · {texto}
    </span>
  </p>
)

/** Título revelado por linha, com máscara. Cada item de `linhas` é uma linha. */
export const Titulo = ({
  linhas,
  as: Tag = 'h2',
  className = 'titulo-secao',
  id,
}: {
  linhas: ReactNode[]
  as?: 'h1' | 'h2' | 'h3'
  className?: string
  id?: string
}) => (
  <Tag className={`${className} revelar observar`} id={id}>
    {linhas.map((l, i) => (
      <span className="linha" key={i}>
        <span>{l}</span>
      </span>
    ))}
  </Tag>
)

export const Foto = ({
  arquivo,
  alt,
  largura,
  altura,
  sizes = '(min-width: 900px) 40vw, 90vw',
  className,
}: {
  arquivo: string
  alt: string
  largura: number
  altura: number
  sizes?: string
  className?: string
}) => (
  <img
    className={className}
    src={`/fotos/${arquivo}-960.webp`}
    srcSet={`/fotos/${arquivo}-480.webp 480w, /fotos/${arquivo}-960.webp 960w`}
    sizes={sizes}
    width={largura}
    height={altura}
    alt={alt}
    loading="lazy"
    decoding="async"
  />
)

export const LinkExterno = ({
  href,
  children,
  className,
  rotulo,
}: {
  href: string
  children: ReactNode
  className?: string
  rotulo?: string
}) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className={className} aria-label={rotulo}>
    {children}
  </a>
)
