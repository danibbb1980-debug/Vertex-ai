import { NavLink, Navigate, useParams } from 'react-router-dom'
import { useAuth } from '../../auth/AuthProvider'
import { Cabecalho } from '../../components/ui'
import Contas from './Contas'
import Config from './Config'
import Exportar from './Exportar'
import Fila from './Fila'
import Auditoria from './Auditoria'
import Pagamentos from './Pagamentos'
import Repasses from './Repasses'

const abas = [
  { slug: 'fila', rotulo: 'Rascunhos', comp: Fila },
  { slug: 'vendas', rotulo: 'Vendas', comp: Pagamentos },
  { slug: 'repasses', rotulo: 'Comissões a repassar', comp: Repasses },
  { slug: 'contas', rotulo: 'Contas', comp: Contas },
  { slug: 'config', rotulo: 'Configurações', comp: Config },
  { slug: 'exportar', rotulo: 'Exportar', comp: Exportar },
  { slug: 'auditoria', rotulo: 'Auditoria', comp: Auditoria },
]

export default function Admin() {
  const { isAdmin } = useAuth()
  const { aba } = useParams()
  if (!isAdmin) return <Navigate to="/" replace />
  const atual = abas.find((a) => a.slug === aba)
  if (!atual) return <Navigate to="/admin/fila" replace />
  const Comp = atual.comp
  return (
    <>
      <Cabecalho titulo="Admin" />
      <nav aria-label="Seções do admin" className="-mx-4 overflow-x-auto border-b border-tinta px-4 lg:mx-0 lg:px-0">
        <ul className="flex gap-1">
          {abas.map((a) => (
            <li key={a.slug}>
              <NavLink
                to={`/admin/${a.slug}`}
                className={({ isActive }) => `-mb-px flex min-h-11 items-center whitespace-nowrap border-b-[3px] px-2 text-[0.9375rem] ${isActive ? 'border-verde font-semibold' : 'border-transparent text-tinta-2'}`}
              >
                {a.rotulo}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <Comp />
    </>
  )
}
