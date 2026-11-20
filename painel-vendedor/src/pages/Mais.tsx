import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthProvider'
import { temMaterial } from '../content'
import { Cabecalho } from '../components/ui'

export default function Mais() {
  const { isAdmin, perfil, sair } = useAuth()
  const itens = [
    { to: '/desempenho', rotulo: 'Meu desempenho', desc: 'Funil do período e motivos de perda' },
    ...(temMaterial ? [{ to: '/material', rotulo: 'Material', desc: 'Processo, script, objeções e roteiro' }] : []),
    ...(isAdmin ? [{ to: '/admin', rotulo: 'Admin', desc: 'Contas, rascunhos, pagamentos e exportação' }] : []),
  ]
  return (
    <>
      <Cabecalho titulo="Mais" sub={`${perfil?.nome ?? ''}, ${isAdmin ? 'admin' : 'vendedor'}`} />
      <ul className="border-t border-tinta">
        {itens.map((i) => (
          <li key={i.to}>
            <Link to={i.to} className="block border-b border-fio py-3.5 hover:bg-superficie">
              <span className="block text-[1.0625rem] font-semibold">{i.rotulo}</span>
              <span className="block text-[0.9375rem] text-tinta-2">{i.desc}</span>
            </Link>
          </li>
        ))}
      </ul>
      <button type="button" onClick={sair} className="botao-secundario mt-6">Sair</button>
    </>
  )
}
