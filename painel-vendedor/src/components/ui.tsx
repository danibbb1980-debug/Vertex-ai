import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

export function Cabecalho({ titulo, sub, acao }: { titulo: string; sub?: ReactNode; acao?: ReactNode }) {
  return (
    <header className="flex items-end justify-between gap-3 pb-4 pt-5 lg:pt-8">
      <div className="min-w-0">
        <h1 className="text-[1.75rem] font-bold leading-tight tracking-[-0.015em] lg:text-[2rem]">{titulo}</h1>
        {sub && <p className="mt-0.5 text-[0.9375rem] text-tinta-2">{sub}</p>}
      </div>
      {acao && <div className="shrink-0">{acao}</div>}
    </header>
  )
}

/** Seção com título discreto e fio superior. */
export function Secao({ titulo, contagem, children, acao, id }: { titulo: string; contagem?: number; children: ReactNode; acao?: ReactNode; id?: string }) {
  return (
    <section aria-labelledby={id} className="mt-6 first:mt-0 lg:[.lg\:grid>&]:mt-0">
      <div className="flex items-baseline justify-between gap-3 border-b border-tinta pb-1.5">
        <h2 id={id} className="text-[1.0625rem] font-semibold">
          {titulo}
          {contagem !== undefined && <span className="num ml-2 font-normal text-tinta-2">{contagem}</span>}
        </h2>
        {acao}
      </div>
      {children}
    </section>
  )
}

export function Vazio({ children }: { children: ReactNode }) {
  return <p className="py-5 text-[0.9375rem] text-tinta-2">{children}</p>
}

export function Carregando() {
  return (
    <p className="py-8 text-tinta-2" role="status">
      Carregando…
    </p>
  )
}

export function Erro({ erro }: { erro: unknown }) {
  const m = (erro as { message?: string })?.message ?? 'Erro desconhecido.'
  return (
    <p role="alert" className="my-4 rounded-md bg-vermelho-fundo px-3 py-2.5 text-vermelho">
      Não foi possível carregar: {m}
    </p>
  )
}

export function Faixa({ tom = 'ambar', children }: { tom?: 'ambar' | 'verde' | 'vermelho' | 'neutro'; children: ReactNode }) {
  const cores = {
    ambar: 'bg-ambar-fundo text-ambar',
    verde: 'bg-verde-claro text-verde-escuro',
    vermelho: 'bg-vermelho-fundo text-vermelho',
    neutro: 'bg-superficie text-tinta-2 border border-fio',
  }[tom]
  return <div className={`rounded-md px-3 py-2.5 text-[0.9375rem] ${cores}`}>{children}</div>
}

/** Etiqueta de status: texto + cor (nunca só cor). */
export function Etiqueta({ tom = 'neutro', children }: { tom?: 'ambar' | 'verde' | 'vermelho' | 'neutro'; children: ReactNode }) {
  const cores = {
    ambar: 'bg-ambar-fundo text-ambar',
    verde: 'bg-verde-claro text-verde-escuro',
    vermelho: 'bg-vermelho-fundo text-vermelho',
    neutro: 'bg-papel text-tinta-2 ring-1 ring-inset ring-fio',
  }[tom]
  return <span className={`inline-block whitespace-nowrap rounded px-1.5 py-0.5 text-micro font-semibold ${cores}`}>{children}</span>
}

export function Campo({
  rotulo, children, ajuda, id, erro,
}: { rotulo: string; children: ReactNode; ajuda?: ReactNode; id: string; erro?: string | null }) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-[0.9375rem] font-medium">
        {rotulo}
      </label>
      {children}
      {ajuda && !erro && <p id={`${id}-ajuda`} className="text-micro text-tinta-2">{ajuda}</p>}
      {erro && <p id={`${id}-erro`} className="text-micro font-medium text-vermelho">{erro}</p>}
    </div>
  )
}

/** Grupo de opções com toque único (radio estilizado). */
export function Opcoes<T extends string>({
  nome, rotulo, valor, opcoes, onChange, disabled, colunas = 'auto',
}: {
  nome: string
  rotulo: string
  valor: T | null
  opcoes: { valor: T; rotulo: string }[]
  onChange: (v: T) => void
  disabled?: boolean
  colunas?: 'auto' | 2 | 3
}) {
  const grid = colunas === 'auto' ? 'flex flex-wrap' : colunas === 2 ? 'grid grid-cols-2' : 'grid grid-cols-3'
  return (
    <fieldset disabled={disabled} className="min-w-0">
      <legend className="mb-1 text-[0.9375rem] font-medium">{rotulo}</legend>
      <div className={`${grid} gap-1.5`}>
        {opcoes.map((o) => (
          <label
            key={o.valor}
            className={`relative flex min-h-11 items-center justify-center rounded-md border px-3 text-center text-[0.9375rem] font-medium has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-verde ${
              valor === o.valor ? 'border-verde bg-verde text-white' : 'border-fio-forte bg-superficie text-tinta'
            } ${disabled ? 'opacity-60' : ''}`}
          >
            <input
              type="radio"
              name={nome}
              value={o.valor}
              checked={valor === o.valor}
              onChange={() => onChange(o.valor)}
              className="sr-only"
            />
            {o.rotulo}
          </label>
        ))}
      </div>
    </fieldset>
  )
}

export function LinkLinha({ to, children, className = '' }: { to: string; children: ReactNode; className?: string }) {
  return (
    <Link to={to} className={`block border-b border-fio py-3 hover:bg-superficie ${className}`}>
      {children}
    </Link>
  )
}

/** Marcador de tentativas: dois traços (a regra); o terceiro aparece em âmbar. */
export function Tentativas({ feitas }: { feitas: number }) {
  const total = Math.max(2, feitas)
  return (
    <span className="inline-flex items-center gap-1.5" aria-label={`${feitas} ${feitas === 1 ? 'tentativa' : 'tentativas'} de 2`}>
      <span className="flex gap-[3px]" aria-hidden="true">
        {Array.from({ length: total }, (_, i) => (
          <span
            key={i}
            className={`h-[5px] w-3.5 rounded-full ${i >= 2 ? 'bg-ambar' : i < feitas ? 'bg-tinta' : 'bg-fio-forte/60'}`}
          />
        ))}
      </span>
      <span className={`num text-micro ${feitas >= 2 ? 'font-semibold text-ambar' : 'text-tinta-2'}`}>{feitas}/2</span>
    </span>
  )
}
