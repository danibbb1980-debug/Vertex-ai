import { useAuth } from '../auth/AuthProvider'

export default function SemAcesso() {
  const { sair, session } = useAuth()
  return (
    <main className="mx-auto flex min-h-dvh max-w-sm flex-col justify-center px-4">
      <h1 className="text-[1.75rem] font-bold leading-tight">Conta sem acesso</h1>
      <p className="mt-2 text-tinta-2">
        A conta {session?.user.email} está desativada ou ainda não foi liberada. Peça ao Pedro para ativá-la.
      </p>
      <button type="button" onClick={sair} className="botao-secundario mt-6 self-start">Sair</button>
    </main>
  )
}
