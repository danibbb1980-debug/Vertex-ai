import { NavLink, Outlet, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/AuthProvider'
import { useAlvo } from '../auth/Alvo'
import { temMaterial } from '../content'

const principais = [
  { to: '/', rotulo: 'Hoje', fim: true },
  { to: '/leads', rotulo: 'Leads' },
  { to: '/reunioes', rotulo: 'Reuniões' },
  { to: '/comissao', rotulo: 'Comissão' },
]

function BarraAdmin() {
  const { isAdmin } = useAuth()
  const { vendedores, vendedorId, setVendedorId, modoEdicao, setModoEdicao } = useAlvo()
  const { pathname } = useLocation()
  if (!isAdmin || pathname.startsWith('/admin')) return null
  return (
    <div className="border-b border-fio bg-superficie">
      <div className="mx-auto flex max-w-5xl items-center gap-2 px-4 py-2 lg:px-8">
        <label htmlFor="alvo" className="shrink-0 text-micro font-medium text-tinta-2">
          Painel de
        </label>
        <select
          id="alvo"
          className="campo !min-h-10 min-w-0 flex-1 !py-1.5 font-semibold sm:!w-auto sm:flex-none"
          value={vendedorId ?? ''}
          onChange={(e) => setVendedorId(e.target.value)}
        >
          {vendedores.length === 0 && <option value="">Nenhum vendedor</option>}
          {vendedores.map((v) => (
            <option key={v.user_id} value={v.user_id}>
              {v.nome}
              {v.ativo ? '' : ' (desativado)'}
            </option>
          ))}
        </select>
        <button
          type="button"
          aria-pressed={modoEdicao}
          onClick={() => setModoEdicao(!modoEdicao)}
          className={`botao !min-h-10 ml-auto shrink-0 !px-3 text-[0.9375rem] ${modoEdicao ? 'bg-ambar-fundo text-ambar ring-1 ring-ambar' : 'botao-secundario'}`}
        >
          {modoEdicao ? 'Concluir edição' : 'Editar'}
        </button>
      </div>
    </div>
  )
}

export default function Layout() {
  const { isAdmin, perfil, sair } = useAuth()
  const { podeEditar } = useAlvo()
  const { pathname } = useLocation()
  const mostrarFab = podeEditar && (pathname === '/' || pathname === '/leads')

  const secundarios = [
    { to: '/desempenho', rotulo: 'Meu desempenho' },
    ...(temMaterial ? [{ to: '/material', rotulo: 'Material' }] : []),
    ...(isAdmin ? [{ to: '/admin', rotulo: 'Admin' }] : []),
  ]

  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[13.5rem_1fr]">
      <a href="#conteudo" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded focus:bg-superficie focus:px-3 focus:py-2">
        Pular para o conteúdo
      </a>

      {/* Trilho lateral (desktop) */}
      <aside className="hidden border-r border-fio lg:sticky lg:top-0 lg:flex lg:h-dvh lg:flex-col lg:px-4 lg:py-6">
        <Link to="/" className="mb-8 px-2 text-[1.0625rem] font-bold tracking-[-0.01em]">
          Lumivo <span className="font-normal text-tinta-2">vendas</span>
        </Link>
        <nav aria-label="Principal" className="flex flex-col gap-0.5">
          {[...principais, ...secundarios].map((i) => (
            <NavLink
              key={i.to}
              to={i.to}
              end={'fim' in i}
              className={({ isActive }) =>
                `rounded-md px-2 py-2 text-[0.9375rem] ${isActive ? 'bg-superficie font-semibold text-tinta ring-1 ring-fio' : 'text-tinta-2 hover:text-tinta'}`
              }
            >
              {i.rotulo}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto border-t border-fio px-2 pt-4 text-micro text-tinta-2">
          <p className="font-medium text-tinta">{perfil?.nome}</p>
          <p>{isAdmin ? 'Admin' : 'Vendedor'}</p>
          <button type="button" onClick={sair} className="botao-texto mt-1 !px-0">
            Sair
          </button>
        </div>
      </aside>

      <div className="min-w-0">
        <BarraAdmin />
        <main id="conteudo" className="mx-auto max-w-5xl px-4 pb-[calc(9rem+env(safe-area-inset-bottom))] lg:px-8 lg:pb-16">
          <Outlet />
        </main>
      </div>

      {mostrarFab && (
        <Link
          to="/leads/novo"
          className="botao-primario fixed bottom-[calc(4.75rem+env(safe-area-inset-bottom))] right-4 z-30 !min-h-12 !rounded-full !px-5 text-base shadow-[0_2px_0_rgba(10,70,53,0.35)] lg:bottom-8 lg:right-8"
        >
          <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <path d="M8 2.5v11M2.5 8h11" />
          </svg>
          Novo lead
        </Link>
      )}

      {/* Navegação inferior (celular) */}
      <nav
        aria-label="Principal"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-fio bg-papel/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
      >
        <ul className="mx-auto grid max-w-lg grid-cols-5">
          {[...principais, { to: '/mais', rotulo: 'Mais' }].map((i) => (
            <li key={i.to}>
              <NavLink
                to={i.to}
                end={'fim' in i}
                className={({ isActive }) =>
                  `relative flex h-16 items-center justify-center text-[0.875rem] ${isActive || (i.to === '/mais' && secundarios.some((s) => pathname.startsWith(s.to))) ? 'font-bold text-tinta' : 'font-medium text-tinta-2'}`
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      aria-hidden="true"
                      className={`absolute inset-x-3 top-0 h-[3px] rounded-b ${isActive ? 'bg-verde' : 'bg-transparent'}`}
                    />
                    {i.rotulo}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
