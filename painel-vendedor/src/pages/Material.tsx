import { marked } from 'marked'
import { useMemo } from 'react'
import { Link, NavLink, useParams } from 'react-router-dom'
import { paginasMaterial } from '../content'
import { Cabecalho, Vazio } from '../components/ui'

export default function Material() {
  const { slug } = useParams()
  const pagina = slug ? paginasMaterial.find((p) => p.slug === slug) : undefined
  const html = useMemo(() => (pagina && !pagina.vazio ? (marked.parse(pagina.corpo, { async: false }) as string) : ''), [pagina])

  if (paginasMaterial.length === 0) return <Vazio>Sem material publicado.</Vazio>

  if (!slug) {
    return (
      <>
        <Cabecalho titulo="Material" sub="O pacote do vendedor." />
        <ol className="border-t border-tinta">
          {paginasMaterial.map((p, i) => (
            <li key={p.slug}>
              <Link to={`/material/${p.slug}`} className="flex items-baseline gap-3 border-b border-fio py-3.5 hover:bg-superficie">
                <span className="num w-5 text-tinta-2">{i + 1}</span>
                <span className="flex-1 text-[1.0625rem] font-semibold">{p.titulo}</span>
                {p.vazio && <span className="text-micro text-tinta-3">vazio</span>}
              </Link>
            </li>
          ))}
        </ol>
      </>
    )
  }

  if (!pagina) return <Vazio>Página não encontrada. <Link to="/material" className="font-semibold text-verde underline">Voltar</Link></Vazio>

  return (
    <div className="lg:grid lg:grid-cols-[12rem_1fr] lg:gap-10">
      <nav aria-label="Material" className="hidden lg:block lg:pt-8">
        <ol className="sticky top-6 flex flex-col gap-0.5 text-[0.9375rem]">
          {paginasMaterial.map((p) => (
            <li key={p.slug}>
              <NavLink to={`/material/${p.slug}`} className={({ isActive }) => `block rounded px-2 py-1.5 ${isActive ? 'bg-superficie font-semibold ring-1 ring-fio' : 'text-tinta-2 hover:text-tinta'}`}>
                {p.titulo}
              </NavLink>
            </li>
          ))}
        </ol>
      </nav>
      <article>
        <Link to="/material" className="botao-texto mt-3 !px-0 lg:hidden">Material</Link>
        <Cabecalho titulo={pagina.titulo} />
        {pagina.vazio ? (
          <p className="rounded-md border border-dashed border-fio-forte px-3 py-4 text-[0.9375rem] text-tinta-3">
            Conteúdo a ser adicionado pelo admin
          </p>
        ) : (
          <div className="material max-w-[68ch]" dangerouslySetInnerHTML={{ __html: html }} />
        )}
      </article>
    </div>
  )
}
